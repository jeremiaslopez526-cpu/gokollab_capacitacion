# Actualización: registro por cada respuesta

Se registran los clics en las opciones del cuestionario apenas se seleccionan, sin esperar a «Ver resultado».

- `RespuestasParciales` registra un evento por pregunta respondida. Permite ver actividad parcial.
- `Respuestas` continúa registrando **solo el cuestionario completo** al tocar «Ver resultado». El panel de aprobación calcula sus tasas a partir de esta hoja, no de respuestas parciales.
- No se solicitan nombres ni correos. El ID de sesión temporal permite relacionar las preguntas dentro de un intento, sin identificar a una persona.

## Actualizar Google Apps Script (obligatorio)
1. Abrí el proyecto **original** Apps Script «Registro de resultados GoKollab», vinculado a Google Sheets. No el panel privado.
2. Reemplazá el contenido de `Código.gs` con `GoogleAppsScript.gs` de este ZIP.
3. Guardá y ejecutá `inicializar()` UNA vez para crear `RespuestasParciales` (la hoja `Resumen` se reconfigura; **no borra** `Respuestas`).
4. En **Implementar > Gestionar implementaciones**, editá la implementación pública con el lápiz, seleccioná **Nueva versión** y confirmá. No hace falta cambiar la URL pública.
5. Probá el Módulo 1 seleccionando una respuesta y comprobá que aparezca en `RespuestasParciales`. Al finalizar, debe aparecer además una fila en `Respuestas`.

## Publicar el sitio
Subí el `index.html` actualizado de este ZIP a tu repositorio GitHub. Mantené todos los archivos `assets` existentes. Vercel realizará el despliegue al confirmar el commit.

**Limitación:** Apps Script + `fetch(..., mode:"no-cors")` no permite al navegador verificar la confirmación del servidor. Fallas de red pueden causar registros faltantes. La URL pública puede recibir envíos falsos, por lo que los resultados son indicadores orientativos. Las respuestas no se identifican con alumnos individuales.

**Privacidad:** avisar claramente antes del cuestionario que las respuestas se registran al seleccionarse y que el análisis es anónimo respecto del nombre/correo. La conexión con el servidor puede contener metadatos técnicos propios de los servicios, aunque estos no se guarden en la planilla.
