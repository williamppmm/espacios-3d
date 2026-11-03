/* Cortasol de tablillas orientables, todo en pino: marco doble y tablillas del mismo pino y el mismo acabado. Cada tablilla gira sobre dos pines con resorte, uno en cada
   punta; el peso se apoya en la pestaña del pin de abajo. Arriba, cada tablilla lleva un pasador de 1/4" a 40 mm del eje,
   hacia el patio, que entra en una sola platina de aluminio de 2867 mm. La platina descansa sobre las tablillas, escondida
   en el canal del riel superior, y al girar una o dos tablillas a mano se mueven las 30. Los tacos de tope del canal
   limitan el giro a 40°–140°. Unidades en mm. +z = cocina, −z = patio, y = 0 en el antepecho. Medidas desde CortasolPinoData. */
(()=>{'use strict';const T=THREE,D=window.CortasolPinoData,$=id=>document.getElementById(id),stage=$('stage');
const V=D.vano,LA=D.lama,F=D.marco,M=D.mecanismo,AN=D.angulo,B=M.barra,PN=M.pines,PS=M.pasador,part=id=>D.parts.find(p=>p.id===id),SL=part('T01').L;
const C=F.capa,TT=F.t,ZA=F.A/2,W=V.L-2*TT,P=W/LA.n,R=M.manivela,deg=Math.PI/180;
const Y0=TT+LA.holgura,YS=Y0+SL,YT=YS+LA.holgura,YB=YS+1;   // punta inferior, punta superior, cara inferior del riel superior, base de la barra (sobre arandela de 1 mm)
const Z0=M.canal.z0,Z1=M.canal.z1;                              // bordes del canal de la barra
const xs=Array.from({length:LA.n},(_,i)=>-W/2+P*(i+.5)),segC=k=>-V.L/2+F.tramo*(k+.5);
const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,1,20000),renderer=new T.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));stage.append(renderer.domElement);
const controls=new T.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;
const hemi=new T.HemisphereLight(0xffffff,0x8a9a90,.85),sun=new T.DirectionalLight(0xffffff,.55);sun.position.set(-900,2400,2600);scene.add(hemi,sun);
const root=new T.Group();scene.add(root);
// Acabados del pino: marco y tablillas llevan siempre el mismo.
const FIN={'Pino natural':['#d8b27a','#b48649'],'Pino miel':['#c08a4c','#9a6630'],'Nogal':['#7c5232','#5c3a20'],'Blanco':['#f1f0ea',null],'Gris humo':['#9a9c98',null],'Grafito':['#3b3f42',null]};
let mode='all',exploded=false,led=false,ghost=false,anim=false,fin='Pino natural',phi=AN.inicial;
const edgeMat=new T.LineBasicMaterial({color:0x2c3f38,transparent:true,opacity:.22});
const mat=(c,o={})=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.75},o));
const wall=mat(0xe4e2dc),ceil=mat(0xf2f1ec),steel=mat(0x6d7780,{metalness:.6,roughness:.35}),nylon=mat(0xf6f4ec,{roughness:.5}),
 alu=mat(0xc9ccce,{metalness:.35,roughness:.35,emissive:0x3a3d40}),hole=mat(0x262a28);
const glow=new T.MeshStandardMaterial({color:0xfff1d6,emissive:0xffd9a0,emissiveIntensity:0});
// Veta vertical dibujada en un lienzo para los acabados madera; los lisos usan el color plano.
function grain(a,b,along){const c=document.createElement('canvas');c.width=128;c.height=1024;const g=c.getContext('2d');g.fillStyle=a;g.fillRect(0,0,128,1024);
 let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;g.strokeStyle=b;
 for(let i=0;i<70;i++){g.globalAlpha=.08+r()*.22;g.lineWidth=.6+r()*2.4;const x=r()*128;g.beginPath();g.moveTo(x,0);for(let y=0;y<=1024;y+=64)g.lineTo(x+Math.sin(y/180+i)*3*r(),y);g.stroke();}
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;if(along){t.center.set(.5,.5);t.rotation=Math.PI/2;}return t;}
const finishes={};for(const [k,[a,b]] of Object.entries(FIN))finishes[k]=mat(b?0xffffff:a,{roughness:.62,map:b?grain(a,b):null});
const along={};for(const [k,[a,b]] of Object.entries(FIN))along[k]=mat(b?0xffffff:a,{roughness:.62,map:b?grain(a,b,true):null});   // rieles: veta a lo largo
const see=m=>{const o=m.clone();o.transparent=true;o.opacity=.2;o.depthWrite=false;return o;};
let slatMat,railMat,railTop,stileMat;   // railTop: el riel superior se vuelve transparente en las vistas del mecanismo
function box(w,h,d,m,x,y,z,parent=root,lines=true){const g=new T.BoxGeometry(w,h,d),o=new T.Mesh(g,m);o.position.set(x,y,z);if(lines)o.add(new T.LineSegments(new T.EdgesGeometry(g),edgeMat));parent.add(o);return o;}
function cyl(r,h,m,x,y,z,parent=root){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,20),m);o.position.set(x,y,z);parent.add(o);return o;}
const group=(y=0)=>{const g=new T.Group();g.position.y=y;root.add(g);return g;};
function label(text,x,y,z,s=1){const cv=document.createElement('canvas');cv.width=512;cv.height=96;const g=cv.getContext('2d');g.font='600 46px system-ui,sans-serif';g.fillStyle='#4f6a5f';g.textAlign='center';g.fillText(text,256,64);
 const sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),transparent:true}));sp.scale.set(420*s,79*s,1);sp.position.set(x,y,z);return sp;}

