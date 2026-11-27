"""Pedido de corte compacto: las piezas pequeñas se piden unidas en tiras para que el almacén las corte y cantee.

Uso, desde la raíz del repositorio:

    python herramientas/build_cortes_compacto.py

Mismo formato que cortes-impormaderas-RH15-Cartagena.xlsx (cm, L1 L2 A1 A2, corte real). Une, punta con punta y a lo largo
de la veta, las piezas pequeñas (lado menor < 100 mm o lado mayor < 250 mm) que tienen el mismo material, el mismo ancho y el
mismo canto en los bordes largos. El almacén cantea los bordes largos de la tira y sus dos puntas; en casa se corta la tira con
5 mm entre piezas y se cantean a mano, con flexible, solo las puntas interiores que lo necesitan.
"""
from pathlib import Path
from collections import defaultdict
import openpyxl
from openpyxl.styles import Alignment, Font, PatternFill, Border, Side
import build_compras_proyecto as b

RAIZ = Path(__file__).resolve().parent.parent
MAXL, SEP, CORTA = 2400, 5, 300   # largo máximo de tira, separación entre piezas (disco + escuadrado) y largo bajo el cual una pieza es «corta»
ink, thin = "253B35", Side(style="thin", color="D8E0D8")


def pequena(r):
    return min(r[6], r[7]) < 100 or max(r[6], r[7]) < 250


def material(r):
    return "RH6" if ("Fondo" in r[4] or "RH6" in r[4]) else "RH15"


def tiras(unidades):
    """Empaca unidades (id, largo, punta1, punta2) en tiras de hasta MAXL, de mayor a menor."""
    cajas = []
    for u in sorted(unidades, key=lambda u: -u[1]):
        for c in cajas:
            if sum(x[1] for x in c) + SEP * len(c) + u[1] <= MAXL:
                c.append(u); break
        else:
            cajas.append([u])
    out = []
    for c in cajas:
        canteadas = [u for u in c if u[2] != "—"]
        lisas = [u for u in c if u[2] == "—"]
        out.append(canteadas[:1] + lisas + canteadas[1:])   # canteadas en los extremos si son dos o menos
    return out


