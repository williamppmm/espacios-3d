/* Cortasol de tablillas RH orientables con marco doble. Cada tablilla gira sobre pines de persiana (fijo abajo, con resorte
   arriba). Una barra de RH flota en el canal que dejan las dos tiras de la capa superior del riel inferior y mueve las diez
   tablillas del panel desde una perilla del lado cocina. Unidades en mm. +z = cocina, −z = patio, y = 0 en el antepecho.
   Medidas desde CortasolRHData. */
(()=>{'use strict';const T=THREE,D=window.CortasolRHData,$=id=>document.getElementById(id),stage=$('stage');
const V=D.vano,LA=D.lama,F=D.marco,M=D.mecanismo,AN=D.angulo,part=id=>D.parts.find(p=>p.id===id),SL=part('T01').L;
const C=F.capa,TT=F.t,ZA=F.A/2,W=V.L-2*TT,P=W/LA.n,PER=LA.n/F.paneles,R=M.manivela,deg=Math.PI/180;
const Y0=TT+LA.holgura,YT=Y0+SL+LA.holgura;   // punta inferior de la tablilla y cara inferior del riel superior
const xs=Array.from({length:LA.n},(_,i)=>-W/2+P*(i+.5)),panelC=k=>-W/2+W/F.paneles*(k+.5),segC=k=>-V.L/2+F.tramo*(k+.5);
const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,1,20000),renderer=new T.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));stage.append(renderer.domElement);
const controls=new T.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;
const hemi=new T.HemisphereLight(0xffffff,0x8a9a90,.85),sun=new T.DirectionalLight(0xffffff,.55);sun.position.set(-900,2400,2600);scene.add(hemi,sun);
const root=new T.Group();scene.add(root);
const COLORS={'Gris humo':['#9a9c98',null],'Madera clara':['#c9a06c','#a97f4e'],'Madera media':['#9c6b43','#7a4f2e'],'Blanco':['#f1f0ea',null],'Grafito':['#3b3f42',null]};
let mode='all',exploded=false,led=false,ghost=false,anim=false,color='Gris humo',phi=AN.inicial;
const edgeMat=new T.LineBasicMaterial({color:0x2c3f38,transparent:true,opacity:.22});
const mat=(c,o={})=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.75},o));
const wall=mat(0xe4e2dc),ceil=mat(0xf2f1ec),steel=mat(0x6d7780,{metalness:.6,roughness:.35}),nylon=mat(0xf6f4ec,{roughness:.5}),
 alu=mat(0xc9ccce,{metalness:.2,roughness:.4}),hole=mat(0x262a28),knobMat=mat(0x2f3432,{roughness:.4});
const glow=new T.MeshStandardMaterial({color:0xfff1d6,emissive:0xffd9a0,emissiveIntensity:0});
// Veta vertical dibujada en un lienzo para los colores madera; los lisos usan el color plano.
function grain(a,b){const c=document.createElement('canvas');c.width=128;c.height=1024;const g=c.getContext('2d');g.fillStyle=a;g.fillRect(0,0,128,1024);
 let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;g.strokeStyle=b;
 for(let i=0;i<70;i++){g.globalAlpha=.08+r()*.22;g.lineWidth=.6+r()*2.4;const x=r()*128;g.beginPath();g.moveTo(x,0);for(let y=0;y<=1024;y+=64)g.lineTo(x+Math.sin(y/180+i)*3*r(),y);g.stroke();}
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;return t;}
const finishes={};for(const [k,[a,b]] of Object.entries(COLORS)){finishes[k]=mat(b?0xffffff:a,{roughness:.62,map:b?grain(a,b):null});}   // con veta, el color ya va en la textura
const board=()=>finishes[color];let slatMat=board();
function box(w,h,d,m,x,y,z,parent=root,lines=true){const g=new T.BoxGeometry(w,h,d),o=new T.Mesh(g,m);o.position.set(x,y,z);if(lines)o.add(new T.LineSegments(new T.EdgesGeometry(g),edgeMat));parent.add(o);return o;}
function cyl(r,h,m,x,y,z,parent=root,axis){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,20),m);o.position.set(x,y,z);if(axis==='z')o.rotation.x=Math.PI/2;parent.add(o);return o;}
const group=(y=0)=>{const g=new T.Group();g.position.y=y;root.add(g);return g;};
function label(text,x,y,z){const cv=document.createElement('canvas');cv.width=512;cv.height=96;const g=cv.getContext('2d');g.font='600 46px system-ui,sans-serif';g.fillStyle='#4f6a5f';g.textAlign='center';g.fillText(text,256,64);
 const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),transparent:true}));s.scale.set(420,79,1);s.position.set(x,y,z);return s;}

// Por cada ángulo: paso de aire (garganta perpendicular por paso), luz de frente y holgura contra el lateral.
function stats(){const f=phi*deg,ext=LA.A/2*Math.abs(Math.cos(f))+LA.t/2*Math.sin(f);
 return {phi,air:(P*Math.sin(f)-LA.t)/P,front:Math.max(0,P-2*ext),side:P/2-ext,knob:R*Math.cos(f)};}

