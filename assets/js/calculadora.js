/* Calculadora de inversión (sin IVA).
   onboarding  = 1000 + 1000 * Math.ceil(clientes / 50)
   planes_ano1 = clientes * precio_ano1 * 12   (solo si los asume el despacho)
   Los cálculos se hacen en céntimos para evitar errores de coma flotante.
   Pruebas: tests/calculadora.test.html */
(function () {
  "use strict";

  var MIN = 51;
  var MAX = 300;
  // Precio del año 1 por cliente y mes, en céntimos
  var PRECIO_ANO1_CENT = { inicio: 1475, pro: 2950, negocio: 3950 };

  function calcularOnboarding(clientes) {
    return 1000 + 1000 * Math.ceil(clientes / 50);
  }

  function calcularPlanesAno1(clientes, plan) {
    return (clientes * PRECIO_ANO1_CENT[plan] * 12) / 100;
  }

  function calcular(clientes, plan, quienPaga) {
    if (typeof clientes !== "number" || !Number.isInteger(clientes) || clientes < 1) {
      return { estado: "no_valido" };
    }
    if (clientes < MIN) return { estado: "menor" };
    if (clientes > MAX) return { estado: "mayor" };
    if (!PRECIO_ANO1_CENT.hasOwnProperty(plan)) return { estado: "no_valido" };
    var onboarding = calcularOnboarding(clientes);
    var planes = quienPaga === "despacho" ? calcularPlanesAno1(clientes, plan) : null;
    return {
      estado: "ok",
      onboarding: onboarding,
      planes: planes,
      total: onboarding + (planes === null ? 0 : planes)
    };
  }

  // Formato es-ES con dos decimales y separador de miles siempre visible (3.000,00 €)
  function formatearEUR(importe) {
    var cent = Math.round(importe * 100);
    var negativo = cent < 0;
    cent = Math.abs(cent);
    var entero = String(Math.floor(cent / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    var decimales = ("0" + (cent % 100)).slice(-2);
    return (negativo ? "-" : "") + entero + "," + decimales + " €";
  }

  function rangoClientes(clientes) {
    if (typeof clientes !== "number" || !Number.isInteger(clientes) || clientes < 1) return "no_valido";
    if (clientes < 20) return "menos_20";
    if (clientes <= 50) return "20_50";
    if (clientes <= 100) return "51_100";
    if (clientes <= 150) return "101_150";
    if (clientes <= 200) return "151_200";
    if (clientes <= 250) return "201_250";
    if (clientes <= 300) return "251_300";
    return "mas_300";
  }

  window.TrazabisCalc = {
    calcularOnboarding: calcularOnboarding,
    calcularPlanesAno1: calcularPlanesAno1,
    calcular: calcular,
    formatearEUR: formatearEUR,
    rangoClientes: rangoClientes
  };

  /* ---------- Interfaz ---------- */
  var raizCalc = document.getElementById("calculadora");
  if (!raizCalc) return;

  var numero = document.getElementById("calc-clientes");
  var rango = document.getElementById("calc-clientes-rango");
  var lista = document.getElementById("calc-lista");
  var mensaje = document.getElementById("calc-mensaje");
  var outOnboarding = document.getElementById("calc-onboarding");
  var outPlanes = document.getElementById("calc-planes");
  var outTotal = document.getElementById("calc-total");
  var usada = false;

  function valorRadio(nombre) {
    var el = raizCalc.querySelector('input[name="' + nombre + '"]:checked');
    return el ? el.value : "";
  }

  function leerClientes() {
    var texto = String(numero.value).trim();
    if (!/^\d+$/.test(texto)) return NaN;
    return parseInt(texto, 10);
  }

  function pintar() {
    var clientes = leerClientes();
    var r = calcular(clientes, valorRadio("calc-plan"), valorRadio("calc-quien"));
    if (r.estado === "ok") {
      lista.hidden = false;
      mensaje.hidden = true;
      outOnboarding.textContent = formatearEUR(r.onboarding);
      outPlanes.textContent = r.planes === null ? "Los pagan tus clientes" : formatearEUR(r.planes);
      outTotal.textContent = formatearEUR(r.total);
      return;
    }
    lista.hidden = true;
    mensaje.hidden = false;
    if (r.estado === "menor") {
      mensaje.textContent = "Para carteras de hasta 50 clientes, lo vemos en el diagnóstico";
    } else if (r.estado === "mayor") {
      mensaje.textContent = "Lo vemos en el diagnóstico";
    } else {
      mensaje.textContent = "Escribe un número entero de clientes.";
    }
  }

  function registrarUso() {
    if (usada) return;
    usada = true;
    if (window.TrazabisDL) {
      window.TrazabisDL.push("calculator_use", {
        clientes_rango: rangoClientes(leerClientes()),
        plan: valorRadio("calc-plan"),
        quien_paga: valorRadio("calc-quien")
      });
    }
  }

  numero.addEventListener("input", function () {
    var c = leerClientes();
    if (!isNaN(c)) rango.value = String(Math.min(MAX, Math.max(MIN, c)));
    pintar();
  });

  rango.addEventListener("input", function () {
    numero.value = rango.value;
    pintar();
  });

  // El evento de medición se registra al confirmar el primer cambio (no en cada pulsación)
  raizCalc.addEventListener("change", function () {
    pintar();
    registrarUso();
  });

  pintar();
})();
