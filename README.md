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

La cocina va contra el muro transversal de 3 m, con origen a 750 cm del fondo y 260 cm de la medianera, giro 90°: en el rincón, con el extremo del basurero contra la medianera y 40 cm libres en el extremo opuesto del muro. **Propuesta para la cocina** (Terraza y capas): capa opcional sobre el antepecho del patio 1. Cubre los 3 m de extremo a extremo, incluido el tramo sobre la nevera, con A) ventana corrediza y rejillas, B) panel transl?cido y rejillas, C) lamas verticales orientadas (selecci?n inicial y al restaurar la terraza) o D) tres paneles corredizos de lamas. En D, las tres hojas de 1 m se apilan hacia el extremo de la nevera y ocupan aproximadamente 1 m de ancho recogidas. Se conservan el antepecho y las rejillas previstas. El constructor debe validar estructura, recorridos y anclajes; el gasista, la ventilaci?n.

El aviso de ubicación detecta salidas del perímetro, ocupación de los patios y el cruce entre el clóset y la puerta de la habitación; no sustituye planos de obra ni de fabricación.

## Cocina final (`cocina.html`)

Mesón 260 × 62 cm. Módulos bajos 18 + 60 + 67 + 70 + 40 cm:

- **B1 (18 cm exterior, 15 cm libres):** condimentero HSO317-15R. El herraje con sus rieles mide 135 mm (medido en una cocina real).
- **B2 (60 cm):** horno H60EEVAL005 y estufa; nicho y ventilación según manual.
- **B3 (67 cm):** cajón cubiertero (riel HRE550-55N) y dos puertas con entrepaño.
- **B5 (70 cm):** lavaplatos Socoda AS350 de submontar; entrepaño desmontable con recorte de sifón en obra.
- **B4 (40 cm):** puerta superior y basurero extraíble HSO688-00 sobre bastidor provisional (P072–P074) con riel HRE126-55.
- **S2 sobre la campana (45 cm de alto):** deja 15 cm libres para la campana Tofu 60 (84 mm de chasis y 94 mm con vidrio según ficha; soporte al mueble por definir). Puerta abatible de 447 × 597 hacia arriba con dos brazos HEC060-03 y faja de agarre fija P071, cortada de un retal. Las demás puertas altas sobresalen 2 cm por debajo como agarre.
- **Golas:** superior y media; los rebajes en laterales y travesaños se hacen en el armado, cuando se defina el borde del granito.

88 piezas RH15 y 9 fondos de 6 mm; caben en 4 láminas RH15 y 1 de fondo (prueba de factibilidad; el plano de corte lo define el proveedor).

## Clóset principal (`closet.html`)

Cuerpo 195 × 56 × 238 cm (58,5 cm hasta las manijas), dos hojas corredizas colgantes de 2175 × 975 mm con riel PERALMA50B sobre un listón de pino 4 × 4 cm encajonado en los laterales, guía inferior sin carga y tope que conserva 50 mm de desfase. Cuerpo izquierdo de 83 cm útiles con tres cajones (rieles HRE320-45) y colgado corto; cuerpo derecho de 107,5 cm con doble colgado. Solapa frontal de 12 cm que tapa el riel. 48 piezas RH15, 15,501170 m² netos; previsión individual de 4 láminas. Sin panel posterior: marco perimetral completo con amarres superiores e inferiores y montantes de extremo C3-025 a C3-030. El divisor central existente une los dos cuerpos. Flexible de 0,45 mm solo en cada borde libre del cuadro interior. Uniones y anclajes al muro posterior resistente y al izquierdo por dimensionar.

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
| En el armado | Piezas que no se piden (faja P071 de la campana y bastidor del basurero P072–P074, de un sobrante), recortes de sobremedida, rebajes de gola, corte diagonal de B06 y recortes en obra |

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

