/* Cortasol de tablillas orientables: tablillas de pino alistonado, marco doble de RH15 y una sola barra de aluminio arriba.
   Fuente única para el visor (assets/propuesta-lamas-pino.js), la terraza (assets/app.js) y herramientas/build_cortasol_pino.py.
   Medidas terminadas en mm. Ángulo: 90° = tablilla perpendicular al muro (abierta); 40° y 140° = topes de la barra.
   z > 0 = lado cocina, z < 0 = lado patio. La barra va del lado patio del riel superior. */
window.CortasolPinoData={
 "name":"Cortasol de tablillas de pino orientables",
 "status":"Propuesta en estudio (variante 3 de noviembre de 2026): tablillas de pino, pines con resorte en las dos puntas y una barra de aluminio arriba, sin perillas",
 "vano":{"L":3000,"H":1300,"nota":"Medida exterior del ventanal sobre el antepecho del patio 1 (+120 a +250 cm). Medir el vano real en tres puntos antes de cortar."},
 "lama":{"A":105,"t":18,"n":30,"holgura":3,"tolerancia":4,"material":"Pino alistonado (finger joint) de 18 mm, pintado o barnizado por las seis caras","densidad":500,
  "nota":"18 mm de grueso dejan unos 5 mm de madera a cada lado del cuerpo del pin. 3 mm libres en cada punta: la pestaña del pin más el juego (ajustar al medir los pines). La densidad es la típica del pino seco, 450 a 550 kg/m³."},
 "angulo":{"min":40,"max":140,"inicial":45,"nota":"Los extremos de la barra chocan con los tacos de tope del canal: a 40° y 140° las tablillas de los extremos quedan a unos 3 mm del lateral y el paso de aire no baja del 45 %; sin topes se cerrarían hasta tocarse cerca de 10°."},
 "marco":{"capa":15,"t":30,"A":160,"tramo":1000,"paneles":3,"material":"Melamina RH15, color por definir",
  "nota":"Marco en dos capas de RH15 pegadas con PU. Los rieles van en tres tramos de 1000 a tope, sin laterales en medio; un lateral a cada lado. Lijar la melamina de las caras que se pegan y prensar con tornillos ocultos."},
 "mecanismo":{
  "manivela":40,
  "lado":"patio",
  "canal":{"z0":-56,"z1":-10,"nota":"Canal de 46 mm en la capa de abajo del riel superior, entre la tira patio y la tira cocina: no hay que rutear. Queda boca abajo, encima de las tablillas."},
  "barra":{"L":2879,"A":25.4,"e":3.2,"agujero":7,"material":"Platina de aluminio de 1 × 1/8 pulg en una sola pieza",
   "nota":"Descansa sobre las tablillas, apoyada en arandelas de nylon. Un agujero de 7 mm por tablilla a paso 98, centrado en el ancho. Sus extremos chocan con los tacos de tope: cortar unos milímetros más larga y limar hasta que tope a 40° y 140°."},
  "pasador":{"d":6.35,"L":25,"dentro":16,"nota":"Varilla inox 304 de 1/4 pulg, pegada con epóxico en la punta superior de la tablilla, a 40 mm del eje hacia el patio. Sobresalen 9 mm: atraviesan la arandela y la barra."},
  "tope":{"L":30,"nota":"Taco de RH que cierra el canal sobre cada lateral. La barra choca contra él en los extremos del giro."},
  "pines":{"modelo":"uxcell, 24 × 10 mm (0,94 × 0,39 pulg), punta metálica con resorte y cuerpo plástico","abajo":"con resorte","arriba":"con resorte","pestana":10,"largo":24,"punta":5,"ranura":{"L":25,"prof":2},
   "nota":"El peso de la tablilla se apoya en la pestaña plástica; el resorte solo mantiene la punta dentro del hueco del riel. Abajo, una ranura de entrada de 2 mm de hondo lleva la punta hasta su hueco al montar. Medir cuerpo y punta de los pines recibidos antes de perforar."},
  "anclaje":"tornillo 4,5 × 50 con chazo plástico de 6 mm","anclajes":{"rielInferior":4,"rielSuperior":4,"lateral":4}
 },
 "led":{"perfil":[16,8],"lado":"cocina","z0":63,"z1":80,"nota":"Perfil en el rebaje que deja la tira cocina del riel superior en su borde cocina: queda a ras y las tablillas pasan por debajo."},
 "parts":[
  {"id":"T01","name":"Tablilla orientable","material":"pino","qty":30,"L":1230,"A":105,"t":18,"edges":["—","—","—","—"],"note":"Pino alistonado de 18 mm, pintado o barnizado por las seis caras, puntas incluidas. Un pin con resorte al centro de cada punta. Arriba, pasador de 1/4 × 25 a 40 mm del centro hacia el patio, a la mitad del grueso, 16 mm pegado con epóxico. Todas iguales: hacerlas con plantilla."},
  {"id":"R01","name":"Base del riel inferior","material":"rh","qty":3,"L":1000,"A":160,"t":15,"edges":["0.45","0.45","—","—"],"note":"Capa de abajo, entera, sobre el antepecho."},
  {"id":"R02","name":"Tapa del riel inferior","material":"rh","qty":3,"L":1000,"A":160,"t":15,"edges":["0.45","0.45","—","—"],"note":"Capa de arriba, entera: sin canal. Lleva los 10 huecos de las puntas de los pines a paso 98, cada uno con su ranura de entrada de 25 × 2 mm hacia la cocina."},
  {"id":"R05","name":"Base del riel superior","material":"rh","qty":3,"L":1000,"A":160,"t":15,"edges":["0.45","0.45","—","—"],"note":"Capa de arriba, contra la estructura del techo; no contra la placa del cielo raso. Es el techo del canal de la barra."},
  {"id":"R06","name":"Tira cocina del riel superior","material":"rh","qty":3,"L":1000,"A":73,"t":15,"edges":["0.45","—","—","—"],"note":"Capa de abajo, de z −10 a z 63. Canto en el borde cocina, que forma el rebaje del LED; el otro borde forma el canal. Lleva los 10 huecos de las puntas de los pines con resorte, alineados con los de abajo."},
  {"id":"R08","name":"Tira patio del riel superior","material":"rh","qty":3,"L":1000,"A":24,"t":15,"edges":["0.45","—","—","—"],"note":"Capa de abajo, de z −80 a z −56. Canto solo en el borde patio, a mano: es angosta para la canteadora."},
  {"id":"R09","name":"Taco de tope","material":"rh","qty":2,"L":46,"A":30,"t":15,"edges":["—","—","—","—"],"note":"Cierra cada punta del canal, encima del lateral. Pegado y atornillado: la barra choca aquí a 40° y 140°."},
  {"id":"R07","name":"Capa de lateral","material":"rh","qty":4,"L":1236,"A":160,"t":15,"edges":["0.45","0.45","—","—"],"note":"Dos capas por lado, entre los rieles, ancladas a la jamba del muro."},
  {"id":"B01","name":"Barra del mecanismo","material":"aluminio","qty":1,"L":2879,"A":25.4,"t":3.2,"edges":["—","—","—","—"],"note":"Platina de aluminio 1 × 1/8 pulg de una barra de 6 m. 30 agujeros de 7 mm a paso 98, centrados en el ancho; el primero a 18,5 mm de la punta. Limar las puntas hasta que tope a 40° y 140°."}
 ]
};
