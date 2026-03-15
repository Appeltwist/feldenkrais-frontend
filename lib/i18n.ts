import type { LocaleCode } from "@/lib/types";

export type OfferLabels = {
  book: string;
  upcomingDates: string;
  nextOccurrence: string;
  pricing: string;
  facilitators: string;
  themes: string;
  quickFacts: string;
  noOccurrences: string;
  noPricing: string;
  noFacilitators: string;
  noThemes: string;
  openDetails: string;
  benefits: string;
  eventFaq: string;
};

export type ForestPlaceholderCopy = {
  newsletterTitle: string;
  newsletterBody: string;
  newsletterPlaceholder: string;
  newsletterCta: string;
  discoverTitle: string;
  discoverDescription: string;
  discoverCta: string;
  extraFaqHeading: string;
  pdfPrompt: string;
  pdfPlaceholder: string;
  pdfCta: string;
};

const LABELS: Record<LocaleCode, OfferLabels> = {
  fr: {
    book: "R\u00e9server",
    upcomingDates: "Dates",
    nextOccurrence: "Prochaine date",
    pricing: "Tarifs",
    facilitators: "Intervenant\u00b7e\u00b7s",
    themes: "Th\u00e8mes",
    quickFacts: "Infos pratiques",
    noOccurrences: "Aucune date disponible.",
    noPricing: "Aucun tarif affich\u00e9.",
    noFacilitators: "Aucun\u00b7e intervenant\u00b7e indiqu\u00e9\u00b7e.",
    noThemes: "Aucun th\u00e8me.",
    openDetails: "Voir d\u00e9tails",
    benefits: "Pourquoi participer",
    eventFaq: "En savoir plus",
  },
  en: {
    book: "Book",
    upcomingDates: "Upcoming dates",
    nextOccurrence: "Next occurrence",
    pricing: "Pricing",
    facilitators: "Facilitators",
    themes: "Themes",
    quickFacts: "Quick facts",
    noOccurrences: "No upcoming dates listed.",
    noPricing: "No pricing listed.",
    noFacilitators: "No facilitators listed.",
    noThemes: "No themes.",
    openDetails: "Open details",
    benefits: "Why join",
    eventFaq: "More about this program",
  },
};

const FOREST_PLACEHOLDER_COPY: Record<LocaleCode, ForestPlaceholderCopy> = {
  fr: {
    newsletterTitle: "Rester informé·e",
    newsletterBody:
      "Recevez les nouvelles ouvertures, ateliers et temps forts de Forest Lighthouse sans surcharger votre boîte mail.",
    newsletterPlaceholder: "Votre e-mail",
    newsletterCta: "S'abonner",
    discoverTitle: "Vous aimerez aussi",
    discoverDescription:
      "Retrouvez d'autres ateliers, cours et parcours publiés dans le calendrier Forest Lighthouse.",
    discoverCta: "Voir les autres offres",
    extraFaqHeading: "Questions fréquentes",
    pdfPrompt: "Recevez la présentation complète de cet événement par e-mail.",
    pdfPlaceholder: "Votre e-mail",
    pdfCta: "Recevoir le PDF",
  },
  en: {
    newsletterTitle: "Stay in the loop",
    newsletterBody:
      "Receive new openings, workshops, and key Forest Lighthouse updates without crowding your inbox.",
    newsletterPlaceholder: "Your email",
    newsletterCta: "Subscribe",
    discoverTitle: "You might also like",
    discoverDescription:
      "Find other workshops, classes, and training pathways currently published in the Forest Lighthouse calendar.",
    discoverCta: "See more offers",
    extraFaqHeading: "Frequently asked questions",
    pdfPrompt: "Get the full event presentation sent to your inbox.",
    pdfPlaceholder: "Your email",
    pdfCta: "Get the PDF",
  },
};

