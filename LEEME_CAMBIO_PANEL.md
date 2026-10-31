# Panel simplificado de resultados GoKollab

Ahora el panel muestra para cada uno de los tres módulos y sus tres preguntas: aciertos, fallos, total de respuestas, porcentaje de aciertos y porcentaje de fallos. Los datos se calculan de los registros de tipo `answer`, sin depender de primeros intentos ni cuestionarios finalizados.

## Publicación
Subí `admin.html` y `api/reporte.js` a GitHub respetando la carpeta `api`. Estos son los ÚNICOS DOS ARCHIVOS que necesitás reemplazar si tu sitio ya funciona. Al hacer commit en la rama vinculada, Vercel publica automáticamente. El resto de la carpeta está incluido para tener un proyecto completo.

## Nota
Cada selección cuenta, incluso si un alumno abandona el cuestionario. Los reintentos se cuentan de nuevo. El CSV conserva el detalle. La actualización del panel sucede cada 15 segundos.
