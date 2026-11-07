/* Motor de verificación de sintaxis .BAT.
   Sin dependencias: funciona igual en el navegador (window.Verificador)
   y en Node (require). No evalúa ni ejecuta nada, solo compara texto. */
(function (raiz) {
  'use strict';

  var HOLDE_PORCENTAJE = /^%%[A-Za-z]$/;

  // ---------- piezas básicas ----------

  function limpiar(texto) {
    return String(texto == null ? '' : texto)
      .replace(/[\u201c\u201d\u00ab\u00bb]/g, '"')
      .replace(/\u2019/g, "'")
      .replace(/\r\n?/g, '\n');
  }

  // Parte el texto en piezas significativas: los espacios de dentro de las
  // comillas no separan, y todo va en minúsculas porque cmd no distingue.
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

  // Piezas de a que no aparecen en b, respetando cuántas veces aparece cada una.
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

  function igualToken(mio, esperado, mapeo) {
    if (mio === esperado) return true;
    // Hueco: %%p, %%a, %%i... el nombre de la variable del for es libre,
    // pero tiene que usarse igual en todas sus apariciones.
    if (HOLDE_PORCENTAJE.test(esperado) && HOLDE_PORCENTAJE.test(mio)) {
      if (!Object.prototype.hasOwnProperty.call(mapeo, esperado)) {
        mapeo[esperado] = mio;
        return true;
      }
      return mapeo[esperado] === mio;
    }
    // Las comillas alrededor de una pieza sin espacios son opcionales.
    if (sinComillas(esperado) === sinComillas(mio)) return true;
    return false;
  }

  // ---------- comparadores ----------

  function compararTexto(respuesta, esperado) {
    var mios = tokenizar(respuesta);
    var otros = tokenizar(esperado);
    if (!mios.length) {
      return { estado: 'vacio', puntaje: 0, faltan: otros, sobran: [], pistas: [] };
    }

    var mapeo = {};
    var iguales = mios.length === otros.length;
    if (iguales) {
      for (var k = 0; k < otros.length; k++) {
        if (!igualToken(mios[k], otros[k], mapeo)) {
          iguales = false;
          break;
        }
      }
    }
    if (iguales) return { estado: 'correcto', puntaje: 1, faltan: [], sobran: [], pistas: [] };

    var faltan = restar(otros, mios);
    var sobran = restar(mios, otros);
    var puntaje = otros.length ? (otros.length - faltan.length) / otros.length : 0;
    var pistas = [];
    if (!faltan.length && !sobran.length) {
      pistas.push('Están todas las piezas, pero en otro orden.');
      puntaje = 0.75;
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
    var mejor = { estado: 'vacio', puntaje: 0, faltan: tokenizar(respuesta), sobran: [], pistas: [] };
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
      estado: aciertos === detalles.length ? 'correcto' : (aciertos ? 'parcial' : 'incorrecto'),
      puntaje: detalles.length ? aciertos / detalles.length : 0,
      detalles: detalles,
      pistas: []
    };
  }

  // Un campo puede pedir una respuesta exacta, varias válidas o unas piezas.
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
      estado: aciertos === detalles.length ? 'correcto' : (suma > 0 ? 'parcial' : 'incorrecto'),
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

    if (p.tipo === 'revelar') return { tipo: 'revelar', estado: 'revelar', puntaje: 0, pistas: [] };

    var r;
    if (p.tipo === 'campos') {
      r = compararCampos(entrada, p.campos);
    } else if (p.tipo === 'requisitos') {
      r = compararRequisitos(entrada[0] || '', p.requisitos);
    } else if (p.alt) {
      r = compararAlternativas(entrada[0] || '', p.alt);
    } else {
      r = compararTexto(entrada[0] || '', item.c);
    }
    r.tipo = p.tipo;
    return r;
  }

  var API = {
    tokenizar: tokenizar,
    limpiar: limpiar,
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
