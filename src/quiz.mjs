// Genera Quiz-Sintaxis-BAT.html (página autónoma) a partir de los datos de la guía.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { secciones } from './datos.mjs';
import { seccionesB } from './datos-b.mjs';
import { seccionesC, apendices } from './datos-c.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(__dirname, '..', '..');

const todas = [...secciones, ...seccionesB, ...seccionesC, ...apendices];

const grupos = todas
  .filter((s) => (s.items || []).length)
  .map((s) => ({
    sec: s.titulo,
    id: s.id,
    color: s.color,
    items: s.items.map((it) => ({ c: it.c, e: it.e, d: it.d, b: it.b || 'base' }))
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

const html = plantilla.replace('__FUENTES__', cssFuentes).replace('__DATOS__', datos);

const destino = path.join(raiz, 'Quiz-Sintaxis-BAT.html');
fs.writeFileSync(destino, html, 'utf8');

// Copia dentro de la carpeta del proyecto: así el paquete que se comparte lleva
// los entregables ya construidos junto al código que los genera.
const copia = path.join(__dirname, '..', 'Quiz-Sintaxis-BAT.html');
fs.writeFileSync(copia, html, 'utf8');

console.log('Categorías:', grupos.length, '| preguntas:', grupos.reduce((n, g) => n + g.items.length, 0));
console.log('HTML:', destino, '|', (Buffer.byteLength(html) / 1024).toFixed(0) + ' KB');
