/* Manifiesto del mueble de la pecera. Generado por herramientas/build_despiece_pecera.py */
window.PeceraData = {
 "name": "Mueble de la pecera PY-800",
 "fecha": "26/11/2026",
 "material": "RH15 Cartagena; canto rígido 2 mm en puertas y flexible 0,45 mm en el resto",
 "exterior": {
  "L": 820,
  "P": 380,
  "H": 700
 },
 "pecera": {
  "L": 785,
  "P": 340,
  "A": 540
 },
 "parts": [
  {
   "id": "R1",
   "module": "Mueble pecera",
   "name": "Tapa",
   "qty": 1,
   "L": 820,
   "A": 380,
   "edges": [
    "0.45",
    "0.45",
    "0.45",
    "0.45"
   ],
   "material": "RH15",
   "note": "Se fija desde abajo con escuadras: ningún tornillo en la cara donde apoya la pecera."
  },
  {
   "id": "R2",
   "module": "Mueble pecera",
   "name": "Lateral",
   "qty": 2,
   "L": 675,
   "A": 380,
   "edges": [
    "0.45",
    "0.45",
    "0.45",
    "—"
   ],
   "material": "RH15",
   "note": "Veta vertical. L1 = frente, L2 = atrás, A1 = abajo; arriba queda bajo la tapa."
  },
  {
   "id": "R3",
   "module": "Mueble pecera",
   "name": "Espaldar estructural",
   "qty": 1,
   "L": 675,
   "A": 790,
   "edges": [
    "—",
    "—",
    "—",
    "—"
   ],
   "material": "RH15",
   "note": "Entre laterales. Cola y tornillo cada 15 cm: impide que el mueble se ladee. Dos pasacables Ø60 en el armado."
  },
  {
   "id": "R4",
   "module": "Mueble pecera",
   "name": "Piso interior",
   "qty": 1,
   "L": 790,
   "A": 350,
   "edges": [
    "0.45",
    "—",
    "—",
    "—"
   ],
   "material": "RH15",
   "note": "Seis destajes con ruteadora en el armado: 4 en las esquinas de 51 × 51 y 2 al centro (frente y fondo) de 52 × 51, para patas y parales. L1 = canto frontal."
  },
  {
   "id": "R5",
   "module": "Mueble pecera",
   "name": "Puerta",
   "qty": 2,
   "L": 505,
   "A": 306,
   "edges": [
    "2",
    "2",
    "2",
    "2"
   ],
   "material": "RH15",
   "note": "Veta vertical. 2 cazoletas Ø35 a 21,5 mm (centro) del canto."
  },
  {
   "id": "R6",
   "module": "Mueble pecera",
   "name": "Faja superior",
   "qty": 1,
   "L": 790,
   "A": 70,
   "edges": [
    "0.45",
    "—",
    "—",
    "—"
   ],
   "material": "RH15",
   "note": "Tapa los largueros P1; L1 = canto inferior, techo de la gola."
  },
  {
   "id": "R7",
   "module": "Mueble pecera",
   "name": "Zócalo",
   "qty": 1,
   "L": 790,
   "A": 70,
   "edges": [
    "0.45",
    "0.45",
    "—",
    "—"
   ],
   "material": "RH15",
   "note": "Tapa el bastidor inferior y los niveladores. L1 = arriba, L2 = abajo."
  },
  {
   "id": "R8",
   "module": "Mueble pecera",
   "name": "Pilastra (frente fijo)",
   "qty": 2,
   "L": 535,
   "A": 50,
   "edges": [
    "0.45",
    "—",
    "—",
    "—"
   ],
   "material": "RH15",
   "note": "Pedida a 70 mm (final 50): el optimizador de Madecentro no admite piezas de menos de 70 mm, y como lleva canto conviene pedirla cortada y canteada en fábrica. Canto de fábrica en L1, el borde hacia la puerta; en el armado, rebajar a 50 por L2, que va sin canto contra el lateral."
  },
  {
   "id": "R10",
   "module": "Mueble pecera",
   "name": "Pilastra central",
   "qty": 1,
   "L": 535,
   "A": 70,
   "edges": [
    "0.45",
    "0.45",
    "—",
    "—"
   ],
   "material": "RH15",
   "note": "Pegada al frente del paral central; separa las dos puertas y las dos golas."
  },
  {
   "id": "R9",
   "module": "Mueble pecera",
   "name": "Fondo de gola",
   "qty": 2,
   "L": 320,
   "A": 70,
   "edges": [
    "—",
    "—",
    "—",
    "—"
   ],
   "material": "RH15",
   "note": "Retranqueado 30 mm detrás de la puerta. Baja detrás de la puerta y no se ve; sellar los bordes sin canto."
  }
 ],
 "pino": [
  {
   "id": "P1",
   "name": "Larguero bastidor superior",
   "qty": 2,
   "L": 790,
   "seccion": "50 × 50"
  },
  {
   "id": "P2",
   "name": "Testero / travesaño bastidor superior",
   "qty": 5,
   "L": 250,
   "seccion": "50 × 50"
  },
  {
   "id": "P3",
   "name": "Pata / paral",
   "qty": 6,
   "L": 565,
   "seccion": "50 × 50"
  },
  {
   "id": "P4",
   "name": "Larguero bastidor inferior",
   "qty": 2,
   "L": 790,
   "seccion": "50 × 50"
  },
  {
   "id": "P5",
   "name": "Travesaño bastidor inferior",
   "qty": 3,
   "L": 250,
   "seccion": "50 × 50"
  }
 ],
 "nota": "Medidas de pecera.html con sus valores por defecto. El pino 50 × 50 va en el pedido a la carpintería."
};
