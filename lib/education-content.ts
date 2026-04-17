import { resolveLocale } from "@/lib/i18n";
import { localizePath } from "@/lib/locale-path";
import type {
  NarrativePage,
  SiteAnnouncement,
  SiteConfig,
  SiteFooter,
  SiteFooterContact,
  SiteFooterGroup,
  SiteNavItem,
} from "@/lib/site-config";
import type { SectionBlock } from "@/lib/types";

export type EducationPageKey =
  | "centers"
  | "about"
  | "visit"
  | "location"
  | "calendar"
  | "classes"
  | "workshops"
  | "private-sessions"
  | "trainings"
  | "contact"
  | "what-is-feldenkrais"
  | "find-a-practitioner"
  | "practitioner-finder"
  | "videos"
  | "shop"
  | "newsletter"
  | "press"
  | "platform"
  | "teachers"
  | "team"
  | "moshe-feldenkrais"
  | "financing"
  | "day-in-training"
  | "domains"
  | "privacy"
  | "terms"
  | "complaints";

export type EducationCenterProfile = {
  slug: string;
  name: string;
  location: string;
  summary: string;
  heroImageUrl: string;
  address: string;
  legacyTitle: string;
  overviewParagraphs: string[];
  highlights: Array<{ title: string; body: string }>;
  teachers: Array<{ name: string; body: string }>;
  upcomingTraining: {
    name: string;
    body: string;
    note?: string;
  };
  note?: string;
  page: NarrativePage;
};

const EDUCATION_LOGO_URL = "/brands/feldenkrais-education/logo/feldenkrais-education-logo.png";
const EDUCATION_LOGO_MARK_URL = "/brands/feldenkrais-education/logo/feldenkrais-education-mark.png";
const DEFAULT_HERO_IMAGE =
  "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/11/GIF_WHITE_WALK.gif";
const BRUSSELS_IMAGE =
  "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/10/DSC02199-Large.jpeg";
const CANTAL_IMAGE =
  "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/09/1085_11201251_S067.jpg";
const PARIS_IMAGE =
  "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/10/1085_11201349_S321.jpg";

function t(locale: string, fr: string, en: string) {
  return resolveLocale(locale) === "fr" ? fr : en;
}

function richSection(heading: string, body: string, anchorId?: string): SectionBlock {
  return {
    type: "rich_section",
    value: { heading, body, anchor_id: anchorId },
  };
}

function featureStack(
  heading: string,
  items: Array<{ title: string; body: string }>,
  anchorId?: string,
): SectionBlock {
  return {
    type: "feature_stack",
    value: {
      anchor_id: anchorId,
      heading,
      items,
    },
  };
}

function journey(
  heading: string,
  items: Array<{ title: string; description: string }>,
): SectionBlock {
  return {
    type: "journey_steps",
    value: {
      heading,
      items,
    },
  };
}

function cta(
  heading: string,
  body: string,
  buttonLabel: string,
  buttonUrl: string,
): SectionBlock {
  return {
    type: "cta_section",
    value: {
      heading,
      body,
      button_label: buttonLabel,
      button_url: buttonUrl,
    },
  };
}

function buildEducationNav(locale: string): SiteNavItem[] {
  const isFr = resolveLocale(locale) === "fr";

  return [
    {
      label: isFr ? "Formations" : "Trainings",
      href: localizePath(locale, "/trainings"),
      children: [
        {
          label: isFr ? "Formation Feldenkrais" : "Feldenkrais Training",
          href: localizePath(locale, "/trainings"),
        },
        {
          label: isFr ? "Stages & Formations" : "All Workshops",
          href: localizePath(locale, "/workshops"),
        },
        {
          label: isFr ? "Une journée dans la formation" : "A day in training",
          href: localizePath(locale, "/day-in-training"),
        },
      ],
    },
    {
      label: isFr ? "Centres" : "Centers",
      href: localizePath(locale, "/centers"),
      children: [
        { label: "Cantal", href: localizePath(locale, "/centers/cantal") },
        ...(isFr
          ? [
              { label: "Bruxelles", href: localizePath(locale, "/centers/brussels") },
              { label: "Paris", href: localizePath(locale, "/centers/paris") },
            ]
          : [
              { label: "Paris", href: localizePath(locale, "/centers/paris") },
              { label: "Brussels", href: localizePath(locale, "/centers/brussels") },
            ]),
      ],
    },
    {
      label: "Feldenkrais",
      href: localizePath(locale, "/what-is-feldenkrais"),
      children: [
        {
          label: isFr ? "La Méthode Feldenkrais" : "What is Feldenkrais",
          href: localizePath(locale, "/what-is-feldenkrais"),
        },
        {
          label: isFr ? "12 Domaines" : "12 domains",
          href: localizePath(locale, "/what-is-feldenkrais#12domains"),
        },
        {
          label: "Moshe Feldenkrais",
          href: localizePath(locale, "/what-is-feldenkrais#biography"),
        },
        {
          label: isFr ? "Trouver un praticien" : "Find a practitioner",
          href: localizePath(locale, "/find-a-practitioner"),
        },
        {
          label: isFr ? "Infolettre" : "Newsletter",
          href: localizePath(locale, "/newsletter"),
        },
      ],
    },
    { label: isFr ? "Vidéos" : "Watch", href: localizePath(locale, "/videos") },
    { label: isFr ? "Boutique" : "Shop", href: localizePath(locale, "/shop") },
    { label: isFr ? "Contact" : "Contact", href: localizePath(locale, "/contact") },
  ];
}

