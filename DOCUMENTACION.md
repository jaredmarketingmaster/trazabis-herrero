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
| **Qué pasa después** | Un asistente de inteligencia artificial (setter de IA) llama al lead para confirmar su interés y agendar un diagnóstico de cartera gratuito |
| **Tecnología** | Sitio estático: HTML, CSS y JavaScript sin frameworks ni dependencias |

La página **informa, filtra y califica**: explica el producto y los precios, muestra con claridad para quién no es, y recoge respuestas que permiten priorizar cada lead.

### Mapa del sitio

```
/                                  Redirige a /despachos/ (conserva utm_* y fbclid)
/despachos/                        Landing (la única página de captación)
/legal/aviso-legal.html            Aviso legal
/legal/politica-privacidad.html    Política de privacidad
/legal/politica-cookies.html       Política de cookies
/404.html                          Página de error
/tests/*.test.html                 Pruebas (no forman parte de la experiencia del visitante)
```

La landing no tiene menú ni enlaces de salida; los únicos enlaces externos a la propia landing son los del pie legal.

---

## 2. Contenido de la landing (`/despachos/`)

Las secciones aparecen en este orden. Todo el texto es el copy literal aprobado; los datos que faltan se muestran como marcadores `[PENDIENTE: …]` resaltados en amarillo.

| # | Sección | Fondo | Contenido |
| --- | --- | --- | --- |
| — | Barra superior | Blanco | Solo el logo, que enlaza al inicio de la página |
| 1 | Cabecera | Azul | Antetítulo, titular «Tus agentes preparan. Tu equipo aprueba.», subtítulo, botón «Ver si mi despacho encaja» y una ilustración animada de una cola de validación (dos documentos «Validado» y uno «Revisar») |
| 2 | El problema | Blanco | «¿Te suena?» con cuatro tarjetas: canales dispersos, picos del cierre trimestral, rotación de personal junior e intentos fallidos con OCR o Excel |
| 3 | Capturar no basta | Gris claro | Por qué un OCR no resuelve el cuello de botella y comparativa «Solo captura» frente a «Con Trazabis» |
| 4 | Cómo funciona | Blanco | Seis pasos (Recibe, Lee y clasifica, Prepara, Valida, Concilia, Contabiliza), dos destacados (marca blanca y panel único) y el lema «Tus agentes preparan. Tú apruebas.» |
| 5 | Vídeo | Azul | «Cómo funciona Trazabis, en 90 segundos». **Solo existe si se configura `VIDEO_URL`**; si no, la sección no aparece |
| 6 | Implantación | Blanco | Tres fases (Diagnóstico → Configuración → Activación), qué aporta el despacho y qué hacen sus clientes |
| 7 | Inversión | Gris claro | Precios públicos sin IVA: 0 € al mes para el despacho, tabla de onboarding por tamaño de cartera, planes de la cartera con el descuento del primer año, módulo TrazaControl, nota de integración y calculadora |
| 8 | Para quién es | Blanco | Dos columnas con el mismo peso visual: «Es para ti si» y «No es para ti si» |
| 9 | Seguridad | Azul | Cinco puntos sobre servidores en la UE, doble factor, retención, exportación y contrato de encargo |
| 10 | Quiénes somos | Gris antracita | «Producto propio, en producción», texto sobre la empresa y foto de Rubén Bel |
| 11 | Preguntas frecuentes | Blanco | Nueve preguntas en acordeón |
| 12 | Formulario | Gris claro | «¿Vemos si tu despacho encaja?» y el formulario en dos pasos |
| — | Pie | Azul | Logo, datos de la empresa, email y teléfono, enlaces legales, «Configurar cookies» y © con el año actual |

### Precios que muestra la página (sin IVA)

**Onboarding** (pago único según el tamaño de la cartera):

| Clientes | 51–100 | 101–150 | 151–200 | 201–250 | 251–300 | Más de 300 |
| --- | --- | --- | --- | --- | --- | --- |
| Precio | 3.000 € | 4.000 € | 5.000 € | 6.000 € | 7.000 € | Se ve en el diagnóstico |

**Planes de la cartera** (los asume el despacho o los repercute a cada cliente):