El optimizador de Madecentro admite un solo tipo de canto por pieza. Criterio revisado: rígido de 2 mm en puertas y frentes de cocina, hojas y frentes de cajón del clóset, terminal exterior P037 y perímetro del panel B06 del baño. Flexible de 0,45 mm en estructura, entrepaños, interiores, solapa del clóset y portador del espejo. Se conservan los bordes que ya estaban protegidos; P029 lleva flexible en sus cuatro bordes. El baño conserva todos sus bordes protegidos. El canto rígido se reserva por golpes y desgaste: el espesor no convierte el RH en impermeable; sellar juntas, recortes y perforaciones. B06 es un panel único rígido en el pedido; los dos bordes diagonales nuevos se cantean con flexible durante el armado, fuera del optimizador.

Las medidas terminadas y posiciones del modelo no cambian. Cambian los descuentos del tablero, metrajes y plano de corte. Los dos formatos cortes-madecentro-*-medidas-finales.xlsx llevan medidas finales con canto incluido y una hoja de recepción para registrar bordes pendientes; el proveedor debe descontar el canto una sola vez, incluso si no lo instala. Decorativo y referencia compatible se confirman antes de cortar.

## Archivos

| Ruta | Uso |
| --- | --- |
| `index.html`, `assets/app.css`, `assets/app.js` | Herramienta general y distribución de la terraza |
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

### Revisión de cocina del 29/10/2026

S2 mantiene caja de 450 mm: P045 450×320, fondo P048 596×446 y puerta P049 447×597. Se conserva P047 elevado y faja P071 de retal. Se añaden base P075 570×335 (y1655–1670) y dos apoyos P076 275×70 (y1670–1740), todos RH15 con flexible 0,45 en cuatro bordes. Unir apoyos a costados/P047 y base mediante cuatro escuadras, sin depender sólo del tornillo al canto. Fijar la campana por su plantilla real, con tornillos adecuados al tablero de 15 mm. Se cortan rectángulos, sin mecanizado de fábrica. Los apoyos z6–281 quedan 5 mm detrás de la faja z286–301.

Ficha Haceb Tofu 9002650 rev.00: chasis 84 mm, envolvente con vidrio 94 mm, recirculación, sin anclaje directo a pared. El chasis termina en y1655, bajo P075; su base nominal con vidrio queda en y1561: 649 mm sobre el cristal de la estufa (y912), por encima de los 600 mm mínimos de la ficha. Mantener libres las salidas. No perforar un ducto supuesto. Fuente: https://firplak.com/wp-content/uploads/2024/05/Campana-TOFU-60-V3-NEGRO.pdf . Dos brazos previstos: seleccionar fuerza por altura y peso real (puerta ≈2,7 kg); 60 N y su precio siguen provisionales. B4 superior y S5 limitadas a 90° junto a la pared; prever topes compatibles.

Quedan 76 referencias de cocina, 88 piezas RH15 y nueve fondos. Pedido conjunto: 113 referencias, 147 piezas RH15 y diez fondos RH6. Encaje conjunto encontrado: ocho RH15 más una RH6, con disco de 5 mm; flexible con reserva 186 m. El precio conocido se conserva, sin incluir cotizaciones faltantes de escuadras, fijaciones y cambios de brazos. No se incorporan las alternativas de aligerar la cocina del estudio independiente.

## División cocina–patio (`ventana-cocina-patio.html`)

Ficha independiente de la propuesta C para cotización: 3D, alzado, detalle en planta, texto para enviar e impresión. Cielo raso al filo de la pared/ventanal, como en la terraza general. Vista inicial desde patio con tres módulos de 14 lamas (42 total): T-244 de 38,1 mm de cara y 76,2 mm de fondo, F-006 representado por su envolvente de 96,7 × 4,2 mm y largo provisional de 1220 mm. Horizontales entre montantes de 923,8 mm. Conserva las comparaciones originales de 27 y 28 lamas. Cortes orientativos y cotización aportada; sección del enchape, rigidez, fijaciones y holguras por validar antes de fabricar. Página visual resumida y detalles técnicos desplegables. La fijación superior se solicita a estructura resistente, no a la placa del cielo raso. No modifica la geometría general ni los muebles/despieces. Enlace accesible desde la navegación principal, con librerías 3D locales para Safari/iPad.
