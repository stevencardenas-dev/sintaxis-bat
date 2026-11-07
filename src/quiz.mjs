// Genera Quiz-Sintaxis-BAT.html (página autónoma) a partir de los datos de la guía.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { secciones } from './datos.mjs';
import { seccionesB } from './datos-b.mjs';
import { seccionesC, apendices } from './datos-c.mjs';
import { seccionesD } from './datos-d.mjs';
import { reglas } from './verificador-reglas.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(__dirname, '..', '..');

const todas = [...secciones, ...seccionesB, ...seccionesC, ...apendices, ...seccionesD];

// Huella corta del texto canónico: si mañana se inserta una pregunta en medio de
// una sección, el progreso guardado de las demás no se desplaza.
function huella(texto) {
  let h = 2166136261;
  for (let k = 0; k < texto.length; k++) {
    h ^= texto.charCodeAt(k);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

const grupos = todas
  .filter((s) => (s.items || []).length)
  .map((s) => ({
    sec: s.titulo,
    id: s.id,
    color: s.color,
    items: s.items.map((it, idx) => {
      const regla = reglas[it.c] || (it.cod ? reglas[it.cod] : null);
      // Id estable: el progreso guardado no depende del texto de la respuesta.
      const item = { id: s.id + '-' + huella(it.c), c: it.c, e: it.e, d: it.d, b: it.b || 'base' };
      if (regla) item.r = regla;

      // Las familias separadas por «·» son alternativas: cualquiera vale.
      const partes = it.c.split('·').map((p) => p.trim()).filter(Boolean);
      if (!regla && partes.length > 1) {
        const utiles = partes.filter((p) => !/→|\.\.\./.test(p));
        if (utiles.length) item.alt = utiles;
        else item.z = 1;
      }
      // Recetas con marcas de posición: no se pueden escribir literalmente.
      if (!regla && !item.alt && /→|\.\.\./.test(it.c)) item.z = 1;
      return item;
    })
  }));

const datos = JSON.stringify(grupos).replace(/</g, '\\u003c');
const plantilla = fs.readFileSync(path.join(__dirname, 'quiz-plantilla.html'), 'utf8');

// Fuentes incrustadas en base64: el HTML no depende de internet ni de las fuentes
// instaladas en el equipo donde se abra. Inter y JetBrains Mono son SIL OFL 1.1.
const fuentes = [
  { archivo: 'inter-var-latin.woff2', familia: 'Inter', peso: '100 900' },
  { archivo: 'jetbrains-mono-var-latin.woff2', familia: 'JetBrains Mono', peso: '100 800' }
];

const cssFuentes = fuentes
  .map(({ archivo, familia, peso }) => {
    const b64 = fs.readFileSync(path.join(__dirname, 'fuentes', archivo)).toString('base64');
    return `  @font-face {\n    font-family: '${familia}';\n    font-style: normal;\n    font-weight: ${peso};\n    font-display: block;\n    src: url(data:font/woff2;base64,${b64}) format('woff2');\n  }`;
  })
  .join('\n');

const verificador = fs.readFileSync(path.join(__dirname, 'verificador.js'), 'utf8');

// Los reemplazos van con función: el código y los datos pueden contener «$»
// y no queremos que se lean como patrones de replazo.
const html = plantilla
  .replace('__FUENTES__', () => cssFuentes)
  .replace('__VERIFICADOR__', () => verificador)
  .replace('__DATOS__', () => datos);

const destino = path.join(raiz, 'Quiz-Sintaxis-BAT.html');
fs.writeFileSync(destino, html, 'utf8');

// Copia dentro de la carpeta del proyecto: así el paquete que se comparte lleva
// los entregables ya construidos junto al código que los genera.
const copia = path.join(__dirname, '..', 'Quiz-Sintaxis-BAT.html');
fs.writeFileSync(copia, html, 'utf8');

console.log('Categorías:', grupos.length, '| preguntas:', grupos.reduce((n, g) => n + g.items.length, 0));
console.log('HTML:', destino, '|', (Buffer.byteLength(html) / 1024).toFixed(0) + ' KB');
