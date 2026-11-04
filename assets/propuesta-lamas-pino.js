/* Cortasol de tablillas orientables, todo en pino: marco doble y tablillas del mismo pino y el mismo acabado. Cada tablilla gira sobre dos pines con resorte, uno en cada
   punta; el peso se apoya en la pestaña del pin de abajo. Arriba, cada tablilla lleva un pasador de 1/4" a 37 mm del eje,
   hacia el patio, que entra en una sola platina de aluminio de 2871 mm. La platina descansa sobre las tablillas, escondida
   en el canal del riel superior, y al girar una o dos tablillas a mano se mueven las 30. Los tacos de tope del canal
   limitan el giro a 40°–140°. El marco tiene 140 mm de fondo en todo el perímetro y sus esquinas se traslapan por capas.
   Unidades en mm. +z = cocina, −z = patio, y = 0 en el antepecho. Medidas desde CortasolPinoData. */
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
scene.background=new T.Color('#f6f8f5');const root=new T.Group();scene.add(root);
// Acabados del pino: marco y tablillas llevan siempre el mismo.
const FIN={'Pino natural':['#d8b27a','#b48649'],'Pino miel':['#c08a4c','#9a6630'],'Nogal':['#7c5232','#5c3a20'],'Blanco':['#f1f0ea',null],'Gris humo':['#9a9c98',null],'Grafito':['#3b3f42',null]};
let mode='all',exploded=false,ghost=false,anim=false,fin='Pino natural',phi=AN.inicial;
const edgeMat=new T.LineBasicMaterial({color:0x2c3f38,transparent:true,opacity:.22});
const mat=(c,o={})=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.75},o));
const wall=mat(0xe4e2dc),ceil=mat(0xf2f1ec),steel=mat(0x6d7780,{metalness:.6,roughness:.35}),nylon=mat(0xf6f4ec,{roughness:.5}),
 alu=mat(0xc9ccce,{metalness:.35,roughness:.35,emissive:0x3a3d40}),hole=mat(0x262a28);
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
const ES=F.esquina.escalon,trim=sg=>sg.map(([a,b],i)=>[i?a:a+ES,i<sg.length-1?b:b-ES]);   // escalón de la esquina
function layer(sg,y,w,z,m,g,lines=true){for(const [a,b] of sg)box(b-a-1,C,w,m,(a+b)/2,y,z,g,lines);}
// --- Riel inferior: base trabada y tapa entera. La tapa lleva el hueco de cada punta y su ranura de entrada hacia la cocina.
function bottomRail(base,tapa,slatXs){const g=group();
 layer(base,C/2,F.A,0,railMat,g);layer(tapa,C*1.5,F.A,0,railMat,g);
 for(const x of slatXs){cyl(PN.punta/2+.4,.6,hole,x,TT+.31,0,g);const L=PN.ranura.L;box(PN.punta,.6,L,hole,x,TT+.31,L/2,g,false);}
 return g;}
