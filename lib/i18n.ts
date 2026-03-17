import type { LocaleCode } from "@/lib/types";

export type OfferLabels = {
  book: string;
  chooseDatesPricing: string;
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
  extraFaqItems: Array<{
    question: string;
    answer: string;
  }>;
};

const LABELS: Record<LocaleCode, OfferLabels> = {
  fr: {
    book: "R\u00e9server",
    chooseDatesPricing: "Voir les dates et tarifs",
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
  },
  en: {
    book: "Book",
    chooseDatesPricing: "See dates and pricing",
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
  },
};

const FOREST_PLACEHOLDER_COPY: Record<LocaleCode, ForestPlaceholderCopy> = {
  fr: {
    newsletterTitle: "Restez informé·e",
    newsletterBody: "Recevez les prochaines ouvertures, ateliers et nouvelles de Forest Lighthouse sans surcharge.",
    newsletterPlaceholder: "Votre e-mail",
    newsletterCta: "S’abonner",
    discoverTitle: "Découvrir d’autres formats",
    discoverDescription: "Explorez les autres ateliers, formations et accompagnements proposés par Forest Lighthouse.",
    discoverCta: "Voir les offres",
    extraFaqHeading: "En savoir plus",
    extraFaqItems: [
      {
        question: "Comment choisir le bon format ?",
        answer:
          "Commencez par le type d’expérience recherché : atelier ponctuel, pratique régulière, séance individuelle ou formation au long cours.",
      },
      {
        question: "Puis-je vous contacter avant de réserver ?",
        answer:
          "Oui. Si vous hésitez entre plusieurs formats ou si vous avez une question pratique, l’équipe peut vous orienter avant l’inscription.",
      },
    ],
  },
  en: {
    newsletterTitle: "Stay in the loop",
    newsletterBody: "Receive new openings, workshops, and Forest Lighthouse updates without inbox overload.",
    newsletterPlaceholder: "Your email",
    newsletterCta: "Subscribe",
    discoverTitle: "Explore more formats",
    discoverDescription: "Browse other workshops, trainings, and individual offers available at Forest Lighthouse.",
    discoverCta: "See offers",
    extraFaqHeading: "More about this space",
    extraFaqItems: [
      {
        question: "How do I choose the right format?",
        answer:
          "Start from the kind of experience you need: a one-off workshop, ongoing practice, an individual session, or a longer training pathway.",
      },
      {
        question: "Can I contact you before booking?",
        answer:
          "Yes. If you are unsure which format fits best or have a practical question, the team can help you choose before you register.",
      },
    ],
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
