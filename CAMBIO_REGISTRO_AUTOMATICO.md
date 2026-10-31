# Registro automático de cuestionarios

Al presionar «Ver resultado» en cualquier módulo, la página envía automáticamente un intento al receptor de Google Apps Script. No hay casilla opcional. Se informa esta recopilación antes de responder.

Los resultados llegan a Google Sheets solo si la implementación pública original de Apps Script sigue activa y configurada correctamente. No se ha verificado una respuesta de red real; `fetch` usa `no-cors` y no puede confirmar la escritura. Comprobá la pestaña Respuestas y el historial de Ejecuciones de la implementación de recepción.

Este archivo conserva el panel privado `admin.html` de la versión anterior. El informe automático sigue requiriendo que la segunda aplicación privada tenga acceso a la hoja y una implementación correcta.
