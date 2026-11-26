// Exporta los cálculos del generador Python conservando fórmulas y una presentación legible.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const runtime=path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs');
const {Workbook,SpreadsheetFile}=await import(pathToFileURL(runtime).href);
const specs=JSON.parse(await fs.readFile(process.argv[2],'utf8')),output=process.argv[3],wb=Workbook.create();
for(const spec of specs){
 const s=wb.worksheets.add(spec.name),columns=spec.headers.length;
 s.showGridLines=false;s.getRange('A2').values=[[spec.title]];
 s.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:'#253b35'};
 for(const [i,note]of spec.notes.slice(0,2).entries()){s.getRangeByIndexes(2+i,0,1,1).values=[[note]];s.getRangeByIndexes(2+i,0,1,1).format.font={name:'Arial',size:10,italic:true,color:'#59675d'};}
 const headers=s.getRangeByIndexes(5,0,1,columns);headers.values=[spec.headers];headers.format={fill:'#253b35',font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},wrapText:true,rowHeight:35};
 if(spec.rows.length){
  const cells=s.getRangeByIndexes(6,0,spec.rows.length,columns);
  cells.values=spec.rows.map(row=>Array.from({length:columns},(_,j)=>typeof row[j]==='object'&&row[j]?.formula?null:row[j]??null));
  cells.format={font:{name:'Arial',size:10},wrapText:true,rowHeight:68,verticalAlignment:'center'};
  spec.rows.forEach((row,i)=>row.forEach((v,j)=>{if(v?.formula)s.getRangeByIndexes(6+i,j,1,1).formulas=[[v.formula]];}));
 }
 spec.widths.forEach((w,j)=>s.getRangeByIndexes(0,j,1,1).format.columnWidth=w);
 s.freezePanes.freezeRows(6);
 if(spec.name==='Compras')s.getRangeByIndexes(6,4,spec.rows.length,2).setNumberFormat('"$"#,##0');
}
wb.recalculate();
const xlsx=await SpreadsheetFile.exportXlsx(wb);await xlsx.save(output);
const preview=await wb.render({sheetName:'Despiece',range:'A6:J12',scale:1,format:'png'});
await fs.writeFile(path.join(os.tmpdir(),'ventana-material-local','conjunto.png'),new Uint8Array(await preview.arrayBuffer()));
await fs.rm(output+'.inspect.ndjson',{force:true});
console.log('OK libro de pino exportado');
