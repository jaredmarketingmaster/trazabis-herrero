/* Ventana previa a la reserva directa.
   - Toda «puerta» a la agenda (enlaces con data-agenda y, desde calculadora-integracion.js,
     los enlaces a la agenda de la calculadora oficial) abre primero el diálogo #aviso-agenda.
   - «Sí, quiero reservar» es un enlace normal con target="_blank": abre la agenda en una pestaña
     nueva y cierra la ventana. «Todavía no: ver si mi despacho encaja» la cierra y lleva al
     formulario. ×, Esc o un clic fuera la cierran.
   - Cada salida registra reserva_modal con su accion (confirmar · ir_formulario · cerrar) y la
     puerta de origen (cta_location).
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
  var motivo = ""; // cómo se ha cerrado: confirmar, ir_formulario o (vacío) cerrar

  function medir(accion) {
    DL.push("reserva_modal", { accion: accion, cta_location: puerta });
  }

  // Cierra la ventana y lleva al formulario: foco en el título del paso visible
  // (el 1, salvo que ya esté en el 2) o, si ya se envió, en la página de gracias
  function irAlFormulario() {
    var seccion = document.getElementById("formulario");
    if (!seccion) return;
    var reducido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    seccion.scrollIntoView({ behavior: reducido ? "auto" : "smooth", block: "start" });
    var titulo = Array.prototype.filter.call(seccion.querySelectorAll(".form-paso__titulo"), function (t) {
      return t.getClientRects().length > 0;
    })[0] || seccion.querySelector(".gracias") || document.getElementById("formulario-titulo");
    if (!titulo) return;
    if (!titulo.hasAttribute("tabindex")) titulo.setAttribute("tabindex", "-1");
    try { titulo.focus({ preventScroll: true }); } catch (e) { /* sin foco */ }
  }

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
    motivo = "";
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
      motivo = "confirmar";
      medir("confirmar");
      // Se cierra después de que el navegador abra la pestaña nueva
      setTimeout(function () { if (dialogo.open) dialogo.close(); }, 0);
    });
    var formulario = dialogo.querySelector("[data-agenda-formulario]");
    if (formulario) formulario.addEventListener("click", function () {
      motivo = "ir_formulario";
      medir("ir_formulario");
      dialogo.close();
      irAlFormulario();
    });
    var cerrar = dialogo.querySelector("[data-agenda-cerrar]");
    if (cerrar) cerrar.addEventListener("click", function () { dialogo.close(); });
    // Tab no sale de la ventana: del último elemento vuelve al primero, y al revés
    dialogo.addEventListener("keydown", function (ev) {
      if (ev.key !== "Tab") return;
      var focos = Array.prototype.filter.call(dialogo.querySelectorAll("a[href], button:not([disabled])"), function (el) {
        return el.getClientRects().length > 0;
      });
      if (!focos.length) return;
      var primero = focos[0], ultimo = focos[focos.length - 1];
      if (ev.shiftKey && document.activeElement === primero) { ev.preventDefault(); ultimo.focus(); }
      else if (!ev.shiftKey && document.activeElement === ultimo) { ev.preventDefault(); primero.focus(); }
    });
    // Clic en el fondo oscuro (fuera del contenido)
    dialogo.addEventListener("click", function (ev) { if (ev.target === dialogo) dialogo.close(); });
    // ×, Esc y clic fuera llegan aquí sin motivo: son «cerrar»
    dialogo.addEventListener("close", function () {
      if (!motivo) medir("cerrar");
      if (motivo !== "ir_formulario" && opener && typeof opener.focus === "function") {
        try { opener.focus({ preventScroll: true }); } catch (e) { /* sin foco */ }
      }
      opener = null;
      motivo = "";
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
