/* Cortasol de tablillas orientables, todo en pino, ajustado a la obra real: antepecho de ladrillo de 10 cm, marco de 140 mm de fondo
   en todo el perímetro con esquinas traslapadas por capas y pestañas que bajan por las dos caras del muro; tablillas de 100 mm por
   dentro del marco. Apoyado en el antepecho, arriba atornillado al riel metálico del cielo raso de panel yeso (que no carga); el lateral
   izquierdo atornillado a la medianera y el derecho libre. Fuente única para el visor (assets/propuesta-lamas-pino.js), la terraza
   (assets/app.js) y herramientas/build_cortasol_pino.py. Medidas terminadas en mm. Ángulo: 90° = tablilla perpendicular al muro;
   40° y 140° = topes de la barra. z > 0 = lado cocina, z < 0 = lado patio; x > 0 = derecha vista desde la cocina. */
window.CortasolPinoData={
 "name": "Cortasol de tablillas de pino orientables",
 "status": "Propuesta en estudio (4 de noviembre de 2026): todo en pino, sobre un antepecho de ladrillo de 10 cm. Marco de 140 mm de fondo en todo el perímetro, con esquinas traslapadas por capas y pestañas que bajan 60 mm por las dos caras del antepecho; tablillas de 100 mm por dentro del marco. Apoyado en el antepecho, atornillado arriba al riel del cielo raso y a la medianera; extremo derecho libre. Pines con resorte en las dos puntas y una barra de aluminio arriba, sin perillas",
 "vano": {
  "L": 3000,
  "H": 1300,
  "nota": "Medida exterior del ventanal: 3000 de largo, desde la medianera hasta el extremo libre, y 1300 de alto, desde el antepecho de ladrillo (+120) hasta el cielo raso (+250). Medir el vano real en tres puntos antes de cortar."
 },
 "acabado": {
  "nota": "Marco y tablillas del mismo lote de pino, lijados igual y barnizados en la misma tanda: así el tono queda parejo y envejece igual. Acabado elegido: laca Montó Pur+Cat incoloro mate (interior/exterior, catalizada, tono miel); primera mano rebajada como sellador y dos manos normales. Sin sellador de nitrocelulosa debajo."
 },
 "lama": {
  "A": 100,
  "t": 18,
  "n": 30,
  "holgura": 3,
  "tolerancia": 4,
  "material": "Pino alistonado (finger joint) de 18 mm, barnizado por las seis caras",
  "densidad": 500,
  "nota": "100 mm de ancho, igual que el muro: al girar ocupa un círculo de 102 mm y queda siempre por dentro del marco de 140. 18 mm de grueso dejan unos 5 mm de madera a cada lado del cuerpo del pin. 3 mm libres en cada punta: la pestaña del pin más el juego (ajustar al medir los pines). Densidad típica del pino seco, 450 a 550 kg/m³."
 },
 "angulo": {
  "min": 40,
  "max": 140,
  "inicial": 45,
  "nota": "Los extremos de la barra chocan con los tacos de tope del canal: a 40° y 140° las tablillas de los extremos quedan a unos 5 mm del lateral y el paso de aire no baja del 46 %; sin topes se cerrarían hasta tocarse cerca de 10°."
 },
 "marco": {
  "capa": 18,
  "t": 36,
  "A": 140,
  "tramo": 1000,
  "paneles": 3,
  "material": "Pino alistonado de 18 mm, el mismo de las tablillas",
  "juntas": {
   "entera": [
    1000,
    1000,
    1000
   ],
   "trabada": [
    500,
    1000,
    1000,
    500
   ]
  },
  "nota": "Marco en dos capas de pino de 18 mm pegadas y prensadas, de 140 mm de fondo en todo el perímetro (rieles y laterales iguales): 100 del ladrillo, 18 de pestaña por cada cara y 2 mm de vuelo sobre cada pestaña, que hacen de gotero y absorben las diferencias del muro. En cada riel, la capa exterior va en 500 + 1000 + 1000 + 500 y la interior en 982 + 1000 + 982, con las juntas trabadas.",
  "pestana": {
   "t": 18,
   "h": 60,
   "tramo": 1000,
   "remate": true,
   "nota": "Pestañas de pino de 18 × 60 mm a lo largo de las dos caras del antepecho, pegadas y atornilladas por debajo de la base del riel inferior (los tornillos quedan ocultos bajo la tapa). El riel vuela 2 mm sobre cada pestaña. En el extremo libre, una pestaña de remate de 136 mm tapa la punta del muro y cierra la U. Ajustar los 60 mm para que el borde quede justo encima de una junta de mortero."
  },
  "esquina": {
   "escalon": 18,
   "tarugos": 2,
   "tornillos": 2,
   "nota": "Traslapo por capas, sin rebajes: la capa interior de cada riel (la tapa de abajo y las tiras de arriba) termina 18 mm antes de la punta, y la capa exterior de cada lateral es 36 mm más larga que la interior: entra 18 mm en ese escalón arriba y abajo. Cada esquina se pega en sus tres caras de contacto y lleva dos tarugos de 10 × 40 mm entre la capa exterior del riel y la punta del lateral, más dos tornillos de 4,5 × 70 desde la capa exterior del riel, tapados con tapones de pino. Armar el marco en el banco y escuadrarlo midiendo las diagonales."
  }
 },
 "mecanismo": {
  "manivela": 37,
  "lado": "patio",
  "canal": {
   "z0": -52,
   "z1": -9,
   "nota": "Canal de 43 × 18 mm en la capa interior del riel superior, entre la tira patio (18) y la tira cocina (79): no hay que rutear. Queda boca abajo, encima de las tablillas."
  },
  "barra": {
   "L": 2871,
   "A": 25.4,
   "e": 3.2,
   "agujero": 7,
   "material": "Platina de aluminio de 1 × 1/8 pulg en una sola pieza",
   "nota": "Descansa sobre las tablillas, apoyada en arandelas de nylon. Un agujero de 7 mm por tablilla a paso 97,6, centrado en el ancho. Sus extremos chocan con los tacos de tope: cortar unos milímetros más larga y limar hasta que tope a 40° y 140°."
  },
  "pasador": {
   "d": 6.35,
   "L": 25,
   "dentro": 16,
   "nota": "Varilla inox 304 de 1/4 pulg, pegada con epóxico en la punta superior de la tablilla, a 37 mm del eje hacia el patio. Sobresalen 9 mm: atraviesan la arandela y la barra."
  },
  "tope": {
   "L": 18,
   "nota": "Taco de pino de 18 mm que cierra el canal encima de la capa interior de cada lateral; la capa exterior del lateral, que sube hasta la base del riel, cierra la punta. La barra choca contra el taco en los extremos del giro."
  },
  "pines": {
   "modelo": "uxcell, 24 × 10 mm (0,94 × 0,39 pulg), punta metálica con resorte y cuerpo plástico",
   "abajo": "con resorte",
   "arriba": "con resorte",
   "pestana": 10,
   "largo": 24,
   "punta": 5,
   "ranura": {
    "L": 25,
    "prof": 2
   },
   "nota": "El peso de la tablilla se apoya en la pestaña plástica; el resorte solo mantiene la punta dentro del hueco del riel. Abajo, una ranura de entrada de 2 mm de hondo lleva la punta hasta su hueco al montar. Medir cuerpo y punta de los pines recibidos antes de perforar."
  },
  "anclajes": {
   "antepecho": {
    "n": 6,
    "tornillo": "tornillo 5 × 70 con chazo plástico de 8 mm",
    "nota": "Desde arriba, por el riel inferior, entre tablillas y en el centro del fondo, al ladrillo; cabeza avellanada y tapón de pino. Cordón de sellador entre riel y ladrillo."
   },
   "cielo": {
    "n": 8,
    "tornillo": "tornillo autoperforante punta broca madera-metal #10 × 2 pulg, cabeza avellanada",
    "nota": "Desde abajo, por el riel superior y el panel yeso, al riel metálico del cielo raso, cada 40 cm aproximadamente."
   },
   "medianera": {
    "n": 3,
    "tornillo": "tornillo 5 × 70 con chazo plástico de 8 mm",
    "nota": "Por el lateral izquierdo a la medianera, arriba, al centro y abajo."
   }
  }
 },
 "parts": [
  {
   "id": "T01",
   "name": "Tablilla orientable",
   "qty": 30,
   "L": 1218,
   "A": 100,
   "t": 18,
   "note": "100 mm de ancho. Un pin con resorte al centro de cada punta. Arriba, pasador de 1/4 × 25 a 37 mm del centro hacia el patio, a la mitad del grueso, 16 mm pegado con epóxico. Todas iguales: hacerlas con plantilla."
  },
  {
   "id": "R01",
   "name": "Base del riel inferior · tramo",
   "qty": 2,
   "L": 1000,
   "A": 140,
   "t": 18,
   "note": "Capa de abajo, trabada: 500 + 1000 + 1000 + 500, sobre el ladrillo con un cordón de sellador."
  },
  {
   "id": "R01P",
   "name": "Base del riel inferior · punta",
   "qty": 2,
   "L": 500,
   "A": 140,
   "t": 18,
   "note": "Las dos puntas de la capa trabada."
  },
  {
   "id": "R02",
   "name": "Tapa del riel inferior · tramo central",
   "qty": 1,
   "L": 1000,
   "A": 140,
   "t": 18,
   "note": "Capa interior, en 982 + 1000 + 982, sin canal. Lleva los huecos de las puntas de los pines a paso 97,6, cada uno con su ranura de entrada de 25 × 2 mm hacia la cocina, y los tornillos al antepecho entre tablillas."
  },
  {
   "id": "R02E",
   "name": "Tapa del riel inferior · extremo",
   "qty": 2,
   "L": 982,
   "A": 140,
   "t": 18,
   "note": "Termina 18 mm antes de la punta del riel: ese escalón recibe la capa exterior del lateral."
  },
  {
   "id": "R05",
   "name": "Base del riel superior · tramo",
   "qty": 2,
   "L": 1000,
   "A": 140,
   "t": 18,
   "note": "Capa de arriba, trabada, contra el panel yeso del cielo raso; los tornillos atraviesan hasta el riel metálico. Es el techo del canal de la barra."
  },
  {
   "id": "R05P",
   "name": "Base del riel superior · punta",
   "qty": 2,
   "L": 500,
   "A": 140,
   "t": 18,
   "note": "Las dos puntas de la capa trabada."
  },
  {
   "id": "R06",
   "name": "Tira cocina del riel superior · tramo central",
   "qty": 1,
   "L": 1000,
   "A": 79,
   "t": 18,
   "note": "Capa interior, de z −9 a z 70, del lado cocina. Un borde forma el canal. Lleva los huecos de las puntas de los pines de arriba, alineados con los de abajo."
  },
  {
   "id": "R06E",
   "name": "Tira cocina del riel superior · extremo",
   "qty": 2,
   "L": 982,
   "A": 79,
   "t": 18,
   "note": "Termina 18 mm antes de la punta: escalón para la capa exterior del lateral."
  },
  {
   "id": "R08",
   "name": "Tira patio del riel superior · tramo central",
   "qty": 1,
   "L": 1000,
   "A": 18,
   "t": 18,
   "note": "Capa interior, de z −70 a z −52: cierra el canal del lado patio. Tira cuadrada de 18 × 18."
  },
  {
   "id": "R08E",
   "name": "Tira patio del riel superior · extremo",
   "qty": 2,
   "L": 982,
   "A": 18,
   "t": 18,
   "note": "Termina 18 mm antes de la punta, como la tira cocina."
  },
  {
   "id": "R09",
   "name": "Taco de tope",
   "qty": 2,
   "L": 43,
   "A": 18,
   "t": 18,
   "note": "Cierra el canal encima de la capa interior de cada lateral. Pegado y atornillado: la barra choca aquí a 40° y 140°."
  },
  {
   "id": "R07",
   "name": "Lateral · capa interior",
   "qty": 2,
   "L": 1224,
   "A": 140,
   "t": 18,
   "note": "Entre las tapas de los rieles. Lateral izquierdo: atornillado a la medianera. Lateral derecho: libre, a la vista por tres caras."
  },
  {
   "id": "R07E",
   "name": "Lateral · capa exterior",
   "qty": 2,
   "L": 1260,
   "A": 140,
   "t": 18,
   "note": "36 mm más larga que la interior: entra 18 mm arriba y 18 abajo en el escalón de los rieles y forma el traslapo de la esquina. Es la cara que va contra la medianera o la que queda a la vista en el extremo libre."
  },
  {
   "id": "R10",
   "name": "Pestaña del antepecho",
   "qty": 6,
   "L": 1000,
   "A": 60,
   "t": 18,
   "note": "Tres por cara (cocina y patio), con las juntas alineadas con las de la tapa del riel. Pegada y atornillada por debajo de la base del riel inferior, contra la cara del ladrillo. Sellar la junta con el muro."
  },
  {
   "id": "R11",
   "name": "Pestaña de remate del extremo libre",
   "qty": 1,
   "L": 136,
   "A": 60,
   "t": 18,
   "note": "Tapa la punta del antepecho en el extremo libre (100 de muro + 18 + 18 de pestañas) y cierra la U con las dos pestañas."
  },
  {
   "id": "B01",
   "name": "Barra del mecanismo",
   "material": "aluminio",
   "qty": 1,
   "L": 2871,
   "A": 25.4,
   "t": 3.2,
   "note": "Platina de aluminio 1 × 1/8 pulg de una barra de 6 m. 30 agujeros de 7 mm a paso 97,6, centrados en el ancho; el primero a 20,5 mm de la punta. Limar las puntas hasta que tope a 40° y 140°."
  }
 ],
 "obra": {
  "antepecho": {
   "t": 100,
   "alto": 1200,
   "material": "Ladrillo a la vista",
   "nota": "Muro de ladrillo de 10 cm. El marco, de 140, cubre el muro y las dos pestañas y vuela 2 mm sobre ellas; las pestañas bajan 60 mm por el ladrillo y tapan el borde superior y la junta madera–ladrillo. Todo el peso se apoya en el muro."
  },
  "cielo": {
   "panel": 12.7,
   "riel": {
    "A": 64,
    "h": 25
   },
   "nota": "Cielo raso de panel yeso atornillado a perfiles metálicos. No carga la ventana: el riel solo la sostiene de lado. El riel debe quedar justo sobre la ventana y bien amarrado a la estructura."
  },
  "medianera": {
   "t": 120,
   "lado": "izquierdo visto desde la cocina",
   "nota": "Muro de ladrillo de 2,50 m. El lateral de ese lado se atornilla a ella."
  },
  "libre": {
   "lado": "derecho visto desde la cocina",
   "nota": "Sin muro ni columna: el lateral queda a la vista por tres caras y se sostiene por las esquinas del marco."
  }
 }
};
