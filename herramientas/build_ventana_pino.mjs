import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
const {Workbook,SpreadsheetFile}=await import(pathToFileURL(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs')).href);
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),dir=path.join(os.tmpdir(),'ventana-material-local');
await fs.mkdir(dir,{recursive:true});
const d=JSON.parse(await fs.readFile(path.join(root,'herramientas/ventana_pino_corte.json'),'utf8'));
const wb=Workbook.create(),ink='#253B35',paper='#EDF2ED',amber='#FFF1C9';
function sheet(name,title,note,headers,widths,rows,height=65){
 const s=wb.worksheets.add(name);s.showGridLines=false;
 s.getRange('A2').values=[[title]];s.getRange('A2').format.font={name:'Arial',size:15,bold:true,color:ink};
 s.getRange('A3').values=[[note]];s.getRange('A3').format.font={name:'Arial',size:10,italic:true,color:'#59675D'};
 const head=s.getRangeByIndexes(5,0,1,headers.length);head.values=[headers];head.format={font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},fill:ink,wrapText:true,rowHeight:38,verticalAlignment:'center'};
 const body=s.getRangeByIndexes(6,0,rows.length,headers.length);body.values=rows;body.format.font={name:'Arial',size:10};body.format.wrapText=true;body.format.verticalAlignment='center';body.format.rowHeight=height;
 widths.forEach((w,i)=>s.getRangeByIndexes(0,i,1,1).format.columnWidth=w);
 s.freezePanes.freezeRows(6);return s;
}
const order=sheet('Pedido a la carpintería','Ventana de pino · pedido a la carpintería','25/11/2026 · Todas las cotas en mm. Piezas enteras, cepilladas; los largos se cortan en casa.',
 ['Ref.','Pieza','Cant.','Sección (mm)','Largo (mm)','Indicaciones'],[10,36,9,16,16,100],d.order,58);
order.getRange('C7:C10').setNumberFormat('0');order.getRange('C7:E10').format.fill=amber;
order.getRange('A12').values=[['Material de origen']];order.getRange('B12').values=[[d.order_note]];
order.getRange('A13').values=[['Pedir además']];order.getRange('B13').values=[['Que entreguen todos los retales. Que la madera esté seca (15 % o menos) y derecha. Medir las piezas al recibirlas.']];
order.getRange('A12:F13').format.font={name:'Arial',size:10};order.getRange('A12:A13').format.font={name:'Arial',size:10,bold:true};
const pieces=sheet('Corte en casa','Piezas que salen del pedido · corte en casa','Primer corte con margen en el largo y ajuste final en el armado.',
 ['ID','Pieza','Cant.','Primer corte','Ancho','Espesor','Largo final','Sale de','Nota'],
 [10,34,9,14,10,10,14,30,80],d.parts.map(p=>[p[0],p[1],p[2],p[4],p[5],p[6],p[7],p[3],p[10]]),52);
pieces.getRange('C7:G16').setNumberFormat('0');
const tables=sheet('Las tiras','Corte de las tiras en casa','Cada tira llega entera de 3000. Cortar con tope fijo; el disco y el escuadrado salen del sobrante.',
 ['Tiras','Cant.','Medida de entrega','Cortes por tira','Resultado','Sobrante'],[24,8,22,22,60,22],d.strips,48);
const beams=sheet('Los 4 bastidores','Los 4 bastidores · sección 40 × 100 mm','Llegan enteros. Los costados son de altura completa y los rieles de 3000 van entre ellos. Cortes en casa.',
 ['Bastidor','Largo entregado','Cant. piezas','Corte','Largo final','Uso'],
 [12,30,14,40,18,90],d.frames,70);
const assembly=sheet('Armado y controles','Armado y controles de esta revisión','Cotas finales para marco exterior 3080 × 1256 mm. Las piezas de entrega tienen margen solo en los largos.',
 ['Control','Medida o criterio','Aplicación'],[39,49,116],d.notes,65);
const guide=sheet('Guía de armado','Guía de armado del ventanal','Orden recomendado: probar, mecanizar, inmunizar, barnizar tablillas sueltas, armar el marco con madera limpia y barnizarlo armado.',
 ['Paso','Etapa','Qué hacer','Cuidado'],[8,26,80,70],d.assembly,58);
guide.getRangeByIndexes(6,0,d.assembly.length,1).format.horizontalAlignment='center';
const buy=sheet('Compras','Compras de la ventana · productos del mercado',d.shopping_note,
 ['Grupo','Producto','Cant.','Unidad','Dónde','Código','Cómo buscarlo','Precio COP','Subtotal COP','Nota'],[18,46,8,11,24,10,30,14,14,70],
 d.shopping.map(r=>[r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],null,r[8]]),44);
const n=d.shopping.length,last=6+n;
buy.getRange(`I7:I${last}`).formulas=d.shopping.map((r,i)=>[`=IF(ISNUMBER(H${7+i}),C${7+i}*H${7+i},"")`]);
buy.getRange(`H7:I${last+2}`).setNumberFormat('#,##0');
buy.getRange(`A${last+2}`).values=[['Total con precio de referencia']];buy.getRange(`I${last+2}`).formulas=[[`=SUM(I7:I${last})`]];
buy.getRange(`J${last+2}`).values=[['El resto por cotizar']];
buy.getRange(`A${last+2}:J${last+2}`).format.font={name:'Arial',size:10,bold:true};
const PE=d.pecera;
const fish=sheet('Pecera · pino',PE.titulo,PE.nota,['Código','Pieza','Cant.','Largo final','Sección','Nota'],[10,38,9,14,12,80],PE.piezas.map(x=>[x[0],x[1],x[2],x[3],'50 × 50',x[4]]),40);
const r0=8+PE.piezas.length;fish.getRange(`A${r0}`).values=[['Corte de los listones de 3000']];fish.getRange(`A${r0}`).format.font={name:'Arial',size:11,bold:true};
PE.barras.forEach((b,i)=>{fish.getRange(`A${r0+1+i}:D${r0+1+i}`).values=[[`Listón ${b[0]}`,b[1].length?b[1].map(x=>x[0]+' '+x[1]).join(' + '):'Reserva','',b[2]]];});
fish.getRange(`A${r0+6}`).values=[[PE.seccion_alt]];
wb.recalculate();
for(const [name,range,file] of [['Pedido a la carpintería','A6:F9','pedido'],['Los 4 bastidores','A6:F10','bastidores'],['Las tiras','A6:F10','tablas']]){
 const p=await wb.render({sheetName:name,range,scale:1,format:'png'});await fs.writeFile(dir+'/'+file+'.png',new Uint8Array(await p.arrayBuffer()));
}
const output=await SpreadsheetFile.exportXlsx(wb);const target=path.join(root,'despiece-ventana-pino-con-margen.xlsx');await output.save(target);await fs.rm(target+'.inspect.ndjson',{force:true});
console.log('OK Excel de corte local');
