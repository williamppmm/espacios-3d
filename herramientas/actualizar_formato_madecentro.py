"""Actualiza el formato RH15 existente desde el pedido conjunto, conservando su plantilla."""
from pathlib import Path
import json, subprocess, tempfile
import build_compras_proyecto as b

ROOT = Path(__file__).resolve().parent.parent
if __name__ == '__main__':
    rows, _ = b.pedido()
    rows = [r for r in rows if b.NO_PEDIR not in str(r[15]) and not ('Fondo' in r[4] or 'RH6' in r[4])]
    with tempfile.TemporaryDirectory(prefix='madecentro-') as temp:
        source = Path(temp) / 'pedido.json'
        source.write_text(json.dumps(rows, ensure_ascii=False), encoding='utf-8')
        subprocess.run(['node', str(ROOT/'herramientas/actualizar_formato_madecentro.mjs'), str(source)], check=True)
