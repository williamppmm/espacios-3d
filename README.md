# Espacios 3D

Visor de muebles y distribuciones para navegador, con controles táctiles para iPad.

**[Abrir Espacios 3D](https://williamppmm.github.io/espacios-3d/)**

## Recorridos en vídeo

- [Recorrido con materiales e iluminación mejorados](recorridos/terraza-cartagena-realista.mp4): 31 segundos, 1280 × 720, 24 fps. Generado a partir del modelo del proyecto; conserva mobiliario esquemático de referencia.
El recorrido anterior fue retirado; se conserva únicamente la versión mejorada.

El menú principal incluye **Ver recorrido**, que abre la versión mejorada.

## Modelo editable en Blender

Escena local: `blender/terraza-cartagena-realista.blend`. La carpeta Blender y sus copias de trabajo están excluidas de Git; este archivo no se publica en GitHub Pages.

Escena generada a partir de la geometría del proyecto para el recorrido mejorado. Conserva geometría, materiales procedurales, iluminación y cámara animada: 744 fotogramas a 24 fps (31 segundos), con salida prevista de 1280 × 720. Preparada en Blender 5.2 con Eevee; no requiere texturas externas.

El archivo Blender es una copia independiente para edición y renderizado: sus cambios no se sincronizan automáticamente con el visor Three.js ni con los despieces. Algunos muebles y aparatos conservan geometría esquemática de referencia.

## Qué puedes hacer

- Explorar la terraza completa o un mueble por separado.
- Ver la cocina detallada de 260 cm y abrir puertas y cajones.
- Editar las medidas de un clóset de referencia o una estantería, añadir ejemplares y cambiar su posición y giro.
- Alternar perspectiva, planta, frente y entrada; mostrar u ocultar cubierta, muros, etiquetas y aparatos de referencia.
- Guardar una imagen, descargar un proyecto JSON y abrirlo en otro dispositivo.

Los cambios se guardan en el almacenamiento de **ese navegador**, sin cuenta ni sincronización. Para llevarlos al iPad, descarga el proyecto y usa **Abrir proyecto** en el otro dispositivo. Los proyectos no se envían al servidor. La publicación y sus archivos de despiece siguen siendo públicos.

## De dónde vienen las medidas

La terraza reproduce la maqueta compartida: 20,30 × 5,75 m; sobre la medianera, 2 m libres hasta el baño, baño de 1,20 m libres, habitación y cocina de 2 m libres hasta el patio 1; franja construida de 3,00 × 7,50 m, muros nuevos de 12 cm y 2,50 m de alto, patios P1 y P2 sin losa. La altura inicial del perímetro, 1,10 m, es un supuesto ajustable.

El clóset inicial de 288 × 50 × 210 cm ocupa todo el muro y queda dentro de la habitación, con el fondo apoyado en el muro que la separa de la cocina. Su interior y las estanterías son **referencias visuales editables**, sin despiece ni presupuesto de fabricación. El clóset admitirá sus propias versiones cuando tenga diseño.

## Cocina

En el inspector se elige la versión de la cocina; cada una enlaza su visor detallado y su despiece. Al cambiar de versión, el mueble conserva fija la esquina del muro de 3 m. Las dimensiones no se escalan en el editor para no contradecir el despiece. **Restaurar terraza inicial** carga el diseño final, y los proyectos guardados conservan su selección hasta restaurarlos.

| Versión | Qué es | Visor detallado | Despiece | Excel |
| --- | --- | --- | --- | --- |
| **Final** (`propuesta`) | Mesón 260 × 62 cm. 18 + 60 + 67 + 70 + 40: condimentero, horno y estufa, cajón cubiertero con puertas, lavaplatos y basurero | `cocina-propuesta.html` | `despiece-propuesta.html` | `despiece-propuesta.xlsx` |
| **Cocina 1** (`actual`) | Mesón 260 × 62 cm, cajonero único de 75 cm, bases inferiores de cajón y lavaplatos de submontar | `cocina-actual.html` | `despiece-actual.html` | `despiece-actual.xlsx` |
| **Cocina 2** (`280`) | Mesón 280 cm, dos cajoneros de 47,5 cm y platero de 91,5 cm | `cocina-280.html` | `despiece-280.html` | `despiece-280.xlsx` |

`versiones-cocina.html` es la portada con todas las versiones y descargas.

### Diseño final

- **B1 (18 cm exterior, 15 cm libres):** condimentero HSO317-15R, a la izquierda. El herraje con sus dos rieles laterales mide 135 mm (medido en una cocina real), por eso necesita 150 mm libres.
- **B3 (67 cm):** un cajón para cubiertos y dos puertas inferiores con entrepaño removible.
- **B4 (40 cm):** puerta superior, entrepaño fijo y basurero extraíble inferior HSO688-00, a la derecha. Deja la zona del escurridor sobre el mesón.
- **S2 sobre la campana:** puerta única de 347 × 597 mm, abatible hacia arriba a 90°, con dos bisagras en el techo y dos brazos grises HEC060-03. Faja RH fija de 570 × 60 mm retranqueada 25 mm respecto al reverso del frente; el piso sube 40 mm para permitir el agarre. La animación no es una plantilla de perforación.
- **Basurero:** plataforma RH15 provisional de 343 × 550 mm sobre bastidor inferior de 60 mm (P072–P074), con rieles laterales HRE126-55 de 55 cm, cierre normal, 38 kg, $12.560/par. Confirmar descuento de ancho, altura del riel, bandeja real, holguras y fijación del frente antes de cortar. No cambia la fachada.
- **Golas:** previsión de 10 fijaciones (8 en extremos y 2 intermedias); referencia y compatibilidad por confirmar.
- **Despiece:** 85 piezas RH15 y 9 fondos de 6 mm. El encaje se verificó por cálculo: las piezas RH15 caben en 4 láminas de 2440 × 2150 mm y los fondos en 1, con cortes pasantes, sin rotar y con refilado de 10 mm y sierra de 4 mm. Es una prueba de factibilidad; el plano de corte lo define el proveedor.
- **Compras:** $6.851.217 COP con precio y 12 partidas por cotizar. Incluye HSO317-15R a $122.902 y HSO688-00 a $109.700, y dos brazos HEC060-03 a $9.126 cada uno, todos aportados el 26/10/2026. Los demás precios conservan la base anterior. Se retiran HSO460-30 y HSO228-90R; el cajón B3 usa un par HRE550-55N y las puertas requieren 24 bisagras físicas.

### Ubicación en la terraza

La cocina esquemática de la maqueta medía 210 cm. Se reemplazó por la cocina real de 260 cm contra el muro transversal de 3 m, con origen a 750 cm del fondo y 280 cm de la medianera, giro 90°. Esta ubicación se puede cambiar; no es una confirmación de instalaciones de gas, agua ni ventilación.

El aviso de ubicación detecta salidas del perímetro y una posible ocupación de los patios mediante la envolvente del mueble. No comprueba interferencias con muros, otros muebles, puertas abiertas ni instalaciones. No sustituye planos de obra o de fabricación.

## Archivos

| Ruta | Uso |
| --- | --- |
| `index.html`, `assets/app.css`, `assets/app.js` | Herramienta general y distribución de terraza |
| `assets/models/kitchen.js` | Cocina detallada reutilizable (Final, Cocina 1 y Cocina 2), separada de la interfaz |
| `assets/models/kitchen-propuesta.js` | Geometría del diseño final |
| `assets/models/cocina-propuesta-data.js` | Piezas, posiciones y resumen del diseño final; deben coincidir con su Excel |
| `assets/vendor/` | Three.js r128 y OrbitControls locales; no dependen de un CDN |
| `cocina-propuesta.html`, `cocina-actual.html`, `cocina-280.html` | Visores detallados de cada versión |
| `despiece-*.xlsx` | Excel fuente de cada versión (la fuente de verdad) |
| `despiece-*.html` | Vistas web de solo lectura generadas desde los Excel |
| `versiones-cocina.html` | Portada con todas las versiones y descargas |
| `herramientas/build_despiece.py` | Regenera los `despiece-*.html` desde los Excel |
| `herramientas/auditar_despiece.py` | Comprueba que Excel y modelo 3D coincidan y que las piezas quepan en las láminas |

## Uso y mantenimiento

Sitio estático, sin compilación. GitHub Pages sirve la rama `main`, carpeta raíz; `.nojekyll` conserva los archivos tal cual. Todos los enlaces internos son relativos para permitir cambios de nombre del repositorio.

En el iPad, abre el enlace HTTPS en Safari. La vista rápida de un HTML desde Archivos no es un navegador y puede omitir el 3D. Se necesita WebGL y JavaScript. Una vez descargados los recursos, el visor no solicita bibliotecas ni fuentes externas; no hay instalación como app ni caché offline garantizada.

Para revisar localmente, sirve esta carpeta con cualquier servidor HTTP estático y abre `index.html`. El archivo JSON usa `schema: "espacios-3d"`, versión 1, y admite hasta 30 muebles. Se valida antes de sustituir el proyecto actual. Actualmente no importa GLB, OBJ ni diseños de Moblo: **Abrir proyecto** recibe archivos JSON exportados por Espacios 3D.

### Flujo de trabajo al cambiar el diseño de la cocina

1. Edita el Excel de la versión y **guárdalo en Excel** (así conserva los valores calculados).
2. Actualiza el modelo 3D: `assets/models/cocina-propuesta-data.js` y `assets/models/kitchen-propuesta.js` para el diseño final, o `assets/models/kitchen.js` y el visor detallado para las otras versiones.
3. Regenera la vista web del despiece.
4. Audita.
5. Haz commit del Excel, su HTML y los archivos del modelo juntos.

### Regenerar el despiece

Desde la raíz del repo:

```
pip install openpyxl
python herramientas/build_despiece.py              # todas las versiones
python herramientas/build_despiece.py propuesta    # solo una: propuesta, actual o 280
```

El script usa los valores que Excel guarda al grabar; si faltan, recalcula con LibreOffice en una copia temporal. No edites los HTML a mano.

### Auditar el despiece

```
python herramientas/auditar_despiece.py              # diseño final (propuesta)
python herramientas/auditar_despiece.py propuesta 4  # con el número de láminas previstas
```

Comprueba que Excel y modelo 3D describan las mismas piezas con las mismas medidas, que no haya piezas que se crucen, que los metros de canto coincidan con la hoja Cantos, que los totales de Distribución cuadren y que las piezas quepan en las láminas previstas. Solo lee archivos; devuelve un código de error si encuentra diferencias, así que puede ejecutarse antes de cada commit.

Cambiar una ubicación en la terraza no altera el Excel. Antes de fabricar, verifica fichas, plantillas de recorte y medidas en obra.

Comprobado en navegador Chromium: escena sin errores, vistas individuales, edición y persistencia, alta y baja de muebles, alertas de perímetro y patios, contenido JSON exportado y reimportado, rechazo de archivos inválidos, enlaces existentes y tamaños de pantalla de iPad y móvil. Las descargas reales y los gestos requieren comprobación en el Safari del dispositivo.

## Dependencias

Three.js y OrbitControls r128, licencia MIT, © autores de Three.js. Fuentes de la distribución: [Three.js r128](https://github.com/mrdoob/three.js/tree/r128). Los avisos de licencia se conservan en los archivos distribuidos; consulta `assets/vendor/LICENSE.txt`.
