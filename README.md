# GoKollab · Reporte automático con Vercel Blob

## Publicación

1. Conectá un **Vercel Blob Private** al proyecto y activá la variable de escritura `BLOB_READ_WRITE_TOKEN` (no compartir su valor).
2. En Vercel → Project Settings → Environment Variables, agregá `ADMIN_PASSWORD` con una clave fuerte (no uses `1234` en producción); aplicala a Production y Preview si corresponde.
3. Subí el contenido de esta carpeta al repositorio GitHub, con `index.html`, `admin.html`, `package.json`, `api/` y `assets/` en la raíz.
4. Verificá que Vercel detecte `@vercel/blob` en `package.json` y publique el proyecto. Si se conectó Blob después del último despliegue, realizá uno nuevo para incorporar las variables.
5. Respondé una pregunta del módulo 1; en el store Private debería aparecer un blob bajo `resultados/module1/`.
6. Abrí `/admin.html`, ingresá `ADMIN_PASSWORD` y observá las estadísticas. Se actualizan cada 15 segundos. Podés descargar el CSV.

## Diseño

- Cada selección de respuesta crea **un blob inmutable**. Al finalizar un cuestionario, se guarda otro registro con las tres respuestas y el puntaje.
- No se solicita nombre ni correo. Un ID aleatorio por intento sirve para vincular respuestas parciales y resultado final (no garantiza personas únicas).
- Si falla el envío, el navegador conserva temporalmente eventos pendientes y reintenta cuando vuelve a estar en línea o al recargar.
- El reporte se protege por contraseña validada del lado del servidor. El administrador no debe compartirla. `admin.html` en sí es público, pero las estadísticas no se entregan sin la contraseña.
- No se usa CSV como almacenamiento editable: el CSV se **genera al exportar** para evitar pérdida de datos concurrentes.
- Se recomienda una revisión periódica de costos/límites de Blob y una política de retención de datos. Como la API pública no autentica a alumnos, los registros pueden ser manipulados y los indicadores son orientativos, no certificados.

## Recursos

Se conservaron los tres videos, dos PDF, una infografía y nueve MP3. El sitio no requiere Google Sheets ni Apps Script.
