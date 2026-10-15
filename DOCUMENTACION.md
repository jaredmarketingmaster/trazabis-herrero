# Documentación del sitio · Trazabis para despachos

Este documento describe **qué contiene** el sitio y **cómo funciona**, página a página y pieza a pieza. La configuración técnica, el despliegue y la lista de pendientes están en el [README](README.md).

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

Las secciones aparecen en este orden. El texto es el copy literal del brief con las correcciones posteriores del cliente: el cargo de Rubén Bel Pauner (12-10-2026) y su feedback del 14-10-2026 (tarifa v9, reunión de onboarding, calculadora oficial, implantación en cinco pasos, seguridad y preguntas frecuentes). Los datos que faltan se muestran como marcadores `[PENDIENTE: …]` resaltados en amarillo. En la landing quedan visibles dos, los del abogado en las casillas del formulario: validar sus textos y decidir si se mantiene la casilla de Meta. (El email y el teléfono del pie ya se rellenan desde `config.js`; sin JavaScript se sigue viendo el marcador.)

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

Hay cinco: cabecera, sección de vídeo (si existe), precios, calculadora y la barra fija inferior en móvil. Todos bajan al formulario y registran el evento `cta_click` con su ubicación. El enlace «Reserva tu reunión de onboarding» de debajo del formulario también registra `cta_click` (`reserva_directa`) y abre cal.com en una pestaña nueva, sin bajar a ningún sitio.

La **barra fija en móvil** (pantallas de menos de 768 px) está visible mientras se lee la página y se oculta cuando el formulario entra en pantalla.

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
| Compartir datos cifrados con Meta para medir anuncios *(pendiente de decisión del abogado)* | No |

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
| `cta_click` | Clic en un botón «Ver si mi despacho encaja» o en la reserva directa. `cta_location`: `hero` · `video` · `inversion` · `calculadora` · `sticky` · `reserva_directa` |
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
| **Aviso legal** | Datos del titular (LSSI), objeto, condiciones de uso, propiedad intelectual, responsabilidad y jurisdicción. El email y el teléfono se rellenan desde `config.js` |
| **Política de privacidad** | Responsable, datos tratados, finalidades y bases legales, llamada del asistente de IA (para confirmar el interés y agendar la reunión de onboarding), conservación, proveedores, transferencias, derechos, menores, seguridad y cambios en la política |
| **Política de cookies** | Qué son, tabla de cookies por proveedor y categoría, cómo aceptarlas, rechazarlas o cambiar la elección, transferencias y actualizaciones |
| **404** | Página autónoma (estilos y logo integrados) con un enlace que localiza la landing aunque el sitio esté en un subdirectorio |

Las tres páginas legales son **borradores pendientes de revisión por el abogado**. Comparten cabecera, pie y banner de cookies con la landing.

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
| `assets/js/calculadora-integracion.js` | Alto del iframe, envío de las solicitudes de la calculadora y `calculator_use` |
| `assets/js/formulario.js` | Formulario, validación, prioridad, envío y página de gracias |
| `assets/js/efectos.js` | Animaciones: aparición al hacer scroll, luz de la cabecera y halos |
| `assets/css/styles.css` | Todos los estilos y los tokens de color de marca |
| `assets/img/` | Logo, foto de Rubén y póster del vídeo en WebP (más el logo PNG y la foto JPG originales, que no se usan en las páginas) |
| `assets/fonts/` | Montserrat y Roboto de Google Fonts alojadas en el sitio, con su licencia |
| `.htaccess` | Caché, compresión y tipos MIME en Hostinger / Apache |

Si un script de efectos falla, el resto del sitio sigue funcionando: cada bloque se inicia por separado.

---

## 8. Antes de publicar

1. Completar los `[PENDIENTE]` (lista por responsable en el README) y revisar las cifras que muestra el vídeo demo en el panel «Resumen».
2. Rellenar `config.js`, como mínimo `FORM_ENDPOINT` (y `CALC_ENDPOINT` si las solicitudes de la calculadora van a otro sitio), con CORS habilitado. Sin ellos, ni el formulario ni la calculadora envían nada.
3. Validar con el abogado los textos legales, las casillas y el banner de cookies.
4. Configurar GTM con las comprobaciones de consentimiento de cada etiqueta.
5. Subir todos los archivos, incluido `.htaccess`, y actualizar `?v=` en los enlaces a CSS y JS en cada despliegue.
6. El 1-11-2026, borrar del HTML los elementos `data-fundador` para quien navegue sin JavaScript (con JavaScript desaparecen solos).
