# Espacios 3D

Visor de muebles y distribuciones para navegador, con controles táctiles para iPad.

**[Abrir Espacios 3D](https://williamppmm.github.io/espacios-3d/)**

## Qué puedes hacer

- Explorar la terraza completa o un mueble por separado.
- Ver la cocina detallada de 260 cm y abrir puertas y cajones.
- Editar las medidas de un clóset de referencia o una estantería, añadir ejemplares y cambiar su posición y giro.
- Alternar perspectiva, planta, frente y entrada; mostrar u ocultar cubierta, muros, etiquetas y aparatos de referencia.
- Guardar una imagen, descargar un proyecto JSON y abrirlo en otro dispositivo.

Los cambios se guardan en el almacenamiento de **ese navegador**, sin cuenta ni sincronización. Para llevarlos al iPad, descarga el proyecto y usa **Abrir proyecto** en el otro dispositivo. Los proyectos no se envían al servidor. La publicación y sus archivos de despiece siguen siendo públicos.

## De dónde vienen las medidas

La terraza reproduce la maqueta compartida: 20,30 × 5,75 m; sobre la medianera, 2 m libres hasta el baño, baño de 1,20 m libres, habitación y cocina de 2 m libres hasta el patio 1; franja construida de 3,00 × 7,50 m, muros nuevos de 12 cm y 2,50 m de alto, patios P1 y P2 sin losa. La altura inicial del perímetro, 1,10 m, es un supuesto ajustable.

El clóset inicial de 288 × 50 × 210 cm ocupa todo el muro y queda dentro de la habitación, con el fondo apoyado en el muro que la separa de la cocina. Su interior y las estanterías son **referencias visuales editables**, sin despiece ni presupuesto de fabricación.

La cocina conserva la geometría del visor actual: mesón 260 × 62 cm, cajonero único de 75 cm, bases inferiores de cajón y lavaplatos de submontar. Sus dimensiones no se escalan en el editor para no contradecir el despiece. En el inspector se elige la versión: **actual de 260** (la definitiva) o la **alternativa de 280**; cada una enlaza su despiece y su visor detallado. Al cambiar de versión, el mueble conserva fija la esquina del muro de 3 m. El clóset admitirá sus propias versiones cuando tenga diseño.

**Ubicación propuesta:** la cocina esquemática de la maqueta medía 210 cm. Se reemplazó por la cocina real de 260 cm contra el muro transversal de 3 m, con origen a 750 cm del fondo y 280 cm de la medianera, giro 90°. Esta ubicación se puede cambiar; no es una confirmación de instalaciones de gas, agua ni ventilación.

El aviso de ubicación detecta salidas del perímetro y una posible ocupación de los patios mediante la envolvente del mueble. No comprueba interferencias con muros, otros muebles, puertas abiertas ni instalaciones. No sustituye planos de obra o de fabricación.

## Archivos

| Ruta | Uso |
| --- | --- |
| `index.html`, `assets/app.css`, `assets/app.js` | Herramienta general y distribución de terraza |
| `assets/models/kitchen.js` | Cocina detallada reutilizable en sus dos versiones (actual 260 y 280), separada de la interfaz |
| `assets/vendor/` | Three.js r128 y OrbitControls locales; no dependen de un CDN |
| `versiones-cocina.html` | Portada anterior con todas las versiones y descargas |
| `cocina-actual.html` | Visor detallado original de la cocina vigente |
| `cocina-280.html` | Visor detallado de la alternativa de 280 |
| `despiece-*.html`, `despiece-*.xlsx` | Vistas web y Excel conservados |
| `herramientas/build_despiece.py` | Regenera los `despiece-*.html` desde los Excel |

## Uso y mantenimiento

Sitio estático, sin compilación. GitHub Pages sirve la rama `main`, carpeta raíz; `.nojekyll` conserva los archivos tal cual. Todos los enlaces internos son relativos para permitir cambios de nombre del repositorio.

En el iPad, abre el enlace HTTPS en Safari. La vista rápida de un HTML desde Archivos no es un navegador y puede omitir el 3D. Se necesita WebGL y JavaScript. Una vez descargados los recursos, el visor no solicita bibliotecas ni fuentes externas; no hay instalación como app ni caché offline garantizada.

Para revisar localmente, sirve esta carpeta con cualquier servidor HTTP estático y abre `index.html`. El archivo JSON usa `schema: "espacios-3d"`, versión 1, y admite hasta 30 muebles. Se valida antes de sustituir el proyecto actual. Actualmente no importa GLB, OBJ ni diseños de Moblo: **Abrir proyecto** recibe archivos JSON exportados por Espacios 3D.

### Regenerar el despiece

Tras cambiar un `despiece-*.xlsx`, guárdalo en Excel y ejecuta desde la raíz del repo:

```
pip install openpyxl
python herramientas/build_despiece.py          # todas las versiones
python herramientas/build_despiece.py actual   # solo una
```

El script usa los valores que Excel guarda al grabar; si faltan, recalcula con LibreOffice en una copia temporal. No edites los HTML a mano.

Al modificar el diseño de la cocina, actualiza tanto el visor detallado como `assets/models/kitchen.js` y el despiece correspondiente. Cambiar una ubicación en la terraza no altera el Excel. Antes de fabricar, verifica fichas, plantillas de recorte y medidas en obra.

Comprobado en navegador Chromium: escena sin errores, vistas individuales, edición y persistencia, alta y baja de muebles, alertas de perímetro y patios, contenido JSON exportado y reimportado, rechazo de archivos inválidos, enlaces existentes y tamaños de pantalla de iPad y móvil. Las descargas reales y los gestos requieren comprobación en el Safari del dispositivo.

## Dependencias

Three.js y OrbitControls r128, licencia MIT, © autores de Three.js. Fuentes de la distribución: [Three.js r128](https://github.com/mrdoob/three.js/tree/r128). Los avisos de licencia se conservan en los archivos distribuidos; consulta `assets/vendor/LICENSE.txt`.
