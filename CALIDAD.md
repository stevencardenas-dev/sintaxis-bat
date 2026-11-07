# Calidad de los ejercicios

El banco no se revisa a ojo: `npm run calidad` audita los datos y `npm run verificar`
lo ejecuta junto al motor. Un ejercicio que incumpla las reglas hace fallar la acción de
GitHub.

## Principios

Están tomados de guías de evaluación y de plataformas de práctica:

- **Una idea por ejercicio.** El enunciado debe tener un único problema evaluable; si
  mezcla dos, la respuesta deja de ser inequívoca.
  Fuente: [Trinity College Dublin, *Writing Effective Multiple Choice Questions*](https://www.tcd.ie/media/tcd/academic-practice/pdfs/Designing_effective_MCQs.pdf)
  y [UNED, *La redacción de las preguntas del examen*](https://qinnova.uned.es/archivos_publicos/qweb_paginas/11117294/unedfacpsicologiaredaccionpreguntasexamen.pdf).
- **Enunciado claro y sin ambigüedad.** Sin negaciones innecesarias, sin pistas
  involuntarias y con el contexto necesario para responder.
  Fuente: [NC State University, *Best Practices for Creating Multiple-Choice Questions*](https://teaching-resources.delta.ncsu.edu/multiplechoice).
- **Contexto realista y concisión.** Un ejercicio enseña una habilidad, no imita un
  sistema completo; conviene explicar lo justo y no añadir requisitos que no se evalúan.
  Fuente: [Exercism, *First Exercise*](https://exercism.org/docs/building/tracks/syllabus/first-exercise)
  y [*Suggesting Exercise Improvements*](https://exercism.org/docs/community/suggesting-exercise-improvements).
- **Simplicidad.** Cuanto más corta y directa es la tarjeta, más fácil es practicarla y
  recordarla; el relleno compite con lo que se quiere aprender.
  Fuente: [Anki, *Adding/Editing*](https://docs.ankiweb.net/manual/editing).

## Reglas que aplica el auditor

1. **Respuesta, explicación y fuente.** Todo ítem debe tener `c`, `e` y `d`.
2. **Sin decoración.** Nada de líneas de `====`, `----`, `****`, `####` o similares.
   Si un ejemplo necesita separar secciones, se usan comentarios `rem` con contenido,
   no adornos.
3. **Sin anotaciones meta en la respuesta.** `[salto]`, `(en un menú)`, `(con opción
   vacía)` o `(antes de set /p)` son aclaraciones: van en `e`, no en el comando que se
   escribe.
4. **`goto` con propósito.** Solo se acepta un salto que vuelva a una etiqueta anterior
   (bucle) o que salga por `:eof`, `:error`, `:fin`, `:salir`, `:uso` o `:ayuda`. Un
   `goto menu` o `goto opcion1` dentro de un bloque se considera menú y se rechaza.
5. **Sin menús de relleno.** Un bloque con `set /p`, `cls` y `goto` se rechaza: enseña
   estructura de menú, no una habilidad concreta.
6. **Longitud.** Una respuesta de una línea no pasa de 220 caracteres. Los bloques
   completos (el previo, el lanzador de PowerShell) pueden ser más largos.
7. **Duplicados.** Las respuestas repetidas entre secciones se avisan, no se prohíben:
   pueden ser refuerzo deliberado; el aviso obliga a revisar si aportan algo nuevo.

## Cómo se ejecuta

```bash
npm run calidad
npm run verificar   # motor + casos límite + calidad
```

La salida lista los ítems con error y los avisos. El comando termina con código 1 si hay
algún error, así que la acción de GitHub no publica un banco defectuoso.