export function resolveLocale(locale: string): LocaleCode {
  return locale.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export function getOfferLabels(locale: string | LocaleCode): OfferLabels {
  return LABELS[resolveLocale(locale)];
}

export function getForestPlaceholderCopy(locale: string | LocaleCode): ForestPlaceholderCopy {
  return FOREST_PLACEHOLDER_COPY[resolveLocale(locale)];
}

export type TeacherLabels = {
  biography: string;
  upcomingWorkshops: string;
  backToWorkshops: string;
  quote: string;
  yourGuide: string;
};

const TEACHER_LABELS: Record<LocaleCode, TeacherLabels> = {
  fr: {
    biography: "Biographie",
    upcomingWorkshops: "Prochains ateliers",
    backToWorkshops: "Retour aux ateliers",
    quote: "Citation",
    yourGuide: "Votre guide",
  },
  en: {
    biography: "Biography",
    upcomingWorkshops: "Upcoming workshops",
    backToWorkshops: "Back to workshops",
    quote: "Quote",
    yourGuide: "Your guide",
  },
};

export function getTeacherLabels(locale: string | LocaleCode): TeacherLabels {
  return TEACHER_LABELS[resolveLocale(locale)];
}

export type PrivateBookingLabels = {
  heading: string;
  subheading: string;
  pageDescriptionStandard: string;
  pageDescriptionIntro: string;
  backToSession: string;
  stepPractitioner: string;
  stepPackage: string;
  stepSlot: string;
  stepDetails: string;
  continue: string;
  back: string;
  selectedPractitioner: string;
  selectedPackage: string;
  selectedSlot: string;
  packageValidity: string;
  stepSummary: string;
  reviewBeforeConfirm: string;
  needSelection: string;
  noSelectionYet: string;
  choosePractitioner: string;
  choosePackage: string;
  chooseIntroCall: string;
  chooseIntroCallDescription: string;
  chooseSlot: string;
  yourDetails: string;
  name: string;
  email: string;
  phone: string;
  submit: string;
  loading: string;
  unavailable: string;
  noSlots: string;
  introPending: string;
  manageBooking: string;
  managePackage: string;
  reschedule: string;
  cancel: string;
  savePrep: string;
  nextSession: string;
  paymentNote: string;
  booked: string;
  completed: string;
  cancelled: string;
};

const PRIVATE_BOOKING_LABELS: Record<LocaleCode, PrivateBookingLabels> = {
  fr: {
    heading: "Réserver une séance",
    subheading: "Choisissez l'intervenant·e, la formule et un créneau disponible.",
    pageDescriptionStandard: "Réservez votre séance en quelques étapes.",
    pageDescriptionIntro: "Commencez par un entretien pour déterminer vos besoins.",
    backToSession: "Retour à la séance",
    stepPractitioner: "Intervenant·e",
    stepPackage: "Formule",
    stepSlot: "Créneau",
    stepDetails: "Coordonnées",
    continue: "Continuer",
    back: "Retour",
    selectedPractitioner: "Intervenant·e",
    selectedPackage: "Formule",
    selectedSlot: "Créneau",
    packageValidity: "Validité",
    stepSummary: "Résumé de la réservation",
    reviewBeforeConfirm: "Vérifiez votre choix avant de confirmer.",
    needSelection: "Merci de choisir une option pour continuer.",
    noSelectionYet: "Pas encore choisi",
    choosePractitioner: "Choisir l'intervenant·e",
    choosePackage: "Choisir la formule",
    chooseIntroCall: "Commencez par un entretien",
    chooseIntroCallDescription: "Commencez par un entretien pour déterminer vos besoins.",
    chooseSlot: "Choisir un créneau",
    yourDetails: "Vos coordonnées",
    name: "Nom complet",
    email: "E-mail",
    phone: "Téléphone",
    submit: "Confirmer la réservation",
    loading: "Chargement...",
    unavailable: "La réservation n'est pas encore disponible pour cette offre.",
    noSlots: "Aucun créneau disponible pour le moment.",
    introPending: "Votre appel découverte doit d'abord être marqué comme terminé avant de réserver la suite.",
    manageBooking: "Gérer ce rendez-vous",
    managePackage: "Gérer votre formule",
    reschedule: "Déplacer ce rendez-vous",
    cancel: "Annuler ce rendez-vous",
    savePrep: "Enregistrer les réponses",
    nextSession: "Réserver la prochaine séance",
    paymentNote: "Paiement",
    booked: "Réservé",
    completed: "Terminé",
    cancelled: "Annulé",
  },
  en: {
    heading: "Book a session",
    subheading: "Choose the practitioner, package, and a currently available slot.",
    pageDescriptionStandard: "Book your session in just a few steps.",
    pageDescriptionIntro: "Begin with a short intake call so we can understand your needs.",
    backToSession: "Back to the session page",
    stepPractitioner: "Practitioner",
    stepPackage: "Package",
    stepSlot: "Time slot",
    stepDetails: "Details",
    continue: "Continue",
    back: "Back",
    selectedPractitioner: "Practitioner",
    selectedPackage: "Package",
    selectedSlot: "Slot",
    packageValidity: "Validity",
    stepSummary: "Booking summary",
    reviewBeforeConfirm: "Review your choices before confirming.",
    needSelection: "Choose an option before continuing.",
    noSelectionYet: "Not selected yet",
    choosePractitioner: "Choose your practitioner",
    choosePackage: "Choose your package",
    chooseIntroCall: "Begin with an intake call",
    chooseIntroCallDescription: "Begin with a short intake call so we can understand your needs.",
    chooseSlot: "Choose a slot",
    yourDetails: "Your details",
    name: "Full name",
    email: "Email",
    phone: "Phone",
    submit: "Confirm booking",
    loading: "Loading...",
    unavailable: "Booking is not available for this offer yet.",
    noSlots: "No slots available right now.",
    introPending: "Your intro call must be marked complete before the next sessions can be booked.",
    manageBooking: "Manage this appointment",
    managePackage: "Manage your package",
    reschedule: "Reschedule this appointment",
    cancel: "Cancel this appointment",
    savePrep: "Save answers",
    nextSession: "Book the next session",
    paymentNote: "Payment",
    booked: "Booked",
    completed: "Completed",
    cancelled: "Cancelled",
  },
};

export function getPrivateBookingLabels(locale: string | LocaleCode): PrivateBookingLabels {
  return PRIVATE_BOOKING_LABELS[resolveLocale(locale)];
}