// Por cada ángulo: paso de aire (garganta perpendicular por paso), luz de frente, holgura con la vecina y corrimiento de la barra.
function stats(){const f=phi*deg,ext=LA.A/2*Math.abs(Math.cos(f))+LA.t/2*Math.sin(f);
 return {phi,air:(P*Math.sin(f)-LA.t)/P,front:Math.max(0,P-2*ext),side:P/2-ext,barX:-R*Math.cos(f),barZ:-R*Math.sin(f)};}

// Tramos de cada capa a partir de las juntas del marco: una capa entera (3 × 1000) y otra trabada (500 + 1000 + 1000 + 500).
const segs=list=>{let a=-V.L/2;return list.map(l=>{const r=[a,a+l];a+=l;return r;});};
function layer(sg,y,w,z,m,g,lines=true){for(const [a,b] of sg)box(b-a-1,C,w,m,(a+b)/2,y,z,g,lines);}
// --- Riel inferior: base trabada y tapa entera. La tapa lleva el hueco de cada punta y su ranura de entrada hacia la cocina.
function bottomRail(base,tapa,slatXs){const g=group();
 layer(base,C/2,F.A,0,railMat,g);layer(tapa,C*1.5,F.A,0,railMat,g);
 for(const x of slatXs){cyl(PN.punta/2+.4,.6,hole,x,TT+.31,0,g);const L=PN.ranura.L;box(PN.punta,.6,L,hole,x,TT+.31,L/2,g,false);}
 return g;}
// --- Riel superior: tira patio + tira cocina en tramos (dejan el canal boca abajo) y la base trabada encima.
function topRail(tiras,base,lift){const lo=group(lift*2),hi=group(lift*2.4),m=railTop;
 layer(tiras,YT+C/2,Z0+ZA,(Z0-ZA)/2,m,lo,!ghost);
 layer(tiras,YT+C/2,D.led.z0-Z1,(Z1+D.led.z0)/2,m,lo,!ghost);
 layer(base,YT+C*1.5,F.A,0,m,hi,!ghost);
 const a=tiras[0][0],b=tiras[tiras.length-1][1],len=b-a,cx=(a+b)/2;
 if(led){const zc=(D.led.z0+D.led.z1)/2;box(len-20,8,16,alu,cx,YT+4,zc,lo,false);box(len-24,.8,12,glow,cx,YT-.3,zc,lo,false);}}
// --- Barra de aluminio: sus agujeros siguen a los pasadores, así que se corre en x y en z sobre las arandelas.
const bars=[],slats=[];
function bar(len,slatXs,lift){const g=group(lift*1.6);bars.push(g);
 box(len,B.e,B.A,alu,0,YB+B.e/2,0,g);              // centrada en la línea de pasadores; el grupo se mueve con ellos
 for(const x of slatXs){cyl(B.agujero/2,.4,hole,x,YB+B.e+.2,0,g);}
 return g;}
