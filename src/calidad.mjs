// Auditoría de calidad del banco de ejercicios.
//
// No corrige nada: revisa los datos y falla si encuentra ejercicios que no
// cumplen las reglas de CALIDAD.md. Se ejecuta dentro de `npm run verificar`,
// así que un push con un ejercicio defectuoso no pasa la acción de GitHub.
//
// Reglas:
//   1. Cada ítem tiene respuesta, explicación y fuente.
//   2. Sin decoración de relleno (líneas de =, -, *, #, ~, _).
//   3. La respuesta canónica no lleva anotaciones meta como [salto] ni
//      «(en un menú)»: eso va en la explicación.
//   4. `goto` solo para bucles (vuelve a una etiqueta anterior) o para salidas
//      y errores (:eof, :error, :fin, :salir, :uso, :ayuda). Nada de menús.
//   5. Sin menús con `set /p` + `cls` + `goto`.
//   6. Una línea canónica no pasa de 220 caracteres; los bloques pueden ser
//      más largos porque son scripts completos.
//   7. Las respuestas repetidas entre secciones se avisan, no se prohiben:
//      pueden ser refuerzo deliberado.

import { secciones } from './datos.mjs';
import { seccionesB } from './datos-b.mjs';
import { seccionesC, apendices } from './datos-c.mjs';
import { seccionesD } from './datos-d.mjs';

const todas = [...secciones, ...seccionesB, ...seccionesC, ...apendices, ...seccionesD];
const items = [];
todas.forEach((s) => (s.items || []).forEach((it) => items.push({ sec: s.id, titulo: s.titulo, ...it })));

const errores = [];
const avisos = [];
const err = (x, texto) => errores.push({ sec: x.sec, c: x.c, texto });
const aviso = (texto, c) => avisos.push({ texto, c });

const DECORACION = /(?:={4,}|-{4,}|\*{4,}|#{4,}|~{4,}|_{5,}|[═─━]{3,})/;
const META = /\[[a-záéíóúñ ]{2,}\]|\(\s*(?:en un|con\s+(?:opcion|la|el|un)|sin\s+goto|antes de|después de|opcional)\b[^)]*\)/i;
const SALIDAS = new Set(['eof', 'error', 'fin', 'salir', 'uso', 'ayuda']);

function etiquetas(texto) {
  const set = new Set();
  for (const m of texto.matchAll(/^\s*:([a-z0-9_]+)/gim)) set.add(m[1].toLowerCase());
  return set;
}

function saltos(texto) {
  return [...texto.matchAll(/\bgoto\s+:?([a-z0-9_]+)/gi)].map((m) => m[1].toLowerCase());
}

// ¿El goto vuelve a una etiqueta anterior? También vale si la etiqueta y el
// goto están en la misma línea, como en los esquemas de una sola línea.
function esBucle(texto, destino) {
  const lineas = texto.split('\n');
  const reEtiqueta = new RegExp('^\\s*:' + destino + '\\b', 'i');
  const reGoto = new RegExp('\\bgoto\\s+:?' + destino + '\\b', 'i');
  const iEtiqueta = lineas.findIndex((l) => reEtiqueta.test(l));
  const iGoto = lineas.findIndex((l) => reGoto.test(l));
  if (iEtiqueta < 0 || iGoto < 0) return false;
  if (iGoto > iEtiqueta) return true;
  if (iGoto === iEtiqueta) return lineas[iGoto].search(reGoto) > lineas[iGoto].search(reEtiqueta);
  return false;
}

items.forEach((x) => {
  if (!x.c || !x.e || !x.d) err(x, 'le falta respuesta, explicación o fuente');
  if (DECORACION.test(x.c) || DECORACION.test(x.e) || DECORACION.test(x.d)) {
    err(x, 'tiene decoración de relleno (===, ---, ***, ###)');
  }
  if (META.test(x.c)) err(x, 'la respuesta lleva una anotación meta entre corchetes o paréntesis');

  if (/\n/.test(x.c) && /\bgoto\s+:?(?:menu|opcion\d+)\b/i.test(x.c)) {
    err(x, 'usa goto para un menú; debe ser un bucle o una salida');
  }
  if (/\bset\s+\/p\b/i.test(x.c) && /\bcls\b/i.test(x.c) && /\bgoto\b/i.test(x.c)) {
    err(x, 'es un menú con set /p, cls y goto');
  }
  if (!/\n/.test(x.c) && x.c.length > 220) err(x, 'la línea canónica pasa de 220 caracteres');

  const etiquetasItem = etiquetas(x.c);
  const saltosItem = saltos(x.c);
  if (etiquetasItem.size && saltosItem.length) {
    saltosItem.forEach((destino) => {
      if (!etiquetasItem.has(destino) && !SALIDAS.has(destino)) {
        err(x, 'goto ' + destino + ' sin etiqueta definida');
      }
    });
    const util = saltosItem.some((d) => SALIDAS.has(d) || esBucle(x.c, d));
    if (!util) err(x, 'goto que no es bucle ni salida (:eof, :error, :fin…)');
  }
});

const porRespuesta = new Map();
items.forEach((x) => {
  const clave = x.c.replace(/\s+/g, ' ').trim().toLowerCase();
  if (!porRespuesta.has(clave)) porRespuesta.set(clave, []);
  porRespuesta.get(clave).push(x);
});
porRespuesta.forEach((lista, clave) => {
  if (lista.length > 1) aviso('respuesta repetida en ' + lista.map((x) => x.sec).join(', '), clave);
});

console.log('Calidad de los ejercicios');
console.log('  ' + items.length + ' ítems revisados');
errores.forEach((e) => console.log('  ERROR  [' + e.sec + '] ' + e.texto + ' :: ' + JSON.stringify(e.c.slice(0, 90))));
avisos.forEach((a) => console.log('  aviso  ' + a.texto + ' :: ' + JSON.stringify(a.c.slice(0, 70))));
console.log('  ' + errores.length + ' errores · ' + avisos.length + ' avisos');

if (errores.length) process.exitCode = 1;
