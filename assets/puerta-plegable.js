/* Visor de la puerta plegable con su entorno real: ventanal de pino, antepecho, medianera, muro de la habitación y cielo raso de panel de yeso. */
(() => {
  const T = window.THREE, d = window.PuertaPlegableData, D = window.CortasolPinoData;
  const $ = id => document.getElementById(id);
  const format = (n,digits=0) => n.toLocaleString('es-CO',{maximumFractionDigits:digits});
  const mm = n => format(n,1)+' mm';
  const facts = [
    ['Vano, del muro al filo del ladrillo',format(D.puerta.ancho)+' × '+format(d.head)+' mm'],
    ['Cada hoja',d.width+' × '+d.height+' × '+d.thickness+' mm'],
    ['Sobreluz hasta el cielo raso',d.transom.tablilla.n+' tablillas · '+format(d.ceiling-d.head-d.header)+' mm']
  ];
  for (const [label,value] of facts) {
    const node=document.createElement('span'), strong=document.createElement('b');
    strong.textContent=value;
    node.append(strong,label);
    $('dimensions').append(node);
  }
  $('sizing').textContent='Del muro de la habitación al filo del ladrillo hay '+mm(D.puerta.ancho)+'. Se descuentan '+mm(D.puerta.ancho-d.span)+' del vuelo y la pestaña del ventanal, '+mm(d.post)+' del poste de esquina y '+mm(d.jamb)+' del paral contra el muro: quedan '+mm(d.opening)+' para las cuatro hojas, con '+mm(d.joint)+' entre hojas y '+mm(d.edgeGap)+' en cada extremo. El dintel va con su cara inferior a '+mm(d.head)+', como la puerta metálica; bajo la hoja quedan '+mm(d.floorGap)+' y arriba '+mm(d.head-d.height-d.floorGap)+' para el riel y los carros.';
  const MAT={macizo:'Pino macizo 40 mm',tablero:'Pino alistonado 18 mm'};
  for(const part of D.parts.filter(p=>p.grupo==='Puerta')){
    const row=$('cut-list').insertRow();
    for(const value of [part.grupo,part.name,MAT[part.material]||part.material,part.qty,format(part.L)+' × '+format(part.A)+' × '+format(part.t)])row.insertCell().textContent=value;
  }
  const weightPerLeaf=d.leafArea*.018*500/d.leaves;
  $('material').textContent='Hojas en dos capas de pino alistonado de 18 mm: unos '+format(weightPerLeaf,1)+' kg de madera por hoja y '+format(weightPerLeaf*d.leaves,1)+' kg entre las cuatro, a 500 kg/m³ (antes de herrajes). Paso de aire entre las tablillas de las hojas: '+format(d.airArea,2)+' m²; la sobreluz deja '+format(d.transomAir,2)+' m² de paso permanente. Cielo raso: '+format(D.cielo.panel.m2,1)+' m² de panel de yeso blanco, con omegas y viguetas galvanizadas. Perfilería de referencia por validar en obra.';

  // --- Escena
  const stage=$('stage');
  const scene=new T.Scene();
  scene.background=new T.Color(0xe6ece6);
  scene.add(new T.HemisphereLight(0xfffcf2,0xa1a79b,.95));
  const sun=new T.DirectionalLight(0xfff0d8,.75);
  sun.position.set(-3,6,4);scene.add(sun);
  const model=window.crearPuertaPlegable(T);
  scene.add(model.root);
  const M=v=>v/1000, mat=(c,o={})=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.8},o));
  const pine=mat(0xc79b60,{roughness:.68}),brick=mat(0xb4553a,{roughness:.95}),grey=mat(0xb9bbb6),slat=mat(0xd3a76a,{roughness:.65});
  function box(parent,w,h,dd,x,y,z,m){const o=new T.Mesh(new T.BoxGeometry(M(w),M(h),M(dd)),m);o.position.set(M(x),M(y),M(z));parent.add(o);return o;}
  // Entorno en las coordenadas de la puerta: el ventanal corre hacia −z desde el plano de la puerta.
  const V=D.vano,F=D.marco,O=D.obra,ext=new T.Group(),ceil=new T.Group();scene.add(ext,ceil);
  const zEnd=D.puerta.plano, zMed=zEnd-V.L, xIn=d.span, xBrick=D.puerta.ancho, A=F.A, Y=O.antepecho.alto, mid=(zEnd+zMed)/2;
  box(ext,O.antepecho.t,Y,V.L,xBrick+O.antepecho.t/2,Y/2,mid,brick);                                   // antepecho
  box(ext,xBrick+O.antepecho.t+40,d.ceiling,O.medianera.t,(xBrick+O.antepecho.t+40)/2,d.ceiling/2,zMed-O.medianera.t/2,brick);   // medianera
  box(ext,120,d.ceiling,V.L,-60,d.ceiling/2,mid,grey);                                                 // muro de la habitación
  const xf=xIn+A/2,y0=Y,y1=Y+F.alto;
  box(ext,A,F.t,V.L,xf,y0+F.t/2,mid,pine);box(ext,A,F.t,V.L,xf,y1-F.t/2,mid,pine);                    // rieles
  for(const z of[zMed+F.t/2,mid,zEnd-F.t/2])box(ext,A,F.alto-2*F.t,F.t,xf,(y0+y1)/2,z,pine);         // laterales y montante
  const P=F.luz/D.lama.por_cuerpo,SL=D.parts.find(p=>p.id==='T01').L;
  for(const c of[-1,1]){const zc=mid+c*(F.luz/2+F.t/2);for(let i=0;i<D.lama.por_cuerpo;i++){const o=box(ext,D.lama.A,SL,D.lama.t,xf,(y0+y1)/2,zc-F.luz/2+P*(i+.5),slat);o.rotation.y=Math.PI/4;}}
  const ceilingPanel=window.crearCieloPanelYeso(T);
  ceilingPanel.root.scale.z=-1;
  ceilingPanel.root.position.set(d.jamb/1000,0,zEnd/1000);
  ceil.add(ceilingPanel.root);
  $('ceiling-structure').onclick=()=>{
    const button=$('ceiling-structure'), active=button.getAttribute('aria-pressed')!=='true';
    ceilingPanel.inspect(active);button.setAttribute('aria-pressed',String(active));
    showCeiling=true;ceilingUI();
  };
  const floor=new T.Mesh(new T.PlaneGeometry(10,8),new T.MeshStandardMaterial({color:0xe1ddd1}));
  floor.rotation.x=-Math.PI/2;floor.position.set(1,-.002,-1.5);scene.add(floor);
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
  let showCeiling=true;
  function ceilingUI(){ceil.visible=showCeiling;$('ceiling').setAttribute('aria-pressed',String(showCeiling));}
  function view(top){
    if(!controls)return;
    const x=d.span/2000;
    if(top){showCeiling=false;ceilingUI();}
    camera.position.set(x+(top?0:1.9),top?6.2:2.1,top?-1.2:4.4);
    controls.target.set(x,top?0:1.3,top?-1.2:-.6);
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
  $('ceiling').onclick=()=>{showCeiling=!showCeiling;ceilingUI();};
  ceilingUI();view(false);set(100);
  window.modelReady=true;
})();
