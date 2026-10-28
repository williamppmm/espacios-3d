# Espacios 3D

Visor de muebles y distribuciones para navegador, con controles táctiles para iPad.

**[Abrir Espacios 3D](https://williamppmm.github.io/espacios-3d/)**

El proyecto contiene los dos diseños elegidos para la terraza de Cartagena: la **cocina final de 260 cm** y el **clóset principal de 195 cm**. Cada uno tiene visor 3D detallado, despiece en Excel, pedido de corte, compras y pendientes. Las alternativas descartadas (Cocina 1 y 2, clóset opciones 1 y 2) se retiraron de `main` el 27/10/2026 y quedan en el historial de Git.

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

La cocina va contra el muro transversal de 3 m, con origen a 750 cm del fondo y 280 cm de la medianera, giro 90°. El aviso de ubicación detecta salidas del perímetro, ocupación de los patios y el cruce entre el clóset y la puerta de la habitación; no sustituye planos de obra ni de fabricación.

## Cocina final (`cocina.html`)

Mesón 260 × 62 cm. Módulos bajos 18 + 60 + 67 + 70 + 40 cm:

- **B1 (18 cm exterior, 15 cm libres):** condimentero HSO317-15R. El herraje con sus rieles mide 135 mm (medido en una cocina real).
- **B2 (60 cm):** horno H60EEVAL005 y estufa; nicho y ventilación según manual.
- **B3 (67 cm):** cajón cubiertero (riel HRE550-55N) y dos puertas con entrepaño.
- **B5 (70 cm):** lavaplatos Socoda AS350 de submontar; entrepaño desmontable con recorte de sifón en obra.
- **B4 (40 cm):** puerta superior y basurero extraíble HSO688-00 sobre bastidor provisional (P072–P074) con riel HRE126-55.
- **S2 sobre la campana:** puerta abatible hacia arriba con dos brazos HEC060-03 y faja de agarre fija.
- **Golas:** superior y media; los rebajes en laterales y travesaños se hacen en el armado, cuando se defina el borde del granito.

85 piezas RH15 y 9 fondos de 6 mm; caben en 4 láminas RH15 y 1 de fondo (prueba de factibilidad; el plano de corte lo define el proveedor).

## Clóset principal (`closet.html`)

Cuerpo 195 × 56 × 238 cm (58,5 cm hasta las manijas), dos hojas corredizas colgantes de 2175 × 975 mm con riel PERALMA50B sobre un listón de pino 4 × 4 cm encajonado en los laterales, guía inferior sin carga y tope que conserva 50 mm de desfase. Cuerpo izquierdo de 83 cm útiles con tres cajones (rieles HRE320-45) y colgado corto; cuerpo derecho de 107,5 cm con doble colgado. Solapa frontal de 12 cm que tapa el riel. 44 piezas RH15, previsión de 5 láminas.

Puerta de habitación de 90 cm con eje a 52 cm del muro posterior; el ancho de 195 cm supone el eje a 288 cm del muro izquierdo y debe confirmarse en obra.

## Los Excel de despiece

`despiece-cocina.xlsx` y `despiece-closet.xlsx` son la fuente de verdad. Hojas:

| Hoja | Para qué |
| --- | --- |
| Despiece | Cada pieza: medidas terminadas (largo en el sentido de la veta), cantidad, cantos por lado y corte teórico |
| Pedido de corte | Lo que se lleva a la sucursal: medidas a pedir, canto por borde (R = 2 mm, F = 0,45 mm), piezas pequeñas que podrían no cantearse y canto extra para el armado |
| Compras | Materiales, herrajes, equipos y servicios con precio, uso y fuente |
| Cantos | Metros netos, reserva y rollos; criterio de canteo |
| Pendientes | Lo que falta resolver y qué piezas bloquea |
| Decisiones | Registro de lo ya aplicado |
| Distribución (cocina) | Cotas de cada módulo sobre el muro |

Criterio de cantos: sin canto en bordes ocultos contra otra pieza, el fondo, el muro o el mesón; con canto en bordes vistos, en el borde inferior de los laterales bajos, el superior de muebles altos y laterales del clóset, y en los cuatro bordes de las piezas expuestas a humedad.

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
| `despiece-*.xlsx`, `despiece-*.html` | Excel fuente y su vista web de solo lectura |
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
```

4. Haz commit del Excel, su HTML y los archivos del modelo juntos.

Las auditorías solo leen archivos y devuelven un código de error si encuentran diferencias. Cambiar una ubicación en la terraza no altera el Excel. Antes de fabricar, verifica fichas, plantillas de recorte y medidas en obra.

### Reutilizar en otro proyecto de melamina

Cada mueble se compone de un Excel de despiece (`despiece-<mueble>.xlsx`), un manifiesto de piezas (`<mueble>-data.js`, con la posición de cada pieza; debe coincidir con el Excel), su modelo 3D y su visor. El visor de detalles, la pantalla completa, el criterio de cantos y la hoja Pedido de corte no dependen del mueble concreto.

## Dependencias

Three.js y OrbitControls r128, licencia MIT, © autores de Three.js. Fuentes: [Three.js r128](https://github.com/mrdoob/three.js/tree/r128). Los avisos de licencia se conservan en `assets/vendor/LICENSE.txt`.
