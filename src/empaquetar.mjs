// Empaqueta la carpeta del proyecto en un .zip portable (sin dependencias).
// Uso: node src/empaquetar.mjs
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const carpeta = path.resolve(__dirname, '..');          // Sintaxis-BAT/
const raiz = path.resolve(carpeta, '..');               // carpeta donde se deja el .zip
const nombre = path.basename(carpeta);                  // Sintaxis-BAT
const destino = path.join(raiz, `${nombre}.zip`);

const IGNORAR = new Set(['node_modules', '.git', '.DS_Store', 'Thumbs.db']);

// CRC-32 (polinomio 0xEDB88320), tabla calculada una sola vez.
const tabla = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  tabla[i] = c >>> 0;
}
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = tabla[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const archivos = [];
(function recorrer(dir) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (IGNORAR.has(entrada.name)) continue;
    const completo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) recorrer(completo);
    else if (entrada.isFile()) archivos.push(completo);
  }
})(carpeta);

const locales = [];
const central = [];
let offset = 0;
const ahora = new Date();
const hora = ((ahora.getHours() << 11) | (ahora.getMinutes() << 5) | (ahora.getSeconds() / 2)) & 0xffff;
const fecha = (((ahora.getFullYear() - 1980) << 9) | ((ahora.getMonth() + 1) << 5) | ahora.getDate()) & 0xffff;

for (const completo of archivos) {
  const datos = fs.readFileSync(completo);
  const comprimido = zlib.deflateRawSync(datos, { level: 9 });
  // Siempre barras normales: el .zip se abre igual en Windows, macOS y Linux.
  const ruta = path.relative(carpeta, completo).split(path.sep).join('/');
  const nombreZip = Buffer.from(`${nombre}/${ruta}`, 'utf8');
  const crc = crc32(datos);
  const metodo = comprimido.length < datos.length ? 8 : 0;
  const cuerpo = metodo === 8 ? comprimido : datos;

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);              // versión necesaria
  local.writeUInt16LE(0x0800, 6);          // nombres en UTF-8
  local.writeUInt16LE(metodo, 8);
  local.writeUInt16LE(hora, 10);
  local.writeUInt16LE(fecha, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(cuerpo.length, 18);
  local.writeUInt32LE(datos.length, 22);
  local.writeUInt16LE(nombreZip.length, 26);
  local.writeUInt16LE(0, 28);
  locales.push(local, nombreZip, cuerpo);

  const registro = Buffer.alloc(46);
  registro.writeUInt32LE(0x02014b50, 0);
  registro.writeUInt16LE(0x031e, 4);       // hecho en UNIX (permisos de archivo)
  registro.writeUInt16LE(20, 6);
  registro.writeUInt16LE(0x0800, 8);
  registro.writeUInt16LE(metodo, 10);
  registro.writeUInt16LE(hora, 12);
  registro.writeUInt16LE(fecha, 14);
  registro.writeUInt32LE(crc, 16);
  registro.writeUInt32LE(cuerpo.length, 20);
  registro.writeUInt32LE(datos.length, 24);
  registro.writeUInt16LE(nombreZip.length, 28);
  registro.writeUInt32LE(((0o100644 << 16) >>> 0), 38); // -rw-r--r--
  registro.writeUInt32LE(offset, 42);
  central.push(registro, nombreZip);

  offset += local.length + nombreZip.length + cuerpo.length;
}

const directorio = Buffer.concat(central);
const fin = Buffer.alloc(22);
fin.writeUInt32LE(0x06054b50, 0);
fin.writeUInt16LE(archivos.length, 8);
fin.writeUInt16LE(archivos.length, 10);
fin.writeUInt32LE(directorio.length, 12);
fin.writeUInt32LE(offset, 16);

fs.writeFileSync(destino, Buffer.concat([...locales, directorio, fin]));
console.log('Archivos:', archivos.length, '| ZIP:', destino, '|', (fs.statSync(destino).size / 1024).toFixed(0) + ' KB');
