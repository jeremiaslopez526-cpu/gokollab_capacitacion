# Accesibilidad de GoKollab Training

## Ya implementado
- Alternativas escritas de las nueve pistas de audio. Son orientaciones equivalentes, revisables con los MP3.
- Guías textuales de los procedimientos principales en los tres videos. Estas guías NO son transcripciones literales.
- Respuestas correctas e incorrectas señaladas con texto, símbolos y colores.
- Botón de alto contraste con persistencia local.
- Estilos de foco visibles para navegación con teclado.

## Pendiente: subtítulos precisos
**No se generaron archivos VTT con texto supuesto.** Para crear subtítulos genuinos se necesita obtener y revisar la narración de los videos, y sincronizar cada frase con sus tiempos.

Luego agregar dentro de cada etiqueta `<video>` y después de `<source>`:

```html
<track kind="captions" src="assets/subtitulos/modulo1-es.vtt" srclang="es" label="Español" default>
```

Para los otros videos usar `modulo2-es.vtt` y `modulo3-es.vtt`. Ejemplo de contenido VTT:

```text
WEBVTT

00:00:00.500 --> 00:00:03.000
Texto verificado que realmente se escucha en el video.
```

Revisar sonidos relevantes, acciones visuales que requieren explicación y contraste de subtítulos. Publicar cuando estén probados.

## Validación manual pendiente
- Contraste de todos los componentes mediante herramientas de evaluación.
- Navegación con Tab/Shift+Tab y lector de pantalla.
- Ajustar PDF para lectura por tecnologías de asistencia, incluyendo orden de lectura y texto alternativo.
- Revisar correspondencia palabra por palabra de las pistas escritas con los audios.
