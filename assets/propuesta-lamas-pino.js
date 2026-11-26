/* Marco 40 × 100; rieles de 3000 entre costados completos. Rebaje y fijaciones sujetos a prueba en retal. */
(()=>{'use strict';const T=THREE,D=window.CortasolPinoData,$=id=>document.getElementById(id),stage=$('stage');
const V=D.vano,LA=D.lama,F=D.marco,M=D.mecanismo,AN=D.angulo,B=M.barra,PN=M.pines,PS=M.pasador,part=id=>D.parts.find(p=>p.id===id),SL=part('T01').L;
const TT=F.t,ZA=F.A/2,WB=F.luz,P=WB/LA.por_cuerpo,R=M.manivela,deg=Math.PI/180,CH=M.canal.prof;
const Y0=TT+LA.holgura,YS=Y0+SL,YT=YS+LA.holgura,YB=YS+1,YF=YT+TT;   // punta inferior, punta superior, cara inferior del riel superior, base de la barra, tope del marco
const Z0=M.canal.z0,Z1=M.canal.z1;                                  // bordes del canal de la barra
const centers=[-1,1].map(s=>s*(WB/2+TT/2));                          // centro de cada cuerpo
const posts=[-V.L/2+TT/2,0,V.L/2-TT/2];                              // laterales y montante
const bayXs=c=>Array.from({length:LA.por_cuerpo},(_,i)=>c-WB/2+P*(i+.5));
const xs=centers.flatMap(bayXs);
const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,1,30000),renderer=new T.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));stage.append(renderer.domElement);
const controls=new T.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;
const hemi=new T.HemisphereLight(0xffffff,0x8a9a90,.85),sun=new T.DirectionalLight(0xffffff,.55);sun.position.set(-900,2400,2600);scene.add(hemi,sun);
scene.background=new T.Color('#f6f8f5');const root=new T.Group();scene.add(root);
const FIN={'Pino natural':['#d8b27a','#b48649'],'Pino miel':['#c08a4c','#9a6630'],'Nogal':['#7c5232','#5c3a20'],'Blanco':['#f1f0ea',null],'Gris humo':['#9a9c98',null],'Grafito':['#3b3f42',null]};
let step=4,mode='all',exploded=false,ghost=false,anim=false,fin='Pino natural',phi=AN.inicial;
const edgeMat=new T.LineBasicMaterial({color:0x2c3f38,transparent:true,opacity:.22});
const mat=(c,o={})=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.75},o));
const steel=mat(0x6d7780,{metalness:.6,roughness:.35}),nylon=mat(0xf6f4ec,{roughness:.5}),
 alu=mat(0xc9ccce,{metalness:.35,roughness:.35,emissive:0x3a3d40}),hole=mat(0x262a28),dowel=mat(0xc9a36d);
function grain(a,b,along){const c=document.createElement('canvas');c.width=128;c.height=1024;const g=c.getContext('2d');g.fillStyle=a;g.fillRect(0,0,128,1024);
 let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;g.strokeStyle=b;
 for(let i=0;i<70;i++){g.globalAlpha=.08+r()*.22;g.lineWidth=.6+r()*2.4;const x=r()*128;g.beginPath();g.moveTo(x,0);for(let y=0;y<=1024;y+=64)g.lineTo(x+Math.sin(y/180+i)*3*r(),y);g.stroke();}
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;if(along){t.center.set(.5,.5);t.rotation=Math.PI/2;}return t;}
const finishes={},along={};
for(const [k,[a,b]] of Object.entries(FIN)){finishes[k]=mat(b?0xffffff:a,{roughness:.62,map:b?grain(a,b):null});along[k]=mat(b?0xffffff:a,{roughness:.62,map:b?grain(a,b,true):null});}
const see=m=>{const o=m.clone();o.transparent=true;o.opacity=.2;o.depthWrite=false;return o;};
let slatMat,railMat,railTop,stileMat;
function box(w,h,d,m,x,y,z,parent=root,lines=true){const g=new T.BoxGeometry(w,h,d),o=new T.Mesh(g,m);o.position.set(x,y,z);if(lines)o.add(new T.LineSegments(new T.EdgesGeometry(g),edgeMat));parent.add(o);return o;}
function cyl(r,h,m,x,y,z,parent=root){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,20),m);o.position.set(x,y,z);parent.add(o);return o;}
const group=(y=0,parent=root)=>{const g=new T.Group();g.position.y=y;parent.add(g);return g;};
function label(text,x,y,z,s=1){const cv=document.createElement('canvas');cv.width=640;cv.height=96;const g=cv.getContext('2d');g.font='600 44px system-ui,sans-serif';g.fillStyle='#4f6a5f';g.textAlign='center';g.fillText(text,320,64);
 const sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),transparent:true}));sp.scale.set(520*s,78*s,1);sp.position.set(x,y,z);return sp;}

