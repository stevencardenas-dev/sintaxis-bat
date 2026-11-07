/* Motor de verificación de sintaxis .BAT.
   Sin dependencias: funciona igual en el navegador (window.Verificador)
   y en Node (require). No evalúa ni ejecuta nada, solo compara texto.

   Fase 1: además de comparar piezas, entiende algunas equivalencias reales de
   cmd (operadores pegados, orden de opciones de for /f, nombres de variables,
   etiquetas, archivos y texto libre en echo) y sugiere correcciones de tipeo. */
(function (raiz) {
  'use strict';

  var HOLDE_PORCENTAJE = /^%%[A-Za-z]$/;

  // Variables del sistema: cambiarlas cambia el significado, no son huecos.
  var VARS_SISTEMA =
    /^%?(errorlevel|username|computername|userdomain|date|time|temp|tmp|userprofile|systemroot|windir|path|pathext|os|processor_architecture|programfiles|programfiles\(x86\)|appdata|localappdata|public|homedrive|homepath|logonserver|number_of_processors|random|cd|cmdcmdline|comspec|allusersprofile|userdnsdomain|userdomain_roamingprofile)%?$/i;

  var EXTENSIONES =
    /\.(txt|log|bat|cmd|ps1|csv|exe|html|htm|hex|b64|bin|ini|docx|jpg|png|der|cer|vbs|json|xml|sys|dll|iso|md|zip)$/i;

  // ---------- piezas básicas ----------

  function limpiar(texto) {
    return String(texto == null ? '' : texto)
      .replace(/[\u201c\u201d\u00ab\u00bb]/g, '"')
      .replace(/\u2019/g, "'")
      .replace(/\r\n?/g, '\n');
  }

  function tokenizar(texto) {
    var s = limpiar(texto);
    var tokens = [];
    var actual = '';
    var enComillas = false;
    var i, ch;

    function cerrar() {
      if (actual) {
        tokens.push(actual.toLowerCase());
        actual = '';
      }
    }

    for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      if (enComillas) {
        actual += ch;
        if (ch === '"') enComillas = false;
        continue;
      }
      if (ch === '"') {
        cerrar();
        enComillas = true;
        actual = '"';
        continue;
      }
      if (/\s/.test(ch)) {
        cerrar();
        continue;
      }
      actual += ch;
    }
    cerrar();
    return tokens;
  }

  function sinComillas(t) {
    if (t.length >= 2 && t.charAt(0) === '"' && t.charAt(t.length - 1) === '"') {
      return t.slice(1, -1);
    }
    return t;
  }

  function restar(a, b) {
    var copia = b.slice();
    var salida = [];
    a.forEach(function (t) {
      var k = copia.indexOf(t);
      if (k === -1) salida.push(t);
      else copia.splice(k, 1);
    });
    return salida;
  }

  // ---------- equivalencias de cmd ----------

  var OPERADORES = ['2>>', '2>&1', '2>', '1>>', '1>', '>>', '>', '<', '||', '&&', '|', '&'];

  // «dir>out.txt», «dir > out.txt» y «dir 1>out.txt» son lo mismo para cmd.
  function partirOperadores(tokens) {
    var salida = [];
    tokens.forEach(function (t) {
      if (t.charAt(0) === '"') {
        salida.push(t);
        return;
      }
      var i = 0;
      var buf = '';
      while (i < t.length) {
        var op = null;
        var k;
        for (k = 0; k < OPERADORES.length; k++) {
          if (t.substr(i, OPERADORES[k].length) === OPERADORES[k]) {
            op = OPERADORES[k];
            break;
          }
        }
        if (op) {
          if (buf) {
            salida.push(buf);
            buf = '';
          }
          salida.push(op === '1>' ? '>' : op === '1>>' ? '>>' : op);
          i += op.length;
        } else {
          buf += t.charAt(i);
          i += 1;
        }
      }
      if (buf) salida.push(buf);
    });
    return salida;
  }

  // En for /f el orden de las opciones da igual: «tokens=1 delims=,» ≡ «delims=, tokens=1».
  function ordenarOpciones(t) {
    if (t.charAt(0) !== '"' || t.charAt(t.length - 1) !== '"') return t;
    var dentro = t.slice(1, -1);
    if (dentro.indexOf(' ') === -1) return t;
    var partes = dentro.split(/\s+/).filter(Boolean);
    if (partes.length < 2) return t;
    var todasClave = partes.every(function (p) {
      return /^[a-z][a-z0-9]*=/i.test(p);
    });
    if (!todasClave) return t;
    return '"' + partes.sort().join(' ') + '"';
  }

  function preparar(texto) {
    return partirOperadores(tokenizar(texto)).map(ordenarOpciones);
  }

  function pareceArchivo(t) {
    var s = sinComillas(t);
    return s.indexOf('\\') !== -1 || EXTENSIONES.test(s);
  }

  function esPalabraPlana(t) {
    return !/[%!^|<>()&:]/.test(t);
  }

  // ---------- huecos dentro de una pieza ----------

  function trozos(t) {
    var re = /(%[A-Za-z_][A-Za-z0-9_]*%|![A-Za-z_][A-Za-z0-9_]*!)/g;
    var salida = [];
    var ultimo = 0;
    var m;
    while ((m = re.exec(t)) !== null) {
      if (m.index > ultimo) salida.push({ t: t.slice(ultimo, m.index) });
      salida.push({ v: m[0].toLowerCase() });
      ultimo = m.index + m[0].length;
    }
    if (ultimo < t.length) salida.push({ t: t.slice(ultimo) });
    return salida;
  }

  // Compara una pieza dejando libres las variables que no son del sistema,
  // pero exigiendo que cada una se use igual en todas sus apariciones.
  function coincideLiteral(mio, esperado, mapa) {
    var a = trozos(sinComillas(mio));
    var b = trozos(sinComillas(esperado));
    if (a.length !== b.length) return false;
    for (var i = 0; i < b.length; i++) {
      if (b[i].v) {
        if (!a[i].v) return false;
        if (VARS_SISTEMA.test(b[i].v)) {
          if (a[i].v !== b[i].v) return false;
          continue;
        }
        if (!Object.prototype.hasOwnProperty.call(mapa, b[i].v)) mapa[b[i].v] = a[i].v;
        else if (mapa[b[i].v] !== a[i].v) return false;
      } else if (a[i].v || a[i].t !== b[i].t) {
        return false;
      }
    }
    return true;
  }

  // ---------- patrón de la respuesta canónica ----------

  function compilarPatron(otros) {
    var pasos = [];
    var i, t, sig;

    for (i = 0; i < otros.length; i++) {
      t = otros[i];
      sig = otros[i + 1];

      if (HOLDE_PORCENTAJE.test(t)) {
        // Cada variable del for es un hueco propio: %%a y %%b pueden renombrarse,
        // pero no confundirse entre sí.
        pasos.push({ k: 'h', tipo: 'porcentaje', id: '%%:' + t });
        continue;
      }
      if (t === 'goto' && sig && sig !== ':eof') {
        pasos.push({ k: 't', v: t });
        pasos.push({ k: 'h', tipo: 'etiqueta', id: 'lab:' + sig.replace(/^:/, '') });
        i += 1;
        continue;
      }
      if (/^:[^:]/.test(t) && t !== ':eof') {
        pasos.push({ k: 'h', tipo: 'etiqueta', id: 'lab:' + t.slice(1) });
        continue;
      }
      if (t === 'echo') {
        pasos.push({ k: 't', v: t });
        var fin = i + 1;
        while (fin < otros.length && esPalabraPlana(otros[fin])) fin += 1;
        var cola = otros.slice(i + 1, fin);
        var primero = cola[0];
        if (cola.length && primero !== 'off' && primero !== 'on' && primero !== '.') {
          pasos.push({ k: 'x', siguiente: fin < otros.length ? otros[fin] : null });
          i = fin - 1;
        }
        continue;
      }
      if (i > 0 && pareceArchivo(t)) {
        pasos.push({ k: 'a' });
        continue;
      }
      pasos.push({ k: 't', v: t });
    }
    return pasos;
  }

  function coincidir(pasos, mios) {
    var j = 0;
    var mapa = {};
    var i, p, t, k, tope;

    for (i = 0; i < pasos.length; i++) {
      p = pasos[i];
      if (p.k === 't') {
        if (mios[j] == null || !coincideLiteral(mios[j], p.v, mapa)) return null;
        j += 1;
        continue;
      }
      if (p.k === 'h') {
        t = mios[j];
        if (t == null) return null;
        if (p.tipo === 'porcentaje' && !HOLDE_PORCENTAJE.test(t)) return null;
        if (p.tipo === 'etiqueta' && !/^:?[a-z_][a-z0-9_]*$/i.test(t)) return null;
        var valor = p.tipo === 'etiqueta' ? t.replace(/^:/, '') : t;
        if (!Object.prototype.hasOwnProperty.call(mapa, p.id)) mapa[p.id] = valor;
        else if (mapa[p.id] !== valor) return null;
        j += 1;
        continue;
      }
      if (p.k === 'a') {
        if (!pareceArchivo(mios[j] || '')) return null;
        j += 1;
        continue;
      }
      if (p.k === 'x') {
        k = j;
        if (p.siguiente) {
          tope = mios.length;
          var encontrado = false;
          while (k < tope) {
            if (sinComillas(mios[k]) === sinComillas(p.siguiente)) {
              encontrado = true;
              break;
            }
            k += 1;
          }
          if (!encontrado) return null;
        } else {
          while (k < mios.length && esPalabraPlana(mios[k])) k += 1;
        }
        if (k === j) return null;
        j = k;
        continue;
      }
    }
    return j === mios.length ? mapa : null;
  }

  // ---------- sugerencias de tipeo ----------

  function distancia(a, b) {
    var m = a.length;
    var n = b.length;
    if (Math.abs(m - n) > 2) return 99;
    var prev = [];
    var cur = [];
    var i, j;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur[0] = i;
      for (j = 1; j <= n; j++) {
        cur[j] = Math.min(
          prev[j] + 1,
          cur[j - 1] + 1,
          prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1)
        );
      }
      prev = cur.slice();
    }
    return prev[n];
  }

  function sugerir(faltan, sobran) {
    var salida = [];
    faltan.forEach(function (esperado) {
      var mejor = null;
      sobran.forEach(function (escrito) {
        if (sinComillas(escrito).length < 4) return;
        var d = distancia(sinComillas(esperado), sinComillas(escrito));
        if (d <= 2 && (!mejor || d < mejor.d)) mejor = { escrito: escrito, esperado: esperado, d: d };
      });
      if (mejor) salida.push(mejor);
    });
    return salida;
  }

  // ---------- comparadores ----------

  function compararTexto(respuesta, esperado) {
    var mios = preparar(respuesta);
    var otros = preparar(esperado);
    if (!mios.length) {
      return { estado: 'vacio', puntaje: 0, faltan: otros, sobran: [], pistas: [] };
    }

    if (coincidir(compilarPatron(otros), mios)) {
      return { estado: 'correcto', puntaje: 1, faltan: [], sobran: [], pistas: [] };
    }

    var faltan = restar(otros, mios);
    var sobran = restar(mios, otros);
    var sugerencias = sugerir(faltan, sobran);
    var total = Math.max(otros.length, mios.length);
    var puntaje = total ? (otros.length - faltan.length) / total : 0;
    var pistas = sugerencias.map(function (s) {
      return '¿Quisiste decir «' + s.esperado + '» en vez de «' + s.escrito + '»?';
    });

    if (!faltan.length && !sobran.length) {
      pistas.push('Están todas las piezas, pero en otro orden.');
      puntaje = 0.75;
    } else if (sugerencias.length) {
      puntaje = Math.max(puntaje, 0.6);
    }

    return {
      estado: puntaje >= 0.75 ? 'parcial' : 'incorrecto',
      puntaje: puntaje,
      faltan: faltan,
      sobran: sobran,
      pistas: pistas
    };
  }

  function compararAlternativas(respuesta, alternativas) {
    var mejor = { estado: 'vacio', puntaje: 0, faltan: [], sobran: [], pistas: [] };
    for (var k = 0; k < alternativas.length; k++) {
      var r = compararTexto(respuesta, alternativas[k]);
      if (r.estado === 'correcto') {
        r.alternativa = alternativas[k];
        return r;
      }
      if (r.puntaje > mejor.puntaje) mejor = r;
    }
    return mejor;
  }

  function compararRequisitos(respuesta, requisitos) {
    var plano = tokenizar(respuesta).join(' ');
    if (!plano) return { estado: 'vacio', puntaje: 0, detalles: [], pistas: [] };

    var detalles = requisitos.map(function (req) {
      var ok = false;
      try {
        ok = new RegExp(req.re, 'i').test(plano);
      } catch (err) {
        ok = false;
      }
      return { texto: req.texto, estado: ok ? 'correcto' : 'falta', puntaje: ok ? 1 : 0 };
    });

    var aciertos = detalles.filter(function (d) {
      return d.estado === 'correcto';
    }).length;

    return {
      estado: aciertos === detalles.length ? 'correcto' : aciertos ? 'parcial' : 'incorrecto',
      puntaje: detalles.length ? aciertos / detalles.length : 0,
      detalles: detalles,
      pistas: []
    };
  }

  function compararCampo(valor, campo) {
    if (campo.requisitos) return compararRequisitos(valor, campo.requisitos);
    if (campo.alt && campo.alt.length) return compararAlternativas(valor, campo.alt);
    return compararTexto(valor, campo.esperado);
  }

  function compararCampos(valores, campos) {
    var conContenido = false;
    var detalles = campos.map(function (campo, k) {
      var valor = valores[k] || '';
      if (tokenizar(valor).length) conContenido = true;
      var r = compararCampo(valor, campo);
      return {
        rotulo: campo.rotulo || 'Parte ' + (k + 1),
        estado: r.estado,
        puntaje: r.puntaje || 0,
        faltan: r.faltan || [],
        sobran: r.sobran || [],
        pistas: r.pistas || [],
        detalles: r.detalles || null,
        esperado: campo.esperado || null
      };
    });

    if (!conContenido) return { estado: 'vacio', puntaje: 0, detalles: detalles, pistas: [] };

    var aciertos = detalles.filter(function (d) {
      return d.estado === 'correcto';
    }).length;
    var suma = detalles.reduce(function (n, d) {
      return n + d.puntaje;
    }, 0);

    return {
      estado: aciertos === detalles.length ? 'correcto' : suma > 0 ? 'parcial' : 'incorrecto',
      puntaje: campos.length ? suma / campos.length : 0,
      detalles: detalles,
      pistas: []
    };
  }

  // ---------- qué interfaz pide cada entrada ----------

  function plan(item) {
    var r = item && item.r ? item.r : null;
    var multilinea = !!(item && /\n/.test(item.c));

    if (r) {
      if (r.campos) return { tipo: 'campos', campos: r.campos };
      if (r.requisitos) return { tipo: 'requisitos', requisitos: r.requisitos };
      if (r.alt) return { tipo: multilinea ? 'bloque' : 'linea', alt: r.alt };
      if (r.tipo) return { tipo: r.tipo };
    }
    if (item && item.z) return { tipo: 'revelar' };
    if (item && item.alt && item.alt.length) {
      return { tipo: multilinea ? 'bloque' : 'linea', alt: item.alt };
    }
    if (multilinea) return { tipo: 'bloque' };
    if (item && /\u2192|\.\.\./.test(item.c)) return { tipo: 'revelar' };
    return { tipo: 'linea' };
  }

  function evaluar(item, valores) {
    var p = plan(item);
    var entrada = Object.prototype.toString.call(valores) === '[object Array]' ? valores : [valores];
    var r;

    if (p.tipo === 'revelar') return { tipo: 'revelar', estado: 'revelar', puntaje: 0, pistas: [] };

    if (p.tipo === 'campos') r = compararCampos(entrada, p.campos);
    else if (p.tipo === 'requisitos') r = compararRequisitos(entrada[0] || '', p.requisitos);
    else if (p.alt) r = compararAlternativas(entrada[0] || '', p.alt);
    else r = compararTexto(entrada[0] || '', item.c);

    r.tipo = p.tipo;
    return r;
  }

  var API = {
    tokenizar: tokenizar,
    preparar: preparar,
    limpiar: limpiar,
    coincideLiteral: coincideLiteral,
    compararTexto: compararTexto,
    compararAlternativas: compararAlternativas,
    compararRequisitos: compararRequisitos,
    compararCampos: compararCampos,
    plan: plan,
    evaluar: evaluar
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  raiz.Verificador = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
