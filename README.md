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

El catálogo de clósets carga la opción 2 definitiva, descrita más abajo; conserva la opción 1 como alternativa. Se retiró el clóset esquemático inicial. Las estanterías libres siguen siendo referencias editables, sin despiece de fabricación.

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

El aviso de ubicación detecta salidas del perímetro y una posible ocupación de los patios mediante la envolvente del mueble. Añade una comprobación puntual entre el clóset opción 1 y la puerta de habitación. No es un detector general de interferencias con muros, otros muebles o instalaciones. No sustituye planos de obra o de fabricación.

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


## Clóset opción 1

El catálogo retira la referencia esquemática inicial e incorpora **Clóset 1 · 288 cm · provisional**, con visor detallado en `closet-opcion1.html`. La geometría procede del archivo «Closet empotrado1.html» aportado por el usuario; el original permanece sin cambios. La opción 2 ya está integrada; la opción 3 está pendiente de recibir.

- Frente completo: 2880 mm. Hueco nominal medido por el usuario: 2900 mm, equivalente a 10 mm exteriores por lado si se centra. Debe comprobarse la medida mínima arriba, centro y abajo, plomo y nivel.
- Estructura interior: 2859 mm, con retranqueo interno de 10,5 mm por lado respecto al frente. No confundirlo con la holgura exterior de instalación.
- Alto del archivo: 2400 mm, por confirmar. Límite de profundidad confirmado por el usuario: 520 mm. La opción 1 se adapta con estructura de 398 mm, profundidad exterior completa 512 mm y reserva de 8 mm (520 mm necesarios). En la terraza se usa la profundidad completa, sin comprimir puertas ni rieles.
- Cuatro tramos: 715 + 677 + 677 + 715 mm útiles, cinco divisores de 15 mm. Seis cajones centrales, barras de colgado y maletero; cuatro puertas inferiores y dos superiores corredizas.
- Cada una de las seis hojas y cada uno de los seis cajones responde individualmente al clic. Las hojas respetan a su compañera de carril; un cajón bloqueado no sale y una hoja no se cierra sobre un cajón abierto. El control Abrir todo mantiene la secuencia de puertas primero y cajones después. Ambos visores comparten los movimientos en `assets/models/closet-motion.js`. El visor detallado usa las tarjetas y estilo de cocina; posiciones, tablas, inventario y ajustes quedan en desplegables. El despiece provisional está en `despiece-closet-opcion1.xlsx` y su vista web. Cantos, herrajes y presupuesto definitivo siguen pendientes.
- El usuario confirma que el lado derecho se utiliza solo con la puerta de habitación cerrada. El visor comprueba el giro dibujado y señala un cruce físico si aparece; falta comprobar ángulo y tope reales, sin confundir acceso tapado con contacto. Las correderas de cajón pasan a 350 mm. El modelo mantiene las puertas corredizas y su cenefa, que añaden 114 mm al cuerpo de 398 mm. Poco fondo para perchas convencionales: comprobar orientación de colgado, prendas y herrajes antes de fabricar. El original aportado de 500 mm de estructura no se modifica.

Restaurar la terraza carga el clóset 2 definitivo y la cocina final. Los proyectos guardados con la referencia inicial se abren con la opción 1 y sus dimensiones actuales; se conserva su posición. Las dimensiones de la opción 1 están fijas en el visor general; los cambios exploratorios del visor detallado no se sincronizan con la terraza.

En el visor detallado del clóset, ambos laterales son de ladrillo a la vista. La pared derecha termina a 520 mm del fondo; el saliente del marco de la puerta no está dimensionado ni se contabiliza como fondo útil adicional. El lateral izquierdo se prolonga solo como contexto visual.

Clóset 1: todo el tablero es RH15, incluidas las seis hojas. Los frentes de cajón se separan 30 mm; no hay repisas entre cajones. Bases inferiores aplicadas de 650 × 350 × 15 y paredes de 155 mm, conservando la altura exterior de caja de 170 mm. El inventario conserva decimales y refleja las juntas de zócalos/cenefas. El sistema de puertas sigue provisional: FSCPCM73 indica 18–36 mm en la web actual y 30 mm en ficha aportada, sin compatibilidad directa confirmada con 15 mm. PERALM73-2 mide 2050 mm; para tramos de 2880, comprobar la variante PERALM73-3 de 3050 mm. HRE320-45 de 450 mm no cabe en cajas de 350; cotizar variante de 350 mm y confirmar su descuento antes de cortar.

