"""Despiece del mueble de la pecera PY-800, en RH15 Cartagena, para sumarlo al pedido conjunto de Madecentro.

Uso, desde la raíz del repositorio:

    python herramientas/build_despiece_pecera.py

Escribe assets/models/pecera-data.js (manifiesto, mismo formato que cocina/clóset/baño) y despiece-pecera.xlsx
(hojas Despiece, Pedido de corte, Cantos y Compras, que lee build_compras_proyecto.py).
Las medidas salen de pecera.html con sus valores por defecto: pecera 785 × 340 × 540, mueble de 700 de alto,
armazón de pino 50 × 50 y gola de 28. Si cambian, recalcular en pecera.html y actualizar PIEZAS.
"""
import json
from pathlib import Path
import openpyxl
from openpyxl.styles import Alignment, Font, PatternFill

RAIZ = Path(__file__).resolve().parent.parent
FECHA = "26/11/2026"
MOD = "Mueble pecera"
MAT = "Melamina Cartagena RH 15"
R, F = "2", "0.45"   # rígido 2 mm solo en las puertas; flexible 0,45 mm en el resto

# id, pieza, cant, largo final (veta), ancho final, cantos [L1, L2, A1, A2], ancho a pedir, nota
PIEZAS = [
    ("R1", "Tapa", 1, 820, 380, [F, F, F, F], None, "Se fija desde abajo con escuadras: ningún tornillo en la cara donde apoya la pecera."),
    ("R2", "Lateral", 2, 675, 380, [F, F, F, "—"], None, "Veta vertical. L1 = frente, L2 = atrás, A1 = abajo; arriba queda bajo la tapa."),
    ("R3", "Espaldar estructural", 1, 675, 790, ["—"] * 4, None, "Entre laterales. Cola y tornillo cada 15 cm: impide que el mueble se ladee. Dos pasacables Ø60 en el armado."),
    ("R4", "Piso interior", 1, 790, 350, [F, "—", "—", "—"], None, "Seis destajes con ruteadora en el armado: 4 en las esquinas de 51 × 51 y 2 al centro (frente y fondo) de 52 × 51, para patas y parales. L1 = canto frontal."),
    ("R5", "Puerta", 2, 505, 306, [R, R, R, R], None, "Veta vertical. 2 cazoletas Ø35 a 21,5 mm (centro) del canto."),
    ("R6", "Faja superior", 1, 790, 70, [F, "—", "—", "—"], None, "Tapa los largueros P1; L1 = canto inferior, techo de la gola."),
    ("R7", "Zócalo", 1, 790, 70, [F, F, "—", "—"], None, "Tapa el bastidor inferior y los niveladores. L1 = arriba, L2 = abajo."),
    ("R8", "Pilastra (frente fijo)", 2, 535, 50, [F, "—", "—", "—"], 70,
     "Pedida a 70 mm (final 50): el optimizador de Madecentro no admite piezas de menos de 70 mm, y como lleva canto conviene pedirla cortada y canteada en fábrica. "
     "Canto de fábrica en L1, el borde hacia la puerta; en el armado, rebajar a 50 por L2, que va sin canto contra el lateral."),
    ("R10", "Pilastra central", 1, 535, 70, [F, F, "—", "—"], None, "Pegada al frente del paral central; separa las dos puertas y las dos golas."),
    ("R9", "Fondo de gola", 2, 320, 70, ["—"] * 4, None, "Retranqueado 30 mm detrás de la puerta. Baja detrás de la puerta y no se ve; sellar los bordes sin canto."),
]
PINO = [("P1", "Larguero bastidor superior", 2, 790), ("P2", "Testero / travesaño bastidor superior", 5, 250), ("P3", "Pata / paral", 6, 565),
        ("P4", "Larguero bastidor inferior", 2, 790), ("P5", "Travesaño bastidor inferior", 3, 250)]
