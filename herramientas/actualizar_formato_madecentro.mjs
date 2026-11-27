import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const runtime=path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs');
const {FileBlob,SpreadsheetFile}=await import(pathToFileURL(runtime).href);
const target=path.join(root,'cortes-madecentro-RH15-Cartagena-medidas-finales.xlsx');
const rows=JSON.parse(await fs.readFile(process.argv[2],'utf8'));
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(target));
const sheet=name=>wb.worksheets.getItem(name), cuts=sheet('Cortes'),control=sheet('Control del pedido'),received=sheet('Recepción y canteo');
const tmp=path.join(os.tmpdir(),'ventana-material-local');await fs.mkdir(tmp,{recursive:true});
const before=await wb.render({sheetName:'Cortes',range:'A1:J6',scale:1,format:'png'});
await fs.writeFile(path.join(tmp,'madecentro-antes.png'),new Uint8Array(await before.arrayBuffer()));
const edge=e=>({'R':'Rígido 2 mm','F':'Flexible 0,45 mm'}[e]??null);
cuts.getRangeByIndexes(1,0,rows.length,10).values=rows.map(r=>[r[6],r[7],r[5],`${r[0]} ${r[1]} · ${r[2]} · ${r[3]} · RH15 · FINAL CON CANTO`,'Horizontal',...r.slice(8,12).map(edge),null]);
cuts.getRangeByIndexes(1,0,rows.length,10).format.wrapText=true;
control.getRange('B5').values=[['Pedido conjunto vigente de cocina, clóset, baño y pecera. Dimensiones finales con canto según los despieces individuales.']];
control.getRange('B7').formulas=[[`=SUM(Cortes!C2:C${rows.length+1})`]];
control.getRange('B8').formulas=[[`=COUNT(Cortes!A2:A${rows.length+1})`]];
control.getRangeByIndexes(16,0,rows.length,5).values=rows.map(r=>[`${r[0]} ${r[1]}`,`${r[2]} · ${r[3]}`,`${r[6]} × ${r[7]}`,`${r[12]} × ${r[13]}`,r[15]]);
control.getRangeByIndexes(16,0,rows.length,5).format.wrapText=true;
received.getRangeByIndexes(9,0,rows.length,17).values=rows.map(r=>[`${r[0]} ${r[1]}`,r[3],r[5],r[6],r[7],...r.slice(8,12),...r.slice(8,12).map(e=>e==='—'?0:null),null,null,null,`${r[14]} · ${r[15]}`]);
for(let i=0;i<rows.length;i++){
 const n=i+10,r=rows[i];
 for(let j=0;j<4;j++)received.getRangeByIndexes(i+9,j+9,1,1).format.fill=r[8+j]==='—'?'#E7E6E6':'#FFF2CC';
 for(const [col,kind]of [['N','R'],['O','F']])received.getRange(`${col}${n}`).formulas=[[`=IF(COUNT(J${n}:M${n})<4,"Por revisar",(IF(F${n}="${kind}",J${n}*D${n},0)+IF(G${n}="${kind}",K${n}*D${n},0)+IF(H${n}="${kind}",L${n}*E${n},0)+IF(I${n}="${kind}",M${n}*E${n},0))/1000)`]];
 received.getRange(`P${n}`).formulas=[[`=IF(COUNT(J${n}:M${n})<4,"POR REVISAR",IF(SUM(J${n}:M${n})=0,"RECIBIDO CONFORME","CANTEAR A MANO"))`]];
}
const end=rows.length+9;
// Ampliar las fórmulas de resumen al nuevo final del pedido.
for(const ref of ['C4','F4','I4','L4','Q4','F5','I5','L5','Q5']){
 const range=received.getRange(ref),old=range.formulas[0][0];
 if(old)range.formulas=[[old.replace(/([A-Z]+)111\b/g,`$1${end}`)]];
}
received.getRangeByIndexes(9,0,rows.length,17).format.wrapText=true;
wb.recalculate();
const after=await wb.render({sheetName:'Cortes',range:'A1:J6',scale:1,format:'png'});
await fs.writeFile(path.join(tmp,'madecentro-despues.png'),new Uint8Array(await after.arrayBuffer()));
const output=await SpreadsheetFile.exportXlsx(wb);await output.save(target);
await fs.rm(target+'.inspect.ndjson',{force:true});
console.log(`OK formato Madecentro RH15: ${rows.length} referencias actualizadas`);
