# Documentación del sitio · Trazabis para despachos

Este documento describe **qué contiene** el sitio y **cómo funciona**, página a página y pieza a pieza. La configuración técnica, el despliegue y la lista de pendientes están en el [README](README.md).

El historial de los cambios pedidos por el cliente (12-10-2026 y 14-10-2026), cambio a cambio, está en la [sección 9](#9-historial-de-actualizaciones-a-pedido-del-cliente).

---

## 1. Visión general

| | |
| --- | --- |
| **Producto** | Trazabis, SaaS B2B con IA de Servicios Digitales y Automatización SL |
| **Público** | Despachos de asesoría fiscal-contable de España con más de 50 clientes |
| **Origen del tráfico** | Anuncios de Meta Ads |
| **Objetivo único** | Que un despacho cualificado rellene el formulario |
| **Qué pasa después** | Un asistente de inteligencia artificial (setter de IA) llama al lead para confirmar su interés y fijar su reunión de onboarding (30 minutos, gratis). También puede reservarla directamente en cal.com o llamar al 917 943 471 |
| **Tecnología** | Sitio estático: HTML, CSS y JavaScript sin frameworks ni dependencias |

La página **informa, filtra y califica**: explica el producto y los precios, muestra con claridad para quién no es, y recoge respuestas que permiten priorizar cada lead.

### Mapa del sitio

```
/                                  Redirige a /despachos/ (conserva utm_* y fbclid)
/despachos/                        Landing (la única página de captación)
/despachos/calculadora.html        Calculadora oficial de trazabis.com, incrustada en la landing
/legal/aviso-legal.html            Aviso legal
/legal/politica-privacidad.html    Política de privacidad
/legal/politica-cookies.html       Política de cookies
/404.html                          Página de error
/tests/*.test.html                 Pruebas (no forman parte de la experiencia del visitante)
```

La landing no tiene menú. Enlaza fuera de sí misma a las páginas legales (desde el pie, las tres, y desde la casilla de privacidad del formulario, la política de privacidad en una pestaña nueva) y a la reserva directa en cal.com (debajo del formulario, en una pestaña nueva). La calculadora incrustada lleva sus propios enlaces a cal.com y a la política de privacidad de trazabis.com.

---

## 2. Contenido de la landing (`/despachos/`)

Las secciones aparecen en este orden. El texto es el copy literal del brief con las correcciones posteriores del cliente: el cargo de Rubén Bel Pauner (12-10-2026) y su feedback del 14-10-2026 (tarifa v9, reunión de onboarding, calculadora oficial, implantación en cinco pasos, seguridad y preguntas frecuentes). Desde el 15-10-2026 no queda ningún marcador `[PENDIENTE: …]` visible: el email, el teléfono y el domicilio del pie están escritos en el HTML y se ven también sin JavaScript.

| # | Sección | Fondo | Contenido |
| --- | --- | --- | --- |
| — | Barra superior | Blanco | Solo el logo, que enlaza al inicio de la página |
| 1 | Cabecera | Azul | Antetítulo, titular «Tus agentes preparan. Tu equipo aprueba.», subtítulo, botón «Ver si mi despacho encaja», nota «…fijar tu reunión de onboarding: 30 minutos, gratis, con un panel real en producción.» y el **vídeo demo** de Trazabis (91,7 s; el reproductor muestra 1:31), que no se descarga hasta pulsar «reproducir» |
| — | Franja de confianza | Azul suave | Cuatro garantías: «Servidores en la UE», «Sin cuota para el despacho», «Precios públicos sin IVA» y «Equipo técnico propio en Madrid». En una línea con separadores desde 900 px; en 2 × 2 en pantallas más estrechas |
| 2 | El problema | Blanco | «¿Te suena?» con cuatro tarjetas: canales dispersos, picos del cierre trimestral, rotación de personal junior e intentos fallidos con OCR o Excel |
| 3 | Capturar no basta | Gris claro | Por qué un OCR no resuelve el cuello de botella y comparativa «Solo captura» frente a «Con Trazabis». El borrador del asiento entra en el programa del despacho y su equipo lo aprueba: nada entra en firme sin una persona |
| 4 | Cómo funciona | Blanco | Seis pasos (Recibe, Lee y clasifica, Prepara, Valida, Concilia, **Prepara el asiento**: el borrador entra en el programa conectado, hoy Odoo, y el equipo lo aprueba con un clic), dos destacados (marca blanca y panel único) y el lema «Tus agentes preparan. Tú apruebas.» |
| 5 | Vídeo | Azul | «Cómo funciona Trazabis, en 90 segundos». **Solo existe si se configura `VIDEO_URL`**; como el vídeo demo ya está en la cabecera, se deja vacía y la sección no aparece |
| 6 | Implantación | Blanco | Cinco pasos (Reunión de onboarding · 30 minutos → Propuesta por escrito · en 48 horas → Alta · la primera semana → Oleadas · por grupos de clientes → Adopción · informe al mes), nota con el plan firmado y la **garantía** (si al cerrar la implantación la cartera no está operativa según el plan firmado, se devuelve el setup íntegro), qué aporta el despacho y qué hacen sus clientes. Los cinco pasos van en una fila desde 1100 px y en columna, con flechas verticales, por debajo |
| 7 | Precios | Gris claro | «Precios públicos, sin IVA» (tarifa v9): 0 € al mes para el despacho, tabla de implantación por tamaño de cartera, tabla de lo que paga cada cliente por tramos de documentos, la opción para clientes que solo envían documentos, Conciliación bancaria, nota de integración y condición Despacho Fundador (ver abajo) |
| 7b | Calcula tu caso | Blanco | La calculadora oficial de trazabis.com en un iframe que crece solo con su contenido, y el botón «Ver si mi despacho encaja» |
| 8 | Para quién es | Blanco, con filete superior | Dos columnas con el mismo peso visual: «Es para ti si» y «No es para ti si» |
| 9 | Seguridad | Azul | Cinco puntos: servidores en la UE y RGPD; usuarios y permisos por persona; custodia de cinco años del original con registro de quién validó qué; histórico exportable; contrato de encargo |
| 10 | Quiénes somos | Gris antracita | «Producto propio, en producción», texto sobre la empresa y foto de Rubén Bel Pauner, CEO y Fundador de Trazabis |
| 11 | Preguntas frecuentes | Blanco | Diez preguntas en acordeón (la décima, nueva: «¿Qué cuenta como documento?») |
| 12 | Formulario | Gris claro | «¿Vemos si tu despacho encaja?», el formulario en dos pasos y, debajo, la reserva directa: «¿Prefieres reservar directamente? Reserva tu reunión de onboarding · o llama al 917 943 471» |
| — | Pie | Azul | Logo, datos de la empresa, email y teléfono, enlaces legales, «Configurar cookies» y © con el año actual |

### Precios que muestra la página (tarifa v9, sin IVA)

**Para el despacho:** 0 € al mes. Panel de despacho incluido de por vida; Sync ERP a 0 € para la cartera si el programa está conectado (hoy, Odoo); sin cuota mensual ni permanencia para el despacho; descuento de cartera de por vida: 15 % hasta 50 clientes, 20 % de 51 a 100, 25 % de 101 a 150 y 30 % de 151 a 300.

**Implantación** (pago único según el tamaño de la cartera):

| Clientes en cartera | Implantación | Despacho Fundador (−40 %) |
| --- | --- | --- |
| Hasta 15 | 490 € | 294 € |
| 16–25 | 1.500 € | 900 € |
| 26–50 | 2.000 € | 1.200 € |
| 51–150 | 3.000–4.000 € | 1.800–2.400 € |
| 151–300 | 5.000–7.000 € | 3.000–4.200 € |
| Más de 300 | Presupuesto a medida | |

Incluye el diagnóstico de la cartera cliente a cliente, la configuración de cada cuenta, la aplicación con la marca del despacho, la conexión con su programa si está conectado, la puesta en marcha por oleadas y la formación del equipo. Los documentos de años anteriores se presupuestan aparte.

**Lo que paga cada cliente con su propia plataforma** (por documentos procesados al mes):

| Documentos al mes | Precio de lista | Con descuento de cartera (−15 % a −30 %) | Despacho Fundador (−30 %) |
| --- | --- | --- | --- |
| Hasta 25 | 5,90 €/mes | 5,02–4,13 € | 4,13 € |
| Hasta 50 | 8,90 €/mes | 7,57–6,23 € | 6,23 € |
| Hasta 75 | 11,90 €/mes | 10,12–8,33 € | 8,33 € |
| Hasta 100 | 14,90 €/mes | 12,67–10,43 € | 10,43 € |
| Hasta 150 | 19,40 €/mes | 16,49–13,58 € | 13,58 € |
| Hasta 200 | 23,90 €/mes | 20,31–16,73 € | 16,73 € |
| Hasta 300 | 32,90 €/mes | 27,96–23,03 € | 23,03 € |
| Hasta 400 | 40,40 €/mes | 34,34–28,28 € | 28,28 € |
| Hasta 500 | 44,90 €/mes | 38,17–31,43 € | 31,43 € |
| Más de 500 | Plan personalizado | | |

Lo paga el cliente o lo asume el despacho (el precio no cambia). Sin cargo por documento extra: si un mes hay más, se pasa al tramo siguiente. Pago anual: se pagan 10 cuotas de 12. Las cifras son las de la calculadora oficial, con sus redondeos.

**Si los clientes solo envían documentos:** el despacho los administra desde su panel y recibe una sola factura: 1,25 € por cuenta activa más 0,025 € por documento procesado. Mínimo 25 cuentas, permanencia de 12 meses y sin descuentos encima. Se puede mezclar cuenta a cuenta.

**Conciliación bancaria:** incluida hasta 100 movimientos al mes por cuenta; por encima, 14,90 € al mes de lista con el descuento de cartera, sin alta.

**Programa conectado:** hoy Odoo. Holded y a3ERP están en cola de integración, sin fecha.

**Despacho Fundador:** 30 % de por vida para toda la cartera e implantación a −40 %, para las firmas hasta el 31 de octubre de 2026 (10 plazas). Las dos columnas «Despacho Fundador» y la frase de la nota de precios **desaparecen solas el 1 de noviembre de 2026** (ver 3.4). La calculadora oficial hace lo mismo por su cuenta.

---

## 3. Funcionamiento: recorrido de un visitante

```
Anuncio de Meta ──► /despachos/?utm_…&fbclid=…
                       │
                       ├─ Se guardan utm_* y fbclid (sessionStorage)
                       ├─ Aparece el banner de cookies
                       │
                       ▼
               Lee la página · usa la calculadora ──► (opcional) solicitud desde la calculadora
                       │
        «Ver si mi despacho encaja» (5 botones) ──► baja al formulario
                       │
                       ▼
     Paso 1: 7 preguntas sobre el despacho ──► se calcula la prioridad
                       │
                       ▼
     Paso 2: contacto + consentimientos ──► envío en JSON a FORM_ENDPOINT
                       │
                       ▼
     Página de gracias ──► el asistente de IA llama para fijar la reunión de onboarding
```

### 3.1 Llegada

1. Si el anuncio apunta a la raíz (`/`), la página redirige a `/despachos/` **sin perder** los parámetros de campaña.
2. Al cargar la landing, `formulario.js` lee `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` y `fbclid` de la URL y los guarda en `sessionStorage` para enviarlos con el formulario.
3. Aparece el banner de cookies (salvo que el visitante ya haya elegido en los últimos 12 meses).

### 3.2 Consentimiento de cookies (`consent.js`)

- Por defecto todo está **denegado**: no se hace ninguna petición a Google, Meta ni Microsoft.
- El banner ofrece «Aceptar todas», «Rechazar todas» y «Configurar». En escritorio, los tres son botones del mismo tamaño y peso visual.
- **En móvil (menos de 768 px)** el banner es una barra inferior compacta (unos 157 px de alto en 375 × 667, el 23,5 %): un texto corto de dos líneas, «Aceptar todas» y «Rechazar todas» del mismo tamaño en una fila y «Configurar» como enlace de texto que abre el mismo panel. Si la barra fija «Ver si mi despacho encaja» está visible, el banner se apoya encima de ella: ninguna tapa a la otra y el titular de la cabecera se sigue leyendo.
- El panel de configuración tiene tres categorías: **Técnicas** (siempre activas), **Analíticas** (Google Analytics 4 y Microsoft Clarity) y **Publicitarias** (Pixel de Meta).
- La elección se guarda con fecha en `localStorage` (`trazabis_consent`) y se vuelve a preguntar a los 12 meses.
- **Google Tag Manager solo se carga** si `GTM_ID` está configurado **y** el visitante acepta al menos una categoría no técnica.
- «Configurar cookies», en el pie de todas las páginas, reabre el panel. Si se retira un permiso, se intentan borrar las cookies de esa categoría.

### 3.3 Botones «Ver si mi despacho encaja»

Hay cinco: cabecera, sección de vídeo (si existe), precios, calculadora y la barra fija inferior en móvil. Todos bajan al formulario y registran el evento `cta_click` con su ubicación. El enlace «Reserva tu reunión de onboarding» de debajo del formulario también registra `cta_click` (`reserva_directa`), pero no baja a ningún sitio: es una puerta a la agenda (ver 3.3b).

La **barra fija en móvil** (pantallas de menos de 768 px) está visible mientras se lee la página y se oculta cuando el formulario entra en pantalla.

### 3.3b Ruta C · Agenda directa (`agenda.js`)

Para quien prefiere reservar directamente. Las puertas a la agenda son el enlace «Reserva tu reunión de onboarding» de debajo del formulario y los enlaces a la agenda de la calculadora oficial.

1. Al pulsar una puerta se abre un aviso con el texto aclaratorio y el botón «Aceptar» al lado (debajo, en móvil). El texto es una propuesta pendiente de validar: «La agenda se abre en una pestaña nueva. Elige día y hora para tu reunión de onboarding (30 minutos, gratis) y responde tres preguntas: número de clientes, programa contable y tu cargo. Así tendremos tu demo preparada. Te enviaremos un recordatorio 24 horas y otro 1 hora antes, con el acceso a la reunión. Al reservar, el asistente de IA ya no te llamará.»
2. «Aceptar» abre la agenda en una pestaña nueva y cierra el aviso. «Cerrar», Escape o un clic fuera lo cierran sin abrir nada, y el foco vuelve a la puerta.
3. La agenda es hoy cal.com (`AGENDA_URL`, en `config.js`); en la versión publicada será el calendario de GHL.
4. Lo que pasa después de reservar se configura en GHL, no en la landing: la reserva entra en el CRM, se envía `Schedule` a Meta por la API de conversiones, el formulario de la agenda pregunta número de clientes, programa y cargo, Rubén recibe un email, se mandan recordatorios a 24 h y 1 h con el acceso a la demo, y no hay llamada del asistente de IA.

Sin JavaScript no hay aviso: las puertas llevan directamente a la agenda.

### 3.4 Retirada automática del programa Despacho Fundador (`main.js`)

`config.js` guarda la fecha de fin (`FUNDADOR_HASTA`, 31-10-2026 a las 23:59:59, hora peninsular). Al cargar la página, si ya ha pasado, se ocultan todos los elementos marcados con `data-fundador` (las dos columnas de las tablas y la frase de la nota de precios) y las celdas con `data-colspan-sin-fundador` ajustan su ancho para que las tablas no queden con huecos, también en la versión apilada de móvil.

- Para probarlo antes de tiempo: `?debug=1&fecha_prueba=2026-11-01` (o solo `?fecha_prueba=…` en localhost). En producción, sin `debug=1`, el parámetro se ignora.
- **Sin JavaScript la condición fundador se sigue viendo.** El 1-11-2026 hay que borrar a mano los elementos `data-fundador` (tarea en el README).

### 3.5 Calculadora oficial (`calculadora.html` + `calculadora-integracion.js`)

La calculadora es la de trazabis.com, con la tarifa v9, para que las cifras coincidan siempre con la web principal. Tiene un modo guiado (clientes, volumen de documentos, cómo son los clientes, reparto y quién paga el acceso) y un modo libre, y termina con una oferta y un formulario propio «Solicitar información». Va en un iframe del mismo dominio; la landing no toca su contenido, solo la rodea:

1. **Alto automático:** la calculadora avisa de su alto y el iframe crece con ella (+24 px), sin doble barra de desplazamiento.
2. **Envío de sus solicitudes:** la landing le facilita la función de envío, que manda un `POST` en JSON a `CALC_ENDPOINT` (o a `FORM_ENDPOINT` si aquel está vacío) con todo lo que prepara la calculadora más `origen: "landing-despachos-ads"`, `version: "calculadora"`, la URL, el `referrer`, un `event_id` único y `utm_*` + `fbclid`. Si el envío va bien, registra `generate_lead` con `version: "calculadora"`. **Si los dos endpoints están vacíos, la calculadora se queda en «vista previa»: muestra lo que enviaría pero no envía nada**, y en la consola aparece un aviso.
3. **`calculator_use`:** se registra una vez por visita, en la primera interacción con la calculadora.

Las fuentes de la calculadora se sirven desde `assets/fonts/` (parche marcado al principio del archivo), así que tampoco contacta con Google. Sin JavaScript la calculadora no funciona; el resto de la página, sí.

### 3.6 Formulario (`formulario.js`)

**Paso 1 · Tu despacho** (todas obligatorias):

1. Clientes del despacho
2. Personas en el equipo
3. Cargo
4. Programa contable: Odoo, Holded, a3ERP, Sage, Otro, Ninguno (Excel o papel) o No lo sé
5. *Solo si el programa no es Odoo:* si les sirve trabajar con tablas y exportables mientras llega el conector
6. Intentos previos (OCR, Excel, ambos o no)
7. Cuándo quieren empezar

**Paso 2 · Contacto:** nombre, despacho, email, teléfono móvil (con prefijo; con +34 exige 9 dígitos), qué les gustaría resolver (opcional, máximo 500 caracteres) y cuatro casillas, ninguna marcada de inicio:

| Casilla | Obligatoria |
| --- | --- |
| Acepta la política de privacidad | Sí |
| Acepta la llamada del asistente de IA | Sí |
| Comunicaciones comerciales por email | No |
| Compartir datos cifrados con Meta para medir anuncios | No |

Junto al botón de envío se avisa de que llamará un asistente de inteligencia artificial, no una persona.

**Validación:** al pulsar «Continuar» o «Enviar» y al salir de un campo ya tocado. Los errores aparecen en español junto al campo y el foco va al primero.

**Prioridad del lead** (se calcula sin que el visitante la vea, en este orden):

| Prioridad | Condición |
| --- | --- |
| `no_cerrar` | Necesita el conector desde el primer día, o tiene menos de 20 clientes |
| `alta` | 51 clientes o más, socio/director/gerente, Odoo o acepta tablas, y ha intentado resolverlo antes |
| `baja` | 20–50 clientes, o «solo me estoy informando» |
| `media` | El resto |

**Envío:**

- Se manda un `POST` en JSON a `FORM_ENDPOINT` con las respuestas, los datos de contacto, el teléfono en formato internacional, los consentimientos, `utm_*`, `fbclid`, un `event_id` único, la prioridad, la URL, la fecha y `version: "despachos"`.
- Si `FORM_ENDPOINT` está vacío (modo de desarrollo), no se envía nada y los datos se muestran en la consola.
- Si el envío falla, aparece un mensaje de error, no se pierde ningún dato y el reintento usa el mismo `event_id`.
- Un campo trampa oculto (`website`) frena a los bots: si viene relleno, se muestra la página de gracias sin enviar nada.

### 3.7 Página de gracias

Sustituye al formulario: «Gracias, {nombre}. Ten el móvil a mano.», con el aviso de que llamará el asistente de IA. Si se configura `TELEFONO_ASISTENTE`, se indica el número y aparece un botón para guardarlo en contactos (descarga `trazabis-asistente.vcf`). Al recargar la página se sigue viendo la página de gracias durante esa sesión del navegador. La reserva directa (cal.com y teléfono) sigue visible debajo.

---

## 4. Medición

Todos los eventos pasan por `datalayer.js`, que **solo deja pasar una lista cerrada de parámetros**: nunca llegan al dataLayer el nombre, el email, el teléfono, el despacho ni el texto libre.

| Evento | Cuándo |
| --- | --- |
| `cta_click` | Clic en un botón «Ver si mi despacho encaja» o en una puerta a la agenda. `cta_location`: `hero` · `video` · `inversion` · `calculadora` · `sticky` · `reserva_directa` · `calculadora_reserva` |
| `agenda_open` | «Aceptar» en el aviso previo a la agenda (`cta_location`: `reserva_directa` · `calculadora_reserva`). El `Schedule` de Meta lo envía GHL al confirmarse la reserva |
| `video_play` | Primera reproducción del vídeo demo de la cabecera (o del de la sección 5, si existe) |
| `calculator_use` | Primera interacción con la calculadora oficial, una vez por visita (`version: "calculadora"`) |
| `form_start` | Primera interacción con el formulario |
| `form_step_complete` | Paso 1 completado (incluye respuestas y prioridad) |
| `form_error` | Un evento por campo con error al intentar avanzar |
| `generate_lead` | Envío correcto del formulario (`version: "despachos"`, con `event_id`, respuestas, prioridad, consentimientos y `utm_*`) o de la calculadora (`version: "calculadora"`, con `event_id` y `utm_*`) |
| `faq_open` | Se abre una pregunta frecuente |
| `consent_update` | El visitante guarda su elección de cookies |

La API de conversiones de Meta no está en la web: la envía el sistema que recibe el formulario, con el mismo `event_id` para que Meta no duplique la conversión. El detalle está en el README.

---

## 5. Diseño y animaciones

- **Identidad:** bloques de color sólido (azul Trazabis, blanco, gris claro y gris antracita), Montserrat para titulares y Roboto para el texto. Las fuentes se sirven desde el propio sitio para no contactar con Google sin consentimiento.
- **Cabecera:** malla de puntos y focos de luz; con ratón, el foco principal sigue al cursor. A la derecha en pantallas de 1024 px o más (debajo del texto en las más estrechas), el vídeo demo con su póster y un botón de reproducción propio. Con `preload="none"`, solo se descarga el póster (8 KB) hasta que se pulsa «reproducir»; entonces aparecen los controles nativos. Se sirve en WebM con copia MP4 para Safari e iPhone antiguos.
- **Al hacer scroll:** los bloques aparecen escalonados y los iconos de línea se dibujan.
- **Interacción:** halo bajo el cursor y elevación en las tarjetas (solo con ratón), botones con brillo y flecha y línea de progreso en los seis pasos. Las preguntas frecuentes se abren con transición suave en los navegadores que lo permiten (Chrome 131 o posterior); en el resto se abren al instante.
- **Accesibilidad:** el primer elemento del teclado es «Saltar al contenido», que solo se ve al recibir el foco. Todos los elementos interactivos muestran un contorno de foco visible.
- **Sin JavaScript** todo el contenido sigue visible.
- **Con movimiento reducido** activado en el sistema:
  - Se quitan todas las animaciones en bucle: la deriva de las luces, el halo del botón de reproducción y el brillo de la barra de progreso.
  - Los bloques que aparecen al hacer scroll solo se funden, sin desplazarse.
  - El desplazamiento hacia el formulario deja de ser suave.
  - Se mantiene la entrada de la cabecera al cargar, que es un desplazamiento corto de 22 px.

---

## 6. Páginas complementarias

| Página | Contenido y funcionamiento |
| --- | --- |
| **Aviso legal** | Datos del titular (LSSI) con los datos registrales, objeto, condiciones de uso, propiedad intelectual, responsabilidad, jurisdicción y contacto. El email y el teléfono están escritos en el HTML como enlaces (y `config.js` los mantiene) |
| **Política de privacidad** | Responsable, datos tratados, finalidades y bases legales, llamada del asistente de IA (para confirmar el interés y agendar la reunión de onboarding; se graba), conservación, proveedores (HighLevel, Cal.com, Google Meet o Zoom, Meta, Google y Microsoft), transferencias, derechos, menores, seguridad y cambios en la política |
| **Política de cookies** | Qué son, tabla de cookies por proveedor y categoría (con sus duraciones), aviso sobre las cookies técnicas de Go High Level, cómo aceptarlas, rechazarlas o cambiar la elección, transferencias, actualizaciones y contacto |
| **404** | Página autónoma (estilos y logo integrados) con un enlace que localiza la landing aunque el sitio esté en un subdirectorio |

Las tres páginas legales usan los textos legales vigentes de trazabis.com, adaptados a esta landing y completados con los datos del Registro Mercantil (fecha de publicación: 15 de octubre de 2026). Los puntos que conviene que revise un abogado están en el README. Comparten cabecera, pie y banner de cookies con la landing.

---

## 7. Archivos y responsabilidades

| Archivo | Qué hace |
| --- | --- |
| `assets/js/config.js` | Constantes de configuración: `GTM_ID`, `FORM_ENDPOINT`, `VIDEO_URL`, `VIDEO_POSTER`, `TELEFONO_ASISTENTE`, `EMAIL_CONTACTO`, `TELEFONO_CONTACTO`, `CALC_ENDPOINT` y `FUNDADOR_HASTA` |
| `assets/js/datalayer.js` | Envía eventos al dataLayer filtrando datos personales |
| `assets/js/consent.js` | Banner, panel y modo de consentimiento; carga de GTM tras aceptar |
| `assets/js/main.js` | Año y contacto del pie, clics en los botones, vídeo demo de la cabecera y sección de vídeo, retirada del programa Despacho Fundador, preguntas frecuentes y barra fija |
| `assets/video/` | Vídeo demo en WebM (original) y MP4 (copia de compatibilidad) |
| `despachos/calculadora.html` | Calculadora oficial de trazabis.com (archivo del cliente; solo lleva el parche de fuentes) |
| `assets/js/calculadora-integracion.js` | Alto del iframe, envío de las solicitudes de la calculadora, `calculator_use` y paso de sus enlaces a la agenda por el aviso previo |
| `assets/js/agenda.js` | Aviso previo a la agenda (ruta C), `AGENDA_URL` y evento `agenda_open` |
| `assets/js/formulario.js` | Formulario, validación, prioridad, envío y página de gracias |
| `assets/js/efectos.js` | Animaciones: aparición al hacer scroll, luz de la cabecera y halos |
| `assets/css/styles.css` | Todos los estilos y los tokens de color de marca |
| `assets/img/` | Logo, foto de Rubén y póster del vídeo en WebP (más el logo PNG y la foto JPG originales, que no se usan en las páginas) |
| `assets/fonts/` | Montserrat y Roboto de Google Fonts alojadas en el sitio, con su licencia |
| `.htaccess` | Caché, compresión y tipos MIME en Hostinger / Apache |

Si un script de efectos falla, el resto del sitio sigue funcionando: cada bloque se inicia por separado.

---

## 8. Antes de publicar

1. Repasar la lista de pendientes por responsable del README (ya no hay marcadores visibles) y revisar las cifras que muestra el vídeo demo en el panel «Resumen».
2. Rellenar `config.js`, como mínimo `FORM_ENDPOINT` (y `CALC_ENDPOINT` si las solicitudes de la calculadora van a otro sitio), con CORS habilitado. Sin ellos, ni el formulario ni la calculadora envían nada.
3. Validar con el abogado los textos legales, las casillas y el banner de cookies.
4. Configurar GTM con las comprobaciones de consentimiento de cada etiqueta.
5. Subir todos los archivos, incluido `.htaccess`, y actualizar `?v=` en los enlaces a CSS y JS en cada despliegue.
6. El 1-11-2026, borrar del HTML los elementos `data-fundador` para quien navegue sin JavaScript (con JavaScript desaparecen solos).

---

## 9. Historial de actualizaciones a pedido del cliente

Todo el trabajo está en la rama `claude/trazabis-landing-despachos-jpfpwr` (pull request n.º 1 de `jaredmarketingmaster/trazabis-herrero`). **Nada se ha fusionado con `main` ni publicado**: queda pendiente de revisión.

> Nota de redacción: la verificación pedida por el cliente exige que la documentación vigente no contenga los términos de su «lista roja» (el nombre del antiguo módulo de conciliación y el del antiguo conector, la errata del programa a3ERP, los planes con nombre, el descuento del primer año, etc.). Por eso este historial describe lo que se retiró sin copiar esos textos literalmente.

### 9.1 Corrección del 12-10-2026

Pedida por el cliente tras ver la primera versión. Commit `6473966`.

| Petición | Qué se hizo |
| --- | --- |
| Rubén Bel Pauner es CEO y Fundador de Trazabis | Pie de foto de la sección «Quiénes somos»: «Rubén Bel Pauner · CEO y Fundador de Trazabis» |
| Texto del módulo de conciliación bancaria | Se sustituyó el marcador pendiente por el texto del cliente («Sube el extracto en N43 o PDF y Trazabis casa cada movimiento con los documentos ya leídos…»). El 14-10-2026 el módulo pasó a llamarse **Conciliación bancaria** y cambió su precio (ver 9.2, bloque E) |
| Sustituir la ilustración de la cabecera por el vídeo demo, sin que se descargue hasta pulsar «reproducir» | Vídeo demo en la cabecera con `preload="none"`: antes de reproducir solo se carga el póster (8 KB). Botón de reproducción propio, controles nativos al reproducir y evento `video_play`. WebM original y copia MP4 para Safari e iPhone antiguos. `.htaccess` con tipos MIME y caché de vídeo |

### 9.2 Feedback del 14-10-2026

El cliente entregó su revisión por escrito el 14-10-2026, junto con su calculadora oficial (`calculadora.html`, tarifa v9). Ese feedback **sustituye a todo el contenido comercial anterior**: la tarifa de agosto, los planes con nombre, el descuento del primer año, las submarcas y la errata del programa a3ERP.

**Reglas que se siguieron**

- Solo los cambios pedidos, uno a uno, sobre el `index.html` de la landing (no se copió la landing corregida del cliente, que traía errores de integración: un comentario HTML roto visible, notas con la clase `.legal`, dos botones eliminados, una rejilla de fases rota y un script en línea).
- Textos nuevos copiados **carácter a carácter** (con `&nbsp;`, el signo «−» y sin recalcular céntimos).
- Sin scripts en línea nuevos (patrón IIFE, `defer` y `safe()`), sin peticiones a terceros antes del consentimiento y con la estructura, las clases, los atributos y la indentación existentes.
- Un commit por bloque, en español, explicando el porqué.

**Cambios aplicados (C01–C31)**

| Bloque · commit | Cambio | Qué se hizo |
| --- | --- | --- |
| **A** · `9f28699` | C01 Nota del botón de la cabecera | «Unas preguntas sobre tu despacho y te llamamos para fijar tu reunión de onboarding: 30 minutos, gratis, con un panel real en producción.» |
| | C02 Antetítulo | **Sin cambios** (decisión pendiente D1) |
| | C03 Franja de confianza (nueva) | Bajo la cabecera: «Servidores en la UE» · «Sin cuota para el despacho» · «Precios públicos sin IVA» · «Equipo técnico propio en Madrid». Fondo azul suave; una línea con filetes desde 900 px, 2 × 2 en móvil |
| **B** · `8489b43` | C04 Último punto de «Con Trazabis» | «El borrador del asiento entra en tu programa; tu equipo lo aprueba» |
| | C05 Párrafo de cierre | «…y deja el borrador del asiento en tu programa conectado. Tu equipo revisa solo lo dudoso y aprueba: nada entra en firme sin una persona.» |
| **C** · `2f74c9c` | C06 Paso 5 | «Concilia: cruza los extractos bancarios (N43 o PDF) con los documentos ya leídos y señala lo que no cuadra.» (sin submarca) |
| | C07 Paso 6 | Pasa de «Contabiliza» a **«Prepara el asiento:** el borrador entra en tu programa conectado (hoy Odoo) y tu equipo lo aprueba con un clic.» También se renombró su icono (`i-asiento`) |
| **D** · `bf30bbd` | C08 Implantación | Las tres fases anteriores pasan a cinco pasos: Reunión de onboarding · 30 minutos → Propuesta por escrito · en 48 horas → Alta · la primera semana → Oleadas · por grupos de clientes → Adopción · informe al mes. Nota con el plan firmado y la **garantía** de devolución íntegra del setup. CSS nuevo `.fases--cinco`: cinco en fila desde 1100 px y una columna con flechas verticales por debajo, sin filas incompletas |
| **E** · `8a861e2` | C09 Precios | Sección sustituida por la tarifa v9 literal del cliente: 0 € para el despacho, tabla de implantación (con columna Despacho Fundador −40 %), tabla de lo que paga cada cliente por tramos de 5,90 € a 44,90 € (con descuento de cartera y columna Fundador −30 %), clientes que solo envían documentos (1,25 € por cuenta + 0,025 € por documento), Conciliación bancaria, nota de integración (Odoo hoy; Holded y a3ERP en cola, sin fecha) y nota de precios. Se retiraron los planes con nombre, el descuento del primer año, el valor anual del panel, el antiguo conector con submarca, «sin cuota, sin mínimos y sin permanencia» para todo, el plazo de primera respuesta del soporte, el precio aparte del antiguo módulo de conciliación, la nota del estudio de viabilidad y el marcador sobre los documentos por plan. Clase nueva `.nota-precios` |
| | C10 Retirada del programa Despacho Fundador | `FUNDADOR_HASTA` en `config.js` y `initFundador` en `main.js`: desde el 1-11-2026 se ocultan los 17 elementos `data-fundador` y se ajustan los `colspan`. Prueba con `?debug=1&fecha_prueba=2026-11-01` |
| **F** · `c85c186` y `10768cb` | C11 Calculadora oficial | Sección nueva 7b «Calcula tu caso» con la calculadora del cliente en un iframe (`despachos/calculadora.html`) y su botón «Ver si mi despacho encaja». La sección 8 recibe `seccion--separada` para no fundirse con la 7b |
| | C12 Integración técnica | `assets/js/calculadora-integracion.js`: alto automático del iframe, envío de las solicitudes de la calculadora a `CALC_ENDPOINT` (o `FORM_ENDPOINT`) y `calculator_use` una vez por visita. `datalayer.js` deja de admitir los parámetros de la calculadora antigua |
| | C13 Parche de fuentes | En `calculadora.html` solo se sustituyó el enlace a Google Fonts por `@font-face` hacia `../assets/fonts`, con el comentario «PARCHE LANDING (14-10-2026)…». El resto del archivo es idéntico al del cliente, byte a byte |
| | C14 Retirada de la calculadora antigua | Borrados su script, su prueba, su animación en `efectos.js` y sus reglas CSS, sin referencias huérfanas |
| **G** · `b10a22c` | C15 Seguridad | Dos puntos nuevos: «Usuarios y permisos: cada persona ve solo las empresas y las funciones que le corresponden.» y «Custodia de cinco años del original de cada documento, con registro de quién validó qué dato y cuándo.» (mismos iconos) |
| **H** · `06fb233` | C16–C21 Respuestas de las preguntas frecuentes | Textos nuevos del cliente en: «¿Gratis para el despacho?», «Ya uso un OCR», «Mi programa no es Odoo», «¿Quién paga los planes de mis clientes?», «¿Hay permanencia?» y «¿Migráis el histórico?» |
| | C22 Pregunta nueva | «¿Qué cuenta como documento?», antes de la del formulario (pasan a ser diez) |
| | C23 «¿Qué pasa cuando envío el formulario?» | «…para confirmar tu interés y fijar tu reunión de onboarding, gratuita.» |
| **I** · `2d0c3b1` | C24 Entradilla del formulario | «Responde unas preguntas sobre tu despacho y te llamaremos para fijar tu reunión de onboarding: 30 minutos, gratis.» |
| | C25 Programa contable | Opciones: Odoo, Holded, a3ERP (`a3erp`), Sage, Otro, Ninguno (Excel o papel) (`ninguno`) y No lo sé. Se quitaron la errata y el duplicado. Lógica sin cambios. Cuatro pruebas nuevas en `tests/prioridad.test.html` (16 de 16 correctas) |
| | C26 Casilla de la llamada | «…para confirmar mi interés y fijar mi reunión de onboarding.» En la política de privacidad, la finalidad de la llamada pasa a «agendar la reunión de onboarding» (tabla de finalidades, apartado de la llamada y fila del proveedor del asistente de voz) |
| | C27 Reserva directa | Debajo del formulario: «¿Prefieres reservar directamente? Reserva tu reunión de onboarding · o llama al 917 943 471». Enlace a cal.com en pestaña nueva con `data-cta="reserva_directa"` y teléfono como enlace `tel:`. Sigue visible tras la página de gracias. Clase nueva `.nota-reserva` |
| **J** · `8510982` | C28 Configuración | `EMAIL_CONTACTO` = `escribeme@trazabis.es` y `TELEFONO_CONTACTO` = `917 943 471` (los marcadores del pie desaparecen). `CALC_ENDPOINT` y `FUNDADOR_HASTA` añadidos en los bloques F y E |
| **K** · `1da222d` | C29 Banner de cookies en móvil | Por debajo de 768 px, barra inferior compacta: texto corto, «Aceptar todas» y «Rechazar todas» iguales (159 × 44 px) y «Configurar» como enlace. 157 px de alto en 375 × 667 (23,5 %); el titular se lee. Si la barra «Ver si mi despacho encaja» está visible, el banner se coloca encima. La lógica de `consent.js` no cambia; el escritorio, tampoco |
| **L** · `86d3706` y `2236b0d` | C30 Documentación | README y este documento actualizados |
| | C31 Caché | Todos los `?v=` de CSS y JS pasan a `20261014-1` (landing, tres páginas legales y prueba de prioridad). Después, `formulario.js` pasó a `20261014-2` (ver 9.3) |

**Decisiones de integración tomadas por el equipo técnico (no venían del cliente)**

1. **Botones «Ver si mi despacho encaja» en precios (`inversion`) y en la calculadora (`calculadora`):** se mantienen porque la medición `cta_click` los necesita.
2. **Parche de fuentes de la calculadora:** su enlace a Google Fonts contactaba con Google sin consentimiento. Las fuentes locales son variables (pesos 100–900); la cursiva de Roboto no existe en local y el navegador la simula.
3. **`CALC_ENDPOINT`:** si está vacío se usa `FORM_ENDPOINT`; si también lo está, la calculadora queda en «vista previa» (no envía nada) y la consola muestra un aviso.
4. **`initFundador`:** `fecha_prueba` solo funciona en localhost o con `?debug=1`. No se reutilizó el modo de desarrollo de `datalayer.js` porque también se activa con `GTM_ID` vacío, es decir, hoy en producción.
5. **Reserva directa:** `reserva_directa` registra el clic sin bloquear el enlace. Va fuera del contenedor que se sustituye por la página de gracias. El teléfono es un enlace `tel:`.
6. **Texto corto del banner móvil:** «Usamos cookies técnicas y, si aceptas, analíticas y publicitarias. Política de cookies.». El cliente no lo dio; debe validarlo el abogado.
7. **Aviso legal:** se corrigió la errata del programa a «a3ERP» en la lista de marcas citadas, porque la verificación del cliente exige que no aparezca en las páginas legales. No se tocó nada más del texto legal.
8. **Otros ajustes:**
   - `aria-label` en la lista de la franja y no en su contenedor (en un `<div>` genérico no es válido).
   - Clases del bloque de conciliación renombradas a `conciliacion__texto` y `conciliacion__aviso`.
   - Reglas para que las tablas de precios no se salgan a 375 px.
   - `seccion--separada` en la sección 8.
   - Un comentario de `config.js` reescrito para no usar una palabra de la lista roja.

**Verificación (14-10-2026)**

- **Navegador (Playwright, 375, 768, 1024, 1280 y 1440 px):** sin scroll horizontal, cinco pasos y franja bien colocados y tablas dentro de su caja.
- **Peticiones a terceros:** ninguna sin consentimiento, tampoco desde el iframe.
- **Consola:** sin errores. Solo el aviso intencionado de la calculadora mientras no haya endpoint.
- **Calculadora real:**
  - El iframe crece solo, sin scroll interno.
  - Una solicitud llegó a un webhook de prueba con `event_id`, `version: "calculadora"`, UTM y `fbclid`.
  - `generate_lead` sin datos personales y `calculator_use` una vez.
- **Medición:** `cta_click` en `hero`, `inversion`, `calculadora`, `sticky` y `reserva_directa`; `faq_open` en la pregunta nueva.
- **Programa Fundador:** 0 de 17 elementos visibles con la fecha de prueba del 1-11, y 17 de 17 hoy.
- **Sin JavaScript y con movimiento reducido:** contenido visible y sin animaciones infinitas.
- **Accesibilidad (axe-core):** 0 infracciones en la landing.
- **Lighthouse en móvil:** rendimiento 95–96, accesibilidad 100 y buenas prácticas 100.
- **Términos de la lista roja:** 0 coincidencias en la landing, los scripts, las páginas legales, el README y este documento. Las únicas apariciones de «diagnóstico» válidas son las que el cliente mantiene.

**Dudas abiertas**

Ninguna. Las tres que quedaban (textos fuera del alcance del feedback que contradecían el cambio a «reunión de onboarding») se resolvieron después; ver 9.3.

**Observaciones sobre la calculadora del cliente (no modificadas)**

- Su formulario remite a la política de privacidad de trazabis.com, no a la de esta landing.
- Su lista de programas incluye «A3» y «Contasol».
- Promete «te escribimos en menos de un día laborable», no la llamada del asistente de IA (relacionado con D2).
- Abierta sola, axe le da 0 infracciones WCAG y 2–3 avisos de buenas prácticas: sin `<main>`, contenido fuera de regiones y orden de encabezados.

**Decisiones pendientes del cliente (no aplicadas)**

| # | Decisión | Cómo queda |
| --- | --- | --- |
| D1 | ¿Solo despachos de más de 50 clientes o todos (desde 10)? | Antetítulo «Para asesorías y gestorías con más de 50 clientes» y «Es para ti si… más de 50 clientes» |
| D2 | ¿Estará operativo el asistente de IA el día del lanzamiento? | Se mantienen los textos del asistente de IA |
| D3 | ¿Se usa el programa Despacho Fundador en la campaña y cuántas plazas quedan? | Visible hasta el 31-10-2026, con retirada automática |
| D4 | ¿Cuánto dura de verdad la reunión? | «30 minutos»; falta comprobar el evento `demo-trazabis` de cal.com |

**Contenido que el brief original prohibía y que ahora se muestra por indicación expresa del cliente:** el programa Despacho Fundador (descuentos del 30 % y del 40 %) y la garantía de devolución del setup.

**Qué no se tocó, por indicación del cliente:**

- Las secciones «¿Te suena?», vídeo (oculta), «Para quién es» (salvo el filete de separación) y «Quiénes somos».
- El vídeo de la cabecera.
- La lógica del formulario, salvo C24–C27.
- Las casillas de privacidad, comunicaciones y Meta, y sus marcadores del abogado.
- `404.html`, `.htaccess` y la redirección de la raíz.

### 9.3 Alineación de los últimos textos con la «reunión de onboarding»

Tras el feedback del 14-10-2026 quedaban tres textos fuera de su alcance que seguían hablando de un diagnóstico de cartera, en contradicción con el cambio pedido por el cliente. Se aplicaron las tres propuestas:

| Dónde | Antes | Ahora |
| --- | --- | --- |
| Página de gracias (`assets/js/formulario.js`) | «…para confirmar tu interés y agendar tu diagnóstico de cartera.» | «…para confirmar tu interés y fijar tu reunión de onboarding.» |
| Aviso legal, objeto (`legal/aviso-legal.html`) | «…permite a los interesados solicitar un diagnóstico de cartera.» | «…permite a los interesados solicitar una reunión de onboarding.» |
| Política de privacidad, tabla de proveedores (`legal/politica-privacidad.html`) | «Agenda del diagnóstico» | «Agenda de la reunión de onboarding» |

- No se tocó nada más del texto legal, que entonces seguía pendiente de revisión (se completó el 15-10-2026; ver 9.4).
- Versión de caché: `formulario.js` pasa a `?v=20261014-2` en `despachos/index.html` y en `tests/prioridad.test.html`, los dos archivos que lo cargan. Las páginas legales no cargan ese script y sus CSS y JS no cambian, así que mantienen `?v=20261014-1` (el HTML se revalida en cada visita).
- Con esto, la única aparición de «diagnóstico» en la landing, los scripts y las páginas legales es «Incluye el diagnóstico de tu cartera cliente a cliente», en la implantación, que el cliente mantiene.

### 9.4 Textos legales definitivos (15 de octubre de 2026)

Paso de la versión beta a la final. Las tres páginas legales se completaron con los textos legales vigentes de trazabis.com (adaptados al usted y sin las frases que en esta landing serían falsas), con los datos registrales publicados y con los datos confirmados por Jared el 14-10-2026 (alojamiento, CRM, asistente de voz y email en HighLevel, Inc.; GA4, Clarity y Pixel de Meta instalados; llamada grabada; casilla de Meta mantenida; videollamada por Google Meet o Zoom). Fuentes y valores en la sección «Textos legales» del README.

| Página · commit | Cambios |
| --- | --- |
| Landing · `2093323` | Pie con el domicilio definitivo (Planta Baja B, 28046; el código postal anterior era incorrecto) y con el email y el teléfono escritos como enlaces, visibles sin JavaScript. Fuera los dos marcadores del abogado del formulario: los textos de las casillas se publican como están y la casilla de Meta se mantiene, opcional y sin marcar. `TELEFONO_CONTACTO` pasa a «+34 917 943 471» para coincidir con el HTML, porque `main.js` lo reescribe con ese valor |
| Aviso legal · `9ebc097` | Fecha; datos identificativos completos (domicilio con Chamartín, Registro Mercantil de Madrid, sección 8.ª, hoja M-830114, inscripción 1.ª, y Trazabis como marca y producto de la sociedad); objeto con Trazabis como producto de precontabilidad documental; una frase del texto oficial en condiciones de uso y en propiedad intelectual; apartado nuevo 8. Contacto |
| Política de privacidad · `da83013` | Fecha; responsable con email de privacidad y teléfono, sin la línea del delegado de protección de datos; consentimiento como base legal de la medición con Meta; la llamada se graba en HighLevel y se avisa al comienzo; conservación con el criterio de la web oficial; tabla de proveedores definitiva (HighLevel, Cal.com, Google Meet o Zoom, Meta, Google y Microsoft); transferencias con el Marco de Privacidad de Datos o cláusulas contractuales tipo; derechos por email o correo postal |
| Política de cookies · `f244de8` | Fecha; duraciones definitivas (`_ga` 2 años; `_clck` 1 año y `_clsk` 1 día; `_fbp` y `_fbc` 90 días); aviso de las cookies técnicas de Go High Level, que se añadirán tras escanear el sitio publicado; actualizaciones y apartado nuevo 6. Contacto con el texto oficial |
| Las cuatro páginas · `5956737` | Espacios duros (`&nbsp;`) dentro de los enlaces de teléfono, para que el número no se parta en dos líneas (lo pedía html-validate). El texto visible no cambia |
| Documentación | README con la sección «Textos legales» (fuentes, datos usados y revisión recomendada por un abogado) y la lista de pendientes actualizada; este apartado |

- **Coherencia con el banner:** el banner y el panel de cookies nombran las mismas herramientas que la tabla: GA4 y Clarity en «Analíticas» y el Pixel de Meta en «Publicitarias». La lógica de consentimiento no cambió.
- **Caché:** `config.js` pasa a `?v=20261014-3` en la landing y en las tres páginas legales; es el único archivo de código modificado.
- **Marcadores:** ya no queda ninguno visible. El único es el aviso oculto del póster del vídeo de la sección 5, que solo aparece si se configura `VIDEO_URL` sin `VIDEO_POSTER`.

**Verificación (15-10-2026)**

- **Búsquedas:**
  - De marcadores (`[PENDIENTE`, `[VERIFICAR`, `class="pendiente"`) en `legal/`, la landing y `404.html`: solo el aviso oculto del póster.
  - De `28048` en todo el repositorio, salvo `calculadora.html`: 0 resultados.
  - De las frases de trazabis.com que aquí serían falsas: 0 resultados.
- **Domicilio:** el mismo en el pie de las cuatro páginas («Paseo de la Castellana 194, Planta Baja B, 28046 Madrid»). En los apartados de titular y responsable figura con «Chamartín», tal como lo pide el texto de esos apartados.
- **En navegador, con y sin JavaScript (las cuatro páginas):**
  - Ningún marcador ni fondo amarillo visible.
  - Email, teléfono y domicilio reales en el pie.
  - `mailto:escribeme@trazabis.es` y `tel:+34917943471` correctos.
  - El enlace a la AEPD se abre en una pestaña nueva.
- **Banner y panel de cookies:** las mismas herramientas y categorías que la tabla de la Política de cookies.
- **html-validate:** los mismos avisos que antes en las cuatro páginas, sin errores nuevos.
- **Pruebas de prioridad:** 16 de 16.

### 9.5 Ruta C · Agenda directa (15 de octubre de 2026)

A partir de la tarjeta de flujo «C · Agenda directa» y de tres decisiones de Jared:
- se mantiene cal.com para ver el funcionamiento y en la versión publicada se conectará el calendario de GHL;
- cualquier puerta a la agenda abre antes un aviso con el texto aclaratorio y el botón «Aceptar», y la agenda se abre en una pestaña nueva;
- el evento `Schedule` a Meta lo envía GHL por la API de conversiones.

| Archivo | Cambio |
| --- | --- |
| `despachos/index.html` | El enlace de reserva directa pasa a ser una puerta (`data-agenda="reserva_directa"`) y se añade el aviso `<dialog id="aviso-agenda">` con su texto y el botón «Aceptar» |
| `assets/js/agenda.js` (nuevo) | Abre el aviso desde cualquier puerta; «Aceptar» abre la agenda en una pestaña nueva y registra `agenda_open`; aplica `AGENDA_URL`; devuelve el foco a la puerta al cerrar |
| `assets/js/calculadora-integracion.js` | Los enlaces a la agenda de la calculadora pasan por el mismo aviso (`cta_click` con `calculadora_reserva`), sin tocar `calculadora.html` |
| `assets/js/config.js` | Constante nueva `AGENDA_URL` (hoy cal.com) |
| `assets/css/styles.css` | Estilos del aviso: el mismo lenguaje que el panel de cookies; texto y botón en fila desde 600 px y apilados en móvil |
| README y este documento | Sección «Ruta C · Agenda directa», con la configuración que corresponde a GHL, y pendientes |

Caché: `styles.css` y `config.js` pasan a `?v=20261015-1` en las cuatro páginas, y `calculadora-integracion.js` y `agenda.js` (nuevo) a `?v=20261015-1` en la landing.

**Verificación:**
- **En navegador, a 375 y 1440 px:**
  - El clic en la puerta abre el aviso y ninguna pestaña.
  - Escape y «Cerrar» lo cierran, y el foco vuelve a la puerta.
  - «Aceptar» abre `cal.com/ruben-bel/demo-trazabis` en una pestaña nueva y cierra el aviso.
  - Los enlaces a la agenda de la calculadora también abren el aviso.
  - `cta_click` y `agenda_open` llegan con su `cta_location`; sin errores de consola.
- **Sin JavaScript:** el aviso no se ve y el enlace va directo a la agenda.
- **axe-core con el aviso abierto:** 0 infracciones.
- **html-validate:** los mismos avisos que antes.

**Pendiente:** validar el texto del aviso, que es una propuesta, y configurar en GHL lo que promete (preguntas en la reserva, recordatorios a 24 h y 1 h y exclusión de la llamada de IA).
