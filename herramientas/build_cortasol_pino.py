"""Genera despiece-cortasol-pino.xlsx y despiece-cortasol-pino.html para el cortasol de tablillas orientables
(variante pino: tablillas de pino alistonado, marco doble de RH15 y una barra de aluminio arriba).

Uso, desde la raíz del repositorio:

    python herramientas/build_cortasol_pino.py

Fuente: assets/models/cortasol-pino-data.js (la misma que usa el visor propuesta-4-tablillas-pino.html).
Es un libro independiente: no entra en compras-proyecto.xlsx ni en los despieces de los muebles,
porque el color todavía no está definido y puede no ser el Cartagena de la cocina.
"""
import html, json, math
from pathlib import Path
import openpyxl
from openpyxl.styles import Alignment, Font, PatternFill
from build_despiece import page, tabla, fmt
from build_compras_proyecto import mejor_encaje, ocupacion, K, BW, BH, RESERVA_BORDE, MARGEN

RAIZ = Path(__file__).resolve().parent.parent
FECHA = "03/11/2026"
# Referencias: lámina y canto al precio del Cartagena (compras-proyecto.xlsx); el color real puede costar distinto.
REF_LAMINA, REF_CANTO_M = 365872, 285600 / 200
WPC = dict(set_promo=179900, set_normal=199900, piezas=4, largo=2400, promo_hasta="4/11/2026",
           url="https://www.homecenter.com.co/homecenter-co/product/918613/set-4-separador-wpc-24m-arce-holztek/918613/")
MIN_CORTO, MIN_LARGO = 100, 250   # canteadora de Madecentro, como en los otros pedidos

t = (RAIZ / "assets" / "models" / "cortasol-pino-data.js").read_text(encoding="utf-8")
D = json.loads(t[t.index("{"): t.rindex("}") + 1])
canto = lambda e: 0.45 if e == "0.45" else 2 if e == "2" else 0
letra = lambda e: "F" if e == "0.45" else "R" if e == "2" else "—"


MAT = {"rh": "Melamina RH 15 · color por definir", "pino": "Pino alistonado 18 mm · pintado o barnizado",
       "aluminio": "Platina de aluminio 1 × 1/8 pulg"}


def piezas():
    """Solo las piezas de RH: son las que van al pedido de Madecentro, al encaje en láminas y al canto."""
    out = []
    for p in D["parts"]:
        if p.get("material", "rh") != "rh":
            continue
        e = p["edges"]
        cl = p["L"] - canto(e[2]) - canto(e[3])
        ca = p["A"] - canto(e[0]) - canto(e[1])
        peq = min(cl, ca) < MIN_CORTO or max(cl, ca) < MIN_LARGO
        out.append(dict(p, cl=round(cl, 2), ca=round(ca, 2), peq=peq))
    return out


def cantos(ps):
    net = bordes = 0
    for p in ps:
        for i, e in enumerate(p["edges"]):
            if e == "0.45":
                net += p["qty"] * (p["L"] if i < 2 else p["A"]) / 1000
                bordes += p["qty"]
    need = math.ceil((net + bordes * RESERVA_BORDE) * (1 + MARGEN))
    return round(net, 2), bordes, need