function buildFooter(locale: string): SiteFooter {
  const isFr = resolveLocale(locale) === "fr";

  const groups: SiteFooterGroup[] = [
    {
      title: isFr ? "À propos" : "About",
      links: [
        { label: isFr ? "Feldenkrais Education" : "About Feldenkrais Education", href: localizePath(locale, "/about") },
        { label: isFr ? "Les intervenants" : "The Teachers", href: localizePath(locale, "/teachers") },
        { label: isFr ? "L’équipe" : "The Team", href: localizePath(locale, "/team") },
        { label: isFr ? "Presse" : "Press", href: localizePath(locale, "/press") },
      ],
    },
    {
      title: isFr ? "Liens rapides" : "Quick links",
      links: [
        { label: isFr ? "Trouver un praticien" : "Find a practitioner", href: localizePath(locale, "/find-a-practitioner") },
        { label: isFr ? "Infolettre" : "Newsletter", href: localizePath(locale, "/newsletter") },
        { label: isFr ? "Domaines" : "Domains", href: localizePath(locale, "/domains") },
        { label: isFr ? "Une journée dans la formation" : "A typical day in a training", href: localizePath(locale, "/day-in-training") },
        { label: isFr ? "Vidéos" : "Watch", href: localizePath(locale, "/videos") },
      ],
    },
    {
      title: isFr ? "Formations" : "Training",
      links: [
        { label: isFr ? "Formation Feldenkrais" : "Feldenkrais Professional Training", href: localizePath(locale, "/trainings") },
        { label: isFr ? "Stages & Formations" : "All Workshops", href: localizePath(locale, "/workshops") },
        { label: isFr ? "Centres" : "Centers", href: localizePath(locale, "/centers") },
        { label: isFr ? "Financement" : "Financing", href: localizePath(locale, "/financing") },
      ],
    },
    {
      title: isFr ? "Outils" : "Useful links",
      links: [
        { label: isFr ? "Nous contacter" : "Contact Us", href: localizePath(locale, "/contact") },
        { label: isFr ? "Réclamation" : "Complaints", href: localizePath(locale, "/complaints") },
        { label: isFr ? "CGV" : "Terms", href: localizePath(locale, "/terms") },
        { label: isFr ? "Politique de confidentialité" : "Privacy policy", href: localizePath(locale, "/privacy") },
        { label: isFr ? "Financement" : "Financing", href: localizePath(locale, "/financing") },
        { label: isFr ? "Boutique" : "Shop", href: localizePath(locale, "/shop") },
      ],
    },
  ];

  const contact: SiteFooterContact = {
    heading: isFr ? "Contact" : "Contact",
    body: t(
      locale,
      "Formation professionnelle, ateliers, ressources et orientation vers les centres partenaires.",
      "Professional training, workshops, resources, and orientation toward partner centers.",
    ),
    phone: "+32 2 318 46 96",
    email: "info@feldenkrais-education.com",
    mapUrl: localizePath(locale, "/centers"),
  };

  return {
    groups,
    contact,
    socials: [
      { label: "Instagram", url: "https://www.instagram.com/feldenkrais_education/" },
      { label: "Vimeo", url: "https://vimeo.com/feldenkraiseducation" },
    ],
  };
}

function buildAnnouncement(locale: string): SiteAnnouncement {
  return {
    enabled: false,
    text: t(locale, "Restez informé·e des prochaines sessions", "Stay informed about upcoming sessions"),
    linkLabel: null,
    url: null,
  };
}

export function getEducationFallbackSiteConfig(hostname: string, locale: string): SiteConfig {
  return {
    siteName: "Feldenkrais Education",
    siteSlug: "feldenkrais-education",
    centerSlug: "feldenkrais-education",
    defaultLocale: "en",
    locales: ["en", "fr"],
    brand: {
      colorPrimary: "#ba6028",
      colorSecondary: "#757575",
      colorAccent: "#2b7bb9",
      backgroundColor: "#f2f2f2",
      ctaPrimaryColor: "#ba6028",
      ctaHoverColor: "#88461d",
      textColor: "#44464c",
      headingColor: "#333333",
      fontFamily: "\"Open Sans\", sans-serif",
      fontFamilyToken: "playfair-open-sans",
      headingFontFamily: "\"Playfair Display\", serif",
      logoUrl: EDUCATION_LOGO_URL,
    },
    center: {
      slug: "feldenkrais-education",
      name: "Feldenkrais Education",
      socials: [
        { label: "Instagram", url: "https://www.instagram.com/feldenkrais_education/" },
        { label: "Vimeo", url: "https://vimeo.com/feldenkraiseducation" },
      ],
    },
    nav: buildEducationNav(locale),
    footer: buildFooter(locale),
    announcement: buildAnnouncement(locale),
  };
}

