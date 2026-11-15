/* Ficha dimensional compartida por los dos visores. Todas las cotas están en mm. */
(() => {
  const wallEnd = 7500;
  const windowX = 9560;
  const windowDepth = window.CortasolPinoData.marco.A;
  const span = windowX - windowDepth / 2 - wallEnd;
  const post = 72, jamb = 36, layer = 18, thickness = 2 * layer;
  const opening = span - post - jamb;
  const sideGap = 5, joint = 3, leaves = 4;
  const width = Math.floor((opening - 2 * sideGap - 3 * joint) / leaves);
  const edgeGap = (opening - leaves * width - 3 * joint) / 2;
  const head = 2400, header = 100, floorGap = 10, height = 2330;
  const stile = 70, railDepth = span - post - jamb;
  const rails = [[0,130],[950,1050],[height-100,height]];
  const panels = [[130,950],[1050,height-100]];
  const slats = 5, slatWidth = 40, innerWidth = width - 2 * stile;
  const plank = (name, qty, length, width) => ({ name, qty, length, width });
  const leafParts = [
    plank('Montante continuo · capa 1',8,height,stile),
    ...rails.map(([a,b],i)=>plank(['Travesaño inferior corto','Travesaño central corto','Travesaño superior corto'][i],4,innerWidth,b-a)),
    ...rails.map(([a,b],i)=>plank(['Travesaño inferior continuo','Travesaño central continuo','Travesaño superior continuo'][i],4,width,b-a)),
    ...panels.map(([a,b],i)=>plank('Montante interrumpido · hueco '+(i+1),8,b-a,stile)),
    ...panels.map(([a,b],i)=>plank('Tablilla · hueco '+(i+1),4*slats,b-a,slatWidth))
  ];
  const frameParts = [
    plank('Parante (72 × 72)',4,head,post),
    plank('Jamba contra ladrillo (36 × 70)',2,head,70),
    plank('Dintel (72 × 100)',4,span,header)
  ];
  const area = rows => rows.reduce((n,p)=>n+p.qty*p.length*p.width,0)/1e6;
  const leafArea=area(leafParts), frameArea=area(frameParts);
  const airArea=leaves*(innerWidth-slats*slatWidth)*panels.reduce((n,[a,b])=>n+b-a,0)/1e6;

  // La bisagra cambia de cara en cada unión. Los ejes pares permanecen
  // en la línea del riel y la separación de 3 mm se aplica a lo largo de cada hoja.
  function pose(open) {
    const angle = Math.max(0, Math.min(1, open)) * 86 * Math.PI/180;
    const c = Math.cos(angle), s = Math.sin(angle);
    const halfT = thickness / 2;
    let x = span - post - edgeGap + joint/2;
    let z = -halfT;
    return Array.from({length:leaves}, (_,i) => {
      const sign = i%2 ? 1 : -1;
      const ux=-c, uz=sign*s, nx=-uz, nz=ux;
      const incoming=-sign*halfT, outgoing=-incoming;
      const cx=x + ux*(width+joint)/2 - nx*incoming;
      const cz=z + uz*(width+joint)/2 - nz*incoming;
      x += ux*(width+joint)+nx*(outgoing-incoming);
      z += uz*(width+joint)+nz*(outgoing-incoming);
      return { x:cx, z:cz, rotation:Math.atan2(-uz,ux), hinge:[x,z], extentX:(width*c+thickness*s)/2, extentZ:(width*s+thickness*c)/2 };
    });
  }
  function access(open) {
    const items=pose(open);
    return {
      passage:Math.max(0,Math.min(...items.map(p=>p.x-p.extentX))-jamb),
      intoKitchen:Math.max(0,...items.map(p=>p.extentZ-p.z)),
      outside:Math.max(0,...items.map(p=>p.z+p.extentZ))
    };
  }
  window.PuertaPlegableData={wallEnd,windowX,span,post,jamb,layer,thickness,opening,leaves,width,edgeGap,joint,head,header,floorGap,height,stile,rails,panels,slats,slatWidth,innerWidth,railDepth,leafParts,frameParts,leafArea,frameArea,airArea,pose,access};
})();
