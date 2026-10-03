/**
 * Centralized interface copy.
 *
 * Language convention: keys are in English, visible values are in neutral
 * Rioplatense Spanish. This is the ONLY place UI text lives; components must
 * not hardcode Spanish strings.
 */
export const copy = {
  page: {
    titleSuffix: "Currículum vitae",
    title: (name: string) => `${name} · ${copy.page.titleSuffix}`,
    description: (name: string) => `Currículum vitae de ${name}`,
    photoAlt: (name: string) => `Fotografía de perfil de ${name}`,
  },
  hero: {
    call: "Llamar",
    callA11y: "Llamar al teléfono",
    whatsapp: "WhatsApp",
    whatsappA11y: "Chatear por WhatsApp",
    whatsappNewTabCue: "(se abre en una nueva pestaña)",
    email: "Escribir un mail",
    downloadPdf: "Descargar CV (PDF)",
  },
  sections: {
    experience: "Experiencia laboral",
    education: "Educación",
    computerSkills: "Informática",
    contact: "Contacto",
  },
  timeline: {
    current: "Actualidad",
  },
  contact: {
    phoneLabel: "Celular",
    whatsappButton: "WhatsApp",
    emailLabel: "Email",
    locationLabel: "Ubicación",
  },
  pdfPlaceholder:
    "El PDF de este currículum todavía está en construcción. Volvé en unos días.",
  // Label of the single back-link on the /cv.pdf placeholder page (501).
  pdfPlaceholderBack: "Volver al currículum",
} as const;
