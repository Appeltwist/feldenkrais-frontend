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
    newsletterTitle: "Rester au courant",
    newsletterBody: "Recevez les prochaines dates, nouvelles offres et inspirations du Forest Lighthouse.",
    newsletterPlaceholder: "Votre email",
    newsletterCta: "S'inscrire",
    discoverTitle: "Explorer d'autres propositions",
    discoverDescription: "Parcourez les ateliers et pratiques a venir pour trouver ce qui vous appelle en ce moment.",
    discoverCta: "Voir les ateliers",
    extraFaqHeading: "Questions frequentes",
    extraFaqItems: [
      {
        question: "Que faut-il apporter ?",
        answer: "Venez avec des vetements confortables et tout ce qui vous aide a vous sentir a l'aise pendant la pratique.",
      },
      {
        question: "Est-ce adapte aux debutant·es ?",
        answer: "Oui. La plupart des offres accueillent aussi les personnes qui decouvrent la pratique pour la premiere fois.",
      },
      {
        question: "Comment reserver ?",
        answer: "Utilisez le bouton de reservation de cette page ou contactez l'equipe si vous avez besoin d'aide pour choisir.",
      },
    ],
  },
  en: {
    newsletterTitle: "Stay in the loop",
    newsletterBody: "Get upcoming dates, new offerings, and fresh inspiration from Forest Lighthouse.",
    newsletterPlaceholder: "Your email",
    newsletterCta: "Join the list",
    discoverTitle: "Discover more offerings",
    discoverDescription: "Browse upcoming workshops and practices to find what feels right for you right now.",
    discoverCta: "View workshops",
    extraFaqHeading: "Frequently asked questions",
    extraFaqItems: [
      {
        question: "What should I bring?",
        answer: "Come in comfortable clothing and bring anything that helps you feel at ease during the session.",
      },
      {
        question: "Is it suitable for beginners?",
        answer: "Yes. Most offerings welcome people who are exploring the practice for the first time.",
      },
      {
        question: "How do I book?",
        answer: "Use the booking button on this page, or contact the team if you want help choosing the right offer.",
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
