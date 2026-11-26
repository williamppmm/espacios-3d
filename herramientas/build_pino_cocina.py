"""Genera despiece-pino-cocina.xlsx y despiece-pino-cocina.html: todo el pino del cierre de la cocina (ventanal de tablillas
orientables, puerta plegable con sobreluz y cielo raso de panel de yeso), medido en obra el 21/11/2026.

Uso, desde la raíz del repositorio:

    python herramientas/build_pino_cocina.py

Fuente: assets/models/cortasol-pino-data.js (la misma que usan los visores del ventanal, de la puerta y la terraza).
Es un libro independiente: no entra en compras-proyecto.xlsx ni en los despieces de los muebles.
- Pino macizo de 40 mm: plan de corte en piezas de 3020 mm (refilando 5 mm por punta y disco de 4 mm).
- Pino alistonado de 18 mm: encaje de referencia en tableros de 2440 × 1220.
- Panel de yeso y perfilería: referencias para cotizar; dimensionamiento pendiente de validar.
"""
import html, json, math, subprocess, tempfile
from pathlib import Path
from build_despiece import page, tabla, fmt

RAIZ = Path(__file__).resolve().parent.parent
FECHA = "25/11/2026"
LISTON = dict(L=3020, refilado=5, disco=4)      # pino macizo de 40 mm en piezas de 3020 mm
TABLERO = dict(L=2440, A=1220, e=18)            # pino alistonado de 18 mm; confirmar formato en el depósito
SIERRA = 3
DENSIDAD = 500
LACA = dict(**{"4L": 249900, "750": 74900}, url4="https://www.homecenter.com.co/homecenter-co/product/256080/laca-para-metal-y-madera-interior-exterior-purcat-incoloro-mate-monto-4-l/256080/")
RENDIMIENTO, MANOS = 10, 3                      # m² por litro y mano (estimado); una rebajada y dos normales
MACH_REPOSICION = 0.10                         # Reserva de área de placa para cotización

