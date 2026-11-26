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
const order=sheet('Pedido de piezas','Ventana de pino · corte para material local','25/11/2026 · Todas las cotas en mm. 9 tablas y 4 bastidores. Tablas cepilladas a 15 mm; bastidores terminados a 100 × 40 mm.',
 ['ID','Pieza','Cant.','Largo a entregar (mín.)','Ancho terminado','Espesor terminado','Largo de montaje','Destino y ajuste'],
 [10,34,9,16,17,17,18,88],d.parts.map(p=>[p[0],p[1],p[2],p[4],p[5],p[6],p[7],p[3]+'. '+p[10]]),62);
order.getRange('C7:G16').setNumberFormat('0');order.getRange('D7:D16').format.fill=amber;
order.getRange('A18').values=[['Piezas / reservas a entregar']];order.getRange('C18').formulas=[['=SUM(C7:C16)']];
order.getRange('A20').values=[['Compra de madera']];order.getRange('D20').values=[['9 tablas de 3000–3020 × 220 × 20, cepilladas a 15. 4 bastidores de 100 × 40; seleccionar 2 enteros, preferiblemente de 3020 y con al menos 3010 útiles para los rieles.']];
order.getRange('A21').values=[['Control de tablillas']];order.getRange('D21').values=[['32 de 1180 × 100 × 15: 30 para montar y 2 de repuesto.']];
order.getRange('A22').values=[['Largos definitivos']];order.getRange('D22').values=[['Escuadrar en el armado: rieles 3000, costados 1256, montante 1176 y tablillas 1170. Medir el vano antes de terminar.']];
order.getRange('A23').values=[['Mecanizado del mecanismo']];order.getRange('D23').values=[['Rebaje propuesto 45 × 18 abierto al patio, radio 32 y barras 1430. Ensayar primero con pines reales; ver Armado y controles.']];
order.getRange('A18:H23').format.font={name:'Arial',size:10};order.getRange('C18').setNumberFormat('0');
const tables=sheet('Las 9 tablas','Corte de las 9 tablas · cepillado a 15 mm','Sanear los cantos conservando al menos 210 mm de ancho útil. Disco previsto 4 mm. Cortar primero los paños y luego las tiras.',
 ['Tabla','Material de entrada','Cepillado','Paños al largo','Piezas resultantes','Retal que se conserva','Orden de trabajo'],
 [10,24,16,46,65,39,62],d.boards,88);
const beams=sheet('Los 4 bastidores','Corte de los 4 bastidores · sección 100 × 40 mm','Los costados son de altura completa; los horizontales quedan entre ellos. Este cambio permite rieles finales de 3000 mm.',
 ['Bastidor','Largo de entrada','Cant. piezas','Entrega de taller','Largo final','Uso'],
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
wb.recalculate();
for(const [name,range,file] of [['Pedido de piezas','A6:H12','pedido'],['Los 4 bastidores','A6:F10','bastidores'],['Las 9 tablas','A6:F9','tablas']]){
 const p=await wb.render({sheetName:name,range,scale:1,format:'png'});await fs.writeFile(dir+'/'+file+'.png',new Uint8Array(await p.arrayBuffer()));
}
const output=await SpreadsheetFile.exportXlsx(wb);const target=path.join(root,'despiece-ventana-pino-con-margen.xlsx');await output.save(target);await fs.rm(target+'.inspect.ndjson',{force:true});
console.log('OK Excel de corte local');
