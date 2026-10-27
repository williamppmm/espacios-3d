"""Genera las vistas web del despiece (despiece-<slug>.html) a partir de los Excel del repo.

Uso, desde la raíz del repositorio:

    python herramientas/build_despiece.py            # todas las versiones
    python herramientas/build_despiece.py actual     # solo una

Requisitos: Python 3.9+ y openpyxl  (pip install openpyxl).

Cómo funciona
-------------
- Lee despiece-<slug>.xlsx de la raíz del repo y escribe despiece-<slug>.html al lado.
- Usa los VALORES calculados que Excel guarda en el archivo (data_only=True). Por eso el
  Excel debe haberse GUARDADO en Excel/LibreOffice después del último cambio; un .xlsx
  generado por código no trae esos valores y las fórmulas saldrían vacías.
- Si detecta fórmulas sin valor guardado, intenta recalcular con LibreOffice (soffice) en una
  carpeta temporal, sin tocar tu Excel. Si no lo encuentra, se detiene con un aviso.
- El Excel es la fuente de verdad; el HTML es de solo lectura y se regenera, no se edita a mano.
"""
import html, shutil, subprocess, sys, tempfile, openpyxl
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

VERSIONES = [
    dict(slug="propuesta", nombre="Diseño final 260 · condimentero, puertas y basurero"),
    dict(slug="actual", nombre="Cocina 1 · mesón 260 · cajonero único 75"),
    dict(slug="280", nombre="Cocina 2 · mesón 280"),
]


def faltan_valores(xlsx: Path) -> bool:
    """True si alguna celda con fórmula no tiene valor calculado guardado."""
    f = openpyxl.load_workbook(xlsx, data_only=False)
    v = openpyxl.load_workbook(xlsx, data_only=True)
    for ws in f:
        for row in ws.iter_rows():
            for c in row:
                if isinstance(c.value, str) and c.value.startswith("=") and v[ws.title][c.coordinate].value is None:
                    return True
    return False


def buscar_soffice():
    for cand in ("soffice", "libreoffice",
                 r"C:\Program Files\LibreOffice\program\soffice.exe",
                 r"C:\Program Files (x86)\LibreOffice\program\soffice.exe"):
        ruta = shutil.which(cand) or (cand if Path(cand).exists() else None)
        if ruta:
            return ruta
    return None


def con_valores(xlsx: Path, tmp: Path) -> Path:
    """Devuelve un .xlsx con valores calculados: el original o una copia recalculada."""
    if not faltan_valores(xlsx):
        return xlsx
    soffice = buscar_soffice()
    if not soffice:
        sys.exit(f"{xlsx.name}: hay fórmulas sin valor guardado y no encontré LibreOffice.\n"
                 "Abre el archivo en Excel, guárdalo y vuelve a ejecutar.")
    subprocess.run([soffice, "--headless", "--convert-to", "xlsx", "--outdir", str(tmp), str(xlsx)],
                   check=True, capture_output=True)
    return tmp / xlsx.name


CSS = """
:root{--bg:#f7f6f3;--fg:#1f2328;--muted:#5f6670;--card:#fff;--line:#e3e1dc;--acc:#8a5a2b;--acc2:#f1e7dc;--ok:#2f7d4f;--warn:#a1661a}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#15171a;--fg:#e8e6e3;--muted:#9aa0a6;--card:#1d2024;--line:#2e3238;--acc:#d9a46c;--acc2:#2c241c;--ok:#6cc08b;--warn:#e0a85a}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.wrap{max-width:1100px;margin:0 auto;padding:20px 16px 48px}
h1{font-size:1.5rem;margin:.2em 0}h2{font-size:1.15rem;margin:1.6em 0 .5em}
a{color:var(--acc)}.muted{color:var(--muted)}
.cards{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px}
.card h3{margin:0 0 4px;font-size:1.05rem}.card p{margin:.3em 0 .8em}
.btns{display:flex;flex-wrap:wrap;gap:8px}
.btn{display:inline-block;padding:9px 14px;border-radius:8px;background:var(--acc);color:var(--bg);text-decoration:none;font-weight:600;font-size:.92rem}
.btn.sec{background:var(--acc2);color:var(--acc)}
.tag{display:inline-block;font-size:.75rem;padding:2px 8px;border-radius:99px;background:var(--acc2);color:var(--acc);font-weight:600}
nav.tabs{position:sticky;top:0;z-index:2;background:var(--bg);display:flex;gap:6px;overflow-x:auto;padding:10px 0;border-bottom:1px solid var(--line)}
nav.tabs a{white-space:nowrap;padding:6px 12px;border-radius:99px;border:1px solid var(--line);text-decoration:none;color:var(--fg);font-size:.88rem;background:var(--card)}
.tbl{overflow-x:auto;border:1px solid var(--line);border-radius:10px;background:var(--card)}
table{border-collapse:collapse;width:100%;font-size:.85rem}
th,td{padding:6px 9px;border-bottom:1px solid var(--line);vertical-align:top;text-align:left}
th{background:var(--acc2);color:var(--fg);font-weight:600}
td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
tr.tot td{font-weight:700;background:var(--acc2)}
td.wrap{min-width:260px}td:nth-child(2){min-width:140px}
.note{font-size:.85rem;color:var(--muted);margin:.3em 0}
.st-Aplicado{color:var(--ok);font-weight:600}.st-Pendiente,.st-Parcial{color:var(--warn);font-weight:600}
footer{margin-top:32px;font-size:.8rem;color:var(--muted)}
"""

