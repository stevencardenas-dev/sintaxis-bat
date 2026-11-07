// Pruebas del motor de verificación. Se ejecuta con: node src/probar-verificador.mjs
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { reglas } from './verificador-reglas.mjs';
import { secciones } from './datos.mjs';
import { seccionesB } from './datos-b.mjs';
import { seccionesC, apendices } from './datos-c.mjs';

const require = createRequire(import.meta.url);
const V = require('./verificador.js');

let total = 0;
function ok(nombre, fn) {
  fn();
  total += 1;
  console.log('  ok  ' + nombre);
}

// ---------- normalización ----------
ok('ignora espacios y mayúsculas', () => {
  assert.equal(V.compararTexto('   ECHO   hola  ', 'echo hola').estado, 'correcto');
});

ok('las comillas alrededor de una pieza son opcionales', () => {
  assert.equal(V.compararTexto('taskkill /f /im "notepad.exe"', 'taskkill /f /im notepad.exe').estado, 'correcto');
  assert.equal(V.compararTexto('cd /d %~dp0', 'cd /d "%~dp0"').estado, 'correcto');
});

ok('señala la pieza que falta', () => {
  const r = V.compararTexto('echo hola', 'echo hola > log.txt');
  assert.equal(r.estado, 'incorrecto');
  assert.deepEqual(r.faltan, ['>', 'log.txt']);
});

ok('señala la pieza que sobra', () => {
  const r = V.compararTexto('ping -n 4 google.com', 'ping google.com');
  assert.ok(r.sobran.includes('-n'));
});

ok('avisa cuando están todas las piezas pero en otro orden', () => {
  const r = V.compararTexto('set /a n+=1', 'set n+=1 /a');
  assert.equal(r.pistas[0], 'Están todas las piezas, pero en otro orden.');
});

// ---------- huecos ----------
ok('el nombre de la variable del for es libre, pero debe ser el mismo', () => {
  const esperado = 'for /f "tokens=5" %%p in (\'netstat -ano\') do echo %%p';
  assert.equal(
    V.compararTexto('for /f "tokens=5" %%a in (\'netstat -ano\') do echo %%a', esperado).estado,
    'correcto'
  );
  assert.notEqual(
    V.compararTexto('for /f "tokens=5" %%a in (\'netstat -ano\') do echo %%b', esperado).estado,
    'correcto'
  );
});

// ---------- alternativas ----------
ok('acepta cualquiera de una familia', () => {
  const familia = ['netstat -a', 'netstat -ano', 'netstat -b'];
  assert.equal(V.compararAlternativas('netstat -ano', familia).estado, 'correcto');
  assert.notEqual(V.compararAlternativas('netstat -x', familia).estado, 'correcto');
});

// ---------- bloques ----------
ok('un bloque se compara sin importar los saltos de línea', () => {
  const esperado = 'if "%opcion%"=="1" (\n    echo Hola\n    pause\n)';
  assert.equal(V.compararTexto('if "%opcion%"=="1" ( echo Hola pause )', esperado).estado, 'correcto');
});

// ---------- requisitos ----------
ok('los requisitos dan puntuación parcial', () => {
  const reqs = [
    { texto: 'a', re: 'net\\s+session' },
    { texto: 'b', re: '>nul' },
    { texto: 'c', re: 'zzz' }
  ];
  const r = V.compararRequisitos('net session >nul 2>&1', reqs);
  assert.equal(r.estado, 'parcial');
  assert.equal(r.detalles.filter((d) => d.estado === 'correcto').length, 2);
});

// ---------- campos ----------
ok('dos campos: correcto, parcial y vacío', () => {
  const item = { c: 'x', r: { campos: [{ esperado: 'ping -n 4' }, { esperado: 'taskkill /f /im x.exe' }] } };
  assert.equal(V.evaluar(item, ['ping -n 4', 'taskkill /f /im x.exe']).estado, 'correcto');
  assert.equal(V.evaluar(item, ['ping -n 4', '']).estado, 'parcial');
  assert.equal(V.evaluar(item, ['', '']).estado, 'vacio');
});

ok('un campo puede corregirse por requisitos', () => {
  const item = {
    c: 'x',
    r: {
      campos: [
        { esperado: 'a' },
        { requisitos: [{ texto: 'puerto', re: '\\b587\\b' }] }
      ]
    }
  };
  assert.equal(V.evaluar(item, ['a', 'New-Object SmtpClient con 587']).estado, 'correcto');
});

// ---------- qué interfaz pide cada entrada ----------
ok('plan decide la interfaz', () => {
  assert.equal(V.plan({ c: 'echo hola' }).tipo, 'linea');
  assert.equal(V.plan({ c: 'a\nb' }).tipo, 'bloque');
  assert.equal(V.plan({ c: 'set BAR=   →   for %%A in (1 2 3 ...)' }).tipo, 'revelar');
  assert.equal(V.plan({ c: 'x', z: 1 }).tipo, 'revelar');
  assert.equal(V.plan({ c: 'a', r: { campos: [{ esperado: 'x' }] } }).tipo, 'campos');
  assert.equal(V.plan({ c: 'a', r: { requisitos: [{ re: 'x' }] } }).tipo, 'requisitos');
  assert.equal(V.plan({ c: 'netstat -ano', alt: ['netstat -a -n -o'] }).tipo, 'linea');
});

// ---------- integridad del registro ----------
const todos = [...secciones, ...seccionesB, ...seccionesC, ...apendices].flatMap((s) => s.items || []);
const claves = new Set();
todos.forEach((it) => {
  claves.add(it.c);
  if (it.cod) claves.add(it.cod);
});

ok('cada regla corresponde a un ítem real', () => {
  Object.keys(reglas).forEach((k) => {
    assert.ok(claves.has(k), 'regla sin ítem: ' + JSON.stringify(k));
  });
});

ok('cada regla declara algo que el motor entiende', () => {
  Object.values(reglas).forEach((r) => {
    if (r.campos) {
      r.campos.forEach((c) => {
        assert.ok(
          c.esperado || (c.alt && c.alt.length) || (c.requisitos && c.requisitos.length),
          'campo sin criterio de corrección'
        );
      });
    }
    if (r.requisitos) r.requisitos.forEach((x) => assert.ok(x.re && x.texto));
    if (r.alt) r.alt.forEach((a) => assert.ok(typeof a === 'string' && a.length > 0));
  });
});

ok('el caso de correo pide dos campos', () => {
  const it = todos.find((x) => x.cod === 'pwsh-correo');
  assert.ok(it, 'falta el ítem pwsh-correo');
  assert.equal(V.plan({ ...it, r: reglas[it.cod] }).tipo, 'campos');
});

ok('ningún ítem queda sin interfaz', () => {
  const tipos = ['linea', 'bloque', 'campos', 'requisitos', 'revelar'];
  todos.forEach((it) => {
    const p = V.plan(it);
    assert.ok(tipos.includes(p.tipo), 'tipo raro en ' + JSON.stringify(it.c));
  });
});

console.log('\n' + total + ' pruebas correctas · ' + todos.length + ' ítems revisados');