def main():
    rows, _ = b.pedido()
    rows = [r for r in rows if b.NO_PEDIR not in str(r[15])]
    wb = openpyxl.Workbook()
    detalle = []
    for k, mat in enumerate(("RH15", "RH6")):
        ws = wb.active if k == 0 else wb.create_sheet()
        ws.title = "RH15 Cartagena" if mat == "RH15" else "Fondo RH6 blanco"
        src = [r for r in rows if material(r) == mat]
        # Entran a una tira las pequeñas CORTAS (menos de CORTA mm de largo) y las pequeñas sin canto en las puntas
        # (unirlas no agrega canteado a mano). Las largas con canto en las puntas se piden sueltas.
        unible = lambda r: pequena(r) and (r[6] < CORTA or (r[10] == "—" and r[11] == "—"))
        normales = [r for r in src if not unible(r)]
        grupos = defaultdict(list)
        for r in src:
            if unible(r):
                grupos[(r[7], tuple(sorted(r[8:10], key=lambda e: e == "—")))].append(r)
        filas, sueltas = [], []
        n_t = len({d[0] for d in detalle}) + 1
        for (ancho, (l1, l2)), rs in sorted(grupos.items()):
            unidades = [(f"{r[0]} {r[1]}", r[6], *sorted(r[10:12], key=lambda e: e == "—"), r) for r in rs for _ in range(r[5])]
            if len(unidades) == 1:
                sueltas.append(rs[0]); continue
            for t in tiras(unidades):
                if len(t) == 1:
                    sueltas.append(t[0][4]); continue
                nombre = f"Tira T{n_t:02d}"; n_t += 1
                largo = sum(u[1] for u in t) + SEP * (len(t) - 1)
                # punta izquierda: la punta canteada de la primera pieza; derecha: la de la última
                a1 = t[0][2]
                a2 = t[-1][2]
                mano = 0; cortes = []; x = 0
                for j, u in enumerate(t):
                    puntas = [p for p in (u[2], u[3]) if p != "—"]
                    externas = (1 if j == 0 and a1 != "—" else 0) + (1 if j == len(t) - 1 and a2 != "—" else 0)
                    mano += max(0, len(puntas) - externas)
                    cortes.append(f"{u[0]} {u[1] / 10:g}".replace(".", ","))
                    detalle.append([nombre, j + 1, u[0], u[4][3], u[1] / 10, ancho / 10, x / 10, (x + u[1]) / 10,
                                    str(len(puntas)) if puntas else "—",
                                    ("Almacén" if externas else "") + (" + a mano" if len(puntas) > externas else "") or "Sin canto en las puntas",
                                    u[4][15][:160]])
                    x += u[1] + SEP
                obs = (f"Une {len(t)} piezas: " + " | ".join(cortes) + f". Cortar en casa con {SEP} mm entre piezas (ver hoja «Tiras - cómo cortarlas»)."
                       + (f" Cantear a mano {mano} punta(s) con flexible." if mano else " Sin canto a mano."))
                filas.append([nombre, f"{len(t)} piezas de {ancho / 10:g} cm de ancho".replace(".", ","), 1, largo, ancho, l1, l2, a1, a2, obs])
        cab = ["Pieza", "Descripción", "Cantidad", "Largo pedido (cm)", "Ancho pedido (cm)", "Largo corte (cm)", "Ancho corte (cm)",
               "L1", "L2", "A1", "A2", "Observación"]
        for j, (c, w) in enumerate(zip(cab, [13, 40, 9, 11, 11, 11, 11, 5, 5, 5, 5, 60]), 1):
            x_ = ws.cell(1, j, c); x_.font = Font(bold=True, color="FFFFFF"); x_.fill = PatternFill("solid", fgColor=ink)
            x_.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
            ws.column_dimensions[openpyxl.utils.get_column_letter(j)].width = w
        todas = []
        for r in sorted(normales + sueltas, key=lambda r: rows.index(r)):
            fin = r[13].split(" × ")
            obs = ""
            if r[7] != int(fin[1]) or r[6] != int(fin[0]):
                cm = lambda v: f"{v / 10:g}".replace(".", ",")
                obs = f"Pedida a {cm(r[6])} × {cm(r[7])}; en el armado rebajar a {cm(int(fin[0]))} × {cm(int(fin[1]))} por el borde sin canto."
            todas.append([f"{r[0]} {r[1]}", f"{r[2]} · {r[3]}", r[5], r[6], r[7], *r[8:12], obs])
        todas += [[f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7], f[8], f[9]] for f in filas]
        for i, f in enumerate(todas, 2):
            vals = [f[0], f[1], f[2], f[3] / 10, f[4] / 10, round(f[3] / 10 - 0.2 * f[7:9].count("R"), 2), round(f[4] / 10 - 0.2 * f[5:7].count("R"), 2), *f[5:9], f[9]]
            for j, v in enumerate(vals, 1):
                c = ws.cell(i, j, v); c.border = Border(bottom=thin)
                c.alignment = Alignment(wrap_text=j in (2, 12), vertical="top", horizontal="center" if 8 <= j <= 11 else None)
            for j in (4, 5, 6, 7):
                ws.cell(i, j).number_format = "0.0#"
            if str(f[0]).startswith("Tira"):
                for j in range(1, 13):
                    ws.cell(i, j).fill = PatternFill("solid", fgColor="FFF1C9")
        n = len(todas) + 1
        ws.cell(n + 2, 1, "Total piezas").font = Font(bold=True); ws.cell(n + 2, 3, sum(ws.cell(k, 3).value for k in range(2, n + 1))).font = Font(bold=True)
        for t_, s in enumerate(["Medidas en cm. Largo = sentido de la veta. L1 y L2 = bordes largos; A1 y A2 = puntas. R = rígido 2 mm · F = flexible 0,45 mm · — = sin canto.",
                                "Corte real = medida pedida menos 0,2 cm por cada canto rígido del lado correspondiente; el flexible no se descuenta.",
                                "Filas amarillas = tiras con varias piezas pequeñas unidas punta con punta (misma veta, mismo ancho y mismo canto en los bordes largos). "
                                "El almacén cantea los bordes largos y las dos puntas de la tira; en casa se corta y se cantean a mano las puntas interiores indicadas."]):
            ws.cell(n + 4 + t_, 1, s).font = Font(italic=True, color="59675D")
        ws.freeze_panes = "A2"; ws.auto_filter.ref = f"A1:L{n}"
    wt = wb.create_sheet("Tiras - cómo cortarlas")
    cab = ["Tira", "Orden", "Pieza", "Nombre", "Largo (cm)", "Ancho (cm)", "Desde (cm)", "Hasta (cm)", "Puntas con canto", "Quién cantea las puntas", "Observación original"]
    for j, (c, w) in enumerate(zip(cab, [10, 7, 14, 34, 10, 10, 10, 10, 14, 20, 70]), 1):
        x_ = wt.cell(1, j, c); x_.font = Font(bold=True, color="FFFFFF"); x_.fill = PatternFill("solid", fgColor=ink)
        x_.alignment = Alignment(wrap_text=True, vertical="center"); wt.column_dimensions[openpyxl.utils.get_column_letter(j)].width = w
    for i, d in enumerate(detalle, 2):
        for j, v in enumerate(d, 1):
            wt.cell(i, j, v).alignment = Alignment(wrap_text=j in (4, 11), vertical="top")
    wt.cell(len(detalle) + 3, 1, f"«Desde» y «Hasta» se miden desde la punta A1 de la tira. Entre pieza y pieza quedan {SEP} mm para el disco y el escuadrado. "
            "Marcar cada pieza con su código antes de cortar.").font = Font(italic=True, color="59675D")
    wb.save(RAIZ / "cortes-compacto-RH15-Cartagena.xlsx")
    ws = wb["RH15 Cartagena"]
    n_tiras = len({d[0] for d in detalle}); unidas = len(detalle)
    print(f"OK cortes-compacto-RH15-Cartagena.xlsx: {n_tiras} tiras que reúnen {unidas} piezas pequeñas")
    for d in detalle:
        print(" ", d[0], d[1], d[2], d[4], "×", d[5], d[8], "→", d[9])


if __name__ == "__main__":
    main()