// --- Riel superior: tira patio + tira cocina en tramos (dejan el canal boca abajo) y la base trabada encima.
function topRail(tiras,base,lift){const lo=group(lift*2),hi=group(lift*2.4),m=railTop;
 layer(tiras,YT+C/2,Z0+ZA,(Z0-ZA)/2,m,lo,!ghost);
 layer(tiras,YT+C/2,ZA-Z1,(Z1+ZA)/2,m,lo,!ghost);
 layer(base,YT+C*1.5,F.A,0,m,hi,!ghost);
 return lo;}
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
// Laterales: la capa exterior (k = 0) es 2 escalones más larga y entra en el escalón de los dos rieles.
function stiles(){for(const s of[-1,1])for(const k of[0,1])box(C,YT-TT+(k?0:2*ES),F.A,stileMat,s*(V.L/2-C*(k+.5)),TT+(YT-TT)/2,0);}
// --- La obra real: antepecho de ladrillo de 10 cm (el marco vuela 20 mm por cara, 2 sobre cada pestaña), medianera a la izquierda vista desde la cocina,
// extremo derecho libre y cielo raso de panel yeso del lado cocina, atornillado a perfiles metálicos. Piso a −1200.
const O=D.obra,FL=-O.antepecho.alto;
function brick(w,h){const c=document.createElement('canvas');c.width=256;c.height=128;const g=c.getContext('2d');g.fillStyle='#d9d2c4';g.fillRect(0,0,256,128);
 let s=11;const r=()=>(s=(s*16807)%2147483647)/2147483647;
 for(let row=0;row<2;row++)for(let k=-1;k<2;k++){const x=k*128+(row?64:0)+3,y=row*64+3;g.fillStyle=['#b4553a','#a84d34','#bd6344','#9f4a33'][Math.floor(r()*4)];g.fillRect(x,y,122,58);}
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(w/250,h/130);return mat(0xffffff,{map:t,roughness:.95});}
const steelLight=mat(0xb8bec4,{metalness:.5,roughness:.4}),panel=mat(0xf4f3ee,{roughness:.9,emissive:0x6b6a64}),floor=mat(0xe6e3dc,{roughness:1});
function context(){const c=group(),ta=O.antepecho.t,tm=O.medianera.t,cr=O.cielo;
 box(V.L,O.antepecho.alto,ta,brick(V.L,O.antepecho.alto),0,FL/2,0,c,false);                                      // antepecho
 box(tm,V.H-FL,1400,brick(1400,V.H-FL),-V.L/2-tm/2,(V.H+FL)/2,0,c,false);                                        // medianera
 box(V.L+tm+200,4,2600,floor,100-tm/2,FL-2,0,c,false);
 const yc=V.H;box(V.L+tm,cr.panel,900,panel,-tm/2,yc+cr.panel/2,-ZA+450,c,false);                             // panel yeso, del patio hacia la cocina
 box(V.L,cr.riel.h,cr.riel.A,steelLight,0,yc+cr.panel+cr.riel.h/2,0,c,false);                                     // riel del cielo raso sobre la ventana
 for(let k=1;k<4;k++)box(V.L+tm,cr.riel.h,cr.riel.A,steelLight,-tm/2,yc+cr.panel+cr.riel.h/2,-ZA+225*k+60,c,false);
 c.add(label('COCINA',600,FL+80,900),label('PATIO',600,FL+80,-900),label('MEDIANERA',-V.L/2-tm/2,V.H-150,-160,.7),label('EXTREMO LIBRE',V.L/2+60,V.H+260,0,.7),label('CIELO RASO',0,V.H+180,500,.7));
 return c;}
// --- Pestañas: bajan por las dos caras del antepecho y, en el extremo libre, un remate tapa la punta del muro (forma de U).
function flaps(sg,remate){const g=group(),PE=F.pestana,ta=O.antepecho.t;
 for(const sd of[-1,1])layerV(sg,-PE.h/2,PE.h,PE.t,sd*(ta/2+PE.t/2),railMat,g);
 if(remate&&PE.remate)box(PE.t,PE.h,ta+2*PE.t,stileMat,V.L/2+PE.t/2,-PE.h/2,0,g);
 return g;}
function layerV(sg,y,h,t,z,m,g){for(const [a,b] of sg)box(b-a-1,h,t,m,(a+b)/2,y,z,g);}
// --- Fijación a la obra: tapones de pino sobre los tornillos (al antepecho, al riel del cielo raso y a la medianera).
const plugMat=mat(0x8a6236,{roughness:.7});
const mids=n=>{const out=[];for(let k=0;k<n;k++){const target=-W/2+W*(k+.5)/n;const i=Math.round((target+W/2)/P-1);out.push(-W/2+P*(i+1));}return out;};
function anchors(lift){const g=group();const A=M.anclajes,r=5;
 for(const x of mids(A.antepecho.n))cyl(r,.8,plugMat,x,TT+.4,0,g);
 const gt=group(lift*2);for(const x of mids(A.cielo.n))cyl(r,.8,plugMat,x,YT-.4,(Z1+ZA)/2,gt);
 for(let k=0;k<A.medianera.n;k++){const o=new T.Mesh(new T.CylinderGeometry(r,r,.8,20),plugMat);o.rotation.z=Math.PI/2;o.position.set(-W/2+.4,TT+(YT-TT)*(k+.5)/A.medianera.n,0);g.add(o);}}
