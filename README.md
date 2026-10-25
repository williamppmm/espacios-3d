# Cocina terraza 3D · melamina Cartagena

Modelo 3D interactivo (Three.js/WebGL) y despiece para el proveedor de la cocina de la terraza.

**Ver en línea:** https://williamppmm.github.io/cocina-3d/

## Contenido

| Archivo | Qué es |
|---|---|
| `index.html` | Portada del proyecto con enlaces a cada versión |
| `cocina-actual.html` | 3D vigente: mesón 260 · cajonero único 75 |
| `cocina-260-doble-cajon.html` | Alternativa: mesón 260 · cajoneros de 30 y 45 |
| `cocina-280.html` | Alternativa: mesón 280 · dos cajoneros de 47,5 |
| `despiece-*.html` | Vista web (solo lectura) del Excel: despiece, herrajes, compras, cantos, distribución y revisión |
| `despiece-*.xlsx` | Excel fuente con fórmulas (el que se envía al proveedor) |
| `.nojekyll` | Indica a GitHub Pages que sirva los archivos tal cual, sin procesarlos con Jekyll |

## Cómo actualizar

1. Exporta el nuevo `Cocina Cartagena 3D.html` / Excel.
2. Renómbralos con el nombre de la versión (p. ej. `cocina-actual.html`, `despiece-actual.xlsx`).
3. *Add file → Upload files* en este repo; al subir un archivo con el mismo nombre, GitHub lo reemplaza.
4. Las vistas `despiece-*.html` se generan desde el Excel; si cambia el Excel, hay que regenerarlas.

GitHub Pages tarda 1–2 minutos en publicar cada cambio.

> Repo público: cualquiera con el enlace puede ver el modelo, el despiece y los precios de referencia.
