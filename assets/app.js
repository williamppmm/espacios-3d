/* Espacios 3D — proyecto local, sin servicios ni cargas de archivos al servidor. */
(()=>{'use strict';
const $=id=>document.getElementById(id),KEY='espacios3d.project.v1',L=20.30,W=5.75;
const PROPOSALS=['ventana','acrilico','lamas','movil'];
const proposalNotes={ventana:'A · Ventana de extremo a extremo sobre el antepecho, incluido el tramo sobre la nevera.',acrilico:'B · Panel translúcido de extremo a extremo sobre el antepecho, incluido el tramo sobre la nevera.',lamas:'C · Lamas blancas giradas 45° a todo el ancho: filtran la vista desde la entrada y dejan pasos de luz y aire.',movil:'D · Tres hojas de lamas de 1 m que cubren los 3 m y se apilan hacia el extremo de la nevera en tres guías. Recogidas ocupan aproximadamente 1 m de ancho. Recorrido y anclajes por definir en obra.'};
const initial=()=>({schema:'espacios-3d',version:1,name:'Terraza Cartagena',selected:'kitchen-1',mode:'room',room:{wallHeight:1.1,doors:1,roof:false,vault:false,architecture:true,furnishings:true,labels:true,bathroomDesigned:true,bathroomWallCorrected:true,kitchenCorner:true,proposal:'lamas',proposalOpen:0},items:[
 {id:'kitchen-1',type:'kitchen',variant:'final',name:'Cocina Cartagena',w:260,d:62,h:215,x:750,z:260,rotation:90,visible:true,open:0},
 {id:'closet-1',type:'closet',variant:'final',name:'Clóset principal · compacto 195',w:195,d:58.5,h:238,x:738,z:1,rotation:-90,visible:true,open:0},
 {id:'bathroom-1',type:'bathroom',variant:'final',name:'Baño · lavamanos y espejo',w:55,d:47,h:150,x:212,z:220,rotation:90,visible:true,open:0}
]});
// Diseños por tipo de mueble: la cocina final y el clóset principal. Las alternativas descartadas quedan en el historial de Git.
const VARIANTS={kitchen:[{id:'final',label:'Cocina final · condimentero, puertas y basurero',w:260,note:'18 + 60 + 67 + 70 + 40 cm. Un cajón cubiertero, puertas con entrepaño y basurero de 12 L.',despiece:'despiece-cocina.html',viewer:'cocina.html'}],closet:[{id:'final',label:'Clóset principal · compacto 195 · corredizas',w:195,d:58.5,h:238,note:'Mismo RH15 y acabado de cocina. Cuerpo56cm, hojas hasta55 y manijas hasta58,5cm. Interior útil48,5cm; cuerpos83 y107,5cm. Cajonero5cm más estrecho para tolerancias de instalación. Tres cajones a la izquierda. Colgado superior, guía inferior sin carga y tope que conserva5cm de desfase. 1cm del muro izquierdo; 2cm respecto al giro. Propuesta sin perfiles verticales, basada en el clóset real del usuario; validación del herraje pendiente.',placement:{x:738,z:1,rotation:-90},despiece:'despiece-closet.html',viewer:'closet.html'}]};
VARIANTS.bathroom=[{id:'final',label:'Baño · lavamanos flotante y espejo',w:55,d:47,h:150,note:'Cuerpo inferior52 ×47 ×45cm, base a26cm y cierre46,5cm. Gabinete45 ×50 ×13cm con espejo32 ×50. Granito55 ×47 ×2cm provisional; el conjunto ocupa desde26 hasta176cm del suelo. Dos puertas inferiores con separación diagonal provisional 75°, obtenidas del panel común B06. Ubicado en la pared del sanitario, junto a la esquina. Despiece independiente y equipos por confirmar.',placement:{x:212,z:220,rotation:90},despiece:'despiece-bano.html',viewer:'bano.html'}];
const closetName=()=>'Clóset principal · compacto 195';
const FAMILIES=[['kitchen','▤','Cocina'],['closet','▥','Clóset'],['bathroom','▣','Baño']];
const fixedVariant=i=>!!VARIANTS[i.type];
const variantOf=i=>VARIANTS[i.type]?.find(v=>v.id===i.variant)||VARIANTS[i.type]?.[0];
const finite=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
function validate(v){
 if(!v||v.schema!=='espacios-3d'||v.version!==1||!Array.isArray(v.items)||v.items.length>30)throw Error('Formato de proyecto no compatible (Espacios 3D, versión 1; hasta 30 muebles).');
 if(typeof v.name!=='string'||v.name.length>80||!['room','item'].includes(v.mode))throw Error('Datos generales inválidos.');
 const ids=new Set();const items=v.items.map(i=>{
  if(!i||!['kitchen','closet','bathroom','shelf'].includes(i.type)||typeof i.id!=='string'||i.id.length>80||ids.has(i.id)||typeof i.name!=='string'||i.name.length>60)throw Error('Datos de mueble inválidos.');
  ids.add(i.id);
  for(const [k,min,max] of [['w',30,500],['d',20,120],['h',30,300],['x',-3000,3000],['z',-3000,3000],['rotation',-360,360],['open',0,1]])if(!finite(i[k],min,max))throw Error('Medidas inválidas en '+i.name+'.');
  if(typeof i.visible!=='boolean')throw Error('Visibilidad inválida.');
  const variant=variantOf(i),moved=variant&&((i.variant!==variant.id)||(i.type==='bathroom'&&v.room?.bathroomWallCorrected!==true))&&variant.placement;return {id:i.id,type:i.type,...variant&&{variant:variant.id},name:i.type==='closet'&&i.variant!==variant?.id?closetName():i.name,w:fixedVariant({...i,variant:variant?.id})?variant.w:i.w,d:fixedVariant({...i,variant:variant?.id})?(variant.d||62):i.d,h:fixedVariant({...i,variant:variant?.id})?(variant.h||215):i.h,x:moved?moved.x:i.x,z:moved?moved.z:i.type==='kitchen'&&v.room?.kitchenCorner!==true&&i.x===750&&i.z===280&&i.rotation===90?260:i.z,rotation:moved?moved.rotation:i.rotation,visible:i.visible,open:i.open};
 });
 if(v.room?.bathroomDesigned!==true&&items.length<30&&!items.some(i=>i.type==='bathroom'))items.push(initial().items.find(i=>i.type==='bathroom'));
 if(!v.room||!finite(v.room.wallHeight,.9,2.5)||['roof','architecture','furnishings','labels'].some(k=>typeof v.room[k]!=='boolean'))throw Error('Opciones de terraza inválidas.');
 return {schema:'espacios-3d',version:1,name:v.name,mode:v.mode,selected:ids.has(v.selected)?v.selected:items[0]?.id||null,room:{wallHeight:v.room.wallHeight,doors:finite(v.room.doors,0,1)?v.room.doors:1,roof:v.room.roof,vault:typeof v.room.vault==='boolean'?v.room.vault:false,architecture:v.room.architecture,furnishings:v.room.furnishings,labels:v.room.labels,bathroomDesigned:true,bathroomWallCorrected:true,kitchenCorner:true,proposal:PROPOSALS.includes(v.room.proposal)?v.room.proposal:'',proposalOpen:finite(v.room.proposalOpen,0,1)?v.room.proposalOpen:0},items};
}
let state=initial(),storageNotice='';try{const raw=localStorage.getItem(KEY);if(raw)state=validate(JSON.parse(raw));}catch(e){storageNotice='No se pudo recuperar el guardado anterior. Puedes abrir un proyecto descargado.';}
let renderer,scene,camera,controls,room,models=new Map(),solo,stageFloor,selectionBox;
const stage=$('stage'),THREE=window.THREE;
window.addEventListener('espacios-movement-blocked',e=>{$('warnings').textContent=e.detail;});
window.addEventListener('espacios-movement-clear',()=>warn());
function fail(e){$('loading').hidden=true;$('error').hidden=false;console.error(e);}
if(!THREE){fail('Motor 3D no disponible');return;}
try{renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputEncoding=THREE.sRGBEncoding;renderer.setClearColor(0xe7ece8);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;stage.prepend(renderer.domElement);
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(42,1,.05,150);controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.495;controls.minDistance=.6;controls.maxDistance=65;
 scene.add(new THREE.HemisphereLight(0xfffdf5,0x929f91,.85));const sun=new THREE.DirectionalLight(0xfff8e9,.8);sun.position.set(7,19,12);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:.5,far:60});sun.target.position.set(9,0,2);scene.add(sun,sun.target);
 const fill=new THREE.DirectionalLight(0xffffff,.3);fill.position.set(-5,7,-6);scene.add(fill);
}catch(e){fail(e);return;}
// Los colores se escriben en sRGB; se pasan a lineal para que el render con salida sRGB no los aclare.
const srgb=hex=>new THREE.Color(hex).convertSRGBToLinear();
function mat(color){return new THREE.MeshStandardMaterial({color:srgb(color),roughness:.85});}
const palette={fence:new THREE.MeshStandardMaterial({color:0xffffff,metalness:.65,roughness:.35}),slab:mat(0xbcbab0),brick:mat(0xbc7658),wood:mat(0xb38c65),white:mat(0xefeee5),bed:mat(0xd7d7c6),dark:mat(0x4f6056),water:mat(0xacc8c6),door:mat(0x8b5a35),sage:mat(0x6f8a62),leaf:mat(0x55764a),jute:mat(0xc9b08a),glass:new THREE.MeshStandardMaterial({color:srgb(0xa6c8c2),transparent:true,opacity:.35,roughness:.3}),acrylic:new THREE.MeshStandardMaterial({color:srgb(0xf7f6f0),transparent:true,opacity:.88,roughness:.6}),roof:new THREE.MeshStandardMaterial({color:srgb(0xb7c3b3),transparent:true,opacity:.45,side:THREE.DoubleSide}),pit:new THREE.MeshStandardMaterial({color:srgb(0x2a2d30),roughness:1,side:THREE.BackSide})};
// Farol en aparejo trabado (bloque 30 × 20 cm), generado localmente: tono terracota con variación por pieza y perforaciones.
const bc=document.createElement('canvas');bc.width=512;bc.height=342;const bg=bc.getContext('2d');bg.fillStyle='#c9bfae';bg.fillRect(0,0,512,342);{let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};for(let r=0;r<2;r++)for(let c=-1;c<3;c++){const x=c*256+r*128+4,y=r*171+4,v=(rnd()-.5)*30;bg.fillStyle=`rgb(${178+v|0},${86+v*.6|0},${52+v*.4|0})`;bg.fillRect(x,y,248,163);bg.fillStyle='rgba(60,25,10,.18)';bg.fillRect(x+84,y+51,20,68);bg.fillRect(x+154,y+51,20,68);bg.fillStyle='rgba(255,255,255,.06)';bg.fillRect(x,y,248,6);}}
function brick(len,h){const tex=new THREE.CanvasTexture(bc);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(len/.6,h/.4);tex.encoding=THREE.sRGBEncoding;return new THREE.MeshStandardMaterial({map:tex,roughness:1});}
function box(parent,w,h,d,x,y,z,m){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;}
// Pieza móvil: apply(t) la lleva de cerrada (0) a abierta (1); se puede tocar para abrir o cerrar.
function mover(g,apply){g.userData.mover={t:0,target:0,apply};return g;}
function setMovers(gs,t){for(const g of gs){const u=g.userData.mover;u.t=u.target=t;u.apply(t);}}
function group(parent){const g=new THREE.Group();parent.add(g);return g;}
function wall(parent,axis,s1,s2,c,h,t=.12,ops=[]){let cur=s1;function segment(a,b,y0,y1){if(b-a<.001||y1-y0<.001)return;const len=b-a,hh=y1-y0;box(parent,axis==='x'?len:t,hh,axis==='x'?t:len,axis==='x'?(a+b)/2:c,(y0+y1)/2,axis==='x'?c:(a+b)/2,brick(len,hh));}for(const o of [...ops].sort((a,b)=>a.a-b.a)){segment(cur,o.a,0,h);segment(o.a,o.b,0,Math.min(h,o.sill||0));segment(o.a,o.b,Math.min(h,o.top),h);cur=o.b;}segment(cur,s2,0,h);}
const dispose=root=>{const gs=new Set(),ms=new Set(),ts=new Set();root.traverse(o=>{if(o.geometry)gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])if(!Object.values(palette).includes(m)){ms.add(m);if(m.map)ts.add(m.map);}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());if(root.parent)root.parent.remove(root);};
room=group(scene);const floor=group(room),perimeter=group(room),architecture=group(room),roof=group(room),vault=group(room),furnishings=group(room),labels=group(room),proposal=group(room);
// Patios P1 y P2: se dejan vacíos, como en la maqueta recibida, con antepechos de ladrillo de 12 cm por dentro del borde.
const pits=[{x1:9.5,x2:12.2,z1:0,z2:2.3},{x1:0,x2:2.6,z1:3.85,z2:5.75}];
[[0,2.6,0,3.85],[2.6,9.5,0,W],[9.5,12.2,2.3,W],[12.2,L,0,W]].forEach(([a,b,c,d])=>box(floor,b-a,.1,d-c,(a+b)/2,-.05,(c+d)/2,palette.slab));
for(const p of pits){const m=new THREE.Mesh(new THREE.BoxGeometry(p.x2-p.x1,.1,p.z2-p.z1),palette.pit);m.position.set((p.x1+p.x2)/2,-.05,(p.z1+p.z2)/2);m.receiveShadow=true;floor.add(m);}
// P1 (central) a 1,20 m, como el muro exterior; P2 (trasero) a 0,60 m.
wall(floor,'z',0,2.3,9.56,1.2);wall(floor,'x',9.62,12.08,2.24,1.2);wall(floor,'z',0,2.3,12.14,1.2);wall(floor,'x',0,2.6,3.91,.6);wall(floor,'z',3.97,W,2.54,.6);
// Frente de entrada: reja metálica blanca fija de 1,20 m, conservando los accesos.
function frontGrille(){
 const g=group(perimeter);g.name='front-grille';
 for(const [a,b] of [[0,.85],[2.3,3.75],[4.7,W]]){
  const profile=.035;
  for(const y of [profile/2,1.2-profile/2])box(g,profile,profile,b-a,L+.06,y,(a+b)/2,palette.fence);
  for(const z of [a+profile/2,b-profile/2])box(g,profile,1.2,profile,L+.06,.6,z,palette.fence);
  const n=Math.ceil((b-a)/.12);
  for(let j=1;j<n;j++)box(g,.02,1.2-2*profile,.02,L+.06,.6,a+(b-a)*j/n,palette.fence);
 }
}
// Propuesta opcional de cerramiento entre la cocina y el patio 1. No forma parte del estado real: solo se dibuja si se elige.
// Prolonga el antepecho del patio (x=9,56) hasta la línea del muro de la habitación (z=3,00) y cierra de 1,20 a 2,50 m;
// las cuatro opciones cubren los 3 m completos, incluido el tramo sobre la nevera.
function buildProposal(){while(proposal.children.length)dispose(proposal.children[0]);const k=state.room.proposal;if(!PROPOSALS.includes(k))return;
 const x=9.56,t=.12,y0=1.2,y1=2.5,a=0,b=3,len=b-a,mid=(a+b)/2;
 wall(proposal,'z',2.3,b,x,y0);
 const rejilla=(z,y,w,h)=>{box(proposal,t+.02,h,w,x,y,z,palette.dark);for(let s=y-h/2+.02;s<y+h/2-.01;s+=.03)box(proposal,t+.04,.008,w-.02,x,s,z,palette.white);};
 const louverPanel=(parent,xx,z0,width)=>{const height=y1-y0,g=group(parent);g.position.set(xx,y0,z0);for(const z of [.025,width-.025])box(g,.045,height,.05,0,height/2,z,palette.white);for(const y of [.025,height-.025])box(g,.045,.05,width,0,y,width/2,palette.white);const n=Math.max(1,Math.round((width-.1)/.105)),step=(width-.1)/n;for(let i=0;i<n;i++){const blade=box(g,.025,height-.1,.13,0,height/2,.05+step*(i+.5),palette.white);blade.rotation.y=Math.PI/4;}return g;};
 if(k==='lamas'){louverPanel(proposal,x,a,len);}
 else if(k==='movil'){const width=len/3;for(const y of [y0+.025,y1-.025])box(proposal,.36,.035,b,x+.21,y,b/2,palette.dark);for(let i=0;i<3;i++){const start=a+i*width,panel=louverPanel(proposal,x+.09+i*.12,start,width);panel.userData.slideStart=start;}setProposalOpen();}
 else{const top=k==='ventana'?2.1:2.3;box(proposal,.02,top-y0,len,x,(y0+top)/2,mid,k==='ventana'?palette.glass:palette.acrylic);
  for(let i=0;i<=3;i++)box(proposal,.06,top-y0,.04,x,(y0+top)/2,Math.min(b-.02,Math.max(a+.02,a+len*i/3)),palette.dark);
  for(const y of [y0+.02,top-.02])box(proposal,.06,.04,len,x,y,mid,palette.dark);
  box(proposal,t,y1-top,len,x,(top+y1)/2,mid,brick(len,y1-top));for(const z of [a+len/6,mid,b-len/6])rejilla(z,(top+y1)/2,.4,Math.min(.2,y1-top-.06));}
 for(const z of [1.4,2.4])rejilla(z,.25,.3,.15);}
