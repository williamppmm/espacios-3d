/* Clóset definitivo (opción 2): geometría RH15 y 17 refuerzos. H es el hueco nominal; altura montada 2380 mm. */
window.EspaciosModels=window.EspaciosModels||{};
window.EspaciosModels.closetOption2=function(THREE){
const DEF={W:2880,H:2400,D:480,sideGap:10,topGap:20,base:100,t:15,
  bays:3,outerW:990,bayTypes:['zap','cajones','zap'],
  drawers:3,frontH:210,gap:30,shelvesB:4,shoeShelves:2,shelfD:350,shelfClear:280,
  rodHigh:1750,rodLow:900,maletero:1860,
  ov:30,doorClear:35,floorGap:25,kit:70,topDoors:2,doorT:15,mode:'B',malType:'levantar'};
const P=JSON.parse(JSON.stringify(DEF));
const NL=2, SHEET=[2440,2150], RAILS=[250,300,350,400,450,500,550];
let SHOE_CLEAR=280;
// La fuerza de elevación se define con la tabla del fabricante para cada altura y peso.
const TYPES={largo:'Colgar largo',doble:'Doble colgado',cajones:'Colgar corto + cajones',zap:'Colgar + repisas',estantes:'Estantes'};
const DEFTYPES=['largo','cajones','cajones','doble','zap','estantes'];
const cm=v=>{const s=(Math.round(v)/10).toFixed(1).replace('.',',');return s.endsWith(',0')?s.slice(0,-2):s;};
const mm=v=>Math.round(v*10)/10===Math.round(v)?String(Math.round(v)):(Math.round(v*10)/10).toString().replace('.',',');
const S=0.001;

/* ---------- Cálculo ---------- */
function distribute(y0,y1,count,t){const sp=(y1-y0-count*t)/(count+1);const ys=[];for(let k=0;k<count;k++)ys.push(y0+sp*(k+1)+t*k);return {ys,sp};}
function intervals(pos,w,W){
  const iv=pos.map(x=>[x,x+w]).sort((a,b)=>a[0]-b[0]);const m=[];
  for(const a of iv){if(m.length&&a[0]<=m[m.length-1][1])m[m.length-1][1]=Math.max(m[m.length-1][1],a[1]);else m.push([a[0],a[1]]);}
  const free=[];let cur=0;for(const q of m){if(q[0]>cur+0.01)free.push([cur,q[0]]);cur=Math.max(cur,q[1]);}
  if(cur<W-0.01)free.push([cur,W]);return free;
}
function opens(free,x0,x1,margin,W){const a=Math.max(0,x0-margin),b=Math.min(W,x1+margin);return free.some(f=>f[0]<=a+0.01&&f[1]>=b-0.01);}
/* Posiciones de las 4 puertas bajas. Índices 0 y 2: carril trasero; 1 y 3: carril delantero. */
function mkPresets(R){
  if(R.door.n===0)return {'Cerradas':[]};
  const W=R.W,w=R.door.w,m=10,s0=R.secs[0],sN=R.secs[R.secs.length-1];
  const xl=s0.x1+m,xr=sN.x0-m-w;
  return {'Cerradas':[0,W-w],'Abrir izquierda':[xl,W-w],'Abrir derecha':[0,xr],'Abrir ambas':[xl,xr]};
}
function mkTop(R){
  const W=R.W,nt=R.tdoor.n,w=R.tdoor.w,p=R.tdoor.pitch;
  const out={'Cerradas':Array.from({length:nt},(_,k)=>k*p)};
  const stack=right=>{const pos=[];const lanes=[[],[]];for(let k=0;k<nt;k++)lanes[k%2].push(k);
    lanes.forEach(L=>L.forEach((k,j)=>{pos[k]=right?W-(L.length-j)*w:j*w;}));return pos;};
  out['Abrir izquierda']=stack(true);out['Abrir derecha']=stack(false);
  return out;
}
function compute(P){
  SHOE_CLEAR=P.shelfClear;
  const t=P.t,R={};R.W=P.W;R.H=P.H;R.D=P.D;R.t=t;
  const n=P.bays,nv=n+1,avail=P.W-2*P.sideGap-nv*t;
  let widths;
  if(n>=3){const m=Math.floor((avail-2*P.outerW)/(n-2));widths=[P.outerW,...Array(n-2).fill(m),P.outerW];}
  else widths=Array(n).fill(Math.floor(avail/n));
  const used=nv*t+widths.reduce((a,b)=>a+b,0);
  R.gapSide=(P.W-used)/2;R.used=used;R.verts=[];R.secs=[];
  let x=R.gapSide;
  for(let i=0;i<n;i++){
    R.verts.push({x0:x,x1:x+t});x+=t;
    R.secs.push({id:'B'+(i+1),kind:P.bayTypes[i],x0:x,x1:x+widths[i],w:widths[i]});x+=widths[i];
  }
  R.verts.push({x0:x,x1:x+t});
  R.yb=P.base;R.yTop=P.H-P.topGap;R.Hv=R.yTop-R.yb;R.mal=P.maletero;R.floorTop=R.yb+t;
  // cajones
  const nd=P.drawers,fh=P.frontH,g=P.gap;
  R.dr={n:nd,fh,g,zoneTop:R.floorTop+nd*fh+(nd+1)*g};
  const reqRail=P.D-t-20;R.railLen=RAILS.filter(r=>r<=reqRail).pop()||250;R.drawMax=R.railLen-50;R.boxH=fh-40;
  // zapatero y estantes
  R.shoe={n:P.shoeShelves,ys:[],zoneTop:R.floorTop+P.shoeShelves*(SHOE_CLEAR+t)};
  for(let i=0;i<P.shoeShelves;i++)R.shoe.ys.push(R.floorTop+SHOE_CLEAR+i*(SHOE_CLEAR+t));
  const dB=distribute(R.floorTop,R.mal,P.shelvesB,t);R.bsh=dB.ys;R.bsp=dB.sp;
  // puertas bajas
  const MB=P.mode==='B';
  const w=MB?0:R.secs[0].x1;
  R.door={n:MB?0:NL,w,pitch:w-P.ov,top:P.maletero-10,lanePitch:P.doorT+14};
  R.door.Hd=R.door.top-P.floorGap;
  const dc=MB?Math.min(P.doorClear,22):P.doorClear;
  R.door.z=[P.D+dc,P.D+dc+R.door.lanePitch];
  R.door.weight=(w*R.door.Hd*P.doorT*1e-9)*650;
  // puertas del maletero
  const nt=P.topDoors,tw=(P.W+(nt-1)*P.ov)/nt;
  R.tdoor={n:nt,w:tw,pitch:tw-P.ov,y0:MB?P.maletero+5:R.door.top+P.kit+5,y1:P.H-P.kit};
  R.tdoor.Hd=R.tdoor.y1-R.tdoor.y0;R.tdoor.weight=(tw*R.tdoor.Hd*P.doorT*1e-9)*650;
  R.track={z0:R.door.z[0]-12,z1:R.door.z[1]+P.doorT+12,h:45};
  R.cenefaZ0=R.door.z[1]+P.doorT+14;
  R.nicheD=R.cenefaZ0+t+8;
  R.fl=P.malType==='levantar';
  if(R.fl&&R.door.n===0)R.nicheD=P.D+P.doorT+3;
  R.hd=[];const ns=R.secs.length,half=t/2-1;
  const addHd=(s,left,x0,x1,dr)=>{const y0=dr?R.dr.zoneTop-10:P.base+2,y1=R.mal-3;
    R.hd.push({sec:s,left,x0,x1,w:x1-x0,y0,y1,Hd:y1-y0,full:!dr,weight:((x1-x0)*(y1-y0)*P.doorT*1e-9)*650});};
  R.secs.forEach((s,i)=>{
    const dr=s.kind==='cajones';
    if(MB){const x0=s.x0-half,x1=s.x1+half,wd=(x1-x0-2)/2;addHd(s,true,x0,x0+wd,dr);addHd(s,false,x1-wd,x1,dr);return;}
    if(i===0||i===ns-1)return;
    addHd(s,i<=(ns-1)/2,s.x0-half,s.x1+half,dr);
  });
  R.fd=[];
  if(R.fl)R.secs.forEach(s=>{
    const x0=s.x0-half,x1=s.x1+half,y0=R.mal+2,y1=R.yTop,wd=x1-x0,Hd=y1-y0,weight=wd*Hd*P.doorT*650e-9,k=wd>=600?2:1;
    R.fd.push({sec:s,x0,w:wd,y0,y1,Hd,weight,k,v:null,forceStatus:"Pendiente de selección para altura real de "+Hd+" mm"});
  });
  R.presets=mkPresets(R);R.tpresets=mkTop(R);
  return R;
}

let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
function canvasTex(w,h,draw,rx=1,ry=1){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=4;return t;}
const wood=canvasTex(256,512,(g,w,h)=>{g.fillStyle='#b48a62';g.fillRect(0,0,w,h);
  for(let i=0;i<140;i++){const x=rnd()*w,a=0.04+rnd()*0.12;g.strokeStyle=rnd()>.5?`rgba(90,58,30,${a})`:`rgba(230,200,160,${a})`;
    g.lineWidth=0.5+rnd()*2;g.beginPath();g.moveTo(x,0);for(let y=0;y<=h;y+=32)g.lineTo(x+Math.sin(y*0.02+i)*3,y);g.stroke();}});
const brick=canvasTex(512,342,(g)=>{g.fillStyle='#cbbfad';g.fillRect(0,0,512,342);const bw=256,bh=171,j=7;
  for(let r=0;r<2;r++){const off=r%2?bw/2:0;for(let k=-1;k<3;k++){const v=(rnd()-.5)*30;g.fillStyle=`rgb(${178+v|0},${86+v*.6|0},${52+v*.4|0})`;g.fillRect(k*bw+off+j/2,r*bh+j/2,bw-j,bh-j);}}});
const PAL={
  carc:{color:0xb08a64}, wood:{map:wood}, door0:{color:0xb08d63,roughness:.55}, door1:{color:0xc4a37a,roughness:.55},
  rail:{color:0x9a7a58}, metal:{color:0xb9bec2,metalness:.75,roughness:.35}, dark:{color:0x3f4547,roughness:.6},
  zoc:{color:0x5e4d3d}, floor:{color:0xa9b1ae,roughness:.9}
};
function mat(k){return new THREE.MeshStandardMaterial(Object.assign({roughness:.7,metalness:0},PAL[k]));}


const root=new THREE.Group(),G={body:new THREE.Group(),doors:new THREE.Group(),track:new THREE.Group(),clothes:new THREE.Group(),labels:new THREE.Group(),hdoors:new THREE.Group()};Object.values(G).forEach(g=>root.add(g));let all=[],bySec={},drawerGroups=[],R=null,LD=[],TD=[],HD=[],FD=[];
const currentPreset='Cerradas',currentTop='Cerradas';
function B(x0,x1,y0,y1,z0,z1,k,sec,parent,role){
  const m=new THREE.Mesh(new THREE.BoxGeometry((x1-x0)*S,(y1-y0)*S,(z1-z0)*S),mat(k));
  m.position.set((x0+x1)/2*S,(y0+y1)/2*S,(z0+z1)/2*S);m.castShadow=m.receiveShadow=true;
  m.userData={sec,role:role||'',piece:{bounds:[x0,x1,y0,y1,z0,z1],material:k,sec,drawer:!!parent&&sec?.startsWith('B')}};(parent||G.body).add(m);
  if(sec){all.push(m);(bySec[sec]=bySec[sec]||[]).push(m);}
  return m;
}
function disposeTree(o){o.traverse(c=>{if(c.geometry)c.geometry.dispose();if(c.material){if(c.material.map&&c.material.map.image&&c.material.map!==wood&&c.material.map!==brick)c.material.map.dispose();c.material.dispose();}});}
function label(txt,x,y,z,size){
  const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');
  g.font='500 58px "JetBrains Mono", ui-monospace, monospace';const w=Math.min(500,g.measureText(txt).width+40);
  g.fillStyle='rgba(250,251,250,.93)';g.fillRect((512-w)/2,24,w,80);g.strokeStyle='#0e6a73';g.lineWidth=3;g.strokeRect((512-w)/2,24,w,80);
  g.fillStyle='#1b2528';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,256,66);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));
  s.position.set(x*S,y*S,z*S);s.scale.set(size*4,size,1);s.renderOrder=10;G.labels.add(s);
}
function addRod(s,ry,len,D){
  const c=new THREE.Mesh(new THREE.CylinderGeometry(12.5*S,12.5*S,(s.w-2)*S,18),mat('metal'));
  c.rotation.z=Math.PI/2;c.position.set((s.x0+s.x1)/2*S,ry*S,D/2*S);c.castShadow=true;c.userData={sec:s.id};G.body.add(c);all.push(c);(bySec[s.id]=bySec[s.id]||[]).push(c);
  B(s.x0,s.x0+10,ry-22,ry+22,D/2-28,D/2+28,'metal',s.id);B(s.x1-10,s.x1,ry-22,ry+22,D/2-28,D/2+28,'metal',s.id);
  const cnt=Math.floor((s.w-50)/62);
  for(let k=0;k<cnt;k++){
    const gx=s.x0+30+k*62+(s.w-50-(cnt-1)*62)/2,gl=len*(0.88+rnd()*0.2),col=[0x8b9aa8,0xa7b5a0,0xc2a98f,0x6d7c86,0xb39c9c,0x9fa6ad][Math.floor(rnd()*6)];
    const m=new THREE.Mesh(new THREE.BoxGeometry(14*S,gl*S,380*S),new THREE.MeshStandardMaterial({color:col,roughness:.95}));
    m.position.set(gx*S,(ry-60-gl/2)*S,D/2*S);G.clothes.add(m);
  }
}

  R=compute(P);


  const {t}=R,D=P.D,W=P.W,H=P.H,yb=R.yb,yTop=R.yTop;
  const xs=R.gapSide,xe=W-R.gapSide;

  // divisores y laterales: de la base al techo, sin fondo
  R.verts.forEach(v=>B(v.x0,v.x1,yb,yTop,0,D,'carc','EST'));
  // refuerzos de RH15: listones de canto bajo repisas/pisos anchos y base de cajón (ver README, rigidez)
  const rf=(x0,x1,y0,y1,z0,z1,sec,name,parent)=>{const m=B(x0,x1,y0,y1,z0,z1,'carc',sec,parent);m.userData.piece.name=name;return m;};
  R.secs.forEach(s=>{
    B(s.x0,s.x1,yb,yb+t,0,D,'carc',s.id);
    B(s.x0,s.x1,yTop-t,yTop,0,D,'carc','MAL');
    B(s.x0,s.x1,R.mal,R.mal+t,0,D,'carc','MAL');
    B(s.x0,s.x1,yTop-t-100,yTop-t,0,t,'rail','EST');
    B(s.x0,s.x1,yb+t,yb+t+100,0,t,'rail','EST');
    B(s.x0,s.x1,R.mal-100,R.mal,0,t,'rail','EST');
    rf(s.x0,s.x1,R.mal-80,R.mal,D-t,D,'MAL','Listón frontal de refuerzo (de canto)');
    if(s.kind==='cajones'){
      // HRE320-40: descuento total de 27 mm confirmado en ficha rev. 15/05/25.
      const {n,fh,g}=R.dr,boxW=s.w-27;
      for(let i=0;i<n;i++){
        const y0=R.floorTop+g+i*(fh+g);
        const grp=new THREE.Group();G.body.add(grp);
        B(s.x0+3,s.x1-3,y0,y0+fh,D-t,D,'wood',s.id,grp,'front');
        const bx0=s.x0+13.5,bx1=bx0+boxW,by0=y0+12,by1=by0+R.boxH,zF=D-t,zR=zF-R.railLen;
        B(bx0,bx0+t,by0+t,by1,zR,zF,'carc',s.id,grp);
        B(bx1-t,bx1,by0+t,by1,zR,zF,'carc',s.id,grp);
        B(bx0,bx1,by0,by0+t,zR,zF,'carc',s.id,grp);
        B(bx0+t,bx1-t,by0+t,by1,zF-t,zF,'carc',s.id,grp);
        B(bx0+t,bx1-t,by0+t,by1,zR,zR+t,'carc',s.id,grp);
        rf(bx0,bx1,by0-30,by0,(zR+zF)/2-t/2,(zR+zF)/2+t/2,s.id,'Refuerzo central bajo base de cajón (de canto)',grp);
        drawerGroups.push({g:grp,sec:s});
      }
      addRod(s,P.rodHigh,Math.min(760,P.rodHigh-60-R.dr.zoneTop),D);
    }else if(s.kind==='zap'){
      R.shoe.ys.forEach(y=>{B(s.x0,s.x1,y,y+t,D-P.shelfD,D-2,'carc',s.id);
        rf(s.x0,s.x1,y-60,y,D-2-t,D-2,s.id,'Listón de refuerzo de repisa (de canto)');
        rf(s.x0,s.x1,y-60,y,D-P.shelfD,D-P.shelfD+t,s.id,'Listón de refuerzo de repisa (de canto)');});
      addRod(s,P.rodHigh,Math.min(1000,P.rodHigh-60-R.shoe.zoneTop),D);
    }else if(s.kind==='estantes'){
      R.bsh.forEach(y=>B(s.x0,s.x1,y,y+t,0,D-2,'carc',s.id));
    }else{
      const rods=s.kind==='doble'?[P.rodHigh,P.rodLow]:[P.rodHigh];
      rods.forEach((ry,ri)=>addRod(s,ry,s.kind==='doble'?(ri===0?750:700):1350,D));
    }
  });

  // módulo base (marco 100 con patas, zócalo retranqueado 50)
  const fl=20,zf=D-50;
  const segs=Math.ceil((xe-xs)/SHEET[0]),segW=(xe-xs)/segs;
  for(let i=0;i<segs;i++)B(xs+i*segW+(i?2:0),xs+(i+1)*segW-(i<segs-1?2:0),8,yb,zf-t,zf,'zoc','BASE');
  for(let i=0;i<segs;i++)B(xs+i*segW,xs+(i+1)*segW,fl,yb,0,t,'zoc','BASE');
  R.verts.forEach(v=>{
    B(v.x0,v.x1,fl,yb,t,zf-t,'zoc','BASE');
    [[t+20],[zf-t-35]].forEach(([z])=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(14*S,14*S,fl*S,12),mat('dark'));c.position.set((v.x0+v.x1)/2*S,fl/2*S,z*S);c.userData={sec:'BASE'};G.body.add(c);all.push(c);(bySec.BASE=bySec.BASE||[]).push(c);});
  });

  // puertas bajas, puertas del maletero, rieles y cenefas
  LD=[];TD=[];
  for(let i=0;i<R.door.n;i++){
    const lane=i%2;
    const m=B(0,R.door.w,P.floorGap,R.door.top,R.door.z[lane],R.door.z[lane]+P.doorT,lane?'door1':'door0','PUERTAS',G.doors,'door');
    LD.push({m,w:R.door.w,x:R.presets[currentPreset][i],tx:R.presets[currentPreset][i]});
  }
  for(let k=0;k<(R.fl?0:R.tdoor.n);k++){
    const lane=k%2;
    const m=B(0,R.tdoor.w,R.tdoor.y0,R.tdoor.y1,R.door.z[lane],R.door.z[lane]+P.doorT,lane?'door1':'door0','PUERTAS',G.doors,'door');
    TD.push({m,w:R.tdoor.w,x:R.tpresets[currentTop][k],tx:R.tpresets[currentTop][k]});
  }
  HD=[];
  R.hd.forEach((h,hi)=>{
    const pv=new THREE.Group();pv.position.set((h.left?h.x0:h.x1)*S,0,(D+P.doorT)*S);
    const m=new THREE.Mesh(new THREE.BoxGeometry(h.w*S,h.Hd*S,P.doorT*S),mat(hi%2?'door1':'door0'));
    m.position.set((h.left?h.w/2:-h.w/2)*S,(h.y0+h.y1)/2*S,-P.doorT/2*S);m.castShadow=m.receiveShadow=true;m.userData={sec:h.sec.id,role:'hdoor',piece:{name:'Puerta abatible',bounds:[h.x0,h.x1,h.y0,h.y1,D,D+P.doorT],material:'door',sec:h.sec.id}};
    pv.add(m);G.hdoors.add(pv);all.push(m);(bySec.PUERTAS=bySec.PUERTAS||[]).push(m);
    HD.push({pv,h,a:0});
  });
  FD=[];
  R.fd.forEach((f,fi)=>{
    const pv=new THREE.Group();pv.position.set(0,f.y1*S,(D+P.doorT)*S);
    const m=new THREE.Mesh(new THREE.BoxGeometry(f.w*S,f.Hd*S,P.doorT*S),mat(fi%2?'door1':'door0'));
    m.position.set((f.x0+f.w/2)*S,-f.Hd/2*S,-P.doorT/2*S);m.castShadow=m.receiveShadow=true;m.userData={sec:f.sec.id,role:'flap',piece:{name:'Puerta maletero abatible superior',bounds:[f.x0,f.x0+f.w,f.y0,f.y1,D,D+P.doorT],material:'door',sec:f.sec.id}};
    pv.add(m);G.hdoors.add(pv);all.push(m);(bySec.PUERTAS=bySec.PUERTAS||[]).push(m);FD.push({pv,f,a:0});
  });
  if(R.door.n>0)B(0,W,R.door.top,R.door.top+R.track.h,R.track.z0,R.track.z1,'metal','RIEL',G.track);
  if(!R.fl)B(0,W,H-R.track.h,H,R.track.z0,R.track.z1,'metal','RIEL',G.track);
  if(R.door.n>0)B(0,W,R.door.top,R.door.top+P.kit,R.cenefaZ0,R.cenefaZ0+t,'carc','RIEL',G.track);
  if(!R.fl)B(0,W,H-P.kit,H,R.cenefaZ0,R.cenefaZ0+t,'carc','RIEL',G.track);


