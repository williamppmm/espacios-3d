/* Espacios 3D — proyecto local, sin servicios ni cargas de archivos al servidor. */
(()=>{'use strict';
const $=id=>document.getElementById(id),KEY='espacios3d.project.v1',L=20.30,W=5.75;
const initial=()=>({schema:'espacios-3d',version:1,name:'Terraza Cartagena',selected:'kitchen-1',mode:'room',room:{wallHeight:1.1,roof:false,architecture:true,furnishings:true,labels:true},items:[
 {id:'kitchen-1',type:'kitchen',name:'Cocina Cartagena',w:260,d:62,h:215,x:735,z:280,rotation:90,visible:true,open:0},
 {id:'closet-1',type:'closet',name:'Clóset · referencia',w:160,d:60,h:210,x:555,z:0,rotation:0,visible:true,open:0}
]});
const finite=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
function validate(v){
 if(!v||v.schema!=='espacios-3d'||v.version!==1||!Array.isArray(v.items)||v.items.length>30)throw Error('Formato de proyecto no compatible (Espacios 3D, versión 1; hasta 30 muebles).');
 if(typeof v.name!=='string'||v.name.length>80||!['room','item'].includes(v.mode))throw Error('Datos generales inválidos.');
 const ids=new Set();const items=v.items.map(i=>{
  if(!i||!['kitchen','closet','shelf'].includes(i.type)||typeof i.id!=='string'||i.id.length>80||ids.has(i.id)||typeof i.name!=='string'||i.name.length>60)throw Error('Datos de mueble inválidos.');
  ids.add(i.id);
  for(const [k,min,max] of [['w',30,500],['d',20,120],['h',30,300],['x',-3000,3000],['z',-3000,3000],['rotation',-360,360],['open',0,1]])if(!finite(i[k],min,max))throw Error('Medidas inválidas en '+i.name+'.');
  if(typeof i.visible!=='boolean')throw Error('Visibilidad inválida.');
  return {id:i.id,type:i.type,name:i.name,w:i.type==='kitchen'?260:i.w,d:i.type==='kitchen'?62:i.d,h:i.type==='kitchen'?215:i.h,x:i.x,z:i.z,rotation:i.rotation,visible:i.visible,open:i.open};
 });
 if(!v.room||!finite(v.room.wallHeight,.9,2.5)||['roof','architecture','furnishings','labels'].some(k=>typeof v.room[k]!=='boolean'))throw Error('Opciones de terraza inválidas.');
 return {schema:'espacios-3d',version:1,name:v.name,mode:v.mode,selected:ids.has(v.selected)?v.selected:items[0]?.id||null,room:{wallHeight:v.room.wallHeight,roof:v.room.roof,architecture:v.room.architecture,furnishings:v.room.furnishings,labels:v.room.labels},items};
}
let state=initial(),storageNotice='';try{const raw=localStorage.getItem(KEY);if(raw)state=validate(JSON.parse(raw));}catch(e){storageNotice='No se pudo recuperar el guardado anterior. Puedes abrir un proyecto descargado.';}
let renderer,scene,camera,controls,room,models=new Map(),solo,stageFloor,selectionBox;
const stage=$('stage'),THREE=window.THREE;
function fail(e){$('loading').hidden=true;$('error').hidden=false;console.error(e);}
if(!THREE){fail('Motor 3D no disponible');return;}
try{renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputEncoding=THREE.sRGBEncoding;renderer.setClearColor(0xe7ece8);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;stage.prepend(renderer.domElement);
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(42,1,.05,150);controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.495;controls.minDistance=.6;controls.maxDistance=65;
 scene.add(new THREE.HemisphereLight(0xfffdf5,0x929f91,.85));const sun=new THREE.DirectionalLight(0xfff8e9,.8);sun.position.set(7,19,12);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:.5,far:60});sun.target.position.set(9,0,2);scene.add(sun,sun.target);
 const fill=new THREE.DirectionalLight(0xffffff,.3);fill.position.set(-5,7,-6);scene.add(fill);
}catch(e){fail(e);return;}
function mat(color){return new THREE.MeshStandardMaterial({color,roughness:.85});}
const palette={slab:mat(0xcac9bd),brick:mat(0xbc7658),wood:mat(0xb38c65),white:mat(0xefeee5),bed:mat(0xd7d7c6),dark:mat(0x4f6056),water:mat(0xacc8c6),glass:new THREE.MeshStandardMaterial({color:0xa6c8c2,transparent:true,opacity:.35,roughness:.3}),roof:new THREE.MeshStandardMaterial({color:0xb7c3b3,transparent:true,opacity:.45,side:THREE.DoubleSide})};
// Farol en aparejo trabado, generado localmente: no requiere fuentes ni texturas remotas.
const bc=document.createElement('canvas');bc.width=256;bc.height=170;const bg=bc.getContext('2d');bg.fillStyle='#c4b7a1';bg.fillRect(0,0,256,170);for(let r=0;r<2;r++)for(let c=-1;c<3;c++){bg.fillStyle=(c+r)%2?'#b67557':'#bc7b5a';bg.fillRect(c*128+r*64+3,r*85+3,122,79);}
function brick(len,h){const tex=new THREE.CanvasTexture(bc);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(len/.6,h/.4);tex.encoding=THREE.sRGBEncoding;return new THREE.MeshStandardMaterial({map:tex,roughness:1});}
function box(parent,w,h,d,x,y,z,m){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function group(parent){const g=new THREE.Group();parent.add(g);return g;}
function wall(parent,axis,s1,s2,c,h,t=.12,ops=[]){let cur=s1;function segment(a,b,y0,y1){if(b-a<.001||y1-y0<.001)return;const len=b-a,hh=y1-y0;box(parent,axis==='x'?len:t,hh,axis==='x'?t:len,axis==='x'?(a+b)/2:c,(y0+y1)/2,axis==='x'?c:(a+b)/2,brick(len,hh));}for(const o of [...ops].sort((a,b)=>a.a-b.a)){segment(cur,o.a,0,h);segment(o.a,o.b,0,Math.min(h,o.sill||0));segment(o.a,o.b,Math.min(h,o.top),h);cur=o.b;}segment(cur,s2,0,h);}
const dispose=root=>{const gs=new Set(),ms=new Set(),ts=new Set();root.traverse(o=>{if(o.geometry)gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])if(!Object.values(palette).includes(m)){ms.add(m);if(m.map)ts.add(m.map);}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());if(root.parent)root.parent.remove(root);};
room=group(scene);const floor=group(room),perimeter=group(room),architecture=group(room),roof=group(room),furnishings=group(room),labels=group(room);
// Patios P1 y P2: se dejan vacíos, como en la maqueta recibida.
const pits=[{x1:9.5,x2:12.2,z1:0,z2:2.3},{x1:0,x2:2.6,z1:3.85,z2:5.75}];
[[0,2.6,0,3.85],[2.6,9.5,0,W],[9.5,12.2,2.3,W],[12.2,L,0,W]].forEach(([a,b,c,d])=>box(floor,b-a,.1,d-c,(a+b)/2,-.05,(c+d)/2,palette.slab));
function rail(x1,z1,x2,z2){const len=Math.hypot(x2-x1,z2-z1),along=x1!==x2;box(floor,along?len:.035,.035,along?.035:len,(x1+x2)/2,.9,(z1+z2)/2,palette.dark);const n=Math.ceil(len/.6);for(let j=0;j<=n;j++)box(floor,.025,.9,.025,x1+(x2-x1)*j/n,.45,z1+(z2-z1)*j/n,palette.dark);}
rail(9.5,0,9.5,2.3);rail(9.5,2.3,12.2,2.3);rail(12.2,2.3,12.2,0);rail(0,3.85,2.6,3.85);rail(2.6,3.85,2.6,5.75);
function buildPerimeter(){while(perimeter.children.length)dispose(perimeter.children[0]);const h=state.room.wallHeight;wall(perimeter,'x',-.12,L+.12,-.06,h);wall(perimeter,'x',-.12,L+.12,W+.06,h);wall(perimeter,'z',0,W,-.06,h);wall(perimeter,'z',0,W,L+.06,h,.12,[{a:.85,b:2.3,top:2.1},{a:3.75,b:4.7,top:2.1}]);perimeter.traverse(o=>{if(o.material&&h>1.5){o.material.transparent=true;o.material.opacity=.5;}});}
wall(architecture,'z',0,2.32,2.06,2.5);wall(architecture,'x',2,3.32,2.26,2.5,.12,[{a:2.45,b:3.15,top:2.05}]);wall(architecture,'z',0,3,3.38,2.5);wall(architecture,'x',3.32,7.35,2.94,2.5,.12,[{a:3.9,b:5.6,sill:.6,top:2.1},{a:6.25,b:7.15,top:2.05}]);wall(architecture,'z',0,3,7.29,2.5);
box(architecture,1.7,1.5,.02,4.75,1.35,2.94,palette.glass);box(architecture,.72,2.03,.035,3.15,1.02,2.36,palette.wood);box(roof,7.7,.1,3.4,5.75,2.55,1.62,palette.roof);
// Aparatos y cama: referencias esquemáticas del modelo de terraza, no diseños de fabricación.
[[.6,.9,.6,.45,.45,.35,'white'],[.5,.18,.42,.45,.82,.35,'water'],[1.2,.04,.9,2.72,.02,.45,'water'],[.02,1.9,.9,2.72,.95,.9,'glass'],[.42,.4,.36,2.36,.2,1.45,'white'],[.18,.35,.36,2.21,.58,1.45,'white'],[.4,.15,.32,3.11,.82,1.85,'white'],[1.95,.45,1.45,4.42,.23,1.68,'bed'],[.08,.95,1.45,3.48,.48,1.68,'wood'],[.45,.12,.55,3.8,.52,1.32,'white'],[.45,.12,.55,3.8,.52,2.02,'white'],[.4,1.8,.6,9.1,.9,.3,'white'],[.35,.95,1.4,9.25,.48,1.85,'wood']].forEach(a=>box(furnishings,...a.slice(0,6),palette[a[6]]));
function label(txt,x,y,z){const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.fillStyle='#fffef5e8';g.fillRect(0,0,512,96);g.fillStyle='#354b40';g.font='32px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,256,48);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.position.set(x,y,z);s.scale.set(1.8,.34,1);s.renderOrder=10;labels.add(s);}
[['Baño',2.7,2.8,1.1],['Habitación',5.3,2.8,1.5],['Cocina',8.4,2.8,1.5],['Patio 1',10.85,.2,1.15],['Patio 2',1.3,.2,4.8],['Lavadero',.5,1.3,.6],['Entrada',19.8,.3,4.2],['Escalera',19.8,.3,1.6]].forEach(a=>label(...a));
stageFloor=box(scene,12,.04,10,1.3,-.035,1,palette.slab);stageFloor.visible=false;solo=group(scene);
function template(i){const root=new THREE.Group(),w=i.w/100,h=i.h/100,d=i.d/100,t=.018;const shell=palette.wood;box(root,t,h,d,t/2,h/2,d/2,shell);box(root,t,h,d,w-t/2,h/2,d/2,shell);box(root,w-2*t,t,d,w/2,t/2,d/2,shell);box(root,w-2*t,t,d,w/2,h-t/2,d/2,shell);box(root,w-2*t,h-2*t,.006,w/2,h/2,.003,palette.white);let doors=[];
 if(i.type==='closet'){box(root,t,h-2*t,d,w/2,h/2,d/2,shell);box(root,w/2-1.5*t,t,d,w*.75,h*.55,d/2,shell);box(root,w/2-1.5*t,t,d,w*.75,h*.3,d/2,shell);const bar=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,w/2-2*t,12),palette.dark);bar.rotation.z=Math.PI/2;bar.position.set(w*.25,h*.83,d*.5);root.add(bar);for(let j=0;j<2;j++){const pivot=group(root);pivot.position.set(j?w:0,0,d);const door=box(pivot,w/2-.004,h-.006,t,j?-w/4:w/4,h/2,t/2,shell);box(pivot,.012,.18,.02,j?-w/2+.05:w/2-.05,h*.52,.03,palette.dark);doors.push(pivot);}}
 else{for(let j=1;j<=3;j++)box(root,w-2*t,t,d,w/2,h*j/4,d/2,shell);}
 return {root,setOpen(t){doors.forEach((d,j)=>d.rotation.y=(j?1:-1)*t*1.6);}};
}
function build(i){const m=i.type==='kitchen'?window.EspaciosModels.kitchen(THREE):template(i);const outer=new THREE.Group();outer.add(m.root);room.add(outer);models.set(i.id,{...m,outer});}
function rebuildAll(){models.forEach(m=>dispose(m.outer));models.clear();for(const i of state.items)build(i);}
function item(){return state.items.find(i=>i.id===state.selected);}
function transform(){
 for(const i of state.items){const m=models.get(i.id),active=state.mode==='item'&&i.id===state.selected;(active?solo:room).add(m.outer);m.outer.visible=active?true:state.mode==='room'&&i.visible;m.outer.position.set(active?0:i.x/100,0,active?0:i.z/100);m.outer.rotation.y=active?0:i.rotation*Math.PI/180;m.setOpen(i.open);}
 room.visible=state.mode==='room';solo.visible=state.mode==='item';stageFloor.visible=state.mode==='item';
 architecture.visible=state.room.architecture;roof.visible=state.room.roof;furnishings.visible=state.room.furnishings;labels.visible=state.room.labels;
 if(selectionBox){scene.remove(selectionBox);selectionBox.geometry.dispose();selectionBox.material.dispose();selectionBox=null;}
 const current=item();if(current&&(state.mode==='item'||current.visible)){selectionBox=new THREE.BoxHelper(models.get(current.id).outer,0x698158);selectionBox.material.transparent=true;selectionBox.material.opacity=.5;scene.add(selectionBox);}
 warn();
}
function footprint(i){const r=i.rotation*Math.PI/180,w=i.w/100,d=i.d/100;return [[0,0],[w,0],[w,d],[0,d]].map(([x,z])=>[i.x/100+x*Math.cos(r)+z*Math.sin(r),i.z/100-x*Math.sin(r)+z*Math.cos(r)]);}
function warn(){if(state.mode!=='room'){$('warnings').textContent='';return;}const notes=['Ubicación propuesta: la cocina de 260 cm ocupa el muro transversal de 3 m; reemplaza el mesón esquemático de 210 cm del plano.'];for(const i of state.items.filter(i=>i.visible)){const p=footprint(i),xs=p.map(p=>p[0]),zs=p.map(p=>p[1]),b={minX:Math.min(...xs),maxX:Math.max(...xs),minZ:Math.min(...zs),maxZ:Math.max(...zs)};if(p.some(([x,z])=>x<-.005||x>L+.005||z<-.005||z>W+.005))notes.push(i.name+': sale del perímetro de la terraza.');for(const pit of pits)if(b.maxX>pit.x1+.005&&b.minX<pit.x2-.005&&b.maxZ>pit.z1+.005&&b.minZ<pit.z2-.005)notes.push(i.name+': revisa su ubicación sobre el vacío de un patio.');} $('warnings').textContent=notes.join(' ');}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$('save-state').textContent='Guardado en este navegador · '+new Date().toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});}catch(e){$('save-state').textContent='No se pudo guardar aquí. Usa Descargar proyecto para conservar tus cambios.';}}
function renderUI(){
 $('project-name').value=state.name;$('items').replaceChildren();for(const i of state.items){const b=document.createElement('button');b.className='item';b.setAttribute('aria-pressed',String(i.id===state.selected));const dot=document.createElement('span');dot.className='dot';const text=document.createElement('span');text.textContent=i.name;const sm=document.createElement('small');sm.textContent=`${i.w} × ${i.d} × ${i.h} cm${i.visible?'':' · oculto'}`;text.append(sm);b.append(dot,text);b.onclick=()=>{state.selected=i.id;transform();renderUI();if(state.mode==='item')view('general');save();};$('items').append(b);}
 const i=item();$('selected-title').textContent=i?.name||'Sin mueble seleccionado';for(const k of ['item-name','w','d','h','x','z','rotation','visible','openness','remove'])$(k).disabled=!i;
 if(i){$('item-name').value=i.name;for(const k of ['w','d','h','x','z','rotation'])$(k).value=i[k];$('visible').checked=i.visible;$('openness').value=i.open;for(const k of ['w','d','h'])$(k).disabled=i.type==='kitchen';$('item-description').textContent=i.type==='kitchen'?'Modelo detallado conservado del despiece actual. Mesón de 260 × 62 cm y cajonero único de 75 cm.':i.type==='closet'?'Referencia del clóset de la maqueta. Puedes editar sus medidas; su distribución interior es ilustrativa.':'Plantilla abierta con tres entrepaños. Ajusta sus medidas para explorar otro mueble.';$('fixed-note').textContent=i.type==='kitchen'?'Medidas fijas para conservar la coherencia con el despiece.':'Medidas visuales editables; requieren diseño y despiece antes de fabricar.';}
 $('placement').hidden=state.mode!=='room';$('room-options').hidden=state.mode!=='room';$('open-label').hidden=!i||i.type==='shelf';
 $('mode-room').setAttribute('aria-pressed',state.mode==='room');$('mode-item').setAttribute('aria-pressed',state.mode==='item');$('wall-height').value=state.room.wallHeight;$('wall-height-value').textContent=state.room.wallHeight.toFixed(2).replace('.',',')+' m';for(const k of ['roof','architecture','furnishings','labels'])$(k).checked=state.room[k];
 $('canvas-label').replaceChildren();$('canvas-label').append(document.createTextNode(state.mode==='room'?state.name.toUpperCase():i?.name.toUpperCase()||'SIN MUEBLES'));const sp=document.createElement('span');sp.textContent=state.mode==='room'?'5,75 × 20,30 m':i?`${i.w} × ${i.d} × ${i.h} cm`:'Añade un diseño para empezar';$('canvas-label').append(sp);$('scene-status').textContent=state.mode==='room'?'Terraza del plano compartido':i?.type==='kitchen'?'Cocina del despiece actual':'Referencia visual editable';
}
let viewName='general';function view(name){viewName=name;const single=state.mode==='item',i=item(),w=(i?.w||260)/100,h=(i?.h||215)/100,d=(i?.d||62)/100;const target=single?new THREE.Vector3(w/2,h*.45,d/2):new THREE.Vector3(9.6,.4,2.7);let p;
 if(single){const dist=Math.max(w,h,d)*1.8;p=name==='top'?[w/2,dist*1.4,d/2+.001]:name==='front'?[w/2,h*.5,dist]:[w/2+dist*.65,h*.65+dist*.45,d/2+dist*.85];controls.minDistance=.5;}else{p=name==='top'?[L/2,29,W/2+.001]:name==='entrance'?[19.6,1.65,4.6]:name==='front'?[10.15,9,18]:[23,16,19];if(name==='entrance')target.set(5,1.2,1.6);controls.minDistance=1;}
 controls.target.copy(target);camera.position.set(...p);controls.update();
 // Ajusta el encuadre al aspecto real del lienzo, también en iPad vertical.
 if(name!=='entrance'){
  const bounds=single&&i?new THREE.Box3().setFromObject(models.get(i.id).outer):new THREE.Box3(new THREE.Vector3(-.12,0,-.12),new THREE.Vector3(L+.12,2.65,W+.12));
  const corners=[];for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])corners.push(new THREE.Vector3(x,y,z));
  for(let n=0;n<8;n++){camera.updateMatrixWorld();const extent=Math.max(...corners.map(c=>{const q=c.clone().project(camera);return Math.max(Math.abs(q.x),Math.abs(q.y));}));if(extent<.88)break;camera.position.sub(target).multiplyScalar(extent/.84).add(target);controls.update();}
 }
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));
}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},60000);}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));$('fit').onclick=()=>view(viewName);
for(const mode of ['room','item'])$('mode-'+mode).onclick=()=>{state.mode=mode;transform();renderUI();view('general');save();};
$('project-name').onchange=()=>{state.name=$('project-name').value.trim()||'Mi espacio';renderUI();save();};
$('item-name').onchange=()=>{if(!item())return;item().name=$('item-name').value.trim()||'Mueble';renderUI();warn();save();};
for(const k of ['w','d','h','x','z','rotation'])$(k).onchange=()=>{const i=item();if(!i)return;const n=Number($(k).value),range={w:[30,500],d:[20,120],h:[30,300],x:[-3000,3000],z:[-3000,3000],rotation:[-360,360]}[k];if(!$(k).value||!finite(n,...range)){renderUI();return;}i[k]=n;if(['w','d','h'].includes(k)&&i.type!=='kitchen'){dispose(models.get(i.id).outer);build(i);}transform();renderUI();save();};
$('openness').oninput=()=>{if(!item())return;item().open=Number($('openness').value);models.get(item().id).setOpen(item().open);if(selectionBox)selectionBox.update();save();};
$('visible').onchange=()=>{if(!item())return;item().visible=$('visible').checked;transform();renderUI();save();};
$('remove').onclick=()=>{const i=item();if(!i)return;dispose(models.get(i.id).outer);models.delete(i.id);state.items=state.items.filter(x=>x.id!==i.id);state.selected=state.items[0]?.id||null;transform();renderUI();view('general');save();};
document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{if(state.items.length>=30){$('save-state').textContent='Este proyecto admite hasta 30 muebles.';return;}const type=b.dataset.add,id=type+'-'+Date.now(),i={id,type,name:type==='kitchen'?'Cocina Cartagena':type==='closet'?'Clóset · referencia':'Mueble libre',w:type==='kitchen'?260:type==='closet'?160:100,d:type==='kitchen'?62:type==='closet'?60:40,h:type==='kitchen'?215:type==='closet'?210:180,x:1300,z:300,rotation:0,visible:true,open:0};state.items.push(i);state.selected=id;build(i);transform();renderUI();view('general');save();});
$('wall-height').oninput=()=>{state.room.wallHeight=Number($('wall-height').value);buildPerimeter();$('wall-height-value').textContent=state.room.wallHeight.toFixed(2).replace('.',',')+' m';save();};for(const k of ['roof','architecture','furnishings','labels'])$(k).onchange=()=>{state.room[k]=$(k).checked;transform();save();};
$('export').onclick=()=>download(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),'espacios-3d-proyecto.json');$('import').onclick=()=>$('project-file').click();$('project-file').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>1000000)throw Error('El archivo de proyecto es demasiado grande (máximo 1 MB).');const next=validate(JSON.parse(await f.text()));state=next;rebuildAll();buildPerimeter();transform();renderUI();view('general');save();}catch(e){$('save-state').textContent='No se abrió el archivo: '+e.message;}finally{$('project-file').value='';}};
$('reset').onclick=()=>{if(!confirm('¿Restaurar la distribución inicial? Descarga antes tu proyecto si quieres conservarlo.'))return;state=initial();rebuildAll();buildPerimeter();transform();renderUI();view('general');save();};
$('snapshot').onclick=()=>{renderer.render(scene,camera);renderer.domElement.toBlob(blob=>{if(blob)download(blob,'espacios-3d-vista.png');},'image/png');};
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();if(models.size)view(viewName);}new ResizeObserver(resize).observe(stage);resize();
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('Se perdió el contexto WebGL. Recarga la página.');});
buildPerimeter();rebuildAll();transform();renderUI();view('general');$('loading').hidden=true;if(storageNotice)$('save-state').textContent=storageNotice;
function loop(){requestAnimationFrame(loop);controls.update();renderer.render(scene,camera);}loop();
})();



