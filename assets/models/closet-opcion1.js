/* Clóset opción 1: geometría derivada del HTML aportado por el usuario. Milímetros. */
window.EspaciosModels=window.EspaciosModels||{};
window.EspaciosModels.closetOption1=function(THREE){
const DEF={W:2880,H:2400,D:398,sideGap:10,topGap:20,base:100,t:15,
  bays:4,outerW:715,bayTypes:['largo','cajones','cajones','doble'],
  drawers:3,frontH:210,gap:30,shelvesB:4,shoeShelves:2,shelfD:350,
  rodHigh:1750,rodLow:900,maletero:1860,
  ov:30,doorClear:35,floorGap:25,kit:70,topDoors:2,doorT:15};
const P=JSON.parse(JSON.stringify(DEF));
const NL=4, SHEET=[2440,2150], RAILS=[250,300,350,400,450,500,550], SHOE_CLEAR=180;
const TYPES={largo:'Colgar largo',doble:'Doble colgado',cajones:'Colgar corto + cajones',zap:'Colgar + zapatero',estantes:'Estantes'};
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
  const W=R.W,w=R.door.w,p=R.door.pitch,m=10,out={'Cerradas':[0,p,2*p,3*p]};
  const pose=(x0,x1)=>{
    const a=x0-m,b=x1+m;
    if(2*w<=a)return [0,0,w,w];
    if(b<=W-2*w)return [W-2*w,W-2*w,W-w,W-w];
    if(a-w>=0&&b<=W-w)return [a-w,a-w,b,b];
    const xL=Math.max(0,a-w),xR=Math.min(W-w,Math.max(b,xL+w));return [xL,xL,xR,xR];
  };
  R.secs.forEach((s,i)=>{out['Abrir tramo '+(i+1)]=pose(s.x0,s.x1);});
  if(R.secs.length>=3)out['Abrir centro']=[0,0,W-w,W-w];
  return out;
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
  const w=(P.W+(NL-1)*P.ov)/NL;
  R.door={n:NL,w,pitch:w-P.ov,top:P.maletero-10,lanePitch:35};
  R.door.Hd=R.door.top-P.floorGap;
  R.door.z=[P.D+P.doorClear,P.D+P.doorClear+R.door.lanePitch];
  R.door.weight=(w*R.door.Hd*P.doorT*1e-9)*650;
  // puertas del maletero
  const nt=P.topDoors,tw=(P.W+(nt-1)*P.ov)/nt;
  R.tdoor={n:nt,w:tw,pitch:tw-P.ov,y0:R.door.top+P.kit+5,y1:P.H-P.kit};
  R.tdoor.Hd=R.tdoor.y1-R.tdoor.y0;R.tdoor.weight=(tw*R.tdoor.Hd*P.doorT*1e-9)*650;
  R.track={z0:R.door.z[0]-12,z1:R.door.z[1]+P.doorT+12,h:45};
  R.cenefaZ0=R.door.z[1]+P.doorT+14;
  R.nicheD=R.cenefaZ0+t+8;
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


const root=new THREE.Group();let all=[],bySec={},drawerGroups=[],R=null,LD=[],TD=[];
const G={body:new THREE.Group(),doors:new THREE.Group(),track:new THREE.Group(),clothes:new THREE.Group(),labels:new THREE.Group()};Object.values(G).forEach(g=>root.add(g));
const currentPreset='Cerradas',currentTop='Cerradas';
function B(x0,x1,y0,y1,z0,z1,k,sec,parent,role){
  const m=new THREE.Mesh(new THREE.BoxGeometry((x1-x0)*S,(y1-y0)*S,(z1-z0)*S),mat(k));
  m.position.set((x0+x1)/2*S,(y0+y1)/2*S,(z0+z1)/2*S);m.castShadow=m.receiveShadow=true;
  m.userData={sec,role:role||''};(parent||G.body).add(m);
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
  R.secs.forEach(s=>{
    B(s.x0,s.x1,yb,yb+t,0,D,'carc',s.id);
    B(s.x0,s.x1,yTop-t,yTop,0,D,'carc','MAL');
    B(s.x0,s.x1,R.mal,R.mal+t,0,D,'carc','MAL');
    B(s.x0,s.x1,yTop-t-100,yTop-t,0,t,'rail','EST');
    B(s.x0,s.x1,yb+t,yb+t+100,0,t,'rail','EST');
    if(s.kind==='cajones'){
      const {n,fh,g}=R.dr,boxW=s.w-27;
      for(let i=0;i<n;i++){
        const y0=R.floorTop+g+i*(fh+g);
        const grp=new THREE.Group();G.body.add(grp);
        B(s.x0+3,s.x1-3,y0,y0+fh,D-t,D,'wood',s.id,grp,'front');
        const bx0=s.x0+13.5,bx1=bx0+boxW,by0=y0+12,by1=by0+R.boxH,zF=D-t,zR=zF-R.railLen;
        // Base aplicada debajo de las paredes: envolvente conservada, sin solapes.
        B(bx0,bx0+t,by0+t,by1,zR,zF,'carc',s.id,grp);
        B(bx1-t,bx1,by0+t,by1,zR,zF,'carc',s.id,grp);
        B(bx0,bx1,by0,by0+t,zR,zF,'carc',s.id,grp);
        B(bx0+t,bx1-t,by0+t,by1,zF-t,zF,'carc',s.id,grp);
        B(bx0+t,bx1-t,by0+t,by1,zR,zR+t,'carc',s.id,grp);
        drawerGroups.push({g:grp,sec:s});
      }
      addRod(s,P.rodHigh,Math.min(760,P.rodHigh-60-R.dr.zoneTop),D);
    }else if(s.kind==='zap'){
      R.shoe.ys.forEach(y=>B(s.x0,s.x1,y,y+t,D-P.shelfD,D-2,'carc',s.id));
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
  for(let i=0;i<NL;i++){
    const lane=i%2;
    const m=B(0,R.door.w,P.floorGap,R.door.top,R.door.z[lane],R.door.z[lane]+P.doorT,lane?'door1':'door0','PUERTAS',G.doors,'door');
    LD.push({m,w:R.door.w,x:R.presets[currentPreset][i],tx:R.presets[currentPreset][i]});
  }
  for(let k=0;k<R.tdoor.n;k++){
    const lane=k%2;
    const m=B(0,R.tdoor.w,R.tdoor.y0,R.tdoor.y1,R.door.z[lane],R.door.z[lane]+P.doorT,lane?'door1':'door0','PUERTAS',G.doors,'door');
    TD.push({m,w:R.tdoor.w,x:R.tpresets[currentTop][k],tx:R.tpresets[currentTop][k]});
  }
  B(0,W,R.door.top,R.door.top+R.track.h,R.track.z0,R.track.z1,'metal','RIEL',G.track);
  B(0,W,H-R.track.h,H,R.track.z0,R.track.z1,'metal','RIEL',G.track);
  for(let k=0,n=Math.ceil(W/SHEET[0]);k<n;k++){const x0=k*W/n,x1=(k+1)*W/n;
  B(x0,x1,R.door.top,R.door.top+P.kit,R.cenefaZ0,R.cenefaZ0+t,'carc','RIEL',G.track);
  B(x0,x1,H-P.kit,H,R.cenefaZ0,R.cenefaZ0+t,'carc','RIEL',G.track);}



const motion=window.EspaciosClosetMotion({P,R,LD,TD,drawerGroups,S});
const setOpen=t=>motion.setOpen(t);
return {root,all,setOpen,motion,dimensions:{w:288,d:51.2,h:240},parameters:P,calculation:R};
};
