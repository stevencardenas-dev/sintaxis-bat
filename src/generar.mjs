import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

import { meta, partes, secciones as seccionesA } from './datos.mjs';
import { seccionesB } from './datos-b.mjs';
import { seccionesC, apendices } from './datos-c.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const secciones = [...seccionesA, ...seccionesB, ...seccionesC, ...apendices];

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const hex2rgb = (hex) => {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};
const rgba = (hex, a) => {
  const [r, g, b] = hex2rgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};
const mezcla = (hex, destino, peso) => {
  const [r, g, b] = hex2rgb(hex);
  const [r2, g2, b2] = hex2rgb(destino);
  const m = (x, y) => Math.round(x * (1 - peso) + y * peso);
  return `rgb(${m(r, r2)},${m(g, g2)},${m(b, b2)})`;
};
const oscuro = (hex, peso = 0.35) => mezcla(hex, '#0b1220', peso);

const COLORES_BADGE = {
  base: '#0f766e',
  avanzado: '#4338ca',
  peligro: '#b91c1c',
  trampa: '#b45309'
};
const ETIQUETA_BADGE = {
  base: 'base',
  avanzado: 'avanzado',
  peligro: 'peligro',
  trampa: 'trampa'
};

const totalItems = secciones.reduce((n, s) => n + (s.items ? s.items.length : 0), 0);
const totalTablas = secciones.reduce((n, s) => n + (s.tablas ? s.tablas.length : 0), 0);

const partes_ = partes.map((p) => ({
  ...p,
  secciones: secciones.filter((s) => s.parte === p.n)
}));

const tarjeta = (it, color) => {
  const bc = COLORES_BADGE[it.b] || COLORES_BADGE.base;
  return `
    <div class="card" style="--accent:${color};--accent-soft:${rgba(color, 0.09)};--accent-mid:${rgba(color, 0.35)};--accent-dark:${oscuro(color, 0.25)}">
      <div class="card-top">
        <code class="sintaxis">${esc(it.c)}</code>
        <span class="badge" style="--bc:${bc};--bc-soft:${rgba(bc, 0.12)}">${ETIQUETA_BADGE[it.b] || 'base'}</span>
      </div>
      <p class="exp">${esc(it.e)}</p>
      ${it.d ? `<p class="origen"><span class="origen-lbl">Dónde verlo</span> ${esc(it.d)}</p>` : ''}
      ${it.w ? `<p class="aviso"><span class="aviso-ico">!</span> ${esc(it.w)}</p>` : ''}
    </div>`;
};

const tabla = (t, color) => `
  <div class="tabla-wrap" style="--accent:${color}">
    <p class="tabla-tit">${esc(t.titulo)}</p>
    <table>
      <thead><tr>${t.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>
        ${t.rows
          .map(
            (r) =>
              `<tr>${r
                .map((c, i) =>
                  i === 0 ? `<td class="mono">${esc(c)}</td>` : `<td>${esc(c)}</td>`
                )
                .join('')}</tr>`
          )
          .join('')}
      </tbody>
    </table>
  </div>`;

const bloqueSeccion = (s) => {
  const total = (s.items ? s.items.length : 0) + (s.tablas ? s.tablas.length : 0);
  return `
  <article class="seccion" style="--accent:${s.color};--accent-soft:${rgba(s.color, 0.1)};--accent-mid:${rgba(s.color, 0.3)}">
    <header class="sec-head">
      <div class="sec-num">${esc(s.id)}</div>
      <div class="sec-txt">
        <h2>${esc(s.titulo)}</h2>
        <p>${esc(s.resumen)}</p>
      </div>
      <div class="sec-count"><b>${total}</b><span>${s.tablas && s.tablas.length ? 'tablas' : 'sintaxis'}</span></div>
    </header>
    <div class="regla"></div>
    ${(s.items || []).map((it) => tarjeta(it, s.color)).join('\n')}
    ${(s.tablas || []).map((t) => tabla(t, s.color)).join('\n')}
  </article>`;
};

const bloqueParte = (p) => `
  <section class="parte" style="--pcolor:${p.color};--psoft:${rgba(p.color, 0.14)};--pdark:${oscuro(p.color, 0.3)}">
    <div class="parte-card">
      <p class="parte-eyebrow">Parte ${esc(p.n)}</p>
      <h1>${esc(p.titulo)}</h1>
      <p class="parte-sub">${esc(p.sub)}</p>
      <ul class="parte-lista">
        ${p.secciones
          .map(
            (s) =>
              `<li><span class="pt-num">${esc(s.id)}</span><span class="pt-tit">${esc(
                s.titulo
              )}</span><span class="pt-count">${(s.items ? s.items.length : 0) + (s.tablas ? s.tablas.length : 0)}</span></li>`
          )
          .join('')}
      </ul>
    </div>
  </section>`;

