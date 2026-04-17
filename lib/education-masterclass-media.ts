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
