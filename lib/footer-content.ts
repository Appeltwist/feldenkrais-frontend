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
      { label: "About", href: "/en/about" },
      { label: "Weekly Classes", href: "/en/classes" },
      { label: "Pricing", href: "/en/pricing" },
      { label: "Your Visit", href: "/en/your-visit" },
      { label: "Rent", href: "/en/rent" },
      { label: "Contact", href: "/en/contact" },
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
      { label: "\u00c0 propos", href: "/fr/a-propos" },
      { label: "Cours Hebdomadaires", href: "/fr/cours" },
      { label: "Tarifs", href: "/fr/prix" },
      { label: "Votre Visite", href: "/fr/votre-visite" },
      { label: "Location", href: "/fr/location" },
      { label: "Contact", href: "/fr/contact" },
    ],
  },
};

export function getFooterContent(locale: string): FooterContent {
  const code = locale.toLowerCase().startsWith("fr") ? "fr" : "en";
  return FOOTER[code];
}
