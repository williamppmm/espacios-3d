"""Audita despiece-bano.xlsx frente al manifiesto compartido del visor; solo lectura."""
from pathlib import Path
import json,math,openpyxl
R=Path(__file__).resolve().parent.parent
raw=(R/'assets/models/bano-data.js').read_text(encoding='utf-8');d=json.loads(raw[raw.index('{'):raw.rindex('}')+1]);w=openpyxl.load_workbook(R/'despiece-bano.xlsx',data_only=True);f=openpyxl.load_workbook(R/'despiece-bano.xlsx',data_only=False)
s=w['Despiece'];p=w['Pedido de corte'];edge=lambda x:float(x) if str(x) in ('2','0.45') else 0
for i,part in enumerate(d['parts']+d['extras'],7):
 assert [s.cell(i,c).value for c in (1,5,6,7,8)]==[part[k] for k in ('id','qty','L','A','t')],part['id']
 assert [s.cell(i,c).value for c in (10,11,12,13)]==part['edges'],part['id']
 assert abs(s.cell(i,14).value-(part['L']-edge(part['edges'][2])-edge(part['edges'][3])))<1e-7,part['id']
 assert abs(s.cell(i,15).value-(part['A']-edge(part['edges'][0])-edge(part['edges'][1])))<1e-7,part['id']
 assert abs(s.cell(i,9).value-part['L']*part['A']*part['qty']/1e6)<1e-7
 for pose in part['placements']:
  b=pose['bounds'];dims=sorted(b[j+1]-b[j] for j in (0,2,4));assert all(abs(a-b)<1e-7 for a,b in zip(dims,sorted([part['L'],part['A'],part['t']]))),part['id']
 if i<7+len(d['parts']):
  cuts=[s.cell(i,c).value for c in (14,15)];small=min(cuts)<p['Q3'].value or max(cuts)<p['Q4'].value
  assert p.cell(i,12).value==('Pequeña' if small else 'Normal'),part['id']
for row,ty in [(7,'2'),(8,'0.45')]:
 net=count=man=mn=0
 for i,part in enumerate(d['parts'],7):
  for j,e in enumerate(part['edges']):
   if e!=ty:continue
   length=(part['L'] if j<2 else part['A'])*part['qty']/1000;net+=length;count+=part['qty']
   if p.cell(i,12).value=='Pequeña':man+=length;mn+=part['qty']
 if ty=='0.45':
  diagonal=d['parts'][5]['L']/math.sin(math.radians(d['frontSplit']['angle']))/1000;net+=2*diagonal;count+=2;man+=2*diagonal;mn+=2
 c=w['Cantos'];assert abs(c.cell(row,2).value-net)<1e-7;assert c.cell(row,3).value==count;assert abs(c.cell(row,6).value-man)<1e-7;assert c.cell(row,7).value==mn;assert c.cell(row,8).value==(math.ceil((man+mn*.1)*1.2) if mn else 0)
assert s['E24'].value==17 and s['E25'].value==1
assert abs(s['I24'].value-1.538983)<1e-7 and abs(s['I25'].value-.221216)<1e-7
assert not [(sh.title,c.coordinate,c.value) for sh in w for row in sh for c in row if c.data_type=='e']
assert all(w[sh.title][c.coordinate].value is not None for sh in f for row in sh for c in row if c.data_type=='f')
print('OK: 17 paneles RH15 (18 piezas montadas) + 1 fondo RH6; espejo y granito aparte; cortes, cantos, piezas pequenas y valores calculados coherentes.')
print('RH15:1,538983 m2; RH6:0,221216 m2. Compra conjunta con cocina y clóset en compras-proyecto.xlsx.')
"""Los recortes, la division diagonal y los soportes siguen sujetos a confirmacion de taller; esto no certifica cargas."""