// Por cada ángulo: paso de aire, luz de frente, holgura con la vecina y corrimiento de la barra.
function stats(){const f=phi*deg,ext=LA.A/2*Math.abs(Math.cos(f))+LA.t/2*Math.sin(f);
 return {phi,air:(P*Math.sin(f)-LA.t)/P,front:Math.max(0,P-2*ext),side:P/2-ext,barX:-R*Math.cos(f),barZ:-R*Math.sin(f)};}

// --- Riel inferior macizo: huecos de las puntas y su ranura de entrada hacia la cocina.
function bottomRail(a,b,slatXs){const g=group();box(b-a,TT,F.A,railMat,(a+b)/2,TT/2,0,g);
 for(const x of slatXs){cyl(PN.punta/2+.4,.6,hole,x,TT+.31,0,g);const L=PN.ranura.L;box(PN.punta,.6,L,hole,x,TT+.31,L/2,g,false);}
 return g;}
// --- Riel superior macizo con el canal ruteado por debajo: se dibuja como las dos franjas que quedan a los lados del canal y el lomo de arriba.
function topRail(a,b,lift){const lo=group(lift*2),hi=group(lift*2),m=railTop,w=b-a,x=(a+b)/2;
 if(Z0+ZA>0)box(w,CH,Z0+ZA,m,x,YT+CH/2,(Z0-ZA)/2,lo,!ghost);box(w,CH,ZA-Z1,m,x,YT+CH/2,(Z1+ZA)/2,lo,!ghost);
 box(w,TT-CH,F.A,m,x,YT+CH+(TT-CH)/2,0,hi,!ghost);
 return lo;}
// --- Tacos de tope dentro del canal, encima de los laterales y del montante.
function topes(list,lift){const g=group(lift*2);for(const x of list)box(M.tope.L,CH,Z1-Z0,railMat,x,YT+CH/2,(Z0+Z1)/2,g);}
// --- Barra de aluminio de un cuerpo: sus agujeros siguen a los pasadores, así que se corre en x y en z sobre las arandelas.
const bars=[],slats=[];
function bar(len,cx,slatXs,lift){const g=group(lift*1.6);g.userData.x0=cx;bars.push(g);
 box(len,B.e,B.A,alu,0,YB+B.e/2,0,g);for(const x of slatXs)cyl(B.agujero/2,.4,hole,x-cx,YB+B.e+.2,0,g);return g;}
// --- Tablilla con sus dos pines y el pasador arriba, hacia el patio.
function slat(x,y0,h,parent,top,bottom){const g=new T.Group();g.position.set(x,0,0);parent.add(g);slats.push(g);
 box(LA.A,h,LA.t,slatMat,0,y0+h/2,0,g,!ghost&&mode!=='plan');
 const pr=PN.pestana/2,tp=PN.punta/2;
 if(bottom){cyl(pr,1.5,nylon,0,Y0-.75,0,g);cyl(tp,6,steel,0,Y0-1.5-3,0,g);}
 if(top){cyl(pr,1.5,nylon,0,YS+.75,0,g);cyl(tp,7,steel,0,YS+1.5+3.5,0,g);
  const out=PS.L-PS.dentro;cyl(PS.d/2,out,steel,-R,YS+out/2,0,g);cyl(5.5,1,nylon,-R,YS+.5,0,g);}
 return g;}