// --- Tablilla con sus dos pines (pestaña de 10 mm, punta metálica) y el pasador arriba, hacia el patio.
function slat(x,y0,h,parent,top,bottom){const g=new T.Group();g.position.set(x,0,0);parent.add(g);slats.push(g);
 box(LA.A,h,LA.t,slatMat,0,y0+h/2,0,g,!ghost&&mode!=='plan');
 const pr=PN.pestana/2,tp=PN.punta/2;
 if(bottom){cyl(pr,1.5,nylon,0,Y0-.75,0,g);cyl(tp,6,steel,0,Y0-1.5-3,0,g);}
 if(top){cyl(pr,1.5,nylon,0,YS+.75,0,g);cyl(tp,7,steel,0,YS+1.5+3.5,0,g);
  const out=PS.L-PS.dentro;cyl(PS.d/2,out,steel,-R,YS+out/2,0,g);cyl(5.5,1,nylon,-R,YS+.5,0,g);}
 return g;}
function stiles(){for(const s of[-1,1])for(const k of[0,1])box(C,YT-TT,F.A,stileMat,s*(V.L/2-C*(k+.5)),TT+(YT-TT)/2,0);}
function context(){const c=group();
 box(V.L+400,420,260,wall,0,-210,0,c,false);box(V.L+400,160,480,ceil,0,V.H+80,0,c,false);
 for(const s of[-1,1])box(200,V.H,260,wall,s*(V.L/2+100),V.H/2,0,c,false);
 c.add(label('COCINA',0,-60,440),label('PATIO',0,-60,-440));}
const spots=[];function lights(on){for(const s of spots)scene.remove(s,s.target);spots.length=0;hemi.intensity=on?.3:.85;sun.intensity=on?.1:.55;scene.background=new T.Color(on?'#1f2523':'#f6f8f5');glow.emissiveIntensity=on?2.2:0;
 if(!on)return;const zc=(D.led.z0+D.led.z1)/2;for(let i=0;i<6;i++){const x=-W/2+W*(i+.5)/6,s=new T.SpotLight(0xffd9a6,1.1,1900,1.05,.9,1.4);
 s.position.set(x,YT-10,zc);s.target.position.set(x,0,zc);scene.add(s,s.target);spots.push(s);}}
function clear(){root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.isSprite)o.material.map.dispose();});root.clear();bars.length=slats.length=0;}
function build(){clear();slatMat=stileMat=finishes[fin];railMat=along[fin];
 if(ghost&&mode==='all')slatMat=see(slatMat);
 railTop=(mode==='top'||ghost)?see(railMat):railMat;
 const lift=exploded?90:0;
 if(mode==='all'){context();stiles();
  const E=segs(F.juntas.entera),Tr=segs(F.juntas.trabada);bottomRail(Tr,E,xs);topRail(E,Tr,lift);
  const tg=group(lift*2);for(const s of[-1,1])box(M.tope.L,C,Z1-Z0,railMat,s*(W/2+M.tope.L/2),YT+C/2,(Z0+Z1)/2,tg);   // tacos de tope sobre los laterales
  bar(B.L,xs,lift);const g=group(lift);for(const x of xs)slat(x,Y0,SL,g,true,true);}
 else if(mode==='top'){const half=300,near=xs.filter(x=>Math.abs(x+P/2)<half-50),h=200;
  topRail([[-half,half]],[[-half,half]],lift);bar(2*half-40,near,lift);const g=group(lift);for(const x of near)slat(x,YS-h,h,g,true,false);
  root.add(label('COCINA',0,YT+60,ZA+120,.6),label('PATIO',0,YT+60,-ZA-120,.6));}
 else if(mode==='bottom'){const half=300,near=xs.filter(x=>Math.abs(x+P/2)<half-50),h=200;
  bottomRail([[-half,half]],[[-half,half]],near);const g=group(lift);for(const x of near)slat(x,Y0,h,g,false,true);
  root.add(label('COCINA',0,-40,ZA+120,.6),label('PATIO',0,-40,-ZA-120,.6));}
 else{const half=330,near=xs.filter(x=>Math.abs(x+P/2)<half-40),h=30;   // planta: corte justo por encima de las tablillas
  const g=group();for(const x of near)slat(x,YS-h,h,g,true,false);bar(2*half-20,near,0);
  for(const z of[Z0,Z1])box(2*half,.5,1.2,hole,0,YS+8,z,root,false);
  root.add(label('COCINA',0,YS,ZA+110,.7),label('PATIO',0,YS,-ZA-90,.7));}
 lights(led&&mode==='all');setAngle(phi);
 for(const id of['all','top','bottom','plan'])$(id).classList.toggle('active',id===mode);
 $('explode').disabled=mode!=='all'&&mode!=='top';$('explode').textContent=exploded?'Unir piezas':'Separar piezas';
 $('led').setAttribute('aria-pressed',String(led));$('ghost').setAttribute('aria-pressed',String(ghost));$('anim').setAttribute('aria-pressed',String(anim));}
