"""Comprueba canto único, medidas y coherencia entre los tres muebles y sus pedidos.

Solo lectura. Uso: python herramientas/auditar_cantos.py
"""
from pathlib import Path
import json,openpyxl
import build_compras_proyecto as b

R=Path(__file__).resolve().parent.parent
for slug,first,cols in [('cocina',5,(5,6,7,8,12)),('closet',7,(5,6,4,9,13)),('bano',7,(6,7,5,10,14))]:
    t=(R/f'assets/models/{slug}-data.js').read_text(encoding='utf8')
    d=json.loads(t[t.index('{'):t.rindex('}')+1])
    w=openpyxl.load_workbook(R/f'despiece-{slug}.xlsx',data_only=True)
    f=openpyxl.load_workbook(R/f'despiece-{slug}.xlsx',data_only=False)
    s=w['Despiece'];lc,ac,qc,ec,cc=cols
    rows={s.cell(i,1).value:i for i in range(first,s.max_row+1)}
    for p in d['parts']:
        i=rows[p['id']]
        assert len(set(p['edges'])-{'—'})<=1,(slug,p['id'],'mezcla de tipos')
        assert [s.cell(i,c).value for c in (lc,ac,qc)]==[p['L'],p['A'],p['qty']],(slug,p['id'],'medidas')
        assert [s.cell(i,ec+j).value for j in range(4)]==p['edges'],(slug,p['id'],'cantos')
        e=lambda j:float(p['edges'][j]) if p['edges'][j]!='—' else 0
        assert abs(s.cell(i,cc).value-(p['L']-e(2)-e(3)))<1e-7
        assert abs(s.cell(i,cc+1).value-(p['A']-e(0)-e(1)))<1e-7
    assert not [(sh.title,c.coordinate,c.value) for sh in w for row in sh for c in row if c.data_type=='e']
    assert all(w[sh.title][c.coordinate].value is not None for sh in f for row in sh for c in row if c.data_type=='f')
    print('OK',slug,': canto único, medidas del modelo y descuentos del tablero')

rows,_=b.pedido();rows=[r for r in rows if b.NO_PEDIR not in str(r[15])]
w=openpyxl.load_workbook(R/'compras-proyecto.xlsx',data_only=True)
actual=[[w['Pedido de corte'].cell(i,c).value for c in range(1,17)] for i in range(7,7+len(rows))]
assert actual==rows,'Consolidado desactualizado'
for material,name in [('RH15','cortes-madecentro-RH15-Cartagena-medidas-finales.xlsx'),('RH6','cortes-madecentro-fondo-RH6-blanco-medidas-finales.xlsx')]:
    path=R/name
    if not path.exists():continue
    s=openpyxl.load_workbook(path,data_only=True)['Cortes']
    src=[r for r in rows if ('RH6' if ('Fondo' in r[4] or 'RH6' in r[4]) else 'RH15')==material]
    for i,r in enumerate(src,2):
        assert [s.cell(i,c).value for c in (1,2,3)]==[r[6],r[7],r[5]]
        assert [s.cell(i,c).value for c in (6,7,8,9)]==[{'R':'Rígido 2 mm','F':'Flexible 0,45 mm'}.get(e) for e in r[8:12]]
    assert len(src)==sum(s.cell(i,1).value is not None for i in range(2,s.max_row+1))
    print('OK formato',material,':',len(src),'referencias con medidas finales y tipo único')
print('OK pedido conjunto:',len(rows),'referencias; sin diferencias con los despieces')
