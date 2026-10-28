/* Detalles de módulo: aísla un módulo en pantalla completa, rotula cada tabla con su medida terminada
   (largo en sentido de veta × ancho, canto incluido) y lista piezas, cantos, corte teórico y herrajes.
   Cada visor aporta sus datos; aquí solo se presenta. Requiere assets/fullscreen.js. */
window.EspaciosDetail=function(o){'use strict';
const T=o.THREE,stage=o.stage,camera=o.camera,controls=o.controls,FS=window.EspaciosFullscreen;
const css=document.createElement('style');css.textContent=`
.md-panel{display:none}
#stage.md-on .md-panel{display:flex;flex-direction:column;position:absolute;z-index:6;top:max(76px,calc(env(safe-area-inset-top) + 62px));right:max(14px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));width:min(390px,42%);background:#fffefaf2;border:1px solid #d3d8ce;border-radius:12px;box-shadow:0 4px 20px #0002;font:13px/1.5 Arial,Helvetica,sans-serif;color:#253b35;overflow:hidden}
#stage.md-on .md-panel.md-collapsed{bottom:auto}
#stage.md-on .fs-bar{right:calc(min(390px,42%) + 28px)}
#stage.md-on .hint{display:none}
.md-head{padding:14px 16px 10px;border-bottom:1px solid #e2e5d9}
.md-head small{display:block;font-size:10px;letter-spacing:1.5px;color:#6c776f}
.md-head h2{font:400 21px/1.2 Georgia,serif;margin:3px 0 2px}
.md-head p{margin:0;color:#59695f;font-size:12px}
.md-tools{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:10px}
.md-tools button{min-height:36px;padding:6px 10px;font:12px Arial,Helvetica,sans-serif;color:#253b35;background:#fff;border:1px solid #d3d8ce;border-radius:8px;cursor:pointer;touch-action:manipulation}
.md-tools label{display:flex;align-items:center;gap:6px;font-size:12px}
.md-tools input{width:92px;accent-color:#253b35}
.md-body{overflow:auto;-webkit-overflow-scrolling:touch;padding:4px 16px 16px;flex:1}
.md-collapsed .md-body{display:none}
.md-body h3{font:600 11px Arial,Helvetica,sans-serif;letter-spacing:1.2px;text-transform:uppercase;color:#6c776f;margin:16px 0 6px}
.md-parts{list-style:none;margin:0;padding:0;display:grid;gap:5px}
.md-parts button{display:grid;grid-template-columns:auto 1fr auto;gap:0 8px;width:100%;text-align:left;padding:8px 10px;font:12px/1.45 Arial,Helvetica,sans-serif;color:#253b35;background:#fff;border:1px solid #e2e5d9;border-radius:8px;cursor:pointer;touch-action:manipulation}
.md-parts button[aria-pressed=true]{background:#e8efdf;border-color:#7f9b6c;box-shadow:inset 3px 0 #4d6a44}
.md-parts .id{font-weight:600;color:#4d6a44}
.md-parts .qty{color:#6c776f}
.md-parts .dim{grid-column:1/-1;font:600 16px Arial,Helvetica,sans-serif;margin-top:2px}
.md-parts .dim span{font:400 11px Arial;color:#6c776f}
.md-parts .more{grid-column:1/-1;color:#59695f;font-size:11.5px}
.md-hw{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.md-hw li{display:grid;grid-template-columns:34px 1fr;gap:0 6px;padding:8px 10px;background:#f3f5ee;border-radius:8px;font-size:12px}
.md-hw b{font-size:14px;color:#4d6a44}
.md-hw small{display:block;color:#59695f;font-size:11.5px}
.md-note{font-size:11.5px;color:#59695f;margin:10px 0 0}
@media (max-width:760px),(orientation:portrait){
 #stage.md-on .md-panel{top:auto;left:max(10px,env(safe-area-inset-left));right:max(10px,env(safe-area-inset-right));bottom:max(10px,env(safe-area-inset-bottom));width:auto;height:44%}
 #stage.md-on .md-panel.md-collapsed{height:auto}
 #stage.md-on .fs-bar{right:84px}
}`;document.head.append(css);
const panel=document.createElement('aside');panel.className='md-panel';panel.setAttribute('aria-label','Detalles del módulo');stage.append(panel);
const fmt=n=>Number(n).toLocaleString('es-CO',{maximumFractionDigits:2,useGrouping:false});
const edge=e=>e==='—'||e==null?0:Number(e);
// Cantos [L1, L2, A1, A2]: los dos lados largos y los dos cortos, como en el Excel.
function edgeText(p){if(!p.edges)return 'Sin canto';const e=p.edges.map(edge);if(e.every(x=>!x))return 'Sin canto';if(e.every(x=>x===e[0]))return 'Canto '+fmt(e[0])+' mm en los 4 lados';
 // Solo se nombran los bordes que llevan canto; el resto va sin canto (oculto contra otra pieza).
 const side=(a,b,one,two)=>{const v=[a,b].filter(Boolean);return !v.length?'':v.length===1?'1 '+one+' de '+fmt(v[0])+' mm':v[0]===v[1]?'2 '+two+' de '+fmt(v[0])+' mm':two+' de '+fmt(v[0])+' y '+fmt(v[1])+' mm';};
 return 'Canto en '+[side(e[0],e[1],'largo','largos'),side(e[2],e[3],'corto','cortos')].filter(Boolean).join(' · ')+(e.some(x=>!x)?'; el resto sin canto':'');}
const cut=p=>p.edges?[p.L-edge(p.edges[2])-edge(p.edges[3]),p.A-edge(p.edges[0])-edge(p.edges[1])]:[p.L,p.A];
let active=null,picked=null,tagMode=0,ghostHidden=false,collapsed=false,saved=null,offset=[0,0];
const tagModes=['Rótulos: medidas','Rótulos: código','Rótulos: ocultos'],tags=[];
const modMeshes=()=>o.meshes().filter(m=>o.moduleOf(m)===active.id);
function tagTexture(txt,on){const c=document.createElement('canvas'),g=c.getContext('2d'),font='600 38px Arial, Helvetica, sans-serif';g.font=font;const w=Math.ceil(g.measureText(txt).width)+30;c.width=w;c.height=58;g.font=font;g.fillStyle=on?'#253b35':'rgba(255,254,248,.94)';g.strokeStyle=on?'#253b35':'#8fa47c';g.lineWidth=3;g.beginPath();g.rect(1.5,1.5,w-3,55);g.fill();g.stroke();g.fillStyle=on?'#ffffff':'#253b35';g.textBaseline='middle';g.fillText(txt,15,31);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.minFilter=T.LinearFilter;t.generateMipmaps=false;return {t,aspect:w/58};}
function tagScale(s){const h=(window.matchMedia('(max-width:760px)').matches?20:24)/stage.clientHeight*2*Math.tan(camera.fov*Math.PI/360);s.scale.set(h*s.userData.aspect,h,1);}
function paintTag(s){const p=o.part(s.userData.piece),txt=tagMode===0?(p.tagLabel||p.id+' · '+fmt(p.L)+' × '+fmt(p.A)):p.id,{t,aspect}=tagTexture(txt,s.userData.piece===picked);s.material.map?.dispose();s.material.map=t;const sel=s.userData.piece===picked;s.renderOrder=sel?30:20;s.material.opacity=picked&&!sel?.35:1;s.material.needsUpdate=true;s.userData.aspect=aspect;s.visible=tagMode<2;tagScale(s);}
function clearTags(){for(const s of tags.splice(0)){s.parent?.remove(s);s.material.map?.dispose();s.material.dispose();}}
function buildTags(){clearTags();for(const m of modMeshes()){const id=o.pieceOf(m);if(!id||!o.part(id))continue;const s=new T.Sprite(new T.SpriteMaterial({depthTest:false,depthWrite:false,sizeAttenuation:false}));s.renderOrder=20;s.userData.piece=id;m.add(s);tags.push(s);paintTag(s);}}
// Guarda el estado de materiales y visibilidad para devolver el visor tal como estaba.
function save(){const mats=new Map(),vis=new Map();for(const m of o.meshes()){vis.set(m,m.visible);for(const mt of [].concat(m.material))if(!mats.has(mt))mats.set(mt,{transparent:mt.transparent,opacity:mt.opacity,depthWrite:mt.depthWrite,emissive:mt.emissive?.getHex(),ei:mt.emissiveIntensity});}saved={mats,vis,hide:(o.hide||[]).map(h=>[h,h.visible])};}
function restore(){if(!saved)return;for(const [mt,v] of saved.mats){mt.transparent=v.transparent;mt.opacity=v.opacity;mt.depthWrite=v.depthWrite;if(mt.emissive)mt.emissive.setHex(v.emissive);mt.emissiveIntensity=v.ei;mt.needsUpdate=true;}for(const [m,v] of saved.vis)m.visible=v;for(const [h,v] of saved.hide)h.visible=v;saved=null;}
function paint(){const mine=new Set(modMeshes());for(const m of o.meshes()){const inMod=mine.has(m),sel=inMod&&picked&&o.pieceOf(m)===picked,dim=inMod&&picked&&!sel;m.visible=inMod||!ghostHidden;for(const mt of [].concat(m.material)){const op=inMod?(dim?.3:1):.07;mt.transparent=op<1;mt.opacity=op;mt.depthWrite=op===1;if(mt.emissive){mt.emissive.setHex(sel?0x4d7a3a:0);mt.emissiveIntensity=sel?.55:1;}mt.needsUpdate=true;}}tags.forEach(paintTag);}
function frame(){const box=new T.Box3();for(const m of modMeshes())box.expandByObject(m);if(box.isEmpty())return;const c=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());
 const r=panel.getBoundingClientRect(),s=stage.getBoundingClientRect(),W=s.width,H=s.height,bottom=r.width>W*.8;offset=collapsed?[0,0]:bottom?[0,Math.min(H*.25,(s.bottom-r.top)/2)]:[Math.min(W*.3,(s.right-r.left)/2),0];
 camera.clearViewOffset();controls.target.copy(c);camera.position.copy(c).add(new T.Vector3(-.38,.28,1).normalize().multiplyScalar(size.length()*1.4+.3));controls.update();
 const fx=(W-2*offset[0])/W*.84,fy=(H-2*offset[1])/H*.84,corners=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])corners.push(new T.Vector3(x,y,z));
 for(let n=0;n<10;n++){camera.updateMatrixWorld();const e=Math.max(...corners.map(v=>{const q=v.clone().project(camera);return Math.max(Math.abs(q.x)/fx,Math.abs(q.y)/fy);}));if(e>.9&&e<1)break;camera.position.sub(c).multiplyScalar(e/.95).add(c);controls.update();}
 camera.setViewOffset(W,H,offset[0],offset[1],W,H);camera.updateProjectionMatrix();tags.forEach(tagScale);}