def main():
    ps = piezas()
    otras = [p for p in D["parts"] if p.get("material", "rh") != "rh"]
    lam = mejor_encaje([(p["id"], p["cl"], p["ca"]) for p in ps for _ in range(p["qty"])], 300)
    net, bordes, need = cantos(ps)
    lama, n, F, M, an = D["lama"], D["lama"]["n"], D["marco"], D["mecanismo"], D["angulo"]
    B, PS, PN = M["barra"], M["pasador"], M["pines"]
    n_p = F["paneles"]
    paso = (D["vano"]["L"] - 2 * F["t"]) / n
    T = next(p for p in D["parts"] if p["id"] == "T01")
    largo = T["L"]
    peso = largo * lama["A"] * lama["t"] * lama["densidad"] / 1e9
    sets = math.ceil(n * (1 if 2 * largo > WPC["largo"] else 2) / WPC["piezas"])
    an_k = M["anclajes"]
    anclajes = n_p * (an_k["rielInferior"] + an_k["rielSuperior"]) + 2 * an_k["lateral"]
    aire = lambda a: (paso * math.sin(math.radians(a)) - lama["t"]) / paso
    R = M["manivela"]
    corre = R * (math.cos(math.radians(an["min"])) - math.cos(math.radians(an["max"])))
    peq = [p for p in ps if p["peq"] and any(e != "—" for e in p["edges"])]

    despiece = [[p["id"], p["name"], MAT[p.get("material", "rh")], p["qty"], p["L"], p["A"], p["t"],
                 *[letra(e) for e in p["edges"]], p.get("cl", p["L"]), p.get("ca", p["A"]),
                 round(p["qty"] * p["L"] * p["A"] / 1e6, 3), p["note"]] for p in ps + otras]
    obs = {"R09": "Sin canto: queda escondido en el canal. Sellar los cantos en el taller.",
           "R08": "Tira angosta: canto a mano en el borde patio."}
    pedido = [[p["id"], p["name"], MAT["rh"], p["qty"], p["L"], p["A"], *[letra(e) for e in p["edges"]],
               "Pequeña" if p["peq"] else "Normal", f'{fmt(p["L"])} × {fmt(p["A"])}', f'{fmt(p["cl"])} × {fmt(p["ca"])}',
               "Veta a lo largo. " + obs.get(p["id"], "Si no la cantean, cortar a la medida sin canto y cantear en el armado." if p["peq"] else "Perforaciones en el taller, con plantilla.")]
              for p in ps]
    laminas = [[i, round(ocupacion(l), 3), ", ".join(f'{k} × {v}' for k, v in sorted(
        {pid: sum(1 for x in l["items"] if x[0] == pid) for pid, *_ in l["items"]}.items()))] for i, l in enumerate(lam, 1)]
    tabla_cantos = [["Flexible 0,45 mm · mismo color", net, bordes, need,
                     f"Netos {fmt(net)} m + {RESERVA_BORDE*100:.0f} cm por borde + {MARGEN*100:.0f} %. Comprar por metro. "
                     f"Las piezas {', '.join(p['id'] for p in peq)} son angostas o cortas para la canteadora: se cantean a mano en el armado."]]
    compras = [
        ["Marco RH", "Melamina RH15 · 2440 × 2150 · color por definir", len(lam), "lámina", REF_LAMINA,
         "Precio de referencia del Cartagena; cotizar el color elegido. Encaje en la hoja Láminas."],
        ["Marco RH", "Canto flexible 0,45 mm · mismo color", need, "m", round(REF_CANTO_M),
         "Referencia: rollo Cartagena de 200 m a $285.600. Confirmar precio por metro suelto."],
        ["Marco RH", "Corte y canteado Madecentro", 1, "servicio", "cotizar", f"{sum(p['qty'] for p in ps)} piezas, {bordes} bordes con canto."],
        ["Marco RH", "Pegante PU para madera", 1, "u", "cotizar", "Para pegar las dos capas de rieles y laterales. Lijar con lija 80 la melamina de las caras que se pegan."],
        ["Marco RH", "Lija 80", 2, "pliego", "cotizar", "Romper el brillo de la melamina donde va el pegante."],
        ["Marco RH", "Tornillo 4 × 25 para aglomerado", 100, "u", "cotizar", "Prensar las capas mientras seca el PU, cada 15 cm, desde la cara oculta."],
        ["Tablillas de pino", f"Pino alistonado (finger joint) de {lama['t']} mm, cortado a {lama['A']} × {largo}", n + 2, "tablilla", "cotizar",
         f"{n} + 2 de reserva. Confirmar el largo de los listones o tableros: una pieza de 2,44 m da una sola tablilla de {largo}; de 2,50 m o más salen dos."],
        ["Tablillas de pino", "Sellador, pintura o barniz para madera", 1, "galón", "cotizar", "Seis caras de cada tablilla, puntas incluidas, para que no se tuerza."],
        ["Tablillas de pino", "Lija 120 y 220", 4, "pliego", "cotizar", "Entre manos de sellador y acabado."],
        ["Mecanismo", f"Pines {PN['modelo']} · paquete de 80", 1, "paquete", "cotizar",
         f"Amazon. {2*n} pines, uno en cada punta, + {80-2*n} de repuesto. Medir cuerpo, punta y pestaña antes de perforar."],
        ["Mecanismo", "Platina de aluminio 1 × 1/8 pulg (25,4 × 3,2 mm) · barra de 6 m", 1, "barra", "cotizar",
         f"Una sola pieza de {B['L']} mm con {n} agujeros de {B['agujero']} mm a paso {fmt(round(paso,1))}. Alutech la publica como P18."],
        ["Mecanismo", "Varilla lisa de acero inoxidable 304 de 1/4 pulg · 1 m", 1, "u", 15000,
         f"{n} pasadores de {PS['L']} mm: {PS['dentro']} pegados en la tablilla y {PS['L']-PS['dentro']} por fuera. Referencia Merkatronix."],
        ["Mecanismo", "Arandela plana de nylon de 1/4 pulg", n + 10, "u", "cotizar", "Una en cada pasador: la barra se apoya en ellas y no roza la madera."],
        ["Mecanismo", "Epóxico", 1, "u", "cotizar", "Pasadores en las tablillas y endurecer los huecos de los pines en el RH."],
        ["Fijación", M["anclaje"].capitalize(), anclajes + 4, "u", "cotizar",
         f"{an_k['rielInferior']} por riel inferior y {an_k['rielSuperior']} por riel superior en {n_p} tramos, {an_k['lateral']} por lateral, + 4. "
         "Abajo, del lado patio y fuera del barrido; arriba, solo a viga o losa."],
        ["Fijación", "Calzas plásticas de nivelación", 1, "paquete", "cotizar", "Para la holgura de 4 mm y el desnivel del antepecho."],
        ["Fijación", "Sellador para cantos sin canto", 1, "u", "cotizar", "Laca o sellador para tablero: canal, tacos y cantos ocultos."],
        ["LED (opcional)", "Perfil de aluminio 16 × 8 mm con difusor", 3, "m", "cotizar", "En el rebaje de 17 × 15 que deja la tira cocina del riel superior."],
        ["LED (opcional)", "Cinta LED 24 V 3000 K ≈ 10 W/m", 5, "m (rollo)", "cotizar", "Se usan 3 m en tres tramos."],
        ["LED (opcional)", "Fuente 24 V 60 W, interruptor y cable", 1, "juego", "cotizar", "Instalación por electricista; punto no previsto en la cocina."],
    ]
    wpc = [
        ["Pieza", f"WPC 100 × 25 × {WPC['largo']} mm, set de {WPC['piezas']}", f"Tablilla de pino {lama['A']} × {lama['t']} × {largo} mm"],
        ["Para la altura actual", f"{n} piezas ({n} tablillas, una por pieza) = {sets} sets", f"{n} tablillas + 2 de reserva, cortadas en el depósito"],
        ["Orientable", "Sección no publicada; habría que ver si el perfil admite pines en las puntas", "Pines con resorte en las dos puntas y barra de aluminio arriba"],
        ["Material", f"${sets*WPC['set_promo']:,.0f} promoción (hasta {WPC['promo_hasta']}) · ${sets*WPC['set_normal']:,.0f} normal".replace(",", "."),
         "Por cotizar en depósito de madera; más acabado"],
        ["Desperdicio", f"{(WPC['largo']-largo)/1000:.2f} m de cada pieza".replace(".", ","), "Depende del largo de los listones (ver Compras)"],
        ["Exterior", "Apto, no lleva canto", "Bajo techo; sellar las seis caras"],
        ["Color", "Solo Arce", "Natural, barnizado o pintado del color que se quiera"],
        ["Fuente", WPC["url"], "Precio de referencia del proyecto"],
    ]
    resumen = [
        ["Tablillas", n, f"{lama['A']} × {lama['t']} × {largo} mm de pino alistonado, paso {fmt(round(paso,1))} mm, orientables de {an['min']}° a {an['max']}°"],
        ["Peso de cada tablilla", round(peso, 2), f"kg, con pino de {lama['densidad']} kg/m³; lo carga la pestaña del pin de abajo"],
        ["Mecanismo", 1, f"platina de aluminio de {B['L']} mm arriba, para las {n} tablillas; sin perillas"],
        ["Marco doble", F["t"], f"mm: dos capas de RH15 pegadas con PU, {F['A']} de fondo, en rieles y laterales"],
        ["Radio de giro de la tablilla", round(math.hypot(lama["A"], lama["t"]) / 2, 1), f"mm: gira dentro del marco de {F['A']}"],
        ["Paso de aire mínimo", round(aire(an["min"]) * 100), f"% a {an['min']}° y {an['max']}° (tacos de tope); {aire(90)*100:.0f} % con las tablillas perpendiculares"],
        ["Recorrido de la barra", round(corre, 1), f"mm a lo largo y {R*(1-math.sin(math.radians(an['min']))):.1f} mm hacia el patio, dentro del canal de {M['canal']['z1']-M['canal']['z0']} mm".replace(".", ",")],
        ["Láminas RH15", len(lam), " · ".join(f"lámina {i}: {o*100:.0f} %" for i, o, _ in laminas) + " (solo el marco)"],
        ["Canto flexible", need, "m a comprar"],
        ["Total con precio de referencia", None, "Lámina, canto y varilla; el resto por cotizar"],
    ]
    pendientes = [
        ["Pines", "Comprar el paquete uxcell y medir cuerpo, punta y pestaña; con eso se fijan las brocas y la holgura de 3 mm por punta.", "Antes de perforar"],
        ["Pino", "Confirmar en el depósito largo y precio de los listones o tableros alistonados de 18 mm.", "Antes de comprar"],
        ["Color del marco", "Elegir el RH15 en Madecentro y cotizar lámina y canto de ese color.", "Antes de cortar"],
        ["Vano real", f"Medir alto y ancho en tres puntos. Tablilla = alto mínimo − {2*F['t']} de marco − {2*lama['holgura']} de holgura − {lama['tolerancia']} de calce.", "Antes de cortar"],
        ["Anclaje superior", "Confirmar viga o losa sobre el vano; no fijar a la placa del cielo raso.", "Antes de instalar"],
        ["Ventilación", f"El gasista valida que el {aire(an['min'])*100:.0f} % de paso de aire en la posición más cerrada basta para estufa y campana.", "Antes de instalar"],
        ["Prueba", "Probar 3 o 4 tablillas en un trozo de riel: giro, roce y clic de los pines en la ranura de entrada.", "Antes de pedir todo"],
        ["Topes", "Cortar la platina unos milímetros más larga y limar las puntas hasta que tope a 40° y 140°.", "Al montar"],
        ["Rectitud", f"Revisar las {n} tablillas antes de perforar: una torcida roza al girar.", "Al recibir"],
        ["LED", "Punto eléctrico, ubicación de la fuente e interruptor con el electricista.", "Opcional"],
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
    ws = hoja("Resumen", "Cortasol de tablillas de pino orientables con marco doble de RH · resumen",
              [f"Revisado {FECHA}. Independiente de cocina, clóset y baño: no suma en compras-proyecto.xlsx.",
               "Visor: propuesta-4-tablillas-pino.html. Medidas en mm."],
              ["Concepto", "Valor", "Nota"], resumen, [36, 14, 80])
    ws_c = hoja("Despiece", "Despiece · medidas terminadas con canto",
                ["L1/L2 = lados largos, A1/A2 = puntas. F = flexible 0,45 mm; — = sin canto.", "El corte descuenta el canto."],
                ["ID", "Pieza", "Material", "Cant.", "Largo", "Ancho", "Esp.", "L1", "L2", "A1", "A2", "Corte largo", "Corte ancho", "Área m²", "Observaciones"],
                despiece, [6, 18, 30, 6, 8, 8, 6, 5, 5, 5, 5, 11, 11, 9, 70])
    hoja("Pedido de corte", "Pedido de corte para Madecentro",
         ["Medidas FINALES con canto incluido. Un solo tipo de canto por pieza.",
          f"La canteadora acepta piezas desde {MIN_CORTO} mm de lado menor y {MIN_LARGO} mm de lado mayor; las marcadas «Pequeña» se cantean a mano."],
         ["ID", "Pieza", "Material", "Cant.", "Largo a pedir", "Ancho a pedir", "Largo 1", "Largo 2", "Corto 1", "Corto 2", "Canteo", "Medida terminada", "Corte sin canto", "Observaciones"],
         pedido, [6, 18, 30, 6, 10, 10, 7, 7, 7, 7, 9, 16, 16, 60])
    hoja("Láminas", "Encaje en láminas 2440 × 2150",
         [f"Cortes pasantes, sin rotar por la veta, refilado 10 mm por lado y sierra {K} mm. El plano definitivo lo hace la seccionadora."],
         ["Lámina", "Ocupación", "Piezas"], laminas, [9, 11, 60])
    hoja("Cantos", "Canto", [], ["Tipo", "Metros netos", "Bordes", "Metros a comprar", "Nota"], tabla_cantos, [32, 13, 9, 15, 70])
    ws_k = hoja("Compras", "Compras · independiente del proyecto",
                ["«cotizar» = sin precio; no equivale a cero. Lámina y canto a precio de referencia Cartagena."],
                ["Grupo", "Ítem", "Cant.", "Unidad", "Precio unitario (COP)", "Subtotal (COP)", "Nota"], [], [16, 44, 7, 10, 14, 14, 70])
    for i, r in enumerate(compras, 7):
        for j, v in enumerate([*r[:5], None, r[5]], 1): ws_k.cell(i, j, v).alignment = Alignment(wrap_text=True, vertical="top")
        ws_k.cell(i, 6, f'=IF(AND(ISNUMBER(C{i}),ISNUMBER(E{i})),C{i}*E{i},"Por cotizar")')
        for c in (5, 6): ws_k.cell(i, c).number_format = '"$"#,##0'
    tot = 7 + len(compras)
    ws_k.cell(tot, 2, "Total con precio de referencia").font = bold
    ws_k.cell(tot, 6, f"=SUM(F7:F{tot-1})").number_format = '"$"#,##0'; ws_k.cell(tot, 6).font = bold
    fila_total = f"B{6 + len(resumen)}"   # última fila del resumen
    ws[fila_total] = f"=Compras!F{tot}"; ws[fila_total].number_format = '"$"#,##0'
    hoja("WPC o pino", "Comparación con el set WPC Holztek", ["Precio del set consultado el 01/11/2026 en Homecenter."],
         ["", "Set WPC", "Tablillas de pino"], wpc[1:], [26, 50, 50])
    hoja("Pendientes", "Pendientes", [], ["Tema", "Qué falta", "Cuándo"], pendientes, [18, 80, 18])
    wb.calculation.fullCalcOnLoad = True
    dest = RAIZ / "despiece-cortasol-pino.xlsx"; wb.save(dest)

    total = sum(r[2] * r[4] for r in compras if isinstance(r[4], (int, float)))
    resumen[-1][1] = total
    secs = [("resumen", "Resumen", tabla(resumen, ["Concepto", "Valor", "Nota"], num_cols=(1,), wrap_cols=(2,))),
            ("despiece", "Despiece", tabla(despiece, ["ID", "Pieza", "Material", "Cant.", "Largo", "Ancho", "Esp.", "L1", "L2", "A1", "A2", "Corte largo", "Corte ancho", "Área m²", "Observaciones"], num_cols=(3, 4, 5, 6, 11, 12, 13), wrap_cols=(14,))),
            ("pedido", "Pedido de corte", tabla(pedido, ["ID", "Pieza", "Material", "Cant.", "Largo a pedir", "Ancho a pedir", "Largo 1", "Largo 2", "Corto 1", "Corto 2", "Canteo", "Medida terminada", "Corte sin canto", "Observaciones"], num_cols=(3, 4, 5), wrap_cols=(13,))),
            ("laminas", "Láminas", tabla(laminas, ["Lámina", "Ocupación", "Piezas"], num_cols=(1,), wrap_cols=(2,))),
            ("cantos", "Cantos", tabla(tabla_cantos, ["Tipo", "Metros netos", "Bordes", "Metros a comprar", "Nota"], num_cols=(1, 2, 3), wrap_cols=(4,))),
            ("compras", "Compras", tabla([[*r[:5], r[2] * r[4] if isinstance(r[4], (int, float)) else "Por cotizar", r[5]] for r in compras]
                                          + [[None, "Total con precio de referencia", None, None, None, total, None]],
                                          ["Grupo", "Ítem", "Cant.", "Unidad", "Precio unitario", "Subtotal", "Nota"], num_cols=(2,), cop_cols=(4, 5), wrap_cols=(6,), tot_pred=lambda r: r[0] is None)),
            ("wpc", "WPC o pino", tabla(wpc[1:], ["", "Set WPC", "Tablillas de pino"], wrap_cols=(1, 2))),
            ("pendientes", "Pendientes", tabla(pendientes, ["Tema", "Qué falta", "Cuándo"], wrap_cols=(1,)))]
    body = [f'<p><a href="ventana.html">← Ventana de cocina</a> · <a href="propuesta-4-tablillas-pino.html">Ver 3D</a> · '
            f'<a href="despiece-cortasol-pino.xlsx" download>Descargar Excel</a></p>',
            '<span class="tag">Cortasol de tablillas de pino · independiente de los muebles</span><h1>Despiece y compras</h1>',
            '<nav class="tabs">' + "".join(f'<a href="#{a}">{t}</a>' for a, t, _ in secs) + '</nav>',
            '<p class="note">Tablillas de pino y barra de aluminio aparte; el marco es RH15 de color por definir, a precio de referencia del Cartagena. No suma en compras-proyecto.</p>']
    for a, t, h in secs: body.append(f'<h2 id="{a}">{html.escape(t)}</h2>{h}')
    (RAIZ / "despiece-cortasol-pino.html").write_text(page("Cortasol de pino · despiece", "".join(body)), encoding="utf-8")
    print(f"OK: {len(lam)} láminas {[round(ocupacion(l),3) for l in lam]}, canto {need} m, total ref ${total:,.0f}")


if __name__ == "__main__":
    main()
