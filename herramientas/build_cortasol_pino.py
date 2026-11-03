"""Genera despiece-cortasol-pino.xlsx y despiece-cortasol-pino.html para el cortasol de tablillas orientables
todo en pino: marco doble y tablillas de pino alistonado de 18 mm, mismo acabado, y una barra de aluminio arriba.

Uso, desde la raíz del repositorio:

    python herramientas/build_cortasol_pino.py

Fuente: assets/models/cortasol-pino-data.js (la misma que usa el visor propuesta-4-tablillas-pino.html).
Es un libro independiente: no entra en compras-proyecto.xlsx ni en los despieces de los muebles.
El encaje en tableros es de referencia (2440 × 1220 × 18): confirmar el formato real en el depósito.
"""
import html, json, math
from pathlib import Path
import openpyxl
from openpyxl.styles import Alignment, Font, PatternFill
from build_despiece import page, tabla, fmt

RAIZ = Path(__file__).resolve().parent.parent
FECHA = "03/11/2026"
TABLERO = dict(L=2440, A=1220, e=18)   # formato de referencia del tablero alistonado; confirmar en el depósito
SIERRA = 3                              # corte fino de taller
WPC = dict(set_promo=179900, set_normal=199900, piezas=4, largo=2400, promo_hasta="4/11/2026",
           url="https://www.homecenter.com.co/homecenter-co/product/918613/set-4-separador-wpc-24m-arce-holztek/918613/")
LACA = dict(**{"4L": 249900, "750": 74900}, url4="https://www.homecenter.com.co/homecenter-co/product/256080/laca-para-metal-y-madera-interior-exterior-purcat-incoloro-mate-monto-4-l/256080/",
            url750="https://www.homecenter.com.co/homecenter-co/product/256079/laca-para-metal-y-madera-interior-exterior-purcat-incoloro-mate-monto-750-ml/256079/")   # precios Homecenter 03/11/2026
RENDIMIENTO = 10                        # m² por litro y por mano, estimado típico; confirmar con la etiqueta
MANOS = 3                               # una rebajada (sella) y dos normales

t = (RAIZ / "assets" / "models" / "cortasol-pino-data.js").read_text(encoding="utf-8")
D = json.loads(t[t.index("{"): t.rindex("}") + 1])


