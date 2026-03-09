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
    discoverTitle: "Continuer l'exploration",
    discoverDescription:
      "Retrouvez d'autres ateliers, cours et parcours publiés dans le calendrier Forest Lighthouse.",
    discoverCta: "Voir les autres offres",
    extraFaqHeading: "Questions fréquentes",
  },
  en: {
    newsletterTitle: "Stay in the loop",
    newsletterBody:
      "Receive new openings, workshops, and key Forest Lighthouse updates without crowding your inbox.",
    newsletterPlaceholder: "Your email",
    newsletterCta: "Subscribe",
    discoverTitle: "Keep exploring",
    discoverDescription:
      "Find other workshops, classes, and training pathways currently published in the Forest Lighthouse calendar.",
    discoverCta: "See more offers",
    extraFaqHeading: "Frequently asked questions",
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