function clear(){root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.isSprite)o.material.map.dispose();});root.clear();bars.length=slats.length=0;}
function build(){clear();slatMat=stileMat=finishes[fin];railMat=along[fin];
 if(ghost&&mode==='all')slatMat=see(slatMat);
 railTop=(mode==='top'||ghost)?see(railMat):railMat;
 const lift=exploded?90:0;
 if(mode==='all'){context();stiles();
  const E=segs(F.juntas.entera),Tr=segs(F.juntas.trabada);bottomRail(Tr,trim(E),xs);flaps(E,true);topRail(trim(E),Tr,lift);
  anchors(lift);const tg=group(lift*2);for(const s of[-1,1])box(M.tope.L,C,Z1-Z0,railMat,s*(W/2+M.tope.L/2),YT+C/2,(Z0+Z1)/2,tg);   // tacos de tope sobre los laterales
  bar(B.L,xs,lift);const g=group(lift);for(const x of xs)slat(x,Y0,SL,g,true,true);}
 else if(mode==='top'){const half=300,near=xs.filter(x=>Math.abs(x+P/2)<half-50),h=200;
  topRail([[-half,half]],[[-half,half]],lift);bar(2*half-40,near,lift);const g=group(lift);for(const x of near)slat(x,YS-h,h,g,true,false);
  root.add(label('COCINA',0,YT+60,ZA+120,.6),label('PATIO',0,YT+60,-ZA-120,.6));}
 else if(mode==='bottom'){const half=300,near=xs.filter(x=>Math.abs(x+P/2)<half-50),h=200;
  bottomRail([[-half,half]],[[-half,half]],near);flaps([[-half,half]],false);box(2*half-40,220,D.obra.antepecho.t,brick(2*half,220),0,-110,0,root,false);const g=group(lift);for(const x of near)slat(x,Y0,h,g,false,true);
  root.add(label('COCINA',0,-40,ZA+120,.6),label('PATIO',0,-40,-ZA-120,.6));}
 else if(mode==='corner'){const a=V.L/2-380,b=V.L/2,h=320,ex=lift*1.4;
  const g=group();box(b-a,C,F.A,railMat,(a+b)/2,C/2,0,g);box(b-a-ES,C,F.A,railMat,(a+b-ES)/2,C*1.5,0,group(lift*.5));
  flaps([[a,b]],true);box(b-a,220,O.antepecho.t,brick(b-a,220),(a+b)/2,-110,0,root,false);
  const so=new T.Group();so.position.x=ex;root.add(so);box(C,h+ES,F.A,stileMat,b-C/2,C+(h+ES)/2,0,so);
  const si=new T.Group();si.position.set(ex*.55,lift*.5,0);root.add(si);box(C,h,F.A,stileMat,b-C*1.5,TT+h/2,0,si);
  for(const z of[-40,40])cyl(5,40,mat(0xc9a36d),b-C/2,C-15+20+lift*.3,z,so);                 // tarugos 10 × 40 entre la capa exterior del riel y el lateral
  for(const z of[-12,12])cyl(2.25,70,steel,b-C/2,35-lift*.6,z,group());                    // tornillos 4,5 × 70 desde la capa exterior del riel
  const gs=group(lift);for(const x of xs.filter(x=>x>a+60))slat(x,Y0,200,gs,false,true);
  root.add(label('COCINA',(a+b)/2,-40,ZA+120,.6),label('PATIO',(a+b)/2,-40,-ZA-120,.6),label('EXTREMO LIBRE',b+120,h+60,0,.6));}
 else{const half=330,near=xs.filter(x=>Math.abs(x+P/2)<half-40),h=30;   // planta: corte justo por encima de las tablillas
  const g=group();for(const x of near)slat(x,YS-h,h,g,true,false);bar(2*half-20,near,0);
  for(const z of[Z0,Z1])box(2*half,.5,1.2,hole,0,YS+8,z,root,false);
  root.add(label('COCINA',0,YS,ZA+110,.7),label('PATIO',0,YS,-ZA-90,.7));}
 setAngle(phi);
 for(const id of['all','top','bottom','corner','plan'])$(id).classList.toggle('active',id===mode);
 $('explode').disabled=mode!=='all'&&mode!=='top'&&mode!=='corner';$('explode').textContent=exploded?'Unir piezas':'Separar piezas';
 $('ghost').setAttribute('aria-pressed',String(ghost));$('anim').setAttribute('aria-pressed',String(anim));}