const mapa = partes_
  .map(
    (p) => `
    <div class="mapa-grupo" style="--pcolor:${p.color}">
      <p class="mapa-parte"><span>${esc(p.n)}</span> ${esc(p.titulo)}</p>
      <ul>
        ${p.secciones
          .map(
            (s) =>
              `<li><i style="background:${s.color}"></i><span class="m-id">${esc(s.id)}</span>${esc(
                s.titulo
              )}<em>${(s.items ? s.items.length : 0) + (s.tablas ? s.tablas.length : 0)}</em></li>`
          )
          .join('')}
      </ul>
    </div>`
  )
  .join('');

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${meta.titulo}</title>
<style>
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    margin: 0;
    font-family: 'Segoe UI', 'Segoe UI Variable', Arial, sans-serif;
    font-size: 9pt;
    color: #1e293b;
    line-height: 1.42;
  }
  h1, h2, h3, p, ul, li { margin: 0; padding: 0; }
  ul { list-style: none; }

  /* ---------- PORTADA ---------- */
  .portada {
    position: relative;
    height: 259mm;
    border-radius: 10mm;
    background: linear-gradient(150deg, #0b1220 0%, #12203c 55%, #0d2b3f 100%);
    color: #e2e8f0;
    padding: 22mm 18mm;
    overflow: hidden;
    break-after: page;
  }
  .portada::before {
    content: '';
    position: absolute;
    top: -40mm; right: -35mm;
    width: 130mm; height: 130mm;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56,189,248,0.35), rgba(56,189,248,0) 70%);
  }
  .portada::after {
    content: '';
    position: absolute;
    bottom: -55mm; left: -30mm;
    width: 120mm; height: 120mm;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(16,185,129,0.28), rgba(16,185,129,0) 70%);
  }
  .p-marca {
    display: inline-block;
    font-family: Consolas, monospace;
    font-size: 8.5pt;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #7dd3fc;
    border: 1px solid rgba(125,211,252,0.45);
    border-radius: 20px;
    padding: 2.2mm 5mm;
    margin-bottom: 14mm;
  }
  .p-tit {
    font-size: 33pt;
    line-height: 1.08;
    font-weight: 700;
    letter-spacing: -0.5px;
    max-width: 150mm;
  }
  .p-tit em { font-style: normal; color: #38bdf8; }
  .p-sub {
    margin-top: 7mm;
    font-size: 13pt;
    color: #a9bdd6;
    max-width: 130mm;
    line-height: 1.35;
  }
  .p-linea {
    width: 46mm; height: 2.2mm;
    margin: 11mm 0 9mm;
    border-radius: 3mm;
    background: linear-gradient(90deg, #38bdf8, #34d399);
  }
  .p-chips { display: flex; flex-wrap: wrap; gap: 3mm; max-width: 150mm; }
  .p-chip {
    font-size: 8pt;
    color: #cbd5e1;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 4mm;
    padding: 1.8mm 4mm;
  }
  .p-chip b { color: #fff; }
  .p-cats {
    display: flex;
    flex-wrap: wrap;
    gap: 1.8mm 2.4mm;
    max-width: 152mm;
    margin-top: 9mm;
  }
  .p-cats span {
    display: inline-flex;
    align-items: center;
    gap: 1.8mm;
    font-size: 7.6pt;
    color: #b5c6d9;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 3mm;
    padding: 1.1mm 2.6mm;
  }
  .p-cats i { width: 1.9mm; height: 1.9mm; border-radius: 50%; display: inline-block; }
  .p-cats b { color: #e2e8f0; font-weight: 600; }
  .p-codigo {
    position: absolute;
    left: 18mm; right: 18mm; bottom: 22mm;
    background: rgba(2,10,24,0.7);
    border: 1px solid rgba(125,211,252,0.22);
    border-radius: 5mm;
    padding: 6mm 7mm;
    font-family: Consolas, monospace;
    font-size: 8.4pt;
    line-height: 1.75;
    color: #9fb3c8;
  }
  .p-codigo .kw { color: #7dd3fc; }
  .p-codigo .lit { color: #86efac; }
  .p-codigo .com { color: #64748b; }
  .p-pie {
    position: absolute;
    left: 18mm; bottom: 9mm;
    font-size: 8pt;
    color: #64748b;
  }

  /* ---------- MAPA ---------- */
  .mapa { break-after: page; }
  .mapa-head { border-bottom: 2.4pt solid #0f172a; padding-bottom: 4mm; margin-bottom: 7mm; }
  .mapa-head h2 { font-size: 21pt; color: #0f172a; letter-spacing: -0.4px; }
  .mapa-head p { font-size: 9.5pt; color: #475569; margin-top: 2mm; max-width: 150mm; }
  .leyenda { display: flex; gap: 3mm; flex-wrap: wrap; margin: 5mm 0 8mm; }
  .leyenda .badge { position: static; }
  .leyenda-item { display: flex; align-items: center; gap: 2mm; font-size: 8.2pt; color: #475569; }
  .mapa-grid { columns: 2; column-gap: 9mm; }
  .mapa-grupo { break-inside: avoid; margin-bottom: 6mm; }
  .mapa-parte {
    font-size: 8.4pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--pcolor);
    border-bottom: 1pt solid rgba(0,0,0,0.12);
    padding-bottom: 1.5mm;
    margin-bottom: 2.5mm;
  }
  .mapa-parte span {
    display: inline-block;
    min-width: 8mm;
  }
  .mapa-grupo li {
    display: flex;
    align-items: baseline;
    gap: 2.2mm;
    font-size: 8.6pt;
    color: #334155;
    padding: 1.1mm 0;
  }
  .mapa-grupo li i { width: 2.3mm; height: 2.3mm; border-radius: 50%; flex: none; transform: translateY(-0.4mm); }
  .m-id { font-family: Consolas, monospace; font-size: 7.4pt; color: #94a3b8; min-width: 6mm; }
  .mapa-grupo li em { margin-left: auto; font-style: normal; font-size: 7.4pt; color: #94a3b8; }

  /* ---------- PARTES ---------- */
  .parte { break-before: page; break-after: page; }
  .parte-card {
    border-radius: 8mm;
    background: linear-gradient(135deg, var(--pcolor), var(--pdark));
    color: #fff;
    padding: 16mm 16mm 14mm;
    min-height: 150mm;
  }
  .parte-eyebrow {
    font-family: Consolas, monospace;
    font-size: 9pt;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.72);
  }
  .parte-card h1 { font-size: 27pt; line-height: 1.12; margin-top: 3mm; letter-spacing: -0.5px; }
  .parte-sub { font-size: 10.5pt; color: rgba(255,255,255,0.85); margin-top: 4mm; max-width: 135mm; line-height: 1.45; }
  .parte-lista { margin-top: 11mm; border-top: 1px solid rgba(255,255,255,0.28); }
  .parte-lista li {
    display: flex;
    align-items: center;
    gap: 4mm;
    padding: 2.6mm 0;
    border-bottom: 1px solid rgba(255,255,255,0.14);
    font-size: 10pt;
  }
  .pt-num { font-family: Consolas, monospace; font-size: 9pt; color: rgba(255,255,255,0.6); min-width: 8mm; }
  .pt-tit { font-weight: 600; }
  .pt-count {
    margin-left: auto;
    font-size: 8pt;
    background: rgba(255,255,255,0.18);
    border-radius: 3mm;
    padding: 0.8mm 3mm;
  }

  /* ---------- SECCIONES ---------- */
  .seccion { break-before: page; }
  .sec-head { display: flex; align-items: flex-start; gap: 5mm; }
  .sec-num {
    font-family: Consolas, monospace;
    font-size: 26pt;
    font-weight: 700;
    line-height: 1;
    color: var(--accent);
    background: var(--accent-soft);
    border-radius: 4mm;
    padding: 3mm 4.5mm;
  }
  .sec-txt { flex: 1; }
  .sec-txt h2 { font-size: 18pt; color: #0f172a; letter-spacing: -0.35px; line-height: 1.15; }
  .sec-txt p { font-size: 9pt; color: #52627a; margin-top: 1.8mm; max-width: 140mm; }
  .sec-count {
    text-align: right;
    color: var(--accent);
    border-left: 1.6pt solid var(--accent-mid);
    padding-left: 4mm;
  }
  .sec-count b { display: block; font-size: 17pt; line-height: 1; }
  .sec-count span { font-size: 7.2pt; text-transform: uppercase; letter-spacing: 0.7px; color: #8494a8; }
  .regla {
    height: 1.6pt;
    margin: 4.5mm 0 4mm;
    background: linear-gradient(90deg, var(--accent), var(--accent-mid), transparent);
    border-radius: 2pt;
  }

  /* ---------- TARJETAS ---------- */
  .card {
    break-inside: avoid;
    border: 0.8pt solid #e2e8f0;
    border-left: 2.6pt solid var(--accent);
    border-radius: 2.2mm;
    padding: 2.6mm 3.4mm 2.8mm;
    margin-bottom: 2.4mm;
    background: #fff;
  }
  .card-top { display: flex; align-items: flex-start; gap: 2.6mm; }
  .sintaxis {
    flex: 1;
    font-family: Consolas, 'Cascadia Mono', monospace;
    font-size: 8.9pt;
    line-height: 1.34;
    color: var(--accent-dark);
    background: var(--accent-soft);
    border-radius: 1.4mm;
    padding: 1.4mm 2.2mm;
    white-space: pre-wrap;
    word-break: break-word;
    font-weight: 600;
  }
  .badge {
    flex: none;
    font-size: 6.2pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: var(--bc);
    background: var(--bc-soft);
    border-radius: 3mm;
    padding: 1mm 2.2mm;
    margin-top: 0.6mm;
  }
  .exp { font-size: 8.5pt; color: #334155; margin-top: 1.9mm; line-height: 1.4; }
  .origen {
    font-size: 7.3pt;
    color: #8b9aad;
    margin-top: 1.2mm;
  }
  .origen-lbl {
    text-transform: uppercase;
    letter-spacing: 0.6px;
    font-size: 6.2pt;
    font-weight: 700;
    color: #a9b6c6;
  }
  .aviso {
    font-size: 7.9pt;
    color: #9a3412;
    background: #fff7ed;
    border-left: 1.8pt solid #f59e0b;
    border-radius: 1.2mm;
    padding: 1.4mm 2.2mm;
    margin-top: 1.7mm;
    line-height: 1.36;
  }
  .aviso-ico {
    display: inline-block;
    width: 3.4mm; height: 3.4mm;
    line-height: 3.4mm;
    text-align: center;
    border-radius: 50%;
    background: #f59e0b;
    color: #fff;
    font-size: 6pt;
    font-weight: 700;
    margin-right: 1.2mm;
    transform: translateY(-0.2mm);
  }

  /* ---------- TABLAS ---------- */
  .tabla-wrap { break-inside: avoid; margin-bottom: 4mm; }
  .tabla-tit {
    font-size: 8.4pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--accent);
    margin-bottom: 1.6mm;
  }
  table { width: 100%; border-collapse: collapse; font-size: 8.2pt; }
  thead th {
    text-align: left;
    font-size: 7pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #64748b;
    border-bottom: 1.2pt solid var(--accent);
    padding: 1.2mm 2mm;
  }
  tbody td { padding: 1.3mm 2mm; border-bottom: 0.5pt solid #e8edf3; color: #334155; vertical-align: top; }
  tbody tr:nth-child(even) td { background: rgba(0,0,0,0.018); }
  td.mono { font-family: Consolas, monospace; font-size: 7.9pt; color: var(--accent); white-space: nowrap; }
</style>
</head>
<body>

<!-- PORTADA -->
<div class="portada">
  <div class="p-marca">Resumen de referencia · .bat</div>
  <h1 class="p-tit">Todas las sintaxis <em>únicas</em> de un archivo .BAT</h1>
  <p class="p-sub">Guía categorizada, comentada y con las trampas reales encontradas en los scripts del proyecto.</p>
  <div class="p-linea"></div>
  <div class="p-chips">
    <span class="p-chip"><b>${totalItems}</b> sintaxis explicadas</span>
    <span class="p-chip"><b>${secciones.length}</b> categorías</span>
    <span class="p-chip"><b>${totalTablas}</b> tablas de referencia</span>
    <span class="p-chip"><b>26</b> archivos .bat revisados</span>
  </div>
  <div class="p-cats">
    ${secciones
      .map((s) => `<span><i style="background:${s.color}"></i>${esc(s.titulo)}</span>`)
      .join('')}
  </div>
  <div class="p-codigo">
    <div><span class="com">rem --- cabecera típica de cualquier .bat del proyecto ---</span></div>
    <div><span class="kw">@echo off</span> &amp; <span class="kw">chcp</span> 65001 &gt;nul</div>
    <div><span class="kw">setlocal</span> enabledelayedexpansion</div>
    <div><span class="kw">cd</span> /d <span class="lit">"%~dp0"</span></div>
    <div><span class="kw">set</span> <span class="lit">"REP=%~dp0Reportes"</span> &amp; <span class="kw">if not exist</span> <span class="lit">"%REP%"</span> <span class="kw">mkdir</span> <span class="lit">"%REP%"</span></div>
    <div><span class="kw">goto</span> :menu</div>
  </div>
  <p class="p-pie">${meta.curso} · ${meta.fecha}</p>
</div>

<!-- MAPA -->
<section class="mapa">
  <div class="mapa-head">
    <h2>Mapa de la guía</h2>
    <p>Las categorías siguen el orden en que se necesita cada concepto al escribir un script: primero la estructura, después el control de flujo, luego el procesamiento de datos y al final las recetas y los errores que conviene evitar. Los apéndices reúnen lo que no es sintaxis propia de batch pero se escribe dentro de los .bat.</p>
  </div>
  <div class="leyenda">
    <span class="leyenda-item"><span class="badge" style="--bc:${COLORES_BADGE.base};--bc-soft:${rgba(
      COLORES_BADGE.base,
      0.12
    )}">base</span> uso cotidiano</span>
    <span class="leyenda-item"><span class="badge" style="--bc:${COLORES_BADGE.avanzado};--bc-soft:${rgba(
      COLORES_BADGE.avanzado,
      0.12
    )}">avanzado</span> requiere contexto</span>
    <span class="leyenda-item"><span class="badge" style="--bc:${COLORES_BADGE.peligro};--bc-soft:${rgba(
      COLORES_BADGE.peligro,
      0.12
    )}">peligro</span> irreversible o sensible</span>
    <span class="leyenda-item"><span class="badge" style="--bc:${COLORES_BADGE.trampa};--bc-soft:${rgba(
      COLORES_BADGE.trampa,
      0.12
    )}">trampa</span> error frecuente</span>
  </div>
  <div class="mapa-grid">
    ${mapa}
  </div>
</section>

${partes_
  .map(
    (p) => `
${bloqueParte(p)}
${p.secciones.map(bloqueSeccion).join('\n')}
`
  )
  .join('\n')}

</body>
</html>`;

const htmlPath = path.join(__dirname, 'guia.html');
fs.writeFileSync(htmlPath, html, 'utf8');

const navegador = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--allow-file-access-from-files']
});
const pagina = await navegador.newPage();
await pagina.setViewport({ width: 695, height: 1013 });
await pagina.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
await pagina.emulateMediaType('print');

const desbordes = await pagina.evaluate(() => {
  const malos = [];
  document.querySelectorAll('*').forEach((el) => {
    if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
      malos.push(el.tagName + '.' + el.className + ' (' + el.scrollWidth + '>' + el.clientWidth + ')');
    }
  });
  return malos.slice(0, 12);
});

const pdfPath = path.join(__dirname, '..', '..', 'Guia-Sintaxis-BAT.pdf');
const buffer = await pagina.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: false,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: `
    <div style="width:100%;font-family:'Segoe UI',Arial;font-size:7.5px;color:#94a3b8;padding:0 13mm;display:flex;justify-content:space-between;align-items:center;">
      <span>Guía de sintaxis .BAT · ${meta.curso}</span>
      <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
    </div>`,
  margin: { top: '14mm', right: '13mm', bottom: '15mm', left: '13mm' }
});

await navegador.close();

// Metadatos del PDF
const { PDFDocument } = await import('pdf-lib');
const doc = await PDFDocument.load(buffer);
doc.setTitle(`${meta.titulo} — ${meta.subtitulo}`);
doc.setSubject('Resumen categorizado de sintaxis .BAT');
doc.setAuthor(meta.curso);
doc.setKeywords(['batch', 'cmd', 'sintaxis', 'sistemas operativos']);
doc.setCreator('Guía de sintaxis .BAT');
const pdfBytes = await doc.save();
fs.writeFileSync(pdfPath, pdfBytes);
// Copia dentro de la carpeta del proyecto: el paquete que se comparte lleva el
// PDF ya construido junto al código que lo genera.
fs.writeFileSync(path.join(__dirname, '..', 'Guia-Sintaxis-BAT.pdf'), pdfBytes);

const paginas = doc.getPageCount();
console.log('Sintaxis en la guía:', totalItems, '| tablas:', totalTablas);
console.log('Secciones:', secciones.length, '| partes:', partes_.length);
console.log('PDF:', pdfPath);
console.log('Páginas:', paginas, '| tamaño:', (fs.statSync(pdfPath).size / 1024 / 1024).toFixed(2), 'MB');
console.log('Desbordes horizontales:', desbordes.length ? desbordes : 'ninguno');
