/* Constantes configurables de la landing de Trazabis.
   Nunca pongas aquí claves de API ni secretos: este archivo es público. */
window.TRAZABIS_CONFIG = {
  GTM_ID: "",            // [PENDIENTE] Ej. "GTM-XXXXXXX". Si está vacío, GTM no se carga.
  FORM_ENDPOINT: "",     // [PENDIENTE] URL (webhook del CRM o del setter de IA) que recibe el formulario en JSON.
  VIDEO_URL: "",         // [PENDIENTE] URL del vídeo "Cómo funciona Trazabis, en 90 segundos". Si está vacía, se oculta la sección.
  VIDEO_POSTER: "",      // [PENDIENTE] URL de la imagen de póster del vídeo. Si está vacía y hay vídeo, se muestra un aviso [PENDIENTE].
  TELEFONO_ASISTENTE: "",// [PENDIENTE] Número desde el que llama el asistente de IA. Si está vacío, no se muestra.
  EMAIL_CONTACTO: "",    // [PENDIENTE]
  TELEFONO_CONTACTO: "", // [PENDIENTE]
  FUNDADOR_HASTA: "2026-10-31T23:59:59+01:00",  // Fin del programa Despacho Fundador (hora peninsular; el 31-10-2026 ya rige el horario de invierno, UTC+1)
};
