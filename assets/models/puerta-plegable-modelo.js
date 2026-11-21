/* Modelo de la puerta en metros, con x sobre el vano (0 = muro de la habitación) y −z hacia la cocina.
   Paral contra el muro y poste de esquina, iguales, de piso a cielo; dintel a la altura de la puerta metálica y sobreluz de tablillas fijas hasta el cielo raso. */
window.crearPuertaPlegable = function (T) {
  const d = window.PuertaPlegableData, mm = n => n / 1000;
  const root = new T.Group();
  root.name = 'puerta-plegable';
  const materials = {
    pine: new T.MeshStandardMaterial({color:0xc79b60,roughness:.68}),
    end: new T.MeshStandardMaterial({color:0xb48851,roughness:.72}),
    rail: new T.MeshStandardMaterial({color:0x869297,metalness:.32,roughness:.48}),
    hardware: new T.MeshStandardMaterial({color:0x424847,metalness:.28,roughness:.52})
  };
  function box(parent, w,h,depth,x,y,z,material) {
    const mesh=new T.Mesh(new T.BoxGeometry(mm(w),mm(h),mm(depth)),material);
    mesh.position.set(mm(x),mm(y),mm(z));
    mesh.castShadow=mesh.receiveShadow=true;
    parent.add(mesh);
    return mesh;
  }
  const {pine,end,rail,hardware}=materials, S=d.transom;
  box(root,d.post,d.ceiling,d.depth,d.span-d.post/2,d.ceiling/2,0,end);                       // poste de esquina, dos piezas de 40 × 100
  box(root,d.jamb,d.ceiling,d.depth,d.jamb/2,d.ceiling/2,0,end);                              // paral contra el muro, dos piezas de 40 × 100
  box(root,d.opening,d.header,40,d.jamb+d.opening/2,d.head+d.header/2,0,pine);                // dintel de canto entre los dos parales
  box(root,d.railDepth,24,30,d.jamb+d.railDepth/2,d.head-12,-d.thickness/2,rail);              // riel del plegable
  // Sobreluz: listón sobre el dintel, listón bajo la vigueta del borde y tablillas verticales entre ellos.
  const L=S.liston, yb=d.head+d.header, yt=d.ceiling;
  box(root,d.opening,L.t,L.A,d.jamb+d.opening/2,yb+L.t/2,0,pine);
  box(root,d.opening,L.t,L.A,d.jamb+d.opening/2,yt-L.t/2,0,pine);
  for(let j=0;j<S.tablilla.n;j++){
    const x=d.jamb+S.luz*(j+1)+S.tablilla.A*(j+.5);
    box(root,S.tablilla.A,S.tablilla.L,S.tablilla.t,x,yb+L.t+S.tablilla.L/2,0,pine);
  }
  const leaves=Array.from({length:d.leaves}, (_,i)=>{
    const g=new T.Group();
    g.name='hoja-'+(i+1);
    root.add(g);
    const y0=d.floorGap;
    for(const x of [-1,1]) box(g,d.stile,d.height,d.thickness,x*(d.width-d.stile)/2,y0+d.height/2,0,pine);
    for(const [a,b] of d.rails) box(g,d.innerWidth,b-a,d.thickness,0,y0+(a+b)/2,0,pine);
    for(const [a,b] of d.panels) {
      for(let j=0;j<d.slats;j++){
        const gap=(d.innerWidth-d.slats*d.slatWidth)/(d.slats+1);
        box(g,d.slatWidth,b-a,d.layer,-d.innerWidth/2+gap+(d.slatWidth+gap)*j+d.slatWidth/2,y0+(a+b)/2,0,pine);
      }
    }
    if(i===d.leaves-1) for(const z of [-18,18]) box(g,16,145,1,d.width/2-38,1000,z,hardware);
    return g;
  });
  const joints=Array.from({length:3},()=>[250,1050,1850].map(y=>box(root,10,72,10,0,y,0,hardware)));
  const carts=[0,1].map(()=>box(root,30,35,18,0,d.head-38,-d.thickness/2,rail));
  function setOpen(open) {
    const poses=d.pose(open);
    poses.forEach((p,i)=>{
      leaves[i].position.set(mm(p.x),0,mm(p.z));
      leaves[i].rotation.y=p.rotation;
      if(i<3)for(const mesh of joints[i]){
        mesh.position.x=mm(p.hinge[0]);
        mesh.position.z=mm(p.hinge[1]);
      }
    });
    carts.forEach((mesh,i)=>{mesh.position.x=mm(poses[i*2+1].hinge[0]);});
  }
  setOpen(0);
  return {root,setOpen,leaves};
};
