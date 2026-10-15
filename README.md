# Trazabis · Landing para despachos

Landing de **Trazabis** para despachos de asesoría fiscal-contable que reciben tráfico de Meta Ads. Su único objetivo es que un despacho cualificado rellene el formulario; después, un asistente de inteligencia artificial (setter de IA) le llama para confirmar su interés y fijar su reunión de onboarding (30 minutos, gratis). Debajo del formulario también puede reservarla directamente en cal.com o llamar.

Sitio estático: HTML, CSS y JavaScript sin frameworks, sin paso de compilación y sin dependencias externas. Funciona en GitHub Pages, Netlify, Vercel o cualquier hosting estático, también publicado en un subdirectorio (todas las rutas internas son relativas).

> **Antes de publicar:** desde el 15-10-2026 no queda ningún marcador `[PENDIENTE: …]` visible. Lo que falta por decidir o comprobar, agrupado por responsable, está en [Pendientes](#pendientes-por-responsable).

---

## Índice

1. [Estructura](#estructura)
2. [Probar en local](#probar-en-local)
3. [Configuración (`config.js`)](#configuración-configjs)
4. [Despliegue](#despliegue)
5. [Calculadora oficial y cómo actualizarla](#calculadora-oficial)
6. [Retirada del programa Despacho Fundador](#retirada-del-programa-despacho-fundador)
7. [Ruta C · Agenda directa](#ruta-c--agenda-directa)
8. [Formulario](#formulario)
9. [Medición: dataLayer, GTM y consentimiento](#medición-datalayer-gtm-y-consentimiento)
10. [Pendientes por responsable](#pendientes-por-responsable)
11. [Textos legales](#textos-legales)
12. [Diseño visual y animaciones](#diseño-visual-y-animaciones)
13. [Decisiones tomadas y diferencias con el brief](#decisiones-tomadas-y-diferencias-con-el-brief)
14. [Actualización del 14-10-2026 (feedback del cliente)](#actualización-del-14-10-2026-feedback-del-cliente)
15. [Comprobación final](#comprobación-final)
16. [Lighthouse](#lighthouse)
17. [Contraste de color](#contraste-de-color)

---

## Estructura

```
/index.html                       Redirección a despachos/ (conserva utm_* y fbclid)
/despachos/index.html             Landing
/despachos/calculadora.html        Calculadora oficial de trazabis.com (archivo del cliente + parche de fuentes)
/legal/aviso-legal.html
/legal/politica-privacidad.html
/legal/politica-cookies.html
/assets/css/styles.css            Estilos compartidos y tokens de marca
/assets/js/config.js              Constantes de configuración
/assets/js/datalayer.js           Helper de eventos (filtra datos personales)
/assets/js/consent.js             Banner, panel y modo de consentimiento; carga de GTM
/assets/js/main.js                Pie, botones CTA, barra fija, FAQ, vídeo y retirada del programa Fundador
/assets/js/formulario.js
/assets/js/calculadora-integracion.js  Alto del iframe, envío de solicitudes, calculator_use y enlaces a la agenda de la calculadora
/assets/js/agenda.js              Aviso previo y apertura de la agenda (ruta C)
/assets/js/efectos.js             Capa visual: aparición al scroll, luz de la cabecera, halos
/assets/fonts/                    Montserrat y Roboto (Google Fonts, licencia OFL) alojadas aquí
/assets/img/logo-trazabis.webp    Logo que usa la web (WebP sin pérdida, 7 KB)
/assets/img/logo-trazabis.png     Logo aportado (recortado y optimizado; original de referencia)
/assets/img/ruben-bel.webp        Foto que usa la web (WebP, 17 KB, sin filtros)
/assets/img/trazabis-demo-poster.webp  Póster del vídeo demo (primer fotograma, 8 KB)
/assets/video/trazabis-demo.webm  Vídeo demo de la cabecera (VP9 + Opus, 1920 × 1080, 1:32, 5,5 MB; archivo aportado)
/assets/video/trazabis-demo.mp4   Copia en H.264 + AAC (5,2 MB) para navegadores que no reproducen WebM
/assets/img/ruben-bel.jpg         Foto aportada (reducida a 800 px; original de referencia)
/tests/prioridad.test.html        Pruebas del cálculo de prioridad y del event_id
/404.html                         Página de error autónoma
/.htaccess                        Caché, compresión y tipos MIME para Hostinger / Apache / LiteSpeed
/.nojekyll                        Evita el procesado de Jekyll en GitHub Pages
```

Orden de carga de los scripts (todos con `defer` y patrón IIFE, sin módulos): `config.js` → `datalayer.js` → `consent.js` → `main.js` → `formulario.js` → `agenda.js` → `calculadora-integracion.js` → `efectos.js`. Cada inicialización de `main.js` y `efectos.js` va envuelta en `safe()`: si una falla, el resto sigue funcionando.

## Probar en local

```bash
python3 -m http.server 8000
```

- Landing: <http://localhost:8000/despachos/>
- Pruebas: <http://localhost:8000/tests/prioridad.test.html>
- Calculadora sola: <http://localhost:8000/despachos/calculadora.html>

En local (o con `?debug=1`, o mientras `GTM_ID` esté vacío) el sitio está en **modo de desarrollo**: cada `dataLayer.push` se imprime en la consola y, si `FORM_ENDPOINT` está vacío, el formulario no envía nada y muestra los datos con `console.info`.

## Configuración (`config.js`)

| Constante | Para qué sirve | Si está vacía |
| --- | --- | --- |
| `GTM_ID` | Contenedor de Google Tag Manager (`GTM-XXXXXXX`) | GTM no se carga nunca |
| `FORM_ENDPOINT` | URL (webhook del CRM o del setter de IA) que recibe el formulario en JSON | Modo de desarrollo: no se envía nada |
| `VIDEO_URL` | Archivo de vídeo (MP4/WebM) de «Cómo funciona Trazabis, en 90 segundos» | La sección de vídeo no existe en el DOM |
| `VIDEO_POSTER` | Imagen de póster del vídeo (constante añadida) | Si hay vídeo, se muestra `[PENDIENTE]` bajo él |
| `TELEFONO_ASISTENTE` | Número desde el que llama el asistente de IA | La página de gracias no muestra número ni botón `.vcf` |
| `EMAIL_CONTACTO` | Email del pie y de las páginas legales (`escribeme@trazabis.es`) | Se ve el valor escrito en el HTML (el mismo) |
| `TELEFONO_CONTACTO` | Teléfono del pie y de las páginas legales (`+34 917 943 471`) | Se ve el valor escrito en el HTML (el mismo) |
| `AGENDA_URL` | Agenda de la reserva directa (hoy cal.com; en la versión publicada, el calendario de GHL) | Las puertas usan el `href` escrito en el HTML |
| `CALC_ENDPOINT` | Webhook que recibe las solicitudes de la calculadora en JSON | Se usa `FORM_ENDPOINT`; si también está vacío, la calculadora queda en vista previa y no envía nada |
| `FUNDADOR_HASTA` | Fin del programa Despacho Fundador (`2026-10-31T23:59:59+01:00`) | No se retira nada automáticamente |

- **Nunca** pongas claves de API ni secretos en `config.js`: es un archivo público.
- `VIDEO_URL` debe ser un archivo de vídeo directo. Un enlace de YouTube o Vimeo no funcionaría con `<video>` y, además, cargaría terceros sin consentimiento.
- `FORM_ENDPOINT` (y `CALC_ENDPOINT`) debe aceptar peticiones CORS desde el dominio de la landing: el navegador envía antes un `OPTIONS` (preflight) porque el cuerpo es `application/json`. El endpoint debe responder con `Access-Control-Allow-Origin` (el dominio de la landing), `Access-Control-Allow-Methods: POST` y `Access-Control-Allow-Headers: Content-Type`.

## Despliegue

**GitHub Pages:** *Settings → Pages → Build and deployment → Deploy from a branch*, rama `main`, carpeta `/ (root)`. La URL será `https://<usuario>.github.io/<repositorio>/`, que redirige a `despachos/`. `404.html` se sirve automáticamente.

**Netlify:** conectar el repositorio sin comando de compilación y con `.` como directorio de publicación (o arrastrar la carpeta).

**Vercel:** proyecto «Other», sin comando de compilación, directorio de salida `.`.

**Hostinger (o cualquier Apache / LiteSpeed):** subir todo el contenido de la carpeta, **incluido `.htaccess`** (es un archivo oculto: activa «mostrar archivos ocultos» en el cliente FTP o en el Administrador de archivos). El `.htaccess` hace que HTML, CSS y JS se revaliden en cada visita, que imágenes y fuentes se guarden un mes, comprime el texto y fija los tipos MIME. En un VPS con Nginx el `.htaccess` no se aplica.

**Cualquier hosting estático:** subir todos los archivos tal cual.

**En cada despliegue que cambie CSS o JS, sube el número de versión** que llevan los enlaces a `styles.css` y a los scripts (hoy conviven `?v=20261014-1`, `?v=20261014-2` y `?v=20261015-1`, según la última vez que cambió cada archivo) en `despachos/index.html`, en las tres páginas legales y en `tests/prioridad.test.html`, usando la fecha del día (`?v=AAAAMMDD-n`). Así ningún navegador ni CDN sirve una versión antigua.

Notas:

- La landing vive en `/despachos/` (con barra final). Si el hosting sirve `/despachos` sin barra, un script en línea añade la barra para que las rutas relativas funcionen.
- `/index.html` redirige a `despachos/` **conservando** `utm_*` y `fbclid`, por si un anuncio apunta a la raíz.
- `404.html` lleva estilos y logo en línea porque los hostings la sirven en cualquier ruta; su enlace localiza la raíz del sitio aunque esté en un subdirectorio.
- **Indexación:** la landing lleva `<meta name="robots" content="noindex, follow">` (landing de pauta). Para indexarla, cambia ese valor a `index, follow` en `despachos/index.html` (y en `/index.html`). Las páginas legales no llevan `noindex`.
- Publica con HTTPS y comprueba en la pestaña Red que el hosting comprime los archivos de texto (cabecera `content-encoding`) y envía cabeceras de caché para `assets/`.

## Calculadora oficial

La sección 7b «Calcula tu caso» incrusta `despachos/calculadora.html`, la calculadora oficial de trazabis.com (tarifa v9), en un iframe del mismo dominio. **No se modifica su contenido comercial ni su lógica**: el cliente exige que los números de la landing y los de trazabis.com coincidan siempre. `assets/js/calculadora-integracion.js` la rodea sin tocarla:

- **Alto automático:** escucha los mensajes `{trazabisCalculadora: "alto", alto}` que envía la calculadora (solo si vienen del propio iframe y del mismo origen) y fija el alto del iframe en `alto + 24` px. El CSS parte de 1.400 px (`.calculadora-oficial`).
- **Envío de sus solicitudes:** al cargar el iframe define `window.enviarSolicitudTrazabis` dentro de él. La función hace `POST` en JSON a `CALC_ENDPOINT` (o a `FORM_ENDPOINT`) con el objeto de la calculadora (contacto, etiquetas, resumen, secciones, `trampa`, `tiempo`…) más `origen: "landing-despachos-ads"`, `version: "calculadora"`, `pagina`, `referrer`, `event_id` (mismo generador que el formulario) y `utm_*` + `fbclid` (de `sessionStorage`, `trazabis_utm`). Devuelve `{ok}` como espera la calculadora y, si va bien, registra `generate_lead`. Con los dos endpoints vacíos no se define la función: la calculadora muestra su «vista previa» y la consola avisa.
- **`calculator_use`:** primera interacción (`click`, `input` o `change`) dentro de la calculadora, una vez por visita (`sessionStorage`, `trazabis_calculadora_uso`).
- Todo acceso al iframe va en `try/catch`: si un hosting la sirviera desde otro origen, la página sigue funcionando y solo se pierde la medición y el envío.

Notas para quien reciba las solicitudes: el campo `trampa` viene relleno si un robot completó el campo oculto y `tiempo` es el tiempo en milisegundos desde que se cargó la calculadora; conviene descartar las solicitudes con `trampa` o con menos de 2,5 s. La calculadora envía también su propio objeto `utm` (vacío dentro del iframe); los valores buenos son los `utm_*` del nivel superior.

### Cómo actualizar la calculadora oficial

Cuando el cliente envíe una versión nueva (por ejemplo, al cambiar la tarifa):

1. Sustituye `despachos/calculadora.html` por el archivo nuevo, tal cual.
2. **Reaplica el parche de fuentes** (único cambio permitido):
   - Borra el `<link rel="stylesheet" href="https://fonts.googleapis.com/…">` y cualquier `preconnect` a `fonts.googleapis.com` o `fonts.gstatic.com`.
   - En su lugar, pon un `<style>` con dos `@font-face`: `Montserrat` → `url("../assets/fonts/montserrat-latin.woff2")` y `Roboto` → `url("../assets/fonts/roboto-latin.woff2")`, ambos con `font-weight: 100 900` y `font-display: swap` (copia las dos reglas de la versión actual).
   - Añade después de `<!DOCTYPE html>` el comentario `<!-- PARCHE LANDING (14-10-2026): fuentes servidas desde ../assets/fonts en lugar de Google Fonts. Reaplicar si el cliente envía una versión nueva de este archivo. -->`.
3. Comprueba que el archivo sigue enviando el mensaje de alto (`trazabisCalculadora: 'alto'`) y que sigue llamando a `window.enviarSolicitudTrazabis(p)`; si cambiara esa interfaz, hay que adaptar `calculadora-integracion.js`.
4. Abre la landing con la pestaña Red de DevTools, sin aceptar cookies: no debe haber **ninguna** petición a dominios de Google (tampoco desde el iframe).
5. Sube el `?v=` de la landing.

Las cifras estáticas de la sección de precios (sección 7) **no** se actualizan solas: si cambia la tarifa, hay que cambiarlas también en `despachos/index.html`.

## Retirada del programa Despacho Fundador

El programa termina el 31-10-2026. `initFundador` (`main.js`) compara la fecha actual con `FUNDADOR_HASTA` y, si ya ha pasado, oculta todos los `[data-fundador]` (las columnas «Despacho Fundador» de las dos tablas y la frase de `.nota-precios`) y aplica a cada `[data-colspan-sin-fundador]` su nuevo `colspan`. La calculadora oficial se retira sola con su propia fecha.

- **Prueba:** `?debug=1&fecha_prueba=2026-11-01` (en localhost basta `?fecha_prueba=…`). En producción, sin `debug=1`, `fecha_prueba` se ignora.
- **Tarea manual del 1-11-2026:** sin JavaScript la condición fundador se sigue viendo. Ese día, borra del HTML los elementos con `data-fundador` y sustituye cada `colspan` por el valor de su `data-colspan-sin-fundador`.

## Ruta C · Agenda directa

Para quien ya sabe que quiere la reunión: intención máxima, porque ya reservó. Pasa por la agenda (o por el teléfono) y no por el formulario.

### En la landing

- **Puertas a la agenda:**
  - el enlace «Reserva tu reunión de onboarding» de debajo del formulario (`data-agenda="reserva_directa"`);
  - los enlaces a la agenda de la calculadora oficial. Son de `calculadora.html`, que no se modifica: los intercepta `calculadora-integracion.js`.
- **Aviso previo (`assets/js/agenda.js`):** al pulsar cualquier puerta se abre un aviso (`<dialog id="aviso-agenda">`) con el texto aclaratorio y, a su lado, el botón «Aceptar». «Aceptar» es un enlace normal con `target="_blank"`: abre la agenda en una pestaña nueva y cierra el aviso.
  - El aviso se cierra con «Cerrar», con Escape o pulsando fuera, y el foco vuelve a la puerta que lo abrió.
  - Sin JavaScript, o en navegadores sin `<dialog>`, las puertas llevan directamente a la agenda.
- **Texto del aviso** (propuesta redactada a partir del flujo de la ruta C; **pendiente de validar por el cliente**): «Antes de abrir la agenda» — «La agenda se abre en una pestaña nueva. Elige día y hora para tu reunión de onboarding (30 minutos, gratis) y responde tres preguntas: número de clientes, programa contable y tu cargo. Así tendremos tu demo preparada. Te enviaremos un recordatorio 24 horas y otro 1 hora antes, con el acceso a la reunión. Al reservar, el asistente de IA ya no te llamará.»
- **Agenda:** `AGENDA_URL` en `config.js`. Hoy es cal.com (`https://cal.com/ruben-bel/demo-trazabis`), para ver el funcionamiento. En la versión publicada será el calendario de GHL. Al cambiarla:
  1. `AGENDA_URL` en `config.js` (`agenda.js` la aplica a todos los enlaces y al botón «Aceptar», también a los de la calculadora);
  2. el `href` del enlace de reserva directa en `despachos/index.html` y el del botón «Aceptar» (los usa quien navega sin JavaScript);
  3. la fila de Cal.com de la política de privacidad (apartado 6), que se sustituye o se quita, porque el calendario pasa a ser de HighLevel.
- **Medición:**
  - `cta_click` al pulsar una puerta: `reserva_directa` en la landing y `calculadora_reserva` en la calculadora;
  - `agenda_open` al pulsar «Aceptar», con la misma `cta_location`.

  La reserva en sí ocurre en la agenda, fuera de la landing: la landing no sabe si se completó.

### En Go High Level (Jared, fuera de este repositorio)

Así está definida la ruta C:

| Paso | Qué hace |
| --- | --- |
| 0 min · Reserva en CRM | La reserva entra en el CRM: por webhook desde cal.com mientras se use cal.com, o directamente con el calendario de GHL. Se envía el evento **`Schedule`** a Meta **desde GHL, con la API de conversiones** (no desde la landing) |
| Preguntas en la reserva | El formulario de la agenda pregunta el número de clientes, el programa contable y el cargo |
| Email a Rubén | Aviso a Rubén para tener la demo lista antes de la reunión |
| Recordatorios | 24 h y 1 h antes, con el acceso a la demo |
| Sin llamada de IA | Quien reserva queda fuera de la llamada del asistente de IA: no se le hace agendar otra vez |

El texto del aviso promete las preguntas, los recordatorios y que no habrá llamada de IA. Esas tres cosas tienen que estar configuradas en la agenda y en GHL antes de publicar.

## Formulario

Dos pasos con barra de progreso. Validación al pulsar «Continuar» o «Enviar» y al salir de cada campo ya tocado, con mensajes en español, `aria-invalid`, `aria-describedby` y foco en el primer error.

### JSON que recibe `FORM_ENDPOINT`

```json
{
  "clientes_cartera": "101_150",
  "tamano_equipo": "3_15",
  "cargo": "socio_director_gerente",
  "programa_contable": "holded",
  "acepta_sin_conector": "si",
  "intento_previo": "ocr",
  "plazo_inicio": "antes_cierre_trimestral",
  "nombre": "…",
  "despacho": "…",
  "email": "…",
  "telefono": "+34612345678",
  "que_resolver": "…",
  "acepta_privacidad": true,
  "acepta_llamada_ia": true,
  "acepta_comunicaciones": false,
  "acepta_medicion_publicitaria": false,
  "utm_source": "meta",
  "utm_medium": "paid",
  "utm_campaign": "…",
  "utm_content": "…",
  "utm_term": "…",
  "fbclid": "…",
  "event_id": "0866cc66-dea8-4f94-af62-793cbc9a742d",
  "prioridad": "alta",
  "landing_url": "https://…/despachos/?utm_source=meta…",
  "timestamp": "2026-10-12T18:19:20.915Z",
  "version": "despachos"
}
```

- `telefono` va en formato internacional (E.164): prefijo seleccionado + número. Con +34 se exigen 9 dígitos; si la persona escribe también «+34» o «0034», no se duplica.
- `acepta_sin_conector` vale `no_aplica` cuando el programa es Odoo (la pregunta no se muestra).
- `utm_*` y `fbclid` se leen de la URL y se guardan en `sessionStorage` (`trazabis_utm`); si no hay, llegan vacíos.
- `event_id` es un UUID v4 generado al enviar. Si el envío falla, el reintento usa **el mismo** `event_id`, para que el receptor pueda deduplicar.
- Campo trampa `website`: si llega relleno, se muestra la página de gracias sin enviar nada y sin medir.
- Si el endpoint responde con error (o tarda más de 15 s), se muestra «No hemos podido enviar el formulario. Inténtalo de nuevo en unos segundos.» y no se pierde ningún dato.
- Tras un envío correcto, la página de gracias sustituye al formulario (titular, texto y formulario) y se recuerda en `sessionStorage` (`trazabis_envio`, con el nombre para el titular) hasta cerrar la pestaña.

### Valores (*slugs*) de las respuestas

| Campo | Valores |
| --- | --- |
| `clientes_cartera` | `menos_20` · `20_50` · `51_100` · `101_150` · `151_200` · `201_250` · `251_300` · `mas_300` |
| `tamano_equipo` | `1_2` · `3_15` · `mas_15` |
| `cargo` | `socio_director_gerente` · `responsable_contabilidad` · `otro` |
| `programa_contable` | `odoo` · `holded` · `a3erp` · `sage` · `otro` · `ninguno` · `no_lo_se` (todo lo que no es `odoo` muestra la pregunta 5) |
| `acepta_sin_conector` | `si` · `no` · `no_aplica` (Odoo) |
| `intento_previo` | `ocr` · `excel` · `ambos` · `no` |
| `plazo_inicio` | `antes_cierre_trimestral` · `proximos_6_meses` · `mas_adelante` · `solo_informandome` |
| `prioridad` | `no_cerrar` · `alta` · `media` · `baja` |

### Cálculo de `prioridad`

Se evalúa en este orden (el primero que se cumple gana), tal como lo define el brief:

1. `no_cerrar`: `acepta_sin_conector` = `no`, o `clientes_cartera` = `menos_20`.
2. `alta`: 51 clientes o más **y** cargo `socio_director_gerente` **y** (`odoo` o `acepta_sin_conector` = `si`) **y** `intento_previo` ≠ `no`.
3. `baja`: `20_50`, o `plazo_inicio` = `solo_informandome`.
4. `media`: el resto.

> Consecuencia del orden: un lead que cumple todas las condiciones de `alta` pero responde «Solo me estoy informando» queda como `alta`. Si debe ser `baja`, basta con evaluar esa condición antes (función `calcularPrioridad` de `formulario.js` y su prueba en `tests/prioridad.test.html`).

## Medición: dataLayer, GTM y consentimiento

### Reglas que aplica el código

- Todos los eventos pasan por `TrazabisDL.push()` (`datalayer.js`), que **solo deja pasar los parámetros de una lista cerrada** y descarta cualquier valor con «@». Nombre, email, teléfono, despacho y texto libre nunca llegan al dataLayer.
- `window.dataLayer = window.dataLayer || []` se ejecuta antes de cualquier push.
- El primer elemento del dataLayer es siempre el consentimiento por defecto denegado (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization` = `denied`, `wait_for_update: 500`).
- **GTM solo se carga si `GTM_ID` tiene valor y el usuario ha aceptado las cookies analíticas o las publicitarias.** Sin consentimiento no hay ninguna petición a Google, Meta ni Microsoft (verificado, ver [Comprobación final](#comprobación-final)).

### Eventos

| event | Cuándo | Parámetros |
| --- | --- | --- |
| `cta_click` | Clic en cualquier «Ver si mi despacho encaja» o en una puerta a la agenda | `cta_location`: `hero` · `video` · `inversion` · `calculadora` · `sticky` · `reserva_directa` · `calculadora_reserva` |
| `agenda_open` | «Aceptar» en el aviso previo: se abre la agenda en una pestaña nueva | `cta_location`: `reserva_directa` · `calculadora_reserva` |
| `video_play` | Primera reproducción del vídeo | — |
| `calculator_use` | Primera interacción con la calculadora oficial (una vez por visita) | `version: "calculadora"` |
| `form_start` | Primera interacción con el formulario (una vez por visita) | — |
| `form_step_complete` | Paso 1 válido (una vez por visita) | `step: 1`, los 7 campos del paso 1, `prioridad` |
| `form_error` | Al intentar avanzar o enviar con errores: **un evento por campo con error** | `step` (1 o 2), `field` (nombre del campo) |
| `generate_lead` | Envío correcto de la calculadora | `event_id`, `version: "calculadora"`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` |
| `generate_lead` | Envío correcto del formulario | `event_id`, `version` (`despachos`), los 7 campos del paso 1, `prioridad`, `acepta_comunicaciones`, `acepta_medicion_publicitaria` (booleanos), `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` |
| `faq_open` | Se abre una pregunta | `faq_question` (texto de la pregunta) |
| `consent_update` | El usuario guarda su elección | `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` (`granted` · `denied`) |

### Consentimiento (`consent.js`)

- Banner propio con «Aceptar todas», «Rechazar todas» y «Configurar». En escritorio, los tres con el mismo tamaño, color y peso.
- **En móvil (< 768 px), barra inferior compacta:** texto corto de dos líneas (`.consent-banner__corto`; el texto largo queda para escritorio), «Aceptar todas» y «Rechazar todas» del mismo tamaño en una fila (159 × 44 px en 375 px) y «Configurar» como enlace de texto que abre el mismo panel. Mide unos 157 px en 375 × 667 (23,5 %). Si la barra fija «Ver si mi despacho encaja» está visible, el banner se coloca encima de ella; si está oculta, baja hasta el borde.
- Panel con tres categorías: **Técnicas** (siempre activas), **Analíticas** (Google Analytics 4 y Microsoft Clarity → `analytics_storage`) y **Publicitarias** (Pixel de Meta → `ad_storage`, `ad_user_data`, `ad_personalization`).
- La elección se guarda en `localStorage` (`trazabis_consent`, con fecha) dentro de `try/catch` y se vuelve a preguntar a los 12 meses.
- «Configurar cookies», en el pie de todas las páginas, reabre el panel.
- Si se retira un consentimiento, se intenta borrar las cookies propias de esa categoría (`_ga*`, `_gid`, `_clck`, `_clsk`, `_fbp`, `_fbc`, `_gcl_*`).

### Configuración necesaria en GTM (Jared)

1. Variables de capa de datos para cada parámetro de la tabla de eventos y activadores de evento personalizado para cada `event`.
2. Etiquetas de GA4: respetan `analytics_storage` por sí mismas (consentimiento integrado).
3. Etiquetas de Microsoft Clarity y del Pixel de Meta: en *Configuración avanzada → Configuración de consentimiento*, exigir consentimiento adicional: Clarity → `analytics_storage`; Pixel de Meta → `ad_storage`.
4. No añadas el fragmento `<noscript>` de GTM: cargaría Google sin consentimiento.
5. **API de conversiones de Meta:** no se implementa en el front-end. La envía el sistema que recibe `FORM_ENDPOINT`, con el **mismo `event_id`** que el evento del navegador, para que Meta deduplique (el Pixel debe enviar el evento `Lead` con `eventID` = `event_id`, y la API, `Lead` con `event_id` igual). Los datos de contacto cifrados (SHA-256) solo deberían enviarse si `acepta_medicion_publicitaria` es `true`. El parámetro `fbc` puede construirse en el servidor a partir de `fbclid` y de la fecha de llegada; consulta la documentación vigente de Meta antes de implementarlo.

## Pendientes por responsable

Desde el 15-10-2026 no queda ningún marcador visible en la landing ni en las páginas legales. El único que existe está oculto: el aviso del póster del vídeo de la sección 5 (`data-video-poster-pendiente hidden`), que solo aparece si se configura `VIDEO_URL` sin `VIDEO_POSTER`.

### Cliente (Rubén)

- [ ] **Decisiones D1–D4 del feedback del 14-10-2026** (no aplicadas; ver [Actualización del 14-10-2026](#actualización-del-14-10-2026-feedback-del-cliente)).
- [ ] Confirmar que el evento de cal.com `demo-trazabis` dura 30 minutos, como dice el copy (D4).
- [ ] Confirmar que no hay delegado de protección de datos (ver [Revisión recomendada por un abogado](#revisión-recomendada-por-un-abogado)).
- [ ] (Opcional) Tomo y folio del Registro Mercantil, si se quieren añadir al aviso legal.
- [ ] **Revisar las cifras que muestra el vídeo demo.** En el panel «Resumen» (hacia el segundo 10) aparecen el porcentaje de documentos insertados sin revisión y el tiempo medio por documento, con sus objetivos. El brief prohibía mostrar en el sitio porcentajes de automatización y precisamente esos objetivos. Confirmar que se aceptan como datos de demostración o reeditar el vídeo.
- [ ] Subtítulos del vídeo demo: si el audio tiene locución, aportar un archivo `.vtt` para añadirlo como pista de subtítulos (lo exige WCAG 1.2.2). Si solo es música, no hace falta.
- [ ] (Opcional) `VIDEO_URL` y `VIDEO_POSTER` solo activan la sección 5 «Cómo funciona Trazabis, en 90 segundos». Como ese vídeo ya está en la cabecera, se deja vacía para no repetirlo.
- [ ] Colores oficiales de marca (HEX) para sustituir los tokens de `styles.css`. **Ojo:** los colores medidos en el logo aportado son azul `#14376B` y morado `#8127E3`; el azul del brief (`#1E2852`) no coincide con el del logo.
- [ ] (Opcional) Versión monocroma del logo en blanco (SVG) para el pie; mientras tanto, el logo bicolor va sobre una placa blanca.
- [ ] (Opcional) Favicon.
- [ ] **Validar el texto del aviso previo a la agenda** (propuesta; ver [Ruta C](#ruta-c--agenda-directa)).
- [ ] Solicitudes de la calculadora: su propia casilla y su capa informativa (dentro de `calculadora.html`) remiten a `trazabis.com/privacidad`, no a la política de esta landing.

### Abogado

- [ ] Los puntos de [Revisión recomendada por un abogado](#revisión-recomendada-por-un-abogado). Ninguno deja marcadores en la página.

### Jared

- [ ] `GTM_ID`, `FORM_ENDPOINT` (con CORS habilitado), `CALC_ENDPOINT` (si no se usa `FORM_ENDPOINT`) y `TELEFONO_ASISTENTE` en `config.js`. Hasta entonces la consola avisa de que la calculadora no envía solicitudes.
- [ ] 1-11-2026: borrar del HTML los elementos `data-fundador` (para quien navega sin JavaScript).
- [ ] **Comprobar el alojamiento en Go High Level** antes de publicar. Esta guía de despliegue se escribió para un hosting estático, y la landing necesita lo siguiente:
  - Que se sirvan tal cual las carpetas `despachos/`, `legal/` y `assets/`, con rutas relativas.
  - Que `calculadora.html` esté en el mismo origen que la landing; si no, se pierden su alto automático, el envío y la medición.
  - Que, sin consentimiento, la plataforma no añada scripts ni peticiones a terceros.
  - `.htaccess` no se aplicará fuera de Apache/LiteSpeed.
- [ ] **Ruta C en GHL:** reserva en el CRM, evento `Schedule` a Meta por API de conversiones, preguntas en la reserva, email a Rubén, recordatorios a 24 h y 1 h y exclusión de la llamada de IA (ver [Ruta C](#ruta-c--agenda-directa)). Al pasar al calendario de GHL, cambiar `AGENDA_URL`, los dos `href` del HTML y la fila de Cal.com de la política de privacidad.
- [ ] Escanear las cookies de la landing ya publicada en Go High Level y añadir a la tabla las que instale la plataforma.
- [ ] Configuración de GTM (consentimiento de cada etiqueta, Pixel con `eventID`) y API de conversiones en el servidor.
- [ ] Despliegue (HTTPS, compresión y caché en el hosting).

## Textos legales

Las tres páginas legales usan los **textos legales vigentes de trazabis.com**, adaptados a esta landing:

- **Tratamiento de usted:** los textos de trazabis.com tutean y aquí se adaptan al usted.
- **Sin las frases que aquí serían falsas:** que no se usan cookies de análisis de terceros, que nunca se comparten datos con terceros o que los datos se alojan en la UE.
- **Datos completados:** con los datos confirmados por Jared el 14-10-2026 y con los datos registrales publicados.
- **Fecha de publicación:** 15 de octubre de 2026.

**Fuentes de los datos de la sociedad:**

- **Titular, NIF, email y teléfono:** textos legales de trazabis.com.
- **Domicilio:** Paseo de la Castellana 194, Planta Baja B, Chamartín, 28046 Madrid. Sale de los tres textos legales de trazabis.com; el código postal 28046 lo confirman Google Maps, JLL, LoopNet y datoscif.es, y el código postal que mostraba antes la landing era incorrecto.
- **Registro Mercantil:** Madrid, sección 8.ª, hoja M-830114, inscripción 1.ª (26-08-2024). Es el acto de constitución publicado en el BORME del 30-08-2024 (n.º de acto 378151), según datoscif.es e infonif.economia3.com. El tomo y el folio no figuran en esas fuentes y no se han inventado.

**Datos de la versión final (confirmados el 14-10-2026):**

| # | Dato | Valor usado |
| --- | --- | --- |
| V1 | Alojamiento | HighLevel, Inc. (Go High Level) · Dallas, Texas, Estados Unidos |
| V2 | Pixel de Meta | Sí |
| V3 | Google Analytics 4 | Sí |
| V4 | Microsoft Clarity | Sí |
| V5 | Destino del formulario | HighLevel, Inc. (CRM de Go High Level) · Estados Unidos |
| V6 | Asistente de voz con IA | HighLevel, Inc. (asistente de voz con IA de Go High Level) · Estados Unidos |
| V7 | Grabación de la llamada | Sí, dentro de Go High Level |
| V8 | Proveedor de email | HighLevel, Inc. (email de Go High Level) · Estados Unidos |
| V9 | Casilla de Meta (datos cifrados) | Se mantiene |
| V10 | Videollamada | Google Meet (Google Ireland Ltd., Irlanda) o Zoom (Zoom Communications, Inc., Estados Unidos) |
| V11 | Fecha de publicación | 15 de octubre de 2026 |

Verificaciones de los proveedores, según Jared:
- **HighLevel:** su acuerdo de tratamiento de datos declara la certificación en el Marco de Privacidad de Datos UE-EE. UU. e incorpora las cláusulas contractuales tipo de 2021; aloja en AWS y Google Cloud, sin especificar región.
- **Zoom:** su declaración de privacidad declara el cumplimiento del Marco de Privacidad de Datos y el uso de cláusulas contractuales tipo.

### Revisión recomendada por un abogado

Estos puntos están resueltos en las páginas con criterios prudentes y documentados, pero conviene que un abogado los valide antes o después de publicar:

1. **Delegado de protección de datos:** se ha quitado porque la política oficial no designa a ninguno. Confirmar con Rubén que no hay DPD.
2. **Base legal y rol de Meta** en el envío de datos cifrados (consentimiento; encargado o corresponsable).
3. **Plazo de conservación** de los leads que no contratan y de las grabaciones de las llamadas: se usa el criterio de la web oficial («mientras exista relación o hasta que solicite su supresión»). Un abogado puede preferir un plazo concreto.
4. **Grabación de la llamada:** la base legal (consentimiento de la casilla de la llamada) y el aviso de grabación al comienzo de la llamada.
5. **Tomo y folio** del Registro Mercantil: no figuran en las fuentes públicas consultadas.
6. **Transferencias a Estados Unidos:** HighLevel y Zoom están verificados (Marco de Privacidad de Datos y cláusulas contractuales tipo). Falta confirmar Cal.com.
7. **Cookies propias de Go High Level:** se añadirán tras el escaneo del sitio publicado.
8. **Textos de las casillas del formulario y del banner de cookies en móvil:** se publican tal como están.

## Diseño visual y animaciones

Dirección elegida: arquetipo **«Mouse-Reactive Gradient»** (adecuado para un SaaS B2B), adaptado a la guía de marca del brief: bloques sólidos azul / blanco, Montserrat + Roboto y los mismos tokens de color. No se ha añadido ni modificado ningún texto del copy.

**Efecto firma — la cabecera viva:** sobre el azul Trazabis hay una malla de puntos y focos de luz suaves; con ratón, el foco principal sigue al cursor con inercia (un solo bucle `requestAnimationFrame` que se detiene cuando la luz llega a su sitio o la cabecera sale de pantalla). En móvil y sin ratón, los focos derivan lentamente.

**Vídeo demo en la cabecera** (sustituye a la ilustración de la cola de validación): se muestra su primer fotograma como póster con un botón de reproducción propio. Tiene `preload="none"`, así que **no se descarga ningún byte del vídeo hasta pulsar «reproducir»**: antes solo se carga el póster (8 KB). Al reproducir aparecen los controles nativos y se registra `video_play`. Sin JavaScript se muestran directamente los controles nativos. Se sirve en WebM con copia MP4 de respaldo para Safari e iPhone antiguos.

**Efectos de apoyo:**

1. **Aparición al hacer scroll** de bloques y tarjetas, escalonada, con los iconos de línea dibujándose al entrar (`IntersectionObserver` con umbral 0,01 y red de seguridad a los 6 s).
2. **Halo bajo el cursor y elevación** en las tarjetas (solo en dispositivos con ratón).
3. **Botones con elevación, brillo diagonal y flecha** que avanza al pasar el ratón.
4. **Línea de progreso** que se rellena a lo largo de los seis pasos de «Cómo funciona».

Además: titulares con barra de acento, cifras con degradado de marca, apertura suave de las preguntas frecuentes (Chrome 131+), transición entre los pasos del formulario y marca de verificación que se dibuja en la página de gracias.

**Color:** el morado del logo (`#8127E3`) se usa solo como acento decorativo (brillos, degradados, líneas) y en texto grande con contraste comprobado; no sustituye a ningún token del brief. Si se prefiere la paleta estricta, basta con cambiar `--acento-logo`, `--lavanda` y `--violeta-texto` en `styles.css`.

**Robustez:**

- **Sin JavaScript** todo el contenido es visible: las animaciones dependen de la clase `.js`, que añade un script en línea en el `<head>`.
- **Movimiento reducido** (`prefers-reduced-motion`): se mantienen los fundidos y los cambios de color, que no son intrusivos. Se quitan los desplazamientos, los bucles infinitos (latido, deriva de luces, fichas flotantes, brillo de la barra de progreso) y el desplazamiento suave hacia el formulario, como pide el brief.
- **Sin librerías:** no se usan GSAP ni Lenis porque el brief prohíbe dependencias; todo es CSS y JS nativo. Se usa el desplazamiento nativo del navegador.
- **Accesibilidad:** se añade el enlace «Saltar al contenido», visible solo al recibir el foco.

## Decisiones tomadas y diferencias con el brief

Se ha respetado el copy literal del brief. Estas son las decisiones que no venían cerradas o que obligaban a elegir entre dos requisitos:

1. **Fuentes alojadas en el propio sitio.** El brief pide Montserrat y Roboto «de Google Fonts», pero también que, sin consentimiento, no haya ninguna petición a Google. Cargar las fuentes desde `fonts.googleapis.com` incumpliría lo segundo, así que se han descargado los archivos oficiales de Google Fonts (subconjunto latino, licencia OFL incluida en `assets/fonts/`) y se sirven desde el sitio con `font-display: swap`.
2. **GTM solo tras el consentimiento** (no se carga con el consentimiento denegado). Es la única forma de cumplir «sin consentimiento, ninguna petición a Google». Consecuencia: sin consentimiento no hay medición sin cookies ni modelado de conversiones de Google.
3. **Logo en el pie sobre placa blanca.** El logo aportado es bicolor (azul y morado), no monocromo; según la regla de la sección 3 no se le aplica filtro blanco y se coloca sobre fondo claro. El archivo se ha recortado al contorno del dibujo (sin alterarlo), reducido a 643 × 187 px y optimizado (8 KB). El área de respeto se calcula en CSS: la «t» mide el 46,26 % de la altura del archivo.
4. **Foto** reducida a 800 × 1199 px, sin filtros y sin metadatos.
5. **Botones «Ver si mi despacho encaja» en precios (`inversion`) y en la calculadora (`calculadora`).** La tabla de eventos exige las dos ubicaciones; se mantienen con la nueva sección de precios y la calculadora oficial.
6. **Archivos añadidos:** `assets/js/main.js`, `tests/prioridad.test.html`, `.nojekyll` y la constante `VIDEO_POSTER`.
7. **Titulares no incluidos en el copy:** «Preguntas frecuentes» visible en la sección 11 (el brief no daba titular) y «Para quién es y para quién no» solo para lectores de pantalla en la sección 8.
8. **Microtextos funcionales no incluidos en el brief:** mensajes de error, banner y panel de cookies (también su texto corto de móvil), etiqueta «Opcional» en las casillas 3 y 4, etiquetas «Email:» y «Teléfono:» del pie, lista de prefijos telefónicos y textos de la página 404.
9. **Estados de la cola de validación:** el verde y el ámbar derivados no alcanzan 4,5:1 con texto blanco (4,14:1 y 2,95:1), así que las etiquetas usan texto oscuro sobre fondo claro con un punto de color.
10. **Calculadora:** desde el 14-10-2026 es la oficial de trazabis.com (ver [Calculadora oficial](#calculadora-oficial)); la propia se retiró.
11. **Imágenes en WebP.** La web usa `ruben-bel.webp` y `logo-trazabis.webp`. Los archivos `ruben-bel.jpg` y `logo-trazabis.png` se conservan en las rutas que indica el brief como originales de referencia, pero ninguna página los referencia.
12. **Archivos añadidos en la capa visual:** `assets/js/efectos.js` y `.htaccess`. Las páginas de prueba cargan los scripts con `defer` y ejecutan las pruebas en `DOMContentLoaded`.

## Actualización del 14-10-2026 (feedback del cliente)

El feedback del cliente del 14-10-2026 sustituye al contenido comercial anterior. Se aplicó bloque a bloque (commits A–L):

- **A · Cabecera:** nota del botón con la reunión de onboarding y franja de confianza bajo la cabecera.
- **B y C · Capturar no basta y Cómo funciona:** el asiento es un borrador que aprueba una persona; el paso 6 pasa a «Prepara el asiento» y la conciliación ya no lleva submarca.
- **D · Implantación:** cinco pasos con garantía de devolución del setup.
- **E · Precios:** tarifa v9 (tramos por documentos de 5,90 € a 44,90 €, descuento de cartera de por vida, clientes que solo envían documentos, Conciliación bancaria) y programa Despacho Fundador con retirada automática.
- **F · Calculadora:** la oficial en iframe; la propia y sus pruebas se retiran.
- **G · Seguridad**, **H · Preguntas frecuentes** (diez) e **I · Formulario** (reunión de onboarding, a3ERP y «Ninguno (Excel o papel)», reserva directa).
- **J · Configuración** (email, teléfono, `CALC_ENDPOINT`, `FUNDADOR_HASTA`), **K · Banner de cookies en móvil** y **L · Documentación y caché** (`?v=20261014-1`).

**Contenido que el brief original prohibía y que ahora se muestra por indicación expresa del cliente:** el programa Despacho Fundador (con descuentos del 30 % y del 40 %) y la garantía de devolución del setup de la implantación.

**Decisiones pendientes del cliente (no aplicadas):**

| # | Decisión | Cómo queda |
| --- | --- | --- |
| D1 | ¿Solo despachos de más de 50 clientes o todos (desde 10)? | Antetítulo «Para asesorías y gestorías con más de 50 clientes» y «Es para ti si… más de 50 clientes» |
| D2 | ¿El asistente de IA que llama estará operativo el día del lanzamiento? | Se mantienen los textos del asistente de IA. (La calculadora, en cambio, promete «te escribimos en menos de un día laborable») |
| D3 | ¿Se usa el programa Despacho Fundador en la campaña y cuántas plazas quedan? | Visible hasta el 31-10 con retirada automática |
| D4 | ¿Cuánto dura de verdad la reunión? | Se usa «30 minutos»; hay que comprobar el evento `demo-trazabis` de cal.com |

## Comprobación final

### Verificación del 14-10-2026

Playwright (Chromium 141) sirviendo el sitio desde un subdirectorio (`/repo/`):

| Comprobación | Resultado |
| --- | --- |
| Términos de la lista roja del cliente en landing, scripts, páginas legales y esta documentación | ✅ Sin coincidencias, salvo usos válidos: «Incluye el diagnóstico de tu cartera cliente a cliente» (implantación), «contabilidad 100 % automática, sin revisión humana» dentro de «No es para ti si» (negado), y `plazo_inicio` / `id="inicio"` (no son planes). Las tres menciones a «diagnóstico» que quedaban fuera del alcance del feedback (página de gracias, aviso legal y tabla de proveedores de la política de privacidad) se alinearon después con la «reunión de onboarding» (ver la sección 9.3 de DOCUMENTACION.md) |
| Sin scroll horizontal a 375, 768, 1024, 1280 y 1440 px | ✅ |
| Implantación en cinco pasos | ✅ Una fila desde 1100 px; una columna con flechas verticales por debajo; sin filas incompletas |
| Franja de confianza | ✅ Una línea desde 900 px; 2 × 2 por debajo |
| Tablas de precios | ✅ Dentro de su caja en todos los anchos; la de cada cliente se apila en móvil con su etiqueta en cada celda |
| Calculadora oficial | ✅ El iframe crece solo (375 px: 2.923 px al cargar y 5.538 px con la oferta; 1440 px: 1.761 y 2.918 px), sin scroll interno; una solicitud real llega al webhook de prueba con `event_id`, `version: "calculadora"`, UTM y `fbclid`; `generate_lead` sin datos personales; `calculator_use` una vez |
| Sin consentimiento, sin terceros | ✅ 0 peticiones fuera del sitio, también desde el iframe de la calculadora |
| Consola | ✅ Sin errores. Un único aviso, intencionado, mientras `CALC_ENDPOINT` y `FORM_ENDPOINT` estén vacíos |
| Medición con `?debug=1` | ✅ `cta_click` en `hero`, `inversion`, `calculadora`, `sticky` y `reserva_directa` (`video` solo existe con `VIDEO_URL`); `faq_open` en la pregunta nueva; `generate_lead` del formulario y de la calculadora |
| Reserva directa | ✅ Abre una pestaña nueva y sigue visible tras la página de gracias |
| Programa contable | ✅ Siete opciones en el orden pedido; «Ninguno» muestra la pregunta 5; 16/16 pruebas de prioridad y UUID |
| Despacho Fundador | ✅ Con `?debug=1&fecha_prueba=2026-11-01`: 0 de 17 elementos visibles y `colspan` 1 y 2; hoy, 17 de 17; en un dominio que no es localhost y sin `debug=1`, `fecha_prueba` se ignora |
| Banner de cookies en móvil | ✅ 157 px en 375 × 667 (23,5 %); «Aceptar todas» y «Rechazar todas» de 159 × 44 px; el titular se lee; «Configurar» abre el panel |
| Sin JavaScript y movimiento reducido | ✅ Todo el contenido visible; ninguna animación infinita |
| axe-core 4.10 (WCAG 2.2 A/AA y buenas prácticas) a 375 y 1440 px | ✅ 0 infracciones en la landing y la política de privacidad, con y sin banner. `calculadora.html` abierta sola da 0 infracciones WCAG y 2–3 avisos de buenas prácticas (sin `<main>`, contenido fuera de regiones, orden de encabezados): son del archivo del cliente, que no se modifica |
| html-validate | Los mismos tipos de aviso que antes (roles ARIA redundantes en las tablas, que se mantienen a propósito para la versión apilada; tres estilos en línea; `tel-national`; `<progress>`), más uno nuevo: `aria-label` en la lista de la franja de confianza, válido según WAI-ARIA 1.2 pero no admitido por la regla de html-validate |

### Verificación del 12-10-2026 (versión anterior)

Verificación automatizada con Playwright (Chromium 141) sirviendo el sitio desde un subdirectorio (`/repo/`) y desde la raíz: **86/86 comprobaciones correctas**, más auditoría de accesibilidad con axe-core 4.10 (WCAG 2.2 A/AA y buenas prácticas): **0 infracciones** en todas las páginas a 390 y 1440 px, con banner, sin banner, con el formulario en el paso 2 mostrando errores y con el panel de cookies abierto. El verificador del skill de diseño (`verify_project.py`) da 0 errores; su único aviso es la ausencia de `lib/` (GSAP), intencionada. Sobre el vídeo, axe deja los subtítulos como «revisión manual»: no puede saber si el audio tiene locución (ver pendientes).

Comprobado también tras la capa visual: con movimiento reducido no queda ninguna animación infinita, todo el contenido aparece y el desplazamiento no es suave; sin JavaScript todo el contenido es visible; los textos de la cabecera mantienen el contraste AA incluso con el foco de luz justo debajo (mínimo medido sobre el píxel de fondo más claro: 4,60:1 en el titular, que es texto grande y exige 3:1, y 5,29:1 o más en el resto).

| # | Comprobación | Resultado |
| --- | --- | --- |
| 1 | Términos prohibidos del brief (punto 9.1) y voseo | ✅ En los textos, sin coincidencias salvo excepciones. La primera es el marcador literal de la política de privacidad «[PENDIENTE: país y …]», que el brief incluye en la sección 8.2 y que se refiere a las salvaguardas de las transferencias internacionales, no a un compromiso comercial. La segunda es «Fundador» en el pie de foto de Rubén Bel Pauner («CEO y Fundador de Trazabis»), por indicación expresa del cliente. Desde el 14-10-2026, además, el cliente pide mostrar el programa Despacho Fundador y la garantía de devolución del setup. «100 %» solo aparece en «No es para ti si», negado. ⚠️ El vídeo demo muestra en pantalla cifras de ese tipo (ver pendientes). |
| 2 | Holded, a3ERP y Sage | ✅ Holded y a3ERP solo como «en cola de integración, sin fecha», opciones del formulario o marcas citadas en el aviso legal. Sin logos de terceros. |
| 3 | Calculadora | Sustituida el 14-10-2026 por la oficial (ver arriba). |
| 4 | Pregunta condicional y prioridad | ✅ `acepta_sin_conector` solo aparece si el programa no es Odoo; 12/12 pruebas de prioridad y UUID (16/16 desde el 14-10-2026). |
| 5 | Casillas | ✅ Ninguna premarcada; sin las dos obligatorias no se envía; el aviso de IA está junto al botón. |
| 6 | Página de gracias | ✅ Sustituye al formulario y persiste al recargar. Sin `TELEFONO_ASISTENTE` no hay número ni botón; con él, «desde el …» y descarga `trazabis-asistente.vcf`. |
| 7 | Vídeo | ✅ Con `VIDEO_URL` vacía, `#video` no existe en el DOM. |
| 8 | dataLayer sin datos personales | ✅ Probado con un envío completo: ni nombre, ni email, ni teléfono, ni despacho, ni texto libre. |
| 9 | Sin consentimiento, sin terceros | ✅ Con `GTM_ID` configurado: 0 peticiones a Google, Meta o Microsoft antes de aceptar y tras «Rechazar todas»; GTM se carga solo al aceptar. Los tres botones del banner miden lo mismo en escritorio (282 × 48 px); en móvil, desde el 14-10-2026, ver arriba. |
| 10 | Contraste, foco y teclado | ✅ Contraste AA (tabla abajo, axe y medición sobre el fondo animado); 33 paradas de tabulación (la primera, «Saltar al contenido»), todas con contorno visible; acordeón con `<details>`. |
| 11 | Subdirectorio | ✅ Probado en `/repo/despachos/`; la raíz redirige conservando `utm_*` y `fbclid`. |
| 12 | Lighthouse móvil | Ver abajo. |
| 13 | README con pendientes agrupados | ✅ Este documento. |

También verificado: sin scroll horizontal a 360, 390, 768, 1024 y 1440 px; sin errores de consola; un solo `h1`; `<title>` y meta description exactos; imágenes con `width`/`height`; barra fija visible al inicio y oculta con el formulario a la vista; error de envío con datos conservados y reintento con el mismo `event_id`; campo trampa; caducidad del consentimiento a los 12 meses.

## Lighthouse

Lighthouse 12.2.1, móvil con limitación simulada, servido en local con `python3 -m http.server` (sin compresión ni cabeceras de caché).

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
| --- | --- | --- | --- | --- |
| `/despachos/` (14-10-2026, con la calculadora oficial) | 95–96 | 100 | 100 | 63* |
| `/legal/politica-privacidad.html` | 99 | 100 | 100 | 100 |

\* El SEO baja únicamente por el `noindex` intencionado de la landing de pauta.

Métricas del 14-10-2026 (dos ejecuciones, rendimiento 95 y 96): FCP 1,4 s · LCP 2,8 s · TBT 0–70 ms · CLS 0 · 276 KB; la calculadora no pesa en la carga inicial porque su iframe es diferido (`loading="lazy"`). Medición anterior, con el vídeo demo en la cabecera (dos ejecuciones, rendimiento 96 en ambas): FCP 1,4 s · LCP 2,7–2,8 s · TBT 0–30 ms · CLS 0 · peso total de la página 270 KB, porque el vídeo no se descarga hasta pulsar «reproducir». Antes de la capa visual el rendimiento era 98, y con la ilustración, 97. Las sugerencias restantes (compresión de texto y caché) dependen del servidor: en Hostinger las resuelve el `.htaccess`; conviene repetir la medición una vez publicado.

## Contraste de color

Ratios calculados con la fórmula de WCAG 2.x (AA exige 4,5:1 en texto normal y 3:1 en texto grande y elementos de interfaz).

| Texto | Fondo | Ratio |
| --- | --- | --- |
| `#1E2852` azul Trazabis | `#FFFFFF` | 14,18:1 |
| `#333333` gris antracita | `#FFFFFF` | 12,63:1 |
| `#5A6072` texto suave | `#FFFFFF` / `#F5F6F8` / `#EEF0F6` | 6,27 / 5,80 / 5,50:1 |
| `#FFFFFF` | `#2A376D` azul hover | 11,26:1 |
| `#E1E4EF` texto sobre azul | `#1E2852` | 11,18:1 |
| `#C5CAE0` texto secundario sobre azul | `#1E2852` | 8,71:1 |
| `#E8E8E8` | `#333333` | 10,31:1 |
| `#B42318` error | `#FFFFFF` | 6,57:1 |
| `#1A1D29` | `#FFE58A` marcador pendiente | 13,44:1 |
| `#1A1D29` | `#E3F3EA` / `#FBEBC4` etiquetas de estado | 14,60 / 14,21:1 |
| `#7A8092` borde de campos | `#FFFFFF` | 3,94:1 |
| `#CDB8FF` lavanda (texto grande, degradados claros) | `#1E2852` | 8,03:1 |
| `#E5DBFF` (color de respaldo del degradado claro) | `#1E2852` | 10,74:1 |
| `#5B34C9` violeta de texto (final de los degradados) | `#FFFFFF` / `#F5F6F8` | 7,56 / 6,99:1 |
| `#3A3A9E` (tono intermedio de los degradados) | `#FFFFFF` | 9,22:1 |
| `#C5CAE0` antetítulo | `#2C3560` (fondo de la píldora) | 7,23:1 |

No usados como color de texto sobre blanco por no llegar a 4,5:1: `#1E8E5A` (4,14:1) y `#C98A0B` (2,95:1).