function setProposalOpen(){const t=state.room.proposalOpen||0;for(const p of proposal.children)if(p.userData.slideStart!==undefined)p.position.z=p.userData.slideStart*(1-t);}
function proposalUI(){const k=state.room.proposal;$('proposal-note').hidden=!proposalNotes[k];$('proposal-note').textContent=proposalNotes[k]||'';$('proposal-open-label').hidden=k!=='movil';$('proposal-open').value=state.room.proposalOpen||0;$('proposal-open-value').textContent=Math.round((state.room.proposalOpen||0)*100)+' %';}
function buildPerimeter(){while(perimeter.children.length)dispose(perimeter.children[0]);const h=state.room.wallHeight;wall(perimeter,'x',-.12,L+.12,W+.06,h);wall(perimeter,'z',0,W,-.06,h);frontGrille();perimeter.traverse(o=>{if(o.material&&o.material!==palette.fence&&h>1.5){o.material.transparent=true;o.material.opacity=.5;}});wall(perimeter,'x',-.12,L+.12,-.06,2.5);buildProposal();}
wall(architecture,'z',0,2.32,2.06,2.5);wall(architecture,'x',2,3.32,2.26,2.5,.12,[{a:2.6,b:3.3,top:2.05}]);wall(architecture,'z',0,3,3.38,2.5);wall(architecture,'x',3.32,7.5,2.94,2.5,.12,[{a:3.9,b:5.6,sill:.6,top:2.1},{a:5.96,b:6.86,top:2.05}]);wall(architecture,'z',0,3,7.44,2.5);
// Acabado estucado de la cara de habitación detrás del clóset; no es un tablero.
const closetWallFinish=new THREE.Mesh(new THREE.PlaneGeometry(3,2.5),new THREE.MeshStandardMaterial({color:0xe6e2d8,roughness:.98,side:THREE.DoubleSide}));closetWallFinish.rotation.y=-Math.PI/2;closetWallFinish.position.set(7.3799,1.25,1.5);architecture.add(closetWallFinish);
box(architecture,1.7,1.5,.02,4.75,1.35,2.94,palette.glass);// Hojas de baño (70 cm) y habitación (90 cm): bisagra del lado de la habitación/clóset, abren hacia adentro.
const buildingDoors=[[3.3,2.2,.7],[6.86,2.88,.9]].map(([x,z,w])=>{const pivot=mover(group(architecture),t=>pivot.rotation.y=-Math.PI/2*t);pivot.position.set(x,0,z);box(pivot,w,2.03,.035,-w/2,1.025,.0175,palette.door);box(pivot,.12,.025,.1,.08-w,1,.0175,palette.dark);return pivot;});
const setDoors=t=>setMovers(buildingDoors,t);// Cielo raso sobre la franja construida; el paso exterior frente al baño queda sin cielo raso.
box(roof,1.48,.04,2.34,2.64,2.52,1.09,palette.roof);
// Filo exterior de la habitación: z=3.00; encuentro con la cara exterior de C: x=9.62.
const ceiling={x0:3.38,x1:9.62,z0:-.08,z1:3};
box(roof,ceiling.x1-ceiling.x0,.04,ceiling.z1-ceiling.z0,(ceiling.x0+ceiling.x1)/2,2.52,(ceiling.z0+ceiling.z1)/2,palette.roof);
// Medianera derecha de 2,50 m; lado izquierdo abierto sobre pilares cada ~4 m que reciben el techo en arco (flecha 0,50 m).
{const n=Math.round(L/4);for(let j=0;j<=n;j++)box(floor,.2,2.5,.2,Math.min(L-.1,Math.max(.1,L*j/n)),1.25,W+.06,palette.white);
const z0=-.06,z1=W+.06,c=z1-z0,f=.5,R=(c*c/4+f*f)/(2*f),arc=z=>2.5+Math.sqrt(R*R-(z-(z0+z1)/2)**2)-(R-f),shape=new THREE.Shape(),N=48;
for(let j=0;j<=N;j++){const z=z0+c*j/N;j?shape.lineTo(z,arc(z)):shape.moveTo(z,arc(z));}for(let j=N;j>=0;j--){const z=z0+c*j/N;shape.lineTo(z,arc(z)+.05);}
const shell=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:L+.24,bevelEnabled:false}),palette.roof);shell.rotation.y=-Math.PI/2;shell.position.x=L+.12;shell.receiveShadow=true;vault.add(shell);}
// Aparatos y cama: referencias esquemáticas del modelo de terraza, no diseños de fabricación.
[[.6,.9,.8,1.7,.45,.4,'white'],[.42,.18,.6,1.7,.82,.4,'water'],[.67,.97,.652,1.665,.485,1.33,'white'],[.01,.3,.3,1.325,.55,1.33,'dark'],[1.2,.04,.9,2.72,.02,.45,'water'],[.6,1.9,.02,2.42,.97,.9,'glass'],[.6,1.9,.02,3.02,.97,.87,'glass'],[1.2,.03,.05,2.72,1.935,.885,'dark'],[.556,.4,.368,2.578,.2,1.26,'white'],[.18,.634,.368,2.21,.317,1.26,'white'],[2,.45,1.6,4.52,.23,1.44,'bed'],[.08,.95,1.6,3.48,.48,1.44,'wood'],[.45,.12,.65,3.8,.52,1.04,'white'],[.45,.12,.65,3.8,.52,1.84,'white'],[.556,1.685,.67,9.21,.8425,.34,'white']].forEach(a=>box(furnishings,...a.slice(0,6),palette[a[6]]));
// Sala exterior: accesorios de ambientación según la imagen de referencia, sin diseño de fabricación.
function piece(x,z,rot,parts){const g=group(furnishings);g.position.set(x,0,z);g.rotation.y=rot;parts.forEach(a=>box(g,...a.slice(0,6),palette[a[6]]));return g;}
function disc(parent,r,h,x,y,z,m){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,32),m);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;}
const facing=(x,z,tx,tz)=>Math.atan2(tx-x,tz-z),table=[15.3,3];
disc(furnishings,1.6,.01,...[table[0],.005,table[1]],palette.jute);
piece(table[0],1.85,0,[[2.2,.25,.9,0,.125,0,'wood'],[1.9,.15,.7,0,.325,.08,'bed'],[1.9,.45,.18,0,.55,-.33,'bed'],[.15,.6,.9,-1.025,.3,0,'wood'],[.15,.6,.9,1.025,.3,0,'wood'],[.4,.35,.12,-.6,.55,-.2,'sage'],[.4,.35,.12,.6,.55,-.2,'sage']]);
piece(...table,0,[[1.2,.08,.6,0,.38,0,'wood'],[1.1,.3,.5,0,.17,0,'wood']]);
for(const [x,z] of [[13.85,3.95],[16.75,3.95]])piece(x,z,facing(x,z,...table),[[.75,.25,.75,0,.125,0,'wood'],[.6,.15,.6,0,.32,.05,'bed'],[.6,.4,.15,0,.55,-.28,'bed'],[.08,.55,.75,-.335,.275,0,'wood'],[.08,.55,.75,.335,.275,0,'wood'],[.35,.3,.1,0,.55,-.17,'sage']]);
disc(furnishings,.25,.5,16.85,.25,2.05,palette.wood);
// Jardinera sobre la medianera.
box(furnishings,6.2,.45,.4,16.5,.225,.22,palette.dark);for(let x=13.75;x<19.5;x+=.55){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(.24,0),palette.leaf);m.position.set(x,.62,.22);m.scale.y=1.4;m.castShadow=true;furnishings.add(m);}
function label(txt,x,y,z){const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.fillStyle='#fffef5e8';g.fillRect(0,0,512,96);g.fillStyle='#354b40';g.font='32px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,256,48);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.position.set(x,y,z);s.scale.set(1.8,.34,1);s.renderOrder=10;labels.add(s);}
[['Baño',2.7,2.8,1.1],['Habitación',5.3,2.8,1.5],['Cocina',8.5,2.8,1.5],['Patio 1',10.85,.2,1.15],['Patio 2',1.3,.2,4.8],['Lavadero',1.6,1.3,.75],['Sala exterior',15.3,1.5,3],['Entrada',19.8,.3,4.2],['Escalera',19.8,.3,1.6]].forEach(a=>label(...a));
stageFloor=box(scene,12,.04,10,1.3,-.035,1,palette.slab);stageFloor.visible=false;solo=group(scene);
function template(i){const root=new THREE.Group(),w=i.w/100,h=i.h/100,d=i.d/100,t=.018;const shell=palette.wood;box(root,t,h,d,t/2,h/2,d/2,shell);box(root,t,h,d,w-t/2,h/2,d/2,shell);box(root,w-2*t,t,d,w/2,t/2,d/2,shell);box(root,w-2*t,t,d,w/2,h-t/2,d/2,shell);box(root,w-2*t,h-2*t,.006,w/2,h/2,.003,palette.white);let doors=[];
 if(i.type==='closet'){box(root,t,h-2*t,d,w/2,h/2,d/2,shell);box(root,w/2-1.5*t,t,d,w*.75,h*.55,d/2,shell);box(root,w/2-1.5*t,t,d,w*.75,h*.3,d/2,shell);const bar=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,w/2-2*t,12),palette.dark);bar.rotation.z=Math.PI/2;bar.position.set(w*.25,h*.83,d*.5);root.add(bar);for(let j=0;j<2;j++){const pivot=group(root);pivot.position.set(j?w:0,0,d);const door=box(pivot,w/2-.004,h-.006,t,j?-w/4:w/4,h/2,t/2,shell);box(pivot,.012,.18,.02,j?-w/2+.05:w/2-.05,h*.52,.03,palette.dark);mover(pivot,t=>pivot.rotation.y=(j?1:-1)*t*1.6);doors.push(pivot);}}
 else{for(let j=1;j<=3;j++)box(root,w-2*t,t,d,w/2,h*j/4,d/2,shell);}
 return {root,setOpen(t){setMovers(doors,t);}};
}
function build(i){const m=i.type==='kitchen'?window.EspaciosModels.kitchenProposal(THREE):i.type==='closet'?window.EspaciosModels.closetOption3(THREE):i.type==='bathroom'?window.EspaciosModels.bathroom(THREE):template(i);const outer=new THREE.Group();outer.add(m.root);room.add(outer);models.set(i.id,{...m,outer});m.setOpen(i.open);}
function rebuildAll(){setDoors(state.room.doors);models.forEach(m=>dispose(m.outer));models.clear();for(const i of state.items)build(i);}
function item(){return state.items.find(i=>i.id===state.selected);}
function transform(){
 for(const i of state.items){const m=models.get(i.id),active=state.mode==='item'&&i.id===state.selected;(active?solo:room).add(m.outer);m.outer.visible=active?true:state.mode==='room'&&i.visible;m.outer.position.set(active?0:i.x/100,0,active?0:i.z/100);m.outer.rotation.y=active?0:i.rotation*Math.PI/180;}
 room.visible=state.mode==='room';solo.visible=state.mode==='item';stageFloor.visible=state.mode==='item';
 architecture.visible=state.room.architecture;roof.visible=state.room.roof;vault.visible=state.room.vault;furnishings.visible=state.room.furnishings;labels.visible=state.room.labels;
 if(selectionBox){scene.remove(selectionBox);selectionBox.geometry.dispose();selectionBox.material.dispose();selectionBox=null;}
 const current=item();if(current&&(state.mode==='item'||current.visible)){selectionBox=new THREE.BoxHelper(models.get(current.id).outer,0x698158);selectionBox.material.transparent=true;selectionBox.material.opacity=.5;scene.add(selectionBox);}
 warn();
}
function footprint(i){const r=i.rotation*Math.PI/180,w=i.w/100,d=i.d/100;return [[0,0],[w,0],[w,d],[0,d]].map(([x,z])=>[i.x/100+x*Math.cos(r)+z*Math.sin(r),i.z/100-x*Math.sin(r)+z*Math.cos(r)]);}
function warn(){if(state.mode!=='room'){$('warnings').textContent='';return;}const notes=['Ubicación propuesta: la cocina de 260 cm ocupa el muro transversal de 3 m; reemplaza el mesón esquemático de 210 cm del plano.'];if(state.room.proposal)notes.push('Propuesta de cerramiento de la cocina: no es el estado actual. Con estufa y horno a gas, el cerramiento necesita ventilación permanente arriba y abajo (rejillas); la valida el gasista.');for(const i of state.items.filter(i=>i.visible)){const p=footprint(i),xs=p.map(p=>p[0]),zs=p.map(p=>p[1]),b={minX:Math.min(...xs),maxX:Math.max(...xs),minZ:Math.min(...zs),maxZ:Math.max(...zs)};if(p.some(([x,z])=>x<-.005||x>L+.005||z<-.005||z>W+.005))notes.push(i.name+': sale del perímetro de la terraza.');for(const pit of pits)if(b.maxX>pit.x1+.005&&b.minX<pit.x2-.005&&b.maxZ>pit.z1+.005&&b.minZ<pit.z2-.005)notes.push(i.name+': revisa su ubicación sobre el vacío de un patio.');} scene.updateMatrixWorld(true);const doorBoxes=[];buildingDoors[1].traverse(o=>{if(o.isMesh)doorBoxes.push(new THREE.Box3().setFromObject(o));});for(const i of state.items.filter(i=>i.visible&&i.type==='closet')){const closetBox=new THREE.Box3().setFromObject(models.get(i.id).outer);if(doorBoxes.some(db=>{const overlap=closetBox.clone().intersect(db);if(overlap.isEmpty())return false;const size=overlap.getSize(new THREE.Vector3());return Math.min(size.x,size.y,size.z)>.005;}))notes.push(i.name+': el lado derecho se utiliza con la puerta de habitación cerrada, según el usuario. El giro dibujado cruza el clóset: comprobar el ángulo y tope reales para distinguir acceso tapado de contacto físico.');} $('warnings').textContent=notes.join(' ');}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$('save-state').textContent='Guardado en este navegador · '+new Date().toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});}catch(e){$('save-state').textContent='No se pudo guardar aquí. Usa Descargar proyecto para conservar tus cambios.';}}
// En el muro transversal (giro 90°), el origen coincide con el extremo izquierdo del mesón.
function detailURL(i,v){return i.type==='kitchen'&&((i.rotation%360)+360)%360===90?v.viewer+'?medianera='+encodeURIComponent(i.z):v.viewer;}
function renderUI(){
 $('project-name').value=state.name;$('items').replaceChildren();for(const i of state.items){const b=document.createElement('button');b.className='item';b.setAttribute('aria-pressed',String(i.id===state.selected));const dot=document.createElement('span');dot.className='dot';const text=document.createElement('span');text.textContent=i.name;const sm=document.createElement('small');sm.textContent=`${i.w} × ${i.d} × ${i.h} cm${i.visible?'':' · oculto'}`;text.append(sm);b.append(dot,text);b.onclick=()=>{state.selected=i.id;transform();renderUI();if(state.mode==='item')view('general');save();};$('items').append(b);}
 const i=item();$('selected-title').textContent=i?.name||'Sin mueble seleccionado';for(const k of ['item-name','w','d','h','x','z','rotation','visible','openness','remove'])$(k).disabled=!i;
 if(i){$('item-name').value=i.name;for(const k of ['w','d','h','x','z','rotation'])$(k).value=i[k];$('visible').checked=i.visible;$('openness').value=i.open;for(const k of ['w','d','h'])$(k).disabled=fixedVariant(i);const v=variantOf(i);$('variant-label').hidden=!v;if(v){$('variant').replaceChildren(...VARIANTS[i.type].map(o=>new Option(o.label,o.id,false,o.id===v.id)));}$('detail-links').hidden=!v?.despiece;if(v?.despiece){$('despiece-link').href=v.despiece;$('viewer-link').href=detailURL(i,v);}
 $('item-description').textContent=i.type==='kitchen'?'Modelo detallado del despiece. Mesón de '+v.w+' × 62 cm. '+v.note:(i.type==='closet'||i.type==='bathroom')?(v.note||'Referencia del clóset de la maqueta. Puedes editar sus medidas; su distribución interior es ilustrativa.'):'Plantilla abierta con tres entrepaños. Ajusta sus medidas para explorar otro mueble.';$('fixed-note').textContent=fixedVariant(i)?(i.type==='closet'?'Altura montada de 238 cm; el hueco mide 240 cm. Herrajes y fijaciones por confirmar antes de fabricar.':i.type==='bathroom'?'Alto de 150 cm entre extremos del conjunto; base a 26 y techo a 176 cm del suelo. Granito y equipos provisionales.':'Medidas fijas para conservar la coherencia con el despiece.'):'Medidas visuales editables; requieren diseño y despiece antes de fabricar.';}
 const detailVariant=i&&variantOf(i);$('despiece-link').hidden=!detailVariant?.despiece;$('detail-links').hidden=!detailVariant?.viewer;if(detailVariant?.viewer){$('viewer-link').href=detailURL(i,detailVariant);if(detailVariant.despiece)$('despiece-link').href=detailVariant.despiece;$('viewer-link').textContent='Abrir visor detallado · '+i.w+' cm ↗';}
 $('placement').hidden=state.mode!=='room';$('zone-bar').hidden=state.mode!=='room';renderCatalog();$('room-options').hidden=state.mode!=='room';$('open-label').hidden=!i||i.type==='shelf';
 $('mode-room').setAttribute('aria-pressed',state.mode==='room');$('mode-item').setAttribute('aria-pressed',state.mode==='item');$('wall-height').value=state.room.wallHeight;$('doors').value=state.room.doors;$('wall-height-value').textContent=state.room.wallHeight.toFixed(2).replace('.',',')+' m';for(const k of ['roof','vault','architecture','furnishings','labels'])$(k).checked=state.room[k];$('proposal').value=state.room.proposal||'';proposalUI();
 $('canvas-label').replaceChildren();$('canvas-label').append(document.createTextNode(state.mode==='room'?state.name.toUpperCase():i?.name.toUpperCase()||'SIN MUEBLES'));const sp=document.createElement('span');sp.textContent=state.mode==='room'?'5,75 × 20,30 m':i?`${i.w} × ${i.d} × ${i.h} cm`:'Añade un diseño para empezar';$('canvas-label').append(sp);$('scene-status').textContent=state.mode==='room'?'Terraza del plano compartido':i?.type==='kitchen'?'Cocina del despiece actual':i?.type==='closet'?'Clóset · medidas de empotramiento por comprobar':i?.type==='bathroom'?'Baño · lavamanos y espejo':'Referencia visual editable';
}
// Accesos a cada espacio: [objetivo, cámara], mirando por encima del muro del frente.
const zones={bath:[[2.72,.7,1.1],[3.5,4.6,4.3]],bedroom:[[5.41,.6,1.44],[5.7,5.4,5.6]],kitchen:[[8.5,.8,1.4],[9.6,3.4,5.2]],proposal:[[9.3,1.4,1.5],[13.4,2.8,5.4]],laundry:[[1.2,.6,1.3],[1.6,3.6,4.9]],lounge:[[15,.4,3.1],[15.2,7.5,11.5]]};
let flight=null;function flyTo(target,pos){flight={t0:performance.now(),a:[controls.target.clone(),camera.position.clone()],b:[new THREE.Vector3(...target),new THREE.Vector3(...pos)]};}
let viewName='general';function view(name){viewName=name;flight=null;
 if(zones[name]&&state.mode==='room'){controls.minDistance=.5;flyTo(...zones[name]);document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));return;}
 if(zones[name])viewName=name='general';const single=state.mode==='item',i=item(),w=(i?.w||260)/100,h=(i?.h||215)/100,d=(i?.d||62)/100;const target=single?new THREE.Vector3(w/2,h*.45,d/2):new THREE.Vector3(9.6,.4,2.7);let p;
 if(single){const dist=Math.max(w,h,d)*1.8;p=name==='top'?[w/2,dist*1.4,d/2+.001]:name==='front'?[w/2,h*.5,dist]:[w/2+dist*.65,h*.65+dist*.45,d/2+dist*.85];controls.minDistance=.5;}else{p=name==='top'?[L/2,29,W/2+.001]:name==='entrance'?[19.6,1.65,4.6]:name==='front'?[10.15,9,18]:[23,16,19];if(name==='entrance')target.set(5,1.2,1.6);controls.minDistance=1;}
 if(single&&i?.type==='bathroom'){target.y+=.26;p[1]+=.26;}
 controls.target.copy(target);camera.position.set(...p);controls.update();
 // Ajusta el encuadre al aspecto real del lienzo, también en iPad vertical.
 if(name!=='entrance'){
  const bounds=single&&i?new THREE.Box3().setFromObject(models.get(i.id).outer):new THREE.Box3(new THREE.Vector3(-.12,0,-.12),new THREE.Vector3(L+.12,2.65,W+.12));
  const corners=[];for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])corners.push(new THREE.Vector3(x,y,z));
  for(let n=0;n<8;n++){camera.updateMatrixWorld();const extent=Math.max(...corners.map(c=>{const q=c.clone().project(camera);return Math.max(Math.abs(q.x),Math.abs(q.y));}));if(extent<.88)break;camera.position.sub(target).multiplyScalar(extent/.84).add(target);controls.update();}
 }
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));
}
// Pantalla completa (assets/fullscreen.js): accesos a la terraza completa o a un módulo concreto.
function focusOn(mode,id,name){state.mode=mode;if(id)state.selected=id;transform();renderUI();view(name);save();renderFullscreenBar();}
function renderFullscreenBar(){const bar=$('fs-bar');if(!bar)return;bar.replaceChildren();if(!stage.classList.contains('fs-on'))return;const closets=state.items.filter(i=>i.type==='closet').length;
 const chips=[['Terraza completa',state.mode==='room',()=>focusOn('room',null,'general')],...state.items.map(i=>[i.type==='kitchen'?'Cocina':i.type==='bathroom'?'Baño':i.type==='closet'&&closets===1?'Clóset':i.name,state.mode==='item'&&i.id===state.selected,()=>focusOn('item',i.id,'general')])];
 for(const [txt,on,fn] of chips){const b=document.createElement('button');b.type='button';b.textContent=txt;b.setAttribute('aria-pressed',String(on));b.onclick=fn;bar.append(b);}}
