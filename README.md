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

La terraza reproduce la maqueta compartida: 20,30 × 5,75 m, franja construida de 3,00 × 7,50 m, muros nuevos de 12 cm y 2,50 m de alto, patios P1 y P2 sin losa. La altura inicial del perímetro, 1,10 m, es un supuesto ajustable.

El clóset inicial de 160 × 60 × 210 cm procede del volumen esquemático de esa maqueta. Su interior y las estanterías son **referencias visuales editables**, sin despiece ni presupuesto de fabricación.

La cocina conserva la geometría del visor actual: mesón 260 × 62 cm, cajonero único de 75 cm, bases inferiores de cajón y lavaplatos de submontar. Sus dimensiones no se escalan en el editor para no contradecir el despiece.

**Ubicación propuesta:** la cocina esquemática de la maqueta medía 210 cm. Se reemplazó por la cocina real de 260 cm contra el muro transversal de 3 m, con origen a 735 cm del fondo y 280 cm de la medianera, giro 90°. Esta ubicación se puede cambiar; no es una confirmación de instalaciones de gas, agua ni ventilación.

El aviso de ubicación detecta salidas del perímetro y una posible ocupación de los patios mediante la envolvente del mueble. No comprueba interferencias con muros, otros muebles, puertas abiertas ni instalaciones. No sustituye planos de obra o de fabricación.

## Archivos

| Ruta | Uso |
| --- | --- |
| `index.html`, `assets/app.css`, `assets/app.js` | Herramienta general y distribución de terraza |
| `assets/models/kitchen.js` | Cocina detallada reutilizable, separada de la interfaz |
| `assets/vendor/` | Three.js r128 y OrbitControls locales; no dependen de un CDN |
| `versiones-cocina.html` | Portada anterior con todas las versiones y descargas |
| `cocina-actual.html` | Visor detallado original de la cocina vigente |
| `cocina-260-doble-cajon.html`, `cocina-280.html` | Alternativas anteriores |
| `despiece-*.html`, `despiece-*.xlsx` | Vistas web y Excel conservados |

## Uso y mantenimiento

Sitio estático, sin compilación. GitHub Pages sirve la rama `main`, carpeta raíz; `.nojekyll` conserva los archivos tal cual. Todos los enlaces internos son relativos para permitir cambios de nombre del repositorio.

En el iPad, abre el enlace HTTPS en Safari. La vista rápida de un HTML desde Archivos no es un navegador y puede omitir el 3D. Se necesita WebGL y JavaScript. Una vez descargados los recursos, el visor no solicita bibliotecas ni fuentes externas; no hay instalación como app ni caché offline garantizada.

Para revisar localmente, sirve esta carpeta con cualquier servidor HTTP estático y abre `index.html`. El archivo JSON usa `schema: "espacios-3d"`, versión 1, y admite hasta 30 muebles. Se valida antes de sustituir el proyecto actual. Actualmente no importa GLB, OBJ ni diseños de Moblo: **Abrir proyecto** recibe archivos JSON exportados por Espacios 3D.

Al modificar el diseño de la cocina, actualiza tanto el visor detallado como `assets/models/kitchen.js` y el despiece correspondiente. Cambiar una ubicación en la terraza no altera el Excel. Antes de fabricar, verifica fichas, plantillas de recorte y medidas en obra.

Comprobado en navegador Chromium: escena sin errores, vistas individuales, edición y persistencia, alta y baja de muebles, alertas de perímetro y patios, contenido JSON exportado y reimportado, rechazo de archivos inválidos, enlaces existentes y tamaños de pantalla de iPad y móvil. Las descargas reales y los gestos requieren comprobación en el Safari del dispositivo.

## Dependencias

Three.js y OrbitControls r128, licencia MIT, © autores de Three.js. Fuentes de la distribución: [Three.js r128](https://github.com/mrdoob/three.js/tree/r128). Los avisos de licencia se conservan en los archivos distribuidos; consulta `assets/vendor/LICENSE.txt`.