// --- Laterales y montante, entre los rieles.
function uprights(list,h=YT-TT,parent=root){for(const x of list){const side=Math.abs(x)>V.L/2-TT-1&&mode==='all';box(TT,side?YF:h,F.A,stileMat,x,side?YF/2:TT+h/2,0,parent);}}
// --- La obra: antepecho de ladrillo de 10 cm, medianera a la izquierda, cielo raso de panel de yeso sobre viguetas y poste de la puerta en el extremo libre.
const O=D.obra,FL=-O.antepecho.alto,CI=D.cielo,PU=D.puerta;
function brick(w,h){const c=document.createElement('canvas');c.width=256;c.height=128;const g=c.getContext('2d');g.fillStyle='#d9d2c4';g.fillRect(0,0,256,128);
 let s=11;const r=()=>(s=(s*16807)%2147483647)/2147483647;
 for(let row=0;row<2;row++)for(let k=-1;k<2;k++){const x=k*128+(row?64:0)+3,y=row*64+3;g.fillStyle=['#b4553a','#a84d34','#bd6344','#9f4a33'][Math.floor(r()*4)];g.fillRect(x,y,122,58);}
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(w/250,h/130);return mat(0xffffff,{map:t,roughness:.95});}
const floor=mat(0xe6e3dc,{roughness:1});
function ceiling(lift){
 const g=group(lift*3),model=window.crearCieloPanelYeso(T);
 model.root.scale.set(1000,1000,1000);model.root.rotation.y=-Math.PI/2;
 model.root.position.set(-V.L/2+CI.panel.z,-O.antepecho.alto,D.encuentro.plano_cocina);
 model.inspect(ghost);g.add(model.root);
 g.add(label('PANEL DE YESO · OMEGAS Y VIGUETAS',0,V.H+260,ZA+900,.8));
}
function context(){const c=group(),ta=O.antepecho.t,tm=O.medianera.t;
 box(V.L,O.antepecho.alto,ta,brick(V.L,O.antepecho.alto),0,FL/2,0,c,false);
 box(tm,V.H-FL,1400,brick(1400,V.H-FL),-V.L/2-tm/2,(V.H+FL)/2,0,c,false);
 box(V.L+tm+400,4,2600,floor,200-tm/2,FL-2,600,c,false);
 const ph=V.H-FL,pz=D.encuentro.plano_cocina+PU.poste.t/2;box(PU.poste.A,ph,PU.poste.t,stileMat,V.L/2-PU.plano,FL+ph/2,pz,c);      // poste de la puerta, del lado cocina
 for(const y of[250,650,1050])box(100,80,D.encuentro.calce_poste,stileMat,V.L/2-PU.plano,y,ZA+D.encuentro.calce_poste/2,c);
 c.add(label('COCINA',600,FL+80,900),label('PATIO',600,FL+80,-900),label('MEDIANERA',-V.L/2-tm/2,V.H-150,-160,.7),label('POSTE DE LA PUERTA',V.L/2+120,300,ZA+200,.7));
 return c;}
function flaps(a,b,remate){const g=group(),PE=F.pestana,ta=O.antepecho.t;
 for(const sd of[-1,1])box(b-a,PE.h,PE.t,railMat,(a+b)/2,-PE.h/2,sd*(ta/2+PE.t/2),g);
 if(remate&&PE.remate)box(PE.t,PE.h,ta+2*PE.t,stileMat,V.L/2+PE.t/2,-PE.h/2,0,g);
 return g;}
