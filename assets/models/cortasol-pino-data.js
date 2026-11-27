/* Ventanal con madera local; cotas en mm. Mecanismo sujeto a prueba en retal. */
window.CortasolPinoData={
 "name": "Cierre de la cocina en pino: ventanal, puerta plegable y cielo raso",
 "status": "Ventanal adaptado al pino disponible: marco 40 × 100, rieles continuos de 3000 entre costados completos, tablillas 100 × 15. Uniones con tarugos y tornillos ocultos. El mecanismo se presenta como propuesta para probar con los pines reales antes de mecanizar. Cielo raso con soporte independiente por verificar con su instalador.",
 "vano": {
  "L": 3080,
  "H": 1260,
  "nota": "Ventanal de 3080 × 1260 sobre antepecho a +1300; encuentro con placa a +2560. Marco de 1256 mm y junta de 4 mm para ajuste en obra."
 },
 "acabado": {
  "nota": "Todo el pino del mismo lote: inmunizado antes de armar, lijado y barnizado en la misma tanda, para que el tono quede parejo. Laca Montó Pur+Cat incoloro mate: primera mano rebajada como sellador y dos manos normales. Hay techo encima: sin lluvia directa, pero el lado patio sí recibe sol y humedad del ambiente."
 },
 "lama": {
  "A": 100,
  "t": 15,
  "n": 30,
  "holgura": 3,
  "tolerancia": 4,
  "material": "Tabla de pino macizo cepillada a 15 mm",
  "densidad": 500,
  "nota": "30 instaladas y 2 de repuesto. Acabado por las seis caras. El cuerpo de pin de Ø10 deja solo 2,5 mm por cara: probar el pin recibido en un retal antes de taladrar.",
  "por_cuerpo": 15
 },
 "angulo": {
  "min": 40,
  "max": 140,
  "inicial": 45,
  "nota": "40–140° es el recorrido representado. Ajustar topes reales en el prototipo y comprobar roce con todas las piezas terminadas."
 },
 "marco": {
  "t": 40,
  "A": 100,
  "cuerpos": 2,
  "luz": 1480.0,
  "vuelo": 0,
  "alto": 1256,
  "material": "Pino macizo cepillado a 40 × 100 mm",
  "nota": "Costados completos de 1256; rieles de 3000 entre costados. Exterior nominal 3080 × 1256. Montante de 1176 entre rieles. Medir el vano y descontar la holgura de instalación antes de dar los largos definitivos.",
  "montante": {
   "t": 40,
   "nota": "Montante central entre rieles para rigidizar el ventanal y dividirlo en dos cuerpos. Las cargas del nuevo cielo raso requieren verificación independiente."
  },
  "pestana": {
   "t": 15,
   "h": 50,
   "remate": true,
   "nota": "Cuatro tramos de cartera 1540 × 50 × 15, dos por cara. Atornillar desde detrás antes de instalar, con pretaladro y sin atravesar los 15 mm. Junta de cada cara sobre el centro del marco; presentar antes de fijar."
  },
  "union": {
   "tarugos": 2,
   "tornillos": 2,
   "tarugo_d": 8,
   "tarugo_L": 50,
   "tornillo_d": 5,
   "tornillo_L": 90,
   "nota": "Seis uniones a tope con dos tarugos Ø8 × 50 y dos tornillos Deck Ruspert de 10 × 3½\" (4,8 × 90) por unión. Esquinas: tornillos desde los cantos exteriores de los costados. Montante: tornillos desde arriba/abajo de los rieles. Pretaladro y rebaje para cabeza; tapones de pino. Plantilla diferenciada para evitar el rebaje del mecanismo. No pegar sobre barniz."
  },
  "solapa": {
   "n": 2,
   "L": 1540,
   "A": 100,
   "t": 15,
   "nota": "Solapa superior hacia el patio: tapa la zona del mecanismo y el encuentro visual del cielo raso. Desmontable con tornillos y tapones; no encolar sobre el canal."
  }
 },
 "mecanismo": {
  "manivela": 32,
  "lado": "patio",
  "canal": {
   "z0": -50,
   "z1": -5,
   "prof": 18,
   "nota": "Propuesta de rebaje abierto al patio de 45 × 18 en el riel superior, entre los costados; conserva 22 mm de lomo. Radio del pasador reducido a 32. Probar antes de fresar; la solapa exterior desmontable tapa el rebaje sin tocar la barra.",
   "abierto": true
  },
  "barra": {
   "L": 1430,
   "A": 25.4,
   "e": 3.2,
   "agujero": 7,
   "material": "Platina de aluminio de 1 × 1/8 pulg, una por cuerpo",
   "nota": "Dos platinas de 1430 × 25,4 × 3,2. Quince agujeros a paso 1480/15 = 98,6667. Primer agujero nominal a 24,3333 del extremo. Cortar y ajustar topes con plantilla de prueba; los ángulos del visor no sustituyen los topes físicos.",
   "n": 2
  },
  "pasador": {
   "d": 6.35,
   "L": 25,
   "dentro": 16,
   "nota": "Pasador inox de 6,35 × 25 a 32 mm del eje hacia el patio, insertado 16 mm y pegado con epóxico compatible. Probar taladro y giro en pino de 15 antes de hacer la serie."
  },
  "tope": {
   "L": 40,
   "A": 45,
   "t": 18,
   "nota": "Taco central en el rebaje, ajustado después de probar las barras. Los costados completos delimitan los extremos. No fabricar tacos en serie antes de comprobar el recorrido."
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
    "tornillo": "tornillo Deck 10 × 4\" (4,8 × 100) con chazo estriado de 5/16\" (8 mm)",
    "nota": "Cuatro por cuerpo, desde arriba por el riel inferior, entre tablillas, al ladrillo. Cabeza avellanada y tapón de pino. Cordón de sellador entre el riel y el ladrillo."
   },
   "medianera": {
    "n": 3,
    "tornillo": "tornillo Deck 10 × 4\" (4,8 × 100) con chazo estriado de 5/16\" (8 mm)",
    "nota": "Por el lateral izquierdo a la medianera: arriba, al centro y abajo."
   },
   "poste": {
    "n": 3,
    "tornillo": "tornillo para madera de 5\" (≈ 4,8 × 127)",
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
  "material": "Panel de yeso de 12,7 mm sobre perfilería galvanizada",
  "panel": {
   "e": 12.7,
   "x": 1850,
   "z": 3021,
   "m2": 5.59
  },
  "vigueta": {
   "t": 19,
   "h": 38,
   "n": 5,
   "L": 1850,
   "sep": 745.25
  },
  "omega": {
   "t": 58,
   "h": 19,
   "n": 6,
   "L": 3021,
   "sep": 358
  },
  "perimetral": {
   "h": 30,
   "t": 30
  },
  "nota": "Ambientación de referencia. Placa blanca con cara inferior a +2560; omegas de 19 mm y viguetas de 38 mm por encima. Apoyo perimetral en los muros y encuentro con ventanal y parales de puerta. Calibre, separaciones, cuelgues y anclajes pendientes de verificar con el instalador según el sistema y sus cargas."
 },
 "obra": {
  "antepecho": {
   "t": 100,
   "alto": 1300,
   "material": "Ladrillo a la vista de 10 cm, sin repello",
   "nota": "Ladrillo de 100 de fondo, marco de 100 centrado encima. Carteras de 15 sobrepuestas por ambas caras; no se suman al fondo del marco."
  },
  "cielo": {
   "nivel": 2560,
   "nota": "Ambientación de referencia. Placa blanca con cara inferior a +2560; omegas de 19 mm y viguetas de 38 mm por encima. Apoyo perimetral en los muros y encuentro con ventanal y parales de puerta. Calibre, separaciones, cuelgues y anclajes pendientes de verificar con el instalador según el sistema y sus cargas."
  },
  "medianera": {
   "t": 100,
   "lado": "izquierdo visto desde la cocina",
   "nota": "Ladrillo a la vista de 10 cm. El lateral izquierdo y la primera vigueta se atornillan a ella."
  },
  "habitacion": {
   "nota": "Muro de la habitación: encuentro del perfil perimetral y del paral de pino de la puerta."
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
   "L": 3000,
   "A": 100,
   "t": 40,
   "material": "macizo",
   "note": "Entre costados completos, una sola pieza. Entregar entero ≥3010 útil, preferible 3020. Ajustar al hueco real y escuadrar en armado."
  },
  {
   "id": "V02",
   "grupo": "Ventanal",
   "name": "Riel superior",
   "qty": 1,
   "L": 3000,
   "A": 100,
   "t": 40,
   "material": "macizo",
   "note": "Entre costados completos, una sola pieza. Entregar entero ≥3010 útil. Rebaje abierto al patio de 45 × 18 solo después de la prueba del mecanismo; soporte del cielo independiente."
  },
  {
   "id": "V03",
   "grupo": "Ventanal",
   "name": "Costado completo",
   "qty": 2,
   "L": 1256,
   "A": 100,
   "t": 40,
   "material": "macizo",
   "note": "Dos costados completos; los rieles de 3000 van entre ellos. Entregar 1280 para escuadrar a 1256 nominal."
  },
  {
   "id": "V04",
   "grupo": "Ventanal",
   "name": "Montante central",
   "qty": 1,
   "L": 1176,
   "A": 100,
   "t": 40,
   "material": "macizo",
   "note": "Montante entre rieles, apoya el horizontal superior en el centro. Entregar 1200 y ajustar a 1176 nominal."
  },
  {
   "id": "T01",
   "grupo": "Ventanal",
   "name": "Tablilla orientable",
   "qty": 30,
   "L": 1170,
   "A": 100,
   "t": 15,
   "material": "tabla15",
   "note": "30 instaladas y 4 de repuesto. Entrega 1180, montaje 1170. De tiras enteras de 100 × 15 cepilladas en la carpintería; corte en casa con tope fijo."
  },
  {
   "id": "V05",
   "grupo": "Ventanal",
   "name": "Cartera inferior · primer tramo por cara",
   "qty": 2,
   "L": 1540,
   "A": 50,
   "t": 15,
   "material": "tabla15",
   "note": "Entregar 1550; finalizar después de presentar el marco. Dos tramos por cara; tornillos ocultos desde detrás."
  },
  {
   "id": "V05C",
   "grupo": "Ventanal",
   "name": "Cartera inferior · segundo tramo por cara",
   "qty": 2,
   "L": 1540,
   "A": 50,
   "t": 15,
   "material": "tabla15",
   "note": "Entregar 1550; finalizar después de presentar el marco. Dos tramos por cara; tornillos ocultos desde detrás."
  },
  {
   "id": "V06",
   "grupo": "Ventanal",
   "name": "Remate del extremo libre",
   "qty": 1,
   "L": 130,
   "A": 50,
   "t": 15,
   "material": "tabla15",
   "note": "Desde retal 150 × 50 × 15; adaptar al antepecho más ambas carteras."
  },
  {
   "id": "V07",
   "grupo": "Ventanal",
   "name": "Taco de tope",
   "qty": 1,
   "L": 40,
   "A": 45,
   "t": 18,
   "material": "retal",
   "note": "Desde retal del bastidor, espesor 18 ajustado en armado. Tope central de referencia; probar antes de cortar."
  },
  {
   "id": "B01",
   "grupo": "Ventanal",
   "name": "Barra del mecanismo",
   "qty": 2,
   "L": 1430,
   "A": 25.4,
   "t": 3.2,
   "material": "aluminio",
   "note": "Dos platinas de 1430 × 25,4 × 3,2. Quince agujeros a paso 1480/15 = 98,6667. Primer agujero nominal a 24,3333 del extremo. Cortar y ajustar topes con plantilla de prueba; los ángulos del visor no sustituyen los topes físicos."
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
   "note": "Dos piezas pegadas y atornilladas = 80 × 100, igual al poste de esquina. De piso a cielo, atornillado al muro de la habitación con 4 chazos. Arriba se encuentra con la perfilería del cielo raso."
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
   "note": "Dos piezas pegadas y atornilladas = 80 × 100. De piso a cielo, junto al ventanal: recibe el dintel, el encuentro del cielo raso y el lateral del ventanal. Escuadra al piso."
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
   "note": "Uno sobre el dintel y otro bajo el encuentro del cielo raso; las tablillas se pegan y clavan con puntilla sin cabeza."
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
   "id": "V08",
   "grupo": "Ventanal",
   "name": "Solapa superior exterior · tramo",
   "qty": 2,
   "L": 1540,
   "A": 100,
   "t": 15,
   "material": "tabla15",
   "note": "Entrega 1550; dos tramos. Cara interior a z −65 para dejar 15 mm libres al rebaje; usar separadores desde retal y tornillos desmontables."
  },
  {
   "id": "V09",
   "grupo": "Ventanal",
   "name": "Calce de unión al poste",
   "qty": 3,
   "L": 100,
   "A": 80,
   "t": 20,
   "material": "retal",
   "note": "Sacar del sobrante del cuarto bastidor: espesor terminado 20 para mantener la puerta y el cielo en su posición. Taladrar junto con el poste al presentar."
  },
  {
   "id": "T02",
   "grupo": "Ventanal",
   "name": "Tablilla de repuesto",
   "qty": 4,
   "L": 1170,
   "A": 100,
   "t": 15,
   "material": "tabla15",
   "note": "Incluidas en el pedido de 34 tablillas; mismo corte, cepillado y acabado."
  }
 ],
 "encuentro": {
  "plano_cocina": 70,
  "calce_poste": 20,
  "nota": "Se conserva la posición de la puerta y del cielo raso. Al reducir el marco de 140 a 100, queda una separación de 20 hacia el poste: tres calces macizos de 20, obtenidos de retal, salvan la unión. No dejar tornillos trabajando sobre ese vacío."
 },
 "armado": {
  "pegante": "Pegante Carpincol para madera 1 kg (Afix), o Carpincol MR60 con más resistencia a la humedad",
  "fuente": "https://www.titebond.com/App_Static/literature/glues/FF681_TBIIIUltimateBrochureTB.pdf",
  "prensas": "Encolar superficies de madera limpia sin acabado; aplicar presión con sargentos y respetar el curado de la ficha. Dejar al menos 24 h antes de solicitar las uniones.",
  "clavos": "Puntillas solo para sujetar remates mientras se trabaja; los marcos se unen con tarugos y tornillos.",
  "fijacion": "Anclar en soporte firme. Elegir chazo y profundidad al comprobar si el ladrillo es hueco; no asumir que cualquier chazo de expansión sirve. Calzas rígidas bajo los apoyos; sellador flexible en la junta con mampostería."
 }
};
