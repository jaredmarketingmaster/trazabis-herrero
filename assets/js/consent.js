/* Consentimiento de cookies (banner propio + modo de consentimiento de Google).
   - Consentimiento denegado por defecto antes de cualquier etiqueta.
   - GTM solo se carga si GTM_ID tiene valor Y el usuario ha aceptado alguna categoría
     no técnica: sin consentimiento no hay ninguna petición a Google, Meta ni Microsoft.
   - Elección guardada en localStorage («trazabis_consent», con fecha). Caduca a los 12 meses. */
(function () {
  "use strict";

  var CLAVE = "trazabis_consent";
  var VERSION = 1;
  var cfg = window.TRAZABIS_CONFIG || {};

  // 1. Modo de consentimiento denegado por defecto (antes de cargar GTM).
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag("consent", "default", {
    ad_storage: "denied", analytics_storage: "denied",
    ad_user_data: "denied", ad_personalization: "denied",
    wait_for_update: 500
  });

  var COOKIES_ANALITICAS = [/^_ga$/, /^_ga_/, /^_gid$/, /^_gat/, /^_clck$/, /^_clsk$/];
  var COOKIES_PUBLICITARIAS = [/^_fbp$/, /^_fbc$/, /^_gcl_/];

  var raiz = document.documentElement.getAttribute("data-raiz") || "../";
  var gtmCargado = false;
  var banner = null;
  var panel = null;
  var opener = null;

  function leer() {
    try {
      var bruto = localStorage.getItem(CLAVE);
      if (!bruto) return null;
      var d = JSON.parse(bruto);
      if (!d || d.version !== VERSION || !d.fecha) return null;
      var caducidad = new Date(d.fecha);
      if (isNaN(caducidad.getTime())) return null;
      caducidad.setMonth(caducidad.getMonth() + 12);
      if (Date.now() >= caducidad.getTime()) return null;
      return { analiticas: d.analiticas === true, publicitarias: d.publicitarias === true, fecha: d.fecha };
    } catch (e) {
      return null;
    }
  }

  function guardar(eleccion) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify({
        version: VERSION,
        fecha: new Date().toISOString(),
        analiticas: eleccion.analiticas,
        publicitarias: eleccion.publicitarias
      }));
    } catch (e) { /* almacenamiento no disponible: la elección vale solo para esta visita */ }
  }

  function estados(eleccion) {
    var ads = eleccion.publicitarias ? "granted" : "denied";
    return {
      analytics_storage: eleccion.analiticas ? "granted" : "denied",
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads
    };
  }

  function cargarGTM() {
    if (gtmCargado || !cfg.GTM_ID) return;
    gtmCargado = true;
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(cfg.GTM_ID);
    document.head.appendChild(s);
  }

  function borrarCookies(patrones) {
    var nombres;
    try {
      nombres = document.cookie.split(";").map(function (c) { return c.split("=")[0].trim(); });
    } catch (e) {
      return;
    }
    var partes = location.hostname.split(".");
    var dominios = [""];
    for (var i = 0; i < partes.length - 1; i++) dominios.push("." + partes.slice(i).join("."));
    nombres.forEach(function (nombre) {
      if (!nombre || !patrones.some(function (p) { return p.test(nombre); })) return;
      dominios.forEach(function (dom) {
        document.cookie = nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (dom ? "; domain=" + dom : "");
      });
    });
  }

  function aplicar(eleccion, esNueva) {
    var e = estados(eleccion);
    gtag("consent", "update", e);
    if (esNueva) {
      if (window.TrazabisDL) window.TrazabisDL.push("consent_update", e);
      else window.dataLayer.push(Object.assign({ event: "consent_update" }, e));
    }
    if (!eleccion.analiticas) borrarCookies(COOKIES_ANALITICAS);
    if (!eleccion.publicitarias) borrarCookies(COOKIES_PUBLICITARIAS);
    if (eleccion.analiticas || eleccion.publicitarias) cargarGTM();
  }

  function decidir(eleccion) {
    guardar(eleccion);
    aplicar(eleccion, true);
    ocultarBanner();
    cerrarPanel();
  }

  /* ---------- Interfaz ---------- */

  function crearBoton(texto, accion) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "boton boton--primario";
    b.setAttribute("data-consent", accion);
    b.textContent = texto;
    return b;
  }

  function crearBanner() {
    banner = document.createElement("div");
    banner.className = "consent-banner";
    banner.id = "consent-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Aviso de cookies");
    banner.hidden = true;
    banner.innerHTML =
      '<p class="consent-banner__titulo">Cookies</p>' +
      "<p>Usamos cookies técnicas, necesarias para que el sitio funcione. Con tu permiso, usaremos también cookies analíticas (Google Analytics 4 y Microsoft Clarity) y publicitarias (Pixel de Meta). Puedes aceptarlas, rechazarlas o configurarlas, y cambiar tu elección cuando quieras. Más información en la " +
      '<a href="' + raiz + 'legal/politica-cookies.html">Política de cookies</a>.</p>';
    var botones = document.createElement("div");
    botones.className = "consent-botones";
    botones.appendChild(crearBoton("Aceptar todas", "aceptar"));
    botones.appendChild(crearBoton("Rechazar todas", "rechazar"));
    botones.appendChild(crearBoton("Configurar", "configurar"));
    banner.appendChild(botones);
    // Va justo después del enlace «Saltar al contenido» (si existe), al principio del orden de tabulación
    var salto = document.querySelector("body > .salto");
    document.body.insertBefore(banner, salto ? salto.nextSibling : document.body.firstChild);
  }

  function crearPanel() {
    panel = document.createElement("dialog");
    panel.className = "consent-panel";
    panel.id = "consent-panel";
    panel.setAttribute("aria-labelledby", "consent-panel-titulo");
    panel.innerHTML =
      '<div class="consent-panel__contenido">' +
        '<div class="consent-panel__cabecera">' +
          '<h2 id="consent-panel-titulo">Configurar cookies</h2>' +
          '<button type="button" class="consent-panel__cerrar" data-consent="cerrar" aria-label="Cerrar">' +
            '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>' +
          "</button>" +
        "</div>" +
        '<p class="consent-panel__intro">Elige qué cookies aceptas. Puedes cambiar tu elección en cualquier momento desde «Configurar cookies», en el pie de página.</p>' +
        '<div class="consent-cat">' +
          '<div class="consent-cat__cab"><span class="consent-cat__nombre">Técnicas</span><span class="consent-cat__siempre">Siempre activas</span></div>' +
          "<p>Necesarias para que el sitio funcione y para recordar tu elección de cookies.</p>" +
        "</div>" +
        '<div class="consent-cat">' +
          '<div class="consent-cat__cab"><label for="consent-analiticas">Analíticas</label>' +
          '<input type="checkbox" class="interruptor" role="switch" id="consent-analiticas" aria-describedby="consent-analiticas-desc"></div>' +
          '<p id="consent-analiticas-desc">Google Analytics 4 y Microsoft Clarity. Nos ayudan a entender cómo se usa la página.</p>' +
        "</div>" +
        '<div class="consent-cat">' +
          '<div class="consent-cat__cab"><label for="consent-publicitarias">Publicitarias</label>' +
          '<input type="checkbox" class="interruptor" role="switch" id="consent-publicitarias" aria-describedby="consent-publicitarias-desc"></div>' +
          '<p id="consent-publicitarias-desc">Pixel de Meta. Mide la eficacia de nuestros anuncios en Meta.</p>' +
        "</div>" +
        '<div class="consent-botones"></div>' +
        '<p class="consent-panel__pie"><a href="' + raiz + 'legal/politica-cookies.html">Política de cookies</a></p>' +
      "</div>";
    var botones = panel.querySelector(".consent-botones");
    botones.appendChild(crearBoton("Rechazar todas", "rechazar"));
    botones.appendChild(crearBoton("Aceptar todas", "aceptar"));
    botones.appendChild(crearBoton("Guardar mi elección", "guardar"));
    panel.addEventListener("close", function () {
      if (opener && document.contains(opener)) opener.focus();
      opener = null;
    });
    document.body.appendChild(panel);
  }

  function mostrarBanner() { if (banner) banner.hidden = false; }
  function ocultarBanner() { if (banner) banner.hidden = true; }

  function abrirPanel(origen) {
    if (!panel) return;
    opener = origen || document.activeElement;
    var actual = leer() || { analiticas: false, publicitarias: false };
    panel.querySelector("#consent-analiticas").checked = actual.analiticas;
    panel.querySelector("#consent-publicitarias").checked = actual.publicitarias;
    if (typeof panel.showModal === "function") {
      if (!panel.open) panel.showModal();
    } else {
      panel.setAttribute("open", "");
      var primero = panel.querySelector("button");
      if (primero) primero.focus();
    }
  }

  function cerrarPanel() {
    if (!panel) return;
    if (typeof panel.close === "function") {
      if (panel.open) panel.close();
    } else if (panel.hasAttribute("open")) {
      panel.removeAttribute("open");
      if (opener && document.contains(opener)) opener.focus();
      opener = null;
    }
  }

  document.addEventListener("click", function (ev) {
    var el = ev.target.closest ? ev.target.closest("[data-consent], [data-abrir-cookies]") : null;
    if (!el) return;
    if (el.hasAttribute("data-abrir-cookies")) {
      ev.preventDefault();
      abrirPanel(el);
      return;
    }
    switch (el.getAttribute("data-consent")) {
      case "aceptar":
        decidir({ analiticas: true, publicitarias: true });
        break;
      case "rechazar":
        decidir({ analiticas: false, publicitarias: false });
        break;
      case "configurar":
        abrirPanel(el);
        break;
      case "guardar":
        decidir({
          analiticas: panel.querySelector("#consent-analiticas").checked,
          publicitarias: panel.querySelector("#consent-publicitarias").checked
        });
        break;
      case "cerrar":
        cerrarPanel();
        break;
    }
  });

  function iniciar() {
    crearBanner();
    crearPanel();
    var guardada = leer();
    if (guardada) {
      aplicar(guardada, false);
    } else {
      mostrarBanner();
    }
  }

  window.TrazabisConsent = {
    abrirPanel: function () { abrirPanel(); },
    leer: leer
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
