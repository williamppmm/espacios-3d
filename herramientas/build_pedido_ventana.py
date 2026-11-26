from pathlib import Path
import os,json,textwrap
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4,landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph,Table,TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
root=Path(__file__).resolve().parent.parent;tmp=Path(os.environ['TEMP'])/'ventana-material-local';tmp.mkdir(exist_ok=True);d=json.loads((root/'herramientas/ventana_pino_corte.json').read_text(encoding='utf-8'))
for name,file in [('Arial','arial.ttf'),('ArialBold','arialbd.ttf')]:pdfmetrics.registerFont(TTFont(name,str(Path('C:/Windows/Fonts')/file)))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='ArialBold',italic='Arial',boldItalic='ArialBold')
W,H=landscape(A4);margin=34;usable=W-2*margin
ink=colors.HexColor('#253b35');gray=colors.HexColor('#59675d');pale=colors.HexColor('#e9f0e9');amber=colors.HexColor('#fff0cd')
path=root/'pedido-corte-ventana-pino.pdf';c=canvas.Canvas(str(path),pagesize=(W,H));c.setTitle('Pedido de corte - ventana de pino - 9 tablas y 4 bastidores')
style=ParagraphStyle('body',fontName='Arial',fontSize=9.3,leading=12.5,textColor=ink)
small=ParagraphStyle('small',parent=style,fontSize=8.5,leading=11)
head=ParagraphStyle('head',parent=small,fontName='ArialBold',textColor=colors.white)
def p(text,x,y,width=usable,sty=style):
 obj=Paragraph(text,sty);ww,hh=obj.wrap(width,999);obj.drawOn(c,x,y-hh);return y-hh

def title(page,title,sub):
 c.setFillColor(ink);c.setFont('ArialBold',21);c.drawString(margin,H-45,title)
 p(sub,margin,H-58)
 c.setStrokeColor(colors.HexColor('#ccd7cc'));c.line(margin,29,W-margin,29)
 c.setFillColor(gray);c.setFont('Arial',8);c.drawString(margin,17,'25/11/2026 · Ventana con madera local · Todas las medidas en milímetros')
 c.drawRightString(W-margin,17,str(page)+' / 5')

