# Reporte anónimo de cuestionarios · GoKollab

## 1. Crear la planilla (privada)
- En Google Drive, creá una hoja de cálculo llamada **GoKollab · Resultados**.
- Entrá a **Extensiones → Apps Script**. Pegá el contenido de `GoogleAppsScript.gs` y guardá.
- Seleccioná la función `inicializar` y ejecutala una vez; autorizá el acceso a tu propia planilla. Se crean `Respuestas` y `Resumen`.

## 2. Publicar el receptor
- En Apps Script: **Implementar → Nueva implementación → Aplicación web**.
- **Ejecutar como: Yo**. **Quién tiene acceso: Cualquiera** (el receptor público es necesario para recibir datos anónimos sin iniciar sesión; la hoja de cálculo sigue siendo privada).
- Copiá la URL terminada en `/exec`. **No compartas el acceso a la planilla**.
- Importante: la URL de recepción es pública y puede recibir registros falsos; no sirve para resultados certificados ni decisiones de alto impacto.

## 3. Conexión configurada
La URL de la aplicación web ya fue incorporada a `index.html`. No necesitás editarla. Subí los archivos del proyecto a GitHub sin cambiar la estructura de `assets/`.

## 4. Probar
- Abrí el sitio publicado, entrá a un módulo, marcá la casilla de consentimiento y completá el cuestionario.
- Abrí la planilla y verificá una nueva fila en `Respuestas`.
- En `Resumen` mirá totales y tasas de los primeros intentos.
- Si no aparece nada, revisá URL `/exec`, permisos de la implementación y ejecuciones/errores en Apps Script.
- **Advertencia:** desde una web estática se usa un envío `no-cors`; el navegador no puede confirmar que Google lo haya guardado. No se debe declarar éxito del registro sin mirar Sheets.

## Interpretación y privacidad
- Cada fila es un **intento**, no una persona. Puede haber múltiples intentos o varios navegadores.
- Se registran fecha, módulo, número de intento local, opciones A/B/C, aciertos y puntaje. No se solicitan nombres, correos ni un identificador estable del participante.
- La casilla de envío anónimo es opcional; se guarda la preferencia en el navegador. Si no se marca, el resultado se conserva solo localmente.
- No se envían respuestas históricas. Revisá la política de privacidad de la institución y el acceso a Google Sheets antes de usarlo con alumnos reales.
- Para medir la autonomía, complementá el cuestionario con una tarea práctica; aprobar tres preguntas no prueba por sí solo que el participante puede usar GoKollab.
