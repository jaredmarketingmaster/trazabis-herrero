/* Integración de la calculadora oficial de trazabis.com (despachos/calculadora.html), incrustada
   en un iframe del mismo origen. No modifica calculadora.html: solo la rodea.
   1. Alto automático del iframe (mensajes postMessage de la propia calculadora).
   2. Envío de las solicitudes de la calculadora (window.enviarSolicitudTrazabis dentro del iframe).
   3. Evento calculator_use en la primera interacción.
   4. Sus enlaces a la agenda pasan por el aviso previo de agenda.js.
   Todo acceso al iframe va en try/catch: si fallara (por ejemplo, otro origen), la página sigue
   funcionando y solo se pierde la medición o el envío. */
(function () {
  "use strict";

  var cfg = window.TRAZABIS_CONFIG || {};
  var DL = window.TrazabisDL || { push: function () {} };
  var CLAVE_UTM = "trazabis_utm";            // la misma que guarda formulario.js
  var CLAVE_USO = "trazabis_calculadora_uso"; // calculator_use, una vez por visita
  var CAMPOS_UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  function safe(fn, nombre) {
    try { fn(); } catch (e) { if (window.console) console.warn("[calculadora:" + nombre + "]", e); }
  }

  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }

  function leerOrigen() {
    var d = {};
    try { d = JSON.parse(ssGet(CLAVE_UTM) || "{}") || {}; } catch (e) { d = {}; }
    var r = {};
    CAMPOS_UTM.concat("fbclid").forEach(function (c) { r[c] = typeof d[c] === "string" ? d[c] : ""; });
    return r;
  }

  // Mismo generador de event_id que formulario.js (window.TrazabisForm.uuidv4)
  function nuevoEventId() {
    if (window.TrazabisForm && typeof window.TrazabisForm.uuidv4 === "function") return window.TrazabisForm.uuidv4();
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return String(Date.now()) + "-" + String(Math.random()).slice(2);
  }

  var iframe = document.getElementById("calc-trazabis");
  if (!iframe) return;

  /* 1. Alto automático */
  function initAlto() {
    window.addEventListener("message", function (e) {
      var origen;
      try { origen = iframe.contentWindow; } catch (err) { return; }
      if (e.source !== origen || e.origin !== location.origin) return;
      var d = e.data;
      if (!d || d.trazabisCalculadora !== "alto" || typeof d.alto !== "number" || !isFinite(d.alto)) return;
      iframe.style.height = (Math.max(0, d.alto) + 24) + "px";
    });
  }

  /* 2. Envío de las solicitudes de la calculadora */
  function definirEnvio() {
    var endpoint = (typeof cfg.CALC_ENDPOINT === "string" && cfg.CALC_ENDPOINT.trim()) ||
                   (typeof cfg.FORM_ENDPOINT === "string" && cfg.FORM_ENDPOINT.trim()) || "";
    if (!endpoint) {
      console.warn("[Trazabis] CALC_ENDPOINT y FORM_ENDPOINT vacíos: la calculadora queda en vista previa y no envía solicitudes.");
      return;
    }
    var ventana = iframe.contentWindow;
    if (!ventana) return;
    ventana.enviarSolicitudTrazabis = function (p) {
      var origen = leerOrigen();
      var eventId = nuevoEventId();
      var cuerpo = {};
      var datos = (p && typeof p === "object") ? p : {};
      Object.keys(datos).forEach(function (k) { cuerpo[k] = datos[k]; });
      cuerpo.origen = "landing-despachos-ads";
      cuerpo.version = "calculadora";
      cuerpo.pagina = location.href;
      cuerpo.referrer = document.referrer;
      cuerpo.event_id = eventId;
      CAMPOS_UTM.concat("fbclid").forEach(function (c) { cuerpo[c] = origen[c]; });

      return fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
        credentials: "omit"
      }).then(function (r) {
        if (!r.ok) return { ok: false };
        var params = { event_id: eventId, version: "calculadora" };
        CAMPOS_UTM.forEach(function (c) { params[c] = origen[c]; });
        DL.push("generate_lead", params); // sin datos personales: datalayer.js filtra el resto
        return { ok: true };
      }, function () {
        return { ok: false };
      });
    };
  }

  /* 3. calculator_use: primera interacción, una sola vez por visita */
  function escucharUso() {
    if (ssGet(CLAVE_USO)) return;
    var doc = iframe.contentDocument;
    if (!doc) return;
    var hecho = false;
    function registrar() {
      if (hecho) return;
      hecho = true;
      ssSet(CLAVE_USO, "1");
      DL.push("calculator_use", { version: "calculadora" });
      ["click", "input", "change"].forEach(function (t) { doc.removeEventListener(t, registrar, true); });
    }
    ["click", "input", "change"].forEach(function (t) { doc.addEventListener(t, registrar, true); });
  }

  /* 4. Enlaces de la calculadora a la agenda: primero el aviso de agenda.js.
     La calculadora enlaza a cal.com; si AGENDA_URL apunta a otra agenda, también se reconoce. */
  function esAgenda(a) {
    var hosts = ["cal.com"];
    try { if (cfg.AGENDA_URL) hosts.push(new URL(cfg.AGENDA_URL, location.href).hostname); } catch (e) { /* URL no válida */ }
    return hosts.indexOf(a.hostname) !== -1;
  }

  function escucharAgenda() {
    var doc = iframe.contentDocument;
    if (!doc) return;
    doc.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a || !esAgenda(a) || !window.TrazabisAgenda) return;
      DL.push("cta_click", { cta_location: "calculadora_reserva" });
      if (window.TrazabisAgenda.abrir(a.href, "calculadora_reserva", a)) e.preventDefault();
    }, true);
  }

  function alCargar() {
    safe(definirEnvio, "envio");
    safe(escucharUso, "uso");
    safe(escucharAgenda, "agenda");
  }

  function yaCargado() {
    try {
      var doc = iframe.contentDocument;
      return !!doc && doc.readyState === "complete" && doc.URL !== "about:blank";
    } catch (e) {
      return false;
    }
  }

  safe(initAlto, "alto");
  iframe.addEventListener("load", alCargar);
  if (yaCargado()) alCargar();
})();