function render(){const m=active,parts=o.parts(m.id),count=parts.reduce((n,p)=>n+p.qty,0),hw=o.hardware(m.id)||[];
 panel.classList.toggle('md-collapsed',collapsed);
 panel.innerHTML=`<div class="md-head"><small>DETALLES DEL MÓDULO</small><h2></h2><p class="md-size"></p><div class="md-tools"><button type="button" data-a="tags"></button><button type="button" data-a="ghost"></button><button type="button" data-a="list"></button>${o.setOpen?'<label>Abrir <input type="range" min="0" max="1" step=".01" value="0"></label>':''}</div></div><div class="md-body"><h3></h3><ol class="md-parts"></ol><h3>Herrajes del módulo</h3><ul class="md-hw"></ul><p class="md-note md-mnote"></p><p class="md-note md-general"></p><p class="md-note">Medidas terminadas en mm: largo en sentido de veta × ancho, con canto incluido. Corte teórico = terminado menos cantos. Canto 2 = rígido; 0,45 = flexible. Toca una tabla en el 3D o en la lista para resaltarla.</p></div>`;
 panel.querySelector('h2').textContent=m.title;panel.querySelector('.md-size').textContent=m.size||'';panel.querySelector('.md-body h3').textContent='Tablas · '+count+' piezas en '+parts.length+' referencias';
 panel.querySelector('[data-a=tags]').textContent=tagModes[tagMode];panel.querySelector('[data-a=ghost]').textContent=ghostHidden?'Resto: oculto':'Resto: tenue';panel.querySelector('[data-a=list]').textContent=collapsed?'Mostrar lista ▴':'Ocultar lista ▾';
 const ol=panel.querySelector('.md-parts');for(const p of parts){const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.dataset.piece=p.id;b.setAttribute('aria-pressed',String(p.id===picked));const [cl,ca]=cut(p);
  b.innerHTML='<span class="id"></span><span class="name"></span><span class="qty"></span><span class="dim"></span><span class="more"></span>';b.querySelector('.id').textContent=p.id;b.querySelector('.name').textContent=p.name;b.querySelector('.qty').textContent='× '+p.qty;
  const dim=b.querySelector('.dim');dim.textContent=fmt(p.L)+' × '+fmt(p.A)+' ';const u=document.createElement('span');u.textContent='mm · e '+fmt(p.t);dim.append(u);
  b.querySelector('.more').textContent=edgeText(p)+'. Corte '+fmt(cl)+' × '+fmt(ca)+'.'+(p.material?' '+p.material+'.':'')+(p.note?' '+p.note:'');b.onclick=()=>pick(p.id);li.append(b);ol.append(li);}
 const ul=panel.querySelector('.md-hw');if(!hw.length){const li=document.createElement('li');li.textContent='Sin herrajes propios en el listado.';li.style.display='block';ul.append(li);}for(const [q,name,note] of hw){const li=document.createElement('li'),b=document.createElement('b'),t=document.createElement('span');b.textContent=q+' ×';t.textContent=name;if(note){const s=document.createElement('small');s.textContent=note;t.append(s);}li.append(b,t);ul.append(li);}
 panel.querySelector('.md-mnote').textContent=m.note||'';panel.querySelector('.md-general').textContent=o.general||'';
 panel.querySelector('[data-a=tags]').onclick=()=>{tagMode=(tagMode+1)%3;render();tags.forEach(paintTag);};panel.querySelector('[data-a=ghost]').onclick=()=>{ghostHidden=!ghostHidden;render();paint();};panel.querySelector('[data-a=list]').onclick=()=>{collapsed=!collapsed;render();frame();};
 const range=panel.querySelector('input[type=range]');if(range){range.value=o.openValue?.()??0;range.oninput=()=>o.setOpen(Number(range.value));}
 chips();}