| Plan | Documentos | Precio de lista | Año 1 (-50 %) |
| --- | --- | --- | --- |
| Inicio | 100 | 29,50 €/mes | 14,75 €/mes |
| Pro | 300 | 59 €/mes | 29,50 €/mes |
| Negocio | 500 | 79 €/mes | 39,50 €/mes |
| Personalizado | Más de 500 | desde 99 €/mes | desde 49,50 €/mes |

Desde el segundo año: -35 % con pago mensual o -45 % con pago anual sobre el precio de lista.

---

## 3. Funcionamiento: recorrido de un visitante

```
Anuncio de Meta ──► /despachos/?utm_…&fbclid=…
                       │
                       ├─ Se guardan utm_* y fbclid (sessionStorage)
                       ├─ Aparece el banner de cookies
                       │
                       ▼
               Lee la página · usa la calculadora
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
     Página de gracias ──► el asistente de IA llama para agendar el diagnóstico
```

### 3.1 Llegada

1. Si el anuncio apunta a la raíz (`/`), la página redirige a `/despachos/` **sin perder** los parámetros de campaña.
2. Al cargar la landing, `formulario.js` lee `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` y `fbclid` de la URL y los guarda en `sessionStorage` para enviarlos con el formulario.
3. Aparece el banner de cookies (salvo que el visitante ya haya elegido en los últimos 12 meses).

### 3.2 Consentimiento de cookies (`consent.js`)

- Por defecto todo está **denegado**: no se hace ninguna petición a Google, Meta ni Microsoft.
- El banner ofrece «Aceptar todas», «Rechazar todas» y «Configurar», con el mismo tamaño y peso visual.
- El panel de configuración tiene tres categorías: **Técnicas** (siempre activas), **Analíticas** (Google Analytics 4 y Microsoft Clarity) y **Publicitarias** (Pixel de Meta).
- La elección se guarda con fecha en `localStorage` (`trazabis_consent`) y se vuelve a preguntar a los 12 meses.
- **Google Tag Manager solo se carga** si `GTM_ID` está configurado **y** el visitante acepta al menos una categoría no técnica.
- «Configurar cookies», en el pie de todas las páginas, reabre el panel. Si se retira un permiso, se intentan borrar las cookies de esa categoría.

### 3.3 Botones «Ver si mi despacho encaja»

Hay cinco: cabecera, vídeo (si existe), inversión, calculadora y la barra fija inferior en móvil. Todos bajan al formulario y registran el evento `cta_click` con su ubicación.

La **barra fija en móvil** (pantallas de menos de 768 px) está visible mientras se lee la página y se oculta cuando el formulario entra en pantalla.

### 3.4 Calculadora (`calculadora.js`)

El visitante elige el número de clientes (campo numérico y deslizador sincronizados), el plan y quién paga los planes. Los importes se calculan en céntimos para evitar errores de redondeo:

```
onboarding   = 1000 + 1000 × redondeo_hacia_arriba(clientes / 50)
planes_año_1 = clientes × precio_año_1 × 12      (solo si los asume el despacho)
total        = onboarding + planes_año_1
```

| Caso | Resultado |
| --- | --- |
| 100 clientes · Inicio · asumido | 3.000 € + 17.700 € = **20.700,00 €** |
| 100 clientes · repercutido | 3.000 € («Los pagan tus clientes») |
| Menos de 51 clientes | «Para carteras de hasta 50 clientes, lo vemos en el diagnóstico» |
| Más de 300 clientes | «Lo vemos en el diagnóstico» |

Empieza en 100 clientes · Inicio · asumido por el despacho. El primer cambio confirmado registra `calculator_use`.

### 3.5 Formulario (`formulario.js`)

**Paso 1 · Tu despacho** (todas obligatorias):

1. Clientes del despacho
2. Personas en el equipo
3. Cargo
4. Programa contable
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

### 3.6 Página de gracias

Sustituye al formulario: «Gracias, {nombre}. Ten el móvil a mano.», con el aviso de que llamará el asistente de IA. Si se configura `TELEFONO_ASISTENTE`, se indica el número y aparece un botón para guardarlo en contactos (descarga `trazabis-asistente.vcf`). Al recargar la página se sigue viendo la página de gracias durante esa sesión del navegador.

---

## 4. Medición

Todos los eventos pasan por `datalayer.js`, que **solo deja pasar una lista cerrada de parámetros**: nunca llegan al dataLayer el nombre, el email, el teléfono, el despacho ni el texto libre.

