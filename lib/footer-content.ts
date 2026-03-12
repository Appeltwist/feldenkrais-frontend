export type FooterContent = {
  navHeading: string;
  newsletterHeading: string;
  newsletterPlaceholder: string;
  newsletterCta: string;
  contactHeading: string;
  copyright: string;
  navLinks: Array<{ label: string; href: string }>;
};

const FOOTER: Record<string, FooterContent> = {
  en: {
    navHeading: "Explore",
    newsletterHeading: "Stay in the loop",
    newsletterPlaceholder: "Your email",
    newsletterCta: "Subscribe",
    contactHeading: "Contact",
    copyright: "\u00a9 2026 Forest Lighthouse. All Rights Reserved.",
    navLinks: [
      { label: "What's On", href: "/en/calendar" },
      { label: "Individual", href: "/en/private-sessions" },
      { label: "Classes", href: "/en/classes" },
      { label: "Workshops & Trainings", href: "/en/workshops" },
      { label: "Rent", href: "/en/rent" },
      { label: "About", href: "/en/about" },
    ],
  },
  fr: {
    navHeading: "Explorer",
    newsletterHeading: "Restez inform\u00e9",
    newsletterPlaceholder: "Votre email",
    newsletterCta: "S\u2019inscrire",
    contactHeading: "Contact",
    copyright: "\u00a9 2026 Forest Lighthouse. Tous droits r\u00e9serv\u00e9s.",
    navLinks: [
      { label: "\u00c0 l'affiche", href: "/fr/calendar" },
      { label: "Individuel", href: "/fr/private-sessions" },
      { label: "Cours", href: "/fr/classes" },
      { label: "Ateliers & Formations", href: "/fr/workshops" },
      { label: "Location", href: "/fr/rent" },
      { label: "\u00c0 propos", href: "/fr/about" },
    ],
  },
};

export function getFooterContent(locale: string): FooterContent {
  const code = locale.toLowerCase().startsWith("fr") ? "fr" : "en";
  return FOOTER[code];
}
