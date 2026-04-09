import type { LocaleCode } from "@/lib/types";

const FOREST_GOOGLE_MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=274%20Rue%20des%20Alli%C3%A9s%2C%201190%20Forest%2C%20Belgium";

type LocalizedText = Record<LocaleCode, string>;

type TrialReviewSeed = {
  author: string;
  body: LocalizedText;
};

export type TrialReview = {
  author: string;
  body: string;
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
};

export type TrialReviewsSectionContent = {
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
  },
};

const REVIEW_SEED: TrialReviewSeed[] = [
  {
    author: "Rina L.",
    body: {
      fr: "Lieu accueillant et sans prétention, où l'on peut pratiquer le yoga dans une atmosphère agréable. Peu coûteux par rapport à la plupart des studios bruxellois.",
      en: "A welcoming, unpretentious place where you can practise yoga in a pleasant atmosphere. Affordable compared with most studios in Brussels.",
    },
  },
  {
    author: "Rossella M.",
    body: {
      fr: "Très chouette ! Cours sympa et ambiance agréable, je recommande !",
      en: "Really lovely! Great class and a pleasant atmosphere. I recommend it!",
    },
  },
  {
    author: "Joëlle W.",
    body: {
      fr: "Espace agréable. Cours donnés avec enthousiasme et savoir-faire. Accueil super chaleureux.",
      en: "A lovely space. Classes are taught with enthusiasm and real know-how. The welcome is incredibly warm.",
    },
  },
  {
    author: "Clara V.",
    body: {
      fr: "La Forest Lighthouse est un lieu magnifique, familial, rénové avec amour par Betzabel et Nikos qui nous accueillent chaleureusement. Il y a une offre diversifiée de cours hebdomadaires : Feldenkrais, Pilates, Yoga, chant polyphonique… et des formations sont organisées régulièrement.",
      en: "Forest Lighthouse is a beautiful, family-oriented place, lovingly renovated by Betzabel and Nikos, who welcome everyone warmly. There is a diverse offering of weekly classes: Feldenkrais, Pilates, Yoga, polyphonic singing, and trainings are organized regularly.",
    },
  },
  {
    author: "Janie F.",
    body: {
      fr: "Lieu accueillant et chaleureux, un espace lumineux approprié pour des cours introspectifs de qualité, une offre variée... je recommande les cours du Lighthouse.",
      en: "A welcoming, warm place, with a bright space that suits high-quality introspective classes and a varied offering. I recommend the Lighthouse classes.",
    },
  },
  {
    author: "Florence A.",
    body: {
      fr: "Très agréable lieu, et formateurs de qualité dans leurs expertises respectives. Je recommande chaleureusement tous leurs cours et pratiques, pour un mieux-être du corps et de l'esprit, une liberté de mouvement retrouvée.",
      en: "A very pleasant place, with teachers of real quality in their respective fields. I warmly recommend all their classes and practices for greater well-being of body and mind, and a renewed freedom of movement.",
    },
  },
  {
    author: "Valeria G.",
    body: {
      fr: "Une atmosphère merveilleuse dans un très bel endroit. Les enseignants sont très bien préparés, accueillants et professionnels. Je suis moi-même coach, vous pouvez donc me faire confiance ;) Hautement recommandé.",
      en: "Such a wonderful atmosphere in a great spot. The teachers are very prepared, friendly and professional. I am a coach myself, so you can trust my opinion ;) Highly recommended.",
    },
  },
  {
    author: "Ines M.",
    body: {
      fr: "Super agréable lieu, cours pédagogiques et accessibles à tous ! Parfait pour commencer la méthode Feldenkrais et affiner sa pratique de yoga.",
      en: "A really lovely place, with clear teaching and classes that are accessible to everyone. Perfect for starting the Feldenkrais Method and deepening your yoga practice.",
    },
  },
];

function resolveLocale(locale: string): LocaleCode {
  return locale.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export function getTrialReviewsContent(locale: string): TrialReviewsSectionContent {
  const localeCode = resolveLocale(locale);

  return {
    ctaHref: FOREST_GOOGLE_MAPS_HREF,
    labels: LABELS[localeCode],
    reviews: REVIEW_SEED.map((review) => ({
      author: review.author,
      body: review.body[localeCode],
    })),
  };
}