COMPRAS = [  # grupo, ítem, cant, unidad, precio, nota
    ("Herrajes", "Bisagra de cazoleta Ø35 codo 18 (puerta embutida), cierre lento", 4, "u", "cotizar", "Base atornillada a la pata de pino con 4 × 16."),
    ("Herrajes", "Nivelador regulable rosca M10 con tuerca de inserción M10", 6, "u", "cotizar", "Capacidad de 100 kg o más cada uno."),
    ("Herrajes", "Escuadra metálica reforzada 60 × 60 mm", 24, "u", "cotizar", "2 arriba y 2 abajo en cada pata y paral."),
    ("Herrajes", "Escuadra pequeña 25–30 mm", 14, "u", "cotizar", "Tapa (8–10) y fondos de gola (4)."),
    ("Herrajes", "Tornillo estructural 5 × 90 mm", 40, "u", "cotizar", "Armazón de pino; pretaladrar Ø3."),
    ("Herrajes", "Tornillo para aglomerado 4 × 40 mm", 100, "u", "cotizar", "Forro a pino y espaldar, cada 15 cm."),
    ("Herrajes", "Tornillo 4 × 16 mm", 60, "u", "cotizar", "Bisagras y escuadras pequeñas."),
    ("Herrajes", "Pasacables Ø60 mm", 2, "u", "cotizar", "En el espaldar, para mangueras y cables."),
    ("Herrajes", "Escuadra de anclaje a pared con chazo y tornillo", 2, "u", "cotizar", "Contra volcamiento."),
    ("Accesorios", "Silicona neutra o sellador de cantos", 1, "tubo", "cotizar", "Cantos sin enchapar y unión tapa–laterales."),
    ("Accesorios", "Manta EVA o espuma 5 mm de 785 × 340", 1, "u", "cotizar", "Solo si el fabricante de la pecera la exige."),
]


def e(x):
    return float(x) if x != "—" else 0.0


def mm(x):
    return f"{round(x, 2):g}".replace(".", ",")