window.addEventListener('espacios-fullscreen',renderFullscreenBar);
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},60000);}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));$('fit').onclick=()=>view(viewName);
for(const mode of ['room','item'])$('mode-'+mode).onclick=()=>{state.mode=mode;transform();renderUI();view('general');save();};
$('project-name').onchange=()=>{state.name=$('project-name').value.trim()||'Mi espacio';renderUI();save();};
$('item-name').onchange=()=>{if(!item())return;item().name=$('item-name').value.trim()||'Mueble';renderUI();warn();save();};
for(const k of ['w','d','h','x','z','rotation'])$(k).onchange=()=>{const i=item();if(!i)return;const n=Number($(k).value),range={w:[30,500],d:[20,120],h:[30,300],x:[-3000,3000],z:[-3000,3000],rotation:[-360,360]}[k];if(!$(k).value||!finite(n,...range)){renderUI();return;}i[k]=n;if(['w','d','h'].includes(k)&&!fixedVariant(i)){dispose(models.get(i.id).outer);build(i);}transform();renderUI();save();};
// Cambia la versión conservando fija la esquina del muro de 3 m (la cocina va centrada en él).
function applyVariant(i,id){const oldW=i.w,v=VARIANTS[i.type].find(o=>o.id===id);i.variant=v.id;if(v.d)i.d=v.d;if(v.h)i.h=v.h;if(i.type==='closet')i.name=closetName(v.id);if(v.placement)Object.assign(i,v.placement);if(v.w){i.w=v.w;const d=i.type==='closet'?0:(oldW-v.w)/2,r=i.rotation*Math.PI/180;i.x=Math.round(i.x+d*Math.cos(r));i.z=Math.round(i.z-d*Math.sin(r));}dispose(models.get(i.id).outer);build(i);}
$('variant').onchange=()=>{const i=item();if(!i)return;applyVariant(i,$('variant').value);transform();renderUI();view(viewName);save();};
$('openness').oninput=()=>{if(!item())return;item().open=Number($('openness').value);models.get(item().id).setOpen(item().open);if(selectionBox)selectionBox.update();save();};
$('visible').onchange=()=>{if(!item())return;item().visible=$('visible').checked;transform();renderUI();save();};
$('remove').onclick=()=>{const i=item();if(!i)return;dispose(models.get(i.id).outer);models.delete(i.id);state.items=state.items.filter(x=>x.id!==i.id);state.selected=state.items[0]?.id||null;transform();renderUI();view('general');save();};
// Catálogo: cada familia despliega sus versiones. Elegir una cambia el mueble existente de ese tipo (o lo añade si no hay).
function renderCatalog(){const cat=$('catalog'),open=new Set([...cat.querySelectorAll('details[open]')].map(d=>d.dataset.type));cat.replaceChildren();
 for(const [type,icon,name] of FAMILIES){const d=document.createElement('details');d.className='family';d.dataset.type=type;d.open=open.has(type);const vs=VARIANTS[type],sum=document.createElement('summary');sum.innerHTML='<span></span><b></b><small></small>';sum.children[0].textContent=icon;sum.children[1].textContent=name;sum.children[2].textContent=vs.length>1?vs.length+' versiones':'1 versión';d.append(sum);
  for(const v of vs){const b=document.createElement('button');b.className='version';b.setAttribute('aria-pressed',String(state.items.some(i=>i.type===type&&i.variant===v.id)));b.textContent=v.label;b.onclick=()=>{const sel=item(),i=sel?.type===type?sel:state.items.find(x=>x.type===type);if(!i){addItem(type,v.id);return;}if(i.variant!==v.id)applyVariant(i,v.id);i.visible=true;state.selected=i.id;transform();renderUI();view(viewName);save();};d.append(b);}
  if(type==='closet'){const b=document.createElement('button');b.className='version add';b.textContent='+ Añadir otro clóset';b.onclick=()=>addItem('closet');d.append(b);}
  cat.append(d);}
 const b=document.createElement('button');b.className='family-free';b.innerHTML='<span>▦</span><b>Mueble libre</b><small>Estantería editable</small>';b.onclick=()=>addItem('shelf');cat.append(b);}
