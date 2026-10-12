/* Comportamiento común: pie (año y contacto), botones de llamada a la acción,
   barra fija en móvil, preguntas frecuentes y sección de vídeo.
   Cada bloque va envuelto en safe(): si uno falla, el resto sigue funcionando. */
(function () {
  "use strict";

  var cfg = window.TRAZABIS_CONFIG || {};
  var DL = window.TrazabisDL || { push: function () {} };

  function safe(fn, nombre) {
    try { fn(); } catch (e) { if (window.console) console.warn("[main:" + nombre + "]", e); }
  }

  // Año actual en el pie
  function initAnio() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-anio]"), function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  // Email y teléfono de contacto desde config.js (si están vacíos se queda el marcador [PENDIENTE])
  function initContacto() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-config]"), function (el) {
      var clave = el.getAttribute("data-config");
      var valor = typeof cfg[clave] === "string" ? cfg[clave].trim() : "";
      if (!valor) return;
      var a = document.createElement("a");
      if (clave.indexOf("EMAIL") === 0) {
        a.href = "mailto:" + valor;
      } else {
        a.href = "tel:" + valor.replace(/[^\d+]/g, "");
      }
      a.textContent = valor;
      el.textContent = "";
      el.classList.remove("pendiente");
      el.appendChild(a);
    });
  }

  // Clics en «Ver si mi despacho encaja»
  function initCta() {
    document.addEventListener("click", function (ev) {
      var el = ev.target.closest ? ev.target.closest("[data-cta]") : null;
      if (!el) return;
      DL.push("cta_click", { cta_location: el.getAttribute("data-cta") });
    });
  }

  // Sección de vídeo: solo existe en el DOM si VIDEO_URL tiene valor
  function initVideo() {
    var plantilla = document.getElementById("plantilla-video");
    var url = typeof cfg.VIDEO_URL === "string" ? cfg.VIDEO_URL.trim() : "";
    if (!plantilla || !url || !("content" in plantilla)) return;
    if (document.getElementById("video")) return; // montaje idempotente
    var destino;
    try {
      destino = new URL(url, location.href);
      if (destino.protocol !== "https:" && destino.protocol !== "http:") return;
    } catch (e) {
      return;
    }
    var fragmento = plantilla.content.cloneNode(true);
    var video = fragmento.querySelector("video");
    video.src = destino.href;
    var poster = typeof cfg.VIDEO_POSTER === "string" ? cfg.VIDEO_POSTER.trim() : "";
    if (poster) {
      video.poster = poster;
    } else {
      var aviso = fragmento.querySelector("[data-video-poster-pendiente]");
      if (aviso) aviso.hidden = false;
    }
    var reproducido = false;
    video.addEventListener("play", function () {
      if (reproducido) return;
      reproducido = true;
      DL.push("video_play", {});
    });
    plantilla.parentNode.insertBefore(fragmento, plantilla);
  }

  // Preguntas frecuentes
  function initFaq() {
    Array.prototype.forEach.call(document.querySelectorAll(".faq details"), function (d) {
      d.addEventListener("toggle", function () {
        if (!d.open) return;
        var s = d.querySelector("summary");
        DL.push("faq_open", { faq_question: s ? s.textContent.trim() : "" });
      });
    });
  }

  // Barra fija inferior en móvil: se oculta cuando el formulario está a la vista
  function initBarraFija() {
    var barra = document.getElementById("cta-fija");
    var formulario = document.getElementById("formulario");
    if (!barra || !formulario) return;
    document.body.classList.add("con-cta-fija");
    if (!("IntersectionObserver" in window)) return;
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        barra.setAttribute("data-oculta", e.isIntersecting ? "true" : "false");
      });
    }, { threshold: 0 });
    obs.observe(formulario);
  }

  safe(initAnio, "anio");
  safe(initContacto, "contacto");
  safe(initCta, "cta");
  safe(initVideo, "video");
  safe(initFaq, "faq");
  safe(initBarraFija, "barraFija");
})();