// --- Riel inferior: base entera + tira patio + dos tiras cocina con la ventana de la perilla. El canal queda entre tiras.
function bottomRail(a,b,win,lift){const base=group(),top=group(lift*.3),len=b-a,cx=(a+b)/2,{z0,z1}=M.canal,hw=M.ventana.L/2;
 box(len-1,C,F.A,board(),cx,C/2,0,base);
 box(len-1,C,z0+ZA,board(),cx,C*1.5,(z0-ZA)/2,top);
 const kz=(z1+ZA)/2,kw=ZA-z1;
 if(win===null)box(len-1,C,kw,board(),cx,C*1.5,kz,top);
 else{box(win-hw-a,C,kw,board(),(a+win-hw)/2,C*1.5,kz,top);box(b-win-hw-1,C,kw,board(),(win+hw+b)/2,C*1.5,kz,top);}}
// --- Barra de RH: sus agujeros siguen a los pasadores de manivela, así que se mueve en x y en z (flota en el canal).
const bars=[],slats=[];
function bar(pc,len,slatXs,stemX,lift){const g=group(lift*.6);g.userData.pc=pc;bars.push(g);const B=M.barra,zc=B.A/2-B.agujero;
 box(len,C,B.A,board(),0,C*1.5,zc,g);
 for(const x of slatXs)cyl(3.4,.6,hole,x-pc,TT+.35,0,g);
 if(stemX!==null){const zs=B.A-B.agujero,zk=ZA+7-R*Math.sin(AN.min*deg);   // la perilla nunca entra detrás del canto del riel
  cyl(M.perilla.vastago/2,zk-zs,steel,stemX,C*1.5,(zs+zk)/2,g,'z');cyl(M.perilla.d/2,12,knobMat,stemX,C*1.5,zk+6,g,'z');}
 return g;}
// --- Tablilla con sus pines (fijo abajo, con resorte arriba, pestaña de 8 mm) y el pasador de manivela.
function slat(x,h,parent,full){const g=new T.Group();g.position.set(x,Y0,0);parent.add(g);slats.push(g);
 box(LA.A,h,LA.t,slatMat,0,h/2,0,g,!ghost);const pt=M.pines.punta/2;
 cyl(4,1,nylon,0,-.5,0,g);cyl(pt,11,nylon,0,-1-5.5,0,g);
 cyl(3.175,26,steel,R,-3,0,g);
 if(full){cyl(4,1,nylon,0,h+.5,0,g);cyl(pt,11,nylon,0,h+1+5.5,0,g);}
 return g;}
function topRail(a,b,lift){const lo=group(lift*1.6),hi=group(lift*2),len=b-a,cx=(a+b)/2;
 box(len-1,C,D.led.z0+ZA,board(),cx,YT+C/2,(D.led.z0-ZA)/2,lo);box(len-1,C,F.A,board(),cx,YT+C*1.5,0,hi);
 if(led){const zc=(D.led.z0+D.led.z1)/2;box(len-20,8,16,alu,cx,YT+4,zc,lo,false);box(len-24,.8,12,glow,cx,YT-.3,zc,lo,false);}}
function stiles(){for(const s of[-1,1])for(const k of[0,1])box(C,YT-TT,F.A,board(),s*(V.L/2-C*(k+.5)),TT+(YT-TT)/2,0);}
function context(){const c=group();
 box(V.L+400,420,260,wall,0,-210,0,c,false);box(V.L+400,160,480,ceil,0,V.H+80,0,c,false);
 for(const s of[-1,1])box(200,V.H,260,wall,s*(V.L/2+100),V.H/2,0,c,false);
 c.add(label('COCINA',0,-60,440),label('PATIO',0,-60,-440));}
const spots=[];function lights(on){for(const s of spots)scene.remove(s,s.target);spots.length=0;hemi.intensity=on?.3:.85;sun.intensity=on?.1:.55;scene.background=new T.Color(on?'#1f2523':'#f6f8f5');glow.emissiveIntensity=on?2.2:0;
 if(!on)return;const zc=(D.led.z0+D.led.z1)/2,k=mode==='all'?6:2,span=mode==='all'?W:F.tramo;for(let i=0;i<k;i++){const x=-span/2+span*(i+.5)/k,s=new T.SpotLight(0xffd9a6,1.1,1900,1.05,.9,1.4);
 s.position.set(x,YT-10,zc);s.target.position.set(x,0,zc);scene.add(s,s.target);spots.push(s);}}
