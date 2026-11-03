/* Cortasol de tablillas orientables, todo en pino: tablillas y marco doble de pino alistonado de 18 mm, mismo acabado,
   y una sola barra de aluminio arriba. Fuente única para el visor (assets/propuesta-lamas-pino.js), la terraza (assets/app.js)
   y herramientas/build_cortasol_pino.py. Medidas terminadas en mm. Ángulo: 90° = tablilla perpendicular al muro (abierta);
   40° y 140° = topes de la barra. z > 0 = lado cocina, z < 0 = lado patio. La barra va del lado patio del riel superior. */
window.CortasolPinoData={
 "name":"Cortasol de tablillas de pino orientables",
 "status":"Propuesta en estudio (3 de noviembre de 2026): todo en pino alistonado, mismo acabado en marco y tablillas; pines con resorte en las dos puntas y una barra de aluminio arriba, sin perillas",
 "vano":{"L":3000,"H":1300,"nota":"Medida exterior del ventanal sobre el antepecho del patio 1 (+120 a +250 cm). Medir el vano real en tres puntos antes de cortar."},
 "acabado":{"nota":"Marco y tablillas del mismo lote de pino, lijados igual y barnizados en la misma tanda: así el tono queda parejo y envejece igual. Acabado elegido: laca Montó Pur+Cat incoloro mate (interior/exterior, catalizada, tono miel); primera mano rebajada como sellador y dos manos normales. Sin sellador de nitrocelulosa debajo."},
 "lama":{"A":105,"t":18,"n":30,"holgura":3,"tolerancia":4,"material":"Pino alistonado (finger joint) de 18 mm, barnizado por las seis caras","densidad":500,
  "nota":"18 mm de grueso dejan unos 5 mm de madera a cada lado del cuerpo del pin. 3 mm libres en cada punta: la pestaña del pin más el juego (ajustar al medir los pines). La densidad es la típica del pino seco, 450 a 550 kg/m³."},
 "angulo":{"min":40,"max":140,"inicial":45,"nota":"Los extremos de la barra chocan con los tacos de tope del canal: a 40° y 140° las tablillas de los extremos quedan a unos 3 mm del lateral y el paso de aire no baja del 45 %; sin topes se cerrarían hasta tocarse cerca de 10°."},
 "marco":{"capa":18,"t":36,"A":160,"tramo":1000,"paneles":3,"material":"Pino alistonado de 18 mm, el mismo de las tablillas",
  "juntas":{"entera":[1000,1000,1000],"trabada":[500,1000,1000,500]},
  "nota":"Marco en dos capas de pino de 18 mm pegadas con pegante para madera y prensadas. En cada riel, una capa va en tres tramos de 1000 y la otra en 500 + 1000 + 1000 + 500: las juntas no coinciden y el riel trabaja como una sola pieza de 3 m. Un lateral de dos capas a cada lado, sin laterales en medio."},
 "mecanismo":{
  "manivela":40,
  "lado":"patio",
  "canal":{"z0":-56,"z1":-10,"nota":"Canal de 46 × 18 mm en la capa de abajo del riel superior, entre la tira patio y la tira cocina: no hay que rutear. Queda boca abajo, encima de las tablillas."},
  "barra":{"L":2867,"A":25.4,"e":3.2,"agujero":7,"material":"Platina de aluminio de 1 × 1/8 pulg en una sola pieza",
   "nota":"Descansa sobre las tablillas, apoyada en arandelas de nylon. Un agujero de 7 mm por tablilla a paso 97,6, centrado en el ancho. Sus extremos chocan con los tacos de tope: cortar unos milímetros más larga y limar hasta que tope a 40° y 140°."},
  "pasador":{"d":6.35,"L":25,"dentro":16,"nota":"Varilla inox 304 de 1/4 pulg, pegada con epóxico en la punta superior de la tablilla, a 40 mm del eje hacia el patio. Sobresalen 9 mm: atraviesan la arandela y la barra."},
  "tope":{"L":36,"nota":"Taco de pino que cierra el canal sobre cada lateral. La barra choca contra él en los extremos del giro."},
  "pines":{"modelo":"uxcell, 24 × 10 mm (0,94 × 0,39 pulg), punta metálica con resorte y cuerpo plástico","abajo":"con resorte","arriba":"con resorte","pestana":10,"largo":24,"punta":5,"ranura":{"L":25,"prof":2},
   "nota":"El peso de la tablilla se apoya en la pestaña plástica; el resorte solo mantiene la punta dentro del hueco del riel. Abajo, una ranura de entrada de 2 mm de hondo lleva la punta hasta su hueco al montar. Medir cuerpo y punta de los pines recibidos antes de perforar."},
  "anclaje":"tornillo 4,5 × 60 con chazo plástico de 6 mm","anclajes":{"rielInferior":4,"rielSuperior":4,"lateral":4}
 },
 "led":{"perfil":[16,8],"lado":"cocina","z0":63,"z1":80,"nota":"Perfil en el rebaje de 17 × 18 que deja la tira cocina del riel superior en su borde cocina: queda a ras y las tablillas pasan por debajo."},
 "parts":[
  {"id":"T01","name":"Tablilla orientable","qty":30,"L":1218,"A":105,"t":18,"note":"Un pin con resorte al centro de cada punta. Arriba, pasador de 1/4 × 25 a 40 mm del centro hacia el patio, a la mitad del grueso, 16 mm pegado con epóxico. Todas iguales: hacerlas con plantilla."},
  {"id":"R01","name":"Base del riel inferior · tramo","qty":2,"L":1000,"A":160,"t":18,"note":"Capa de abajo, trabada: 500 + 1000 + 1000 + 500, sobre el antepecho."},
  {"id":"R01P","name":"Base del riel inferior · punta","qty":2,"L":500,"A":160,"t":18,"note":"Las dos puntas de la capa trabada."},
  {"id":"R02","name":"Tapa del riel inferior","qty":3,"L":1000,"A":160,"t":18,"note":"Capa de arriba, en tres tramos, sin canal. Lleva los 30 huecos de las puntas de los pines a paso 97,6, cada uno con su ranura de entrada de 25 × 2 mm hacia la cocina."},
  {"id":"R05","name":"Base del riel superior · tramo","qty":2,"L":1000,"A":160,"t":18,"note":"Capa de arriba, trabada, contra la estructura del techo; no contra la placa del cielo raso. Es el techo del canal de la barra."},
  {"id":"R05P","name":"Base del riel superior · punta","qty":2,"L":500,"A":160,"t":18,"note":"Las dos puntas de la capa trabada."},
  {"id":"R06","name":"Tira cocina del riel superior","qty":3,"L":1000,"A":73,"t":18,"note":"Capa de abajo, de z −10 a z 63. Su borde cocina forma el rebaje del LED y el otro forma el canal. Lleva los huecos de las puntas de los pines de arriba, alineados con los de abajo."},
  {"id":"R08","name":"Tira patio del riel superior","qty":3,"L":1000,"A":24,"t":18,"note":"Capa de abajo, de z −80 a z −56: cierra el canal del lado patio."},
  {"id":"R09","name":"Taco de tope","qty":2,"L":46,"A":36,"t":18,"note":"Cierra cada punta del canal, encima del lateral. Pegado y atornillado: la barra choca aquí a 40° y 140°."},
  {"id":"R07","name":"Capa de lateral","qty":4,"L":1224,"A":160,"t":18,"note":"Dos capas por lado, entre los rieles, ancladas a la jamba del muro."},
  {"id":"B01","name":"Barra del mecanismo","material":"aluminio","qty":1,"L":2867,"A":25.4,"t":3.2,"note":"Platina de aluminio 1 × 1/8 pulg de una barra de 6 m. 30 agujeros de 7 mm a paso 97,6, centrados en el ancho; el primero a 18,3 mm de la punta. Limar las puntas hasta que tope a 40° y 140°."}
 ]
};