function nonEmptyString(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

function mergeBrand(fallback: SiteConfig["brand"], incoming: SiteConfig["brand"]) {
  const keepFallbackFont =
    !nonEmptyString(incoming.fontFamily) ||
    incoming.fontFamily === "system-ui, -apple-system, Segoe UI, sans-serif" ||
    incoming.fontFamilyToken?.trim().toLowerCase() === "system-ui";

  return {
    ...fallback,
    ...incoming,
    fontFamily: keepFallbackFont ? fallback.fontFamily : incoming.fontFamily,
    fontFamilyToken: keepFallbackFont ? fallback.fontFamilyToken : incoming.fontFamilyToken,
    headingFontFamily: keepFallbackFont ? fallback.headingFontFamily : incoming.headingFontFamily,
    logoUrl: nonEmptyString(incoming.logoUrl) ? incoming.logoUrl : fallback.logoUrl,
    backgroundColor: nonEmptyString(incoming.backgroundColor) ? incoming.backgroundColor : fallback.backgroundColor,
    ctaPrimaryColor: nonEmptyString(incoming.ctaPrimaryColor) ? incoming.ctaPrimaryColor : fallback.ctaPrimaryColor,
    ctaHoverColor: nonEmptyString(incoming.ctaHoverColor) ? incoming.ctaHoverColor : fallback.ctaHoverColor,
    textColor: nonEmptyString(incoming.textColor) ? incoming.textColor : fallback.textColor,
    headingColor: nonEmptyString(incoming.headingColor) ? incoming.headingColor : fallback.headingColor,
  };
}

function mergeFooterContact(
  fallbackContact: SiteFooter["contact"],
  incomingContact: SiteFooter["contact"],
): SiteFooter["contact"] {
  if (!incomingContact) {
    return fallbackContact;
  }
  if (!fallbackContact) {
    return incomingContact;
  }

  return {
    heading: nonEmptyString(incomingContact.heading) ? incomingContact.heading : fallbackContact.heading,
    body: nonEmptyString(incomingContact.body) ? incomingContact.body : fallbackContact.body,
    phone: nonEmptyString(incomingContact.phone) ? incomingContact.phone : fallbackContact.phone,
    email: nonEmptyString(incomingContact.email) ? incomingContact.email : fallbackContact.email,
    mapUrl: nonEmptyString(incomingContact.mapUrl) ? incomingContact.mapUrl : fallbackContact.mapUrl,
  };
}

function normalizeNavigationHref(href: string | null | undefined) {
  if (!nonEmptyString(href)) {
    return "";
  }

  const trimmed = (href ?? "").trim();

  if (/^(mailto:|tel:|#)/i.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  try {
    const parsed = new URL(trimmed, "https://fe.local");
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      let path = parsed.pathname || "/";
      path = path.replace(/^\/(en|fr)(?=\/|$)/i, "") || "/";
      path = path.replace(/\/+$/, "") || "/";
      return path.toLowerCase();
    }
  } catch {
    // Fall through to the string cleanup below.
  }

  return trimmed.replace(/^\/(en|fr)(?=\/|$)/i, "").replace(/\/+$/, "").toLowerCase() || "/";
}

function mergeNavItems(fallbackNav: SiteNavItem[], incomingNav: SiteNavItem[]): SiteNavItem[] {
  if (incomingNav.length === 0) {
    return fallbackNav;
  }

  const usedFallbackIndexes = new Set<number>();
  const merged: SiteNavItem[] = incomingNav.map((incomingItem): SiteNavItem => {
    const incomingKey = normalizeNavigationHref(incomingItem.href) || incomingItem.label.trim().toLowerCase();
    const fallbackIndex = fallbackNav.findIndex((candidate) => {
      const candidateKey = normalizeNavigationHref(candidate.href) || candidate.label.trim().toLowerCase();
      return candidateKey === incomingKey;
    });
    const fallbackItem = fallbackIndex >= 0 ? fallbackNav[fallbackIndex] : undefined;

    if (fallbackIndex >= 0) {
      usedFallbackIndexes.add(fallbackIndex);
    }

    const mergedChildren =
      incomingItem.children && incomingItem.children.length > 0
        ? mergeNavItems(fallbackItem?.children ?? [], incomingItem.children)
        : fallbackItem?.children;

    return {
      ...fallbackItem,
      ...incomingItem,
      href: fallbackItem?.href ?? incomingItem.href,
      openInNewTab:
        typeof incomingItem.openInNewTab === "boolean"
          ? incomingItem.openInNewTab
          : fallbackItem?.openInNewTab,
      children: mergedChildren && mergedChildren.length > 0 ? mergedChildren : undefined,
    };
  });

  fallbackNav.forEach((item, index) => {
    if (!usedFallbackIndexes.has(index)) {
      merged.push(item);
    }
  });

  return merged;
}

function mergeFooterGroups(
  fallbackGroups: SiteFooterGroup[],
  incomingGroups: SiteFooterGroup[],
): SiteFooterGroup[] {
  if (incomingGroups.length === 0) {
    return fallbackGroups;
  }

  const usedFallbackIndexes = new Set<number>();
  const merged: SiteFooterGroup[] = incomingGroups.map((incomingGroup): SiteFooterGroup => {
    const fallbackIndex = fallbackGroups.findIndex(
      (candidate) => candidate.title.trim().toLowerCase() === incomingGroup.title.trim().toLowerCase(),
    );
    const fallbackGroup = fallbackIndex >= 0 ? fallbackGroups[fallbackIndex] : undefined;

    if (fallbackIndex >= 0) {
      usedFallbackIndexes.add(fallbackIndex);
    }

    const mergedLinks = mergeNavItems(
      (fallbackGroup?.links ?? []).map((link) => ({ ...link })),
      incomingGroup.links.map((link) => ({ ...link })),
    ).map((link) => ({
      label: link.label,
      href: link.href,
      openInNewTab: link.openInNewTab,
    }));

    return {
      title: incomingGroup.title || fallbackGroup?.title || "",
      links: mergedLinks,
    };
  });

  fallbackGroups.forEach((group, index) => {
    if (!usedFallbackIndexes.has(index)) {
      merged.push(group);
    }
  });

  return merged;
}

export function mergeEducationSiteConfig(
  fallbackConfig: SiteConfig,
  incomingConfig: SiteConfig | null,
): SiteConfig {
  if (!incomingConfig) {
    return fallbackConfig;
  }

  return {
    ...fallbackConfig,
    ...incomingConfig,
    siteName: nonEmptyString(incomingConfig.siteName) ? incomingConfig.siteName : fallbackConfig.siteName,
    siteSlug: nonEmptyString(incomingConfig.siteSlug) ? incomingConfig.siteSlug : fallbackConfig.siteSlug,
    centerSlug: nonEmptyString(incomingConfig.centerSlug) ? incomingConfig.centerSlug : fallbackConfig.centerSlug,
    defaultLocale: nonEmptyString(incomingConfig.defaultLocale)
      ? incomingConfig.defaultLocale
      : fallbackConfig.defaultLocale,
    locales: incomingConfig.locales.length > 0 ? incomingConfig.locales : fallbackConfig.locales,
    brand: mergeBrand(fallbackConfig.brand, incomingConfig.brand),
    center: {
      ...fallbackConfig.center,
      ...incomingConfig.center,
      slug: nonEmptyString(incomingConfig.center.slug) ? incomingConfig.center.slug : fallbackConfig.center.slug,
      name: nonEmptyString(incomingConfig.center.name) ? incomingConfig.center.name : fallbackConfig.center.name,
      socials: incomingConfig.center.socials.length > 0
        ? incomingConfig.center.socials
        : fallbackConfig.center.socials,
    },
    nav: mergeNavItems(fallbackConfig.nav, incomingConfig.nav),
    footer: {
      groups: mergeFooterGroups(fallbackConfig.footer.groups, incomingConfig.footer.groups),
      contact: mergeFooterContact(fallbackConfig.footer.contact, incomingConfig.footer.contact),
      socials: incomingConfig.footer.socials.length > 0
        ? incomingConfig.footer.socials
        : fallbackConfig.footer.socials,
    },
    announcement: incomingConfig.announcement ?? fallbackConfig.announcement,
  };
}

function buildNarrativePage(
  locale: string,
  routeKey: string,
  options: {
    title: string;
    subtitle?: string;
    heroTitle?: string;
    heroBody?: string;
    heroImageUrl?: string;
    primaryCta?: { label: string; url: string };
    sections?: SectionBlock[];
  },
): NarrativePage {
  return {
    routeKey,
    locale: resolveLocale(locale),
    title: options.title,
    subtitle: options.subtitle ?? null,
    hero: {
      title: options.heroTitle ?? options.title,
      body: options.heroBody ?? options.subtitle ?? null,
      imageUrl: options.heroImageUrl ?? DEFAULT_HERO_IMAGE,
    },
    sections: options.sections ?? [],
    primaryCta: options.primaryCta ?? null,
    seo: {
      title: options.title,
      description: options.subtitle ?? options.heroBody ?? null,
    },
  };
}

export function getEducationFallbackNarrativePage(routeKey: EducationPageKey, locale: string): NarrativePage | null {
  const isFr = resolveLocale(locale) === "fr";

  switch (routeKey) {
    case "centers":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Les centres Feldenkrais Education", "The Feldenkrais Education centers"),
        subtitle: t(
          locale,
          "Trois ancrages, trois rythmes d’étude, et une même orientation vers la formation, les ateliers et les ressources.",
          "Three anchors, three study rhythms, and one shared orientation toward training, workshops, and resources.",
        ),
        heroImageUrl: BRUSSELS_IMAGE,
        primaryCta: {
          label: t(locale, "Voir les formations", "Explore training"),
          url: localizePath(locale, "/trainings"),
        },
      });
    case "about":
      return buildNarrativePage(locale, routeKey, {
        title: isFr ? "À propos de Feldenkrais Education" : "About Feldenkrais Education",
        subtitle: t(
          locale,
          "Une structure internationale dédiée à la formation professionnelle, aux ateliers et à la transmission de la méthode Feldenkrais.",
          "An international structure dedicated to professional training, workshops, and the transmission of the Feldenkrais Method.",
        ),
        heroImageUrl: DEFAULT_HERO_IMAGE,
        primaryCta: {
          label: t(locale, "Découvrir les formations", "Explore training"),
          url: localizePath(locale, "/trainings"),
        },
        sections: [
          richSection(
            t(locale, "Notre positionnement", "Our role"),
            t(
              locale,
              "<p>Feldenkrais Education relie des parcours longs, des ateliers, des ressources et des centres partenaires au sein d’une même expérience éditoriale.</p>",
              "<p>Feldenkrais Education brings together long-form training, workshops, resources, and partner centers within one editorial experience.</p>",
            ),
          ),
          featureStack(t(locale, "Ce que vous trouverez ici", "What you will find here"), [
            {
              title: t(locale, "Parcours professionnels", "Professional pathways"),
              body: t(locale, "Des formations structurées, réparties en cohortes et centres.", "Structured training pathways across cohorts and centers."),
            },
            {
              title: t(locale, "Approche éditoriale", "Editorial guidance"),
              body: t(locale, "Des pages plus claires pour comprendre la méthode, les lieux, et les formats.", "Clearer pages to understand the method, places, and formats."),
            },
            {
              title: t(locale, "Passerelles", "Connections"),
              body: t(locale, "Des liens directs entre pratique, formation, ressources et centres.", "Direct links between practice, training, resources, and centers."),
            },
          ]),
        ],
      });
    case "visit":
    case "location":
      return buildNarrativePage(locale, routeKey, {
        title: isFr ? "Venir nous rencontrer" : "Plan your visit",
        subtitle: t(
          locale,
          "Informations pratiques, centres partenaires et points de contact pour préparer une session, un atelier ou une candidature.",
          "Practical information, partner centers, and contact points to prepare for a session, workshop, or application.",
        ),
        heroImageUrl: BRUSSELS_IMAGE,
        primaryCta: {
          label: t(locale, "Voir les centres", "See the centers"),
          url: localizePath(locale, "/centers"),
        },
        sections: [
          richSection(
            t(locale, "Comment s’orienter", "How to orient yourself"),
            t(
              locale,
              "<p>Le site regroupe plusieurs centres et plusieurs formats. Commencez par le centre le plus proche, ou par le format d’étude qui vous convient.</p>",
              "<p>The site brings together multiple centers and formats. Start with the nearest center, or with the mode of study that fits you best.</p>",
            ),
          ),
          journey(t(locale, "Avant de venir", "Before you visit"), [
            {
              title: t(locale, "Choisir un centre", "Choose a center"),
              description: t(locale, "Bruxelles, Cantal et Paris ont chacun leur rythme, leur contexte et leurs cohortes.", "Brussels, Cantal, and Paris each have their own rhythm, context, and cohorts."),
            },
            {
              title: t(locale, "Choisir un format", "Choose a format"),
              description: t(locale, "Formation longue, atelier ponctuel, ressource, ou prise de contact.", "Long-form training, workshop, resource, or direct contact."),
            },
            {
              title: t(locale, "Préparer les échanges", "Prepare the conversation"),
              description: t(locale, "Questions de financement, calendrier, niveau requis, et déroulé des sessions.", "Questions about financing, calendar, prerequisites, and session rhythm."),
            },
          ]),
        ],
      });
    case "calendar":
      return buildNarrativePage(locale, routeKey, {
        title: isFr ? "Calendrier" : "Calendar",
        subtitle: t(
          locale,
          "Un point d’entrée unique pour voir les ateliers, formations, cours et rendez-vous à venir.",
          "A single entry point to see upcoming workshops, training, classes, and events.",
        ),
        heroImageUrl: DEFAULT_HERO_IMAGE,
      });
    case "classes":
      return buildNarrativePage(locale, routeKey, {
        title: isFr ? "Cours" : "Classes",
        subtitle: t(
          locale,
          "Pratique régulière, intégration progressive et formats accessibles pour entrer dans la méthode.",
          "Regular practice, gradual integration, and accessible formats to enter the method.",
        ),
        heroImageUrl: BRUSSELS_IMAGE,
      });
    case "workshops":
      return buildNarrativePage(locale, routeKey, {
        title: isFr ? "Stages & Formations" : "All Workshops",
        subtitle: t(
          locale,
          "Des formats immersifs, thématiques et de durée variable pour approfondir un axe de recherche.",
          "Immersive themed formats of varying duration to deepen a line of inquiry.",
        ),
        heroImageUrl: PARIS_IMAGE,
      });
    case "private-sessions":
      return buildNarrativePage(locale, routeKey, {
        title: isFr ? "Séances individuelles" : "Private sessions",
        subtitle: t(
          locale,
          "Un accompagnement individuel pour explorer des besoins spécifiques ou travailler plus finement.",
          "One-to-one guidance to explore specific needs or work in a more tailored way.",
        ),
        heroImageUrl: CANTAL_IMAGE,
      });
    case "trainings":
      return buildNarrativePage(locale, routeKey, {
        title: isFr ? "Formation Feldenkrais" : "Feldenkrais Training",
        subtitle: t(
          locale,
          "Vivre l’inhabituel à travers un parcours long, structuré par centres et cohortes.",
          "Living the inhabitual through a long-form pathway structured by centers and cohorts.",
        ),
        heroImageUrl: PARIS_IMAGE,
        primaryCta: {
          label: t(locale, "Demander le programme", "Request the program"),
          url: localizePath(locale, "/contact"),
        },
        sections: [],
      });
    case "contact":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Contact", "Contact"),
        subtitle: t(
          locale,
          "Une question sur la formation, les centres, les ressources ou les prochaines dates ?",
          "A question about training, centers, resources, or upcoming dates?",
        ),
        heroImageUrl: DEFAULT_HERO_IMAGE,
      });
    case "what-is-feldenkrais":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "La Méthode Feldenkrais", "What is the Feldenkrais Method"),
        subtitle: t(
          locale,
          "Une approche de l’apprentissage par le mouvement, de l’attention et de l’organisation de soi.",
          "An approach to learning through movement, attention, and self-organization.",
        ),
        heroImageUrl: CANTAL_IMAGE,
        sections: [
          richSection(
            t(locale, "Une méthode d’apprentissage", "A method of learning"),
            t(
              locale,
              "<p>La méthode Feldenkrais développe l’attention au mouvement, aux appuis, à l’effort et à l’organisation globale. Elle ne cherche pas seulement à corriger, mais à ouvrir plus d’options perceptives et motrices.</p>",
              "<p>The Feldenkrais Method develops attention to movement, support, effort, and overall organization. It does not only aim to correct, but to open more perceptive and motor options.</p>",
            ),
            "method",
          ),
          featureStack(
            t(locale, "12 Domaines", "12 domains"),
            [
              {
                title: t(locale, "Respiration et tonus", "Breath and tone"),
                body: t(
                  locale,
                  "Explorer la relation entre souffle, effort et disponibilité.",
                  "Explore the relationship between breath, effort, and availability.",
                ),
              },
              {
                title: t(locale, "Coordination", "Coordination"),
                body: t(
                  locale,
                  "Affiner la relation entre les parties du corps.",
                  "Refine the relationship between the parts of the body.",
                ),
              },
              {
                title: t(locale, "Orientation", "Orientation"),
                body: t(
                  locale,
                  "Mieux se situer dans l’espace et dans l’action.",
                  "Better orient yourself in space and in action.",
                ),
              },
            ],
            "12domains",
          ),
          richSection(
            "Moshe Feldenkrais",
            t(
              locale,
              "<p id=\"biography\">Physicien, judoka et pédagogue, Moshe Feldenkrais a développé une approche qui relie mouvement, perception, apprentissage et autonomie.</p>",
              "<p id=\"biography\">Physicist, judoka, and educator Moshe Feldenkrais developed an approach linking movement, perception, learning, and autonomy.</p>",
            ),
            "biography",
          ),
        ],
      });
    case "find-a-practitioner":
    case "practitioner-finder":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Trouver un praticien", "Find a practitioner"),
        subtitle: t(
          locale,
          "Un point d’orientation vers les centres, intervenant·es et formats les plus adaptés à votre recherche.",
          "An orientation point toward centers, teachers, and formats that best fit your needs.",
        ),
        sections: [
          journey(t(locale, "Comment commencer", "How to begin"), [
            {
              title: t(locale, "Décrire votre besoin", "Describe your need"),
              description: t(locale, "Pratique régulière, douleur, curiosité, formation, retour au mouvement.", "Regular practice, pain, curiosity, training, returning to movement."),
            },
            {
              title: t(locale, "Choisir un format", "Choose a format"),
              description: t(locale, "Cours, séance individuelle, atelier, ou parcours long.", "Class, private session, workshop, or long-form study."),
            },
            {
              title: t(locale, "Contacter le bon lieu", "Contact the right place"),
              description: t(locale, "Nous vous aidons à trouver le centre ou la personne appropriée.", "We help you find the appropriate center or person."),
            },
          ]),
          cta(
            t(locale, "Besoin d’orientation ?", "Need help choosing?"),
            t(locale, "Écrivez-nous et nous vous orienterons.", "Write to us and we will help orient you."),
            t(locale, "Nous contacter", "Contact us"),
            localizePath(locale, "/contact"),
          ),
        ],
      });
    case "press":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Presse", "Press"),
        subtitle: t(
          locale,
          "Repères, extraits et éléments de contexte autour de Feldenkrais Education.",
          "Background, excerpts, and context around Feldenkrais Education.",
        ),
        heroImageUrl: DEFAULT_HERO_IMAGE,
      });
    case "platform":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "La plateforme Neuro Somatic", "The Neuro Somatic Platform"),
        subtitle: t(
          locale,
          "Un espace complémentaire de ressources, de pratique et de continuité d’étude.",
          "A complementary space for resources, practice, and continuity of study.",
        ),
        heroImageUrl: PARIS_IMAGE,
        primaryCta: {
          label: t(locale, "Ouvrir Neurosomatic", "Open Neurosomatic"),
          url: "https://neurosomatic.com",
        },
      });
    case "teachers":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Les enseignant·es", "The teachers"),
        subtitle: t(
          locale,
          "Les personnes qui transmettent la méthode, accompagnent les cohortes et portent les ateliers.",
          "The people who transmit the method, guide cohorts, and carry the workshops.",
        ),
        heroImageUrl: BRUSSELS_IMAGE,
      });
    case "team":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "L’équipe", "The team"),
        subtitle: t(
          locale,
          "Les personnes qui coordonnent les parcours, l’accueil et la continuité du site.",
          "The people coordinating pathways, communication, and continuity across the site.",
        ),
        heroImageUrl: DEFAULT_HERO_IMAGE,
      });
    case "moshe-feldenkrais":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Moshe Feldenkrais", "Moshe Feldenkrais"),
        subtitle: t(
          locale,
          "Une page dédiée à son parcours, sa pensée, et à la manière dont son travail continue à irriguer la méthode.",
          "A page dedicated to his path, his thinking, and how his work continues to shape the method.",
        ),
        heroImageUrl: CANTAL_IMAGE,
      });
    case "videos":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Vidéos", "Videos"),
        subtitle: t(
          locale,
          "Un espace éditorial pour introductions, extraits, et repères visuels autour de la méthode.",
          "An editorial space for introductions, excerpts, and visual references around the method.",
        ),
        sections: [
          richSection(
            t(locale, "En cours de migration", "In migration"),
            t(
              locale,
              "<p>La vidéothèque WordPress est en cours de réorganisation. Cette page prépare une version plus claire et reliée aux formations, thèmes et centres.</p>",
              "<p>The WordPress video library is being reorganized. This page prepares a clearer version connected to training, themes, and centers.</p>",
            ),
          ),
        ],
      });
    case "shop":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Boutique", "Shop"),
        subtitle: t(
          locale,
          "Une future vitrine plus lisible pour documents, ressources et inscriptions associées.",
          "A future clearer storefront for documents, resources, and related registration flows.",
        ),
        sections: [
          richSection(
            t(locale, "À venir", "Coming soon"),
            t(
              locale,
              "<p>La boutique fait partie des espaces en transition depuis le site WordPress historique.</p>",
              "<p>The shop is one of the spaces still transitioning from the historical WordPress site.</p>",
            ),
          ),
        ],
      });
    case "newsletter":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Infolettre", "Newsletter"),
        subtitle: t(
          locale,
          "Recevez les prochains ateliers, cohortes, ressources et ouvertures sans parcourir tout le site.",
          "Receive upcoming workshops, cohorts, resources, and openings without scanning the whole site.",
        ),
        sections: [
          richSection(
            t(locale, "Pourquoi s’inscrire", "Why subscribe"),
            t(
              locale,
              "<p>L’infolettre relie les nouveaux contenus, les annonces de centres, les nouvelles cohortes et les événements à venir.</p>",
              "<p>The newsletter connects new content, center updates, new cohorts, and upcoming events.</p>",
            ),
          ),
        ],
      });
    case "financing":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Financer ma formation", "Financing your training"),
        subtitle: t(
          locale,
          "Des repères pour comprendre les documents, les centres et les démarches possibles.",
          "A guide to documents, centers, and possible funding paths.",
        ),
        sections: [
          featureStack(t(locale, "Repères", "Guidance"), [
            {
              title: t(locale, "Comprendre le cadre", "Understand the framework"),
              body: t(locale, "Le financement varie selon le pays, le centre et votre situation professionnelle.", "Funding options vary by country, center, and professional situation."),
            },
            {
              title: t(locale, "Préparer le dossier", "Prepare the file"),
              body: t(locale, "Les fiches programme et les points de contact restent les documents clés.", "Program sheets and contact points remain the key documents."),
            },
          ]),
        ],
      });
    case "day-in-training":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Une journée dans la formation", "A day in training"),
        subtitle: t(
          locale,
          "Un aperçu du rythme, des séquences et de l’expérience vécue dans un segment de formation.",
          "A look at the rhythm, sequences, and lived experience of a training segment.",
        ),
        sections: [
          journey(t(locale, "Le déroulé", "The rhythm"), [
            {
              title: t(locale, "Leçon collective", "Group lesson"),
              description: t(locale, "Le travail commence souvent par une exploration guidée.", "Work often begins with a guided exploration."),
            },
            {
              title: t(locale, "Intégration", "Integration"),
              description: t(locale, "Temps de repos, observations, questions et mise en lien.", "Rest, observation, questions, and integration."),
            },
            {
              title: t(locale, "Transmission", "Transmission"),
              description: t(locale, "Alternance entre expérimentation, théorie et pratique en relation.", "Alternation between experimentation, theory, and relational practice."),
            },
          ]),
        ],
      });
    case "domains":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Domaines de recherche", "Domains of inquiry"),
        subtitle: t(
          locale,
          "Des portes d’entrée thématiques pour explorer comment la méthode Feldenkrais rencontre des besoins, pratiques et contextes différents.",
          "Thematic entry points to explore how the Feldenkrais Method meets different needs, practices, and contexts.",
        ),
        heroImageUrl: DEFAULT_HERO_IMAGE,
        primaryCta: {
          label: t(locale, "Voir le calendrier", "View the calendar"),
          url: localizePath(locale, "/calendar"),
        },
      });
    case "privacy":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Politique de confidentialité", "Privacy policy"),
        subtitle: t(
          locale,
          "Informations sur la gestion des données de contact, d’inscription et de navigation.",
          "Information about how contact, registration, and navigation data is handled.",
        ),
        sections: [
          richSection(
            t(locale, "Données collectées", "Collected data"),
            t(
              locale,
              "<p>Cette version Next prépare une politique plus lisible. En attendant, nous appliquons les mêmes principes que le site actuel : minimisation, usage contextualisé, et droit de contact pour toute demande.</p>",
              "<p>This Next version prepares a clearer policy. In the meantime, we apply the same principles as the current site: minimization, contextual use, and a direct contact path for any request.</p>",
            ),
          ),
        ],
      });
    case "terms":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Conditions générales", "Terms and conditions"),
        subtitle: t(
          locale,
          "Repères sur inscriptions, documents, modalités et cadre général.",
          "Guidance on registration, documents, modalities, and general framework.",
        ),
        sections: [
          richSection(
            t(locale, "Cadre général", "General framework"),
            t(
              locale,
              "<p>Cette page prépare une présentation plus claire des documents contractuels et des modalités associées aux formations et ateliers.</p>",
              "<p>This page prepares a clearer presentation of the contractual documents and terms associated with trainings and workshops.</p>",
            ),
          ),
        ],
      });
    case "complaints":
      return buildNarrativePage(locale, routeKey, {
        title: t(locale, "Réclamation", "Complaints"),
        subtitle: t(
          locale,
          "Un point d’entrée dédié pour signaler une difficulté et être orienté vers le bon interlocuteur.",
          "A dedicated entry point to report an issue and be oriented toward the right contact.",
        ),
        sections: [
          richSection(
            t(locale, "Comment procéder", "How to proceed"),
            t(
              locale,
              "<p>Expliquez brièvement la situation, le centre ou le programme concerné, et le suivi souhaité. L’équipe reviendra vers vous avec le bon canal de traitement.</p>",
              "<p>Briefly explain the situation, the center or program concerned, and the kind of follow-up needed. The team will come back to you through the appropriate channel.</p>",
            ),
          ),
          cta(
            t(locale, "Envoyer une demande", "Send a request"),
            t(locale, "Passez par la page de contact pour initier le suivi.", "Use the contact page to start the follow-up."),
            t(locale, "Contact", "Contact"),
            localizePath(locale, "/contact"),
          ),
        ],
      });
    default:
      return null;
  }
}

