/* Clóset compacto: tablero RH15 del mismo acabado de cocina. Medidas en mm. */
window.EspaciosModels=window.EspaciosModels||{};
window.EspaciosModels.closetOption3=function(T){
 const data=window.ClosetCompactData,P=data.parameters,root=new T.Group(),body=new T.Group(),fronts=new T.Group(),clothes=new T.Group(),hardware=new T.Group();root.add(body,fronts,clothes,hardware);
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#b48a62';ctx.fillRect(0,0,256,256);let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};for(let i=0;i<130;i++){ctx.strokeStyle=i%2?'#6f4f2a33':'#ecd2ae33';ctx.beginPath();const x=rnd()*256;ctx.moveTo(x,0);for(let y=0;y<=256;y+=16)ctx.lineTo(x+Math.sin(y*.03+i)*2,y);ctx.stroke();}const tex=new T.CanvasTexture(c);tex.encoding=T.sRGBEncoding;tex.wrapS=tex.wrapT=T.RepeatWrapping;
 const wood=new T.MeshStandardMaterial({map:tex,roughness:.7}),metal=new T.MeshStandardMaterial({color:0x929997,metalness:.6,roughness:.35}),dark=new T.MeshStandardMaterial({color:0x484740}),all=[],parts=[],movers=[],moving={};
 for(const id of ['hoja-1','hoja-2','cajon-1','cajon-2','cajon-3']){const g=new T.Group();(id.startsWith('hoja')?fronts:body).add(g);moving[id]=g;}
 function box(bounds,mat,parent){const [a,b,c,d,e,f]=bounds,m=new T.Mesh(new T.BoxGeometry((b-a)/1000,(d-c)/1000,(f-e)/1000),mat.clone());m.position.set((a+b)/2000,(c+d)/2000,(e+f)/2000);m.castShadow=m.receiveShadow=true;parent.add(m);all.push(m);return m;}
 for(const p of data.parts)for(const pose of p.placements){const mesh=box(pose.bounds,wood,pose.move?moving[pose.move]:body);mesh.userData={sec:p.group,role:pose.role,piece:{id:p.id,name:p.name,bounds:pose.bounds,material:'RH15',sec:p.group,move:pose.move}};parts.push(mesh);}
 // Suspensión superior: posiciones de referencia del clóset real. No hay riel de apoyo abajo.
 for(const z of [P.rearLeaf,P.frontLeaf])box([15,1935,2340,2365,z,z+15],metal,hardware);
 const guide=box([965,985,115,120,496,554],dark,hardware);guide.userData.hardware='Guía inferior lateral, sin carga';
 for(const z of [498,515,533,550]){const finger=box([965,985,120,146,z,z+2],dark,hardware);finger.userData.hardware='Guía: mantiene alineada la hoja';}
 const handles=[];
 for(const [i,x,face]of [[1,35,550],[2,1915,515]]){
  const g=new T.Group();g.userData.hardware='HMA310-02 · 96 mm entre centros · saliente 35 mm';moving['hoja-'+i].add(g);
  const bar=new T.Mesh(new T.CylinderGeometry(.005,.005,.119,16),metal.clone());bar.position.set(x/1000,1.10,(face+30)/1000);g.add(bar);
  for(const y of [1052,1148]){const leg=new T.Mesh(new T.CylinderGeometry(.004,.004,.030,12),metal.clone());leg.rotation.x=Math.PI/2;leg.position.set(x/1000,y/1000,(face+15)/1000);g.add(leg);}handles.push(g);
 }
 // Un tope detrás de la hoja exterior impide invertir el orden de las hojas.
 const stop=box([50,65,2020,2050,513,535],dark,moving['hoja-1']);stop.userData.hardware='Tope plástico con amortiguador: desfase mínimo 50 mm';
 for(const x of [7.5,852.5,1942.5])for(const z of [35,465]){const foot=new T.Mesh(new T.CylinderGeometry(.014,.014,.020,12),dark.clone());foot.position.set(x/1000,.01,z/1000);body.add(foot);all.push(foot);}
 const bars=[];function rod(bay,y,len,removable){const b=data.bays[bay],m=new T.Mesh(new T.CylinderGeometry(.0125,.0125,len/1000,16),metal.clone());m.rotation.z=Math.PI/2;m.position.set((b.x0+b.x1)/2000,y/1000,.2625);hardware.add(m);bars.push(m);for(const x of [b.x0,b.x1-10])box([x,x+10,y-18,y+18,242.5,282.5],metal,hardware);for(let i=0;i<8;i++){const h=new T.Mesh(new T.BoxGeometry(.014,removable?.60:.72,.45),new T.MeshStandardMaterial({color:[0x9aa99c,0x81939e,0xc4b49d][i%3],roughness:1}));h.position.set((b.x0+60+i*(b.w-120)/7)/1000,(y-70-(removable?300:360))/1000,.2625);clothes.add(h);}return m;}
 rod(0,1750,810,false);rod(1,1750,1055,false);rod(1,900,1055,true);
 let message='';const tell=msg=>{message=msg;window.dispatchEvent(new CustomEvent('espacios-movement-blocked',{detail:msg}));},clear=()=>{if(message){message='';window.dispatchEvent(new Event('espacios-movement-clear'));}};
 const doorX=()=>[15+moving['hoja-1'].position.x*1000,960+moving['hoja-2'].position.x*1000],covers=x=>x<847&&x+975>13;
 function movement(id,kind,apply){let committed=0;const u={id,kind,t:0,target:0,onInteract:clear,apply(t){t=Math.max(0,Math.min(1,t));const result=apply(t);if(result===false){this.t=committed;this.target=committed;}else{this.t=typeof result==='number'?result:t;committed=this.t;if(typeof result==='number')this.target=this.t;}}};moving[id].userData.mover=u;moving[id].userData.motionId=id;movers.push(u);return u;}
 const doorMovers=[1,2].map(i=>movement('hoja-'+i,'door',t=>{
  const desired=i===1?15+P.travel*t:960-P.travel*t,other=doorX()[i===1?1:0];
  const x=i===1?Math.min(desired,other-P.lostTravel):Math.max(desired,other+P.lostTravel);
  if(Object.entries(moving).some(([id,g])=>id.startsWith('cajon')&&g.position.z>.001)&&covers(x)){tell('Cierra primero los cajones antes de mover una hoja sobre ellos.');return false;}
  moving['hoja-'+i].position.x=(x-(i===1?15:960))/1000;
  if(Math.abs(x-desired)>.01){tell('El tope impide cruzar las hojas. Mueve primero la otra hoja hacia el extremo opuesto.');return i===1?(x-15)/P.travel:(960-x)/P.travel;}
 }));
 const drawerMovers=[1,2,3].map(i=>movement('cajon-'+i,'drawer',t=>{if(t>0&&doorX().some(covers)){tell('Apila las dos hojas a la derecha para abrir los cajones.');return false;}moving['cajon-'+i].position.z=.45*t;}));
 function access(side){
  drawerMovers.forEach(u=>{u.apply(0);u.target=0;});
  const order=side==='left'?[1,0]:[0,1];
  for(const i of order){const u=doorMovers[i];u.apply(side==='left'?(i===0?1:0):(i===0?0:1));u.target=u.t;}clear();
 }
 function setOpen(t){t=Math.max(0,Math.min(1,t));drawerMovers.forEach(u=>{u.apply(0);u.target=0;});doorMovers[1].apply(0);doorMovers[1].target=0;doorMovers[0].apply(Math.min(1,t/.65));doorMovers[0].target=doorMovers[0].t;drawerMovers.forEach(u=>{u.apply(Math.max(0,(t-.65)/.35));u.target=u.t;});clear();}
 function tick(){movers.forEach(u=>{if(Math.abs(u.target-u.t)>.0001)u.apply(Math.abs(u.target-u.t)<.004?u.target:u.t+(u.target-u.t)*.18);});}
 return {root,all,parts,groups:{body,fronts,clothes,hardware},parameters:P,data,dimensions:data.dimensions,motion:{movers,tick},moving,handles,stop,guide,setOpen,access,get message(){return message;}};
};