def fmt(v, cop=False):
    if v is None: return ""
    if isinstance(v, bool): return str(v)
    if isinstance(v, (int, float)):
        if cop: return "$" + f"{v:,.0f}".replace(",", ".")
        s = f"{v:,.2f}".rstrip("0").rstrip(".") if isinstance(v, float) and not v.is_integer() else f"{int(v):,}"
        return s.replace(",", "X").replace(".", ",").replace("X", ".")
    return html.escape(str(v))

def page(title, body):
    return f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title><style>{CSS}</style></head>
<body><div class="wrap">{body}</div></body></html>"""

def tabla(rows, header, num_cols=(), cop_cols=(), wrap_cols=(), tot_pred=None, status_col=None):
    out = ['<div class="tbl"><table><thead><tr>']
    out += [f"<th>{html.escape(str(h or ''))}</th>" for h in header]
    out.append("</tr></thead><tbody>")
    for r in rows:
        cls = ' class="tot"' if tot_pred and tot_pred(r) else ""
        out.append(f"<tr{cls}>")
        for i, v in enumerate(r):
            c = []
            if i in num_cols or i in cop_cols: c.append("n")
            if i in wrap_cols: c.append("wrap")
            txt = fmt(v, cop=i in cop_cols)
            if status_col == i and v: txt = f'<span class="st-{html.escape(str(v))}">{txt}</span>'
            if isinstance(v, str) and v.startswith("http"):
                txt = f'<a href="{html.escape(v)}" target="_blank" rel="noopener">enlace</a>'
            out.append(f'<td class="{" ".join(c)}">{txt}</td>' if c else f"<td>{txt}</td>")
        out.append("</tr>")
    out.append("</tbody></table></div>")
    return "".join(out)

def filas(ws, desde, hasta=None, ncols=None):
    res = []
    for r in ws.iter_rows(min_row=desde, max_row=hasta or ws.max_row, values_only=True):
        r = list(r[:ncols] if ncols else r)
        if any(c not in (None, "") for c in r): res.append(r)
    return res

def despiece_html(v):
    wb = openpyxl.load_workbook(v["xlsx_calc"], data_only=True)
    b = [f'<p><a href="./">← Proyecto</a> · <a href="cocina-{v["slug"]}.html">Ver 3D</a> · '
         f'<a href="despiece-{v["slug"]}.xlsx" download>Descargar Excel</a></p>',
         f'<span class="tag">{html.escape(v["nombre"])}</span><h1>Despiece y compras</h1>',
         '<nav class="tabs"><a href="#despiece">Despiece</a><a href="#herrajes">Herrajes</a>'
         '<a href="#compras">Compras</a><a href="#cantos">Cantos</a><a href="#distribucion">Distribución</a>'
         '<a href="#revision">Revisión</a></nav>']

    ws = wb["Despiece"]
    b.append('<h2 id="despiece">Despiece</h2>')
    b += [f'<p class="note">{html.escape(str(ws.cell(i,1).value))}</p>' for i in (1, 2, 3) if ws.cell(i,1).value]
    hdr = [c.value for c in ws[4]][:13]
    rows = filas(ws, 5, ncols=13)
    b.append(tabla(rows, hdr, num_cols=(4, 5, 6, 11, 12), tot_pred=lambda r: r[0] is None))

    ws = wb["Herrajes"]
    b.append('<h2 id="herrajes">Herrajes</h2>')
    rows = filas(ws, 2, ncols=3)
    corte = next((i for i, r in enumerate(rows) if str(r[0]).startswith("Riel seleccionado")), len(rows))
    b.append(tabla(rows[:corte], [c.value for c in ws[1]][:3], num_cols=(1,), wrap_cols=(2,)))
    if corte < len(rows):
        b.append(f"<h2>{html.escape(rows[corte][0])}</h2>")
        b.append(tabla(rows[corte+2:], rows[corte+1], num_cols=(1,), wrap_cols=(2,)))

    ws = wb["Compras"]
    b.append('<h2 id="compras">Compras</h2>')
    rows = filas(ws, 2, ncols=6)
    items = [r for r in rows if r[0]]
    resumen = [r for r in rows if not r[0] and r[1] and r[4] is not None]
    notas = [r[1] for r in rows if not r[0] and r[1] and r[4] is None]
    b.append(tabla(items, [c.value for c in ws[1]][:6], num_cols=(2,), cop_cols=(3, 4), wrap_cols=(5,)))
    res = [[r[1], r[4], r[5]] for r in resumen]
    out = ['<div class="tbl" style="margin-top:12px"><table><tbody>']
    for nombre, val, nota in res:
        cop = isinstance(val, (int, float)) and "Partidas" not in nombre
        cls = ' class="tot"' if "TOTAL" in nombre else ""
        out.append(f'<tr{cls}><td>{html.escape(nombre)}</td><td class="n">{fmt(val, cop=cop)}</td>'
                   f'<td class="wrap">{fmt(nota)}</td></tr>')
    out.append("</tbody></table></div>")
    b.append("".join(out))
    b += [f'<p class="note">{html.escape(n)}</p>' for n in notas]

    ws = wb["Cantos"]
    b.append('<h2 id="cantos">Cantos</h2>')
    rows = filas(ws, 4, 5, ncols=6)
    b.append(tabla(rows, [c.value for c in ws[3]][:6], num_cols=(2, 3, 4, 5), wrap_cols=(1,)))
    extra = filas(ws, 6, ncols=4)
    for r in extra:
        if r[1] is None: b.append(f'<p class="note">{fmt(r[0])}</p>')
        elif r[0] == "N°": continue
        else: b.append(f'<p class="note"><b>{fmt(r[0])} · {fmt(r[1])} ({fmt(r[2])})</b>: {fmt(r[3])}</p>')

    ws = wb["Distribución"]
    b.append('<h2 id="distribucion">Distribución</h2>')
    b.append(f'<p class="note">{fmt(ws["A2"].value)}</p>')
    params = [r for r in filas(ws, 3, 8, ncols=2)]
    hdr_row = next(i for i in range(1, ws.max_row + 1) if ws.cell(i, 1).value == "Elemento")
    b.append(tabla(params, ["Parámetro", "Valor"], num_cols=(1,)))
    rows = [r for r in filas(ws, hdr_row + 1, ncols=8) if r[1] is not None and r[2] is not None]
    b.append('<div style="height:12px"></div>')
    b.append(tabla(rows, [c.value for c in ws[hdr_row]][:8], num_cols=(1, 2, 3, 4, 5), wrap_cols=(6,)))
    for r in filas(ws, hdr_row + 1, ncols=2):
        if r[1] is not None and not any(r[0] == x[0] for x in rows):
            b.append(f'<p class="note">{fmt(r[0])}: <b>{fmt(r[1])}</b></p>')
        elif r[1] is None:
            b.append(f'<p class="note">{fmt(r[0])}</p>')

    ws = wb["Revisión"]
    b.append('<h2 id="revision">Revisión</h2>')
    hdr_row = next(i for i in range(1, 6) if ws.cell(i, 1).value == "Estado")
    rows = filas(ws, hdr_row + 1, ncols=5)
    b.append(tabla(rows, [c.value for c in ws[hdr_row]][:5], wrap_cols=(2, 4), status_col=0))

    b.append(f'<footer>Generado desde <code>despiece-{v["slug"]}.xlsx</code>. El Excel es la fuente; '
             'esta vista es de solo lectura.</footer>')
    return page(f"Despiece · {v['nombre']}", "".join(b))


def main(slugs):
    elegidas = [v for v in VERSIONES if not slugs or v["slug"] in slugs]
    if slugs and len(elegidas) != len(set(slugs)):
        sys.exit("Versión desconocida. Opciones: " + ", ".join(v["slug"] for v in VERSIONES))
    with tempfile.TemporaryDirectory() as t:
        for v in elegidas:
            xlsx = RAIZ / f"despiece-{v['slug']}.xlsx"
            if not xlsx.exists():
                sys.exit(f"No existe {xlsx.name} en {RAIZ}")
            v = dict(v, xlsx_calc=con_valores(xlsx, Path(t)))
            destino = RAIZ / f"despiece-{v['slug']}.html"
            destino.write_text(despiece_html(v), encoding="utf-8", newline="\n")
            print(f"OK  {xlsx.name} -> {destino.name}")


if __name__ == "__main__":
    main(sys.argv[1:])
