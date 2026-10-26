/* Cocina en dos versiones (actual 260 y alternativa 280): geometría extraída de sus visores detallados, en milímetros. */
window.EspaciosModels=window.EspaciosModels||{};
window.EspaciosModels.kitchen=function(THREE,variant){
variant=variant==='280'?'280':'actual';
const scene=new THREE.Group(); let kitchenInfo={},drawerAssembly=[];
const MODS=variant==='280'?{"B6": {"n": "Costado 1,5", "d": "Panel de 882 × 595, elevado 3 mm. Extremo libre x=115; mesón empieza en x=100.", "x": [115, 130], "h": [3, 885]}, "B1": {"n": "Basurero 30", "d": "Basurero HSO460-30 con frente extraíble de 732 mm.", "x": [130, 430], "h": [100, 885]}, "B2": {"n": "Horno y estufa 60", "d": "Horno H60EEVAL005 y estufa CCR60-F4P-SBF031. Campana centrada; nicho y ventilación por validar con manuales.", "x": [430, 1030], "h": [100, 885]}, "B3": {"n": "Cajonero 47,5", "d": "Tres cajones con cajas de 418 mm exteriores y 550 de fondo; frentes 167, 207 y 302.", "x": [1030, 1505], "h": [100, 885]}, "B4": {"n": "Cajonero 47,5", "d": "Tres cajones; cubiertero de 360 × 480 en caja interior de 388 × 520.", "x": [1505, 1980], "h": [100, 885]}, "B5": {"n": "Lavaplatos 90", "d": "Sin relleno. Extremo x=2880: quedan 120 mm hasta el muro, y el mesón vuela 20 mm a la derecha.", "x": [1980, 2880], "h": [100, 885]}, "S1": {"n": "Alacena 32", "d": "Ancho de 320 mm del Excel, con entrepaño de 288. Comienza 5 mm antes del costado bajo para centrar S2 sobre B2.", "x": [110, 430], "h": [1450, 2150]}, "S2": {"n": "Gabinete ducto 60", "d": "Caja de 350 mm de alto. Campana a 1550 mm en esta vista: posición ilustrativa, validar manual antes de instalar.", "x": [430, 1030], "h": [1800, 2150]}, "S3": {"n": "Alacena 95", "d": "División vertical central y dos entrepaños de 450 mm, según Excel.", "x": [1030, 1980], "h": [1450, 2150]}, "S4": {"n": "Platero 91,5", "d": "Luz interior 885 mm. Sin relleno: extremo x=2895, con 105 mm hasta la esquina. Validar herraje HSO566-05N.", "x": [1980, 2895], "h": [1450, 2150]}}:{"B6": {"n": "Costado 1,5", "d": "Panel 882 × 595 a 3 mm del piso. x=215–230; mesón x=200–2800.", "x": [215, 230], "h": [3, 885]}, "B1": {"n": "Basurero 30", "d": "Basurero HSO460-30 con frente extraíble de 732 mm.", "x": [230, 530], "h": [100, 885]}, "B2": {"n": "Horno y estufa 60", "d": "Horno H60EEVAL005 y estufa CCR60-F4P-SBF031. Campana centrada; nicho y ventilación por validar con manuales.", "x": [530, 1130], "h": [100, 885]}, "B3": {"n": "Cajonero único 75", "d": "Tres cajones: exterior 693 × 550, interior 663 × 520. Bases aplicadas inferiores 693 × 550 × 15; paredes de 205/125/75, envolventes 220/140/90 conservadas. Cubiertero 360 × 480 a la izquierda del superior. Confirmar unión por cara inferior, rieles y carga con fabricante.", "x": [1130, 1880], "h": [100, 885]}, "B5": {"n": "Lavaplatos 90", "d": "Módulo 900. Socoda AS350 submontar: exterior 550 × 430, abertura ilustrativa 490 × 370 y profundidad 165. Pestaña bajo placa; corte definitivo por plantilla Socoda. Travesaños 870 × 100 de canto, fuera de pestaña. Validar soporte mecánico, listones, sifón y canasta.", "x": [1880, 2780], "h": [100, 885]}, "S1": {"n": "Alacena 31,5", "d": "Ancho 315 mm, entrepaño 283 y puerta 312 × 717. Alineada con B6 en x=215; S2 permanece centrado con B2.", "x": [215, 530], "h": [1450, 2150]}, "S2": {"n": "Gabinete ducto 60", "d": "Caja de 350 mm de alto. Campana a 1550 mm en esta vista: posición ilustrativa, validar manual antes de instalar.", "x": [530, 1130], "h": [1800, 2150]}, "S3": {"n": "Alacena 84,5", "d": "División central y dos entrepaños de 397,5 mm; puertas 419,5 × 717.", "x": [1130, 1975], "h": [1450, 2150]}, "S4": {"n": "Platero 71,5", "d": "Caja 715, luz 685. HSO566-03G de 680 × 245; holgura total 5 mm. Máximo 7 kg; acero 201 pintado. Cuatro fijaciones Ø10 por pines, a marcar en obra con pieza real; profundidad y cotas por verificar, sin taladros de fábrica.", "x": [1975, 2690], "h": [1450, 2150]}};
/* ---------- Texturas procedurales ---------- */
function canvasTex(w,h,draw,rx=1,ry=1){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=4;return t;}
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
const woodV=canvasTex(256,512,(g,w,h)=>{g.fillStyle='#b48a62';g.fillRect(0,0,w,h);
  for(let i=0;i<140;i++){const x=rnd()*w,a=0.04+rnd()*0.12;g.strokeStyle=rnd()>.5?`rgba(90,58,30,${a})`:`rgba(230,200,160,${a})`;
   g.lineWidth=0.5+rnd()*2;g.beginPath();g.moveTo(x,0);for(let y=0;y<=h;y+=32)g.lineTo(x+Math.sin(y*0.02+i)*3,y);g.stroke();}});
const stoneT=canvasTex(256,256,(g,w,h)=>{g.fillStyle='#e8dcc4';g.fillRect(0,0,w,h);
  for(let i=0;i<1600;i++){const v=rnd();g.fillStyle=v>.7?'rgba(150,120,90,.35)':v>.4?'rgba(255,250,240,.5)':'rgba(190,170,140,.35)';g.fillRect(rnd()*w,rnd()*h,1+rnd()*2,1+rnd()*2);}},4,1);
const brickT=canvasTex(512,342,(g)=>{g.fillStyle='#cbbfad';g.fillRect(0,0,512,342);const bw=256,bh=171,j=7;
  for(let r=0;r<2;r++){const off=r%2?bw/2:0;for(let k=-1;k<3;k++){const v=(rnd()-.5)*30;g.fillStyle=`rgb(${178+v|0},${86+v*.6|0},${52+v*.4|0})`;g.fillRect(k*bw+off+j/2,r*bh+j/2,bw-j,bh-j);}}});

const PAL={
 wood:{map:woodV}, carc:{color:0xb08a64}, back:{color:0xf2f1ec}, gola:{color:0x7c8084,metalness:.6,roughness:.4},
 stone:{map:stoneT,roughness:.35}, inox:{color:0xbfc2c5,metalness:.75,roughness:.3}, black:{color:0x141416,roughness:.15,metalness:.2},
 glass:{color:0x26303a,roughness:.1,metalness:.3}, zoc:{color:0x6b5a48}, dark:{color:0x4a4d50,roughness:.6}, plate:{color:0xf6f6f2,roughness:.3},
};
function mat(k){return new THREE.MeshStandardMaterial(Object.assign({roughness:.7,metalness:0},PAL[k]));}

/* ---------- Constructores ---------- */
const S=0.001,all=[],byMod={},groups={fronts:[],uppers:new THREE.Group(),counter:new THREE.Group(),equip:new THREE.Group(),walls:new THREE.Group(),labels:new THREE.Group()};
scene.add(groups.uppers,groups.counter,groups.equip,groups.walls,groups.labels);
function box(x0,x1,d0,d1,h0,h1,k,mod,parent,role){
  const m=new THREE.Mesh(new THREE.BoxGeometry((x1-x0)*S,(h1-h0)*S,(d1-d0)*S),mat(k));
  m.position.set((x0+x1)/2*S,(h0+h1)/2*S,(d0+d1)/2*S);m.castShadow=m.receiveShadow=true;
  m.userData={mod,base:m.material.color.getHex()};(parent||scene).add(m);all.push(m);
  if(mod){(byMod[mod]=byMod[mod]||[]).push(m);}
  if(role==='front')groups.fronts.push(m);
  return m;
}
const movers=[];
function drawer(mod,x0,x1,f0,f1,b0,bh,open,parent){
  [x0,x1]=MODS[mod].x;
  const g=new THREE.Group();(parent||scene).add(g);
  box(x0+1.5,x1-1.5,586,601,f0,f1,'wood',mod,g,'front');
  const i0=x0+15+13.5,i1=x1-15-13.5,dz0=36,dz1=586;
  const applied=variant==='actual'&&mod==='B3',wallBottom=b0+(applied?15:0);
  // B3: base de 693 × 550 bajo paredes; altura exterior conservada.
  box(applied?i0:i0+15,applied?i1:i1-15,applied?dz0:dz0+15,applied?dz1:dz1-15,b0,b0+15,'carc',mod,g);
  box(i0,i0+15,dz0,dz1,wallBottom,b0+bh,'carc',mod,g);
  box(i1-15,i1,dz0,dz1,wallBottom,b0+bh,'carc',mod,g);
  box(i0+15,i1-15,dz0,dz0+15,wallBottom,b0+bh,'carc',mod,g);
  box(i0+15,i1-15,dz1-15,dz1,wallBottom,b0+bh,'carc',mod,g);
  if(applied){drawerAssembly=drawerAssembly||[];drawerAssembly.push({base:[i1-i0,dz1-dz0,15],baseY:[b0,b0+15],wallY:[wallBottom,b0+bh],sideHeight:bh-15,inside:[i1-i0-30,dz1-dz0-30]});}
  movers.push({g,type:'slide',dist:open});return g;
}
function door(mod,x0,x1,d0,h0,h1,hinge,parent,role){
  const g=new THREE.Group();const px=(hinge==='left'?x0:x1)*S;g.position.set(px,0,(d0+15)*S);(parent||scene).add(g);
  const m=box(x0+1.5,x1-1.5,d0,d0+15,h0,h1,'wood',mod,g,role||'front');m.position.x-=px;m.position.z-=(d0+15)*S;
  movers.push({g,type:'hinge',sign:hinge==='left'?-1:1});return g;
}
function carcass(mod,x0,x1,{fondo=true,trav=true,piso=true}={}){
  [x0,x1]=MODS[mod].x;
  box(x0,x0+15,6,586,100,885,'carc',mod);box(x1-15,x1,6,586,100,885,'carc',mod);
  if(piso)box(x0+15,x1-15,6,586,100,115,'carc',mod);
  if(trav){box(x0+15,x1-15,486,586,870,885,'carc',mod);box(x0+15,x1-15,6,106,870,885,'carc',mod);}
  if(fondo)box(x0+2,x1-2,0,6,102,883,'back',mod);
}

if(variant==='280'){
/* ---------- Bajos ---------- */
kitchenInfo={modules:MODS,counter:[100,2900],wall:3000};
const FT=832;
// Sin B0: la holgura libre hasta la esquina sustituye el relleno.
carcass('B1',30,330);
const bin=drawer('B1',30,330,100,FT,125,0,400);bin.children.slice(1).forEach(m=>{m.visible=false;});
box(170,390,120,540,130,480,'dark','B1',bin);
carcass('B2',330,930,{fondo:false});
for(const [mod,x0,x1] of [['B3',1030,1505],['B4',1505,1980]]){
  carcass(mod,x0,x1);
  drawer(mod,x0,x1,100,402,125,220,450);
  drawer(mod,x0,x1,430,637,440,140,420);
  const top=drawer(mod,x0,x1,665,FT,675,90,400);
  if(mod==='B4')box(x0+50,x1-50,70,550,690,740,'dark','B4',top);
}
carcass('B5',1880,2780);
door('B5',1980,2430,586,100,FT,'left');door('B5',2430,2880,586,100,FT,'right');
box(2015,2845,80,520,130,280,'inox','B5');
box(115,130,6,601,3,885,'carc','B6',null,'front');
box(130,1505,521,536,3,100,'zoc',null);box(1505,2880,521,536,3,100,'zoc',null);
box(130,430,556,586,810,885,'gola',null);box(1030,2880,556,586,810,885,'gola',null);
for(const z of [380,615])box(1030,1980,556,586,z,z+75,'gola',null);
box(431.5,1028.5,586,601,740,885,'wood','B2',null,'front');

/* ---------- Mesón con hueco del lavaplatos ---------- */
const C=groups.counter;
box(100,2155,0,620,885,900,'stone',null,C);box(2705,2900,0,620,885,900,'stone',null,C);
box(2155,2705,0,95,885,900,'stone',null,C);box(2155,2705,525,620,885,900,'stone',null,C);

/* ---------- Equipos ---------- */
const E=groups.equip;
box(433,1027,46,586,115,735,'inox','B2',E);
box(490,970,586,603,265,635,'glass','B2',E);
box(510,950,603,625,660,680,'inox','B2',E);
box(430,1030,55,565,900,906,'black','B2',E);
for(const [bx,bz,r] of [[480,180,45],[780,180,35],[480,440,35],[780,440,50]]){
  const c=new THREE.Mesh(new THREE.CylinderGeometry(r*S,r*S,0.012,24),mat('dark'));c.position.set((bx+100)*S,0.912,bz*S);E.add(c);}
box(2155,2705,95,99,720,885,'inox','B5',E);box(2155,2705,521,525,720,885,'inox','B5',E);
box(2155,2159,95,525,720,885,'inox','B5',E);box(2701,2705,95,525,720,885,'inox','B5',E);
box(2155,2705,95,525,716,720,'inox','B5',E);
const fau=new THREE.Mesh(new THREE.CylinderGeometry(0.014,0.016,0.32,16),mat('inox'));fau.position.set(2.43,1.06,0.05);E.add(fau);
const spout=new THREE.Mesh(new THREE.CylinderGeometry(0.011,0.011,0.2,16),mat('inox'));spout.rotation.x=Math.PI/2;spout.position.set(2.43,1.21,0.14);E.add(spout);
box(430,1030,0,480,1550,1700,'black','S2',E);

/* ---------- Superiores ---------- */
const U=groups.uppers;
function upper(mod,x0,x1,{piso=true,div=null,shelves=[]}={}){
  box(x0,x0+15,6,326,1450,2150,'carc',mod,U);box(x1-15,x1,6,326,1450,2150,'carc',mod,U);
  box(x0+15,x1-15,6,326,2135,2150,'carc',mod,U);
  if(piso)box(x0+15,x1-15,6,326,1450,1465,'carc',mod,U);
  else{box(x0+15,x1-15,266,326,1450,1465,'carc',mod,U);box(x0+15,x1-15,6,86,1450,1465,'carc',mod,U);}
  box(x0+2,x1-2,0,6,1452,2148,'back',mod,U);
  if(div!=null)box(div-7.5,div+7.5,6,326,1465,2135,'carc',mod,U);
  for(const [a,b] of shelves)box(a,b,26,326,1792,1807,'carc',mod,U);
}
upper('S1',110,430,{shelves:[[126,414]]});door('S1',110,430,326,1430,2147,'left',U);
box(430,445,6,326,1800,2150,'carc','S2',U);box(1015,1030,6,326,1800,2150,'carc','S2',U);
box(445,1015,6,326,1800,1815,'carc','S2',U);box(445,1015,6,326,2135,2150,'carc','S2',U);box(432,1028,0,6,1802,2148,'back','S2',U);
door('S2',430,1030,326,1800,2147,'left',U);
upper('S3',1030,1980,{div:1505,shelves:[[1046,1496],[1513.5,1963.5]]});
door('S3',1030,1505,326,1430,2147,'left',U);door('S3',1505,1980,326,1430,2147,'right',U);
upper('S4',1980,2895,{piso:false});
box(1997.5,2877.5,40,285,1700,1712,'inox','S4',U);
for(let i=0;i<8;i++){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.115,0.115,0.012,32),mat('plate'));p.rotation.z=Math.PI/2;p.position.set((2070+i*28)*S,1.83,0.17);U.add(p);}
box(1997.5,2877.5,40,285,1480,1495,'dark','S4',U);
door('S4',1980,2437,326,1430,2147,'left',U);door('S4',2438,2895,326,1430,2147,'right',U);
// Sin S0: 105 mm libres entre el platero y la esquina.
}else{
/* ---------- Bajos ---------- */
const FT=832;
kitchenInfo={modules:MODS,counter:[200,2800],wall:3000,knownBudget:6980596,slabThickness:15,slabThicknessConfirmed:true,decorativeEdgeSelected:false,railBase:{family:"HRE550",sku:"HRE550-55N",brand:"Bonuit",color:"Negro",length:550,function:"cierre lento",declaredLoad:30,exactVariantConfirmed:true,mountingConfirmed:false,lateralDeduction:27,lateralDeductionConfirmed:true,railHeight:45,railWidth:12.7,sideGap:13.5,includedScrews:[4,12],unitPrice:47034,quantity:3}};
carcass('B1',230,530);
const bin=drawer('B1',230,530,100,FT,125,0,400);bin.children.slice(1).forEach(m=>{m.visible=false;});
box(270,490,120,540,130,480,'dark','B1',bin);
carcass('B2',530,1130,{fondo:false});
// Un único gabinete sin costados centrales; tres cajones completos.
{
 const mod='B3',[x0,x1]=MODS[mod].x;carcass(mod,x0,x1);
 drawer(mod,x0,x1,100,402,125,220,450);
 drawer(mod,x0,x1,430,637,440,140,420);
 const top=drawer(mod,x0,x1,665,FT,675,90,400);
 // Cubiertero plástico de 360 × 480 × 50; detalle interior ilustrativo.
 const tx=1176,tz=70;
 box(tx,tx+360,tz,tz+480,690,693,'dark',mod,top);
 box(tx,tx+3,tz,tz+480,693,740,'dark',mod,top);
 box(tx+357,tx+360,tz,tz+480,693,740,'dark',mod,top);
 box(tx,tx+360,tz,tz+3,693,740,'dark',mod,top);
 box(tx,tx+360,tz+477,tz+480,693,740,'dark',mod,top);
 box(tx+178.5,tx+181.5,tz+3,tz+477,693,735,'dark',mod,top);
 for(const z of [tz+160,tz+320])box(tx+3,tx+178.5,z,z+3,693,735,'dark',mod,top);
 box(tx+181.5,tx+357,tz+240,tz+243,693,735,'dark',mod,top);
 kitchenInfo.drawer={moduleWidth:750,outerWidth:693,inner:[663,520],frontWidth:747,count:3,railPairs:3,tray:[360,480,50],traySide:'left',fixedDivider:false,base:[693,550,15],baseMount:'underside',sideHeights:[205,125,75],outerHeights:[220,140,90]};
}
carcass('B5',1880,2780,{trav:false});
// B5, partida 48: dos travesaños 870 × 100 colocados de canto.
// 15 mm en profundidad, coronación a 885; fuera del contorno exterior del lavaplatos.
box(1895,2765,6,21,785,885,'carc','B5');
box(1895,2765,571,586,785,885,'carc','B5');
// Los dos listones de apoyo de 870 × 80 del despiece conservan corte;
// su posición y anclaje no se fijan aquí hasta aprobar el submontaje real.
door('B5',1880,2330,586,100,FT,'left');door('B5',2330,2780,586,100,FT,'right');
box(1915,2745,80,520,130,280,'inox','B5');
box(215,230,6,601,3,885,'carc','B6',null,'front');
box(230,1505,521,536,3,100,'zoc',null);box(1505,2780,521,536,3,100,'zoc',null);
box(230,530,556,586,810,885,'gola',null);box(1130,2780,556,586,810,885,'gola',null);
for(const z of [380,615])box(1130,1880,556,586,z,z+75,'gola',null);
box(531.5,1128.5,586,601,740,885,'wood','B2',null,'front');

/* ---------- Mesón con hueco ilustrativo del lavaplatos ---------- */
const C=groups.counter;
// Abertura 490 × 370 centrada en x=2330, z=310; contorno simplificado.
// La plantilla Socoda, el borde elegido y el marmolero definen el recorte real.
box(200,2085,0,620,885,900,'stone',null,C);box(2575,2800,0,620,885,900,'stone',null,C);
box(2085,2575,0,125,885,900,'stone',null,C);box(2085,2575,495,620,885,900,'stone',null,C);
kitchenInfo.sink={outer:[550,430],illustrativeOpening:[490,370],depth:165,center:[2330,310],openingBounds:[2085,2575,125,495],flangeBounds:[2055,2605,95,525],flangeTop:885,bowlFloor:720,templateRequired:true};

/* ---------- Equipos ---------- */
const E=groups.equip;
box(533,1127,46,586,115,735,'inox','B2',E);
box(590,1070,586,603,265,635,'glass','B2',E);
box(610,1050,603,625,660,680,'inox','B2',E);
box(530,1130,55,565,900,906,'black','B2',E);
for(const [bx,bz,r] of [[480,180,45],[780,180,35],[480,440,35],[780,440,50]]){
  const c=new THREE.Mesh(new THREE.CylinderGeometry(r*S,r*S,0.012,24),mat('dark'));c.position.set((bx+200)*S,0.912,bz*S);E.add(c);}
// Cubeta: interior 490 × 370; pared de 4 mm solo ilustrativa.
box(2081,2085,121,499,720,883,'inox','B5',E);
box(2575,2579,121,499,720,883,'inox','B5',E);
box(2085,2575,121,125,720,883,'inox','B5',E);
box(2085,2575,495,499,720,883,'inox','B5',E);
box(2081,2579,121,499,716,720,'inox','B5',E);
// Pestaña exterior 550 × 430 bajo el mesón (espesor visual de 2 mm).
box(2055,2085,95,525,883,885,'inox','B5',E);
box(2575,2605,95,525,883,885,'inox','B5',E);
box(2085,2575,95,125,883,885,'inox','B5',E);
box(2085,2575,495,525,883,885,'inox','B5',E);
const fau=new THREE.Mesh(new THREE.CylinderGeometry(0.014,0.016,0.32,16),mat('inox'));fau.position.set(2.33,1.06,0.05);E.add(fau);
const spout=new THREE.Mesh(new THREE.CylinderGeometry(0.011,0.011,0.2,16),mat('inox'));spout.rotation.x=Math.PI/2;spout.position.set(2.33,1.21,0.14);E.add(spout);
box(530,1130,0,480,1550,1700,'black','S2',E);

/* ---------- Superiores ---------- */
const U=groups.uppers;
function upper(mod,x0,x1,{piso=true,div=null,shelves=[]}={}){
  box(x0,x0+15,6,326,1450,2150,'carc',mod,U);box(x1-15,x1,6,326,1450,2150,'carc',mod,U);
  box(x0+15,x1-15,6,326,2135,2150,'carc',mod,U);
  if(piso)box(x0+15,x1-15,6,326,1450,1465,'carc',mod,U);
  else{box(x0+15,x1-15,266,326,1450,1465,'carc',mod,U);box(x0+15,x1-15,6,86,1450,1465,'carc',mod,U);}
  box(x0+2,x1-2,0,6,1452,2148,'back',mod,U);
  if(div!=null)box(div-7.5,div+7.5,6,326,1465,2135,'carc',mod,U);
  for(const [a,b] of shelves)box(a,b,26,326,1792,1807,'carc',mod,U);
}
upper('S1',215,530,{shelves:[[231,514]]});door('S1',215,530,326,1430,2147,'left',U);
box(530,545,6,326,1800,2150,'carc','S2',U);box(1115,1130,6,326,1800,2150,'carc','S2',U);
box(545,1115,6,326,1800,1815,'carc','S2',U);box(545,1115,6,326,2135,2150,'carc','S2',U);box(532,1128,0,6,1802,2148,'back','S2',U);
door('S2',530,1130,326,1800,2147,'left',U);
upper('S3',1130,1975,{div:1552.5,shelves:[[1147.5,1545],[1560,1957.5]]});
door('S3',1130,1552.5,326,1430,2147,'left',U);door('S3',1552.5,1975,326,1430,2147,'right',U);
upper('S4',1975,2690,{piso:false});
box(1992.5,2672.5,40,285,1700,1712,'inox','S4',U);
for(let i=0;i<8;i++){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.115,0.115,0.012,32),mat('plate'));p.rotation.z=Math.PI/2;p.position.set((2050+i*28)*S,1.83,0.17);U.add(p);}
box(1992.5,2672.5,40,285,1480,1495,'dark','S4',U);
door('S4',1975,2332,326,1430,2147,'left',U);door('S4',2333,2690,326,1430,2147,'right',U);
}

// Cada puerta y cajón expone userData.mover para abrirse por separado al tocarlo.
for(const m of movers)m.g.userData.mover={t:0,target:0,apply:m.type==='slide'?t=>m.g.position.z=t*m.dist*S:t=>m.g.rotation.y=m.sign*t*1.75};
const root=new THREE.Group(),W=variant==='280'?280:260;scene.position.x=-(3000-W*10)/2000;root.add(scene);
return {root,info:kitchenInfo,dimensions:{w:W,d:62,h:215},
 setOpen(t){for(const m of movers){const u=m.g.userData.mover;u.t=u.target=t;u.apply(t);}}};
};
