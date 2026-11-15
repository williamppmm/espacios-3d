/* Cortasol de tablillas RH orientables con marco doble, independiente de los muebles. Medidas terminadas en mm, con canto incluido.
   Fuente única para el visor (assets/propuesta-lamas-rh.js), la terraza (assets/app.js) y herramientas/build_cortasol_rh.py.
   Ángulo: 90° = tablilla perpendicular al muro (abierta); 37° y 143° = topes. z > 0 = lado cocina. */
window.CortasolRHData={
 "name":"Cortasol de tablillas RH orientables",
 "status":"Propuesta en estudio; color por definir; independiente de cocina, clóset y baño",
 "vano":{"L":3000,"H":1300,"nota":"Medida exterior del ventanal sobre el antepecho del patio 1 (+120 a +250 cm). Medir el vano real en tres puntos antes de cortar."},
 "lama":{"A":105,"t":15,"n":30,"holgura":2,"tolerancia":4,"nota":"Ancho 105 para que el corte (104,1) supere el mínimo de 100 mm de la canteadora de Madecentro. 2 mm libres en cada punta para la pestaña del pin."},
 "angulo":{"min":37,"max":143,"inicial":45,"nota":"La ventana de la perilla hace de tope: a 37° y 143° la tablilla queda a 2,6 mm del lateral y el paso de aire no baja del 45 %."},
 "marco":{"capa":15,"t":30,"A":160,"tramo":1000,"paneles":3,"nota":"Todo el marco en dos capas de RH15 pegadas con PU: rieles arriba y abajo en tres tramos de 1000 y un lateral a cada lado. Lijar la melamina de las caras que se pegan y prensar con tornillos ocultos."},
 "mecanismo":{
  "manivela":30,
  "canal":{"z0":8,"z1":48,"nota":"Espacio entre la tira patio y la tira cocina de la capa superior del riel inferior: no hay que rutear."},
  "barra":{"L":912,"A":24,"agujero":9,"nota":"Tira de RH15 que flota en el canal sobre la melamina de la base. Un agujero redondo por tablilla, a 9 mm del borde patio, endurecido con epóxico."},
  "ventana":{"L":56,"nota":"Hueco en la tira cocina, al centro de cada tramo. Por ahí sale el vástago de la perilla; sus bordes son los topes."},
  "perilla":{"d":22,"vastago":8},
  "pines":{"inferior":"pin fijo de persiana (repair pin), 1,0 pulg, pestaña 0,31 pulg","superior":"pin con resorte de persiana, 0,78 pulg, pestaña 0,31 pulg","punta":5,"nota":"Medir cuerpo y punta de los pines recibidos antes de perforar."},
  "anclaje":"tornillo 4,5 × 50 con chazo plástico de 6 mm","anclajes":{"rielInferior":4,"rielSuperior":4,"lateral":4}
 },
 "led":{"perfil":[16,8],"lado":"cocina","z0":63,"z1":80,"nota":"Perfil en el rebaje que deja la capa inferior del riel superior en su borde cocina: queda a ras y las tablillas pasan por debajo."},
 "parts":[
  {"id":"T01","name":"Tablilla orientable","qty":30,"L":1232,"A":105,"t":15,"edges":["0.45","0.45","—","—"],"note":"Canto flexible en los dos lados largos; sellar las puntas. Abajo: pin fijo al centro y pasador de manivela (varilla inox 1/4 × 26: 10 en la tablilla con epóxico, 14 en la barra) a 30 mm del centro, sobre la línea media del espesor, todos hacia el mismo canto. Arriba: pin con resorte al centro."},
  {"id":"R01","name":"Base del riel inferior","qty":3,"L":1000,"A":160,"t":15,"edges":["0.45","0.45","—","—"],"note":"Capa de abajo, entera, sobre el antepecho. Lleva los 10 agujeros de los pines fijos a paso 98 y es el fondo del canal donde corre la barra."},
  {"id":"R02","name":"Tira patio del riel inferior","qty":3,"L":1000,"A":88,"t":15,"edges":["0.45","—","—","—"],"note":"Capa de arriba, del lado patio (de z −80 a z 8). Canto solo en el borde patio; el otro forma el canal. Los agujeros de los pines la atraviesan."},
  {"id":"R03","name":"Tira cocina del riel inferior","qty":6,"L":472,"A":32,"t":15,"edges":["0.45","—","0.45","—"],"note":"Capa de arriba, del lado cocina (de z 48 a z 80), dos por tramo con la ventana de 56 mm al centro. Canto en el borde cocina y en la punta que da a la ventana."},
  {"id":"R04","name":"Barra del mecanismo","qty":3,"L":912,"A":24,"t":15,"edges":["—","—","—","—"],"note":"Flota en el canal. 10 agujeros de 1/4 a paso 98 y a 9 mm del borde patio; inserto M6 en el canto cocina para el vástago de la perilla. Sellar todos los cantos."},
  {"id":"R05","name":"Base del riel superior","qty":3,"L":1000,"A":160,"t":15,"edges":["0.45","0.45","—","—"],"note":"Capa de arriba, contra la estructura del techo; no contra la placa del cielo raso."},
  {"id":"R06","name":"Capa inferior del riel superior","qty":3,"L":1000,"A":143,"t":15,"edges":["0.45","0.45","—","—"],"note":"De z −80 a z 63: deja el rebaje de 17 × 15 para el perfil LED en el borde cocina. 10 agujeros para los pines con resorte, alineados con los de abajo."},
  {"id":"R07","name":"Capa de lateral","qty":4,"L":1236,"A":160,"t":15,"edges":["0.45","0.45","—","—"],"note":"Dos capas por lado, entre los rieles, ancladas a la jamba del muro."}
 ]
};
