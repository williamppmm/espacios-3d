/* Ambientación del cielo raso. La sección y la distribución son provisionales hasta validar el sistema en obra. */
window.crearCieloPanelYeso = function (T) {
  const C = window.CortasolPinoData.cielo, P = C.panel;
  const root = new T.Group(), metal = new T.MeshStandardMaterial({color:0xa7b0b8,metalness:.65,roughness:.4});
  const white = new T.MeshStandardMaterial({color:0xf5f4ee,roughness:.92,side:T.DoubleSide});
  const mm = value => value / 1000;
  function box(w,h,d,x,y,z,material=metal) {
    const mesh = new T.Mesh(new T.BoxGeometry(mm(w),mm(h),mm(d)),material);
    mesh.position.set(mm(x),mm(y),mm(z)); root.add(mesh); return mesh;
  }
  const panel = box(P.x,P.e,P.z,P.x/2,C.nivel+P.e/2,P.z/2,white);
  panel.name = 'placa-panel-yeso';
  const oy = C.nivel+P.e, v = C.vigueta, o = C.omega, gauge = .5;
  // Omegas longitudinales con alas de apoyo, almas y cara de fijación de la placa.
  for(let i=0;i<o.n;i++) {
    const x=30+i*(P.x-60)/(o.n-1), z=P.z/2;
    box(26,gauge,P.z,x,oy+gauge/2,z);
    for(const side of [-1,1]) {
      box(gauge,o.h,P.z,x+side*13,oy+o.h/2,z);
      box(16,gauge,P.z,x+side*21,oy+o.h-gauge/2,z);
    }
  }
  // Viguetas transversales tipo C sobre las omegas.
  for(let i=0;i<v.n;i++) {
    const z=20+i*(P.z-40)/(v.n-1), y=oy+o.h;
    box(P.x,v.h,gauge,P.x/2,y+v.h/2,z);
    box(P.x,gauge,v.t,P.x/2,y+gauge/2,z+v.t/2);
    box(P.x,gauge,v.t,P.x/2,y+v.h-gauge/2,z+v.t/2);
  }
  // Ángulos perimetrales en los encuentros con muros y carpintería.
  const a=C.perimetral.h;
  for(const x of [0,P.x]) {
    const side=x===0?1:-1;
    box(gauge,a,P.z,x,oy+a/2,P.z/2);
    box(a,gauge,P.z,x+side*a/2,oy+gauge/2,P.z/2);
  }
  for(const z of [0,P.z]) {
    const side=z===0?1:-1;
    box(P.x,a,gauge,P.x/2,oy+a/2,z);
    box(P.x,gauge,a,P.x/2,oy+gauge/2,z+side*a/2);
  }
  function inspect(enabled) {
    white.transparent=enabled; white.opacity=enabled?.16:1;
    white.depthWrite=!enabled; white.needsUpdate=true;
  }
  return {root,inspect};
};
