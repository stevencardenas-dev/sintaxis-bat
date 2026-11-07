# Sintaxis únicas de .BAT

Material de estudio sobre la sintaxis de los archivos por lotes (`.bat`) de Windows,
organizado por categorías. No necesita internet, instalación ni programas adicionales
para usarse.

Versión publicada: <https://stevencardenas-dev.github.io/sintaxis-bat/>

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `Quiz-Sintaxis-BAT.html` | Cuestionario interactivo de 250 preguntas en 25 categorías, con previo, simulacro, práctica libre y progreso guardado. |
| `src/` | La fuente de datos y el código que genera el cuestionario. |
| `CALIDAD.md` | Criterios de calidad de los ejercicios y las fuentes que los respaldan. |
| `src/generar.mjs` | Generador opcional de la guía PDF para imprimir; el PDF no se versiona. |

El cuestionario es autónomo:

- El **HTML** lleva dentro los datos de las 250 preguntas y las fuentes (Inter y
  JetBrains Mono) codificadas en base64. Es un archivo único: se puede abrir con doble
  clic, sin servidor y sin conexión; también se puede enviar por correo o USB tal cual.

El banco tiene 251 entradas; una variante duplicada se marca `soloGuia` y el
cuestionario la omite, por eso publica 250. La categoría «Chuletas de referencia
rápida» solo tiene tablas y no genera preguntas.

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
| Práctica libre | `Ctrl+↵` | Comprobar lo escrito |
| Final | `Enter` | Repetir el cuestionario |
| Final | `Esc` | Elegir otra categoría |

Además del recorrido por categorías, el inicio ofrece:

- **Repasar todo** y **Repasar falladas**, con el progreso de cada categoría.
- **Simulacro**: diez preguntas seguidas, sin pistas, con puntuación final.
- **Práctica libre**: se pega cualquier comando o bloque y se compara con todo el curso,
  con desglose de piezas, avisos de variables, cierre de paréntesis y sangría.
- **Descargar resultados** cuando termina una ronda.

El editor de respuestas ayuda mientras se escribe: cierra `(` y `"`, salta el cierre que
ya existe, indenta al pulsar `Enter` dentro de un bloque, `Tab`/`Shift+Tab` mueven la
sangría y un contador avisa si queda un paréntesis o una comilla abiertos.

## Estructura del código

```
src/
  datos.mjs                Secciones 01–07 (estructura, comentarios, ECHO, variables, …)
  datos-b.mjs              Secciones 08–12 (GOTO, CALL, FOR, redirección, archivos)
  datos-c.mjs              Secciones 13–14 y apéndices A–D
  datos-d.mjs              Secciones 16–23 (WMIC, certutil, consolas, previo, correo, …)
  verificador.js           Motor de comparación por piezas y reglas de corrección
  verificador-reglas.mjs   Casos que necesitan campos, alternativas o requisitos
  probar-verificador.mjs   29 pruebas del motor y del modelo de respuestas
  probar-limites.mjs       31 casos límite (equivalencias, tildes, familias, editor)
  calidad.mjs              Audita decoración, anotaciones meta, goto, menús y duplicados
  generar.mjs              Genera la guía HTML intermedia y el PDF con Chrome
  guia.html                HTML intermedio del PDF (se regenera solo)
  quiz-plantilla.html      Plantilla del cuestionario (CSS y JS)
  quiz.mjs                 Inyecta datos y fuentes y escribe el HTML del quiz
  empaquetar.mjs           Comprime la carpeta en Sintaxis-BAT.zip (sin dependencias)
  fuentes/                 Inter y JetBrains Mono en woff2 (SIL Open Font License 1.1)
```

Cualquier cambio de contenido se hace en `datos*.mjs` y se refleja en la guía y en el
cuestionario al regenerar los dos.

## Regenerar los entregables (opcional)

Solo hace falta si se quiere cambiar el contenido. Requiere Node.js 18 o superior y
Google Chrome instalado.

```bash
npm install --no-audit --no-fund
npm run verificar        # motor + casos límite + calidad, sin navegador
npm run calidad          # solo la auditoría del banco
npm run quiz             # escribe Quiz-Sintaxis-BAT.html
npm run pdf              # guía PDF opcional para imprimir (no se versiona)
npm run empaquetar       # empaqueta todo en Sintaxis-BAT.zip
```

`generar.mjs` usa `puppeteer-core` con el Chrome ya instalado en el equipo; si Chrome
está en otra ruta, se ajusta la constante `executablePath` al inicio del archivo. El PDF
resultante se genera solo cuando se necesita imprimir y no se guarda en el repositorio.

El flujo de GitHub Actions (`.github/workflows/verificar.yml`) corre `npm run verificar`
y comprueba que el `Quiz-Sintaxis-BAT.html` commiteado coincide con la plantilla. El PDF
no se regenera en CI porque necesita Chrome; se genera a mano y se sube en el mismo
commit.

## Créditos y licencias

- Textos y ejemplos: material del curso de Sistemas Operativos.
- Tipografías incrustadas: **Inter** y **JetBrains Mono**, publicadas bajo la
  [SIL Open Font License 1.1](https://openfontlicense.org), que permite incluirlas y
  redistribuirlas dentro de un documento.
