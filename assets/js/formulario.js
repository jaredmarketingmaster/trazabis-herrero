/* Formulario de cualificación en dos pasos.
   - Captura utm_* y fbclid de la URL y los guarda en sessionStorage.
   - Valida en español, con aria-invalid y aria-describedby, y lleva el foco al primer error.
   - Envía en JSON a FORM_ENDPOINT. Si está vacío: modo de desarrollo (console.info, sin envío).
   - Al enviar con éxito sustituye el formulario por la página de gracias y la recuerda al recargar. */
(function () {
  "use strict";

  var cfg = window.TRAZABIS_CONFIG || {};
  var DL = window.TrazabisDL || { push: function () {} };

  var CLAVE_UTM = "trazabis_utm";
  var CLAVE_ENVIO = "trazabis_envio";
  var CAMPOS_ORIGEN = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];
  var CAMPOS_UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var PASO1 = ["clientes_cartera", "tamano_equipo", "cargo", "programa_contable", "acepta_sin_conector", "intento_previo", "plazo_inicio"];
  var PASO2 = ["nombre", "despacho", "email", "telefono", "que_resolver", "acepta_privacidad", "acepta_llamada_ia"];
  var CLIENTES_51_O_MAS = ["51_100", "101_150", "151_200", "201_250", "251_300", "mas_300"];
  var NO_APLICA = "no_aplica";
  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var TIEMPO_MAXIMO_ENVIO = 15000;

  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }

  /* ---------- Origen de la visita ---------- */
  function capturarOrigen() {
    var params;
    try { params = new URLSearchParams(location.search); } catch (e) { return; }
    var nuevos = {};
    var hay = false;
    CAMPOS_ORIGEN.forEach(function (c) {
      var v = params.get(c);
      if (v) { nuevos[c] = v.slice(0, 500); hay = true; }
    });
    if (hay) ssSet(CLAVE_UTM, JSON.stringify(nuevos));
  }

  function leerOrigen() {
    var d = {};
    try { d = JSON.parse(ssGet(CLAVE_UTM) || "{}") || {}; } catch (e) { d = {}; }
    var r = {};
    CAMPOS_ORIGEN.forEach(function (c) { r[c] = typeof d[c] === "string" ? d[c] : ""; });
    return r;
  }

  /* ---------- Prioridad (no cambia nada de lo que ve el usuario) ---------- */
  function calcularPrioridad(d) {
    if (d.acepta_sin_conector === "no" || d.clientes_cartera === "menos_20") return "no_cerrar";
    if (CLIENTES_51_O_MAS.indexOf(d.clientes_cartera) !== -1 &&
        d.cargo === "socio_director_gerente" &&
        (d.programa_contable === "odoo" || d.acepta_sin_conector === "si") &&
        d.intento_previo !== "no") return "alta";
    if (d.clientes_cartera === "20_50" || d.plazo_inicio === "solo_informandome") return "baja";
    return "media";
  }

  function uuidv4() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    var b = new Uint8Array(16);
    window.crypto.getRandomValues(b);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    var h = Array.prototype.map.call(b, function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
    return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20);
  }

  capturarOrigen();
  window.TrazabisForm = { calcularPrioridad: calcularPrioridad, uuidv4: uuidv4 };

  var contenedor = document.getElementById("form-contenedor");
  var form = document.getElementById("form-lead");
  if (!contenedor || !form) return;

  /* ---------- Página de gracias ---------- */
  function telefonoAsistente() {
    return typeof cfg.TELEFONO_ASISTENTE === "string" ? cfg.TELEFONO_ASISTENTE.trim() : "";
  }

  function descargarVCF(numero) {
    var tel = numero.replace(/[^\d+]/g, "");
    var vcf = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:;Trazabis — Asistente;;;",
      "FN:Trazabis — Asistente",
      "ORG:Trazabis",
      "TEL;TYPE=CELL,VOICE:" + tel,
      "END:VCARD"
    ].join("\r\n") + "\r\n";
    var blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "trazabis-asistente.vcf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  function mostrarGracias(nombre, enfocar) {
    var numero = telefonoAsistente();
    var caja = document.createElement("div");
    caja.className = "gracias";
    caja.setAttribute("tabindex", "-1");

    var icono = document.createElement("span");
    icono.className = "gracias__icono";
    icono.innerHTML = '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path pathLength="1" d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
    caja.appendChild(icono);

    var h2 = document.createElement("h2");
    h2.id = "formulario-titulo";
    h2.textContent = "Gracias, " + nombre + ". Ten el móvil a mano.";
    caja.appendChild(h2);

    var p = document.createElement("p");
    p.textContent = "En unos minutos te llamará el asistente de inteligencia artificial de Trazabis" +
      (numero ? " desde el " + numero : "") +
      " para confirmar tu interés y agendar tu diagnóstico de cartera.";
    caja.appendChild(p);

    if (numero) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "boton boton--primario";
      b.textContent = "Guardar el número en mis contactos";
      b.addEventListener("click", function () { descargarVCF(numero); });
      caja.appendChild(b);
    }

    contenedor.textContent = "";
    contenedor.appendChild(caja);
    if (enfocar) {
      caja.focus({ preventScroll: true });
      contenedor.scrollIntoView({ block: "start" });
    }
  }

  var envioPrevio = null;
  try { envioPrevio = JSON.parse(ssGet(CLAVE_ENVIO) || "null"); } catch (e) { envioPrevio = null; }
  if (envioPrevio && envioPrevio.enviado === true) {
    mostrarGracias(typeof envioPrevio.nombre === "string" ? envioPrevio.nombre : "", false);
    return;
  }

  /* ---------- Referencias ---------- */
  var pasos = {
    1: form.querySelector('[data-paso="1"]'),
    2: form.querySelector('[data-paso="2"]')
  };
  var progresoTexto = document.getElementById("progreso-texto");
  var progresoBarra = form.querySelector(".progreso__barra");
  var grupoSinConector = document.getElementById("grupo-acepta_sin_conector");
  var errorEnvio = form.querySelector(".error-envio");
  var botonEnviar = form.querySelector('button[type="submit"]');
  var textoResolver = form.elements.que_resolver;
  var contador = document.getElementById("contador-que_resolver");

  var pasoActual = 1;
  var enviando = false;
  var iniciado = false;
  var paso1Registrado = false;
  var eventIdPendiente = null;
  var tocados = {};

  /* ---------- Lectura de valores ---------- */
  function valorRadio(nombre) {
    var el = form.querySelector('input[name="' + nombre + '"]:checked');
    return el ? el.value : "";
  }

  function programaNoOdoo() {
    var p = valorRadio("programa_contable");
    return p !== "" && p !== "odoo";
  }

  function datosPaso1() {
    var d = {};
    PASO1.forEach(function (c) { d[c] = valorRadio(c); });
    if (!programaNoOdoo()) d.acepta_sin_conector = NO_APLICA;
    return d;
  }

  function prefijo() {
    return form.elements.telefono_prefijo.value;
  }

  // Dígitos del número nacional. Si la persona ha escrito también el prefijo del país
  // (+34…, 0034… o 34 seguido de 9 dígitos), se quita para no duplicarlo.
  function digitosTelefono() {
    var bruto = String(form.elements.telefono.value).trim();
    var d = bruto.replace(/\D/g, "");
    var cc = prefijo().replace(/\D/g, "");
    if (bruto.charAt(0) === "+" && d.indexOf(cc) === 0) return d.slice(cc.length);
    if (d.indexOf("00" + cc) === 0) return d.slice(cc.length + 2);
    if (cc === "34" && d.length === 11 && d.indexOf("34") === 0) return d.slice(2);
    return d;
  }

  function telefonoE164() {
    return prefijo() + digitosTelefono();
  }

  /* ---------- Validación ---------- */
  function radioObligatorio(nombre) {
    return function () { return valorRadio(nombre) ? "" : "Elige una opción."; };
  }

  var VALIDADORES = {
    clientes_cartera: radioObligatorio("clientes_cartera"),
    tamano_equipo: radioObligatorio("tamano_equipo"),
    cargo: radioObligatorio("cargo"),
    programa_contable: radioObligatorio("programa_contable"),
    acepta_sin_conector: function () {
      if (!programaNoOdoo()) return "";
      return valorRadio("acepta_sin_conector") ? "" : "Elige una opción.";
    },
    intento_previo: radioObligatorio("intento_previo"),
    plazo_inicio: radioObligatorio("plazo_inicio"),
    nombre: function () {
      return form.elements.nombre.value.trim() ? "" : "Escribe tu nombre.";
    },
    despacho: function () {
      return form.elements.despacho.value.trim() ? "" : "Escribe el nombre de tu despacho.";
    },
    email: function () {
      var v = form.elements.email.value.trim();
      if (!v) return "Escribe tu email.";
      return RE_EMAIL.test(v) ? "" : "Revisa el email: el formato no es válido.";
    },
    telefono: function () {
      var bruto = String(form.elements.telefono.value).trim();
      if (!bruto) return "Escribe tu teléfono móvil.";
      if (/[^\d\s().+-]/.test(bruto)) return "Revisa el teléfono: usa solo números.";
      var d = digitosTelefono();
      if (prefijo() === "+34") {
        return d.length === 9 ? "" : "Revisa el teléfono: con el prefijo +34 debe tener 9 dígitos.";
      }
      var maximo = 15 - prefijo().replace(/\D/g, "").length;
      return d.length >= 6 && d.length <= maximo ? "" : "Revisa el teléfono: el número no parece válido.";
    },
    que_resolver: function () {
      return textoResolver.value.length > 500 ? "Escribe como máximo 500 caracteres." : "";
    },
    acepta_privacidad: function () {
      return form.elements.acepta_privacidad.checked ? "" : "Para enviar el formulario, acepta la política de privacidad.";
    },
    acepta_llamada_ia: function () {
      return form.elements.acepta_llamada_ia.checked ? "" : "Para enviar el formulario, acepta recibir la llamada del asistente de inteligencia artificial.";
    }
  };

  function controlesDe(campo) {
    return Array.prototype.slice.call(form.querySelectorAll('[name="' + campo + '"]'));
  }

  function marcar(campo, mensaje) {
    var idError = "error-" + campo;
    var error = document.getElementById(idError);
    if (error) {
      error.textContent = mensaje;
      error.hidden = !mensaje;
    }
    var grupo = document.getElementById("grupo-" + campo);
    if (grupo) grupo.classList.toggle("pregunta--error", !!mensaje);
    controlesDe(campo).forEach(function (c) {
      var base = c.getAttribute("data-describedby-base");
      if (base === null) {
        base = c.getAttribute("aria-describedby") || "";
        c.setAttribute("data-describedby-base", base);
      }
      var ids = base.split(/\s+/).filter(Boolean);
      if (mensaje) {
        ids.push(idError);
        c.setAttribute("aria-invalid", "true");
      } else {
        c.removeAttribute("aria-invalid");
      }
      if (ids.length) c.setAttribute("aria-describedby", ids.join(" "));
      else c.removeAttribute("aria-describedby");
    });
  }

  function validarCampo(campo) {
    var mensaje = VALIDADORES[campo] ? VALIDADORES[campo]() : "";
    marcar(campo, mensaje);
    return mensaje;
  }

  function enfocarCampo(campo) {
    var controles = controlesDe(campo);
    if (!controles.length) return;
    var objetivo = controles[0];
    if (objetivo.type === "radio") {
      var marcado = controles.filter(function (c) { return c.checked; })[0];
      if (marcado) objetivo = marcado;
    }
    objetivo.focus();
  }

  function validarPaso(n) {
    var campos = n === 1 ? PASO1 : PASO2;
    var errores = campos.filter(function (c) { return validarCampo(c) !== ""; });
    errores.forEach(function (c) { DL.push("form_error", { step: n, field: c }); });
    if (errores.length) enfocarCampo(errores[0]);
    return errores.length === 0;
  }

  /* ---------- Interacción ---------- */
  function marcarInicio() {
    if (iniciado) return;
    iniciado = true;
    DL.push("form_start", {});
  }

  form.addEventListener("focusin", marcarInicio);

  function actualizarCondicional() {
    var visible = programaNoOdoo();
    grupoSinConector.hidden = !visible;
    if (!visible) {
      controlesDe("acepta_sin_conector").forEach(function (c) { c.checked = false; });
      marcar("acepta_sin_conector", "");
    }
  }

  form.addEventListener("change", function (ev) {
    var campo = ev.target.name;
    if (!campo || !VALIDADORES[campo]) {
      if (campo === "telefono_prefijo" && tocados.telefono) validarCampo("telefono");
      return;
    }
    marcarInicio();
    tocados[campo] = true;
    if (campo === "programa_contable") actualizarCondicional();
    if (ev.target.type === "radio" || ev.target.type === "checkbox") validarCampo(campo);
  });

  form.addEventListener("input", function (ev) {
    var campo = ev.target.name;
    if (!campo || !VALIDADORES[campo]) return;
    tocados[campo] = true;
    // Si el campo ya muestra un error, se revalida al escribir para retirarlo en cuanto se corrige
    if (ev.target.getAttribute("aria-invalid") === "true") validarCampo(campo);
  });

  form.addEventListener("focusout", function (ev) {
    var campo = ev.target.name;
    if (!campo || !VALIDADORES[campo] || !tocados[campo]) return;
    if (ev.target.type === "radio") return;
    validarCampo(campo);
  });

  function actualizarContador() {
    if (contador) contador.textContent = textoResolver.value.length + "/500";
  }
  textoResolver.addEventListener("input", actualizarContador);
  actualizarContador();

  function irAPaso(n) {
    pasoActual = n;
    pasos[1].hidden = n !== 1;
    pasos[2].hidden = n !== 2;
    progresoTexto.textContent = "Paso " + n + " de 2";
    progresoBarra.setAttribute("aria-valuenow", String(n));
    progresoBarra.querySelector("span").style.width = n === 1 ? "50%" : "100%";
    var titulo = pasos[n].querySelector(".form-paso__titulo");
    if (titulo) titulo.focus({ preventScroll: true });
    form.scrollIntoView({ block: "start" });
  }

  form.querySelector('[data-accion="continuar"]').addEventListener("click", function () {
    marcarInicio();
    if (!validarPaso(1)) return;
    var d = datosPaso1();
    if (!paso1Registrado) {
      paso1Registrado = true;
      var params = { step: 1, prioridad: calcularPrioridad(d) };
      PASO1.forEach(function (c) { params[c] = d[c]; });
      DL.push("form_step_complete", params);
    }
    irAPaso(2);
  });

  form.querySelector('[data-accion="volver"]').addEventListener("click", function () {
    irAPaso(1);
  });

  /* ---------- Envío ---------- */
  function rellenarOcultos(datos) {
    Object.keys(datos).forEach(function (k) {
      var el = form.querySelector('input[type="hidden"][name="' + k + '"]');
      if (el) el.value = String(datos[k]);
    });
  }

  function enviar(payload) {
    var endpoint = typeof cfg.FORM_ENDPOINT === "string" ? cfg.FORM_ENDPOINT.trim() : "";
    if (!endpoint) {
      console.info("[Trazabis] FORM_ENDPOINT vacío: modo de desarrollo. No se envía nada. Datos del formulario:", payload);
      return Promise.resolve();
    }
    var controlador = typeof AbortController === "function" ? new AbortController() : null;
    var temporizador = controlador ? setTimeout(function () { controlador.abort(); }, TIEMPO_MAXIMO_ENVIO) : null;
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "omit",
      signal: controlador ? controlador.signal : undefined
    }).then(function (r) {
      if (temporizador) clearTimeout(temporizador);
      if (!r.ok) throw new Error("HTTP " + r.status);
    }, function (err) {
      if (temporizador) clearTimeout(temporizador);
      throw err;
    });
  }

  function exito(nombre) {
    ssSet(CLAVE_ENVIO, JSON.stringify({ enviado: true, nombre: nombre }));
    mostrarGracias(nombre, true);
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (enviando) return;
    // Enter en el paso 1 equivale a «Continuar»
    if (pasoActual === 1) {
      form.querySelector('[data-accion="continuar"]').click();
      return;
    }
    errorEnvio.textContent = "";
    if (!validarPaso(2)) return;

    var nombre = form.elements.nombre.value.trim();

    // Campo trampa: si viene relleno, se simula el éxito y no se envía nada
    if (form.elements.website.value) {
      exito(nombre);
      return;
    }

    var d1 = datosPaso1();
    var origen = leerOrigen();
    if (!eventIdPendiente) eventIdPendiente = uuidv4();
    var prioridad = calcularPrioridad(d1);

    var payload = {};
    PASO1.forEach(function (c) { payload[c] = d1[c]; });
    payload.nombre = nombre;
    payload.despacho = form.elements.despacho.value.trim();
    payload.email = form.elements.email.value.trim();
    payload.telefono = telefonoE164();
    payload.que_resolver = textoResolver.value.trim();
    payload.acepta_privacidad = form.elements.acepta_privacidad.checked;
    payload.acepta_llamada_ia = form.elements.acepta_llamada_ia.checked;
    payload.acepta_comunicaciones = form.elements.acepta_comunicaciones.checked;
    payload.acepta_medicion_publicitaria = form.elements.acepta_medicion_publicitaria.checked;
    CAMPOS_ORIGEN.forEach(function (c) { payload[c] = origen[c]; });
    payload.event_id = eventIdPendiente;
    payload.prioridad = prioridad;
    payload.landing_url = location.href;
    payload.timestamp = new Date().toISOString();
    payload.version = "despachos";

    rellenarOcultos({
      utm_source: origen.utm_source, utm_medium: origen.utm_medium, utm_campaign: origen.utm_campaign,
      utm_content: origen.utm_content, utm_term: origen.utm_term, fbclid: origen.fbclid,
      event_id: payload.event_id, prioridad: prioridad, landing_url: payload.landing_url,
      timestamp: payload.timestamp, version: payload.version
    });

    enviando = true;
    botonEnviar.disabled = true;
    botonEnviar.setAttribute("aria-busy", "true");
    botonEnviar.textContent = "Enviando…";

    enviar(payload).then(function () {
      var params = {
        event_id: payload.event_id,
        version: payload.version,
        prioridad: prioridad,
        acepta_comunicaciones: payload.acepta_comunicaciones,
        acepta_medicion_publicitaria: payload.acepta_medicion_publicitaria
      };
      PASO1.forEach(function (c) { params[c] = d1[c]; });
      CAMPOS_UTM.forEach(function (c) { params[c] = origen[c]; });
      DL.push("generate_lead", params);
      exito(nombre);
    }).catch(function () {
      enviando = false;
      botonEnviar.disabled = false;
      botonEnviar.removeAttribute("aria-busy");
      botonEnviar.textContent = "Enviar";
      errorEnvio.textContent = "No hemos podido enviar el formulario. Inténtalo de nuevo en unos segundos.";
    });
  });
})();
