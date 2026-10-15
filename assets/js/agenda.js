/* Aviso antes de abrir la agenda de la reserva directa.
   - Toda «puerta» a la agenda (enlaces con data-agenda y, desde calculadora-integracion.js,
     los enlaces a la agenda de la calculadora oficial) abre primero el diálogo #aviso-agenda.
   - «Aceptar» es un enlace normal con target="_blank": abre la agenda en una pestaña nueva y
     registra agenda_open con la puerta de origen (cta_location).
   - AGENDA_URL (config.js) fija la dirección de la agenda en todos los enlaces.
   - Sin JavaScript, o si el navegador no admite <dialog>, los enlaces llevan directamente a la agenda. */
(function () {
  "use strict";

  var cfg = window.TRAZABIS_CONFIG || {};
  var DL = window.TrazabisDL || { push: function () {} };

  function safe(fn, nombre) {
    try { fn(); } catch (e) { if (window.console) console.warn("[agenda:" + nombre + "]", e); }
  }

  var dialogo = document.getElementById("aviso-agenda");
  var aceptar = dialogo ? dialogo.querySelector("[data-agenda-aceptar]") : null;
  if (!dialogo || !aceptar || typeof dialogo.showModal !== "function") return;

  function urlSegura(u) {
    if (typeof u !== "string" || !u.trim()) return "";
    try {
      var d = new URL(u.trim(), location.href);
      return (d.protocol === "https:" || d.protocol === "http:") ? d.href : "";
    } catch (e) {
      return "";
    }
  }

  var URL_AGENDA = urlSegura(cfg.AGENDA_URL);
  var puerta = "";
  var opener = null;

  // Si hay AGENDA_URL, todos los enlaces a la agenda apuntan a ella
  function initEnlaces() {
    if (!URL_AGENDA) return;
    Array.prototype.forEach.call(document.querySelectorAll("a[data-agenda]"), function (a) { a.href = URL_AGENDA; });
    aceptar.href = URL_AGENDA;
  }

  // Abre el aviso; devuelve false si no se puede (entonces el enlace sigue su curso)
  function abrir(href, origen, desde) {
    var destino = URL_AGENDA || urlSegura(href);
    if (!destino) return false;
    aceptar.href = destino;
    puerta = origen || "";
    opener = desde || document.activeElement;
    if (!dialogo.open) dialogo.showModal();
    return true;
  }

  function initPuertas() {
    document.addEventListener("click", function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest("a[data-agenda]") : null;
      if (!a) return;
      if (abrir(a.href, a.getAttribute("data-agenda"), a)) ev.preventDefault();
    });
  }

  function initDialogo() {
    aceptar.addEventListener("click", function () {
      DL.push("agenda_open", { cta_location: puerta });
      // Se cierra después de que el navegador abra la pestaña nueva
      setTimeout(function () { if (dialogo.open) dialogo.close(); }, 0);
    });
    var cerrar = dialogo.querySelector("[data-agenda-cerrar]");
    if (cerrar) cerrar.addEventListener("click", function () { dialogo.close(); });
    // Clic en el fondo oscuro (fuera del contenido)
    dialogo.addEventListener("click", function (ev) { if (ev.target === dialogo) dialogo.close(); });
    dialogo.addEventListener("close", function () {
      if (opener && typeof opener.focus === "function") {
        try { opener.focus({ preventScroll: true }); } catch (e) { /* sin foco */ }
      }
      opener = null;
    });
  }

  safe(initEnlaces, "enlaces");
  safe(initPuertas, "puertas");
  safe(initDialogo, "dialogo");

  // Para las puertas que no son enlaces de esta página (la calculadora, dentro de su iframe)
  window.TrazabisAgenda = {
    abrir: function (href, origen, desde) {
      try { return abrir(href, origen, desde); } catch (e) { return false; }
    }
  };
})();
