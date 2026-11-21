/* Cierre de la cocina en pino, medido en obra el 21/11/2026: ventanal de dos cuerpos con tablillas orientables, puerta plegable
   de 213 cm con sobreluz de tablillas y estructura del cielo raso de machimbre. Marco y estructura en pino macizo de 40 mm; tablillas,
   pestañas y hojas en pino alistonado de 18 mm. Fuente única para el visor del ventanal (assets/propuesta-lamas-pino.js), la puerta
   (assets/models/puerta-plegable-*.js), la terraza (assets/app.js) y herramientas/build_pino_cocina.py. Medidas en mm.
   Ángulo: 90° = tablilla perpendicular al muro; 40° y 140° = topes. z > 0 = cocina, z < 0 = patio; x > 0 = hacia el extremo libre. */
window.CortasolPinoData={
 "name": "Cierre de la cocina en pino: ventanal, puerta plegable y cielo raso",
 "status": "Diseño ajustado a la obra terminada (21 de noviembre de 2026): ventanal de 3080 × 1260 en dos cuerpos sobre un antepecho de ladrillo a la vista de 10 cm y 1300 de alto; puerta plegable de 1910 × 2130 con sobreluz de tablillas hasta el cielo raso de 2560; cielo raso de machimbre sobre viguetas que apoyan en el ventanal y en una carrera contra el muro de la habitación. Marco y estructura en pino macizo de 40 mm; tablillas, pestañas y hojas en pino alistonado de 18 mm.",
 "vano": {
  "L": 3080,
  "H": 1260,
  "nota": "Medida en obra: 3080 de largo, de la medianera al filo del ladrillo del extremo libre, y 1260 de alto, del antepecho (+1300) al cielo raso (+2560). El marco mide 1256: 4 mm de calce bajo las viguetas. Volver a medir en tres puntos antes de cortar."
 },
 "acabado": {
  "nota": "Todo el pino del mismo lote: inmunizado antes de armar, lijado y barnizado en la misma tanda, para que el tono quede parejo. Laca Montó Pur+Cat incoloro mate: primera mano rebajada como sellador y dos manos normales. Hay techo encima: sin lluvia directa, pero el lado patio sí recibe sol y humedad del ambiente."
 },
 "lama": {
  "A": 100,
  "t": 18,
  "n": 30,
  "holgura": 3,
  "tolerancia": 4,
  "material": "Pino alistonado (finger joint) de 18 mm, barnizado por las seis caras",
  "densidad": 500,
  "nota": "100 mm de ancho, igual que el muro: al girar ocupa un círculo de 102 mm y queda dentro del marco de 140. 18 mm de grueso dejan unos 5 mm de madera a cada lado del cuerpo del pin. 3 mm libres en cada punta para la pestaña del pin y el juego. 15 por cuerpo, a paso 98,7 mm.",
  "por_cuerpo": 15
 },
 "angulo": {
  "min": 40,
  "max": 140,
  "inicial": 45,
  "nota": "Los extremos de cada barra chocan con los tacos de tope del canal: a 40° y 140° las tablillas de los extremos quedan a unos 5,2 mm del lateral o del montante y el paso de aire no baja del 46 %."
 },
 "marco": {
  "t": 40,
  "A": 140,
  "cuerpos": 2,
  "luz": 1480.0,
  "vuelo": 2,
  "alto": 1256,
  "material": "Pino macizo de 40 mm de grueso (4 × 14), cepillado, inmunizado y barnizado",
  "nota": "Marco de pino macizo de 40 × 140 mm, igual en rieles, laterales y montante: 100 del ladrillo, 18 de pestaña por cada cara y 2 mm de vuelo sobre cada pestaña. Los rieles van de una sola pieza de 3080 mm. El montante central divide el ventanal en dos cuerpos de 1480,0 mm libres y baja al antepecho la carga del cielo raso.",
  "montante": {
   "t": 40,
   "nota": "Sin montante, el riel superior acostado cruzaría 3000 mm y, con el cielo raso encima, se flecharía unos 29 mm: las tablillas se trabarían. Con el montante la luz baja a 1480,0 mm y la flecha a unos 1,7 mm."
  },
  "pestana": {
   "t": 18,
   "h": 60,
   "remate": true,
   "nota": "Pestañas de pino alistonado de 18 × 60 mm por las dos caras del antepecho, pegadas y atornilladas por debajo del riel inferior. El riel vuela 2 mm sobre cada pestaña. En el extremo libre, un remate de 136 mm tapa la punta del muro y cierra la U. Ajustar los 60 mm para que el borde quede encima de una junta de mortero."
  },
  "union": {
   "tarugos": 2,
   "tornillos": 2,
   "nota": "Rieles enteros; laterales y montante entre los rieles, a tope. Cada unión se pega y lleva dos tarugos de 10 × 60 mm y dos tornillos de 5 × 100 mm desde la cara exterior del riel, avellanados y tapados con tapones de pino. Armar en el banco sobre una superficie plana y escuadrar midiendo las diagonales de cada cuerpo."
  }
 },
 "mecanismo": {
  "manivela": 37,
  "lado": "patio",
  "canal": {
   "z0": -52,
   "z1": -9,
   "prof": 18,
   "nota": "Canal de 43 × 18 mm ruteado por debajo del riel superior, de punta a punta, del lado patio (de z −52 a z −9). Queda boca abajo, encima de las tablillas. Rutear en dos o tres pasadas, con guía paralela."
  },
  "barra": {
   "L": 1423,
   "A": 25.4,
   "e": 3.2,
   "agujero": 7,
   "material": "Platina de aluminio de 1 × 1/8 pulg, una por cuerpo",
   "nota": "Una por cuerpo, de 1423 mm. Descansa sobre arandelas de nylon. 15 agujeros de 7 mm a paso 98,7, centrados en el ancho; el primero a 20,8 mm de la punta. Cortar unos milímetros más larga y limar hasta que tope a 40° y 140°.",
   "n": 2
  },
  "pasador": {
   "d": 6.35,
   "L": 25,
   "dentro": 16,
   "nota": "Varilla inox 304 de 1/4 pulg, pegada con epóxico en la punta superior de la tablilla, a 37 mm del eje hacia el patio. Sobresalen 9 mm: atraviesan la arandela y la barra."
  },
  "tope": {
   "L": 40,
   "A": 43,
   "t": 18,
   "nota": "Tacos de pino de 40 × 43 × 18 pegados dentro del canal, encima de cada lateral y del montante. Cada barra choca contra los tacos de su cuerpo en los extremos del giro; el del montante sirve a las dos."
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
    "n": 8,
    "tornillo": "tornillo 5 × 100 con chazo plástico de 8 mm",
    "nota": "Cuatro por cuerpo, desde arriba por el riel inferior, entre tablillas, al ladrillo. Cabeza avellanada y tapón de pino. Cordón de sellador entre el riel y el ladrillo."
   },
   "medianera": {
    "n": 3,
    "tornillo": "tornillo 5 × 100 con chazo plástico de 8 mm",
    "nota": "Por el lateral izquierdo a la medianera: arriba, al centro y abajo."
   },
   "poste": {
    "n": 3,
    "tornillo": "tornillo para madera 5 × 120",
    "nota": "El lateral del extremo libre se atornilla al poste de la puerta: así el extremo libre queda amarrado de piso a cielo."
   }
  }
 },
 "puerta": {
  "ancho": 1910,
  "alto": 2130,
  "plano": 50,
  "cara": 1890,
  "jamba": {
   "t": 80,
   "A": 100,
   "piezas": 2
  },
  "poste": {
   "t": 80,
   "A": 100,
   "piezas": 2
  },
  "dintel": {
   "t": 40,
   "h": 100
  },
  "vano": 1730,
  "hojas": {
   "n": 4,
   "A": 427,
   "h": 2060,
   "t": 36,
   "capa": 18,
   "lado": 5,
   "borde": 6.5,
   "junta": 3,
   "piso": 10,
   "sistema": 60,
   "montante": 70,
   "travesanos": [
    [
     0,
     130
    ],
    [
     950,
     1050
    ],
    [
     1960,
     2060
    ]
   ],
   "huecos": [
    [
     130,
     950
    ],
    [
     1050,
     1960
    ]
   ],
   "tablillas": {
    "n": 5,
    "A": 40
   }
  },
  "sobreluz": {
   "liston": {
    "A": 40,
    "t": 18
   },
   "tablilla": {
    "n": 19,
    "A": 60,
    "t": 18,
    "L": 290
   },
   "luz": 29.5
  },
  "nota": "Vano de 1910, del muro de la habitación al filo del ladrillo, y 2130 de alto, como la puerta metálica. Dentro caben dos parales iguales de 80 × 100 (dos piezas de 40 × 100 pegadas cada uno), uno contra el muro y otro en la esquina, los 20 mm del vuelo y la pestaña del ventanal y 1730 mm para las cuatro hojas. Encima, un dintel de 40 × 100 de canto a 2130 recibe el riel del plegable, y una sobreluz de 19 tablillas verticales cierra hasta el cielo raso dejando paso de aire."
 },
 "cielo": {
  "nivel": 2560,
  "material": "Machimbre de pino de 10 mm",
  "vigueta": {
   "t": 40,
   "h": 100,
   "n": 7,
   "L": 1980,
   "sep": 501.6666666666667
  },
  "carrera": {
   "t": 40,
   "h": 100,
   "L": 2980
  },
  "machimbre": {
   "e": 10,
   "util": 90,
   "x": 1850,
   "z": 3021.0,
   "m2": 5.59
  },
  "carga": {
   "kg": 117,
   "flecha_sin": 29.3,
   "flecha_con": 1.7
  },
  "nota": "7 viguetas de 40 × 100 de canto, a unos 502 mm entre ejes, apoyadas en la carrera contra el muro de la habitación y 90 mm sobre el riel superior del ventanal. La primera va atornillada a la medianera y la última sobre los dos parales de la puerta. El machimbre se clava por debajo, a lo largo del ventanal, con las juntas sobre las viguetas y alternadas: unos 5.6 m² (1,9 × 3,0 m). Las viguetas quedan encima de +2560: confirmar que haya al menos 11 cm libres bajo el techo. Peso estimado del cielo raso con margen: unos 117 kg, la mitad sobre el ventanal."
 },
 "obra": {
  "antepecho": {
   "t": 100,
   "alto": 1300,
   "material": "Ladrillo a la vista de 10 cm, sin repello",
   "nota": "Muro de ladrillo de 10 cm exactos y 1300 de alto. El marco de 140 lo cubre con las dos pestañas y vuela 2 mm sobre ellas."
  },
  "cielo": {
   "nivel": 2560,
   "nota": "Cielo raso de machimbre a +2560 sobre la cocina; techo encima, sin lluvia directa."
  },
  "medianera": {
   "t": 100,
   "lado": "izquierdo visto desde la cocina",
   "nota": "Ladrillo a la vista de 10 cm. El lateral izquierdo y la primera vigueta se atornillan a ella."
  },
  "habitacion": {
   "nota": "Muro gris de la habitación: recibe la carrera del cielo raso y el paral de la puerta."
  },
  "libre": {
   "lado": "derecho visto desde la cocina",
   "nota": "El ventanal termina en el filo del ladrillo; el poste de la puerta queda al lado, del lado cocina, y se atornilla al lateral."
  }
 },
 "parts": [
  {
   "id": "V01",
   "grupo": "Ventanal",
   "name": "Riel inferior",
   "qty": 1,
   "L": 3080,
   "A": 140,
   "t": 40,
   "material": "macizo",
   "note": "Una sola pieza. Huecos de las puntas de los pines a paso 98,7 en cada cuerpo, con su ranura de entrada de 25 × 2 mm hacia la cocina. Apoya en el antepecho con sellador; pestañas pegadas y atornilladas por debajo."
  },
  {
   "id": "V02",
   "grupo": "Ventanal",
   "name": "Riel superior",
   "qty": 1,
   "L": 3080,
   "A": 140,
   "t": 40,
   "material": "macizo",
   "note": "Una sola pieza. Canal de 43 × 18 ruteado por debajo, de punta a punta, del lado patio; huecos de los pines alineados con los de abajo. Sobre él apoyan las viguetas del cielo raso (90 mm)."
  },
  {
   "id": "V03",
   "grupo": "Ventanal",
   "name": "Lateral",
   "qty": 2,
   "L": 1176,
   "A": 140,
   "t": 40,
   "material": "macizo",
   "note": "Entre los dos rieles. Izquierdo atornillado a la medianera; derecho, en el extremo libre, atornillado al poste de la puerta."
  },
  {
   "id": "V04",
   "grupo": "Ventanal",
   "name": "Montante central",
   "qty": 1,
   "L": 1176,
   "A": 140,
   "t": 40,
   "material": "macizo",
   "note": "Entre los rieles, al centro: deja dos cuerpos de 1480,0 mm libres y baja la carga del cielo raso al antepecho."
  },
  {
   "id": "T01",
   "grupo": "Ventanal",
   "name": "Tablilla orientable",
   "qty": 30,
   "L": 1170,
   "A": 100,
   "t": 18,
   "material": "tablero",
   "note": "15 por cuerpo. Un pin con resorte al centro de cada punta. Arriba, pasador de 1/4 × 25 a 37 mm del centro hacia el patio, a la mitad del grueso, 16 mm pegado con epóxico. Hacerlas con plantilla."
  },
  {
   "id": "V05",
   "grupo": "Ventanal",
   "name": "Pestaña del antepecho · tramo largo",
   "qty": 2,
   "L": 2000,
   "A": 60,
   "t": 18,
   "material": "tablero",
   "note": "Una por cara (cocina y patio), desde la medianera. Pegada y atornillada por debajo del riel inferior, contra la cara del ladrillo."
  },
  {
   "id": "V05C",
   "grupo": "Ventanal",
   "name": "Pestaña del antepecho · tramo corto",
   "qty": 2,
   "L": 1080,
   "A": 60,
   "t": 18,
   "material": "tablero",
   "note": "Una por cara, hasta el extremo libre."
  },
  {
   "id": "V06",
   "grupo": "Ventanal",
   "name": "Remate del extremo libre",
   "qty": 1,
   "L": 136,
   "A": 60,
   "t": 18,
   "material": "tablero",
   "note": "Tapa la punta del antepecho y cierra la U con las dos pestañas."
  },
  {
   "id": "V07",
   "grupo": "Ventanal",
   "name": "Taco de tope",
   "qty": 3,
   "L": 40,
   "A": 43,
   "t": 18,
   "material": "tablero",
   "note": "Dentro del canal, encima de cada lateral y del montante. Pegado y atornillado: las barras chocan aquí."
  },
  {
   "id": "B01",
   "grupo": "Ventanal",
   "name": "Barra del mecanismo",
   "qty": 2,
   "L": 1423,
   "A": 25.4,
   "t": 3.2,
   "material": "aluminio",
   "note": "Una por cuerpo, de una platina de 6 m. 15 agujeros de 7 mm a paso 98,7; el primero a 20,8 mm de la punta. Limar las puntas hasta que tope a 40° y 140°."
  },
  {
   "id": "P01",
   "grupo": "Puerta",
   "name": "Paral contra el muro",
   "qty": 2,
   "L": 2560,
   "A": 100,
   "t": 40,
   "material": "macizo",
   "note": "Dos piezas pegadas y atornilladas = 80 × 100, igual al poste de esquina. De piso a cielo, atornillado al muro de la habitación con 4 chazos. Arriba recibe la vigueta del borde."
  },
  {
   "id": "P02",
   "grupo": "Puerta",
   "name": "Poste de esquina",
   "qty": 2,
   "L": 2560,
   "A": 100,
   "t": 40,
   "material": "macizo",
   "note": "Dos piezas pegadas y atornilladas = 80 × 100. De piso a cielo, junto al ventanal: recibe el dintel, la vigueta del borde y el lateral del ventanal. Escuadra al piso."
  },
  {
   "id": "P03",
   "grupo": "Puerta",
   "name": "Dintel",
   "qty": 1,
   "L": 1730,
   "A": 100,
   "t": 40,
   "material": "macizo",
   "note": "De canto, entre los dos parales, con la cara inferior a 2130. Recibe el riel del sistema plegable."
  },
  {
   "id": "H01",
   "grupo": "Puerta",
   "name": "Hoja · montante continuo (capa 1)",
   "qty": 8,
   "L": 2060,
   "A": 70,
   "t": 18,
   "material": "tablero",
   "note": "Dos por hoja."
  },
  {
   "id": "H02",
   "grupo": "Puerta",
   "name": "Hoja · travesaño inferior corto (capa 1)",
   "qty": 4,
   "L": 287,
   "A": 130,
   "t": 18,
   "material": "tablero",
   "note": "Entre los montantes continuos."
  },
  {
   "id": "H03",
   "grupo": "Puerta",
   "name": "Hoja · travesaño central corto (capa 1)",
   "qty": 4,
   "L": 287,
   "A": 100,
   "t": 18,
   "material": "tablero",
   "note": "Entre los montantes continuos."
  },
  {
   "id": "H04",
   "grupo": "Puerta",
   "name": "Hoja · travesaño superior corto (capa 1)",
   "qty": 4,
   "L": 287,
   "A": 100,
   "t": 18,
   "material": "tablero",
   "note": "Entre los montantes continuos."
  },
  {
   "id": "H05",
   "grupo": "Puerta",
   "name": "Hoja · travesaño inferior continuo (capa 2)",
   "qty": 4,
   "L": 427,
   "A": 130,
   "t": 18,
   "material": "tablero",
   "note": "De lado a lado de la hoja; traba la capa 1."
  },
  {
   "id": "H06",
   "grupo": "Puerta",
   "name": "Hoja · travesaño central continuo (capa 2)",
   "qty": 4,
   "L": 427,
   "A": 100,
   "t": 18,
   "material": "tablero",
   "note": "De lado a lado de la hoja; traba la capa 1."
  },
  {
   "id": "H07",
   "grupo": "Puerta",
   "name": "Hoja · travesaño superior continuo (capa 2)",
   "qty": 4,
   "L": 427,
   "A": 100,
   "t": 18,
   "material": "tablero",
   "note": "De lado a lado de la hoja; traba la capa 1."
  },
  {
   "id": "H08",
   "grupo": "Puerta",
   "name": "Hoja · montante interrumpido, hueco 1 (capa 2)",
   "qty": 8,
   "L": 820,
   "A": 70,
   "t": 18,
   "material": "tablero",
   "note": "Entre los travesaños continuos."
  },
  {
   "id": "H09",
   "grupo": "Puerta",
   "name": "Hoja · montante interrumpido, hueco 2 (capa 2)",
   "qty": 8,
   "L": 910,
   "A": 70,
   "t": 18,
   "material": "tablero",
   "note": "Entre los travesaños continuos."
  },
  {
   "id": "H10",
   "grupo": "Puerta",
   "name": "Hoja · tablilla del hueco 1",
   "qty": 20,
   "L": 820,
   "A": 40,
   "t": 18,
   "material": "tablero",
   "note": "5 por hueco, entre las dos capas."
  },
  {
   "id": "H11",
   "grupo": "Puerta",
   "name": "Hoja · tablilla del hueco 2",
   "qty": 20,
   "L": 910,
   "A": 40,
   "t": 18,
   "material": "tablero",
   "note": "5 por hueco, entre las dos capas."
  },
  {
   "id": "S01",
   "grupo": "Puerta",
   "name": "Listón de la sobreluz",
   "qty": 2,
   "L": 1730,
   "A": 40,
   "t": 18,
   "material": "tablero",
   "note": "Uno sobre el dintel y otro bajo la vigueta del borde; las tablillas se pegan y clavan con puntilla sin cabeza."
  },
  {
   "id": "S02",
   "grupo": "Puerta",
   "name": "Tablilla de la sobreluz",
   "qty": 19,
   "L": 290,
   "A": 60,
   "t": 18,
   "material": "tablero",
   "note": "Verticales y fijas, separadas 29,5 mm: dejan paso de aire permanente sobre la puerta."
  },
  {
   "id": "C01",
   "grupo": "Cielo raso",
   "name": "Carrera contra el muro de la habitación",
   "qty": 1,
   "L": 2980,
   "A": 100,
   "t": 40,
   "material": "macizo",
   "note": "De canto, con la cara de arriba a +2560, anclada al muro con chazos de 3/8 × 3 pulg cada 50 cm. Termina contra el paral de la puerta."
  },
  {
   "id": "C02",
   "grupo": "Cielo raso",
   "name": "Vigueta del cielo raso",
   "qty": 7,
   "L": 1980,
   "A": 100,
   "t": 40,
   "material": "macizo",
   "note": "De canto, a unos 502 mm entre ejes: de la carrera al riel superior del ventanal, con 90 mm de apoyo. Fijar con escuadra o tornillo inclinado de 5 × 100 en cada apoyo."
  }
 ]
};