function setAngle(v){phi=Math.min(AN.max,Math.max(AN.min,v));const f=phi*deg,st=stats();
 for(const s of slats)s.rotation.y=-f;                                     // el ancho de la tablilla apunta a (cos φ, 0, sen φ)
 for(const b of bars)b.position.set(st.barX,b.position.y,st.barZ);
 const n=v=>v.toLocaleString('es-CO',{maximumFractionDigits:1});
 $('angle').value=Math.round(phi);$('angle-out').textContent=Math.round(phi)+'°';
 $('s-angle').textContent=Math.round(phi)+'°';$('s-air').textContent=Math.round(st.air*100)+' %';$('s-front').textContent=n(st.front)+' mm';$('s-bar').textContent=(st.barX>0?'+':'')+n(st.barX)+' mm';
 $('caption').textContent={all:'Todo en pino: marco doble de 36 mm y 30 tablillas con el mismo acabado, y una sola barra de aluminio arriba. A '+Math.round(phi)+'° pasa '+Math.round(st.air*100)+' % del aire y de frente se ve '+n(st.front)+' mm entre tablillas. Se gira a mano: al mover una o dos tablillas se mueven todas.',
  top:'Mecanismo arriba (riel transparente): cada tablilla lleva un pasador de 1/4" a '+R+' mm del eje, hacia el patio. La platina descansa sobre arandelas de nylon, dentro del canal, y sus puntas chocan con los tacos de tope a '+AN.min+'° y '+AN.max+'°.'+(exploded?' Separado: tablillas, barra, tiras del riel y base.':''),
  bottom:'Abajo: cada tablilla se apoya en la pestaña de su pin con resorte. La punta metálica entra en el hueco de la tapa del riel; la ranura de entrada de '+PN.ranura.L+' × '+PN.ranura.prof+' mm la guía al montar.',
  plan:'Planta por encima de las tablillas: la barra se corre '+n(R*(Math.cos(AN.min*deg)-Math.cos(AN.max*deg)))+' mm a lo largo y '+n(R*(1-Math.sin(AN.min*deg)))+' mm hacia el patio dentro del canal de '+(Z1-Z0)+' mm (líneas oscuras). Holgura de las tablillas de los extremos con el lateral: '+n(st.side)+' mm.'}[mode];}
function view(){camera.up.set(0,1,0);const Q={all:[[-2300,1500,3900],[0,560,0]],top:[[-460,YT-360,-640],[0,YT-40,-20]],bottom:[[-420,330,620],[0,40,0]],plan:[[0,YS+760,1],[0,YS,0]]}[mode];
 camera.position.set(...Q[0]);controls.target.set(...Q[1]);controls.update();}
for(const id of['all','top','bottom','plan'])$(id).onclick=()=>{mode=id;exploded=false;build();view();};
$('explode').onclick=()=>{exploded=!exploded;build();};$('led').onclick=()=>{led=!led;build();};$('ghost').onclick=()=>{ghost=!ghost;build();};
$('anim').onclick=()=>{anim=!anim;$('anim').setAttribute('aria-pressed',String(anim));};
$('angle').min=AN.min;$('angle').max=AN.max;$('angle').oninput=e=>{anim=false;$('anim').setAttribute('aria-pressed','false');setAngle(+e.target.value);};
const picker=(id,list,get,set)=>{const lbl=$(id).querySelector('small');$(id).innerHTML=(lbl?lbl.outerHTML:'')+Object.keys(list).map(k=>'<button type="button" data-c="'+k+'" aria-pressed="'+(k===get())+'"><i style="background:'+(Array.isArray(list[k])?list[k][0]:list[k])+'"></i>'+k+'</button>').join('');
 $(id).onclick=e=>{const b=e.target.closest('button');if(!b)return;set(b.dataset.c);for(const x of $(id).children)if(x.tagName==='BUTTON')x.setAttribute('aria-pressed',String(x===b));build();};};
picker('colors',FIN,()=>fin,v=>fin=v);
new ResizeObserver(()=>{renderer.setSize(stage.clientWidth,stage.clientHeight);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();}).observe(stage);
build();view();const t0=performance.now();
(function loop(now){requestAnimationFrame(loop);if(anim)setAngle(90-(90-AN.min)*Math.cos((now-t0)/1400));controls.update();renderer.render(scene,camera);})(t0);
window.modelReady=true;window.modelStats=()=>Object.assign(stats(),{slat:SL,pitch:P,bar:B.L});})();
