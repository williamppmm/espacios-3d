/* Conjunto de baño: geometría terminada compartida con el despiece. Cotas en mm. */
window.EspaciosModels=window.EspaciosModels||{};
window.EspaciosModels.bathroom=function(T){
 const data=window.BanoData,root=new T.Group(),body=new T.Group(),fronts=new T.Group(),equip=new T.Group(),hardware=new T.Group(),all=[],parts=[],movers=[],moving={};root.add(body,fronts,equip,hardware);
 const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle='#b48a62';g.fillRect(0,0,256,256);let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};for(let i=0;i<130;i++){g.strokeStyle=i%2?'#6f4f2a33':'#ecd2ae33';g.beginPath();const x=rnd()*256;g.moveTo(x,0);for(let y=0;y<=256;y+=16)g.lineTo(x+Math.sin(y*.03+i)*2,y);g.stroke();}const tex=new T.CanvasTexture(c);tex.encoding=T.sRGBEncoding;tex.wrapS=tex.wrapT=T.RepeatWrapping;
 const mc=document.createElement('canvas');mc.width=256;mc.height=512;const mg=mc.getContext('2d'),grad=mg.createLinearGradient(0,0,256,512);grad.addColorStop(0,'#dce6e5');grad.addColorStop(.45,'#aebbbd');grad.addColorStop(1,'#6c7b7d');mg.fillStyle=grad;mg.fillRect(0,0,256,512);mg.fillStyle='#eef4f342';mg.fillRect(20,0,16,512);const mirrorTex=new T.CanvasTexture(mc);mirrorTex.encoding=T.sRGBEncoding;
 const M={wood:new T.MeshStandardMaterial({map:tex,roughness:.7}),white:new T.MeshStandardMaterial({color:0xf0f1ed,roughness:.65}),mirror:new T.MeshStandardMaterial({map:mirrorTex,roughness:.08,metalness:.15}),stone:new T.MeshStandardMaterial({color:0x454847,roughness:.25}),metal:new T.MeshStandardMaterial({color:0xbfc8cb,roughness:.25,metalness:.6}),pipe:new T.MeshStandardMaterial({color:0xe4e8e7,roughness:.4})};
 const motions=[['puerta-izq',16.5,450,-1],['puerta-der',533.5,450,1],['puerta-espejo',50,112,-1]];
 for(const [id,x,z,sign]of motions){const o=new T.Group();o.position.set(x/1000,0,z/1000);fronts.add(o);moving[id]=o;const u={id,t:0,target:0,apply(t){this.t=t;o.rotation.y=sign*t*Math.PI/2;}};o.userData.mover=u;movers.push(u);}
 function make(p,pose){const [x0,x1,y0,y1,z0,z1]=pose.bounds,w=(x1-x0)/1000,h=(y1-y0)/1000,d=(z1-z0)/1000;let geo;
  if(p.shape==='notch'){const a=new T.Shape();a.moveTo(0,0);a.lineTo(.195,0);a.lineTo(.195,.270);a.lineTo(.295,.270);a.lineTo(.295,0);a.lineTo(w,0);a.lineTo(w,d);a.lineTo(0,d);a.closePath();geo=new T.ExtrudeGeometry(a,{depth:h,bevelEnabled:false});geo.rotateX(Math.PI/2);geo.translate(x0/1000,y1/1000,z0/1000);}
  else if(p.id==='E02'){const a=new T.Shape();a.moveTo(0,0);a.lineTo(w,0);a.lineTo(w,d);a.lineTo(0,d);a.closePath();for(const [x,z,r]of [[.275,.250,.0225],[.275,.035,.0175]]){const hole=new T.Path();hole.absarc(x,z,r,0,Math.PI*2,true);a.holes.push(hole);}geo=new T.ExtrudeGeometry(a,{depth:h,bevelEnabled:false});geo.rotateX(Math.PI/2);geo.translate(x0/1000,y1/1000,z0/1000);}
  else{geo=new T.BoxGeometry(w,h,d);geo.translate((x0+x1)/2000,(y0+y1)/2000,(z0+z1)/2000);}
  // Veta en la dimensión L del despiece, también en los frentes biselados.
  if(p.material==='RH15 Cartagena'){const dims=[x1-x0,y1-y0,z1-z0],li=dims.findIndex(v=>Math.abs(v-p.L)<.001),ai=dims.findIndex((v,i)=>i!==li&&Math.abs(v-p.A)<.001),positions=geo.getAttribute('position'),uv=[];for(let i=0;i<positions.count;i++){const a=[positions.getX(i),positions.getY(i),positions.getZ(i)];uv.push(a[ai]/(p.A/1000),a[li]/(p.L/1000));}geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));}
  const mat=p.id==='E01'?M.mirror:p.id==='E02'?M.stone:p.t===6?M.white:M.wood,m=new T.Mesh(geo,mat.clone()),parent=pose.move?moving[pose.move]:p.id==='E02'?equip:body;if(pose.move)geo.translate(-parent.position.x,0,-parent.position.z);m.castShadow=true;m.receiveShadow=p.id!=='E01';m.userData={mod:p.module,piece:p.id};parent.add(m);all.push(m);parts.push(m);return m;
 }
 // El despiece suministra B06 como un solo rectángulo; el armado genera dos hojas trapezoidales.
 function splitFront(p,pose){const [x0,x1,y0,y1,z0,z1]=pose.bounds,w=(x1-x0)/1000,h=(y1-y0)/1000,a=data.frontSplit.angle*Math.PI/180,gap=(data.frontSplit.kerf-2*data.frontSplit.seamEdge)/Math.sin(a)/1000,run=h/2/Math.tan(a),bottom=w/2+run-gap/2,top=w/2-run-gap/2;
  const polys=[['puerta-izq',[[0,0],[bottom,0],[top,h],[0,h]]],['puerta-der',[[bottom+gap,0],[w,0],[w,h],[top+gap,h]]]];
  for(const [id,vertices]of polys){const shape=new T.Shape();vertices.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:(z1-z0)/1000,bevelEnabled:false});geo.translate(x0/1000,y0/1000,z0/1000);const pos=geo.getAttribute('position'),uv=[];for(let i=0;i<pos.count;i++)uv.push(pos.getX(i)/(p.A/1000),pos.getY(i)/(p.L/1000));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));const parent=moving[id];geo.translate(-parent.position.x,0,-parent.position.z);const m=new T.Mesh(geo,M.wood.clone());m.castShadow=m.receiveShadow=true;m.userData={mod:p.module,piece:p.id,assemblyLeaf:id};parent.add(m);all.push(m);parts.push(m);}
 }
 for(const p of [...data.parts,...data.extras])for(const pose of p.placements)if(p.shape==='splitDoors')splitFront(p,pose);else make(p,pose);
 function add(mesh,mod,parent=equip){mesh.userData.mod=mod;mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);all.push(mesh);return mesh;}
 function box(b,mat,mod,parent){const [a,c,e,f,h,i]=b,m=new T.Mesh(new T.BoxGeometry((c-a)/1000,(f-e)/1000,(i-h)/1000),mat);m.position.set((a+c)/2000,(e+f)/2000,(h+i)/2000);return add(m,mod,parent);}
 // Equipos ilustrativos: no son referencias comerciales ni plantillas de recorte.
 const profile=[[.020,0],[.070,.01],[.13,.055],[.17,.12],[.175,.14],[.168,.14],[.16,.12],[.12,.065],[.06,.027],[.020,.022]].map(v=>new T.Vector2(...v));const bowl=new T.Mesh(new T.LatheGeometry(profile,48),M.white);bowl.position.set(.275,.75,.25);add(bowl,'BAJO');
 function pipe(points,r,mat,mod){const curve=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),m=new T.Mesh(new T.TubeGeometry(curve,24,r,12,false),mat);return add(m,mod);}
 pipe([[.275,.75,.035],[.275,.94,.035],[.275,1.02,.06],[.275,1.02,.17],[.275,.99,.18]],.012,M.metal,'BAJO');
 pipe([[.275,.75,.25],[.275,.53,.25],[.275,.48,.20],[.275,.53,.13],[.275,.54,.01]],.016,M.pipe,'BAJO');
 for(const x of [45,497]){box([x,x+8,600,730,15,23],M.metal,'BAJO',hardware);box([x,x+8,722,730,23,410],M.metal,'BAJO',hardware);}
 // Dos bisagras por puerta. Esquema visual: el taller define cazoletas y holguras.
 for(const [id,x,yValues]of [['puerta-izq',16.5,[320,505]],['puerta-der',533.5,[320,505]],['puerta-espejo',50,[1340,1680]]]){const o=moving[id];for(const y of yValues)box([-3,3,y-10,y+10,-18,0],M.metal,id==='puerta-espejo'?'ESPEJO':'BAJO',o);}
 function setOpen(t){for(const u of movers){u.target=t;u.apply(t);}}
 function tick(){for(const u of movers)if(Math.abs(u.target-u.t)>.0001)u.apply(Math.abs(u.target-u.t)<.004?u.target:u.t+(u.target-u.t)*.18);}
 return {root,all,parts,moving,data,dimensions:data.dimensions,groups:{body,fronts,equip,hardware},setOpen,motion:{movers,tick}};
};