| Evento | Cuándo |
| --- | --- |
| `cta_click` | Clic en un botón «Ver si mi despacho encaja» |
| `video_play` | Primera reproducción del vídeo |
| `calculator_use` | Primer cambio en la calculadora |
| `form_start` | Primera interacción con el formulario |
| `form_step_complete` | Paso 1 completado (incluye respuestas y prioridad) |
| `form_error` | Un evento por campo con error al intentar avanzar |
| `generate_lead` | Envío correcto (con `event_id`, respuestas, prioridad, consentimientos y `utm_*`) |
| `faq_open` | Se abre una pregunta frecuente |
| `consent_update` | El visitante guarda su elección de cookies |

La API de conversiones de Meta no está en la web: la envía el sistema que recibe el formulario, con el mismo `event_id` para que Meta no duplique la conversión. El detalle está en el README.

---

## 5. Diseño y animaciones

- **Identidad:** bloques de color sólido (azul Trazabis, blanco, gris claro y gris antracita), Montserrat para titulares y Roboto para el texto. Las fuentes se sirven desde el propio sitio para no contactar con Google sin consentimiento.
- **Cabecera:** malla de puntos y focos de luz; con ratón, el foco principal sigue al cursor. La ilustración de la cola de validación se anima al cargar.
- **Al hacer scroll:** los bloques aparecen escalonados y los iconos de línea se dibujan.
- **Interacción:** halo bajo el cursor y elevación en las tarjetas, botones con brillo y flecha, línea de progreso en los seis pasos, salto del total de la calculadora y apertura suave de las preguntas frecuentes.
- **Sin JavaScript** todo el contenido sigue visible.
- **Con movimiento reducido** activado en el sistema se quitan los desplazamientos y los bucles, y el desplazamiento al formulario deja de ser suave.

---

## 6. Páginas complementarias

| Página | Contenido y funcionamiento |
| --- | --- |
| **Aviso legal** | Datos del titular (LSSI), objeto, condiciones de uso, propiedad intelectual, responsabilidad y jurisdicción. El email y el teléfono se rellenan desde `config.js` |
| **Política de privacidad** | Responsable, datos tratados, finalidades y bases legales, llamada del asistente de IA, conservación, proveedores, transferencias, derechos, menores y seguridad |
| **Política de cookies** | Qué son, tabla de cookies por proveedor y categoría, cómo aceptarlas o rechazarlas y transferencias |
| **404** | Página autónoma (estilos y logo integrados) con un enlace que localiza la landing aunque el sitio esté en un subdirectorio |

Las tres páginas legales son **borradores pendientes de revisión por el abogado**. Comparten cabecera, pie y banner de cookies con la landing.

---

## 7. Archivos y responsabilidades

| Archivo | Qué hace |
| --- | --- |
| `assets/js/config.js` | Constantes configurables: `GTM_ID`, `FORM_ENDPOINT`, `VIDEO_URL`, `VIDEO_POSTER`, `TELEFONO_ASISTENTE`, `EMAIL_CONTACTO`, `TELEFONO_CONTACTO` |
| `assets/js/datalayer.js` | Envía eventos al dataLayer filtrando datos personales |
| `assets/js/consent.js` | Banner, panel y modo de consentimiento; carga de GTM tras aceptar |
| `assets/js/main.js` | Año y contacto del pie, clics en los botones, vídeo, preguntas frecuentes y barra fija |
| `assets/js/calculadora.js` | Cálculos e interfaz de la calculadora |
| `assets/js/formulario.js` | Formulario, validación, prioridad, envío y página de gracias |
| `assets/js/efectos.js` | Animaciones: aparición al hacer scroll, luz de la cabecera, halos y deslizador |
| `assets/css/styles.css` | Todos los estilos y los tokens de color de marca |
| `.htaccess` | Caché, compresión y tipos MIME en Hostinger / Apache |

Si un script de efectos falla, el resto del sitio sigue funcionando: cada bloque se inicia por separado.

---

## 8. Antes de publicar

1. Completar los `[PENDIENTE]` (lista por responsable en el README).
2. Rellenar `config.js`, como mínimo `FORM_ENDPOINT`, con CORS habilitado.
3. Validar con el abogado los textos legales, las casillas y el banner de cookies.
4. Configurar GTM con las comprobaciones de consentimiento de cada etiqueta.
5. Subir todos los archivos, incluido `.htaccess`, y actualizar `?v=` en los enlaces a CSS y JS en cada despliegue.