function addItem(type,variant){if(state.items.length>=30){$('save-state').textContent='Este proyecto admite hasta 30 muebles.';return;}const id=type+'-'+Date.now(),i={id,type,...VARIANTS[type]&&{variant:variant||VARIANTS[type][0].id},name:type==='kitchen'?'Cocina Cartagena':type==='closet'?'Clóset · referencia':type==='bathroom'?'Baño · lavamanos y espejo':'Mueble libre',w:type==='kitchen'?VARIANTS.kitchen.find(v=>v.id===(variant||VARIANTS.kitchen[0].id)).w:type==='closet'?160:100,d:type==='kitchen'?62:type==='closet'?60:40,h:type==='kitchen'?215:type==='closet'?210:180,x:1300,z:300,rotation:0,visible:true,open:0};const cv=VARIANTS[type]?.find(v=>v.id===i.variant);if(cv?.d)i.d=cv.d;if(cv?.h)i.h=cv.h;if(cv?.w)i.w=cv.w;if(type==='closet')i.name=closetName(cv?.id);if(cv?.placement)Object.assign(i,cv.placement);state.items.push(i);state.selected=id;build(i);transform();renderUI();view('general');save();}
$('doors').oninput=()=>{state.room.doors=Number($('doors').value);setDoors(state.room.doors);warn();save();};$('wall-height').oninput=()=>{state.room.wallHeight=Number($('wall-height').value);buildPerimeter();$('wall-height-value').textContent=state.room.wallHeight.toFixed(2).replace('.',',')+' m';save();};for(const k of ['roof','vault','architecture','furnishings','labels'])$(k).onchange=()=>{state.room[k]=$(k).checked;transform();save();};$('proposal').onchange=()=>{state.room.proposal=$('proposal').value;buildProposal();proposalUI();warn();save();if(state.room.proposal&&state.mode==='room')view('proposal');};
$('proposal-open').oninput=()=>{state.room.proposalOpen=Number($('proposal-open').value);setProposalOpen();proposalUI();save();};
$('export').onclick=()=>download(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),'espacios-3d-proyecto.json');$('import').onclick=()=>$('project-file').click();$('project-file').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>1000000)throw Error('El archivo de proyecto es demasiado grande (máximo 1 MB).');const next=validate(JSON.parse(await f.text()));state=next;rebuildAll();buildPerimeter();transform();renderUI();view('general');save();}catch(e){$('save-state').textContent='No se abrió el archivo: '+e.message;}finally{$('project-file').value='';}};
$('reset').onclick=()=>{if(!confirm('¿Restaurar la distribución inicial? Descarga antes tu proyecto si quieres conservarlo.'))return;state=initial();rebuildAll();buildPerimeter();transform();renderUI();view('general');save();};
$('snapshot').onclick=()=>{renderer.render(scene,camera);renderer.domElement.toBlob(blob=>{if(blob)download(blob,'espacios-3d-vista.png');},'image/png');};
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();if(models.size)view(viewName);}new ResizeObserver(resize).observe(stage);resize();
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('Se perdió el contexto WebGL. Recarga la página.');});
buildPerimeter();rebuildAll();transform();renderUI();view('general');$('loading').hidden=true;if(storageNotice)$('save-state').textContent=storageNotice;
// Toque corto sobre una puerta o cajón: alterna abierto/cerrado sin interferir con el giro de cámara.
const animating=new Set(),ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let press=null;
function solidHit(e){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);
 for(const hit of ray.intersectObjects([room,solo],true)){let o=hit.object,shown=true;for(let p=o;p;p=p.parent)if(!p.visible)shown=false;if(!shown||o.isSprite||(o.material?.transparent&&o.material.opacity<.6))continue;return hit;}
 const ground=new THREE.Vector3();return ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),0),ground)?{point:ground,object:null}:null;}
