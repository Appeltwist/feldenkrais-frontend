export const SLUG_MAP: Record<string, Record<string, string>> = {
  about: { en: "about", fr: "a-propos" },
  "your-visit": { en: "your-visit", fr: "votre-visite" },
  rent: { en: "rent", fr: "location" },
  classes: { en: "classes", fr: "cours" },
  contact: { en: "contact", fr: "contact" },
  pricing: { en: "pricing", fr: "prix" },
  teachers: { en: "teachers", fr: "enseignants" },
};

export function localizedSlug(key: string, locale: string): string {
  const entry = SLUG_MAP[key];
  if (!entry) return key;
  const code = locale.toLowerCase().startsWith("fr") ? "fr" : "en";
  return entry[code] ?? key;
}
