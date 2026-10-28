/* Propuesta 260: piezas del mismo manifiesto usado para generar el despiece. */
window.EspaciosModels=window.EspaciosModels||{};
window.EspaciosModels.kitchenProposal=function(THREE){
 const D=window.CocinaPropuestaData,root=new THREE.Group(),body=new THREE.Group();body.position.x=-.2;root.add(body);
 const groups={fronts:[],uppers:new THREE.Group(),counter:new THREE.Group(),equip:new THREE.Group()},all=[],movers=[];
 body.add(groups.uppers,groups.counter,groups.equip);
 function texture(stone){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle=stone?'#e8dcc4':'#b48a62';g.fillRect(0,0,256,256);let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};if(stone){for(let i=0;i<1400;i++){g.fillStyle=i%2?'#b8a78988':'#fff8e7aa';g.fillRect(rnd()*256,rnd()*256,1+rnd()*2,1+rnd()*2);}}else{for(let i=0;i<130;i++){g.strokeStyle=i%2?'#6f4f2a33':'#ecd2ae33';g.beginPath();const x=rnd()*256;g.moveTo(x,0);for(let y=0;y<=256;y+=16)g.lineTo(x+Math.sin(y*.03+i)*2,y);g.stroke();}}const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
 const wood=texture(false),stone=texture(true),mats={wood:new THREE.MeshStandardMaterial({map:wood,roughness:.7}),back:new THREE.MeshStandardMaterial({color:0xf2f1ec}),stone:new THREE.MeshStandardMaterial({map:stone,roughness:.4}),inox:new THREE.MeshStandardMaterial({color:0xbfc2c5,metalness:.7,roughness:.3}),dark:new THREE.MeshStandardMaterial({color:0x53585c}),black:new THREE.MeshStandardMaterial({color:0x161819}),plate:new THREE.MeshStandardMaterial({color:0xf7f6ec}),grey:new THREE.MeshStandardMaterial({color:0x8a8c8a}),gola:new THREE.MeshStandardMaterial({color:0x666d70,metalness:.4})};
 function box(a,kind,mod,parent=body,role){const [x0,x1,z0,z1,y0,y1]=a,m=new THREE.Mesh(new THREE.BoxGeometry((x1-x0)/1000,(y1-y0)/1000,(z1-z0)/1000),mats[kind].clone());m.position.set((x0+x1)/2000,(y0+y1)/2000,(z0+z1)/2000);m.castShadow=m.receiveShadow=true;m.userData.mod=mod;parent.add(m);all.push(m);if(role==='front')groups.fronts.push(m);return m;}
 const moving={},armUpdates=[];
 for(const [key,v] of Object.entries(D.moves)){
  const parent=key[0]==='S'?groups.uppers:body,g=new THREE.Group();parent.add(g);
  if(v.type==='hinge')g.position.set(v.pivot[0]/1000,0,v.pivot[1]/1000);
  if(v.type==='lift')g.position.set(0,v.pivot[0]/1000,v.pivot[1]/1000);
  const apply=v.type==='slide'?t=>g.position.z=t*v.dist/1000:v.type==='lift'?t=>{g.rotation.x=-t*Math.PI/2;armUpdates.forEach(fn=>fn());}:t=>g.rotation.y=t*v.sign*1.75;
  const u={t:0,target:0,apply};g.userData.mover=u;moving[key]=g;movers.push(u);
 }
 for(const p of D.parts){const parent=p.move?moving[p.move]:p.module[0]==='S'?groups.uppers:body;
  let poses=p.placements;if(p.name.includes('recortar sifón'))poses=[[1696,1930,26,546,385,400],[2130,2364,26,546,385,400],[1930,2130,226,546,385,400]];
  for(const a of poses){const m=box(a,p.material.includes('6')?'back':'wood',p.module,parent,p.role);if(p.move&&D.moves[p.move].type!=='slide')m.position.sub(parent.position);m.userData.piece=p.id;}
 }
 // S2: dos brazos grises y bisagras en el techo. Posiciones visuales, NO plantilla de taladros.
 const flap=moving['S2-Puerta'],upAxis=new THREE.Vector3(0,1,0),axisX=new THREE.Vector3(1,0,0);
 function segmentMesh(radius,kind){const m=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,1,12),mats[kind].clone());groups.uppers.add(m);m.userData.mod='S2';all.push(m);return m;}
 function placeSegment(m,a,b){const delta=b.clone().sub(a);m.position.copy(a).add(b).multiplyScalar(.5);m.scale.y=delta.length();m.quaternion.setFromUnitVectors(upAxis,delta.normalize());}
 for(const x of [437,983]){
  const fixed=new THREE.Vector3(x/1000,1.96,.2),housing=segmentMesh(.007,'grey'),rod=segmentMesh(.0035,'inox');
  box([x-9,x+9,190,205,1947,1973],'grey','S2',groups.uppers);
  const update=()=>{const attachment=new THREE.Vector3(x/1000,-.08,-.012).applyAxisAngle(axisX,flap.rotation.x).add(flap.position);const dir=attachment.clone().sub(fixed).normalize(),join=fixed.clone().addScaledVector(dir,.145);placeSegment(housing,fixed,join);placeSegment(rod,join,attachment);};
  armUpdates.push(update);update();
 }
 for(const x of [465,955])box([x-15,x+15,295,326,2128,2135],'inox','S2',groups.uppers);
 const E=groups.equip,C=groups.counter;
 // Mesón: abertura ilustrativa de lavaplatos 490 × 370; el corte final requiere plantilla.
 for(const a of [[200,1785,0,620,885,900],[2275,2800,0,620,885,900],[1785,2275,0,125,885,900],[1785,2275,495,620,885,900]])box(a,'stone',null,C);
 // Cubeta de 165 mm y pestaña exterior 550 × 430 situada bajo la placa.
 for(const a of [[1755,1785,95,525,880,885],[2275,2305,95,525,880,885],[1785,2275,95,125,880,885],[1785,2275,495,525,880,885],[1785,1787,125,495,720,885],[2273,2275,125,495,720,885],[1785,2275,125,127,720,885],[1785,2275,493,495,720,885],[1785,2275,125,495,718,720]])box(a,'inox','B5',E);
 box([2030,2045,45,60,900,1210],'inox','B5',E);box([2030,2045,45,220,1195,1210],'inox','B5',E);
 // Horno y estufa: envolventes ilustrativas; ventilación y nicho por manual.
 box([413,1007,46,586,115,735],'inox','B2',E);box([470,950,586,603,265,635],'black','B2',E);box([490,930,603,625,660,680],'inox','B2',E);
 box([410,1010,55,565,900,912],'black','B2',E);for(const [x,z] of [[540,180],[880,180],[540,430],[880,430]]){const ring=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.008,24),mats.inox);ring.position.set(x/1000,.918,z/1000);E.add(ring);}
 box([410,1010,0,480,1550,1700],'black','S2',E);
 // Cubiertero removible.
 box([1053.5,1413.5,56,536,690,740],'dark','B3',moving['B3-cajon']);
 // Condimentero: cestas 100 × 446 × 470 y rieles laterales izquierdos; conjunto de 135 mm (medido por el usuario) dentro de 150 mm libres.
 const spice=moving['B1-extraible'];for(const y of [180,375,570]){box([280,380,80,526,y,y+5],'inox','B1',spice);box([245,280,100,500,y+20,y+28],'dark','B1',spice);for(const x of [280,375])box([x,x+5,80,526,y,y+55],'inox','B1',spice);for(const z of [80,521])box([280,380,z,z+5,y,y+55],'inox','B1',spice);}for(const x of [280,375])box([x,x+5,80,85,180,650],'inox','B1',spice);
 // B4: RH provisional desde manifiesto; rieles laterales verticales bajo plataforma.
 const bin=moving['B4-extraible'];
 box([2415,2745,55,540,195,200],'grey','B4',bin);
 for(const z of [60,300]){box([2430,2730,z,z+220,200,395],'grey','B4',bin);box([2425,2735,z-5,z+225,395,410],'grey','B4',bin);}
 for(const [a,b] of [[2395,2408.5],[2751.5,2765]])box([a,b,36,586,127.5,172.5],'inox','B4',E);
 for(const [a,b] of [[2404,2408.5],[2751.5,2756]])box([a,b,36,586,135,165],'inox','B4',bin);
 // Desagüe esquemático en rebaje del entrepaño; no son cotas para instalaciones.
 box([2020,2040,116,136,330,680],'grey','B5',E);box([2020,2040,116,320,670,690],'grey','B5',E);
 // Platero existente conservado.
 box([1682.5,2362.5,40,285,1700,1712],'inox','S4',groups.uppers);box([1682.5,2362.5,40,285,1480,1495],'dark','S4',groups.uppers);
 for(let i=0;i<8;i++){const plate=new THREE.Mesh(new THREE.CylinderGeometry(.115,.115,.012,28),mats.plate);plate.rotation.z=Math.PI/2;plate.position.set(1.74+i*.045,1.83,.17);groups.uppers.add(plate);}
 // Escurridor sobre mesón: referencia de 375 × 400, sin modelo comercial seleccionado.
 box([2392.5,2767.5,100,500,901,906],'grey','B4',E);for(let j=0;j<10;j++)box([2410+j*35,2413+j*35,120,480,920,925],'inox','B4',E);
 for(let j=0;j<4;j++){const plate=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.007,24),mats.plate);plate.rotation.z=Math.PI/2;plate.position.set(2.48+j*.045,1.005,.3);E.add(plate);}
 // Perfiles gola por separado de las piezas de melamina.
 for(const [a,b] of [[230,410],[1010,2780]])box([a,b,556,586,810,885],'gola',null);
 box([1010,1680,556,586,615,665],'gola',null);box([2380,2780,556,586,380,430],'gola',null);
 // Fijaciones gola: 8 extremos + 2 intermedias, posición y compatibilidad por validar.
 const golaFixings=[...([240,400,1020,1672.5,2372.5,2770].map(x=>[x,850])),...([1020,1670].map(x=>[x,640])),...([2390,2770].map(x=>[x,405]))];
 for(const [x,y] of golaFixings){const f=box([x-4,x+4,536,556,y-10,y+10],'inox',x<410?'B1':x<1680?'B3':x<2380?'B5':'B4');f.userData.golaFixing=true;}
 const modules=Object.fromEntries(D.modules.map(m=>[m.id,{n:m.name,d:m.note,x:[m.x,m.x+m.w],h:[m.id[0]==='S'?2150-m.h:100,m.id[0]==='S'?2150:885]}]));
 return {root,groups,all,modules,info:{knownBudget:D.summary.knownBudget,slabThickness:15},dimensions:{w:260,d:62,h:215},
  setOpen(t){movers.forEach(u=>{u.t=u.target=t;u.apply(t);});},
  selectModule(code){for(const m of all){const on=!code||m.userData.mod===code;m.material.transparent=!on;m.material.opacity=on?1:.15;m.material.depthWrite=on;}},
  dimensionData:D
 };
};