const movers=[];function move(object,kind,apply,id){const u={t:0,target:0,kind,apply(t){this.t=Math.max(0,Math.min(1,t));apply(this.t);}};object.userData.mover=u;object.userData.motionId=id;movers.push(u);return u;}
HD.forEach((d,i)=>move(d.pv,'hinge',t=>d.pv.rotation.y=(d.h.left?-1:1)*t*Math.PI/2,'puerta-'+(i+1)));
FD.forEach((d,i)=>move(d.pv,'lift',t=>d.pv.rotation.x=-t*Math.PI/2,'maletero-'+(i+1)));
drawerGroups.forEach((d,i)=>move(d.g,'drawer',t=>d.g.position.z=t*R.drawMax*S,'cajon-'+(i+1)));
function setOpen(t){movers.forEach(u=>{u.t=u.target=t;u.apply(t);});}
function tick(){movers.forEach(u=>{if(Math.abs(u.target-u.t)>.0001)u.apply(Math.abs(u.target-u.t)<.004?u.target:u.t+(u.target-u.t)*.18);});}
const parts=all.filter(m=>m.userData.piece&&['carc','wood','rail','zoc','door'].includes(m.userData.piece.material));
return {root,all,parts,setOpen,motion:{movers,tick},groups:G,parameters:P,calculation:R,doors:HD,flaps:FD,drawers:drawerGroups,dimensions:{w:288,d:49.5,h:238}};
};
