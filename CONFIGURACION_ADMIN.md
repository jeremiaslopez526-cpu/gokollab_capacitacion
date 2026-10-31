# Activar /admin.html — configuración única y segura

El ZIP contiene el sitio completo y `admin.html`, pero **una URL pública no protege los resultados por sí sola**.

## Qué ya funciona
- `index.html` apunta a tu aplicación web pública existente de Apps Script para recopilar respuestas (requiere comprobar una fila real).
- `admin.html` ofrece un enlace configurable para abrir el reporte privado sin exponer respuestas.
- `GoogleAppsScript.gs` es el receptor público que ya instalaste. NO lo elimines ni reemplaces accidentalmente.

## Activar el reporte privado automático
1. En Google Sheets, entrá a **Extensiones > Apps Script**, dentro del mismo proyecto que ya contiene `doPost` e `inicializar`.
2. Creá un archivo de secuencia de comandos `PanelPrivado.gs` y pegá el contenido del archivo `PanelPrivado.gs` del ZIP.
3. Creá un archivo **HTML** llamado `PanelAdmin` y pegá el contenido de `PanelAdmin.html` del ZIP. Conservá el nombre `PanelAdmin` para que `createTemplateFromFile('PanelAdmin')` lo encuentre.
4. Guardá. Seleccioná **Implementar > Nueva implementación > Aplicación web** (creá una NUEVA implementación, no modifiques la implementación pública de recepción).
5. Configurá **Ejecutar como: Yo** y **Quién tiene acceso: Solo yo**. Si esa opción no está disponible, no despliegues un reporte de datos con acceso abierto. En tal caso usá la pestaña Resumen en la planilla privada.
6. Copiá la NUEVA URL `/exec` de esta implementación privada.
7. Entrá a `https://tu-dominio/admin.html`, pegá la URL privada y pulsá **Guardar enlace**. Abrí el panel privado; Google solicitará iniciar sesión con la cuenta autorizada si no está abierta.

La URL se guarda solo en ese navegador (localStorage) y **no es una contraseña**. Aunque el enlace se compartiera, Google debería restringir la aplicación web al propietario mediante la configuración del paso 5.

## Publicar
- Subí a la raíz del repositorio `index.html`, `admin.html` y la carpeta `assets` completa.
- Los archivos `.gs`, `PanelAdmin.html` y las instrucciones **no necesitan subirse a GitHub** para funcionar; están en el ZIP para la configuración de Apps Script.
- Confirmá los cambios y comprobá el despliegue en Vercel.

## Advertencias
- No cambies el receptor de respuestas existente a «Solo yo»: dejarían de poder enviar respuestas los alumnos.
- Los resultados previos no se recuperan si solo estaban en el navegador.
- Los datos anónimos no representan personas únicas. Los porcentajes de primeros intentos se basan en numeración guardada en cada navegador.
- La implementación receptora pública puede recibir envíos falsos; no uses estos resultados para acreditar competencias.
- `admin.html` es público como página, pero los **datos** permanecen privados en Apps Script / Sheets. No uses una contraseña incrustada en HTML.