def table(rows,widths,x,y):
 styled=[[Paragraph(str(v),head if i==0 else small) for v in row] for i,row in enumerate(rows)]
 t=Table(styled,colWidths=widths,hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),ink),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('LINEBELOW',(0,0),(-1,-1),.35,colors.HexColor('#d8e0d8')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f3f6f1')])]))
 tw,th=t.wrap(usable,999);t.drawOn(c,x,y-th);return y-th

def bar(x,y,width,segments,total=3000,height=32):
 at=x
 for length,label,color in segments:
  sw=width*length/total;c.setFillColor(color);c.rect(at,y,sw,height,fill=1,stroke=0)
  c.setStrokeColor(colors.white);c.rect(at,y,sw,height,fill=0,stroke=1)
  if sw>40:
   c.setFillColor(ink);c.setFont('ArialBold',8.5);c.drawCentredString(at+sw/2,y+height/2-3,label)
  at+=sw

title(1,'Pedido de corte · ventana de pino','9 tablas de 3000–3020 × 220 × 20, cepilladas a 15 mm. 4 bastidores con sección final 100 × 40 mm.')
y=H-91
rows=[['Pieza','Cant.','Entrega del taller','Medida final en armado']]
for row in d['parts']:
 if row[0]=='R01':continue
 delivery=('Entero, útil ≥3010 × 100 × 40' if row[0] in ('V01','V02') else f'{row[4]} × {row[5]} × {row[6]}')
 rows.append([row[1],row[2],delivery,f'{row[7]} × {row[8]} × {row[9]}'])
y=table(rows,[235,45,245,usable-525],margin,y)
y=p('<b>Para entregar al taller</b> · Anchos y espesores terminados. Los largos llevan margen para ajustar en casa. Identificar piezas y entregar todos los retales: uno de al menos 200 × 100 × 15 para separadores y pruebas, y los sobrantes de bastidor para topes y calces de 20.',margin,y-13)
y=p('<b>Rieles</b> · Escoger dos bastidores enteros y sanos, preferiblemente de 3020 y con al menos 3010 útiles. Si solo hay 3000, usar la alternativa de la página 3.',margin,y-10)
p('<b>Mecanizado</b> · Canal, taladros y topes se realizan en el armado con una prueba del mecanismo real. Las tablillas de repuesto reciben el mismo cepillado y acabado.',margin,y-10)
c.showPage()

title(2,'Cómo cortar las 9 tablas','Cepillar primero a 15 mm con caras paralelas. Sanear los cantos conservando al menos 210 mm útiles. Disco previsto de 4 mm.')
y=H-100
c.setFont('ArialBold',13);c.setFillColor(ink);c.drawString(margin,y,'Tablas 1 a 7 · cuatro tablillas por tabla')
bar(margin,y-48,usable,[(1180,'Paño 1180',pale),(1180,'Paño 1180',pale),(640,'Retal ancho',amber)])
y=p('En cada paño de 1180, sacar <b>dos tiras de 100 × 15</b>. Resultado de estas siete tablas: <b>28 tablillas de 1180 × 100 × 15</b>. Queda un retal ancho de unos 620–650 de largo por tabla, según largo real, disco y saneado.',margin,y-60)
y-=28;c.setFont('ArialBold',13);c.drawString(margin,y,'Tablas 8 y 9 · dos tablillas y las carteras largas por tabla')
bar(margin,y-48,usable,[(1180,'Paño 1180',pale),(1550,'Paño largo 1550',colors.HexColor('#d5e4da')),(270,'Retal',amber)])
y=p('Del paño de 1180 salen <b>dos tablillas de 100 × 15</b>. Del paño de 1550 salen <b>una tira de 100 y dos de 50</b>, todas de 15 mm de espesor. Con disco de 4 mm, 100 + 4 + 50 + 4 + 50 = <b>208 mm</b>, dentro de los 210 útiles.',margin,y-61)
# Esquema de reparto al ancho del paño largo.
y-=17
x=margin;bh=38;scale=usable/220
for ww,label in [(100,'Solapa superior · 100'),(4,' '),(50,'Cartera · 50'),(4,' '),(50,'Cartera · 50'),(12,'Margen')]:
 c.setFillColor(pale if ww in (100,50) else amber);c.rect(x,y-bh,ww*scale,bh,fill=1,stroke=0)
 if ww>20:c.setFillColor(ink);c.setFont('ArialBold',9);c.drawCentredString(x+ww*scale/2,y-bh/2-3,label)
 x+=ww*scale
y=p('Resultado conjunto de las tablas 8 y 9: <b>4 tablillas, 2 solapas de 1550 × 100 × 15 y 4 carteras de 1550 × 50 × 15</b>. Terminar las carteras y solapas a 1540 al presentar el marco.',margin,y-bh-12)
p('<b>Total</b> · 32 tablillas: 30 para montar y 2 de repuesto. Sacar de los retales un remate de 150 × 50 × 15, para terminar nominalmente a 130 × 50 × 15. Los esquemas muestran las piezas; el disco y el saneado se reservan fuera de esas longitudes.',margin,y-11)
c.showPage()

title(3,'Bastidores y armado del marco','Los costados son de altura completa. Los dos horizontales se colocan entre ellos y el montante central entre los horizontales.')
y=H-92
rows=[['Bastidor','Corte del taller','Final de montaje','Identificación']]
rows.extend([[1,'Entregar entero, útil ≥3010',3000,'Riel inferior'],[2,'Entregar entero, útil ≥3010',3000,'Riel superior'],[3,'2 tramos de 1280','2 × 1256','Costados completos'],[4,'1 tramo de 1200',1176,'Montante central']])
y=table(rows,[65,260,180,usable-505],margin,y)
# Alzado frontal a escala, acotado y con piezas claramente identificadas.
x=margin+25;y0=85;sw=360/3080;fw=3080*sw;fh=1256*sw;t=40*sw
c.setFillColor(pale)
for xx in [x,x+fw-t]:c.rect(xx,y0,t,fh,fill=1,stroke=0)
for yy in [y0,y0+fh-t]:c.rect(x+t,yy,fw-2*t,t,fill=1,stroke=0)
c.rect(x+fw/2-t/2,y0+t,t,fh-2*t,fill=1,stroke=0)
c.setStrokeColor(ink);c.rect(x,y0,fw,fh,fill=0,stroke=1)
c.setFillColor(ink);c.setFont('ArialBold',10);c.drawCentredString(x+fw/2,y0+fh+14,'3080 exterior = 40 + 3000 + 40')
c.drawCentredString(x+fw*.25,y0+fh*.55,'1480 libres');c.drawCentredString(x+fw*.75,y0+fh*.55,'1480 libres')
c.setFont('Arial',9);c.drawCentredString(x+fw/2,y0-16,'1256 de alto = 40 + 1176 + 40; tablillas finales 1170')
xx=x+fw+23;yy=y0+fh+20
for text in [
 '<b>Control de obra</b> · Confirmar vano 3080 × 1260 y marco de 1256. Medir tres puntos y diagonales antes del corte final.',
 '<b>Si solo hay bastidores de 3000</b> · Terminar rieles a 2990. Exterior del marco 3070; quedan 10 mm para ajuste en el vano de 3080. Carteras finales: 1535 + 1535 por cara. Registrar la elección y recalcular la plantilla del mecanismo.',
 '<b>Prueba del mecanismo</b> · Rebaje propuesto 45 × 18 abierto al patio; deja 22 mm de lomo. Pasador a 32 mm del eje, barras de 1430. Validar con los pines reales antes de mecanizar; solapa desmontable con 15 mm de separación al marco.',
 ]:
 yy=p(text,xx,yy,usable-fw-48,small)-10
c.showPage()
title(4,'Uniones ocultas y orden de armado','Detalle de referencia para carpintería. Las cotas de corte siguen siendo las de las páginas anteriores.')
y=H-91
rows=[['Accesorio','Instalado / compra orientativa','Dónde se usa']]
rows += [
 ['Tarugo Ø8 × 50', '12 / comprar 16','Dos por unión; seis uniones. Encolar y alojar unos 25 mm en cada pieza. Paquete de 100 de Mercado Libre.'],
 ['Tornillo Deck Ruspert 10 × 3½"','12 / comprar 16','Esquinas desde cantos exteriores de costados. Montante desde arriba/abajo de rieles. Pretaladro y tapones.'],
 ['Tapón de pino Ø10','Según cabezas expuestas','Tapa la cabeza sin dejar metal al frente; verificar rebaje según tornillo real.'],
 ['Pegante PVA D3','Frasco de unos 500 ml','Resistente al agua: Titebond II o III, o marca nacional cuya etiqueta diga D3, resistente al agua o exterior.'],
 ['Calces al poste','3 de 100 × 80 × 20','Desde retal de bastidor 4. Rellenan los 20 mm que deja el marco más delgado hacia el poste.'],
 ['Separadores de solapa','Desde retal, espesor 15','Dejan 15 mm entre cara patio del marco y cara interior de solapa; probar paso libre de barra.'],
]
y=table(rows,[140,180,usable-320],margin,y)
for text in [
 '<b>1. Presentar en seco.</b> Riel inferior de 3000 entre costados completos de 1256. Montante de 1176 entre horizontales. Comprobar escuadra y diagonales; dejar holgura real de instalación.',
 '<b>2. Encolar y atornillar.</b> Tarugos más tornillos, con las superficies de unión sin barniz. En esquinas los tornillos entran lateralmente; en el central, verticalmente desde rieles. Prensar y respetar la ficha del adhesivo; no solicitar las uniones durante al menos 24 horas.',
 '<b>3. Probar el mecanismo.</b> Ensayo con tres tablillas y herrajes recibidos. Pin de Ø10 deja 2,5 mm por cara en pino de 15; comprobar ajuste sin rajar. Rebaje abierto al patio y topes se aprueban en la prueba.',
 '<b>4. Instalar.</b> Apoyo nivelado y calzado sobre el antepecho; elegir anclajes según ladrillo real. Carteras desde detrás; solapa superior desmontable. El cielo raso necesita soporte propio.',
 '<b>Visualizar el armado:</b> abrir propuesta-4-tablillas-pino.html, elegir Armado paso a paso, mover el control y pulsar Separar piezas. La vista Unión oculta muestra la esquina.',
 '<b>Paso a paso completo:</b> página 5, guía de armado.',
]:
 y=p(text,margin,y-10,sty=small)
c.showPage()
title(5,'Guía de armado','Probar, mecanizar, inmunizar, barnizar las tablillas sueltas, armar el marco con madera limpia y barnizarlo ya armado.')
rows=[['Paso','Etapa','Qué hacer','Cuidado']]+[[s[0],'<b>'+s[1]+'</b>',s[2],s[3]] for s in d['assembly']]
guide=ParagraphStyle('guide',parent=small,fontSize=8.8,leading=11)
styled=[[Paragraph(str(v),head if i==0 else guide) for v in row] for i,row in enumerate(rows)]
t=Table(styled,colWidths=[34,112,(usable-146)*.53,(usable-146)*.47],hAlign='LEFT')
t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),ink),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('LINEBELOW',(0,0),(-1,-1),.35,colors.HexColor('#d8e0d8')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f3f6f1')])]))
tw,th=t.wrap(usable,999);assert th<H-115,th;t.drawOn(c,margin,H-78-th)
c.save()
print('OK PDF',path)
# Renderizar todas las páginas para inspección.
import fitz
pdf=fitz.open(path)
assert len(pdf)==5
for i,page in enumerate(pdf):page.get_pixmap(matrix=fitz.Matrix(1.3,1.3)).save(tmp/f'pdf-{i+1}.png')
