import type { OfferSummary } from "@/lib/api";
import { resolveLocale } from "@/lib/i18n";
import { localizePath } from "@/lib/locale-path";
import {
  asRecord,
  formatDateTime,
  getCanonicalOfferPath,
  getOfferSlug,
  getOfferTitle,
  pickString,
  readNextOccurrence,
} from "@/lib/offers";
import type { NarrativePage } from "@/lib/site-config";
import type { LocaleCode } from "@/lib/types";

export type EducationWorkshopCollectionItem = {
  id: string;
  title: string;
  summary: string;
  href: string;
  imageUrl: string | null;
  sourceLabel: string;
  locationLabel?: string | null;
  monthLabel?: string | null;
  audienceLabel?: string | null;
  whenLabel?: string | null;
  external?: boolean;
};

export type EducationIntroWorkshopDetail = {
  slug: string;
  monthLabel: string;
  story: string;
  highlights: string[];
  facts: Array<{ label: string; value: string }>;
  page: NarrativePage;
};

export type EducationIntroWorkshopSession = {
  city: string;
  dateLabel: string;
  location: string;
  hours: string;
  price: string;
  note: string;
  signUpUrl: string;
};

export type EducationAtelierIntroContent = {
  page: NarrativePage;
  byline: string;
  videoId: string;
  lead: string;
  storyParagraphs: string[];
  teacherIntro: string;
  teacherSlugs: string[];
  audience: string[];
  reasons: string[];
  professionalTraining: string;
  platformIntro: string;
  platformFeatures: string[];
  sessions: EducationIntroWorkshopSession[];
  signUpUrl: string;
};

const FOREST_FEATURED_WORKSHOP_SLUGS = [
  "the-practitioners-vocal-toolkit",
  "feldenkrais-for-musicians",
] as const;

const FOREST_FEATURED_WORKSHOP_META: Record<
  (typeof FOREST_FEATURED_WORKSHOP_SLUGS)[number],
  {
    location: { en: string; fr: string };
    audience: "practitioners" | "public";
    localizedCopy?: {
      fr?: {
        title: string;
        summary: string;
      };
    };
  }
> = {
  "the-practitioners-vocal-toolkit": {
    location: { en: "Brussels", fr: "Bruxelles" },
    audience: "practitioners",
    localizedCopy: {
      fr: {
        title: "La boîte à outils vocale du praticien",
        summary: "10 leçons pour travailler avec les chanteurs et les voix du point de vue Feldenkrais.",
      },
    },
  },
  "feldenkrais-for-musicians": {
    location: { en: "Brussels", fr: "Bruxelles" },
    audience: "public",
    localizedCopy: {
      fr: {
        title: "Feldenkrais pour les musiciens",
        summary: "Un workshop hybride pour musiciens et praticien·nes certifié·es.",
      },
    },
  },
};

function t(locale: string, fr: string, en: string) {
  return resolveLocale(locale) === "fr" ? fr : en;
}