Despiece del clóset: `despiece-closet-opcion1.xlsx` y `despiece-closet-opcion1.html`. Incluye 19 líneas, 80 piezas RH15 y 20,053336 m² netos, sin errores de fórmulas. Los cantos no están elegidos y las medidas son terminadas. La pestaña Herrajes distingue referencias aportadas, piezas que no encajan y alternativas: Peralma + FSCPCM20 declara compatibilidad15–30 mm; Madecentro exige PERALM93 en ambos extremos para puertas15. Esta alternativa no está seleccionada ni modelada como herraje definitivo.


## Clóset definitivo (opción 2)

Elegido por el usuario el 27/10/2026. La opción 1 se conserva íntegra como alternativa. Los proyectos guardados respetan su elección; **Restaurar terraza inicial** y los nuevos clósets cargan la opción 2. No se modifica la cocina.

- Visor: `closet-opcion2.html`. Excel: `despiece-closet-opcion2.xlsx`; vista web: `despiece-closet-opcion2.html`. Geometría compartida: `assets/models/closet-opcion2.js`.
- Hueco medido 2900 × 2400 mm. Ancho nominal 2880, estructura 2860. Altura montada 2380 mm, incluida base 100; quedan 20 mm arriba antes de nivelar. El inspector muestra 238 cm reales, no 240 del hueco. Fondo 480 de cuerpo y 495 cerrado, reserva 498 dentro de 520. La regulación real de apoyos y calzos depende del montaje. Armar de pie o por partes: diagonal del conjunto 2380×480 ≈2428 mm.
- Tres cuerpos útiles 990 /820 /990. Seis hojas inferiores, tres tapas elevables de 518 de alto y tres cajones separados 30 mm, sin manijas y sin repisas entre ellos. Cada uno de los 12 elementos móviles abre de forma independiente.
- 75 piezas RH15 en 25 líneas,20,380586 m². Incluye 17 refuerzos:3 listones frontales de 80 y 3 traseros de 100 bajo maleteros,8 listones de 60 bajo repisas,3 refuerzos de 30 bajo bases de cajón. Dimensiones y cantidades conciliadas con la geometría.
- HRE320-40 zincado,400 mm,45 kg nominales:3 pares a$9.999, total$29.997. Vano 820 menos 27 confirmados = caja 793; base 793×400 debajo de paredes 155. Incluye 36 tornillos de 12 mm. El cajón completo de RH pesa unos 8,51 kg; la capacidad del riel no certifica la carga útil de la caja ni sus uniones.
- Bisagras candidatas:32 HBM897-02 semiparche abajo y 12 HBM306-01 parche arriba (unidades físicas). Cantidad, plantilla, base y compatibilidad con brazos por confirmar; no sumar capacidades nominales de pares para justificar el número.
- Seis brazos grises previstos, dos por tapa. Pesos aproximados de las hojas:5,07 kg laterales y 4,21 kg central con densidad 650 kg/m³, sin accesorios. Se retiró la selección orientativa 120/100 N. Fuerza y puntos de montaje se definen para altura 518 y peso real; el precio de HEC060-03 no se aplica a otras fuerzas sin cotizar.
- Las tapas superiores reciben peso propio **y esfuerzos de las bisagras**. En el lote de uniones se prevén 12 apoyos/escuadras metálicas (4 por tapa), sujetos a montaje y fijación compatibles con RH15. Los refuerzos requieren apoyos y uniones mecánicas definidos. El pegamento sobre canto decorativo no se considera una unión estructural; el taller determina superficies y adhesivo compatibles.
- Nueve agarres por elegir: seis puertas y tres tapas. Los tres cajones se abren por los 30 mm libres entre frentes. No añadir tiradores ni fresados a esos cajones.
- Anclaje lateral con calzos según la separación real.16 fijaciones es una previsión, no una capacidad demostrada del muro. Producto y tornillo según ladrillo y carga. Sin anclaje al cielo falso. El lado derecho se utiliza con puerta de habitación cerrada; comprobar tope real.
- Canto rígido 60,124 m netos (65 a pedir), flexible 123,956 (140 a pedir). Propuesta de 5 láminas RH15, sierra 4 y refilado 10 por lado, sin girar por veta. Confirmar acabado y mecanizado de piezas estrechas.
- Subtotal parcial$3.005.953. Faltan brazos,9 agarres, barras, apoyos, anclajes, uniones y servicios. Los despieces permanecen separados; no se ha creado una compra ni un corte conjunto.

