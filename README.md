# Espacios 3D

Visor de muebles y distribuciones para navegador, con controles táctiles para iPad.

**[Abrir Espacios 3D](https://williamppmm.github.io/espacios-3d/)**

El proyecto contiene los diseños elegidos para la terraza en Cali: la **cocina final de 260 cm**, el **clóset principal de 195 cm** y el **mueble flotante del baño con gabinete de espejo**. Cada uno tiene visor 3D detallado, despiece en Excel, pedido de corte, compras y pendientes; **`compras-proyecto.xlsx`** reúne los tres en un solo pedido de corte y un solo presupuesto. Las alternativas descartadas (Cocina 1 y 2, clóset opciones 1 y 2) se retiraron de `main` el 27/10/2026 y quedan en el historial de Git.

## Qué puedes hacer

- Explorar la terraza completa o un mueble por separado, en pantalla completa con la X arriba a la derecha.
- Abrir puertas y cajones tocándolos.
- En el visor detallado, abrir **Detalles del módulo**: el módulo se aísla, cada tabla muestra su código y medida terminada, y la lista indica cantos, corte teórico y herrajes del módulo.
- Cambiar posición y giro de los muebles, añadir otro clóset o una estantería libre.
- Alternar perspectiva, planta, frente y entrada; mostrar u ocultar cubierta, muros, etiquetas y aparatos de referencia.
- Guardar una imagen, descargar un proyecto JSON y abrirlo en otro dispositivo.

Los cambios se guardan en el almacenamiento de **ese navegador**, sin cuenta ni sincronización. Para llevarlos al iPad, descarga el proyecto y usa **Abrir proyecto** en el otro dispositivo. Los proyectos no se envían al servidor; la publicación y sus despieces son públicos. Un proyecto guardado con una versión retirada se abre con el diseño elegido.

## Terraza

Reproduce la maqueta compartida: 20,30 × 5,75 m; sobre la medianera, 2 m libres hasta el baño, baño de 1,20 m libres, habitación y cocina de 2 m libres hasta el patio 1; franja construida de 3,00 × 7,50 m, muros nuevos de 12 cm y 2,50 m de alto, patios P1 y P2 sin losa, con antepechos de ladrillo de 12 cm: P1 (central) de 1,20 m y P2 (trasero) de 0,60 m. La altura inicial del perímetro, 1,10 m, es un supuesto ajustable. Frente de entrada: reja metálica blanca de 1,20 m con los accesos de escalera (1,45 m) y entrada (0,95 m) libres.

La cocina va contra el muro transversal de 3 m, con origen a 750 cm del fondo y 260 cm de la medianera, giro 90°: en el rincón, con el extremo del basurero contra la medianera y 40 cm libres en el extremo opuesto del muro. El cierre de la cocina es todo en pino: ventanal de tablillas orientables, puerta plegable y cielo raso de panel de yeso, seleccionado inicialmente y al restaurar la terraza. Visores en `propuesta-4-tablillas-pino.html` (ventanal) y `puerta-plegable.html` (puerta y cielo raso), con acceso desde `ventana.html`; medidas en `assets/models/cortasol-pino-data.js`. Las alternativas RH y aluminio se conservan en `alternativas/ventanas/`, accesibles como referencia desde la página de la ventana.

El aviso de ubicación detecta salidas del perímetro, ocupación de los patios y el cruce entre el clóset y la puerta de la habitación; no sustituye planos de obra ni de fabricación.

## Cocina final (`cocina.html`)

Mesón 260 × 62 cm. Módulos bajos 15 + 63 + 67 + 70 + 40 cm (desde el 25/11/2026: el condimentero pasó de 18 a 15 cm y el hueco del horno de 60 a 63, por sugerencia del diseñador de Madecentro; arriba, S1 pasó de 19,5 a 16,5 y S2 de 60 a 63 para seguir alineados):

- **B1 (15 cm exterior, 12 cm libres):** condimentero Bonuit HSO317-15R cromado, herraje publicado de 100 × 446 × 470 mm y carga declarada de 35 kg. Rieles y dos enganches frontales incluidos; montaje por plantilla del accesorio suministrado. Fuente: https://madecentro.com/products/canasta-condimentero-tres-niveles-cierre-lento
- **B2 (63 cm exterior, 60 cm libres):** horno H60EEVAL005 y estufa. El vano de caja difiere del ruteo frontal de empotre; adaptar tapetas y apoyos con el horno y su manual. Reservar retales para esos ajustes en obra.
- **B3 (67 cm):** cajón cubiertero (riel HRE550-55N) y dos puertas con entrepaño.
- **B5 (70 cm):** lavaplatos Socoda AS350 de submontar; entrepaño desmontable con recorte de sifón en obra.
- **B4 (40 cm):** puerta superior y basurero extraíble HSO688-00 sobre bastidor provisional (P072–P074) con riel HRE126-55.
- **S2 sobre la campana (63 × 52,4 cm):** puerta abatible de 482 × 627 mm, peso estimado 3,0 kg. Base P075 de 600 × 335 mm, con cara inferior a 1620 mm, 120 mm sobre P052. Dos brazos HEC060-03, fuerza por seleccionar con la puerta real. Faja P071 de 600 × 60 mm, pedida a 70 mm y rebajada en el armado. Las demás puertas altas sobresalen 2 cm por debajo como agarre.
- **Golas:** superior y media; los rebajes en laterales y travesaños se hacen en el armado, cuando se defina el borde del granito.

85 piezas RH15 y 9 fondos de 6 mm; caben en 4 láminas RH15 y 1 de fondo (prueba de factibilidad; el plano de corte lo define el proveedor).

## Clóset principal (`closet.html`)

Cuerpo 195 × 56 × 238 cm (58,5 cm hasta las manijas), dos hojas corredizas colgantes de 2175 × 975 mm con riel PERALMA50B sobre un listón de pino 4 × 4 cm encajonado en los laterales, guía inferior sin carga y tope que conserva 50 mm de desfase. Cuerpo izquierdo de 83 cm útiles con tres cajones (rieles HRE320-45) y colgado corto; cuerpo derecho de 107,5 cm con doble colgado. Solapa frontal de 12 cm que tapa el riel. 49 piezas RH15, 15,895420 m² netos; previsión individual de 4 láminas. Sin panel posterior: marco perimetral completo con amarres superiores e inferiores y montantes de extremo C3-025 a C3-030. El divisor central existente une los dos cuerpos. Flexible de 0,45 mm solo en cada borde libre del cuadro interior. Uniones y anclajes al muro posterior resistente y al izquierdo por dimensionar.

Puerta de habitación de 90 cm con eje a 52 cm del muro posterior; el ancho de 195 cm supone el eje a 288 cm del muro izquierdo y debe confirmarse en obra.

## Compras del proyecto (`compras-proyecto.html`)

`compras-proyecto.xlsx` es lo que se lleva a la sucursal: se genera desde los Excel de los tres muebles con `herramientas/build_compras_proyecto.py` y no se edita a mano.

| Hoja | Para qué |
| --- | --- |
| Resumen | Láminas, rollos y bisagras por separado frente al conjunto, y total con precio conocido |
| Pedido de corte | Pedido único: 113 líneas de cocina, clóset y baño, con medida terminada y corte sin canto. Las hojas del clóset (2195) y P011 (160) se piden con sobremedida para recortar arriba en el armado |
| Láminas | Encaje conjunto propuesto (8 láminas RH15 y 1 de fondo frente a 9 + 2 por separado) |
| Cantos | Metros netos por mueble y compra conjunta revisada: 61 m rígidos y 186 m flexibles con reservas; caben en 1 rollo rígido de 100 m y 1 flexible de 200 m |
| Compras | Lista consolidada; las bisagras HBM897-01 de cocina y baño se compran juntas |
| Bloqueos | Lo que impide cortar: hoy solo confirmar en obra el eje de la puerta de la habitación (ancho del clóset) |
| En el armado | Piezas que no se piden (bastidor provisional del basurero P072–P074, de un sobrante), piezas de menos de 70 mm con canto pedidas a 70, el mínimo del optimizador de Madecentro, para que vengan canteadas de fábrica, y rebajadas en el armado (faja P071 a 60, refuerzos C3-019 a 40; sin canto saldrían de un retal), recortes de sobremedida, rebajes de gola, corte diagonal de B06 y recortes en obra |

El espejo, el retal de granito y el mesón son de otros proveedores; lavamanos, grifería y equipos se eligen aparte.

## Los Excel de despiece

`despiece-cocina.xlsx`, `despiece-closet.xlsx` y `despiece-bano.xlsx` son la fuente de verdad de cada mueble. Los tres tienen las mismas hojas (Distribución solo en la cocina):

| Hoja | Para qué |
| --- | --- |
| Despiece | Cada pieza: medidas terminadas (largo en el sentido de la veta), cantidad, cantos por lado y corte teórico |
| Pedido de corte | Lo que se lleva a la sucursal: medidas a pedir, canto por borde (R = 2 mm, F = 0,45 mm), piezas pequeñas que podrían no cantearse y canto extra para el armado |
| Compras | Materiales, herrajes, equipos y servicios con precio, uso y fuente |
| Cantos | Metros netos, reserva y rollos; criterio de canteo |
| Pendientes | Lo que falta resolver y qué piezas bloquea |
| Decisiones | Registro de lo ya aplicado |
| Distribución (cocina) | Cotas de cada módulo sobre el muro |

Criterio de cantos en cocina y clóset: sin canto en bordes ocultos contra otra pieza, el fondo, el muro o el mesón; con canto en bordes vistos, en el borde inferior de los laterales bajos, el superior de muebles altos y laterales del clóset, y en los cuatro bordes de las piezas expuestas a humedad. El baño, por ser zona húmeda, lleva canto en todos los bordes, incluidos los ocultos.

El optimizador de Madecentro admite un solo tipo de canto por pieza. Criterio revisado: rígido de 2 mm solo en lo que abre o se mueve (puertas y frentes de cocina, hojas y frentes de cajón del clóset, panel B06 y tapa del espejo S06 del baño) y en el panel fijo bajo la estufa P011, que va en el plano de las puertas. Flexible de 0,45 mm en todo lo demás, aunque esté a la vista (costado P037, piso compartido P052, faja P071, solapa del clóset, laterales exteriores): el rígido puede no coincidir con el color del RH y fuera de las puertas se vería como una línea. Se conservan los bordes que ya estaban protegidos; P029 lleva flexible en sus cuatro bordes. El baño conserva todos sus bordes protegidos. El canto rígido se reserva por golpes y desgaste: el espesor no convierte el RH en impermeable; sellar juntas, recortes y perforaciones. B06 es un panel único rígido en el pedido; los dos bordes diagonales nuevos se cantean con flexible durante el armado, fuera del optimizador.

Las medidas terminadas y posiciones del modelo no cambian. Cambian los descuentos del tablero, metrajes y plano de corte. Los dos formatos cortes-madecentro-*-medidas-finales.xlsx llevan medidas finales con canto incluido y una hoja de recepción para registrar bordes pendientes; el proveedor debe descontar el canto una sola vez, incluso si no lo instala. Decorativo y referencia compatible se confirman antes de cortar.

## Archivos

| Ruta | Uso |
| --- | --- |
| `index.html` | Vista rápida (portada): cocina, clóset o baño a pantalla completa, con sus módulos. Carga `cocina.html`, `closet.html` o `bano.html` con `?rapida`, que abre el visor ya en pantalla completa (`assets/fullscreen.js`) |
| `terraza.html`, `assets/app.css`, `assets/app.js` | Vista detallada: herramienta general y distribución de la terraza (antes `index.html?vista=detallada`, que ahora redirige aquí) |
| `cocina.html`, `assets/cocina.js` | Visor detallado de la cocina |
| `closet.html`, `assets/closet.js` | Visor detallado del clóset |
| `assets/visor.css` | Estilos de los visores detallados |
| `assets/models/cocina-data.js`, `closet-data.js` | Piezas y posiciones; deben coincidir con su Excel |
| `assets/models/cocina-modelo.js`, `closet-modelo.js` | Geometría 3D de cada mueble |
| `assets/models/cocina-herrajes.js`, `closet-herrajes.js` | Herrajes repartidos por módulo para el visor de detalles |
| `assets/module-detail.js`, `assets/fullscreen.js` | Detalles del módulo y pantalla completa, compartidos |
| `assets/vendor/` | Three.js r128 y OrbitControls locales; no dependen de un CDN |
| `bano.html`, `assets/bano.js`, `assets/models/bano-data.js`, `bano-modelo.js` | Visor, piezas, herrajes por módulo y geometría del baño |
| `despiece-*.xlsx`, `despiece-*.html` | Excel fuente y su vista web de solo lectura |
| `compras-proyecto.xlsx`, `compras-proyecto.html` | Pedido de corte y presupuesto conjuntos, generados desde los tres Excel |
| `herramientas/` | Scripts para regenerar las vistas web y auditar los Excel |
| `recorridos/terraza-cartagena-realista.mp4` | Recorrido en vídeo de 31 s, 1280 × 720 |

Fuera de Git: `blender/` (escena `terraza-cartagena-realista.blend`, Blender 5.2 con Eevee, usada para el recorrido; no se sincroniza con el visor) y `alternativas/` (versión final de cada diseño descartado, copia local).

## Uso y mantenimiento

Sitio estático, sin compilación. GitHub Pages sirve la rama `main`, carpeta raíz; `.nojekyll` conserva los archivos tal cual. Los enlaces internos son relativos.

En el iPad, abre el enlace HTTPS en Safari; la vista rápida de Archivos no ejecuta el 3D. Para revisar localmente, sirve esta carpeta con cualquier servidor HTTP estático y abre `index.html`. El proyecto JSON usa `schema: "espacios-3d"`, versión 1, hasta 30 muebles.

### Al cambiar un diseño

1. Edita el Excel y **guárdalo en Excel** (así conserva los valores calculados).
2. Actualiza `assets/models/<mueble>-data.js` y, si cambia la forma, `<mueble>-modelo.js`.
3. Regenera la vista web y audita:

```
pip install openpyxl
python herramientas/build_despiece.py          # despiece-cocina.html
python herramientas/build_despiece_closet.py   # despiece-closet.html
python herramientas/auditar_despiece.py        # cocina: Excel ↔ 3D, choques, cantos, láminas
python herramientas/auditar_closet.py 5        # clóset: cantos, láminas y flechas
python herramientas/build_despiece_bano.py     # despiece-bano.html
python herramientas/auditar_bano.py            # baño: Excel ↔ 3D, cortes y cantos
python herramientas/auditar_cantos.py          # canto único por pieza y coherencia del pedido conjunto
cd herramientas && python build_compras_proyecto.py   # compras-proyecto.xlsx y .html
```

4. Abre `compras-proyecto.xlsx` en Excel y guárdalo, para que conserve los totales calculados.
5. Haz commit del Excel, su HTML, los archivos del modelo y las compras del proyecto juntos.

Las auditorías solo leen archivos y devuelven un código de error si encuentran diferencias. Cambiar una ubicación en la terraza no altera el Excel. Antes de fabricar, verifica fichas, plantillas de recorte y medidas en obra.

### Reutilizar en otro proyecto de melamina

Cada mueble se compone de un Excel de despiece (`despiece-<mueble>.xlsx`), un manifiesto de piezas (`<mueble>-data.js`, con la posición de cada pieza; debe coincidir con el Excel), su modelo 3D y su visor. El visor de detalles, la pantalla completa, el criterio de cantos y la hoja Pedido de corte no dependen del mueble concreto.

## Dependencias

Three.js y OrbitControls r128, licencia MIT, © autores de Three.js. Fuentes: [Three.js r128](https://github.com/mrdoob/three.js/tree/r128). Los avisos de licencia se conservan en `assets/vendor/LICENSE.txt`.

## Baño (`bano.html`)

Conjunto nuevo basado en las fotos IMG_4304–4307 y medidas del usuario: cuerpo inferior de 520 ×470 ×450mm, base a260mm del suelo, dos puertas con separación central diagonal y nicho de150mm bajo el granito. Con puertas cerradas llega a465mm de fondo. Gabinete superior450 ×500 ×130mm, con tapa/espejo320 ×500mm a la izquierda, dos repisas interiores y columna derecha abierta de115mm con una repisa. RH15 como cocina y clóset; fondo blanco RH6 aplicado detrás del gabinete.

Granito provisional550 ×470 ×20mm: cara superior a750mm del suelo. Se interpretan510mm desde esa cara al gabinete superior, que va de1260 a1760mm. El conjunto tiene1500mm de altura entre piezas extremas y arranca a260mm. LavamanosØ350 ×140mm, grifería, sifón, agujeros y muesca trasera del entrepaño son ilustrativos: necesitan equipos y plantillas reales. El frente B06 se pide como un solo panel de517 ×299mm terminado (RH sin canto513 ×295mm si el proveedor descuenta los cuatro cantos de2mm). El corte central se hace en el armado: 75° provisional desde horizontal, dentro de 70–80°, con el disco Diablo Ultra Finish 7-1/4" (corte de 0,059" ≈ 1,5 mm) y canto flexible 0,45 mm en ambos lados. Con ese disco la holgura entre puertas queda en ≈0,6 mm tras cantear; lo usual son 2–3 mm, así que antes del corte se decide si se da una segunda pasada o se lijan los bordes. No se modela un bisel superior a45°. Suspensión flotante, soportes del granito y anclajes por dimensionar con el instalador.

`despiece-bano.xlsx/html`: 17 paneles RH15 de suministro (1,538983m²; el panel B06 da dos puertas y resultan18 piezas montadas) y un fondo RH6 (0,221216m²), más espejo y granito. Su tablero, fondo, canto y bisagras se compran junto con los de cocina y clóset en `compras-proyecto.xlsx`; el resto sigue por cotizar. Generar vista web con `python herramientas/build_despiece_bano.py`.

La terraza inicial incorpora el baño en x212,z220cm,giro90°, en la pared del sanitario, manteniendo la esquina del baño. Al abrir proyectos previos se incorpora una sola vez y se corrige una vez la ubicación anterior en la pared de la puerta; después se respeta si el usuario decide quitarlo. Sustituye la referencia esquemática anterior del lavamanos.

### Marco posterior completo sin panel · 28/10/2026

Se retiran C3-005 y C3-011. Pared estucada a la vista, marco completo C3-025 a C3-030: dos superiores de 830×100 y 1075×100, dos inferiores de las mismas medidas y dos montantes de 2050×100, RH15. Solo flexible de 0,45 mm en el borde largo libre interior de cada tira; el resto son uniones ocultas sin canto. Se mantienen pisos, divisor, amarres del maletero y bastidor de pino. El marco ocupa la franja z=0–15 mm del respaldo anterior y no mueve hojas, rieles ni cajones. Es obligatorio dimensionar y ejecutar uniones y fijaciones al muro posterior resistente y al izquierdo; no basta el estuco ni apoyar en la esquina. Un marco abierto no garantiza por sí solo la resistencia del respaldo completo.

El PDF anterior de Madecentro (98 referencias RH15, 141 piezas) incluye los respaldos retirados y no corresponde a esta revisión. La revisión del 28/10 llevaba 102 referencias RH15, 145 piezas, además de 10 fondos RH6 de cocina y baño. El encaje conjunto encontrado mantiene 8 láminas RH15 y 1 RH6; menos superficie no se presupone ahorro de láminas.

### Revisión de cocina del 25/11/2026

B1 pasa a 150 mm y B2 a 630 mm exteriores; sus luces con RH15 son 120 y 600 mm. S1 pasa a 165 mm y S2 a 630 mm para conservar la alineación del horno, la estufa y la campana en x = 695 mm. Los módulos desde B3 y S3 conservan sus posiciones; mesón de 2600 × 620 mm.

S2 mide 524 mm de alto: P045 524 × 320, fondo P048 626 × 511 y puerta P049 482 × 627. P075 mide 600 × 335 y ocupa y1620–1635; P076 mide 275 × 70 y ocupa y1635–1705. Se conservan la faja retranqueada y las cuatro escuadras del soporte. Chasis de campana 84 mm, envolvente con vidrio 94 mm, centrada con la estufa; su parte inferior queda a 614 mm del cristal. Montaje y salidas de recirculación según la ficha Haceb y la plantilla real. Dos brazos previstos para unos 3,0 kg de puerta; fuerza por seleccionar.

El modelo y los Excel contienen 73 referencias de cocina, 85 piezas RH15 y nueve fondos. El pedido conjunto contiene 102 referencias RH15 (146 piezas) y diez referencias RH6 (diez fondos). Las cinco piezas del bastidor del basurero se obtienen de retales. El encaje conjunto de referencia conserva ocho láminas RH15 y una RH6. Los formatos Madecentro mantienen las medidas finales con canto y las sobremedidas de armado indicadas en cada pieza.

## Cierre de la cocina en pino (`ventana.html`)

`ventana.html` presenta el ventanal y la puerta con el cielo raso. Las referencias anteriores se consultan en `alternativas/ventanas/index.html`. El despiece del pino sigue separado de `compras-proyecto.xlsx`.

Alternativa archivada, `alternativas/ventanas/propuesta-3-tablillas-rh.html`: cortasol de tablillas orientables de melamina RH15, color por definir (gris humo de referencia). Son 30 tablillas de 105 × 15 × 1232 mm, con paso de 98 mm, en tres paneles, dentro de un marco doble de 30 × 160 mm: dos capas de RH pegadas con PU, con la melamina lijada y prensada con tornillos ocultos. Cada tablilla gira sobre pines de persiana: fijo abajo, que carga el peso en la pestaña, y con resorte arriba, para montarla y sacarla. Un pasador de varilla inoxidable de 1/4" a 30 mm del eje entra en un agujero redondo de una barra de RH de 912 × 24 × 15. La barra flota en el canal de 40 mm que dejan las tiras de la capa superior del riel inferior, sin ruteado. Una perilla sale por una ventana de 56 mm en la tira cocina; sus bordes limitan el giro de 37° a 143° (mínimo 45 % de paso de aire). El LED es opcional y va en el rebaje del riel superior. Las medidas archivadas están en `alternativas/ventanas/assets/models/cortasol-rh-data.js`, fuente del visor (`alternativas/ventanas/assets/propuesta-lamas-rh.js`), del archivo de referencia y de `alternativas/ventanas/herramientas/build_cortasol_rh.py`, que genera `despiece-cortasol-rh.xlsx` y `.html`, un libro independiente de `compras-proyecto`. Resultado: 2 láminas (82 % y 42 %) y 125 m de canto flexible.

Medido en obra el 21/11/2026 (antes era un diseño de 300 × 130 sobre antepecho de 120). **Ventanal** de 3080 × 1260 mm, de la medianera al filo del ladrillo, sobre un antepecho de ladrillo a la vista de 10 cm y 1300 de alto, hasta el cielo raso a 2560. Marco de **pino macizo de 40 × 140** (100 del ladrillo + 18 de pestaña y 2 de vuelo por cara): rieles enteros de 3080, sacados de piezas de 4 m, y laterales y **montante central** de 1176 entre ellos, a tope con dos tarugos de 10 × 60 y dos tornillos de 5 × 100. El montante divide el ventanal en dos cuerpos de 1480 mm y rigidiza el conjunto. **30 tablillas** de pino alistonado de 100 × 18 × 1170, 15 por cuerpo a paso 98,7, sobre dos pines uxcell con resorte; cada cuerpo tiene **su platina de aluminio de 1 × 1/8" y 1423 mm** en un canal de 43 × 18 ruteado por debajo del riel superior, con tres tacos de tope de 40 mm (laterales y montante): giro de 40° a 140°, mínimo 46 % de paso de aire. Pestañas de 18 × 60 por las dos caras del antepecho y remate en el extremo libre; 8 tornillos al ladrillo, 3 a la medianera y 3 al poste de la puerta. **Puerta plegable** en un vano de 1910 (muro de la habitación al filo del ladrillo): dos parales iguales de 80 × 100 (dos piezas de 40 × 100 pegadas), uno contra el muro y otro en la esquina, de piso a cielo, 20 mm del vuelo del ventanal y 1730 para cuatro hojas de 427 × 2060 × 36; dintel de 40 × 100 de canto a 2130, como la puerta metálica, y **sobreluz** de 19 tablillas fijas de 60 × 18 hasta el cielo raso. **Cielo raso** de panel de yeso blanco de 12,7 mm sobre omegas de 19 mm y viguetas de 38 mm, como ambientación. Validar calibre, separaciones y apoyos antes de comprar. Medidas en `assets/models/cortasol-pino-data.js`, fuente común del visor del ventanal (`assets/propuesta-lamas-pino.js`), de la puerta (`assets/models/puerta-plegable-*.js`, `assets/puerta-plegable.js`), de la terraza y de `herramientas/build_pino_cocina.py`, que genera `despiece-pino-cocina.xlsx` y `.html`: despiece, plan de corte en piezas de 4 m (3 de 4 × 14 y 9 de 4 × 10), encaje de referencia en 4 tableros alistonados de 2440 × 1220 × 18, panel de yeso, herrajes, acabado y pendientes.


## Pedido RH15 y LED opcional · 31/10/2026

El formato RH15 contiene 101 referencias y 145 piezas con medidas finales con canto incluido. Madecentro debe calcular el tablero según el espesor real suministrado; 2 mm y 0,45 mm son referencias actuales. El control muestra cortes teóricos, que no se usan como medidas finales si cambia el canto. Actualizados control y recepción; retiradas P060/P061/P067.

El LED se previsualiza con un control independiente en cocina y terraza, apagado por defecto. Se propone una línea con difusor bajo P052, eje a 30 mm del borde frontal, con iluminación cálida orientativa. No cambia dimensiones, cantidad de paneles ni servicios del pedido; la ranura opcional se fresa al ensamblar y se dimensiona con el perfil real. Referencia de solución empotrada y difusor: https://www.sensiolighting.com/blogs/news/how-to-choose-an-led-profile .

Disco Diablo aportado: 0,059 pulgadas equivalen a 1,4986 mm (el modelo usa 1,5 mm redondeados). B06 se pide entero; una pasada y dos cantos de 0,45 mm dejan aproximadamente 0,62 mm entre hojas a 75 grados. Definir y probar el ancho de la junta antes del corte final; si se busca 2–3 mm libres, el ancho retirado debe incluir esos cantos.


## Documentación de suministro depurada · 31/10/2026

Los seis Excel son la referencia actual: despieces de cocina, clóset y baño; compras-proyecto; formatos Madecentro RH15 y RH6. Sus notas separan el suministro de paneles de los ajustes en armado. Eliminadas decisiones repetidas y referencias históricas que contradecían el soporte S2, los cantos flexibles de la solapa y el encaje del fondo del baño. El LED es opcional; la diagonal B06 se ajusta en armado y no bloquea pedir su panel entero.

Se mantienen los números, fórmulas, cantidades, precios y dimensiones aprobadas. El proveedor trabaja con medidas finales con canto y aplica el descuento según el espesor real. Se conservan verificaciones de herrajes, anclajes, equipos y medidas de obra aún no documentadas como resueltas. Las vistas HTML y las notas de los manifiestos 3D reflejan el texto de los libros finales.


## Tapa fija del cajonero y LED opcional del clóset · 31/10/2026

La tapa C3-031 forma parte del modelo, el despiece y el pedido RH15: 830 × 475 × 15 mm, con canto flexible frontal. Su cara inferior está a 875 mm y deja 30 mm sobre el frente superior del cajón. Se fija a los laterales mediante cuatro soportes, incluidos en el lote de uniones pendiente de cotizar. No se añaden separadores entre los tres cajones.

El LED permanece opcional, apagado por defecto: dos tramos con difusor bajo los pisos del maletero, detrás de los refuerzos frontales. Perfil, fijación y fuente por elegir. El control se guarda en el navegador y se traslada al visor detallado. La tapa fija no tiene control de ocultación.


Ventanal adoptado · 04/11/2026: pino por defecto, con migración única del guardado anterior sin mover muebles. Las selecciones posteriores se conservan. La terraza replica marco, montante, pestañas, barras y sentido de las 30 tablillas del visor individual. Desde el 21/11/2026 dibuja el antepecho de la cocina a 1,30 m, la puerta a 2,13 m con su sobreluz y el cielo raso de panel de yeso a 2,56 m con perfilería metálica; el antepecho de la cocina pasa de x = 9,56 a 9,46 (constante `KITCHEN_X` en `assets/app.js`), así el vano queda en los 1910 reales y el patio 1 gana 10 cm.


Puertas superiores en milímetros enteros · 04/11/2026: P056/P057 de 717 × 324 mm y P063/P064 de 717 × 354 mm, medidas finales con canto. S3/S4 conservan 1,5 mm en los extremos exteriores y 4 mm entre hojas. Modelo, despiece de cocina, consolidado y formato RH15 actualizados.


Alternativa en rama `opcion-cielo-panel-yeso`: placa blanca con cara inferior a +2560, sobre omegas y viguetas galvanizadas. Los perfiles del 3D muestran una distribución provisional; validar sistema, luces, calibre y anclajes en obra. La carpintería de machimbre anterior se conserva en `main`. El despiece de esta rama excluye la carrera y las siete viguetas de pino y calcula el barniz de la carpintería restante.
