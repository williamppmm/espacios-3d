/* Cortasol de tablillas orientables, todo en pino, ajustado a la obra real: marco de 156 mm con pestañas que bajan por las dos caras
   del antepecho de ladrillo (12 cm), apoyado en él; arriba atornillado al riel metálico del cielo raso de panel yeso (que no carga); el lateral izquierdo
   atornillado a la medianera y el derecho libre. Fuente única para el visor (assets/propuesta-lamas-pino.js), la terraza
   (assets/app.js) y herramientas/build_cortasol_pino.py. Medidas terminadas en mm. Ángulo: 90° = tablilla perpendicular al muro;
   40° y 140° = topes de la barra. z > 0 = lado cocina, z < 0 = lado patio; x > 0 = derecha vista desde la cocina. */
window.CortasolPinoData={
 "name": "Cortasol de tablillas de pino orientables",
 "status": "Propuesta en estudio (3 de noviembre de 2026): todo en pino, marco de 156 mm con pestañas que bajan 60 mm por las dos caras del antepecho de ladrillo; apoyado en él, atornillado arriba al riel del cielo raso y a la medianera; extremo derecho libre. Pines con resorte en las dos puntas y una barra de aluminio arriba, sin perillas",
 "vano": {
  "L": 3000,
  "H": 1300,
  "nota": "Medida exterior del ventanal: 3000 de largo, desde la medianera hasta el extremo libre, y 1300 de alto, desde el antepecho de ladrillo (+120) hasta el cielo raso (+250). Medir el vano real en tres puntos antes de cortar."
 },
 "acabado": {
  "nota": "Marco y tablillas del mismo lote de pino, lijados igual y barnizados en la misma tanda: así el tono queda parejo y envejece igual. Acabado elegido: laca Montó Pur+Cat incoloro mate (interior/exterior, catalizada, tono miel); primera mano rebajada como sellador y dos manos normales. Sin sellador de nitrocelulosa debajo."
 },
 "lama": {
  "A": 105,
  "t": 18,
  "n": 30,
  "holgura": 3,
  "tolerancia": 4,
  "material": "Pino alistonado (finger joint) de 18 mm, barnizado por las seis caras",
  "densidad": 500,
  "nota": "18 mm de grueso dejan unos 5 mm de madera a cada lado del cuerpo del pin. Al girar, la tablilla ocupa un círculo de 107 mm de diámetro, holgado dentro del marco de 156. 3 mm libres en cada punta: la pestaña del pin más el juego (ajustar al medir los pines). Densidad típica del pino seco, 450 a 550 kg/m³."
 },
 "angulo": {
  "min": 40,
  "max": 140,
  "inicial": 45,
  "nota": "Los extremos de la barra chocan con los tacos de tope del canal: a 40° y 140° las tablillas de los extremos quedan a unos 3 mm del lateral y el paso de aire no baja del 45 %; sin topes se cerrarían hasta tocarse cerca de 10°."
 },
 "marco": {
  "capa": 18,
  "t": 36,
  "A": 156,
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
  "nota": "Marco en dos capas de pino de 18 mm pegadas y prensadas, de 156 mm de fondo: 120 del ladrillo más 18 por cada cara, que es el grueso de las pestañas. En cada riel, una capa va en tres tramos de 1000 y la otra en 500 + 1000 + 1000 + 500, con las juntas trabadas. Los laterales van entre los rieles; cada esquina lleva dos tarugos de 10 mm pegados y dos tornillos de 4,5 × 70 desde el riel, tapados con tapones de pino.",
  "pestana": {
   "t": 18,
   "h": 60,
   "tramo": 1000,
   "remate": true,
   "nota": "Pestañas de pino de 18 × 60 mm a lo largo de las dos caras del antepecho, pegadas y atornilladas por debajo de la base del riel inferior (los tornillos quedan ocultos bajo la tapa). En el extremo libre, una pestaña de remate tapa la punta del muro y cierra la U. Ajustar los 60 mm para que el borde quede justo encima de una junta de mortero."
  }
 },
 "mecanismo": {
  "manivela": 40,
  "lado": "patio",
  "canal": {
   "z0": -56,
   "z1": -10,
   "nota": "Canal de 46 × 18 mm en la capa de abajo del riel superior, entre la tira patio (22) y la tira cocina (88): no hay que rutear. Queda boca abajo, encima de las tablillas."
  },
  "barra": {
   "L": 2867,
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
   "nota": "Varilla inox 304 de 1/4 pulg, pegada con epóxico en la punta superior de la tablilla, a 40 mm del eje hacia el patio. Sobresalen 9 mm: atraviesan la arandela y la barra."
  },
  "tope": {
   "L": 36,
   "nota": "Taco de pino que cierra el canal sobre cada lateral. La barra choca contra él en los extremos del giro."
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
   "A": 105,
   "t": 18,
   "note": "Un pin con resorte al centro de cada punta. Arriba, pasador de 1/4 × 25 a 40 mm del centro hacia el patio, a la mitad del grueso, 16 mm pegado con epóxico. Todas iguales: hacerlas con plantilla."
  },
  {
   "id": "R01",
   "name": "Base del riel inferior · tramo",
   "qty": 2,
   "L": 1000,
   "A": 156,
   "t": 18,
   "note": "Capa de abajo, trabada: 500 + 1000 + 1000 + 500, sobre el ladrillo con un cordón de sellador."
  },
  {
   "id": "R01P",
   "name": "Base del riel inferior · punta",
   "qty": 2,
   "L": 500,
   "A": 156,
   "t": 18,
   "note": "Las dos puntas de la capa trabada."
  },
  {
   "id": "R02",
   "name": "Tapa del riel inferior",
   "qty": 3,
   "L": 1000,
   "A": 156,
   "t": 18,
   "note": "Capa de arriba, en tres tramos, sin canal. Lleva los 30 huecos de las puntas de los pines a paso 97,6, cada uno con su ranura de entrada de 25 × 2 mm hacia la cocina, y los 6 tornillos al antepecho entre tablillas."
  },
  {
   "id": "R05",
   "name": "Base del riel superior · tramo",
   "qty": 2,
   "L": 1000,
   "A": 156,
   "t": 18,
   "note": "Capa de arriba, trabada, contra el panel yeso del cielo raso; los tornillos atraviesan hasta el riel metálico. Es el techo del canal de la barra."
  },
  {
   "id": "R05P",
   "name": "Base del riel superior · punta",
   "qty": 2,
   "L": 500,
   "A": 156,
   "t": 18,
   "note": "Las dos puntas de la capa trabada."
  },
  {
   "id": "R06",
   "name": "Tira cocina del riel superior",
   "qty": 3,
   "L": 1000,
   "A": 88,
   "t": 18,
   "note": "Capa de abajo, de z −10 a z 78, del lado cocina. Un borde forma el canal. Lleva los huecos de las puntas de los pines de arriba, alineados con los de abajo."
  },
  {
   "id": "R08",
   "name": "Tira patio del riel superior",
   "qty": 3,
   "L": 1000,
   "A": 22,
   "t": 18,
   "note": "Capa de abajo, de z −78 a z −56: cierra el canal del lado patio."
  },
  {
   "id": "R09",
   "name": "Taco de tope",
   "qty": 2,
   "L": 46,
   "A": 36,
   "t": 18,
   "note": "Cierra cada punta del canal, encima del lateral. Pegado y atornillado: la barra choca aquí a 40° y 140°."
  },
  {
   "id": "R07",
   "name": "Capa de lateral",
   "qty": 4,
   "L": 1224,
   "A": 156,
   "t": 18,
   "note": "Dos capas por lado, entre los rieles. Lateral izquierdo: atornillado a la medianera. Lateral derecho: libre, a la vista por tres caras; lijar y barnizar igual que todo."
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
   "L": 156,
   "A": 60,
   "t": 18,
   "note": "Tapa la punta del antepecho en el extremo libre y cierra la U con las dos pestañas."
  },
  {
   "id": "B01",
   "name": "Barra del mecanismo",
   "material": "aluminio",
   "qty": 1,
   "L": 2867,
   "A": 25.4,
   "t": 3.2,
   "note": "Platina de aluminio 1 × 1/8 pulg de una barra de 6 m. 30 agujeros de 7 mm a paso 97,6, centrados en el ancho; el primero a 18,3 mm de la punta. Limar las puntas hasta que tope a 40° y 140°."
  }
 ],
 "obra": {
  "antepecho": {
   "t": 120,
   "alto": 1200,
   "material": "Ladrillo a la vista",
   "nota": "Muro de 12 cm. El marco, de 156, sobresale 18 mm por cada cara y sus pestañas bajan 60 mm por el ladrillo: tapan el borde superior y la junta madera–ladrillo. Todo el peso se apoya en el muro."
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
