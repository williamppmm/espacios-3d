"""Genera despiece-pino-cocina.xlsx y despiece-pino-cocina.html: todo el pino del cierre de la cocina (ventanal de tablillas
orientables, puerta plegable con sobreluz y cielo raso de machimbre), medido en obra el 21/11/2026.

Uso, desde la raíz del repositorio:

    python herramientas/build_pino_cocina.py

Fuente: assets/models/cortasol-pino-data.js (la misma que usan los visores del ventanal, de la puerta y la terraza).
Es un libro independiente: no entra en compras-proyecto.xlsx ni en los despieces de los muebles.
- Pino macizo de 40 mm: plan de corte en piezas de 4 m (refilando 5 mm por punta y disco de 4 mm).
- Pino alistonado de 18 mm: encaje de referencia en tableros de 2440 × 1220.
- Machimbre de 10 mm: por metro cuadrado.
"""
import html, json, math
from pathlib import Path
import openpyxl
from openpyxl.styles import Alignment, Font, PatternFill
from build_despiece import page, tabla, fmt

RAIZ = Path(__file__).resolve().parent.parent
FECHA = "21/11/2026"
LISTON = dict(L=4000, refilado=5, disco=4)      # pino macizo de 40 mm en piezas de 4 m
TABLERO = dict(L=2440, A=1220, e=18)            # pino alistonado de 18 mm; confirmar formato en el depósito
SIERRA = 3
DENSIDAD = 500
LACA = dict(**{"4L": 249900, "750": 74900}, url4="https://www.homecenter.com.co/homecenter-co/product/256080/laca-para-metal-y-madera-interior-exterior-purcat-incoloro-mate-monto-4-l/256080/")
RENDIMIENTO, MANOS = 10, 3                      # m² por litro y mano (estimado); una rebajada y dos normales
MACH_REPOSICION, MACH_TABLA = 0.10, 3000        # 10 % de desperdicio; tablas de 3 m

t = (RAIZ / "assets" / "models" / "cortasol-pino-data.js").read_text(encoding="utf-8")
D = json.loads(t[t.index("{"): t.rindex("}") + 1])
MAT = {"macizo": "Pino macizo 40 mm", "tablero": "Pino alistonado 18 mm", "aluminio": "Platina de aluminio 1 × 1/8 pulg"}


def cortes_liston(piezas):
    """Primero el más largo (first fit decreasing) en piezas de LISTON['L']. piezas: lista de (id, largo)."""
    util = LISTON["L"] - 2 * LISTON["refilado"]
    barras = []
    for pid, L in sorted(piezas, key=lambda p: -p[1]):
        assert L <= util, f"{pid} de {L} no cabe en una pieza de {LISTON['L']}"
        for b in barras:
            if b["usado"] + LISTON["disco"] + L <= util:
                b["items"].append((pid, L)); b["usado"] += LISTON["disco"] + L; break
        else:
            barras.append(dict(items=[(pid, L)], usado=L))
    return barras


def encaje(piezas, refilado):
    """Tiras al hilo y cortes a lo largo de cada tira. piezas: (id, largo, ancho)."""
    util_L, util_A = TABLERO["L"] - 2 * refilado, TABLERO["A"]
    tiras = []
    for pid, L, A in sorted(piezas, key=lambda p: (-p[2], -p[1])):
        for s in sorted((s for s in tiras if s["A"] >= A), key=lambda s: s["A"]):
            if s["usado"] + SIERRA + L <= util_L:
                s["items"].append((pid, L)); s["usado"] += SIERRA + L; break
        else:
            tiras.append(dict(A=A, items=[(pid, L)], usado=L))
    tableros = []
    for s in sorted(tiras, key=lambda s: -s["A"]):
        for b in tableros:
            if b["usado"] + SIERRA + s["A"] <= util_A:
                b["tiras"].append(s); b["usado"] += SIERRA + s["A"]; break
        else:
            tableros.append(dict(tiras=[s], usado=s["A"]))
    return tableros