La opción 2 se conserva como alternativa. La fabricación queda condicionada a plantillas de herrajes, uniones, anclajes y acabado, pendientes identificados en el Excel. El auditor comprueba números y encaje; su estimación de flexión supone uniones ideales y no certifica el mueble armado.

Regenerar web: `python herramientas/build_despiece_closet.py 2`.
Auditar Excel: `python herramientas/auditar_closet.py 2 5`.


## Clóset principal (opción 3): suspensión superior y tope

Visor `closet-opcion3.html`, manifiesto `assets/models/closet-opcion3-data.js`, geometría `assets/models/closet-opcion3.js` y despiece independiente `despiece-closet-opcion3.xlsx/html`. Se conservan opciones1 y2; los proyectos guardados respetan la selección. La opción 3 es el diseño elegido y se carga al crear o restaurar la terraza; las opciones 1 y 2 permanecen como alternativas. Los proyectos guardados conservan su selección. El despiece no se ha unido con cocina ni baño.

Referencia del usuario: puertas RH15 de80×220cm, colgadas arriba, guía inferior sin carga, manijas tubulares y un tope plástico con caucho detrás de la hoja exterior. Su clóset no presenta pandeo después de4 años. La propuesta tiene hojas de97,5×220cm, aproximadamente20,9kg RH cada una: esa diferencia de tamaño y la suspensión deben validarse antes de fabricar. Esta alternativa no incluye PERALM93; no se presenta como cumplimiento de la configuración de refuerzo publicada por Madecentro.

Cuerpo195×56×238cm. Zona frontal de referencia de7cm, de490 a560mm desde el fondo. Hoja interior500–515; exterior535–550;20mm entre tableros. Las manijas tienen35mm de saliente: la profundidad máxima real es585mm. El inspector muestra58,5cm contando las manijas; no significa que el RH crezca a esa profundidad. Con fondo RH15 queda485mm útil hasta la hoja interior.

El usuario confirmó un desfase de50mm al apilar. Se conserva siempre el orden exterior-izquierda/interior-derecha: la hoja exterior no puede sobrepasar a la interior. Hojas de975, solape cerrado30, desplazamiento895 y abertura libre895mm. Reparto interior ajustado a830/1075mm: se añaden50mm de tolerancia al cajonero respecto a la versión de880mm. Frentes de cajón824×210, separados30mm; cajas803×450 (830−27); refuerzo40mm bajo cada base. Frente máximo del cajonero en x842, inicio de hoja apilada en x910:68mm de margen al tablero. Cotas de manijas y topes representadas, no plantillas de perforación.

Un riel superior, rodamientos, una guía inferior y un tope con amortiguación sustituyen la representación anterior con rieles inferiores y perfiles verticales. Dos manijas HMA310-02 verticales de96mm entre centros, a$2.743/unidad. Kit FSCPCM20$12.730; perfil PERALMA50B2m$33.278. Confirmar si el kit ya incluye el tope y la guía concretos; no duplicar compras. El tope y las manijas se han colocado para no interferir durante el recorrido limitado.

43 piezas RH15,23 líneas;18,915945m² netos. Mismo RH15 y acabado de cocina. Previsión independiente de5 láminas; no se ha optimizado una compra conjunta. Definir uniones, soporte del riel y anclaje al muro posterior e izquierdo. No hay apoyo en el muro derecho.

Puerta de habitación de90cm y bisagra a52cm del muro posterior, confirmados. Eje lateral en288cm según terraza: con1cm a la izquierda y195 de mueble queda2cm al giro. La comprobación debe incluir las manijas y el recorrido de0–90°. Confirmar posición lateral exacta del eje y tope en obra.
