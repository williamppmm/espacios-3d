"""Pedido de corte RH15 en el formato de otros almacenes (p. ej. Impormaderas): medidas en cm y corte real.

Uso, desde la raíz del repositorio:

    python herramientas/build_cortes_impormaderas.py

Lee el pedido conjunto vigente (el mismo de Madecentro, ya auditado) y escribe cortes-impormaderas-RH15-Cartagena.xlsx.
L1 y L2 son los bordes largos (a lo largo de la veta); A1 y A2, los bordes cortos. Corte real: al largo se le descuentan
0,2 cm por cada canto rígido en A1/A2 y al ancho 0,2 cm por cada canto rígido en L1/L2. El flexible de 0,45 mm no se
descuenta, como indicó el almacén.
"""
from pathlib import Path
import openpyxl
from openpyxl.styles import Alignment, Font, PatternFill, Border, Side
import build_compras_proyecto as b

RAIZ = Path(__file__).resolve().parent.parent


def main():
    rows, _ = b.pedido()
    rows = [r for r in rows if b.NO_PEDIR not in str(r[15])]
    wb = openpyxl.Workbook()
    ink, thin = "253B35", Side(style="thin", color="D8E0D8")
    for k, (nombre, es_rh) in enumerate((("RH15 Cartagena", True), ("Fondo RH6 blanco", False))):
        ws = wb.active if k == 0 else wb.create_sheet()
        ws.title = nombre
        src = [r for r in rows if (not ("Fondo" in r[4] or "RH6" in r[4])) == es_rh]
        cab = ["Pieza", "Descripción", "Cantidad", "Largo pedido (cm)", "Ancho pedido (cm)", "Largo corte (cm)", "Ancho corte (cm)",
               "L1", "L2", "A1", "A2", "Observación"]
        anchos = [13, 40, 9, 11, 11, 11, 11, 5, 5, 5, 5, 46]
        for j, (c, w) in enumerate(zip(cab, anchos), 1):
            x = ws.cell(1, j, c); x.font = Font(bold=True, color="FFFFFF"); x.fill = PatternFill("solid", fgColor=ink)
            x.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
            ws.column_dimensions[openpyxl.utils.get_column_letter(j)].width = w
        for i, r in enumerate(src, 2):
            fin = r[13].split(" × ")
            obs = ""
            if r[7] != int(fin[1]) or r[6] != int(fin[0]):
                cm = lambda x: f"{x / 10:g}".replace(".", ",")
                obs = f"Pedida a {cm(r[6])} × {cm(r[7])}; en el armado rebajar a {cm(int(fin[0]))} × {cm(int(fin[1]))} por el borde sin canto."
            vals = [f"{r[0]} {r[1]}", f"{r[2]} · {r[3]}", r[5], r[6] / 10, r[7] / 10,
                    round(r[6] / 10 - 0.2 * r[10:12].count("R"), 2), round(r[7] / 10 - 0.2 * r[8:10].count("R"), 2), *r[8:12], obs]
            for j, v in enumerate(vals, 1):
                c = ws.cell(i, j, v); c.border = Border(bottom=thin)
                c.alignment = Alignment(wrap_text=j in (2, 12), vertical="top", horizontal="center" if 8 <= j <= 11 else None)
            for j in (4, 5, 6, 7):
                ws.cell(i, j).number_format = "0.0#"
        n = len(src) + 1
        ws.cell(n + 2, 1, "Total piezas").font = Font(bold=True); ws.cell(n + 2, 3, sum(ws.cell(k, 3).value for k in range(2, n + 1))).font = Font(bold=True)
        notas = ["Medidas en cm. Largo = sentido de la veta.",
                 "L1 y L2 = bordes largos (a lo largo); A1 y A2 = bordes cortos (las puntas). R = canto rígido 2 mm · F = canto flexible 0,45 mm · — = sin canto.",
                 "Corte real = medida pedida menos 0,2 cm por cada canto rígido del lado correspondiente: los de A1/A2 restan al largo y los de L1/L2 al ancho. El flexible no se descuenta.",
                 "Generado desde el pedido vigente (el mismo de Madecentro), con la pecera incluida."]
        for t, s in enumerate(notas):
            ws.cell(n + 4 + t, 1, s).font = Font(italic=True, color="59675D")
        ws.freeze_panes = "A2"; ws.auto_filter.ref = f"A1:L{n}"
    wb.save(RAIZ / "cortes-impormaderas-RH15-Cartagena.xlsx")
    print("OK cortes-impormaderas-RH15-Cartagena.xlsx:", sum(1 for r in rows), "referencias")


if __name__ == "__main__":
    main()