// Solapa accesible: la cara interior deja 15 mm al rebaje abierto hacia patio.
function fascia(lift=0){const g=group(lift*2);for(const sign of[-1,1])box(F.solapa.L,F.solapa.A,F.solapa.t,railMat,sign*F.solapa.L/2,YF-F.solapa.A/2,-ZA-15-F.solapa.t/2,g);return g;}
function axial(r,length,m,pos,axis,parent=root){const o=cyl(r,length,m,...pos,parent);if(axis==='x')o.rotation.z=-Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;return o;}
function cornerHardware(x,y,sign,spread=0,parent=root){
 // Tarugos longitudinales: 30 mm embebidos en cada pieza. Tornillos altos evitan el rebaje de 18.
 for(const z of[10,35])axial(4,60,dowel,[x+sign*spread/2,y+20,z],'x',parent);
 for(const z of[-25,25]){axial(2.5,90,steel,[x+sign*(40-45+spread),y+30,z],'x',parent);axial(5,3,steel,[x+sign*(40+spread),y+30,z],'x',parent);}
}
function centerHardware(y,sign,spread=0,parent=root){
 for(const z of[10,35])axial(4,60,dowel,[0,y+sign*spread/2,z],'y',parent);
 for(const x of[-10,10]){axial(2.5,90,steel,[x,y+sign*(40-45+spread),22.5],'y',parent);axial(5,3,steel,[x,y+sign*(40+spread),22.5],'y',parent);}
}
function assembly(lift){
 const spread=exploded?140:0,rg=group();
 const lo=bottomRail(-V.L/2+TT,V.L/2-TT,[]);
 if(step>=1){for(const sign of[-1,1]){const x=sign*(V.L/2-TT/2);box(TT,YF,F.A,stileMat,x+sign*spread,YF/2,0,rg);cornerHardware(sign*(V.L/2-TT),0,sign,spread,rg);}}
 if(step>=2){box(TT,YT-TT,F.A,stileMat,0,TT+(YT-TT)/2+spread,0,rg);centerHardware(TT,-1,spread,rg);}
 if(step>=3){topRail(-V.L/2+TT,V.L/2-TT,spread/2);for(const sign of[-1,1])cornerHardware(sign*(V.L/2-TT),YT,sign,spread,rg);centerHardware(YT,1,spread,rg);}
 if(step>=4){const g=group();for(const x of xs)slat(x,Y0,SL,g,true,true);centers.forEach(c=>bar(B.L,c,bayXs(c),0));}
 root.add(label('3000 horizontal + 40 + 40 = 3080 exterior',0,-100,80,1.5),label('COSTADOS COMPLETOS · 1256',-V.L/2-170,YF/2,0,.8),label('Ø8 × 60 · tarugos',V.L/2+50,180,-230,.7));
}
const plugMat=mat(0x8a6236,{roughness:.7});
function anchors(){const g=group(),A=M.anclajes,r=5,per=A.antepecho.n/2;
 for(const c of centers)for(let k=0;k<per;k++){const i=Math.round((LA.por_cuerpo/per)*(k+.5));cyl(r,.8,plugMat,c-WB/2+P*i,TT+.4,0,g);}
 for(let k=0;k<A.medianera.n;k++){const o=new T.Mesh(new T.CylinderGeometry(r,r,.8,20),plugMat);o.rotation.z=Math.PI/2;o.position.set(-V.L/2+TT+.4,TT+(YT-TT)*(k+.5)/A.medianera.n,0);g.add(o);}}
function clear(){root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.isSprite)o.material.map.dispose();});root.clear();bars.length=slats.length=0;}
function build(){clear();slatMat=stileMat=finishes[fin];railMat=along[fin];
 if(ghost&&mode==='all')slatMat=see(slatMat);
 railTop=(mode==='top'||ghost)?see(railMat):railMat;
 const lift=exploded?90:0,half=330;
 if(mode==='all'){context();ceiling(lift);uprights(posts);bottomRail(-V.L/2+TT,V.L/2-TT,xs);flaps(-V.L/2,V.L/2,true);topRail(-V.L/2+TT,V.L/2-TT,lift);topes([0],lift);anchors();fascia(lift);
  centers.forEach(c=>bar(B.L,c,bayXs(c),lift));const g=group(lift);for(const x of xs)slat(x,Y0,SL,g,true,true);}
 else if(mode==='assembly'){assembly(lift);}
 else if(mode==='top'){const near=xs.filter(x=>Math.abs(x)<half-50),h=200;   // alrededor del montante: las dos barras y el taco que comparten
  topRail(-half,half,lift);topes([0],lift);box(TT,h,F.A,stileMat,0,YT-h/2,0);const g=group(lift);for(const x of near)slat(x,YS-h,h,g,true,false);
  for(const c of centers){const bx=bayXs(c).filter(x=>Math.abs(x)<half-50),cx=c>0?Math.min(...bx)-P/2+(half-40)/2:Math.max(...bx)+P/2-(half-40)/2;bar(half-40-TT/2,cx,bx,lift);}
  root.add(label('COCINA',0,YT+60,ZA+120,.6),label('PATIO',0,YT+60,-ZA-120,.6),label('MONTANTE',0,YT-260,ZA+40,.6));}
 else if(mode==='bottom'){const near=xs.filter(x=>Math.abs(x)<half-50),h=200;
  bottomRail(-half,half,near);flaps(-half,half,false);box(2*half,220,O.antepecho.t,brick(2*half,220),0,-110,0,root,false);uprights([0],h+40);
  const g=group(lift);for(const x of near)slat(x,Y0,h,g,false,true);
  root.add(label('COCINA',0,-40,ZA+120,.6),label('PATIO',0,-40,-ZA-120,.6));}
 else if(mode==='corner'){const a=V.L/2-380,b=V.L/2,h=320,ex=exploded?100:0;
  bottomRail(a,b-TT,[]);flaps(a,b,true);box(b-a,220,O.antepecho.t,brick(b-a,220),(a+b)/2,-110,0,root,false);
  box(TT,h,F.A,stileMat,b-TT/2+ex,h/2,0);cornerHardware(b-TT,0,1,ex);
  root.add(label('RIEL ENTRE COSTADOS',a+130,130,130,.8),label('COSTADO COMPLETO',b+100,350,0,.8),label('TORNILLOS DESDE EL CANTO',b+240,60,80,.7));}

 else{const near=xs.filter(x=>Math.abs(x)<half-40),h=30;
  const g=group();for(const x of near)slat(x,YS-h,h,g,true,false);
  for(const c of centers){const bx=bayXs(c).filter(x=>Math.abs(x)<half-40),cx=c>0?Math.min(...bx)-P/2+(half-20)/2:Math.max(...bx)+P/2-(half-20)/2;bar(half-20-TT/2,cx,bx,0);}
  box(TT,.5,F.A,railMat,0,YS-20,0,root,false);
  for(const z of[Z0,Z1])box(2*half,.5,1.2,hole,0,YS+8,z,root,false);
  root.add(label('COCINA',0,YS,ZA+110,.7),label('PATIO',0,YS,-ZA-90,.7));}
 setAngle(phi);
 for(const id of['all','assembly','top','bottom','corner','plan'])$(id).classList.toggle('active',id===mode);
 $('explode').disabled=mode==='bottom'||mode==='plan';$('explode').textContent=exploded?'Unir piezas':'Separar piezas';
 $('assembly-controls').hidden=mode!=='assembly';$('step-out').textContent=['1 · Riel inferior','2 · Costados completos','3 · Montante central','4 · Cerrar el marco','5 · Montar tablillas'][step];
 $('ghost').setAttribute('aria-pressed',String(ghost));$('anim').setAttribute('aria-pressed',String(anim));}