function moverAt(e){for(let o=solidHit(e)?.object;o;o=o.parent)if(o.userData.mover)return o.userData.mover;return null;}
let lastTap=null;function focusAt(e){const hit=solidHit(e);if(!hit)return;const t=hit.point.clone();t.y=Math.min(t.y,1.2);const off=camera.position.clone().sub(controls.target);off.setLength(Math.min(off.length(),5));flyTo(t.toArray(),t.clone().add(off).toArray());}
renderer.domElement.addEventListener('pointerdown',e=>{flight=null;press=e.isPrimary?{x:e.clientX,y:e.clientY,t:performance.now()}:null;});
renderer.domElement.addEventListener('pointerup',e=>{if(!press||Math.hypot(e.clientX-press.x,e.clientY-press.y)>8||performance.now()-press.t>500)return;press=null;const now=performance.now();if(lastTap&&now-lastTap.t<350&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<30){lastTap=null;focusAt(e);return;}lastTap={x:e.clientX,y:e.clientY,t:now};const u=moverAt(e);if(u){u.onInteract?.();u.target=u.target>.5?0:1;animating.add(u);}});
// Rueda: acerca hacia el punto bajo el cursor, no solo hacia el centro fijo.
renderer.domElement.addEventListener('wheel',e=>{flight=null;if(e.deltaY>=0)return;const hit=solidHit(e);if(!hit)return;const shift=hit.point.clone().sub(controls.target).multiplyScalar(.15);controls.target.add(shift);camera.position.add(shift);},{capture:true,passive:true});
renderer.domElement.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&!e.buttons)renderer.domElement.style.cursor=moverAt(e)?'pointer':'';});
function loop(){requestAnimationFrame(loop);if(flight){const k=Math.min(1,(performance.now()-flight.t0)/650),e=k*k*(3-2*k);controls.target.lerpVectors(flight.a[0],flight.b[0],e);camera.position.lerpVectors(flight.a[1],flight.b[1],e);if(k===1)flight=null;}controls.update();for(const u of animating){const d=u.target-u.t;if(Math.abs(d)<=.04){u.t=u.target;animating.delete(u);}else u.t+=Math.sign(d)*.04;u.apply(u.t);}renderer.render(scene,camera);}loop();
})();



