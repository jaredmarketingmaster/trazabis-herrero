/* Capa visual de la landing: solo enriquece. Si este archivo falla o no carga,
   todo el contenido sigue visible (las animaciones de CSS dependen de la clase
   .js y tienen red de seguridad) y el formulario funciona igual.
   - Aparición al hacer scroll (IntersectionObserver, umbral 0,01 + red de 6 s).
   - Luz de la cabecera que sigue al ratón (efecto firma; solo con puntero fino).
   - Halo que sigue al cursor dentro de las tarjetas [data-foco].
   - Relleno del deslizador y salto del total en la calculadora. */
(function () {
  "use strict";

  var punteroFino = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function safe(fn, nombre) {
    try { fn(); } catch (e) { if (window.console) console.warn("[efectos:" + nombre + "]", e); }
  }

  function todos(sel, raiz) {
    return Array.prototype.slice.call((raiz || document).querySelectorAll(sel));
  }

  /* Aparición al hacer scroll */
  function initAparicion() {
    // Índice escalonado para los hijos de [data-stagger]
    todos("[data-stagger]").forEach(function (padre) {
      var i = 0;
      Array.prototype.forEach.call(padre.children, function (hijo) {
        if (hijo.hasAttribute("data-reveal")) hijo.style.setProperty("--i", String(i++));
      });
    });

    var elementos = todos("[data-reveal]");
    if (!elementos.length) return;

    function mostrar(el) { el.classList.add("is-revealed"); }

    if (!("IntersectionObserver" in window)) {
      elementos.forEach(mostrar);
      return;
    }

    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          mostrar(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -4% 0px" });

    elementos.forEach(function (el) { io.observe(el); });

    // Red de seguridad: a los 6 s se muestra todo lo que esté por encima del borde inferior
    setTimeout(function () {
      elementos.forEach(function (el) {
        if (!el.classList.contains("is-revealed") && el.getBoundingClientRect().top < window.innerHeight) mostrar(el);
      });
    }, 6000);
  }

  /* Luz de la cabecera que sigue al ratón (con inercia; el bucle se detiene al llegar) */
  function initLuz() {
    if (!punteroFino) return;
    var hero = document.querySelector("[data-luz]");
    if (!hero) return;
    var luz = hero.querySelector(".hero__luz--raton");
    if (!luz) return;

    var caja = hero.getBoundingClientRect();
    var reposoX = function () { return hero.clientWidth * 0.74; };
    var reposoY = function () { return hero.clientHeight * 0.34; };
    var x = reposoX(), y = reposoY(), tx = x, ty = y;
    var raf = null;
    var visible = true;

    hero.classList.add("sigue-raton");

    function pintar() {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      luz.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
      raf = (visible && (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4)) ? requestAnimationFrame(pintar) : null;
    }

    function pedir() { if (!raf && visible) raf = requestAnimationFrame(pintar); }

    hero.addEventListener("pointermove", function (e) {
      caja = hero.getBoundingClientRect();
      tx = e.clientX - caja.left;
      ty = e.clientY - caja.top;
      pedir();
    }, { passive: true });

    hero.addEventListener("pointerleave", function () {
      tx = reposoX();
      ty = reposoY();
      pedir();
    });

    window.addEventListener("resize", function () {
      tx = reposoX();
      ty = reposoY();
      pedir();
    }, { passive: true });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entradas) {
        visible = entradas[0].isIntersecting;
        if (visible) pedir();
      }).observe(hero);
    }

    luz.style.transform = "translate3d(" + x + "px," + y + "px,0)";
  }

  /* Halo bajo el cursor en tarjetas [data-foco] */
  function initFoco() {
    if (!punteroFino) return;
    document.addEventListener("pointermove", function (e) {
      var el = e.target && e.target.closest ? e.target.closest("[data-foco]") : null;
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty("--fx", (e.clientX - r.left).toFixed(0) + "px");
      el.style.setProperty("--fy", (e.clientY - r.top).toFixed(0) + "px");
    }, { passive: true });
  }

  /* Calculadora: relleno del deslizador y salto del total cuando cambia */
  function initCalculadora() {
    var rango = document.getElementById("calc-clientes-rango");
    var numero = document.getElementById("calc-clientes");
    var total = document.getElementById("calc-total");
    if (!rango) return;

    function relleno() {
      var min = Number(rango.min), max = Number(rango.max), v = Number(rango.value);
      var pct = max > min ? ((v - min) / (max - min)) * 100 : 0;
      rango.style.setProperty("--pct", pct.toFixed(2) + "%");
    }

    rango.addEventListener("input", relleno);
    // calculadora.js sincroniza el deslizador al escribir el número: se lee en el fotograma siguiente
    if (numero) numero.addEventListener("input", function () { requestAnimationFrame(relleno); });
    relleno();

    if (total && "MutationObserver" in window) {
      var anterior = total.textContent;
      new MutationObserver(function () {
        if (total.textContent === anterior) return;
        anterior = total.textContent;
        total.classList.remove("calc-salto");
        void total.offsetWidth; // reinicia la animación
        total.classList.add("calc-salto");
      }).observe(total, { childList: true, characterData: true, subtree: true });
    }
  }

  function arrancar() {
    safe(initAparicion, "aparicion");
    safe(initLuz, "luz");
    safe(initFoco, "foco");
    safe(initCalculadora, "calculadora");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar);
  else arrancar();
})();