function setAngle(v){phi=Math.min(AN.max,Math.max(AN.min,v));const f=phi*deg,st=stats();
 for(const s of slats)s.rotation.y=-f;
 for(const b of bars)b.position.set(b.userData.x0+st.barX,b.position.y,st.barZ);
 const n=v=>v.toLocaleString('es-CO',{maximumFractionDigits:1});
 $('angle').value=Math.round(phi);$('angle-out').textContent=Math.round(phi)+'°';
 $('s-angle').textContent=Math.round(phi)+'°';$('s-air').textContent=Math.round(st.air*100)+' %';$('s-front').textContent=n(st.front)+' mm';$('s-bar').textContent=(st.barX>0?'+':'')+n(st.barX)+' mm';
 $('caption').textContent={all:'Dos cuerpos de '+LA.por_cuerpo+' tablillas en un marco de pino macizo de '+TT+' × '+F.A+': rieles enteros de '+(V.L-2*TT)+' mm y montante central. Encima se muestra la perfilería metálica y la placa de yeso blanco; su dimensionamiento se valida en obra; a la derecha, el poste de la puerta. A '+Math.round(phi)+'° pasa '+Math.round(st.air*100)+' % del aire y de frente se ve '+n(st.front)+' mm entre tablillas. Cada cuerpo se gira por separado: al mover una o dos tablillas se mueven las '+LA.por_cuerpo+' de ese lado.'+(exploded?' Separado: tablillas, barras, riel superior y cielo raso.':''),
  top:'Mecanismo junto al montante (riel transparente): rebaje abierto al patio de '+(Z1-Z0)+' × '+CH+' propuesto por debajo del riel. Cada cuerpo tiene su platina de 1430 mm; ajustar los topes físicos en la prueba para el recorrido representado de '+AN.min+'° y '+AN.max+'°. Los pasadores van a '+R+' mm del eje, hacia el patio, sobre arandelas de nylon.'+(exploded?' Separado: tablillas, barras y riel.':''),
  bottom:'Abajo, junto al montante: el riel macizo apoya en el ladrillo y sus pestañas de '+F.pestana.h+' mm bajan por las dos caras del muro. Cada tablilla se apoya en la pestaña de su pin; la punta entra en su hueco por una ranura de entrada de '+PN.ranura.L+' × '+PN.ranura.prof+' mm.',
  corner:'El costado es completo: el riel de 3000 llega a su cara interior. Dos tarugos Ø8 × 60 traban la unión con pegante y dos tornillos inox 5 × 90 entran desde el canto exterior del costado. Las caras cocina y patio quedan libres de cabezas. Taladros de referencia: presentar plantilla y evitar el rebaje superior. Tapones sobre las cabezas si quedan expuestas.'+(exploded?' Separado para ver la dirección de entrada.':''),
  assembly:'Armado en banco. '+['Presentar el riel inferior continuo de 3000 × 100 × 40.','Añadir costados completos de 1256: tarugos encolados y tornillos desde sus cantos exteriores.','Añadir montante de 1176: tornillos desde abajo del riel, antes de instalar.','Colocar el riel superior: tornillos desde arriba hacia el montante y desde los cantos de los costados hacia el riel.','Después de curar y fijar el marco, montar pines, tablillas y barras; probar antes de poner la solapa desmontable.'][step]+(exploded?' La separación es ilustrativa; los largos del despiece no cambian.':''),
  plan:'Planta por encima de las tablillas, junto al montante: cada barra se corre '+n(R*(Math.cos(AN.min*deg)-Math.cos(AN.max*deg)))+' mm a lo largo y '+n(R*(1-Math.sin(AN.min*deg)))+' mm hacia el patio dentro del canal (líneas oscuras). Holgura de la tablilla del extremo con el montante o el lateral: '+n(st.side)+' mm.'}[mode];}