t = (RAIZ / "assets" / "models" / "cortasol-pino-data.js").read_text(encoding="utf-8")
D = json.loads(t[t.index("{"): t.rindex("}") + 1])
MAT = {"macizo": "Pino macizo 40 mm", "tablero": "Pino alistonado 18 mm", "tabla15": "Tabla de pino cepillada 15 mm", "retal": "Retal de pino (ajuste en taller)", "aluminio": "Platina de aluminio 1 × 1/8 pulg"}


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
    madera = [p for p in parts if p["material"] in ("macizo", "tablero", "tabla15", "retal")]
    macizo = [p for p in parts if p["material"] == "macizo" and p["grupo"] != "Ventanal"]
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
    m2 = C["panel"]["m2"]
    m2_compra = round(m2 * (1 + MACH_REPOSICION), 1)
    placas = math.ceil(m2_compra / (1.22 * 2.44))

    vol = lambda p: p["qty"] * p["L"] * p["A"] * p["t"] / 1e9
    peso = {g: sum(vol(p) for p in madera if p["grupo"] == g) * DENSIDAD for g in ("Ventanal", "Puerta", "Cielo raso")}
    peso_mach = 0  # El peso de la placa y perfilería se verifica con el sistema elegido.
    area = sum(p["qty"] * 2 * (p["L"] * p["A"] + p["L"] * p["t"] + p["A"] * p["t"]) for p in madera) / 1e6
    litros = area * MANOS / RENDIMIENTO
    latas = math.ceil(litros / 4)
    aire = lambda a: (paso * math.sin(math.radians(a)) - lama["t"]) / paso
    R = M["manivela"]
    corre = R * (math.cos(math.radians(an["min"])) - math.cos(math.radians(an["max"])))
    uniones = 2 * (F["cuerpos"] + 1)                      # laterales y montante, arriba y abajo
    vig = C["vigueta"]


    despiece = [[p["id"], p["grupo"], p["name"], MAT[p["material"]], p["qty"], p["L"], p["A"], p["t"],
                 round(p["qty"] * p["L"] * p["A"] / 1e6, 3), p["note"]] for p in parts]
    despiece.append(["Y01", "Cielo raso", "Placa de yeso blanca", "Panel de yeso", placas, 2440, 1220,
                     C["panel"]["e"], m2, "Área neta más 10 % para estimación. Confirmar tipo de placa, formato, juntas y merma con el instalador."])

    local = json.loads((RAIZ / "herramientas/ventana_pino_corte.json").read_text(encoding="utf-8"))
    cotiz = "cotizar"
    compras = [
        ["Ventanal local", "Bastidor 100 × 40 · largo 3000–3020", 4, "pieza", cotiz, "Dos enteros con ≥3010 útiles; otro para dos costados de 1280 y otro para montante de 1200. Calces y topes desde retales. Ver pedido individual."],
        ["Ventanal local", "Tabla 3000–3020 × 220 × 20 · cepillar a 15", 9, "tabla", cotiz, "32 tablillas (30 + 2), cuatro carteras y dos solapas. No sumar estas piezas al encaje alistonado de la puerta."],
        *[["Pino macizo", f"Pino cepillado de {e} × {a} mm (4 × {a // 10}) · pieza de {LISTON['L']} mm", n, "pieza", cotiz,
           f"Ver hoja «Pino macizo»: plan de corte refilando {LISTON['refilado']} mm por punta y disco de {LISTON['disco']} mm. Rectas, secas, sin nudos sueltos."]
          for e, a, n in pedido_macizo],
        ["Pino alistonado", f"Tablero alistonado de pino {TABLERO['e']} mm · {TABLERO['L']} × {TABLERO['A']} (referencia)", len(refil), "tablero", cotiz,
         "Solo hojas de la puerta y sobreluz; ventanal desde nueve tablas independientes. Ver hoja «Tableros». Del mismo lote que el macizo si es posible."],
        ["Cielo raso", "Placa de yeso de 12,7 mm · referencia 1220 × 2440", placas, "placa", cotiz,
         "Ambientación de referencia. Confirmar placa adecuada al ambiente y plan de juntas antes de comprar."],
        ["Cielo raso", "Omegas, viguetas y ángulos galvanizados", 1, "sistema", cotiz,
         "En el 3D: omegas de 19 mm, viguetas de 38 mm y ángulos de 30 mm. Calibre, separación, cuelgues y anclajes por dimensionar."],
        ["Cielo raso", "Tornillos para placa y perfilería, cinta, masilla y pintura blanca", 1, "lote", cotiz,
         "Cantidades y compatibilidad según el sistema elegido; incluir juntas perimetrales con la madera."],
        ["Pino", "Corte en taller (sierra fina)", 1, "servicio", cotiz, f"{sum(p['qty'] for p in madera)} piezas. Veta siempre a lo largo."],
        ["Acabado", "Inmunizante Texsa 1 galón (Homecenter 92215)", 1, "galón", 121900, "Antes de lijar y barnizar, sobre todas las piezas  si no vienen inmunizados. Dejar secar lo que indique la etiqueta."],
        ["Acabado", "Montó Laca Pur+Cat incoloro mate · 4 L (Homecenter 256080)", latas, "u", LACA["4L"],
         f"Tono miel. Unos {fmt(round(litros, 1))} L para {fmt(round(area, 1))} m² en {MANOS} manos (la primera rebajada como sellador). {LACA['url4']}"],
        ["Acabado", "Diluyente que indique la etiqueta de la laca", 2, "L", cotiz, "Primera mano y limpieza."],
        ["Acabado", "Lija 150, 220 y 320", 16, "pliego", cotiz, "4 de 150, 6 de 220 y 6 de 320. 320 entre manos."],
        ["Acabado", "Mascarilla para vapores orgánicos y guantes de nitrilo", 1, "juego", cotiz, "La laca catalizada es inflamable: aplicar ventilado."],
        ["Armado", "Pegante Carpincol para madera 1 kg (Homecenter 203374)", 1, "u", 32900, "Ventanal. Alternativa con más resistencia a la humedad: Carpincol MR60 1 kg. Madera limpia y sin barniz; ver guía de armado del ventanal."],
        ["Armado puerta", "Adhesivo para madera compatible con humedad y exterior protegido", 1, "kg", cotiz, "Estimación para parales, hojas y sobreluz; ajustar consumo al fabricante."],
        ["Armado", "Tarugo de madera de 8 × 50 mm · paquete × 100 (Mercado Libre)", 1, "paquete", cotiz, f"Dos por unión del ventanal ({uniones} uniones), pegados."],
        ["Armado", "Tornillo Deck Ruspert 10 × 3½\" · paquete × 4 (Homecenter 592306)", (2 * uniones + 4) // 4, "paquete", 10900,
         f"Dos por unión del marco, 12 instalados y 4 de reserva. Esquinas desde cantos de costados; central desde arriba/abajo. Evitar rebaje y tarugos."],
        ["Armado", "Tornillo para madera de 5\" (≈ 4,8 × 127)", AK["poste"]["n"] + 2, "u", cotiz, AK["poste"]["nota"]],
        ["Armado", "Tornillo para madera 5 × 70", 22, "u", cotiz, "Unir las dos piezas de cada paral (cada 40 cm, alternados) y las escuadras al piso."],
        ["Armado", "Escuadra metálica de 40 × 40 mm", 4, "u", cotiz, "Dos para el pie de cada paral de la puerta."],
        ["Armado", "Puntilla sin cabeza para sobreluz", 1, "caja", cotiz, "Tablillas de la sobreluz a sus listones."],
        ["Fijación a la obra", AK["antepecho"]["tornillo"].capitalize() + " · antepecho", AK["antepecho"]["n"] + 2, "u", cotiz, AK["antepecho"]["nota"]],
        ["Fijación a la obra", AK["medianera"]["tornillo"].capitalize() + " · medianera", AK["medianera"]["n"] + 1, "u", cotiz,
         "Fijación de la carpintería de pino a la medianera."],
        ["Fijación a la obra", "Tornillo 5 × 100 con chazo plástico de 8 mm · paral", 4, "u", cotiz, "Paral de la puerta al muro de la habitación."],
        ["Fijación a la obra", "Sikaflex-11 FC Purform 300 ml (Homecenter 728174)", 2, "tubo", 51900, "Entre el riel inferior y el ladrillo, y en las juntas con la medianera y el muro."],
        ["Fijación a la obra", "Tapones de pino de 10 mm", AK["antepecho"]["n"] + AK["medianera"]["n"] + 2 * uniones + AK["poste"]["n"] + 6, "u", cotiz, "Tapan los tornillos a la vista."],
        ["Fijación a la obra", "Calzas plásticas de nivelación", 1, "paquete", cotiz, "Antepecho y ajuste del encuentro superior de la carpintería."],
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
        ["Cielo raso", vig["n"], f"perfilería metálica ilustrativa y {fmt(m2)} m² de panel de yeso; validar apoyos y calibre"],
        *[[f"Pino macizo {e} × {a}", n, f"piezas de {LISTON['L']} mm (ver plan de corte)"] for e, a, n in pedido_macizo],
        ["Ventanal · tablas locales 15 mm", 9, "4 bastidores 100 × 40 adicionales; ver pedido individual con márgenes"],
        ["Tableros alistonados 18 mm · puerta", len(refil), f"de {TABLERO['L']} × {TABLERO['A']} (referencia), refilando 5 mm por punta"],
        ["Placas de yeso", placas, "Referencia 1220 × 2440 × 12,7 mm; confirmar plan de juntas"],
        ["Peso de la madera", round(sum(peso.values())), f"kg: ventanal {peso['Ventanal']:.0f} y puerta {peso['Puerta']:.0f}"],
        ["Paso de aire del ventanal", round(aire(an["min"]) * 100), f"% a {an['min']}° y {an['max']}°; {aire(90) * 100:.0f} % a 90°. La sobreluz de la puerta suma paso permanente"],
        ["Recorrido de cada barra", round(corre, 1), f"mm a lo largo, dentro del canal de {M['canal']['z1'] - M['canal']['z0']} × {M['canal']['prof']}"],
        ["Superficie a barnizar", round(area, 1), f"m², todas las caras; unos {fmt(round(litros, 1))} L de laca ({latas} latas de 4 L)"],
        ["Total con precio de referencia", total, "Laca y varilla; el resto por cotizar"],
    ]
    pendientes = [
        ["Perfilería del cielo raso", "Validar calibre, luces, separaciones, cuelgues y anclajes. Comprobar cualquier carga sobre el ventanal o el marco de la puerta antes de instalar.", "Antes de comprar"],
        ["Medida real del pino", "Ventanal: 40 × 100 terminados y tablillas de 100 × 15. Confirmar largo sano ≥3010 de los dos rieles y ancho útil ≥210 de las tablas. No cambiar secciones sin revisar mecanismo.", "Antes de cortar"],
        ["Largo de las piezas", "Ventanal: dos rieles finales de 3000 entre costados de 40. Si solo hay 3000 brutos, usar la alternativa de 2990 y revisar la plantilla. Puerta: plan separado en 3020.", "Al comprar"],
        ["Espacio sobre el cielo raso", "La placa termina por debajo a +2560. La ambientación ocupa unos 70 mm por encima; confirmar espacio y sistema de soporte.", "Antes de comprar"],
        ["Muro de la habitación", "Confirmar de qué es (ladrillo, concreto) para elegir los anclajes del cielo raso y del paral.", "Antes de instalar"],
        ["Vano real", "Medir ancho y alto del ventanal y de la puerta en tres puntos; revisar plomo del muro de la habitación y nivel del antepecho.", "Antes de cortar"],
        ["Sistema plegable", "Elegir el kit para hojas de 36 mm y ajustar el alto de las hojas a su plantilla (hoy 60 mm para riel y carros y 10 mm bajo la hoja).", "Antes de cortar las hojas"],
        ["Pines", "Comprar el paquete uxcell y medir cuerpo, punta y pestaña antes de perforar.", "Antes de perforar"],
        ["Un solo lote e inmunizado", "Comprar todo junto; inmunizar antes de lijar y barnizar, y dejar secar.", "Al comprar"],
        ["Prueba", "Probar 3 o 4 tablillas en un trozo de riel: giro, roce y clic de los pines.", "Antes de cortar todo"],
        ["Ventilación", f"El gasista valida el {aire(an['min']) * 100:.0f} % de paso del ventanal más la sobreluz.", "Antes de instalar"],
    ]

    # Autoría XLSX con artifact-tool; el JSON temporal separa cálculos de presentación.
    specs = []
    def hoja(nombre, titulo, notas, hdr, rows, anchos):
        specs.append(dict(name=nombre,title=titulo,notes=notas,headers=hdr,rows=rows,widths=anchos))
    H_DESP = ["ID", "Grupo", "Pieza", "Material", "Cant.", "Largo", "Ancho", "Esp.", "Área m²", "Observaciones"]
    H_PLAN = ["Sección", "Pieza de 3020", "Cortes", "Sobrante mm"]
    H_TAB = ["Tablero", "Ocupación", "Tiras y piezas"]
    hoja("Resumen", "Pino de cocina · material local", ["Ventanal: pedido propio de 9 tablas y 4 bastidores. Puerta y cielo conservan su diseño."], ["Concepto", "Valor", "Nota"], resumen, [35,18,110])
    hoja("Despiece", "Medidas finales de montaje", ["Ver pedido individual para largos con margen y repuestos. Ventanal y puerta utilizan materiales diferentes."],H_DESP,despiece,[9,16,38,30,9,12,12,10,14,110])
    hoja("Ventanal local", "Corte de 9 tablas y 4 bastidores", ["Tabla de 220 × 20 cepillada a 15; bastidor 100 × 40 terminado. Largos de entrega con margen."], ["ID","Pieza","Cant.","Origen","Entrega L","Ancho","Espesor","Final L","Final ancho","Final esp.","Nota"],local["parts"],[10,32,9,22,12,12,10,12,12,12,100])
    hoja("Pino macizo", "Puerta · plan en bastidores de 3020", ["Excluye los cuatro bastidores del ventanal; no duplicar la compra."],H_PLAN,plan,[15,15,95,18])
    hoja("Tableros", "Puerta · alistonado 18 mm", ["Excluye las nueve tablas cepilladas a 15 del ventanal."],H_TAB,t_refil,[12,14,120])
    rows = [[*r[:5], {"formula": f'=IF(AND(ISNUMBER(C{i}),ISNUMBER(E{i})),C{i}*E{i},"Por cotizar")'},r[5]] for i,r in enumerate(compras,7)]
    rows.append([None,"Total con precio de referencia",None,None,None,{"formula":f"=SUM(F7:F{6+len(compras)})"},None])
    hoja("Compras", "Compras independientes de los muebles", ["Cotizar no equivale a cero. Ventanal y puerta separados para evitar duplicados."],["Grupo","Ítem","Cant.","Unidad","Precio COP","Subtotal COP","Nota"],rows,[20,55,10,20,18,18,110])
    hoja("Armado ventana", "Uniones y mecanismo del ventanal", ["Prototipo con herrajes reales antes de fresar."],["Control","Medida / criterio","Aplicación"],local["notes"],[35,55,120])
    hoja("Pendientes", "Controles antes de fabricar", [],["Tema","Qué falta","Cuándo"],pendientes,[30,120,25])
    with tempfile.TemporaryDirectory(prefix="pino-libro-") as tmp:
        source=Path(tmp)/"libro.json";source.write_text(json.dumps(specs,ensure_ascii=False),encoding="utf-8")
        subprocess.run(["node",str(RAIZ/"herramientas/exportar_pino.mjs"),str(source),str(RAIZ/"despiece-pino-cocina.xlsx")],check=True)

    secs = [("ventanal-local", "Ventanal · pedido local", "<p>9 tablas y 4 bastidores. <a href=\"despiece-ventana-pino-con-margen.xlsx\">Pedido con márgenes</a> · <a href=\"pedido-corte-ventana-pino.pdf\">PDF de corte</a></p>"), ("resumen", "Resumen", tabla(resumen, ["Concepto", "Valor", "Nota"], num_cols=(1,), wrap_cols=(2,))),
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
            f'<p class="note">Medido en obra el {FECHA}. Ventanal de madera local: nueve tablas cepilladas a 15 y cuatro bastidores 100 × 40; puerta con alistonado de 18 y bastidores de 3020; cielo de panel de yeso, '
            'del mismo lote, inmunizado y barnizado en la misma tanda. No suma en compras-proyecto.</p>']
    for a, t, h in secs: body.append(f'<h2 id="{a}">{html.escape(t)}</h2>{h}')
    (RAIZ / "despiece-pino-cocina.html").write_text(page("Pino de la cocina · despiece", "".join(body)), encoding="utf-8")
    print("OK:", ", ".join(f"{e}×{a}: {n} piezas de 3020 mm" for e, a, n in pedido_macizo),
          f"| tableros {len(refil)} {[round(ocup(b), 2) for b in refil]} | panel de yeso {m2_compra} m² | área {area:.1f} m², laca {litros:.1f} L | "
          f"madera {sum(peso.values()) + peso_mach:.0f} kg")


if __name__ == "__main__":
    main()