export function getEducationCenters(locale: string): EducationCenterProfile[] {
  const isFr = resolveLocale(locale) === "fr";

  return [
    {
      slug: "cantal",
      name: "Cantal",
      location: isFr ? "Auvergne, France" : "Auvergne, France",
      summary: t(
        locale,
        "Un cadre de retraite et de travail en profondeur, propice aux segments longs et à l’intégration.",
        "A retreat-like setting for deeper work, well suited to long segments and integration.",
      ),
      heroImageUrl: CANTAL_IMAGE,
      address: "38 Boulevard des Hortes, Aurillac",
      legacyTitle: t(locale, "Une oasis pour apprendre", "An oasis for learning"),
      overviewParagraphs: [
        t(
          locale,
          "Yvo et Pia ont consacré une grande partie de leur vie à l’art de l’enseignement et de la transmission. Ils ont enseigné le mouvement et le théâtre dans des villages ruraux, des centres de rééducation, des prisons et des écoles supérieures.",
          "Yvo and Pia have spent a large part of their lives refining the art of teaching and transmission. They have taught movement and theatre in rural villages, rehabilitation centers, prisons, and major schools.",
        ),
        t(
          locale,
          "Dans le Cantal, la formation prend la forme d’un séjour d’étude: montagnes, collines volcaniques, bibliothèque, cuisine et événements du soir créent un cadre où les étudiants finissent souvent par parler d’une seconde maison.",
          "In Cantal, the training takes on the form of a study retreat: mountains, volcanic hills, library, kitchen, and evening events create a setting students often end up calling a second home.",
        ),
      ],
      highlights: [
        {
          title: t(locale, "Rythme d’immersion", "Immersive rhythm"),
          body: t(
            locale,
            "Le centre se prête aux segments longs, à l’attention soutenue et à un temps réel d’intégration entre les sessions.",
            "The center is well suited to long segments, sustained attention, and real time for integration between sessions.",
          ),
        },
        {
          title: t(locale, "Cadre de retraite", "Retreat setting"),
          body: t(
            locale,
            "L’environnement contribue au travail: vues ouvertes, livres, peintures, discussions après les cours et une qualité de présence différente.",
            "The environment becomes part of the work: open views, books, paintings, conversations after class, and a different quality of presence.",
          ),
        },
        {
          title: t(locale, "Cohorte actuelle", "Current cohort"),
          body: t(
            locale,
            "Le centre porte actuellement l’ouverture Cantal 6, pensée pour les personnes qui cherchent un parcours approfondi et une continuité forte.",
            "The center currently carries the Cantal 6 opening, shaped for people looking for a deep pathway and strong continuity.",
          ),
        },
      ],
      teachers: [
        {
          name: "Pia Appelquist",
          body: t(
            locale,
            "Diplômée de la formation de Myriam Pfeffer à Paris en 2010, assistante formatrice certifiée depuis 2019, elle apporte au centre un regard attentif à la pédagogie et à la qualité d’accueil.",
            "A graduate of Myriam Pfeffer’s Paris training in 2010 and a certified assistant trainer since 2019, she brings close attention to pedagogy and the quality of welcome.",
          ),
        },
        {
          name: "Yvo Mentens",
          body: t(
            locale,
            "Il a suivi son premier cours de Feldenkrais il y a plus de trente ans. Son parcours donne au centre un ton de transmission mature, curieux et très concret.",
            "He took his first Feldenkrais lesson more than thirty years ago. His path gives the center a tone of mature, curious, and very grounded transmission.",
          ),
        },
      ],
      upcomingTraining: {
        name: "Cantal 6",
        body: t(
          locale,
          "Dans le Cantal, la formation professionnelle s’adresse aux personnes curieuses d’apprendre en profondeur, de développer leurs capacités, ou d’entrer dans une nouvelle pratique professionnelle sur quatre ans.",
          "In Cantal, the professional training is for people who want to learn deeply, develop their capacities, or enter a new professional practice over four years.",
        ),
        note: t(
          locale,
          "La cohorte répond aux exigences imposées par EuroTAB.",
          "The cohort meets the requirements imposed by EuroTAB.",
        ),
      },
      note: t(
        locale,
        "Le centre convient particulièrement bien aux personnes attirées par l’étude immersive et un environnement de retraite.",
        "This center is especially well suited to people drawn to immersive study and a retreat-like environment.",
      ),
      page: buildNarrativePage(locale, "center-cantal", {
        title: "Cantal",
        subtitle: t(
          locale,
          "Un centre d’étude inscrit dans un rythme plus contemplatif, entre immersion et ancrage.",
          "A study center shaped by a more contemplative rhythm, between immersion and grounding.",
        ),
        heroImageUrl: CANTAL_IMAGE,
        primaryCta: {
          label: t(locale, "Parler du centre du Cantal", "Talk through Cantal"),
          url: localizePath(locale, "/contact"),
        },
      }),
    },
    {
      slug: "brussels",
      name: isFr ? "Bruxelles" : "Brussels",
      location: isFr ? "Bruxelles, Belgique" : "Brussels, Belgium",
      summary: t(
        locale,
        "Un ancrage urbain et international pour les parcours, ateliers et ressources reliés au réseau belge.",
        "An urban and international anchor for pathways, workshops, and resources connected to the Belgian network.",
      ),
      heroImageUrl: BRUSSELS_IMAGE,
      address: "274 Rue des Alliés, 1190 Forest",
      legacyTitle: t(locale, "Un refuge dans la ville", "A haven in the city"),
      overviewParagraphs: [
        t(
          locale,
          "Bruxelles s’appuie sur Forest Lighthouse, un lieu où Feldenkrais dialogue avec la danse, les arts martiaux, le massage, la thérapie somatique et des projets artistiques plus larges.",
          "Brussels is anchored in Forest Lighthouse, a place where Feldenkrais meets dance, martial arts, massage, somatic therapy, and broader artistic projects.",
        ),
        t(
          locale,
          "Le résultat est un centre urbain, international et très vivant, où l’étude se déroule au milieu d’un vrai écosystème de pratiques. Cela donne à la formation un ton ouvert, inclusif et ancré dans la ville.",
          "The result is an urban, international, and very alive center where study happens inside a real ecosystem of practices. It gives the training an open, inclusive tone rooted in city life.",
        ),
      ],
      highlights: [
        {
          title: t(locale, "Cadre international", "International setting"),
          body: t(
            locale,
            "Bruxelles attire des étudiants qui cherchent une cohorte cosmopolite, connectée à plusieurs langues et à plusieurs scènes professionnelles.",
            "Brussels attracts students looking for a cosmopolitan cohort connected to multiple languages and professional scenes.",
          ),
        },
        {
          title: t(locale, "Forest Lighthouse", "Forest Lighthouse"),
          body: t(
            locale,
            "Le centre hôte relie formation, leçons, ateliers, studios de création et autres pratiques somatiques dans un même lieu.",
            "The host center brings together training, lessons, workshops, creative studios, and other somatic practices under one roof.",
          ),
        },
        {
          title: t(locale, "Cohorte actuelle", "Current cohort"),
          body: t(
            locale,
            "Bruxelles 5 est le point d’entrée actuel pour les personnes qui veulent étudier dans un rythme plus urbain, sans perdre la profondeur du parcours.",
            "Brussels 5 is the current entry point for people who want to study in a more urban rhythm without losing the depth of the pathway.",
          ),
        },
      ],
      teachers: [
        {
          name: "Nikos Appelqvist",
          body: t(
            locale,
            "Praticien Feldenkrais certifié et cofondateur de Forest Lighthouse, il contribue à donner à Bruxelles un ton accueillant, entrepreneurial et très orienté vers la transmission.",
            "A certified Feldenkrais practitioner and co-founder of Forest Lighthouse, he helps give Brussels a welcoming, entrepreneurial, and transmission-oriented tone.",
          ),
        },
        {
          name: "Betzabel Falfan",
          body: t(
            locale,
            "Praticienne certifiée et cofondatrice du centre, elle anime des cours hebdomadaires et des séances individuelles avec une attention forte portée à l’accompagnement des parcours.",
            "A certified practitioner and co-founder of the center, she leads weekly classes and individual sessions with a strong focus on accompanying people’s pathways.",
          ),
        },
      ],
      upcomingTraining: {
        name: isFr ? "Bruxelles 5" : "Brussels 5",
        body: t(
          locale,
          "À Bruxelles, la formation professionnelle s’adresse aux personnes qui veulent apprendre la méthode en profondeur, l’inscrire dans leur pratique et rejoindre une communauté internationale de praticiens.",
          "In Brussels, the professional training is for people who want to learn the method deeply, root it in their practice, and join an international community of practitioners.",
        ),
        note: t(
          locale,
          "La cohorte répond aux exigences imposées par EuroTAB.",
          "The cohort meets the requirements imposed by EuroTAB.",
        ),
      },
      note: t(
        locale,
        "Le centre convient bien aux personnes qui cherchent un environnement de ville, un réseau large et une énergie de projet très concrète.",
        "This center suits people looking for a city environment, a broad network, and a very concrete project energy.",
      ),
      page: buildNarrativePage(locale, "center-brussels", {
        title: isFr ? "Bruxelles" : "Brussels",
        subtitle: t(
          locale,
          "Un point d’entrée central pour la Belgique et un lieu de croisement entre pratiques et cohortes.",
          "A central entry point for Belgium and a place where practices and cohorts meet.",
        ),
        heroImageUrl: BRUSSELS_IMAGE,
        primaryCta: {
          label: t(locale, "Parler du centre de Bruxelles", "Talk through Brussels"),
          url: localizePath(locale, "/contact"),
        },
      }),
    },
    {
      slug: "paris",
      name: "Paris",
      location: "Paris, France",
      summary: t(
        locale,
        "Un centre lié à la vitalité parisienne, aux transmissions régulières et aux parcours professionnels.",
        "A center connected to the energy of Paris, ongoing transmission, and professional pathways.",
      ),
      heroImageUrl: PARIS_IMAGE,
      address: "53 Rue Camélinat, 94400 Vitry-sur-Seine",
      legacyTitle: t(locale, "Un héritage qui perdure", "An enduring legacy"),
      overviewParagraphs: [
        t(
          locale,
          "Paris 14 reprend le flambeau plus de dix ans après la dernière formation professionnelle de Myriam Pfeffer. Le centre s’inscrit dans une filiation directe avec l’histoire de la méthode dans l’espace francophone.",
          "Paris 14 picks up the torch more than a decade after Myriam Pfeffer’s last professional training. The center stands in direct continuity with the history of the method in the French-speaking world.",
        ),
        t(
          locale,
          "Avec Sabine Pfeffer et l’héritage d’Accord Mobile, Paris met la transmission elle-même au premier plan: fidélité à la source, exigence pédagogique, et attention portée à l’expérience singulière de chaque étudiant.",
          "With Sabine Pfeffer and the legacy of Accord Mobile, Paris places transmission itself at the center: fidelity to the source, pedagogical rigor, and attention to each student’s individual experience.",
        ),
      ],
      highlights: [
        {
          title: t(locale, "Proximité avec la source", "Close to the source"),
          body: t(
            locale,
            "Le centre assume une relation explicite à l’histoire de Myriam Pfeffer et à la transmission directe issue des premières formations.",
            "The center takes on an explicit relationship to Myriam Pfeffer’s history and to the direct transmission coming from the first trainings.",
          ),
        },
        {
          title: t(locale, "Innovation dans la pratique", "Innovation in practice"),
          body: t(
            locale,
            "Cet héritage n’est pas traité comme un musée: il est mis au service de l’expérience actuelle des étudiants et de l’invention pédagogique.",
            "That heritage is not treated like a museum piece: it is used in service of current student experience and pedagogical invention.",
          ),
        },
        {
          title: t(locale, "Cohorte actuelle", "Current cohort"),
          body: t(
            locale,
            "Paris 14 est le point d’entrée actuel pour les personnes attirées par cette lignée de transmission et une forte densité pédagogique.",
            "Paris 14 is the current entry point for people drawn to that lineage of transmission and a strong pedagogical density.",
          ),
        },
      ],
      teachers: [
        {
          name: "Lionel González",
          body: t(
            locale,
            "Après un parcours en sciences puis dans le théâtre, il apporte une sensibilité très articulée entre scène, voix, présence et apprentissage.",
            "After a path through science and then theatre, he brings a very articulated sensitivity linking stage work, voice, presence, and learning.",
          ),
        },
        {
          name: "Daniel Cohen-Seat",
          body: t(
            locale,
            "Son travail sur le théâtre, la voix et la transmission nourrit une approche du centre où l’attention à l’expression et à la relation est particulièrement fine.",
            "His work in theatre, voice, and transmission feeds a center approach where attention to expression and relationship is particularly refined.",
          ),
        },
      ],
      upcomingTraining: {
        name: "Paris 14",
        body: t(
          locale,
          "À Paris, la formation professionnelle s’adresse à celles et ceux qui veulent apprendre dans une lignée historique forte tout en mettant cet héritage au service d’une pratique vivante.",
          "In Paris, the professional training is for people who want to learn inside a strong historical lineage while putting that heritage in service of a living practice.",
        ),
        note: t(
          locale,
          "La cohorte a l’intention de demander une accréditation EuroTAB.",
          "The cohort intends to apply for EuroTAB accreditation.",
        ),
      },
      note: t(
        locale,
        "Le centre convient bien aux personnes attirées par la continuité historique, la qualité de transmission et un cadre d’étude dense.",
        "This center suits people drawn to historical continuity, transmission quality, and a dense study environment.",
      ),
      page: buildNarrativePage(locale, "center-paris", {
        title: "Paris",
        subtitle: t(
          locale,
          "Un centre au croisement de la transmission, de la pratique régulière et des parcours de formation.",
          "A center at the intersection of transmission, regular practice, and training pathways.",
        ),
        heroImageUrl: PARIS_IMAGE,
        primaryCta: {
          label: t(locale, "Parler du centre de Paris", "Talk through Paris"),
          url: localizePath(locale, "/contact"),
        },
      }),
    },
  ];
}

export function getEducationCenter(locale: string, slug: string) {
  return getEducationCenters(locale).find((center) => center.slug === slug) ?? null;
}

export function getEducationLogoMarkUrl() {
  return EDUCATION_LOGO_MARK_URL;
}