function view(){camera.up.set(0,1,0);const Q={all:[[3000,700,4600],[0,300,300]],assembly:[[2500,2000,4300],[0,650,0]],top:[[-480,YT-360,-660],[0,YT-40,-20]],bottom:[[-480,230,660],[0,-10,0]],corner:[[V.L/2+560,420,760],[V.L/2-110,90,0]],plan:[[0,YS+800,1],[0,YS,0]]}[mode];
 camera.position.set(...Q[0]);controls.target.set(...Q[1]);controls.update();}
for(const id of['all','assembly','top','bottom','corner','plan'])$(id).onclick=()=>{mode=id;exploded=false;build();view();};
$('step').oninput=e=>{step=+e.target.value;build();};
for(const [id,scale] of [['zoom-in',.8],['zoom-out',1.25]])$(id).onclick=()=>{camera.position.sub(controls.target).multiplyScalar(scale).add(controls.target);controls.update();};
$('reset-view').onclick=view;
$('explode').onclick=()=>{exploded=!exploded;build();};$('ghost').onclick=()=>{ghost=!ghost;build();};
$('anim').onclick=()=>{anim=!anim;$('anim').setAttribute('aria-pressed',String(anim));};
$('angle').min=AN.min;$('angle').max=AN.max;$('angle').oninput=e=>{anim=false;$('anim').setAttribute('aria-pressed','false');setAngle(+e.target.value);};
const picker=(id,list,get,set)=>{const lbl=$(id).querySelector('small');$(id).innerHTML=(lbl?lbl.outerHTML:'')+Object.keys(list).map(k=>'<button type="button" data-c="'+k+'" aria-pressed="'+(k===get())+'"><i style="background:'+(Array.isArray(list[k])?list[k][0]:list[k])+'"></i>'+k+'</button>').join('');
 $(id).onclick=e=>{const b=e.target.closest('button');if(!b)return;set(b.dataset.c);for(const x of $(id).children)if(x.tagName==='BUTTON')x.setAttribute('aria-pressed',String(x===b));build();};};
picker('colors',FIN,()=>fin,v=>fin=v);
new ResizeObserver(()=>{renderer.setSize(stage.clientWidth,stage.clientHeight);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();}).observe(stage);
build();view();const t0=performance.now();
(function loop(now){requestAnimationFrame(loop);if(anim)setAngle(90-(90-AN.min)*Math.cos((now-t0)/1400));controls.update();renderer.render(scene,camera);})(t0);
window.modelReady=true;window.modelStats=()=>Object.assign(stats(),{slat:SL,slatThickness:LA.t,frameDepth:F.A,railLength:V.L-2*TT,sideHeight:YF,pitch:P,bar:B.L,bays:centers.length,mode,step,exploded});})();
