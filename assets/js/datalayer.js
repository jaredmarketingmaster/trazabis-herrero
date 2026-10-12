/* Helper de medición: único punto de entrada de los eventos al dataLayer.
   - Nunca envía datos personales: solo deja pasar los parámetros de la lista PERMITIDOS
     y descarta cualquier valor que parezca un email.
   - En modo de desarrollo imprime en consola cada push para poder revisarlo. */
(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];
  var cfg = window.TRAZABIS_CONFIG || {};

  var PERMITIDOS = [
    "cta_location",
    "clientes_rango", "plan", "quien_paga",
    "step", "field",
    "clientes_cartera", "tamano_equipo", "cargo", "programa_contable",
    "acepta_sin_conector", "intento_previo", "plazo_inicio", "prioridad",
    "event_id", "version", "acepta_comunicaciones", "acepta_medicion_publicitaria",
    "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
    "faq_question",
    "analytics_storage", "ad_storage", "ad_user_data", "ad_personalization"
  ];

  function esModoDesarrollo() {
    try {
      if (!cfg.GTM_ID) return true;
      if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return true;
      return new URLSearchParams(location.search).get("debug") === "1";
    } catch (e) {
      return false;
    }
  }

  var DESARROLLO = esModoDesarrollo();

  function limpiar(params) {
    var limpio = {};
    Object.keys(params || {}).forEach(function (clave) {
      var valor = params[clave];
      if (PERMITIDOS.indexOf(clave) === -1) {
        if (DESARROLLO) console.warn("[dataLayer] Parámetro descartado (no permitido):", clave);
        return;
      }
      if (typeof valor === "string" && valor.indexOf("@") !== -1) {
        if (DESARROLLO) console.warn("[dataLayer] Valor descartado (parece un email):", clave);
        return;
      }
      if (typeof valor === "string" || typeof valor === "number" || typeof valor === "boolean") {
        limpio[clave] = valor;
      }
    });
    return limpio;
  }

  function push(evento, params) {
    var datos = limpiar(params);
    datos.event = evento;
    window.dataLayer.push(datos);
    if (DESARROLLO) console.info("[dataLayer]", JSON.stringify(datos));
    return datos;
  }

  window.TrazabisDL = {
    push: push,
    modoDesarrollo: DESARROLLO
  };
})();