def ocup(b):
    return sum(L * s["A"] for s in b["tiras"] for _, L in s["items"]) / (TABLERO["L"] * TABLERO["A"])


def main():
    parts = D["parts"]
    lama, F, M, an, P_, C, O = D["lama"], D["marco"], D["mecanismo"], D["angulo"], D["puerta"], D["cielo"], D["obra"]
    B, PS, PN, AK = M["barra"], M["pasador"], M["pines"], M["anclajes"]
    paso = F["luz"] / lama["por_cuerpo"]
    madera = [p for p in parts if p["material"] in ("macizo", "tablero")]
    macizo = [p for p in parts if p["material"] == "macizo"]
    tablero = [p for p in parts if p["material"] == "tablero"]
    secciones = sorted({(p["t"], p["A"]) for p in macizo}, key=lambda s: -s[1])

    # Pino macizo: plan de corte por sección.
    plan, pedido_macizo = [], []
    for e, a in secciones:
        barras = cortes_liston([(p["id"], p["L"]) for p in macizo if (p["t"], p["A"]) == (e, a) for _ in range(p["qty"])])
        pedido_macizo.append((e, a, len(barras)))
        for i, b in enumerate(barras, 1):
            plan.append([f"{e} × {a}", i, " + ".join(f"{pid} {fmt(L)}" for pid, L in b["items"]),
                         LISTON["L"] - 2 * LISTON["refilado"] - b["usado"]])
    # Tableros alistonados.
    lista = [(p["id"], p["L"], p["A"]) for p in tablero for _ in range(p["qty"])]
    refil = encaje(lista, 5)
    t_refil = [[i, round(ocup(b), 3), " · ".join(f'tira {fmt(s["A"])}: ' + " + ".join(f"{pid} {fmt(L)}" for pid, L in s["items"]) for s in b["tiras"])]
               for i, b in enumerate(refil, 1)]
    # Machimbre.
    m2 = C["machimbre"]["m2"]
    m2_compra = round(m2 * (1 + MACH_REPOSICION), 1)
    tablas = math.ceil(m2_compra * 1e6 / (C["machimbre"]["util"] * MACH_TABLA))

    vol = lambda p: p["qty"] * p["L"] * p["A"] * p["t"] / 1e9
    peso = {g: sum(vol(p) for p in madera if p["grupo"] == g) * DENSIDAD for g in ("Ventanal", "Puerta", "Cielo raso")}
    peso_mach = m2 * 0.010 * DENSIDAD
    area = sum(p["qty"] * 2 * (p["L"] * p["A"] + p["L"] * p["t"] + p["A"] * p["t"]) for p in madera) / 1e6 + 2 * m2
    litros = area * MANOS / RENDIMIENTO
    latas = math.ceil(litros / 4)
    aire = lambda a: (paso * math.sin(math.radians(a)) - lama["t"]) / paso
    R = M["manivela"]
    corre = R * (math.cos(math.radians(an["min"])) - math.cos(math.radians(an["max"])))
    uniones = 2 * (F["cuerpos"] + 1)                      # laterales y montante, arriba y abajo
    vig = C["vigueta"]
    chazos_carrera = math.ceil(C["carrera"]["L"] / 500) + 1

    despiece = [[p["id"], p["grupo"], p["name"], MAT[p["material"]], p["qty"], p["L"], p["A"], p["t"],
                 round(p["qty"] * p["L"] * p["A"] / 1e6, 3), p["note"]] for p in parts]
    despiece.append(["M01", "Cielo raso", "Machimbre de pino", "Machimbre de pino 10 mm", m2_compra, C["machimbre"]["z"], C["machimbre"]["x"],
                     C["machimbre"]["e"], m2, f"{fmt(m2)} m² netos ({fmt(C['machimbre']['x'])} × {fmt(C['machimbre']['z'])}) + {MACH_REPOSICION:.0%} de desperdicio. "
                     "Clavado por debajo de las viguetas, a lo largo del ventanal, con las juntas sobre las viguetas y alternadas."])

    cotiz = "cotizar"
    compras = [
        *[["Pino macizo", f"Pino cepillado de {e} × {a} mm (4 × {a // 10}) · pieza de {LISTON['L'] // 1000} m", n, "pieza", cotiz,
           f"Ver hoja «Pino macizo»: plan de corte refilando {LISTON['refilado']} mm por punta y disco de {LISTON['disco']} mm. Rectas, secas, sin nudos sueltos."]
          for e, a, n in pedido_macizo],
        ["Pino alistonado", f"Tablero alistonado de pino {TABLERO['e']} mm · {TABLERO['L']} × {TABLERO['A']} (referencia)", len(refil), "tablero", cotiz,
         "Tablillas del ventanal, pestañas, tacos, hojas de la puerta y sobreluz. Ver hoja «Tableros». Del mismo lote que el macizo si es posible."],
        ["Machimbre", "Machimbre de pino de 10 mm", m2_compra, "m²", cotiz,
         f"Unas {tablas} tablas de 3 m si el ancho útil es de {C['machimbre']['util']} mm. Comprar inmunizado o inmunizarlo con el resto."],
        ["Pino", "Corte en taller (sierra fina)", 1, "servicio", cotiz, f"{sum(p['qty'] for p in madera)} piezas. Veta siempre a lo largo."],
        ["Acabado", "Inmunizante para madera, uso interior", 1, "galón", cotiz, "Antes de lijar y barnizar, sobre todas las piezas y el machimbre, si no vienen inmunizados. Dejar secar lo que indique la etiqueta."],
        ["Acabado", "Montó Laca Pur+Cat incoloro mate · 4 L (Homecenter 256080)", latas, "u", LACA["4L"],
         f"Tono miel. Unos {fmt(round(litros, 1))} L para {fmt(round(area, 1))} m² en {MANOS} manos (la primera rebajada como sellador). {LACA['url4']}"],
        ["Acabado", "Diluyente que indique la etiqueta de la laca", 2, "L", cotiz, "Primera mano y limpieza."],
        ["Acabado", "Lija 220 y 320", 12, "pliego", cotiz, "220 antes de la primera mano; 320 entre manos."],
        ["Acabado", "Mascarilla para vapores orgánicos y guantes de nitrilo", 1, "juego", cotiz, "La laca catalizada es inflamable: aplicar ventilado."],
        ["Armado", "Pegante para madera tipo Colbón", 2, "kg", cotiz, "Uniones del marco, poste de dos piezas, tacos y sobreluz."],
        ["Armado", "Tarugo de madera de 10 × 60 mm", 2 * uniones + 4, "u", cotiz, f"Dos por unión del ventanal ({uniones} uniones), pegados."],
        ["Armado", "Tornillo para madera 5 × 100", 2 * uniones + 4 * vig["n"] + 8, "u", cotiz,
         f"Dos por unión del ventanal desde la cara exterior del riel; dos por punta de vigueta, inclinados, a la carrera y al riel."],
        ["Armado", "Tornillo para madera 5 × 120", AK["poste"]["n"] + 2, "u", cotiz, AK["poste"]["nota"]],
        ["Armado", "Tornillo para madera 5 × 70", 22, "u", cotiz, "Unir las dos piezas de cada paral (cada 40 cm, alternados) y las escuadras al piso."],
        ["Armado", "Escuadra metálica de 40 × 40 mm", 2 * vig["n"] + 2, "u", cotiz, "Opcional: una por punta de vigueta, si no se usa tornillo inclinado; dos para el pie de cada paral."],
        ["Armado", "Puntilla sin cabeza de 1 1/2 pulg o grapas para machimbre", 1, "caja", cotiz, "Machimbre a las viguetas y tablillas de la sobreluz a sus listones."],
        ["Fijación a la obra", AK["antepecho"]["tornillo"].capitalize() + " · antepecho", AK["antepecho"]["n"] + 2, "u", cotiz, AK["antepecho"]["nota"]],
        ["Fijación a la obra", AK["medianera"]["tornillo"].capitalize() + " · medianera", AK["medianera"]["n"] + 3 + 1, "u", cotiz,
         "Lateral izquierdo del ventanal (3) y vigueta junto a la medianera (3)."],
        ["Fijación a la obra", "Chazo expansivo de 3/8 × 3 pulg con tornillo", chazos_carrera, "u", cotiz, "Carrera del cielo raso al muro de la habitación, cada 50 cm."],
        ["Fijación a la obra", "Tornillo 5 × 100 con chazo plástico de 8 mm · paral", 4, "u", cotiz, "Paral de la puerta al muro de la habitación."],
        ["Fijación a la obra", "Sellador elastomérico o silicona neutra", 2, "tubo", cotiz, "Entre el riel inferior y el ladrillo, y en las juntas con la medianera y el muro."],
        ["Fijación a la obra", "Tapones de pino de 10 mm", AK["antepecho"]["n"] + AK["medianera"]["n"] + 2 * uniones + AK["poste"]["n"] + 6, "u", cotiz, "Tapan los tornillos a la vista."],
        ["Fijación a la obra", "Calzas plásticas de nivelación", 1, "paquete", cotiz, "Antepecho y calce de 4 mm bajo las viguetas."],
        ["Mecanismo", f"Pines {PN['modelo']} · paquete de 80", 1, "paquete", cotiz, f"Amazon. {2 * lama['n']} pines + {80 - 2 * lama['n']} de repuesto. Medir antes de perforar."],
        ["Mecanismo", "Platina de aluminio 1 × 1/8 pulg (25,4 × 3,2 mm) · barra de 6 m", 1, "barra", cotiz,
         f"Dos barras de {B['L']} mm, una por cuerpo, con {lama['por_cuerpo']} agujeros de {B['agujero']} mm a paso {fmt(round(paso, 1))}."],
        ["Mecanismo", "Varilla lisa de acero inoxidable 304 de 1/4 pulg · 1 m", 1, "u", 15000, f"{lama['n']} pasadores de {PS['L']} mm. Referencia Merkatronix."],
        ["Mecanismo", "Arandela plana de nylon de 1/4 pulg", lama["n"] + 10, "u", cotiz, "Una por pasador: la barra se apoya en ellas."],
        ["Mecanismo", "Epóxico", 1, "u", cotiz, "Pasadores en las tablillas."],
        ["Puerta", "Sistema plegable para 4 hojas de 36 mm (riel, carros, pivotes, topes)", 1, "kit", cotiz,
         f"Vano entre jamba y poste de {fmt(P_['vano'])} mm. Confirmar que admita hojas de 36 mm y unos {fmt(round(peso['Puerta'] * 0.85 / P_['hojas']['n'], 1))} kg por hoja."],
        ["Puerta", "Bisagras entre hojas", 9, "u", cotiz, "Tres por cada una de las tres uniones, si el kit no las trae."],
        ["Puerta", "Cerradura de gancho y manija de bajo perfil", 1, "juego", cotiz, "La manija debe quedar libre al plegar."],
    ]
    total = sum(r[2] * r[4] for r in compras if isinstance(r[4], (int, float)))
    resumen = [
        ["Medidas de obra", None, f"Ventanal {fmt(D['vano']['L'])} × {fmt(D['vano']['H'])} sobre antepecho de ladrillo de 10 cm a +{fmt(O['antepecho']['alto'])}; "
                                  f"puerta {fmt(P_['ancho'])} × {fmt(P_['alto'])}; cielo raso a +{fmt(C['nivel'])}"],
        ["Ventanal", lama["n"], f"tablillas de {lama['A']} × {lama['t']} × {fmt(next(p['L'] for p in parts if p['id'] == 'T01'))} en dos cuerpos de {lama['por_cuerpo']}, "
                                f"paso {fmt(round(paso, 1))}, orientables de {an['min']}° a {an['max']}°; marco macizo de {F['t']} × {F['A']} con montante central"],
        ["Puerta", P_["hojas"]["n"], f"hojas de {P_['hojas']['A']} × {P_['hojas']['h']} × {P_['hojas']['t']}; dintel a {fmt(P_['alto'])} y sobreluz de "
                                     f"{P_['sobreluz']['tablilla']['n']} tablillas hasta el cielo raso"],
        ["Cielo raso", vig["n"], f"viguetas de 40 × 100 a unos {vig['sep']:.0f} mm, carrera contra el muro y {fmt(m2)} m² de machimbre"],
        *[[f"Pino macizo {e} × {a}", n, f"piezas de {LISTON['L'] // 1000} m (ver plan de corte)"] for e, a, n in pedido_macizo],
        ["Tableros alistonados 18 mm", len(refil), f"de {TABLERO['L']} × {TABLERO['A']} (referencia), refilando 5 mm por punta"],
        ["Machimbre", m2_compra, f"m² con {MACH_REPOSICION:.0%} de desperdicio (unas {tablas} tablas de 3 m)"],
        ["Peso de la madera", round(sum(peso.values()) + peso_mach), f"kg: ventanal {peso['Ventanal']:.0f}, puerta {peso['Puerta']:.0f}, estructura del cielo {peso['Cielo raso']:.0f} y machimbre {peso_mach:.0f}"],
        ["Flecha del riel superior", C["carga"]["flecha_con"], f"mm con el montante central (sin él serían unos {C['carga']['flecha_sin']:.0f} mm), con unos {C['carga']['kg']} kg de cielo raso"],
        ["Paso de aire del ventanal", round(aire(an["min"]) * 100), f"% a {an['min']}° y {an['max']}°; {aire(90) * 100:.0f} % a 90°. La sobreluz de la puerta suma paso permanente"],
        ["Recorrido de cada barra", round(corre, 1), f"mm a lo largo, dentro del canal de {M['canal']['z1'] - M['canal']['z0']} × {M['canal']['prof']}"],
        ["Superficie a barnizar", round(area, 1), f"m², todas las caras; unos {fmt(round(litros, 1))} L de laca ({latas} latas de 4 L)"],
        ["Total con precio de referencia", total, "Laca y varilla; el resto por cotizar"],
    ]
    pendientes = [
        ["Medida real del pino", "Medir el 4 × 14 y el 4 × 10 que entregue el depósito. Si llegan cepillados más delgados (p. ej. 38 × 135), avisar antes de cortar: cambian tablillas, barras y el vuelo sobre las pestañas.", "Antes de cortar"],
        ["Largo de las piezas", f"El plan usa piezas de {LISTON['L'] // 1000} m. Los rieles del ventanal ({fmt(D['vano']['L'])}) y los parales ({fmt(C['nivel'])}) no salen de 3 m.", "Al comprar"],
        ["Espacio sobre el cielo raso", "Confirmar que haya al menos 11 cm libres entre +2560 y el techo para las viguetas de 100 mm.", "Antes de comprar"],
        ["Muro de la habitación", "Confirmar de qué es (ladrillo, concreto) para elegir los chazos de la carrera y del paral.", "Antes de instalar"],
        ["Vano real", "Medir ancho y alto del ventanal y de la puerta en tres puntos; revisar plomo del muro de la habitación y nivel del antepecho.", "Antes de cortar"],
        ["Sistema plegable", "Elegir el kit para hojas de 36 mm y ajustar el alto de las hojas a su plantilla (hoy 60 mm para riel y carros y 10 mm bajo la hoja).", "Antes de cortar las hojas"],
        ["Pines", "Comprar el paquete uxcell y medir cuerpo, punta y pestaña antes de perforar.", "Antes de perforar"],
        ["Un solo lote e inmunizado", "Comprar todo junto; inmunizar antes de lijar y barnizar, y dejar secar.", "Al comprar"],
        ["Prueba", "Probar 3 o 4 tablillas en un trozo de riel: giro, roce y clic de los pines.", "Antes de cortar todo"],
        ["Ventilación", f"El gasista valida el {aire(an['min']) * 100:.0f} % de paso del ventanal más la sobreluz.", "Antes de instalar"],
    ]

    wb = openpyxl.Workbook()
    bold, head = Font(bold=True), PatternFill("solid", fgColor="E7EEE7")
    def hoja(nombre, titulo, notas, hdr, rows, anchos):
        ws = wb.create_sheet(nombre)
        ws["A2"] = titulo; ws["A2"].font = Font(bold=True, size=14)
        for i, nt in enumerate(notas[:2], 3): ws.cell(i, 1, nt).font = Font(italic=True)
        for j, h in enumerate(hdr, 1):
            c = ws.cell(6, j, h); c.font = bold; c.fill = head; c.alignment = Alignment(wrap_text=True, vertical="top")
        for i, r in enumerate(rows, 7):
            for j, v in enumerate(r, 1): ws.cell(i, j, v).alignment = Alignment(wrap_text=True, vertical="top")
        for j, w in enumerate(anchos, 1): ws.column_dimensions[openpyxl.utils.get_column_letter(j)].width = w
        ws.freeze_panes = "A7"
        return ws
    wb.remove(wb.active)
    H_DESP = ["ID", "Grupo", "Pieza", "Material", "Cant.", "Largo", "Ancho", "Esp.", "Área m²", "Observaciones"]
    H_PLAN = ["Sección", "Pieza de 4 m", "Cortes", "Sobrante mm"]
    H_TAB = ["Tablero", "Ocupación", "Tiras y piezas"]
    ws = hoja("Resumen", "Pino de la cocina · ventanal, puerta y cielo raso",
              [f"Medido en obra y revisado {FECHA}. Independiente de cocina, clóset y baño: no suma en compras-proyecto.xlsx.",
               "Visores: propuesta-4-tablillas-pino.html (ventanal) y puerta-plegable.html (puerta y cielo raso). Medidas terminadas en mm."],
              ["Concepto", "Valor", "Nota"], resumen, [30, 14, 100])
    hoja("Despiece", "Despiece · medidas terminadas", ["Veta a lo largo de cada pieza. Sin canto: los bordes se lijan y barnizan."],
         H_DESP, despiece, [7, 12, 34, 22, 6, 8, 8, 6, 9, 80])
    hoja("Pino macizo", f"Plan de corte en piezas de {LISTON['L']} mm",
         [f"Refilando {LISTON['refilado']} mm por punta y disco de {LISTON['disco']} mm. El sobrante sirve para pruebas y tacos."],
         H_PLAN, plan, [12, 12, 80, 12])
    hoja("Tableros", f"Encaje de referencia en tableros {TABLERO['L']} × {TABLERO['A']} × {TABLERO['e']}",
         [f"Refilando 5 mm por punta y sierra de {SIERRA} mm. Tiras al hilo; una pieza angosta puede salir de una tira más ancha.",
          "Es una referencia para cotizar: el formato real puede cambiar el número de tableros."], H_TAB, t_refil, [9, 11, 120])
    ws_k = hoja("Compras", "Compras · independiente del proyecto", ["«cotizar» = sin precio; no equivale a cero."],
                ["Grupo", "Ítem", "Cant.", "Unidad", "Precio unitario (COP)", "Subtotal (COP)", "Nota"], [], [16, 50, 7, 10, 14, 14, 80])
    for i, r in enumerate(compras, 7):
        for j, v in enumerate([*r[:5], None, r[5]], 1): ws_k.cell(i, j, v).alignment = Alignment(wrap_text=True, vertical="top")
        ws_k.cell(i, 6, f'=IF(AND(ISNUMBER(C{i}),ISNUMBER(E{i})),C{i}*E{i},"Por cotizar")')
        for c in (5, 6): ws_k.cell(i, c).number_format = '"$"#,##0'
    tot = 7 + len(compras)
    ws_k.cell(tot, 2, "Total con precio de referencia").font = bold
    ws_k.cell(tot, 6, f"=SUM(F7:F{tot - 1})").number_format = '"$"#,##0'; ws_k.cell(tot, 6).font = bold
    ws[f"B{6 + len(resumen)}"] = f"=Compras!F{tot}"; ws[f"B{6 + len(resumen)}"].number_format = '"$"#,##0'
    hoja("Pendientes", "Pendientes", [], ["Tema", "Qué falta", "Cuándo"], pendientes, [24, 100, 22])
    wb.calculation.fullCalcOnLoad = True
    wb.save(RAIZ / "despiece-pino-cocina.xlsx")

    secs = [("resumen", "Resumen", tabla(resumen, ["Concepto", "Valor", "Nota"], num_cols=(1,), wrap_cols=(2,))),
            ("despiece", "Despiece", tabla(despiece, H_DESP, num_cols=(4, 5, 6, 7, 8), wrap_cols=(9,))),
            ("macizo", "Pino macizo · plan de corte", tabla(plan, H_PLAN, num_cols=(1, 3), wrap_cols=(2,))),
            ("tableros", "Tableros alistonados", tabla(t_refil, H_TAB, num_cols=(1,), wrap_cols=(2,))),
            ("compras", "Compras", tabla([[*r[:5], r[2] * r[4] if isinstance(r[4], (int, float)) else "Por cotizar", r[5]] for r in compras]
                                          + [[None, "Total con precio de referencia", None, None, None, total, None]],
                                          ["Grupo", "Ítem", "Cant.", "Unidad", "Precio unitario", "Subtotal", "Nota"], num_cols=(2,), cop_cols=(4, 5), wrap_cols=(6,), tot_pred=lambda r: r[0] is None)),
            ("pendientes", "Pendientes", tabla(pendientes, ["Tema", "Qué falta", "Cuándo"], wrap_cols=(1,)))]
    body = [f'<p><a href="ventana.html">← Ventana de cocina</a> · <a href="propuesta-4-tablillas-pino.html">Ventanal 3D</a> · '
            f'<a href="puerta-plegable.html">Puerta y cielo raso 3D</a> · <a href="despiece-pino-cocina.xlsx" download>Descargar Excel</a></p>',
            '<span class="tag">Pino de la cocina · independiente de los muebles</span><h1>Despiece y compras</h1>',
            '<nav class="tabs">' + "".join(f'<a href="#{a}">{t}</a>' for a, t, _ in secs) + '</nav>',
            f'<p class="note">Medido en obra el {FECHA}. Pino macizo de 40 mm en piezas de 4 m, pino alistonado de 18 mm y machimbre de 10 mm, '
            'del mismo lote, inmunizado y barnizado en la misma tanda. No suma en compras-proyecto.</p>']
    for a, t, h in secs: body.append(f'<h2 id="{a}">{html.escape(t)}</h2>{h}')
    (RAIZ / "despiece-pino-cocina.html").write_text(page("Pino de la cocina · despiece", "".join(body)), encoding="utf-8")
    print("OK:", ", ".join(f"{e}×{a}: {n} piezas de 4 m" for e, a, n in pedido_macizo),
          f"| tableros {len(refil)} {[round(ocup(b), 2) for b in refil]} | machimbre {m2_compra} m² | área {area:.1f} m², laca {litros:.1f} L | "
          f"madera {sum(peso.values()) + peso_mach:.0f} kg")


if __name__ == "__main__":
    main()