function capitalize(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function truncateText(value: string, limit: number) {
  const cleaned = value.trim();
  if (cleaned.length <= limit) {
    return cleaned;
  }

  const clipped = cleaned.slice(0, Math.max(0, limit - 1));
  const lastSpace = clipped.lastIndexOf(" ");
  const safeClip = lastSpace > 24 ? clipped.slice(0, lastSpace) : clipped;
  return `${safeClip.trimEnd()}…`;
}

function formatMonthLabel(dateValue: string, locale: string) {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return capitalize(
    new Intl.DateTimeFormat(resolveLocale(locale), {
      month: "long",
      timeZone: "UTC",
    }).format(parsed),
  );
}

function readFirstOccurrenceStart(record: Record<string, unknown>) {
  const occurrences = Array.isArray(record.occurrences) ? record.occurrences : [];
  const first = occurrences[0];
  if (!first || typeof first !== "object") {
    return null;
  }

  return pickString(first as Record<string, unknown>, ["start_datetime", "start", "starts_at"]) || null;
}

function inferAudienceLabel(locale: string, ...parts: Array<string | null | undefined>) {
  const haystack = parts
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .toLowerCase();

  if (/(certified practitioner|practitioner|praticien)/.test(haystack)) {
    return t(locale, "Praticiens", "Practitioners");
  }

  return t(locale, "Ouvert au public", "Open to public");
}

function inferLocationLabel(locale: string, record: Record<string, unknown> | null) {
  const rawLocation =
    pickString(record, ["city", "location", "venue_city", "venue", "center_name"]) ||
    pickString(record, ["center_slug"]);

  if (!rawLocation) {
    return null;
  }

  const normalized = rawLocation.trim().toLowerCase();
  if (normalized.includes("brussels")) {
    return t(locale, "Bruxelles", "Brussels");
  }
  if (normalized.includes("paris")) {
    return "Paris";
  }
  if (normalized.includes("toulouse")) {
    return "Toulouse";
  }
  if (normalized.includes("cantal")) {
    return "Cantal";
  }

  return capitalize(rawLocation.trim());
}

function buildNarrativePage(
  locale: string,
  slug: string,
  title: string,
  subtitle: string,
  imageUrl: string,
): NarrativePage {
  return {
    routeKey: slug,
    locale: resolveLocale(locale),
    title,
    subtitle,
    hero: {
      title,
      body: subtitle,
      imageUrl,
    },
    sections: [],
    primaryCta: {
      label: t(locale, "Voir la formation", "Explore the training"),
      url: localizePath(locale, "/trainings"),
    },
    seo: {
      title: `${title} | Feldenkrais Education`,
      description: subtitle,
    },
  };
}

function mergeNarrativePage(page: NarrativePage | null | undefined, fallbackPage: NarrativePage): NarrativePage {
  if (!page) {
    return fallbackPage;
  }

  return {
    ...page,
    title: page.title || fallbackPage.title,
    subtitle: page.subtitle || fallbackPage.subtitle,
    hero: {
      ...page.hero,
      title: page.hero.title || page.title || fallbackPage.hero.title,
      body: page.hero.body || page.subtitle || fallbackPage.hero.body,
      imageUrl: page.hero.imageUrl || fallbackPage.hero.imageUrl,
    },
    primaryCta: page.primaryCta ?? fallbackPage.primaryCta,
    seo: {
      title: page.seo?.title || fallbackPage.seo?.title,
      description: page.seo?.description || fallbackPage.seo?.description,
    },
  };
}

export function getEducationAtelierIntroContent(
  locale: string,
  backendPage?: NarrativePage | null,
): EducationAtelierIntroContent {
  const fallbackPage = buildNarrativePage(
    locale,
    "atelier_intro",
    t(locale, "Introduction à la méthode Feldenkrais", "Introduction to the Feldenkrais Method"),
    t(
      locale,
      "Comprendre et appliquer les stratégies neurosomatiques dans votre profession et dans votre vie quotidienne.",
      "Understand and apply neurosomatic strategies in your profession and in everyday life.",
    ),
    "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/10/1085_11201349_S321.jpg",
  );

  return {
    page: mergeNarrativePage(backendPage, {
      ...fallbackPage,
      hero: {
        ...fallbackPage.hero,
        title: t(
          locale,
          "Introduction à la Formation Professionnelle Feldenkrais®",
          "Introduction to the Feldenkrais Professional Training®",
        ),
      },
      primaryCta: null,
      seo: {
        title: `${t(locale, "Introduction à la méthode Feldenkrais", "Introduction to the Feldenkrais Method")} | Feldenkrais Education`,
        description: t(
          locale,
          "Une introduction de 4 jours avec Pia Appelquist et Yvo Mentens pour découvrir les stratégies neurosomatiques, la pédagogie FE et les prochaines dates à Toulouse et Paris.",
          "A 4-day introduction with Pia Appelquist and Yvo Mentens to discover neurosomatic strategies, the FE pedagogy, and the upcoming Toulouse and Paris dates.",
        ),
      },
    }),
    byline: t(
      locale,
      "Avec Pia Appelquist & Yvo Mentens, directeurs pédagogiques",
      "With Pia Appelquist & Yvo Mentens, educational directors",
    ),
    videoId: "Fia0H2Am7eM",
    lead: t(
      locale,
      "Lors de ce stage, Pia et Yvo vous guideront pour observer et ressentir comment changer ses habitudes de mouvement peut influencer la manière de penser, de ressentir et de percevoir. Vous découvrirez aussi des stratégies simples, que nous appelons neurosomatiques, pour développer cette capacité, à la fois pour vous-même et dans un cadre professionnel.",
      "During this workshop, Pia and Yvo will guide you to observe and feel how changing movement habits can influence the way you think, feel, and perceive. You will also discover simple strategies, which we call neurosomatic, to develop this capacity for yourself and within a professional context.",
    ),
    storyParagraphs: [
      t(
        locale,
        "Ces quatre jours proposent une approche simple et globale du changement. Plutôt que de se concentrer sur un symptôme ou une performance, on observe comment toute la personne fonctionne ensemble : la perception, l’attention, les émotions et l’action évoluent en même temps, à travers le mouvement.",
        "These four days offer a simple and global approach to change. Rather than focusing on a symptom or a performance, we observe how the whole person functions together: perception, attention, emotions, and action evolve at the same time through movement.",
      ),
      t(
        locale,
        "Ce n’est ni une liste de techniques ni une méthode pour corriger, mais une façon d’apprendre qui peut devenir à la fois une pratique professionnelle et une manière de vivre.",
        "It is neither a list of techniques nor a method of correction, but a way of learning that can become both a professional practice and a way of living.",
      ),
    ],
    teacherIntro: t(
      locale,
      "Pia Appelquist et Yvo Mentens cumulent plus de 10 000 heures d’expérience et ont accompagné près de 10 formations. Ils vous guideront à travers des leçons de Prise de Conscience par le Mouvement® et vous introduiront aux stratégies neurosomatiques afin que vous puissiez les relier concrètement à votre vie quotidienne et, si vous le souhaitez, à votre pratique professionnelle.",
      "Pia Appelquist and Yvo Mentens bring together more than 10,000 hours of experience and have accompanied close to 10 trainings. They will guide you through Awareness Through Movement® lessons and introduce neurosomatic strategies you can connect directly to everyday life and, if you wish, to your professional practice.",
    ),
    teacherSlugs: ["pia-appelquist", "yvo-mentens"],
    audience: [
      t(
        locale,
        "À toutes celles et ceux qui souhaitent mieux comprendre le lien entre le mouvement, l’apprentissage et l’agentivité.",
        "Anyone who wants to better understand the link between movement, learning, and agency.",
      ),
      t(locale, "Artistes, enseignants, thérapeutes.", "Artists, teachers, and therapists."),
      t(
        locale,
        "Professionnel·les du soin ou du sport, ingénieur·es, chercheur·ses.",
        "Care or sports professionals, engineers, and researchers.",
      ),
      t(
        locale,
        "Pédagogues, éducateur·rices, et toute personne désireuse de mieux se connaître à travers le mouvement.",
        "Pedagogues, educators, and anyone wishing to know themselves better through movement.",
      ),
    ],
    reasons: [
      t(
        locale,
        "Pour entamer une approche concrète de la neuroplasticité et de l’apprentissage somatique, et goûter à une pédagogie qui relie mouvement, pensée et émotions.",
        "To begin a concrete approach to neuroplasticity and somatic learning, and to experience a pedagogy that links movement, thought, and emotion.",
      ),
      t(
        locale,
        "Pour retrouver, à travers le mouvement, le lien entre intention, sensation et action, dans une exploration douce qui réveille confiance, créativité et adaptabilité.",
        "To rediscover through movement the link between intention, sensation, and action, in a gentle exploration that awakens confidence, creativity, and adaptability.",
      ),
      t(
        locale,
        "Pour découvrir des stratégies neurosomatiques qui réorganisent avec finesse les schémas habituels et améliorent souvent la fonction motrice de manière puissante et inattendue.",
        "To discover neurosomatic strategies that subtly reorganize habitual patterns and often improve motor function in powerful and unexpected ways.",
      ),
      t(
        locale,
        "Pour vivre l’expérience concrète des quatre premiers jours d’une formation professionnelle.",
        "To live through the concrete experience of the first four days of a professional training.",
      ),
      t(
        locale,
        "Pour expérimenter la pédagogie vivante du Feldenkrais® avant de s’engager dans la formation professionnelle.",
        "To experience the living pedagogy of Feldenkrais® before committing to the professional training.",
      ),
    ],
    professionalTraining: t(
      locale,
      "Les formations certifiées (Qualiopi) dirigées par Pia et Yvo permettent chaque année à de nombreuses personnes de devenir praticiens et praticiennes Feldenkrais. Lors de ce stage, vous aurez un aperçu concret de l’expérience vécue dans la formation, et l’occasion d’échanger librement avec les formateurs pour poser toutes vos questions sur le parcours professionnel.",
      "The certified trainings led by Pia and Yvo help many people each year become Feldenkrais practitioners. During this workshop, you will get a concrete glimpse of the lived training experience and the chance to speak freely with the trainers about the professional pathway.",
    ),
    platformIntro: t(
      locale,
      "Pour prolonger l’expérience et ancrer durablement vos acquis, votre participation à ce stage inclut désormais 2 mois d’accès gratuit à notre plateforme d’éducation neurosomatique.",
      "To extend the experience and anchor what you discover, your participation in this workshop now includes 2 months of free access to our neurosomatic education platform.",
    ),
    platformFeatures: [
      t(locale, "Cours hebdomadaires en direct & replays", "Weekly live classes and replays"),
      t(locale, "Plus de 200 leçons déjà disponibles", "More than 200 lessons already available"),
      t(locale, "Accès aux enregistrements de notre programme de 12 semaines", "Access to the recordings of our 12-week program"),
      t(locale, "26 documentaires", "26 documentaries"),
      t(locale, "Séries thématiques de leçons", "Thematic lesson series"),
    ],
    sessions: [
      {
        city: "Toulouse",
        dateLabel: t(locale, "30 avril au 3 mai 2026", "April 30 to May 3, 2026"),
        location: "ESPACE ALLEGRIA, 110 Rue Achille Viadieu, 31400 Toulouse",
        hours: t(locale, "10h00 à 16h00", "10:00 to 16:00"),
        price: "210 €",
        signUpUrl: "https://api.forest-lighthouse.be/events/signup/3/",
        note: t(
          locale,
          "Ces quatre jours peuvent être validés si vous décidez ensuite de poursuivre le cursus de 4 ans.",
          "These four days can count toward the 4-year curriculum if you later decide to continue.",
        ),
      },
      {
        city: "Paris",
        dateLabel: t(locale, "14 mai au 17 mai 2026", "May 14 to May 17, 2026"),
        location: "53 Rue Camélinat, 94400 Vitry-sur-Seine, France",
        hours: t(locale, "10h00 à 16h00", "10:00 to 16:00"),
        price: "210 €",
        signUpUrl: "https://api.forest-lighthouse.be/events/signup/4/",
        note: t(
          locale,
          "Ces quatre jours peuvent être validés si vous décidez ensuite de poursuivre le cursus de 4 ans.",
          "These four days can count toward the 4-year curriculum if you later decide to continue.",
        ),
      },
    ],
    signUpUrl: "https://feldenkrais-education.com/inscription/",
  };
}

export function getEducationIntroWorkshopDetails(locale: string): EducationIntroWorkshopDetail[] {
  return [
    {
      slug: "introduction-to-the-training-april",
      monthLabel: t(locale, "Avril", "April"),
      story: t(
        locale,
        "Une rencontre d'introduction pour découvrir le parcours de formation Feldenkrais, la logique des segments, et le type d'engagement demandé avant de déposer une candidature.",
        "An introductory session to discover the Feldenkrais training pathway, the rhythm of the segments, and the kind of commitment the program asks for before you apply.",
      ),
      highlights: [
        t(locale, "Vue d'ensemble de la formation professionnelle et de ses centres", "Overview of the professional training and its centers"),
        t(locale, "Lecture du rythme du parcours: segments, pratique, soutien entre les sessions", "A clear read on the rhythm of the pathway: segments, practice, and support between sessions"),
        t(locale, "Temps de questions pour vérifier si le parcours vous correspond", "Time for questions so you can test whether the pathway fits you"),
      ],
      facts: [
        { label: t(locale, "Mois", "Month"), value: t(locale, "Avril", "April") },
        { label: t(locale, "Format", "Format"), value: t(locale, "Rencontre d'introduction en ligne", "Online introduction session") },
        { label: t(locale, "Pour qui", "Best for"), value: t(locale, "Personnes qui envisagent la formation", "People considering the training") },
      ],
      page: buildNarrativePage(
        locale,
        "introduction-to-the-training-april",
        t(locale, "Introduction à la formation · Avril", "Introduction to the training · April"),
        t(
          locale,
          "Une porte d'entrée simple pour comprendre la formation professionnelle Feldenkrais.",
          "A simple first entry point into the Feldenkrais professional training.",
        ),
        "/brands/feldenkrais-education/training/year-1.jpeg",
      ),
    },
    {
      slug: "introduction-to-the-training-may",
      monthLabel: t(locale, "Mai", "May"),
      story: t(
        locale,
        "Une seconde session d'introduction pensée pour les personnes qui veulent préciser leurs questions, comparer les centres, et mieux sentir comment la formation s'inscrit dans leur vie.",
        "A second introduction session for people who want to refine their questions, compare centers, and understand how the training could fit into their life.",
      ),
      highlights: [
        t(locale, "Approche pédagogique et ambiance du cursus", "Pedagogical approach and the atmosphere of the training"),
        t(locale, "Repères pour choisir entre les centres et comprendre leur rythme", "Pointers for choosing between centers and understanding their rhythm"),
        t(locale, "Clarté sur les prochaines étapes: page formation, PDF et appel", "Clarity on the next steps: training page, PDF, and call"),
      ],
      facts: [
        { label: t(locale, "Mois", "Month"), value: t(locale, "Mai", "May") },
        { label: t(locale, "Format", "Format"), value: t(locale, "Rencontre d'introduction en ligne", "Online introduction session") },
        { label: t(locale, "Pour qui", "Best for"), value: t(locale, "Personnes qui veulent aller plus loin", "People who want to go one step further") },
      ],
      page: buildNarrativePage(
        locale,
        "introduction-to-the-training-may",
        t(locale, "Introduction à la formation · Mai", "Introduction to the training · May"),
        t(
          locale,
          "Une session pour avancer avec plus de clarté avant une éventuelle candidature.",
          "A session to move forward with more clarity before a possible application.",
        ),
        "/brands/feldenkrais-education/training/hero-room.jpeg",
      ),
    },
  ];
}

export function getEducationIntroWorkshopBySlug(locale: string, slug: string) {
  return getEducationIntroWorkshopDetails(locale).find((workshop) => workshop.slug === slug) ?? null;
}

export function mapOfferToEducationWorkshopCollectionItem(
  offer: OfferSummary,
  locale: string,
): EducationWorkshopCollectionItem | null {
  const slug = getOfferSlug(offer);
  if (!slug) {
    return null;
  }

  const record = asRecord(offer);
  const nextOccurrence = readNextOccurrence(offer);

  return {
    id: `offer:${slug}`,
    title: getOfferTitle(offer, t(locale, "Stage FE", "FE workshop")),
    summary: truncateText(
      pickString(record, ["excerpt", "summary", "short_description"]) ||
      t(
        locale,
        "Retrouvez les détails, l'équipe et les prochaines informations de ce workshop FE.",
        "Open the workshop page for the details, teaching team, and next information.",
      ),
      60,
    ),
    href: localizePath(locale, getCanonicalOfferPath(offer) || `/workshops/${slug}`),
    imageUrl: pickString(record, ["hero_image_url", "heroImageUrl", "image_url", "imageUrl"]) || null,
    sourceLabel: "Feldenkrais Education",
    locationLabel: inferLocationLabel(locale, record),
    monthLabel: nextOccurrence.start ? formatMonthLabel(nextOccurrence.start, locale) : null,
    audienceLabel: inferAudienceLabel(
      locale,
      getOfferTitle(offer, ""),
      pickString(record, ["subtitle", "excerpt", "summary", "short_description"]),
    ),
    whenLabel: nextOccurrence.start
      ? formatDateTime(nextOccurrence.start, locale, nextOccurrence.timezone)
      : null,
  };
}

export function buildEducationWorkshopCollection(
  locale: string,
  offers: OfferSummary[],
  forestWorkshops: EducationWorkshopCollectionItem[],
): EducationWorkshopCollectionItem[] {
  const introWorkshopHref = localizePath(resolveLocale(locale), "/atelier_intro");
  const introWorkshops = getEducationIntroWorkshopDetails(locale).map((workshop) => ({
    id: `intro:${workshop.slug}`,
    title: workshop.page.title,
    summary: truncateText(workshop.page.subtitle || workshop.story, 60),
    href: introWorkshopHref,
    imageUrl: workshop.page.hero.imageUrl || null,
    sourceLabel: "Feldenkrais Education",
    locationLabel: workshop.slug.includes("april")
      ? "Toulouse"
      : "Paris",
    monthLabel: workshop.monthLabel,
    audienceLabel: t(locale, "Ouvert au public", "Open to public"),
  }));
  const dynamicWorkshops = offers
    .map((offer) => mapOfferToEducationWorkshopCollectionItem(offer, locale))
    .filter((item): item is EducationWorkshopCollectionItem => item !== null);

  const seen = new Set<string>();

  return [...introWorkshops, ...dynamicWorkshops, ...forestWorkshops].filter((workshop) => {
    const key = `${workshop.href}::${workshop.title}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export async function fetchForestFeaturedWorkshops(locale: string): Promise<EducationWorkshopCollectionItem[]> {
  const workshopResults = await Promise.all(
    FOREST_FEATURED_WORKSHOP_SLUGS.map(async (slug) => {
      const requestedLocale = resolveLocale(locale);
      const candidateLocales: LocaleCode[] = requestedLocale === "fr" ? ["fr", "en"] : [requestedLocale];
      let item: Record<string, unknown> | null = null;
      let resolvedLocale = requestedLocale;

      for (const candidateLocale of candidateLocales) {
        const response = await fetch(
          `https://api.forest-lighthouse.be/api/offers/${slug}?domain=forest-lighthouse.be&locale=${candidateLocale}`,
          { next: { revalidate: 1800 } },
        ).catch(() => null);

        if (!response?.ok) {
          continue;
        }

        const payload = (await response.json().catch(() => null)) as unknown;
        item = asRecord(payload);
        if (item) {
          resolvedLocale = candidateLocale;
          break;
        }
      }

      if (!item) {
        return null;
      }

      const firstOccurrenceStart = readFirstOccurrenceStart(item);
      const featuredMeta = FOREST_FEATURED_WORKSHOP_META[slug];
      const localizedCopy =
        resolvedLocale !== requestedLocale
          ? featuredMeta.localizedCopy?.[requestedLocale as "fr"]
          : undefined;

      return {
        id: `forest:${slug}`,
        title: localizedCopy?.title || pickString(item, ["title", "name"], "Forest Lighthouse workshop"),
        summary: truncateText(
          localizedCopy?.summary ||
            pickString(item, ["excerpt", "summary", "subtitle", "short_description"]) ||
            t(locale, "Workshop invité depuis Forest Lighthouse.", "Guest workshop from Forest Lighthouse."),
          60,
        ),
        href: `https://www.forest-lighthouse.be/${resolvedLocale}/workshops/${slug}`,
        imageUrl: pickString(item, ["hero_image_url", "heroImageUrl", "image_url", "imageUrl"]) || null,
        sourceLabel: "Forest Lighthouse",
        locationLabel: featuredMeta.location[requestedLocale === "fr" ? "fr" : "en"],
        monthLabel: firstOccurrenceStart ? formatMonthLabel(firstOccurrenceStart, locale) : null,
        audienceLabel:
          featuredMeta.audience === "practitioners"
            ? t(locale, "Praticiens", "Practitioners")
            : t(locale, "Ouvert au public", "Open to public"),
        whenLabel: firstOccurrenceStart ? formatDateTime(firstOccurrenceStart, locale, "Europe/Brussels") : null,
        external: true,
      } satisfies EducationWorkshopCollectionItem;
    }),
  );

  const workshops: EducationWorkshopCollectionItem[] = [];
  for (const workshop of workshopResults) {
    if (workshop) {
      workshops.push(workshop);
    }
  }

  return workshops;
}
