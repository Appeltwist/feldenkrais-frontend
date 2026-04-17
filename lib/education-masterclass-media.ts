export const EDUCATION_MASTERCLASS_ORDER = [
  "the-singers-voice",
  "the-skeletal-voice",
  "unlearning-pain",
  "feldenkrais-for-sports",
] as const;

export type EducationMasterclassSlug =
  (typeof EDUCATION_MASTERCLASS_ORDER)[number];

const EDUCATION_MASTERCLASS_SLUG_ALIASES: Record<string, EducationMasterclassSlug> = {
  "the-singers-voice": "the-singers-voice",
  "la-voix-du-chanteur": "the-singers-voice",
  "the-skeletal-voice": "the-skeletal-voice",
  "la-voie-x-squelettique": "the-skeletal-voice",
  "unlearning-pain": "unlearning-pain",
  "desapprendre-la-douleur": "unlearning-pain",
  "feldenkrais-for-sports": "feldenkrais-for-sports",
  "feldenkrais-le-sport": "feldenkrais-for-sports",
};

export const EDUCATION_MASTERCLASS_ROUTE_SLUGS: Record<
  EducationMasterclassSlug,
  { en: string; fr: string }
> = {
  "the-singers-voice": {
    en: "the-singers-voice",
    fr: "la-voix-du-chanteur",
  },
  "the-skeletal-voice": {
    en: "the-skeletal-voice",
    fr: "la-voie-x-squelettique",
  },
  "unlearning-pain": {
    en: "unlearning-pain",
    fr: "desapprendre-la-douleur",
  },
  "feldenkrais-for-sports": {
    en: "feldenkrais-for-sports",
    fr: "feldenkrais-le-sport",
  },
};

export const EDUCATION_MASTERCLASS_PURCHASE_LINKS: Record<
  EducationMasterclassSlug,
  { buyUrl: string; giftUrl: string }
> = {
  "the-singers-voice": {
    buyUrl: "https://client.felded.com/b/4gM00k2o22QXfay2kn73G0a",
    giftUrl: "https://client.felded.com/b/7sYcN6aUybnt4vUbUX73G0f",
  },
  "the-skeletal-voice": {
    buyUrl: "https://client.felded.com/b/eVq28sd2G3V15zY7EH73G0b",
    giftUrl: "https://client.felded.com/b/fZu3cwaUyfDJgeCbUX73G0d",
  },
  "unlearning-pain": {
    buyUrl: "https://client.felded.com/b/7sY7sMfaO77d2nMaQT73G05",
    giftUrl: "https://client.felded.com/b/14AfZi9Qu8bh2nMf7973G0e",
  },
  "feldenkrais-for-sports": {
    buyUrl: "https://client.felded.com/b/aFa5kE8Mq9fl3rQ1gj73G0g",
    giftUrl: "https://client.felded.com/b/bJe5kEbYC0IP1jI4sv73G0h",
  },
};

export const EDUCATION_MASTERCLASS_COVER_MAP: Record<
  EducationMasterclassSlug,
  string
> = {
  "the-singers-voice":
    "/brands/feldenkrais-education/masterclasses/galleries/the-singers-voice/Screenshot-2025-12-08-at-15.22.51-Large.jpeg",
  "the-skeletal-voice":
    "/brands/feldenkrais-education/masterclasses/galleries/the-skeletal-voice/Screenshot-2025-12-08-at-15.12.01-Large.jpeg",
  "unlearning-pain":
    "/brands/feldenkrais-education/masterclasses/galleries/unlearning-pain/Howard_1.41.1-2-Large.jpeg",
  "feldenkrais-for-sports":
    "/brands/feldenkrais-education/masterclasses/galleries/feldenkrais-for-sports/DSC06677.jpg",
};

export const EDUCATION_MASTERCLASS_TEACHER_IMAGE_MAP: Record<
  EducationMasterclassSlug,
  string
> = {
  "the-singers-voice":
    "/brands/feldenkrais-education/masterclasses/robert-sussuma.jpeg",
  "the-skeletal-voice":
    "/brands/feldenkrais-education/masterclasses/robert-sussuma.jpeg",
  "unlearning-pain":
    "/brands/feldenkrais-education/masterclasses/howard-schubiner.jpeg",
  "feldenkrais-for-sports":
    "/brands/feldenkrais-education/masterclasses/choune-osterero.jpg",
};

export function resolveEducationMasterclassSlug(slug: string | null | undefined): EducationMasterclassSlug | null {
  if (!slug) {
    return null;
  }

  return EDUCATION_MASTERCLASS_SLUG_ALIASES[slug.trim().toLowerCase()] ?? null;
}

export function getEducationMasterclassLocalePaths(slug: string | null | undefined) {
  const canonicalSlug = resolveEducationMasterclassSlug(slug);
  if (!canonicalSlug) {
    return null;
  }

  const routeSlugs = EDUCATION_MASTERCLASS_ROUTE_SLUGS[canonicalSlug];
  return {
    en: `/en/masterclasses/${routeSlugs.en}`,
    fr: `/fr/masterclasses/${routeSlugs.fr}`,
  };
}