function clear(){root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.isSprite)o.material.map.dispose();});root.clear();bars.length=slats.length=0;}
function build(){clear();slatMat=board();if(ghost){slatMat=slatMat.clone();slatMat.transparent=true;slatMat.opacity=.22;slatMat.depthWrite=false;}
 const lift=exploded?90:0;
 if(mode==='all'||mode==='panel'){const ks=mode==='all'?[0,1,2]:[1];if(mode==='all'){context();stiles();}
  for(const k of ks){const a=segC(k)-F.tramo/2,b=a+F.tramo,pc=panelC(k),mine=xs.slice(k*PER,(k+1)*PER);
   bottomRail(a,b,segC(k),lift);topRail(a,b,lift);bar(pc,M.barra.L,mine,segC(k)-pc,lift);
   const g=group(lift);for(const x of mine)slat(x,SL,g,true);}}
 else{const half=mode==='plan'?210:260,near=xs.slice(PER,2*PER).filter(x=>Math.abs(x)<half-40),h=mode==='plan'?30:240;
  bottomRail(-half,half,0,lift);bar(0,2*half-60,near,0,lift);const g=group(lift);for(const x of near)slat(x,h,g,false);
  if(mode==='plan')root.add(label('COCINA',0,TT,ZA+110),label('PATIO',0,TT,-ZA-90));}
 lights(led&&(mode==='all'||mode==='panel'));setAngle(phi);
 for(const id of['all','panel','detail','plan'])$(id).classList.toggle('active',id===mode);
 $('explode').disabled=mode==='plan';$('explode').textContent=exploded?'Unir piezas':'Separar piezas';
 $('led').setAttribute('aria-pressed',String(led));$('ghost').setAttribute('aria-pressed',String(ghost));$('anim').setAttribute('aria-pressed',String(anim));}
function setAngle(v){phi=Math.min(AN.max,Math.max(AN.min,v));const f=phi*deg;
 for(const s of slats)s.rotation.y=-f;                                     // el ancho de la tablilla apunta a (cos φ, 0, sen φ)
 for(const b of bars)b.position.set(b.userData.pc+R*Math.cos(f),b.position.y,R*Math.sin(f));
 const st=stats(),n=v=>v.toLocaleString('es-CO',{maximumFractionDigits:1});
 $('angle').value=Math.round(phi);$('angle-out').textContent=Math.round(phi)+'°';
 $('s-angle').textContent=Math.round(phi)+'°';$('s-air').textContent=Math.round(st.air*100)+' %';$('s-front').textContent=n(st.front)+' mm';$('s-knob').textContent=(st.knob>0?'+':'')+n(st.knob)+' mm';
 $('caption').textContent={all:'30 tablillas en tres paneles, con marco doble de '+TT+' mm. A '+Math.round(phi)+'° pasa '+Math.round(st.air*100)+' % del aire y de frente se ve '+n(st.front)+' mm entre tablillas.',
  panel:'Un panel: 10 tablillas, una barra y una perilla.'+(exploded?' Separado de abajo arriba: base, tiras (dejan el canal), barra, tablillas con sus pines y las dos capas del riel superior.':''),
  detail:'Riel inferior en dos capas: la barra de RH flota en el canal entre la tira patio y la tira cocina. Cada tablilla gira sobre su pin fijo y su pasador de manivela entra en un agujero de la barra. La perilla sale por la ventana de la tira cocina.',
  plan:'Planta: pin al centro de cada tablilla y manivela a '+R+' mm. La barra se mueve '+n(R*(Math.cos(AN.min*deg)-Math.cos(AN.max*deg)))+' mm a lo largo y '+n(R*(1-Math.sin(AN.min*deg)))+' mm hacia la cocina; la ventana hace de tope a '+AN.min+'° y '+AN.max+'°.'}[mode];}
function view(){camera.up.set(0,1,0);const Q={all:[[-2300,1500,3900],[0,560,0]],panel:[[-1100,1000,1900],[0,650,0]],detail:[[-340,330,560],[0,50,30]],plan:[[0,720,1],[0,0,0]]}[mode];
 camera.position.set(...Q[0]);controls.target.set(...Q[1]);controls.update();}
for(const id of['all','panel','detail','plan'])$(id).onclick=()=>{mode=id;exploded=false;build();view();};
$('explode').onclick=()=>{exploded=!exploded;build();};$('led').onclick=()=>{led=!led;build();};$('ghost').onclick=()=>{ghost=!ghost;build();};
$('anim').onclick=()=>{anim=!anim;$('anim').setAttribute('aria-pressed',String(anim));};
$('angle').min=AN.min;$('angle').max=AN.max;$('angle').oninput=e=>{anim=false;$('anim').setAttribute('aria-pressed','false');setAngle(+e.target.value);};
$('colors').innerHTML=Object.keys(COLORS).map(k=>'<button type="button" data-c="'+k+'" aria-pressed="'+(k===color)+'"><i style="background:'+COLORS[k][0]+'"></i>'+k+'</button>').join('');
$('colors').onclick=e=>{const b=e.target.closest('button');if(!b)return;color=b.dataset.c;for(const x of $('colors').children)x.setAttribute('aria-pressed',String(x===b));build();};
new ResizeObserver(()=>{renderer.setSize(stage.clientWidth,stage.clientHeight);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();}).observe(stage);
build();view();const t0=performance.now();
(function loop(now){requestAnimationFrame(loop);if(anim)setAngle(90-(90-AN.min)*Math.cos((now-t0)/1400));controls.update();renderer.render(scene,camera);})(t0);
window.modelReady=true;window.modelStats=()=>Object.assign(stats(),{slat:SL,pitch:P});})();