def encaje(piezas, refilado):
    """Tiras al hilo (la veta va a lo largo del tablero) y cortes a lo largo de cada tira.
    piezas: lista de (id, largo, ancho). refilado: mm que se pierden en cada punta del tablero."""
    util_L, util_A = TABLERO["L"] - 2 * refilado, TABLERO["A"]
    tiras = []                                           # cada tira: ancho, piezas y largo usado
    for pid, L, A in sorted(piezas, key=lambda p: (-p[2], -p[1])):
        # Una pieza puede ir en una tira igual o más ancha (se corta y luego se rasga); se prefiere la más angosta.
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
    pino = [p for p in D["parts"] if p.get("material", "pino") == "pino"]
    lama, n, F, M, an = D["lama"], D["lama"]["n"], D["marco"], D["mecanismo"], D["angulo"]
    B, PS, PN = M["barra"], M["pasador"], M["pines"]
    paso = (D["vano"]["L"] - 2 * F["t"]) / n
    T = next(p for p in pino if p["id"] == "T01")
    largo = T["L"]
    vol = lambda p: p["qty"] * p["L"] * p["A"] * p["t"] / 1e9
    peso_t = largo * lama["A"] * lama["t"] * lama["densidad"] / 1e9
    peso_total = sum(vol(p) for p in pino) * lama["densidad"]
    area = sum(p["qty"] * 2 * (p["L"] * p["A"] + p["L"] * p["t"] + p["A"] * p["t"]) for p in pino) / 1e6
    litros = area * MANOS / RENDIMIENTO
    lista = [(p["id"], p["L"], p["A"]) for p in pino for _ in range(p["qty"])]
    sanas, refil = encaje(lista, 0), encaje(lista, 5)
    sets = math.ceil(n * (1 if 2 * largo > WPC["largo"] else 2) / WPC["piezas"])
    an_k = M["anclajes"]
    O = D["obra"]
    aire = lambda a: (paso * math.sin(math.radians(a)) - lama["t"]) / paso
    R = M["manivela"]
    corre = R * (math.cos(math.radians(an["min"])) - math.cos(math.radians(an["max"])))
    dos_por_tira = 2 * largo + SIERRA <= TABLERO["L"]

    despiece = [[p["id"], p["name"], "Pino alistonado 18 mm · barnizado" if p.get("material", "pino") == "pino" else "Platina de aluminio 1 × 1/8 pulg",
                 p["qty"], p["L"], p["A"], p["t"], round(p["qty"] * p["L"] * p["A"] / 1e6, 3), p["note"]] for p in D["parts"]]
    def tabla_tableros(tb):
        rows = []
        for i, b in enumerate(tb, 1):
            desc = " · ".join(f'tira {fmt(s["A"])}: ' + " + ".join(f"{pid} {fmt(L)}" for pid, L in s["items"]) for s in b["tiras"])
            rows.append([i, round(ocup(b), 3), desc])
        return rows
    t_sanas, t_refil = tabla_tableros(sanas), tabla_tableros(refil)
    compras = [
        ["Pino", f"Tablero alistonado de pino {TABLERO['e']} mm · {TABLERO['L']} × {TABLERO['A']} (referencia)", len(refil), "tablero", "cotizar",
         f"Un solo lote para marco y tablillas. {len(refil)} tableros refilando 5 mm por punta; {len(sanas)} si las puntas vienen sanas. "
         "Confirmar formato y precio: con listones o tableros más largos sobra menos."],
        ["Pino", "Corte en taller (sierra fina)", 1, "servicio", "cotizar", f"{sum(p['qty'] for p in pino)} piezas de pino. Veta siempre a lo largo de cada pieza."],
        ["Marco", "Pegante para madera tipo Colbón", 1, "kg", "cotizar", "Para las dos capas de rieles y laterales, las esquinas y los tacos de tope."],
        ["Marco", "Tornillo para madera 4 × 30", 100, "u", "cotizar", "Prensar las capas mientras seca el pegante, cada 15 cm, desde la cara oculta. También sirven prensas."],
        ["Acabado", "Montó Laca para Metal y Madera Interior/Exterior Pur+Cat · Incoloro Mate · 4 L (Homecenter 256080)", 1, "u", LACA["4L"],
         f"Tono miel. Sirve de sellador y de acabado: primera mano rebajada con su diluyente, luego dos manos normales. "
         f"Unos {fmt(round(litros,1))} L para {fmt(round(area,1))} m² en {MANOS} manos. {LACA['url4']}"],
        ["Acabado", "Montó Laca Pur+Cat · Incoloro Mate · 750 ml (Homecenter 256079)", 1, "u", LACA["750"],
         f"Reserva y prueba en un retazo del mismo lote. {LACA['url750']}"],
        ["Acabado", "Diluyente que indique la etiqueta de la laca Pur+Cat", 1, "L", "cotizar", "Para la primera mano (sellado) y limpiar herramientas. Confirmar en la tienda."],
        ["Acabado", "Lija 220 y 320", 6, "pliego", "cotizar", "220 antes de la primera mano; 320 entre manos."],
        ["Acabado", "Mascarilla con filtro para vapores orgánicos y guantes de nitrilo", 1, "juego", "cotizar", "La laca catalizada huele fuerte y es inflamable: aplicar ventilado."],
        ["Mecanismo", f"Pines {PN['modelo']} · paquete de 80", 1, "paquete", "cotizar",
         f"Amazon. {2*n} pines, uno en cada punta, + {80-2*n} de repuesto. Medir cuerpo, punta y pestaña antes de perforar."],
        ["Mecanismo", "Platina de aluminio 3/4 × 1/8 pulg (19,05 × 3,2 mm) · barra de 6 m", 1, "barra", "cotizar",
         f"Una sola pieza de {B['L']} mm con {n} agujeros de {B['agujero']} mm a paso {fmt(round(paso,1))}. Distribuidor de aluminio."],
        ["Mecanismo", "Varilla lisa de acero inoxidable 304 de 1/4 pulg · 1 m", 1, "u", 15000,
         f"{n} pasadores de {PS['L']} mm: {PS['dentro']} pegados en la tablilla y {PS['L']-PS['dentro']} por fuera. Referencia Merkatronix."],
        ["Mecanismo", "Arandela plana de nylon de 1/4 pulg", n + 10, "u", "cotizar", "Una en cada pasador: la barra se apoya en ellas y no roza la madera."],
        ["Mecanismo", "Epóxico", 1, "u", "cotizar", "Pasadores en las tablillas."],
        ["Fijación a la obra", an_k["antepecho"]["tornillo"].capitalize() + " · al antepecho", an_k["antepecho"]["n"] + 2, "u", "cotizar", an_k["antepecho"]["nota"]],
        ["Fijación a la obra", an_k["cielo"]["tornillo"].capitalize() + " · al riel del cielo raso", an_k["cielo"]["n"] + 2, "u", "cotizar", an_k["cielo"]["nota"]],
        ["Fijación a la obra", an_k["medianera"]["tornillo"].capitalize() + " · a la medianera", an_k["medianera"]["n"] + 1, "u", "cotizar", an_k["medianera"]["nota"]],
        ["Fijación a la obra", "Sellador elastomérico o silicona neutra", 1, "tubo", "cotizar", "Cordón entre el riel inferior y el ladrillo, y en la junta con la medianera."],
        ["Marco", "Tarugo de madera de 10 × 40 mm", 8 + 4, "u", "cotizar", "Dos por esquina, pegados: las esquinas sostienen el extremo libre."],
        ["Marco", "Tornillo para madera 4,5 × 70", 8 + 4, "u", "cotizar", "Dos por esquina, desde el riel hacia el lateral."],
        ["Marco", "Tapones de pino de 10 mm", an_k["antepecho"]["n"] + an_k["cielo"]["n"] + an_k["medianera"]["n"] + 8 + 6, "u", "cotizar", "Tapan las cabezas de todos los tornillos a la vista; se lijan al ras y se barnizan."],
        ["Fijación a la obra", "Calzas plásticas de nivelación", 1, "paquete", "cotizar", "Para la holgura de 4 mm y el desnivel del antepecho."],
    ]
    wpc = [
        ["Para la altura actual", f"{n} piezas ({n} tablillas, una por pieza) = {sets} sets", f"{n} tablillas de pino cortadas del mismo lote del marco"],
        ["Orientable", "Sección no publicada; habría que ver si el perfil admite pines en las puntas", "Pines con resorte en las dos puntas y barra de aluminio arriba"],
        ["Material", f"${sets*WPC['set_promo']:,.0f} promoción (hasta {WPC['promo_hasta']}) · ${sets*WPC['set_normal']:,.0f} normal, solo tablillas".replace(",", "."),
         "Por cotizar en depósito de madera; marco y tablillas del mismo pino"],
        ["Conjunto", "El WPC no combina con un marco de madera barnizada", "Marco y tablillas del mismo material y el mismo barniz"],
        ["Color", "Solo Arce", "Natural, con tinte o pintado"],
        ["Fuente", WPC["url"], "Precio de referencia del proyecto"],
    ]
    resumen = [
        ["Tablillas", n, f"{lama['A']} × {lama['t']} × {largo} mm de pino alistonado, paso {fmt(round(paso,1))} mm, orientables de {an['min']}° a {an['max']}°"],
        ["Marco doble de pino", F["t"], f"mm: dos capas de {F['capa']} mm pegadas, {F['A']} de fondo ({O['antepecho']['t']} del ladrillo + {F['pestana']['t']} por cara), juntas trabadas (1000 + 1000 + 1000 sobre 500 + 1000 + 1000 + 500)"],
        ["Pestañas del antepecho", F["pestana"]["h"], f"mm que bajan por las dos caras del ladrillo, de {F['pestana']['t']} mm de grueso, con remate en el extremo libre (forma de U)"],
        ["Fijación a la obra", an_k["antepecho"]["n"] + an_k["cielo"]["n"] + an_k["medianera"]["n"], f"tornillos: {an_k['antepecho']['n']} al antepecho (carga todo el peso), {an_k['cielo']['n']} al riel del cielo raso (solo lo sostiene de lado), {an_k['medianera']['n']} a la medianera; extremo derecho libre"],
        ["Peso de cada tablilla", round(peso_t, 2), f"kg, con pino de {lama['densidad']} kg/m³; lo carga la pestaña del pin de abajo"],
        ["Peso del pino en total", round(peso_total), "kg aproximados, marco y tablillas"],
        ["Mecanismo", 1, f"platina de aluminio de {B['L']} mm arriba, para las {n} tablillas; sin perillas"],
        ["Paso de aire mínimo", round(aire(an["min"]) * 100), f"% a {an['min']}° y {an['max']}° (tacos de tope); {aire(45)*100:.0f} % a 45°; {aire(90)*100:.0f} % con las tablillas perpendiculares"],
        ["Recorrido de la barra", round(corre, 1), f"mm a lo largo y {R*(1-math.sin(math.radians(an['min']))):.1f} mm hacia el patio, dentro del canal de {M['canal']['z1']-M['canal']['z0']} mm".replace(".", ",")],
        ["Superficie a barnizar", round(area, 1), f"m², todas las caras; unos {fmt(round(litros,1))} L de laca Montó Pur+Cat ({MANOS} manos, la primera rebajada)"],
        ["Tableros de referencia", len(refil), f"de {TABLERO['L']} × {TABLERO['A']} × {TABLERO['e']} refilando 5 mm por punta; {len(sanas)} con puntas sanas"],
        ["Total con precio de referencia", None, "Laca Montó y varilla; el resto por cotizar"],
    ]
    pendientes = [
        ["Formato del pino", f"Confirmar largo, ancho y precio de los tableros o listones alistonados de 18 mm. "
         + ("Dos tablillas de " + fmt(largo) + " caben en 2,44 m solo con puntas sanas y corte fino; si no, sale una por tira." if dos_por_tira else "Sale una tablilla por tira de 2,44 m."), "Antes de comprar"],
        ["Un solo lote", "Comprar marco y tablillas juntos, del mismo lote, para que el tono sea parejo.", "Al comprar"],
        ["Pines", "Comprar el paquete uxcell y medir cuerpo, punta y pestaña; con eso se fijan las brocas y la holgura de 3 mm por punta.", "Antes de perforar"],
        ["Vano real", f"Medir alto y ancho en tres puntos. Tablilla = alto mínimo − {2*F['t']} de marco − {2*lama['holgura']} de holgura − {lama['tolerancia']} de calce.", "Antes de cortar"],
        ["Laca en la tienda", "Preguntar en Homecenter: si el catalizador viene incluido y en qué proporción se mezcla, cuánto dura la mezcla, qué diluyente usar y si la primera mano rebajada sirve de sellador. No poner sellador de nitrocelulosa debajo.", "Antes de comprar"],
        ["Tono", "Probar la laca en un retazo del mismo lote: una mano rebajada y dos normales, para ver el tono miel real.", "Antes de barnizar"],
        ["Extremo libre", "El lateral derecho no toca muro: armar las esquinas con tarugos, pegante y tornillos, y revisar que el marco quede firme antes de montar las tablillas.", "Al armar"],
        ["Ventilación", f"El gasista valida que el {aire(an['min'])*100:.0f} % de paso de aire en la posición más cerrada basta para estufa y campana.", "Antes de instalar"],
        ["Prueba", "Probar 3 o 4 tablillas en un trozo de riel: giro, roce y clic de los pines en la ranura de entrada.", "Antes de cortar todo"],
        ["Topes", "Cortar la platina unos milímetros más larga y limar las puntas hasta que tope a 40° y 140°.", "Al montar"],
        ["Rectitud", "Revisar las piezas antes de perforar: una tablilla torcida roza al girar.", "Al recibir"],
        ["Riel del cielo raso", "Con el instalador del panel yeso: dejar un riel metálico justo sobre la línea de la ventana, bien amarrado a la estructura, y acordar la altura final del cielo raso.", "Antes del cielo raso"],
        ["Antepecho", "Revisar que el borde superior del ladrillo esté nivelado y sano; corregir con mortero si hace falta antes de anclar.", "Antes de instalar"],
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
    H_DESP = ["ID", "Pieza", "Material", "Cant.", "Largo", "Ancho", "Esp.", "Área m²", "Observaciones"]
    H_TAB = ["Tablero", "Ocupación", "Tiras y piezas"]
    ws = hoja("Resumen", "Cortasol todo en pino · resumen",
              [f"Revisado {FECHA}. Independiente de cocina, clóset y baño: no suma en compras-proyecto.xlsx.",
               "Visor: propuesta-4-tablillas-pino.html. Medidas terminadas en mm."],
              ["Concepto", "Valor", "Nota"], resumen, [30, 14, 90])
    hoja("Despiece", "Despiece · medidas terminadas", ["Veta a lo largo de cada pieza. Sin canto: los bordes se lijan y barnizan."],
         H_DESP, despiece, [7, 30, 30, 6, 8, 8, 6, 9, 80])
    hoja("Tableros", f"Encaje de referencia en tableros {TABLERO['L']} × {TABLERO['A']} × {TABLERO['e']}",
         [f"Refilando 5 mm por punta y sierra de {SIERRA} mm. Tiras al hilo, piezas a lo largo de cada tira; una pieza angosta puede salir de una tira más ancha y rasgarse.",
          "Es una referencia para cotizar: el formato real puede cambiar el número de tableros."],
         H_TAB, t_refil, [9, 11, 110])
    hoja("Tableros puntas sanas", "Encaje si las puntas del tablero vienen sanas (sin refilar)",
         [f"Mismas reglas, sin perder nada en las puntas. Dos tablillas de {largo} por tira: {'sí' if dos_por_tira else 'no'}."],
         H_TAB, t_sanas, [9, 11, 110])
    ws_k = hoja("Compras", "Compras · independiente del proyecto", ["«cotizar» = sin precio; no equivale a cero."],
                ["Grupo", "Ítem", "Cant.", "Unidad", "Precio unitario (COP)", "Subtotal (COP)", "Nota"], [], [14, 46, 7, 10, 14, 14, 80])
    for i, r in enumerate(compras, 7):
        for j, v in enumerate([*r[:5], None, r[5]], 1): ws_k.cell(i, j, v).alignment = Alignment(wrap_text=True, vertical="top")
        ws_k.cell(i, 6, f'=IF(AND(ISNUMBER(C{i}),ISNUMBER(E{i})),C{i}*E{i},"Por cotizar")')
        for c in (5, 6): ws_k.cell(i, c).number_format = '"$"#,##0'
    tot = 7 + len(compras)
    ws_k.cell(tot, 2, "Total con precio de referencia").font = bold
    ws_k.cell(tot, 6, f"=SUM(F7:F{tot-1})").number_format = '"$"#,##0'; ws_k.cell(tot, 6).font = bold
    fila_total = f"B{6 + len(resumen)}"
    ws[fila_total] = f"=Compras!F{tot}"; ws[fila_total].number_format = '"$"#,##0'
    hoja("WPC o pino", "Comparación con el set WPC Holztek", ["Precio del set consultado el 01/11/2026 en Homecenter."],
         ["", "Set WPC", "Todo en pino"], wpc, [24, 50, 50])
    hoja("Pendientes", "Pendientes", [], ["Tema", "Qué falta", "Cuándo"], pendientes, [18, 90, 18])
    wb.calculation.fullCalcOnLoad = True
    wb.save(RAIZ / "despiece-cortasol-pino.xlsx")

    total = sum(r[2] * r[4] for r in compras if isinstance(r[4], (int, float)))
    resumen[-1][1] = total
    secs = [("resumen", "Resumen", tabla(resumen, ["Concepto", "Valor", "Nota"], num_cols=(1,), wrap_cols=(2,))),
            ("despiece", "Despiece", tabla(despiece, H_DESP, num_cols=(3, 4, 5, 6, 7), wrap_cols=(8,))),
            ("tableros", "Tableros (refilando puntas)", tabla(t_refil, H_TAB, num_cols=(1,), wrap_cols=(2,))),
            ("sanas", "Tableros (puntas sanas)", tabla(t_sanas, H_TAB, num_cols=(1,), wrap_cols=(2,))),
            ("compras", "Compras", tabla([[*r[:5], r[2] * r[4] if isinstance(r[4], (int, float)) else "Por cotizar", r[5]] for r in compras]
                                          + [[None, "Total con precio de referencia", None, None, None, total, None]],
                                          ["Grupo", "Ítem", "Cant.", "Unidad", "Precio unitario", "Subtotal", "Nota"], num_cols=(2,), cop_cols=(4, 5), wrap_cols=(6,), tot_pred=lambda r: r[0] is None)),
            ("wpc", "WPC o pino", tabla(wpc, ["", "Set WPC", "Todo en pino"], wrap_cols=(1, 2))),
            ("pendientes", "Pendientes", tabla(pendientes, ["Tema", "Qué falta", "Cuándo"], wrap_cols=(1,)))]
    body = [f'<p><a href="ventana.html">← Ventana de cocina</a> · <a href="propuesta-4-tablillas-pino.html">Ver 3D</a> · '
            f'<a href="despiece-cortasol-pino.xlsx" download>Descargar Excel</a></p>',
            '<span class="tag">Cortasol todo en pino · independiente de los muebles</span><h1>Despiece y compras</h1>',
            '<nav class="tabs">' + "".join(f'<a href="#{a}">{t}</a>' for a, t, _ in secs) + '</nav>',
            f'<p class="note">Marco y tablillas del mismo pino y el mismo barniz. Tableros de {TABLERO["L"]} × {TABLERO["A"]} como referencia: confirmar el formato en el depósito. No suma en compras-proyecto.</p>']
    for a, t, h in secs: body.append(f'<h2 id="{a}">{html.escape(t)}</h2>{h}')
    (RAIZ / "despiece-cortasol-pino.html").write_text(page("Cortasol todo en pino · despiece", "".join(body)), encoding="utf-8")
    print(f"OK: tableros {len(refil)} refilando / {len(sanas)} sanas, ocupación {[round(ocup(b),2) for b in refil]}, "
          f"área {area:.1f} m², barniz {litros:.1f} L, pino {peso_total:.0f} kg")


if __name__ == "__main__":
    main()
