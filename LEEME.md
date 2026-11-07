# Sintaxis únicas de .BAT

Material de estudio sobre la sintaxis de los archivos por lotes (`.bat`) de Windows,
organizado en categorías. No necesita internet, instalación ni programas adicionales
para usarse.

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `Guia-Sintaxis-BAT.pdf` | Guía de 38 páginas con las 178 sintaxis explicadas, por categorías (A4, lista para imprimir). |
| `Quiz-Sintaxis-BAT.html` | Cuestionario interactivo, un recorrido por categoría o todas de corrido. |
| `src/` | El código que genera ambos entregables a partir de una sola fuente de datos. |

Las dos entregas son autónomas:

- El **PDF** lleva las fuentes incrustadas, así que se ve igual en cualquier lector y en
  cualquier sistema operativo.
- El **HTML** lleva dentro los datos de las 178 preguntas y las fuentes (Inter y
  JetBrains Mono) codificadas en base64. Es un archivo único: se puede abrir con doble
  clic, sin servidor y sin conexión; también se puede enviar por correo o USB tal cual.

## Cómo usarlo

1. Abrir `Guia-Sintaxis-BAT.pdf` para leer y repasar.
2. Abrir `Quiz-Sintaxis-BAT.html` con cualquier navegador (Chrome, Edge, Firefox, Safari).
3. Practicar. Todo se maneja con el teclado:

| Pantalla | Tecla | Acción |
|---|---|---|
| Inicio | `↑` `↓` | Moverse por la lista de categorías |
| Inicio | `Enter` | Empezar la categoría seleccionada |
| Inicio | `/` | Ir al buscador |
| Inicio | `Esc` | Limpiar la búsqueda |
| Quiz | `Espacio` | Mostrar la respuesta (y avanzar si ya está mostrada) |
| Quiz | `↓` `↑` | Siguiente / anterior pregunta |
| Quiz | `Esc` | Volver a las categorías |
| Final | `Enter` | Repetir el cuestionario |
| Final | `Esc` | Elegir otra categoría |

## Estructura del código

```
src/
  datos.mjs             Secciones 01–07 (estructura, comentarios, ECHO, variables, …)
  datos-b.mjs           Secciones 08–12 (GOTO, CALL, FOR, redirección, archivos)
  datos-c.mjs           Secciones 13–14 y apéndices A–D
  generar.mjs           Genera la guía HTML intermedia y el PDF con Chrome
  guia.html             HTML intermedio del PDF (se regenera solo)
  quiz-plantilla.html   Plantilla del cuestionario (CSS y JS)
  quiz.mjs              Inyecta datos y fuentes y escribe el HTML del quiz
  empaquetar.mjs        Comprime la carpeta en Sintaxis-BAT.zip (sin dependencias)
  fuentes/              Inter y JetBrains Mono en woff2 (SIL Open Font License 1.1)
```

Cualquier cambio de contenido se hace en `datos*.mjs` y se refleja en la guía y en el
cuestionario al regenerar los dos.

## Regenerar los entregables (opcional)

Solo hace falta si se quiere cambiar el contenido. Requiere Node.js 18 o superior y
Google Chrome instalado.

```bash
npm install --no-audit --no-fund
node src/quiz.mjs        # escribe Quiz-Sintaxis-BAT.html
node src/generar.mjs     # escribe Guia-Sintaxis-BAT.pdf
node src/empaquetar.mjs  # empaqueta todo en Sintaxis-BAT.zip
```

`generar.mjs` usa `puppeteer-core` con el Chrome ya instalado en el equipo; si Chrome
está en otra ruta, se ajusta la constante correspondiente al inicio del archivo.

## Créditos y licencias

- Textos y ejemplos: material del curso de Sistemas Operativos.
- Tipografías incrustadas: **Inter** y **JetBrains Mono**, publicadas bajo la
  [SIL Open Font License 1.1](https://openfontlicense.org), que permite incluirlas y
  redistribuirlas dentro de un documento.