function pick(id){picked=picked===id?null:id;paint();panel.querySelectorAll('[data-piece]').forEach(b=>{const on=b.dataset.piece===picked;b.setAttribute('aria-pressed',String(on));if(on)b.scrollIntoView({block:'nearest',behavior:'smooth'});});}
function chips(){const bar=FS?.bar;if(!bar)return;bar.replaceChildren();if(!FS.on())return;for(const [id,label] of [[null,o.wholeLabel||'Mueble completo'],...o.modules.map(m=>[m.id,m.chip||m.id])]){const b=document.createElement('button');b.type='button';b.textContent=label;const m=o.modules.find(x=>x.id===id);if(m)b.title=m.title;b.setAttribute('aria-pressed',String((active?.id??null)===id));b.onclick=()=>id?open(id):close(true);bar.append(b);}}
function open(id){const m=o.modules.find(x=>x.id===id);if(!m)return;if(!FS.on())FS.set(true);if(!active)save();else clearTags();active=m;picked=null;stage.classList.add('md-on');for(const [h] of saved.hide)h.visible=false;render();buildTags();paint();frame();}
function close(stay){if(!active)return;clearTags();restore();active=null;picked=null;stage.classList.remove('md-on');camera.clearViewOffset();camera.updateProjectionMatrix();o.onClose?.();if(stay)chips();}
window.addEventListener('espacios-fullscreen',e=>{if(!e.detail)close();chips();});
new ResizeObserver(()=>{if(active)requestAnimationFrame(frame);}).observe(stage);
// Toque en el 3D: selecciona la tabla del módulo activo.
function pickAt(e){const r=o.canvas.getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2),camera);const hit=ray.intersectObjects(modMeshes(),false).find(h=>o.pieceOf(h.object));if(hit)pick(o.pieceOf(hit.object));}
return {open,close:()=>close(true),pick:pickAt,get active(){return !!active;}};
};