def main():
    parts = [dict(id=i, module=MOD, name=n, qty=q, L=L, A=A, edges=k, material="RH15", note=nota) for i, n, q, L, A, k, _, nota in PIEZAS]
    data = dict(name="Mueble de la pecera PY-800", fecha=FECHA, material="RH15 Cartagena; canto rígido 2 mm en puertas y flexible 0,45 mm en el resto",
                exterior=dict(L=820, P=380, H=700), pecera=dict(L=785, P=340, A=540), parts=parts,
                pino=[dict(id=i, name=n, qty=q, L=L, seccion="50 × 50") for i, n, q, L in PINO],
                nota="Medidas de pecera.html con sus valores por defecto. El pino 50 × 50 va en el pedido a la carpintería.")
    (RAIZ / "assets/models/pecera-data.js").write_text(
        "/* Manifiesto del mueble de la pecera. Generado por herramientas/build_despiece_pecera.py */\n"
        "window.PeceraData = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")

    wb = openpyxl.Workbook()
    bold, head = Font(bold=True), PatternFill("solid", fgColor="253B35")
    def hoja(ws, titulo, nota, cab, anchos, fila=6):
        ws["A1"] = titulo; ws["A1"].font = Font(bold=True, size=14)
        ws["A2"] = nota; ws["A2"].font = Font(italic=True, color="59675D")
        for j, (c, w) in enumerate(zip(cab, anchos), 1):
            x = ws.cell(fila, j, c); x.font = Font(bold=True, color="FFFFFF"); x.fill = head
            x.alignment = Alignment(wrap_text=True, vertical="center")
            ws.column_dimensions[openpyxl.utils.get_column_letter(j)].width = w
    ws = wb.active; ws.title = "Despiece"
    hoja(ws, "Mueble de la pecera · despiece RH15 Cartagena", f"{FECHA} · Medidas finales con canto, en mm; largo en sentido de veta. Canto rígido 2 mm en puertas y flexible 0,45 mm en el resto.",
         ["ID", "Módulo", "Pieza", "Material", "Largo", "Ancho", "Cant.", "Canto L1", "Canto L2", "Canto A1", "Canto A2", "Corte largo", "Corte ancho", "Nota"],
         [6, 15, 26, 24, 8, 8, 6, 8, 8, 8, 8, 10, 10, 80])
    for r, (i, n, q, L, A, k, _, nota) in enumerate(PIEZAS, 7):
        for j, v in enumerate([i, MOD, n, MAT, L, A, q, *k, L - e(k[2]) - e(k[3]), A - e(k[0]) - e(k[1]), nota], 1):
            ws.cell(r, j, v).alignment = Alignment(wrap_text=j == 14, vertical="top")

    ws = wb.create_sheet("Pedido de corte")
    hoja(ws, "Mueble de la pecera · pedido de corte", "R = rígido 2 mm · F = flexible 0,45 mm · — = sin canto. Se suma al pedido conjunto RH15 Cartagena.",
         ["ID", "Módulo", "Pieza", "Material", "Cant.", "Largo a pedir", "Ancho a pedir", "Largo 1", "Largo 2", "Corto 1", "Corto 2", "Canteo", "Medida terminada", "Observaciones"],
         [6, 15, 26, 24, 6, 10, 10, 7, 7, 7, 7, 10, 14, 80])
    for r, (i, n, q, L, A, k, pedir, nota) in enumerate(PIEZAS, 7):
        Ap = pedir or A
        peq = min(L, Ap) < 100 or max(L, Ap) < 250
        letras = [{R: "R", F: "F"}.get(x, "—") for x in k]
        obs = nota
        if peq and any(x != "—" for x in k):
            obs = f"Si no la cantean: cortar a {mm(L - e(k[2]) - e(k[3]))} × {mm(A - e(k[0]) - e(k[1]))} y cantear en el armado. " + nota
        for j, v in enumerate([i, MOD, n, MAT, q, L, Ap, *letras, "Pequeña" if peq else "Normal", f"{L} × {A}", obs], 1):
            ws.cell(r, j, v).alignment = Alignment(wrap_text=j == 14, vertical="top")

    ws = wb.create_sheet("Cantos")
    hoja(ws, "Mueble de la pecera · canto", "Metros netos con medidas finales y número de bordes.", ["Tipo", "", "Metros netos", "Bordes"], [20, 4, 14, 10])
    tot = {}
    for tipo in (R, F):
        neto = sum(q * ((k[0] == tipo) * L + (k[1] == tipo) * L + (k[2] == tipo) * A + (k[3] == tipo) * A) for _, _, q, L, A, k, _, _ in PIEZAS) / 1000
        tot[tipo] = (round(neto, 3), sum(q * sum(x == tipo for x in k) for _, _, q, _, _, k, _, _ in PIEZAS))
    ws["A7"], (ws["C7"], ws["D7"]) = "Rígido 2 mm", tot[R]
    ws["A8"], (ws["C8"], ws["D8"]) = "Flexible 0,45 mm", tot[F]

    ws = wb.create_sheet("Compras")
    hoja(ws, "Mueble de la pecera · herrajes e insumos", "Tablero, canto y corte van en el pedido conjunto; el pino 50 × 50, en el pedido a la carpintería.",
         ["Grupo", "Ítem", "Cant.", "Unidad", "Precio", "Nota"], [14, 60, 8, 10, 10, 60])
    for r, f in enumerate(COMPRAS, 7):
        for j, v in enumerate(f, 1):
            ws.cell(r, j, v)
    wb.save(RAIZ / "despiece-pecera.xlsx")
    print(f"OK pecera: {len(PIEZAS)} referencias, {sum(p[2] for p in PIEZAS)} piezas; rígido {tot[R][0]} m en {tot[R][1]} bordes, flexible {tot[F][0]} m en {tot[F][1]} bordes")


if __name__ == "__main__":
    main()
