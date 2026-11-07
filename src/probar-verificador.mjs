// Pruebas del motor de verificación. Se ejecuta con: npm run probar
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

// ---------- equivalencias de cmd ----------
ok('el operador pegado es el mismo que separado', () => {
  assert.equal(V.compararTexto('dir>out.txt', 'dir > out.txt').estado, 'correcto');
  assert.equal(V.compararTexto('net session > nul 2>&1', 'net session >nul 2>&1').estado, 'correcto');
});

ok('1> y > son lo mismo', () => {
  assert.equal(V.compararTexto('net session 1>nul 2>&1', 'net session >nul 2>&1').estado, 'correcto');
});

ok('el orden de las opciones de for /f da igual', () => {
  const canonico = 'for /f "tokens=1 delims=," %%a in (lista.txt) do echo %%a';
  const otro = 'for /f "delims=, tokens=1" %%x in (lista.txt) do echo %%x';
  assert.equal(V.compararTexto(otro, canonico).estado, 'correcto');
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

ok('una variable propia puede llamarse distinto', () => {
  assert.equal(V.compararTexto('set "r=%DIR%\\datos.txt"', 'set "r=%CARPETA%\\datos.txt"').estado, 'correcto');
});

ok('pero una variable del sistema no se puede renombrar', () => {
  assert.notEqual(V.compararTexto('echo Hola %USER%', 'echo Hola %USERNAME%').estado, 'correcto');
  assert.notEqual(V.compararTexto('if %foo% neq 0 echo x', 'if %errorlevel% neq 0 echo x').estado, 'correcto');
});

ok('las etiquetas pueden llamarse distinto', () => {
  assert.equal(V.compararTexto('if "%opcion%"=="" goto inicio', 'if "%opcion%"=="" goto menu').estado, 'correcto');
});

ok('el nombre del archivo puede ser otro, pero tiene que ser un archivo', () => {
  assert.equal(V.compararTexto('taskkill /f /im otro.exe', 'taskkill /f /im notepad.exe').estado, 'correcto');
  assert.notEqual(V.compararTexto('dir > cualquiercosa', 'dir > todos.txt').estado, 'correcto');
});

ok('el texto de echo es libre, pero no las palabras on/off', () => {
  assert.equal(V.compararTexto('echo Elegiste la opcion uno', 'echo Has elegido la opcion 1').estado, 'correcto');
  assert.notEqual(V.compararTexto('echo on', 'echo off').estado, 'correcto');
  assert.notEqual(V.compararTexto('echo hola %X%', 'echo hola %USERNAME%').estado, 'correcto');
});

// ---------- sugerencias de tipeo ----------
ok('sugiere la pieza cuando parece un error de tipeo', () => {
  const r = V.compararTexto('taskkil /f /im notepad.exe', 'taskkill /f /im notepad.exe');
  assert.equal(r.estado, 'parcial');
  assert.ok(r.pistas.some((p) => p.indexOf('taskkill') !== -1), 'debería sugerir taskkill');
});

ok('no sugiere con piezas cortas', () => {
  const r = V.compararTexto('echo on', 'echo off');
  assert.equal(r.pistas.length, 0);
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

ok('toda respuesta canónica se acepta a sí misma', () => {
  todos.forEach((it) => {
    const p = V.plan(it);
    if (p.tipo === 'campos') {
      const valores = p.campos.map((c) => c.esperado || '');
      const r = V.evaluar(it, valores);
      assert.notEqual(r.estado, 'incorrecto', 'no se acepta a sí misma: ' + JSON.stringify(it.c));
      return;
    }
    if (p.tipo === 'revelar') return;
    // En las familias, el texto canónico es la lista unida con «·»: se usa una.
    const valor = p.alt && p.alt.length ? p.alt[0] : it.c;
    const r = V.evaluar(it, [valor]);
    assert.equal(r.estado, 'correcto', 'no se acepta a sí misma: ' + JSON.stringify(it.c));
  });
});

console.log('\n' + total + ' pruebas correctas · ' + todos.length + ' ítems revisados');
