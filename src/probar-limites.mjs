// Casos límite del verificador: lo que debe aceptar y, sobre todo, lo que NO.
// Se ejecuta con: node src/probar-limites.mjs
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const V = require('./verificador.js');

let total = 0;
function si(nombre, fn) {
  fn();
  total += 1;
  console.log('  ok  ' + nombre);
}

function correcto(respuesta, esperado) {
  const r = V.compararTexto(respuesta, esperado);
  assert.equal(r.estado, 'correcto', '"' + respuesta + '" debería valer para "' + esperado + '"');
}

function noCorrecto(respuesta, esperado) {
  const r = V.compararTexto(respuesta, esperado);
  assert.notEqual(r.estado, 'correcto', '"' + respuesta + '" NO debería valer para "' + esperado + '"');
}

// ---------- debe aceptar ----------
si('modificadores en cualquier orden', () => {
  correcto('taskkill /im notepad.exe /f', 'taskkill /f /im notepad.exe');
  correcto('taskkill /pid 1234 /f', 'taskkill /f /pid 1234');
  correcto('del /q /f', 'del /f /q');
  correcto('shutdown -t 90 -s', 'shutdown -s -t 90');
});

si('archivo propio con cualquier nombre', () => {
  correcto('type salida.log', 'type historial.log');
  correcto('copy "a b.txt" "c d.txt"', 'copy origen.txt destino.txt');
});

si('etiqueta propia con cualquier nombre', () => {
  correcto('call :limpiar', 'call :limpiar');
  correcto('goto :final', 'goto fin');
});

si('texto de echo libre dentro de bloque', () => {
  correcto('if "%x%"=="1" (\n echo Uno\n pause\n)', 'if "%x%"=="1" (\n echo Has elegido uno\n pause\n)');
});

si('comillas opcionales alrededor de una ruta', () => {
  correcto('cd /d %~dp0', 'cd /d "%~dp0"');
  correcto('pushd "%~dp0"', 'pushd %~dp0');
});

si('variables propias coherentes', () => {
  correcto('set "salida=%CARPETA%\\r.txt" & echo %CARPETA%', 'set "salida=%DIR%\\r.txt" & echo %DIR%');
});

si('espacios de sobra y mayúsculas', () => {
  correcto('   ECHO    Hola   ', 'echo hola');
});

// ---------- no debe aceptar ----------
si('el dispositivo es nul, no null', () => {
  noCorrecto('pause > null', 'pause >nul');
});

si('porcentaje suelto en echo', () => {
  noCorrecto('echo Progreso: 50%', 'echo Progreso: 50%%');
});

si('set con espacios alrededor del igual', () => {
  noCorrecto('set origen = C:\\datos', 'set "origen=C:\\datos"');
});

si('if sin comillas cuando la variable puede quedar vacía', () => {
  noCorrecto('if %opcion%==1', 'if "%opcion%"=="1"');
});

si('argumentos distintos del script', () => {
  noCorrecto('set /p opcion=%2', 'set /p opcion=%1');
});

si('opción de wmic distinta', () => {
  noCorrecto('wmic process list full', 'wmic process list brief');
});

si('goto :eof no es una etiqueta propia', () => {
  noCorrecto('goto fin', 'goto :eof');
});

si('echo off no es echo on', () => {
  noCorrecto('echo on', 'echo off');
});

si('modificador inexistente no cuela', () => {
  noCorrecto('taskkill /f /ims notepad.exe', 'taskkill /f /im notepad.exe');
});

si('variable del sistema renombrada', () => {
  noCorrecto('echo Hola %USER%', 'echo Hola %USERNAME%');
  noCorrecto('if %foo% neq 0 echo x', 'if %errorlevel% neq 0 echo x');
});

si('respuesta vacía o solo espacios', () => {
  assert.equal(V.compararTexto('', 'echo hola').estado, 'vacio');
  assert.equal(V.compararTexto('   ', 'echo hola').estado, 'vacio');
});

si('variables del for confundidas entre sí', () => {
  const esperado = 'for /f "tokens=1,2" %%a in (d.csv) do echo %%a - %%b';
  noCorrecto('for /f "tokens=1,2" %%a in (d.csv) do echo %%a - %%a', esperado);
});

// ---------- interfaz ----------
si('los requisitos no se confunden con una línea', () => {
  const item = { c: 'x', r: { requisitos: [{ texto: 'a', re: 'a' }] } };
  assert.equal(V.plan(item).tipo, 'requisitos');
  assert.equal(V.evaluar(item, ['']).estado, 'vacio');
});

console.log('\n' + total + ' casos límite correctos');
