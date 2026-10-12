# Trazabis · Landing para despachos

Landing de **Trazabis** para despachos de asesoría fiscal-contable que reciben tráfico de Meta Ads. Su único objetivo es que un despacho cualificado rellene el formulario; después, un asistente de inteligencia artificial (setter de IA) le llama para confirmar su interés y agendar un diagnóstico de cartera gratuito.

Sitio estático: HTML, CSS y JavaScript sin frameworks, sin paso de compilación y sin dependencias externas. Funciona en GitHub Pages, Netlify, Vercel o cualquier hosting estático, también publicado en un subdirectorio (todas las rutas internas son relativas).

> **Antes de publicar:** la página contiene marcadores `[PENDIENTE: …]` resaltados en amarillo a propósito. La lista completa, agrupada por responsable, está en [Pendientes](#pendientes-por-responsable).

---

## Índice

1. [Estructura](#estructura)
2. [Probar en local](#probar-en-local)
3. [Configuración (`config.js`)](#configuración-configjs)
4. [Despliegue](#despliegue)
5. [Formulario](#formulario)
6. [Medición: dataLayer, GTM y consentimiento](#medición-datalayer-gtm-y-consentimiento)
7. [Pendientes por responsable](#pendientes-por-responsable)
8. [Diseño visual y animaciones](#diseño-visual-y-animaciones)
9. [Decisiones tomadas y diferencias con el brief](#decisiones-tomadas-y-diferencias-con-el-brief)
10. [Comprobación final](#comprobación-final)
11. [Lighthouse](#lighthouse)
12. [Contraste de color](#contraste-de-color)

---

## Estructura

```
/index.html                       Redirección a despachos/ (conserva utm_* y fbclid)
/despachos/index.html             Landing
/legal/aviso-legal.html
/legal/politica-privacidad.html
/legal/politica-cookies.html
/assets/css/styles.css            Estilos compartidos y tokens de marca
/assets/js/config.js              Constantes configurables
/assets/js/datalayer.js           Helper de eventos (filtra datos personales)
/assets/js/consent.js             Banner, panel y modo de consentimiento; carga de GTM
/assets/js/main.js                Pie, botones CTA, barra fija, FAQ y sección de vídeo
/assets/js/calculadora.js
/assets/js/formulario.js
/assets/js/efectos.js             Capa visual: aparición al scroll, luz de la cabecera, halos, deslizador
/assets/fonts/                    Montserrat y Roboto (Google Fonts, licencia OFL) alojadas aquí
/assets/img/logo-trazabis.webp    Logo que usa la web (WebP sin pérdida, 7 KB)
/assets/img/logo-trazabis.png     Logo aportado (recortado y optimizado; original de referencia)
/assets/img/ruben-bel.webp        Foto que usa la web (WebP, 17 KB, sin filtros)
/assets/img/ruben-bel.jpg         Foto aportada (reducida a 800 px; original de referencia)
/tests/calculadora.test.html      Pruebas unitarias de la calculadora
/tests/prioridad.test.html        Pruebas del cálculo de prioridad y del event_id
/404.html                         Página de error autónoma
/.htaccess                        Caché, compresión y tipos MIME para Hostinger / Apache / LiteSpeed
/.nojekyll                        Evita el procesado de Jekyll en GitHub Pages
```

Orden de carga de los scripts (todos con `defer` y patrón IIFE, sin módulos): `config.js` → `datalayer.js` → `consent.js` → `main.js` → `calculadora.js` → `formulario.js` → `efectos.js`. Cada inicialización de `main.js` y `efectos.js` va envuelta en `safe()`: si una falla, el resto sigue funcionando.

## Probar en local

```bash
python3 -m http.server 8000
```

- Landing: <http://localhost:8000/despachos/>
- Pruebas: <http://localhost:8000/tests/calculadora.test.html> y <http://localhost:8000/tests/prioridad.test.html>

En local (o con `?debug=1`, o mientras `GTM_ID` esté vacío) el sitio está en **modo de desarrollo**: cada `dataLayer.push` se imprime en la consola y, si `FORM_ENDPOINT` está vacío, el formulario no envía nada y muestra los datos con `console.info`.

## Configuración (`config.js`)

| Constante | Para qué sirve | Si está vacía |
| --- | --- | --- |
| `GTM_ID` | Contenedor de Google Tag Manager (`GTM-XXXXXXX`) | GTM no se carga nunca |
| `FORM_ENDPOINT` | URL (webhook del CRM o del setter de IA) que recibe el formulario en JSON | Modo de desarrollo: no se envía nada |
| `VIDEO_URL` | Archivo de vídeo (MP4/WebM) de «Cómo funciona Trazabis, en 90 segundos» | La sección de vídeo no existe en el DOM |
| `VIDEO_POSTER` | Imagen de póster del vídeo (constante añadida) | Si hay vídeo, se muestra `[PENDIENTE]` bajo él |
| `TELEFONO_ASISTENTE` | Número desde el que llama el asistente de IA | La página de gracias no muestra número ni botón `.vcf` |
| `EMAIL_CONTACTO` | Email del pie y del aviso legal | Se muestra `[PENDIENTE]` |
| `TELEFONO_CONTACTO` | Teléfono del pie y del aviso legal | Se muestra `[PENDIENTE]` |

- **Nunca** pongas claves de API ni secretos en `config.js`: es un archivo público.
- `VIDEO_URL` debe ser un archivo de vídeo directo. Un enlace de YouTube o Vimeo no funcionaría con `<video>` y, además, cargaría terceros sin consentimiento.
- `FORM_ENDPOINT` debe aceptar peticiones CORS desde el dominio de la landing: el navegador envía antes un `OPTIONS` (preflight) porque el cuerpo es `application/json`. El endpoint debe responder con `Access-Control-Allow-Origin` (el dominio de la landing), `Access-Control-Allow-Methods: POST` y `Access-Control-Allow-Headers: Content-Type`.

## Despliegue

**GitHub Pages:** *Settings → Pages → Build and deployment → Deploy from a branch*, rama `main`, carpeta `/ (root)`. La URL será `https://<usuario>.github.io/<repositorio>/`, que redirige a `despachos/`. `404.html` se sirve automáticamente.

**Netlify:** conectar el repositorio sin comando de compilación y con `.` como directorio de publicación (o arrastrar la carpeta).

**Vercel:** proyecto «Other», sin comando de compilación, directorio de salida `.`.

**Hostinger (o cualquier Apache / LiteSpeed):** subir todo el contenido de la carpeta, **incluido `.htaccess`** (es un archivo oculto: activa «mostrar archivos ocultos» en el cliente FTP o en el Administrador de archivos). El `.htaccess` hace que HTML, CSS y JS se revaliden en cada visita, que imágenes y fuentes se guarden un mes, comprime el texto y fija los tipos MIME. En un VPS con Nginx el `.htaccess` no se aplica.

**Cualquier hosting estático:** subir todos los archivos tal cual.

**En cada despliegue que cambie CSS o JS, sube el número de versión** que llevan los enlaces a `styles.css` y a los scripts (`?v=20261012`) en `despachos/index.html` y en las tres páginas legales, usando la fecha del día (`?v=AAAAMMDD`). Así ningún navegador ni CDN sirve una versión antigua.

Notas:

- La landing vive en `/despachos/` (con barra final). Si el hosting sirve `/despachos` sin barra, un script en línea añade la barra para que las rutas relativas funcionen.
- `/index.html` redirige a `despachos/` **conservando** `utm_*` y `fbclid`, por si un anuncio apunta a la raíz.
- `404.html` lleva estilos y logo en línea porque los hostings la sirven en cualquier ruta; su enlace localiza la raíz del sitio aunque esté en un subdirectorio.
- **Indexación:** la landing lleva `<meta name="robots" content="noindex, follow">` (landing de pauta). Para indexarla, cambia ese valor a `index, follow` en `despachos/index.html` (y en `/index.html`). Las páginas legales no llevan `noindex`.
- Publica con HTTPS y comprueba en la pestaña Red que el hosting comprime los archivos de texto (cabecera `content-encoding`) y envía cabeceras de caché para `assets/`.

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
| `programa_contable` | `odoo` · `holded` · `a2erp` · `a3` · `sage` · `otro` · `no_lo_se` |
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
| `cta_click` | Clic en cualquier «Ver si mi despacho encaja» | `cta_location`: `hero` · `video` · `inversion` · `calculadora` · `sticky` |
| `video_play` | Primera reproducción del vídeo | — |
| `calculator_use` | Primer cambio confirmado en la calculadora (una vez por visita) | `clientes_rango` (mismos *slugs* que `clientes_cartera`, o `no_valido`), `plan` (`inicio` · `pro` · `negocio`), `quien_paga` (`despacho` · `clientes`) |
| `form_start` | Primera interacción con el formulario (una vez por visita) | — |
| `form_step_complete` | Paso 1 válido (una vez por visita) | `step: 1`, los 7 campos del paso 1, `prioridad` |
| `form_error` | Al intentar avanzar o enviar con errores: **un evento por campo con error** | `step` (1 o 2), `field` (nombre del campo) |
| `generate_lead` | Envío correcto | `event_id`, `version`, los 7 campos del paso 1, `prioridad`, `acepta_comunicaciones`, `acepta_medicion_publicitaria` (booleanos), `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` |
| `faq_open` | Se abre una pregunta | `faq_question` (texto de la pregunta) |
| `consent_update` | El usuario guarda su elección | `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` (`granted` · `denied`) |

### Consentimiento (`consent.js`)

- Banner propio con «Aceptar todas», «Rechazar todas» y «Configurar», los tres con el mismo tamaño, color y peso.
- Panel con tres categorías: **Técnicas** (siempre activas), **Analíticas** (Google Analytics 4 y Microsoft Clarity → `analytics_storage`) y **Publicitarias** (Pixel de Meta → `ad_storage`, `ad_user_data`, `ad_personalization`).
- La elección se guarda en `localStorage` (`trazabis_consent`, con fecha) dentro de `try/catch` y se vuelve a preguntar a los 12 meses.
- «Configurar cookies», en el pie de todas las páginas, reabre el panel.
- Si se retira un consentimiento, se intenta borrar las cookies propias de esa categoría (`_ga*`, `_gid`, `_clck`, `_clsk`, `_fbp`, `_fbc`, `_gcl_*`).

### Configuración necesaria en GTM (Jared)

1. Variables de capa de datos para cada parámetro de la tabla de eventos y activadores de evento personalizado para cada `event`.
2. Etiquetas de GA4: respetan `analytics_storage` por sí mismas (consentimiento integrado).
3. Etiquetas de Microsoft Clarity y del Pixel de Meta: en *Configuración avanzada → Configuración de consentimiento*, exigir consentimiento adicional: Clarity → `analytics_storage`; Pixel de Meta → `ad_storage`.
4. No añadas el fragmento `<noscript>` de GTM: cargaría Google sin consentimiento.
5. **API de conversiones de Meta:** no se implementa en el front-end. La envía el sistema que recibe `FORM_ENDPOINT`, con el **mismo `event_id`** que el evento del navegador, para que Meta deduplique (el Pixel debe enviar el evento `Lead` con `eventID` = `event_id`, y la API, `Lead` con `event_id` igual). Los datos de contacto cifrados (SHA-256) solo deberían enviarse si `acepta_medicion_publicitaria` es `true` *(pendiente de decisión del abogado)*. El parámetro `fbc` puede construirse en el servidor a partir de `fbclid` y de la fecha de llegada; consulta la documentación vigente de Meta antes de implementarlo.

## Pendientes por responsable

Todos los marcadores se ven en la página resaltados en amarillo (clase `.pendiente`).

### Cliente (Rubén)

- [ ] Email de contacto → `EMAIL_CONTACTO` (pie y aviso legal).
- [ ] Teléfono de contacto → `TELEFONO_CONTACTO` (pie y aviso legal).
- [ ] Datos registrales: provincia del Registro Mercantil, tomo, folio y hoja (aviso legal).
- [ ] Cargo de Rubén (pie de la foto).
- [ ] Precio del módulo de conciliación bancaria (TrazaControl).
- [ ] Periodicidad de los documentos por plan (nota bajo la tabla de planes).
- [ ] URL del vídeo → `VIDEO_URL` y su póster → `VIDEO_POSTER`.
- [ ] Colores oficiales de marca (HEX) para sustituir los tokens de `styles.css`. **Ojo:** los colores medidos en el logo aportado son azul `#14376B` y morado `#8127E3`; el azul del brief (`#1E2852`) no coincide con el del logo.
- [ ] (Opcional) Versión monocroma del logo en blanco (SVG) para el pie; mientras tanto, el logo bicolor va sobre una placa blanca.
- [ ] (Opcional) Favicon.
- [ ] Email para cuestiones de privacidad (política de privacidad, puntos 1 y 8).

### Abogado

- [ ] Bases legales de la tabla de finalidades (incluida la de medición con Meta: «confirmar base legal»).
- [ ] Casilla de medición publicitaria con Meta: mantener o eliminar. Si se elimina, quitarla del formulario, de la política de privacidad y del JSON.
- [ ] Textos de las cuatro casillas de consentimiento (marcados en la página como pendientes de validación).
- [ ] Textos del banner y del panel de cookies (redactados para esta landing, no venían en el brief).
- [ ] Plazo de conservación de los datos de solicitud.
- [ ] Grabación o transcripción de la llamada del asistente de IA (si se hace, finalidad y plazo).
- [ ] Meta Platforms Ireland: encargado o corresponsable.
- [ ] Filas de Google Ireland y Microsoft Ireland marcadas `[VERIFICAR]`.
- [ ] Transferencias internacionales: mecanismo de cada proveedor (Marco de Privacidad de Datos UE-EE. UU. o cláusulas contractuales tipo) y su vigencia.
- [ ] Delegado de protección de datos (datos o eliminar la línea).
- [ ] Fechas de «Última actualización» de las tres páginas legales.
- [ ] Duraciones de cookies marcadas `[VERIFICAR]` (con el escaneo de Jared).

### Jared

- [ ] `GTM_ID`, `FORM_ENDPOINT` (con CORS habilitado) y `TELEFONO_ASISTENTE` en `config.js`.
- [ ] Proveedores de la política de privacidad: alojamiento (con país y salvaguardas), CRM o sistema que recibe el formulario, setter de IA de voz, calendario y email.
- [ ] Configuración de GTM (consentimiento de cada etiqueta, Pixel con `eventID`) y API de conversiones en el servidor.
- [ ] Escaneo de cookies tras publicar y eliminación de las filas de herramientas que no se instalen.
- [ ] Despliegue (HTTPS, compresión y caché en el hosting).

## Diseño visual y animaciones

Dirección elegida: arquetipo **«Mouse-Reactive Gradient»** (adecuado para un SaaS B2B), adaptado a la guía de marca del brief: bloques sólidos azul / blanco, Montserrat + Roboto y los mismos tokens de color. No se ha añadido ni modificado ningún texto del copy.

**Efecto firma — la cabecera viva:** sobre el azul Trazabis hay una malla de puntos y focos de luz suaves; con ratón, el foco principal sigue al cursor con inercia (un solo bucle `requestAnimationFrame` que se detiene cuando la luz llega a su sitio o la cabecera sale de pantalla). En móvil y sin ratón, los focos derivan lentamente. La cola de validación se anima al cargar: entra la tarjeta, las tres filas, aparecen las etiquetas «Validado» / «Revisar», un barrido recorre los documentos y la fila «Revisar» late suavemente.

**Efectos de apoyo:**

1. **Aparición al hacer scroll** de bloques y tarjetas, escalonada, con los iconos de línea dibujándose al entrar (`IntersectionObserver` con umbral 0,01 y red de seguridad a los 6 s).
2. **Halo bajo el cursor y elevación** en las tarjetas (solo en dispositivos con ratón).
3. **Botones con elevación, brillo diagonal y flecha** que avanza al pasar el ratón.
4. **Línea de progreso** que se rellena a lo largo de los seis pasos de «Cómo funciona».

Además: titulares con barra de acento, cifras con degradado de marca, deslizador de la calculadora con relleno, pequeño salto del total al cambiar, apertura suave de las preguntas frecuentes (Chrome 131+), transición entre los pasos del formulario y marca de verificación que se dibuja en la página de gracias.

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
5. **Botón adicional «Ver si mi despacho encaja» en la sección de inversión** (bajo la nota de integración). La tabla de eventos exige `cta_location: inversion` además de `calculadora`, y el copy solo tenía el botón de la calculadora.
6. **Archivos añadidos:** `assets/js/main.js`, `tests/prioridad.test.html`, `.nojekyll` y la constante `VIDEO_POSTER`.
7. **Titulares no incluidos en el copy:** «Preguntas frecuentes» visible en la sección 11 (el brief no daba titular) y «Para quién es y para quién no» solo para lectores de pantalla en la sección 8.
8. **Microtextos funcionales no incluidos en el brief:** mensajes de error, banner y panel de cookies, etiqueta «Opcional» en las casillas 3 y 4, «Importes sin IVA.» y el precio del año 1 bajo cada plan en la calculadora, etiquetas «Email:» y «Teléfono:» del pie, lista de prefijos telefónicos y textos de la página 404.
9. **Estados de la cola de validación:** el verde y el ámbar derivados no alcanzan 4,5:1 con texto blanco (4,14:1 y 2,95:1), así que las etiquetas usan texto oscuro sobre fondo claro con un punto de color.
10. **Calculadora:** empieza en 100 clientes · Inicio · asumido por el despacho (el caso de prueba del brief). El número admite cualquier entero; el deslizador va de 51 a 300.
11. **Imágenes en WebP.** La web usa `ruben-bel.webp` y `logo-trazabis.webp`. Los archivos `ruben-bel.jpg` y `logo-trazabis.png` se conservan en las rutas que indica el brief como originales de referencia, pero ninguna página los referencia.
12. **Archivos añadidos en la capa visual:** `assets/js/efectos.js` y `.htaccess`. Las páginas de prueba cargan los scripts con `defer` y ejecutan las pruebas en `DOMContentLoaded`.

## Comprobación final

Verificación automatizada con Playwright (Chromium 141) sirviendo el sitio desde un subdirectorio (`/repo/`) y desde la raíz: **86/86 comprobaciones correctas**, más auditoría de accesibilidad con axe-core 4.10 (WCAG 2.2 A/AA y buenas prácticas): **0 infracciones** en todas las páginas a 390 y 1440 px, con banner, sin banner, con el formulario en el paso 2 mostrando errores y con el panel de cookies abierto. El verificador del skill de diseño (`verify_project.py`) da 0 errores; su único aviso es la ausencia de `lib/` (GSAP), intencionada.

Comprobado también tras la capa visual: con movimiento reducido no queda ninguna animación infinita, todo el contenido aparece y el desplazamiento no es suave; sin JavaScript todo el contenido es visible; los textos de la cabecera mantienen el contraste AA incluso con el foco de luz justo debajo (mínimo medido sobre el píxel de fondo más claro: 4,60:1 en el titular, que es texto grande y exige 3:1, y 5,29:1 o más en el resto).

| # | Comprobación | Resultado |
| --- | --- | --- |
| 1 | Términos prohibidos del brief (punto 9.1) y voseo | ✅ Sin coincidencias, con una excepción: el marcador literal de la política de privacidad «[PENDIENTE: país y …]», que el brief incluye en la sección 8.2 y que se refiere a las salvaguardas de las transferencias internacionales, no a un compromiso comercial. «100 %» solo aparece en «No es para ti si», negado. |
| 2 | Holded, a2ERP, A3 y Sage | ✅ Solo como «en despliegue», «otros programas», opciones del formulario o marcas citadas en el aviso legal. Sin logos de terceros. |
| 3 | Calculadora | ✅ 51 → 3.000 €; 100 → 3.000 €; 101 → 4.000 €; 300 → 7.000 €; 100 + Inicio + asumido → 20.700 € (3.000 + 17.700). Fuera de 51–300, mensaje de diagnóstico. 31/31 pruebas unitarias. |
| 4 | Pregunta condicional y prioridad | ✅ `acepta_sin_conector` solo aparece si el programa no es Odoo; 12/12 pruebas de prioridad y UUID. |
| 5 | Casillas | ✅ Ninguna premarcada; sin las dos obligatorias no se envía; el aviso de IA está junto al botón. |
| 6 | Página de gracias | ✅ Sustituye al formulario y persiste al recargar. Sin `TELEFONO_ASISTENTE` no hay número ni botón; con él, «desde el …» y descarga `trazabis-asistente.vcf`. |
| 7 | Vídeo | ✅ Con `VIDEO_URL` vacía, `#video` no existe en el DOM. |
| 8 | dataLayer sin datos personales | ✅ Probado con un envío completo: ni nombre, ni email, ni teléfono, ni despacho, ni texto libre. |
| 9 | Sin consentimiento, sin terceros | ✅ Con `GTM_ID` configurado: 0 peticiones a Google, Meta o Microsoft antes de aceptar y tras «Rechazar todas»; GTM se carga solo al aceptar. Los tres botones del banner miden lo mismo (324 × 48 px en móvil, 282 × 48 px en escritorio). |
| 10 | Contraste, foco y teclado | ✅ Contraste AA (tabla abajo, axe y medición sobre el fondo animado); 33 paradas de tabulación (la primera, «Saltar al contenido»), todas con contorno visible; acordeón con `<details>`. |
| 11 | Subdirectorio | ✅ Probado en `/repo/despachos/`; la raíz redirige conservando `utm_*` y `fbclid`. |
| 12 | Lighthouse móvil | Ver abajo. |
| 13 | README con pendientes agrupados | ✅ Este documento. |

También verificado: sin scroll horizontal a 360, 390, 768, 1024 y 1440 px; sin errores de consola; un solo `h1`; `<title>` y meta description exactos; imágenes con `width`/`height`; barra fija visible al inicio y oculta con el formulario a la vista; error de envío con datos conservados y reintento con el mismo `event_id`; campo trampa; caducidad del consentimiento a los 12 meses.

## Lighthouse

Lighthouse 12.2.1, móvil con limitación simulada, servido en local con `python3 -m http.server` (sin compresión ni cabeceras de caché).

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
| --- | --- | --- | --- | --- |
| `/despachos/` | 97 | 100 | 100 | 63* |
| `/legal/politica-privacidad.html` | 99 | 100 | 100 | 100 |

\* El SEO baja únicamente por el `noindex` intencionado de la landing de pauta.

Métricas de la landing con la capa visual (dos ejecuciones, rendimiento 97 en ambas): FCP 1,4 s · LCP 2,4–2,6 s · TBT 0–10 ms · CLS 0. Antes de la capa visual el rendimiento era 98. Las sugerencias restantes (compresión de texto y caché) dependen del servidor: en Hostinger las resuelve el `.htaccess`; conviene repetir la medición una vez publicado.

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
