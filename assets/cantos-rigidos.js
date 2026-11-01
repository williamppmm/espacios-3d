/* Resalta en un color las caras con canto rígido (2 mm) de un modelo, solo para visualizarlas. No cambia el despiece.
   Funciona con cajas y con piezas extruidas (las puertas con corte diagonal del baño): pinta los cantos rectos según el
   despiece y deja sin pintar las caras grandes y las caras inclinadas (la diagonal va con flexible a mano). */
window.EspaciosCantos=function(T,root,partOf){'use strict';
const COLOR=0x14a5d0,items=[];let on=false;
root.traverse(m=>{if(!m.isMesh||!m.geometry)return;const p=partOf(m);if(p&&Array.isArray(p.edges)&&p.edges.includes('2'))items.push([m,p]);});
// Cantos L1/L2 (lados largos) son caras perpendiculares al eje del ancho A; A1/A2 (lados cortos), perpendiculares al eje L.
// Si de un par solo uno es rígido, se pinta el visible por convención: abajo en Y, al frente en Z, a la izquierda en X.
function build(m,p){const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();g.clearGroups();g.computeBoundingBox();
 const s=new T.Vector3();g.boundingBox.getSize(s);const dims=[s.x,s.y,s.z],th=dims.indexOf(Math.min(...dims)),rest=[0,1,2].filter(i=>i!==th),L=p.L/1000;
 const li=Math.abs(dims[rest[0]]-L)<=Math.abs(dims[rest[1]]-L)?rest[0]:rest[1],ai=rest.find(i=>i!==li),e=p.edges.map(x=>x==='2');
 const rigid=(axis,sign)=>{const [a,b]=axis===ai?[e[0],e[1]]:[e[2],e[3]];if(a&&b)return true;if(!a&&!b)return false;return sign===(axis===2?1:-1);};
 const pos=g.getAttribute('position'),n=pos.count/3,v=[new T.Vector3(),new T.Vector3(),new T.Vector3()],nv=new T.Vector3(),d1=new T.Vector3(),d2=new T.Vector3();
 let cur=-1,start=0;
 for(let t=0;t<n;t++){for(let k=0;k<3;k++)v[k].fromBufferAttribute(pos,t*3+k);d1.subVectors(v[1],v[0]);d2.subVectors(v[2],v[0]);nv.crossVectors(d1,d2).normalize();
  const c=[Math.abs(nv.x),Math.abs(nv.y),Math.abs(nv.z)],ax=c.indexOf(Math.max(...c));let idx=0;
  if(ax!==th&&c[ax]>.99&&rigid(ax,Math.sign([nv.x,nv.y,nv.z][ax])))idx=1;
  if(idx!==cur){if(cur>=0)g.addGroup(start*3,(t-start)*3,cur);cur=idx;start=t;}}
 if(n)g.addGroup(start*3,(n-start)*3,cur);
 return {g,hl:new T.MeshStandardMaterial({color:COLOR,emissive:COLOR,emissiveIntensity:.35,roughness:.5})};}
function refresh(){for(const [m] of items){const r=m.userData.rigid;if(!r||m.geometry!==r.g)continue;const base=Array.isArray(m.material)?m.material[0]:m.material;Object.assign(r.hl,{transparent:base.transparent,opacity:base.opacity,depthWrite:base.depthWrite});r.hl.needsUpdate=true;}}
function set(v){on=!!v;for(const [m,p] of items){const u=m.userData;
  if(on){if(!u.rigid)u.rigid=build(m,p);if(m.geometry!==u.rigid.g){u.rigid.orig=m.geometry;m.geometry=u.rigid.g;m.material=[Array.isArray(m.material)?m.material[0]:m.material,u.rigid.hl];}}
  else if(u.rigid&&m.geometry===u.rigid.g){m.geometry=u.rigid.orig;m.material=Array.isArray(m.material)?m.material[0]:m.material;}}
 refresh();return on;}
return {set,toggle:()=>set(!on),refresh,get on(){return on;},count:items.length};
};
