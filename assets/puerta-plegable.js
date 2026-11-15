(() => {
  const T = window.THREE, d = window.PuertaPlegableData;
  const $ = id => document.getElementById(id);
  const format = (n,digits=0) => n.toLocaleString('es-CO',{maximumFractionDigits:digits});
  const mm = n => format(n,1)+' mm';
  const facts = [
    ['Vano nominal entre jambas',mm(d.opening)],
    ['Cada hoja',d.width+' × '+d.height+' × '+d.thickness+' mm'],
    ['Altura bajo dintel',mm(d.head)]
  ];
  for (const [label,value] of facts) {
    const node=document.createElement('span'), strong=document.createElement('b');
    strong.textContent=value;
    node.append(strong,label);
    $('dimensions').append(node);
  }
  $('sizing').textContent='Abertura de obra '+mm(d.span)+' menos parante '+mm(d.post)+' y jamba '+mm(d.jamb)+'. Entre hojas quedan '+mm(d.joint)+' y en cada extremo '+mm(d.edgeGap)+'. Bajo la hoja se dejan '+mm(d.floorGap)+' y arriba '+mm(d.head-d.height-d.floorGap)+' provisionales para el sistema.';
  for(const part of [...d.frameParts,...d.leafParts]){
    const row=$('cut-list').insertRow();
    for(const value of [part.name,part.qty,format(part.length)+' × '+format(part.width)])row.insertCell().textContent=value;
  }
  const weightPerLeaf=d.leafArea*.018*500/d.leaves;
  $('material').textContent='Pino neto: '+format(d.leafArea+d.frameArea,2)+' m² en tablero de 18 mm, antes del disco, refilado y desperdicio. Masa estimada de madera: '+format(weightPerLeaf,1)+' kg por hoja y '+format(weightPerLeaf*d.leaves,1)+' kg entre las cuatro, a 500 kg/m³. Vano geométrico entre tablillas: '+format(d.airArea,2)+' m².';
  const stage=$('stage');
  const scene=new T.Scene();
  scene.background=new T.Color(0xe6ece6);
  scene.add(new T.HemisphereLight(0xfffcf2,0xa1a79b,.95));
  const sun=new T.DirectionalLight(0xfff0d8,.75);
  sun.position.set(-3,6,4);scene.add(sun);
  const model=window.crearPuertaPlegable(T);
  scene.add(model.root);
  const floor=new T.Mesh(new T.PlaneGeometry(10,8),new T.MeshStandardMaterial({color:0xe1ddd1}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-.002;scene.add(floor);
  let renderer;
  try {renderer=new T.WebGLRenderer({antialias:true});}
  catch {stage.textContent='El navegador no pudo iniciar el visor 3D. El despiece está disponible abajo.';}
  const camera=new T.PerspectiveCamera(45,1,.02,40);
  let controls;
  if(renderer){
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.outputEncoding=T.sRGBEncoding;
    stage.append(renderer.domElement);
    controls=new T.OrbitControls(camera,renderer.domElement);
    controls.enableDamping=true;
    function resize(){renderer.setSize(stage.clientWidth,stage.clientHeight,false);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();}
    new ResizeObserver(resize).observe(stage);
    const draw=()=>{controls.update();renderer.render(scene,camera);requestAnimationFrame(draw);};
    draw();
  }
  function view(top){
    if(!controls)return;
    const x=d.span/2000;
    camera.position.set(x+(top?0:1.65),top?5.6:1.7,top?.01:4.1);
    controls.target.set(x,top?0:1.2,-.1);
    controls.update();
  }
  function set(value){
    const open=value/100, access=d.access(open);
    $('opening').value=value;
    $('percent').textContent=value+' %';
    $('passage').textContent=value===0?'Cerrada':mm(access.passage);
    $('projection').textContent=mm(access.intoKitchen);
    model.setOpen(open);
  }
  $('opening').oninput=e=>set(Number(e.currentTarget.value));
  $('closed').onclick=()=>set(0);$('opened').onclick=()=>set(100);
  $('perspective').onclick=()=>view(false);$('plan').onclick=()=>view(true);
  view(false);set(100);
})();
