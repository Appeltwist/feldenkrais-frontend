/**
 * Forest Lighthouse — hardcoded excerpt overrides
 *
 * Provides short descriptions for workshop cards when the API doesn't
 * return a usable excerpt. Matched by case-insensitive substring of
 * the offer title (same pattern as forest-booking.ts).
 */

const FOREST_EXCERPT_OVERRIDES: Array<{ titleMatch: string; excerpt: string }> = [
  // Week-end Gaga Dancer
  {
    titleMatch: "gaga dancer",
    excerpt:
      "Un week-end intensif de Gaga pour danseur·se·s — explorez les outils infinis cachés dans le corps à travers une improvisation guidée par la sensation et l'écoute.",
  },
  // Théâtre Enfants – Brighter Minds
  {
    titleMatch: "théâtre enfants",
    excerpt:
      "Un espace de jeu et de création théâtrale pour les enfants, mêlant mouvement, expression corporelle et imaginaire.",
  },
  {
    titleMatch: "theatre enfants",
    excerpt:
      "Un espace de jeu et de création théâtrale pour les enfants, mêlant mouvement, expression corporelle et imaginaire.",
  },
  {
    titleMatch: "brighter minds",
    excerpt:
      "Un espace de jeu et de création théâtrale pour les enfants, mêlant mouvement, expression corporelle et imaginaire.",
  },
  {
    titleMatch: "vinyasa to yin",
    excerpt:
      "Un cours qui relie énergie et relâchement, en passant d'un flow dynamique à un temps plus restauratif pour retrouver clarté, force et stabilité.",
  },
  {
    titleMatch: "hatha yoga",
    excerpt:
      "Une pratique ancrée qui associe postures, respiration et attention pour retrouver plus d'espace, de stabilité et de calme dans le corps.",
  },
  {
    titleMatch: "ashtanga",
    excerpt:
      "Un cours guidé pour explorer les séquences de l'Ashtanga avec précision, développer une pratique personnelle et avancer à votre rythme.",
  },
  {
    titleMatch: "feldenkrais",
    excerpt:
      "Un cours pour élargir vos possibilités de mouvement par l'attention, la coordination et une meilleure écoute du corps en action.",
  },
];

/* ── Hero-image overrides ──────────────────────────────────────────── */

const FOREST_IMAGE_OVERRIDES: Array<{ titleMatch: string; imageUrl: string }> = [
  {
    titleMatch: "théâtre enfants",
    imageUrl: "/brands/forest-lighthouse/photos/theatrenfant.JPEG",
  },
  {
    titleMatch: "theatre enfants",
    imageUrl: "/brands/forest-lighthouse/photos/theatrenfant.JPEG",
  },
  {
    titleMatch: "brighter minds",
    imageUrl: "/brands/forest-lighthouse/photos/theatrenfant.JPEG",
  },
];

/**
 * Returns a local hero-image override for the given offer title, or `null`.
 */
export function getForestImageOverride(title: string): string | null {
  const lower = title.toLowerCase();
  for (const entry of FOREST_IMAGE_OVERRIDES) {
    if (lower.includes(entry.titleMatch)) {
      return entry.imageUrl;
    }
  }
  return null;
}

/**
 * Returns a hardcoded excerpt override for the given offer title, or `null`
 * if no override applies (so the caller keeps the empty string).
 */
export function getForestExcerptOverride(title: string): string | null {
  const lower = title.toLowerCase();
  for (const entry of FOREST_EXCERPT_OVERRIDES) {
    if (lower.includes(entry.titleMatch)) {
      return entry.excerpt;
    }
  }
  return null;
}
