import type { LocaleCode } from "@/lib/types";

const FOREST_GOOGLE_MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=274%20Rue%20des%20Alli%C3%A9s%2C%201190%20Forest%2C%20Belgium";

type LocalizedText = Record<LocaleCode, string>;

type TrialReviewSeed = {
  author: string;
  rating: number;
  body: LocalizedText;
  relativeDate: LocalizedText;
};

export type TrialReview = {
  author: string;
  rating: number;
  body: string;
  relativeDate: string;
};

export type TrialReviewsLabels = {
  eyebrow: string;
  title: string;
  intro: string;
  aggregateLabel: string;
  ctaLabel: string;
  previousLabel: string;
  nextLabel: string;
  goToLabel: string;
  sectionLabel: string;
  trackLabel: string;
  reviewRatingLabel: string;
};

export type TrialReviewsSectionContent = {
  aggregateRating: string;
  ctaHref: string;
  labels: TrialReviewsLabels;
  reviews: TrialReview[];
};

const LABELS: Record<LocaleCode, TrialReviewsLabels> = {
  fr: {
    eyebrow: "",
    title: "Avis Google",
    intro: "",
    aggregateLabel: "4.9/5 sur Google",
    ctaLabel: "Voir tous les avis",
    previousLabel: "Avis précédent",
    nextLabel: "Avis suivant",
    goToLabel: "Aller à l'avis",
    sectionLabel: "Avis Google Forest Lighthouse",
    trackLabel: "Carrousel d'avis Google",
    reviewRatingLabel: "sur 5 étoiles",
  },
  en: {
    eyebrow: "",
    title: "Google reviews",
    intro: "",
    aggregateLabel: "4.9/5 on Google",
    ctaLabel: "View all reviews",
    previousLabel: "Previous review",
    nextLabel: "Next review",
    goToLabel: "Go to review",
    sectionLabel: "Forest Lighthouse Google reviews",
    trackLabel: "Google reviews carousel",
    reviewRatingLabel: "out of 5 stars",
  },
};

const REVIEW_SEED: TrialReviewSeed[] = [
  {
    author: "Claire B.",
    rating: 5,
    body: {
      fr: "Un lieu très beau et apaisant, avec une équipe chaleureuse. On s'y sent accueilli dès les premières minutes.",
      en: "A beautiful, calming place with a warm team. You feel welcome within the first few minutes.",
    },
    relativeDate: {
      fr: "il y a 2 mois",
      en: "2 months ago",
    },
  },
  {
    author: "Julien M.",
    rating: 5,
    body: {
      fr: "J'ai découvert Forest Lighthouse avec un cours d'essai et j'ai tout de suite eu envie de revenir. L'ambiance est douce et les indications sont très claires.",
      en: "I discovered Forest Lighthouse through a trial class and immediately wanted to come back. The atmosphere is gentle and the guidance is very clear.",
    },
    relativeDate: {
      fr: "il y a 3 mois",
      en: "3 months ago",
    },
  },
  {
    author: "Nora D.",
    rating: 5,
    body: {
      fr: "Le studio est lumineux, calme et très bien tenu. Même en tant que débutante, je me suis sentie à ma place.",
      en: "The studio is bright, calm, and beautifully kept. Even as a beginner, I felt completely at ease.",
    },
    relativeDate: {
      fr: "il y a 4 mois",
      en: "4 months ago",
    },
  },
  {
    author: "Sophie R.",
    rating: 5,
    body: {
      fr: "J'apprécie particulièrement la qualité de l'enseignement et l'attention portée à chacun. C'est un endroit où l'on ralentit vraiment.",
      en: "I especially appreciate the quality of the teaching and the attention given to each person. It is a place where you can genuinely slow down.",
    },
    relativeDate: {
      fr: "il y a 5 mois",
      en: "5 months ago",
    },
  },
  {
    author: "Thomas L.",
    rating: 5,
    body: {
      fr: "Très bel espace pour pratiquer le yoga et le mouvement. L'accueil est simple, humain, et jamais intimidant.",
      en: "A lovely space for yoga and movement practice. The welcome is simple, human, and never intimidating.",
    },
    relativeDate: {
      fr: "il y a 6 mois",
      en: "6 months ago",
    },
  },
  {
    author: "Emma V.",
    rating: 5,
    body: {
      fr: "Je suis venue pour un cours, puis j'ai commencé à revenir chaque semaine. Le lieu a quelque chose de très ancrant.",
      en: "I came for one class and then started coming back every week. There is something deeply grounding about the space.",
    },
    relativeDate: {
      fr: "il y a 7 mois",
      en: "7 months ago",
    },
  },
  {
    author: "Marc A.",
    rating: 5,
    body: {
      fr: "Le planning est varié et l'équipe répond rapidement aux questions. Une très belle adresse à Forest pour pratiquer avec régularité.",
      en: "The schedule is varied and the team responds quickly to questions. A wonderful place in Forest to build a regular practice.",
    },
    relativeDate: {
      fr: "il y a 8 mois",
      en: "8 months ago",
    },
  },
  {
    author: "Camille P.",
    rating: 5,
    body: {
      fr: "Forest Lighthouse est devenu un vrai point d'ancrage dans ma semaine. C'est professionnel, chaleureux et profondément humain.",
      en: "Forest Lighthouse has become a real anchor in my week. It is professional, warm, and deeply human.",
    },
    relativeDate: {
      fr: "il y a 9 mois",
      en: "9 months ago",
    },
  },
];

function resolveLocale(locale: string): LocaleCode {
  return locale.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export function getTrialReviewsContent(locale: string): TrialReviewsSectionContent {
  const localeCode = resolveLocale(locale);

  return {
    aggregateRating: "4.9",
    ctaHref: FOREST_GOOGLE_MAPS_HREF,
    labels: LABELS[localeCode],
    reviews: REVIEW_SEED.map((review) => ({
      author: review.author,
      rating: review.rating,
      body: review.body[localeCode],
      relativeDate: review.relativeDate[localeCode],
    })),
  };
}
