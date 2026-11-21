/* Ficha dimensional de la puerta plegable, derivada de CortasolPinoData.puerta (medidas de obra del 21/11/2026). Cotas en mm.
   x va del muro de la habitación (0) hacia el ventanal; la cara del marco del ventanal queda en `span`. −z = cocina. */
(() => {
  const D = window.CortasolPinoData, P = D.puerta, H = P.hojas, S = P.sobreluz, C = D.cielo;
  const wallEnd = 7500, windowX = 9460;            // posición en la terraza: muro de la habitación y eje del antepecho
  const span = P.cara, post = P.poste.t, jamb = P.jamba.t, depth = P.poste.A;
  const layer = H.capa, thickness = H.t, opening = P.vano, leaves = H.n, width = H.A, edgeGap = H.borde, joint = H.junta;
  const head = P.alto, header = P.dintel.h, floorGap = H.piso, height = H.h, ceiling = C.nivel;
  const stile = H.montante, rails = H.travesanos, panels = H.huecos, slats = H.tablillas.n, slatWidth = H.tablillas.A;
  const innerWidth = width - 2 * stile, railDepth = opening;
  const parts = D.parts.filter(p => p.grupo === 'Puerta');
  const tablero = parts.filter(p => p.material === 'tablero'), macizo = parts.filter(p => p.material === 'macizo');
  const area = rows => rows.reduce((n, p) => n + p.qty * p.L * p.A, 0) / 1e6;
  const leafParts = tablero.filter(p => p.id.startsWith('H')), transomParts = tablero.filter(p => p.id.startsWith('S'));
  const leafArea = area(leafParts), frameArea = area(macizo);
  const airArea = leaves * (innerWidth - slats * slatWidth) * panels.reduce((n, [a, b]) => n + b - a, 0) / 1e6;
  const transomAir = (S.tablilla.n + 1) * S.luz * S.tablilla.L / 1e6;

  // La bisagra cambia de cara en cada unión. Los ejes pares permanecen en la línea del riel
  // y la separación entre hojas se aplica a lo largo de cada hoja.
  function pose(open) {
    const angle = Math.max(0, Math.min(1, open)) * 86 * Math.PI / 180;
    const c = Math.cos(angle), s = Math.sin(angle);
    const halfT = thickness / 2;
    let x = span - post - edgeGap + joint / 2;
    let z = -halfT;
    return Array.from({length: leaves}, (_, i) => {
      const sign = i % 2 ? 1 : -1;
      const ux = -c, uz = sign * s, nx = -uz, nz = ux;
      const incoming = -sign * halfT, outgoing = -incoming;
      const cx = x + ux * (width + joint) / 2 - nx * incoming;
      const cz = z + uz * (width + joint) / 2 - nz * incoming;
      x += ux * (width + joint) + nx * (outgoing - incoming);
      z += uz * (width + joint) + nz * (outgoing - incoming);
      return {x: cx, z: cz, rotation: Math.atan2(-uz, ux), hinge: [x, z], extentX: (width * c + thickness * s) / 2, extentZ: (width * s + thickness * c) / 2};
    });
  }
  function access(open) {
    const items = pose(open);
    return {
      passage: Math.max(0, Math.min(...items.map(p => p.x - p.extentX)) - jamb),
      intoKitchen: Math.max(0, ...items.map(p => p.extentZ - p.z)),
      outside: Math.max(0, ...items.map(p => p.z + p.extentZ))
    };
  }
  window.PuertaPlegableData = {wallEnd, windowX, span, post, jamb, depth, layer, thickness, opening, leaves, width, edgeGap, joint, head, header,
    floorGap, height, ceiling, stile, rails, panels, slats, slatWidth, innerWidth, railDepth, transom: S, parts, leafParts, transomParts,
    frameParts: macizo, leafArea, frameArea, airArea, transomAir, pose, access};
})();