function setAngle(v){phi=Math.min(AN.max,Math.max(AN.min,v));const f=phi*deg,st=stats();
 for(const s of slats)s.rotation.y=-f;                                     // el ancho de la tablilla apunta a (cos φ, 0, sen φ)
 for(const b of bars)b.position.set(st.barX,b.position.y,st.barZ);
 const n=v=>v.toLocaleString('es-CO',{maximumFractionDigits:1});
 $('angle').value=Math.round(phi);$('angle-out').textContent=Math.round(phi)+'°';
 $('s-angle').textContent=Math.round(phi)+'°';$('s-air').textContent=Math.round(st.air*100)+' %';$('s-front').textContent=n(st.front)+' mm';$('s-bar').textContent=(st.barX>0?'+':'')+n(st.barX)+' mm';
 $('caption').textContent={all:'Todo en pino, con pestañas que bajan por las dos caras del antepecho de ladrillo: apoyado en él, atornillado arriba al riel del cielo raso y a la medianera; el extremo derecho queda libre. Una sola barra de aluminio arriba. A '+Math.round(phi)+'° pasa '+Math.round(st.air*100)+' % del aire y de frente se ve '+n(st.front)+' mm entre tablillas. Se gira a mano: al mover una o dos tablillas se mueven todas.',
  top:'Mecanismo arriba (riel transparente): cada tablilla lleva un pasador de 1/4" a '+R+' mm del eje, hacia el patio. La platina descansa sobre arandelas de nylon, dentro del canal, y sus puntas chocan con los tacos de tope a '+AN.min+'° y '+AN.max+'°.'+(exploded?' Separado: tablillas, barra, tiras del riel y base.':''),
  bottom:'Abajo: el riel apoya en el ladrillo y sus pestañas de '+F.pestana.h+' mm bajan por las dos caras del muro. Cada tablilla se apoya en la pestaña de su pin con resorte. La punta metálica entra en el hueco de la tapa del riel; la ranura de entrada de '+PN.ranura.L+' × '+PN.ranura.prof+' mm la guía al montar.',
  corner:'Esquina del extremo libre, abajo: la tapa del riel termina '+ES+' mm antes de la punta y la capa exterior del lateral baja hasta la base y llena ese escalón; la capa interior se apoya en la tapa. Arriba es igual, al revés. Se pega en las tres caras de contacto, con dos tarugos de 10 × 40 y dos tornillos de 4,5 × 70 desde la capa exterior del riel.'+(exploded?' Separado: capa exterior del lateral, capa interior, tapa y tarugos.':''),
  plan:'Planta por encima de las tablillas: la barra se corre '+n(R*(Math.cos(AN.min*deg)-Math.cos(AN.max*deg)))+' mm a lo largo y '+n(R*(1-Math.sin(AN.min*deg)))+' mm hacia el patio dentro del canal de '+(Z1-Z0)+' mm (líneas oscuras). Holgura de las tablillas de los extremos con el lateral: '+n(st.side)+' mm.'}[mode];}
function view(){camera.up.set(0,1,0);const Q={all:[[3300,150,4300],[-250,350,0]],top:[[-460,YT-360,-640],[0,YT-40,-20]],bottom:[[-460,230,640],[0,-10,0]],corner:[[V.L/2+560,420,760],[V.L/2-110,90,0]],plan:[[0,YS+760,1],[0,YS,0]]}[mode];
 camera.position.set(...Q[0]);controls.target.set(...Q[1]);controls.update();}
for(const id of['all','top','bottom','corner','plan'])$(id).onclick=()=>{mode=id;exploded=false;build();view();};
$('explode').onclick=()=>{exploded=!exploded;build();};$('ghost').onclick=()=>{ghost=!ghost;build();};
$('anim').onclick=()=>{anim=!anim;$('anim').setAttribute('aria-pressed',String(anim));};
$('angle').min=AN.min;$('angle').max=AN.max;$('angle').oninput=e=>{anim=false;$('anim').setAttribute('aria-pressed','false');setAngle(+e.target.value);};
const picker=(id,list,get,set)=>{const lbl=$(id).querySelector('small');$(id).innerHTML=(lbl?lbl.outerHTML:'')+Object.keys(list).map(k=>'<button type="button" data-c="'+k+'" aria-pressed="'+(k===get())+'"><i style="background:'+(Array.isArray(list[k])?list[k][0]:list[k])+'"></i>'+k+'</button>').join('');
 $(id).onclick=e=>{const b=e.target.closest('button');if(!b)return;set(b.dataset.c);for(const x of $(id).children)if(x.tagName==='BUTTON')x.setAttribute('aria-pressed',String(x===b));build();};};
picker('colors',FIN,()=>fin,v=>fin=v);
new ResizeObserver(()=>{renderer.setSize(stage.clientWidth,stage.clientHeight);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();}).observe(stage);
build();view();const t0=performance.now();
(function loop(now){requestAnimationFrame(loop);if(anim)setAngle(90-(90-AN.min)*Math.cos((now-t0)/1400));controls.update();renderer.render(scene,camera);})(t0);
window.modelReady=true;window.modelStats=()=>Object.assign(stats(),{slat:SL,pitch:P,bar:B.L});})();
