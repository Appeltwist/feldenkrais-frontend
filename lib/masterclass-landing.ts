import type { OfferDetail } from "@/lib/types";
import { buildVimeoEmbedUrl, parseVimeoVideo } from "@/lib/video-embed";
import { getFacilitatorName, getFacilitators } from "@/lib/offers";
import {
  EDUCATION_MASTERCLASS_COVER_MAP,
  EDUCATION_MASTERCLASS_PURCHASE_LINKS,
  EDUCATION_MASTERCLASS_TEACHER_IMAGE_MAP,
  resolveEducationMasterclassSlug,
  type EducationMasterclassSlug,
} from "@/lib/education-masterclass-media";

export type MasterclassFaqItem = {
  question: string;
  answer: string;
};

export type MasterclassFaqTab = {
  id: string;
  label: string;
  items: MasterclassFaqItem[];
};

export type MasterclassAudienceCard = {
  title: string;
  description: string;
};

export type MasterclassBenefitItem = {
  title: string;
  description: string;
};

export type MasterclassContentItem = {
  title: string;
  description: string;
};

export type MasterclassSampleMeta = {
  teacher: string;
  length: string;
  language: string;
};

export type MasterclassLandingData = {
  slug: string;
  title: string;
  facilitator: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImageUrl: string;
  teacherImageUrl: string;
  galleryImageUrls: string[];
  samplePosterUrl: string;
  priceText: string;
  purchaseLine: string;
  guaranteeLine: string;
  buyUrl: string;
  giftUrl: string;
  sampleVideoUrl: string;
  sampleDescription: string[];
  sampleMeta: MasterclassSampleMeta;
  overviewTeacherName: string;
  overviewTeacherBio: string[];
  contentItems: MasterclassContentItem[];
  audienceCards: MasterclassAudienceCard[];
  benefitItems: MasterclassBenefitItem[];
  faqTabs: MasterclassFaqTab[];
};

const MASTERCLASS_ASSET_MAP = Object.fromEntries(
  Object.entries(EDUCATION_MASTERCLASS_COVER_MAP).map(([slug, heroImageUrl]) => [
    slug,
    {
      heroImageUrl,
      teacherImageUrl:
        EDUCATION_MASTERCLASS_TEACHER_IMAGE_MAP[
          slug as EducationMasterclassSlug
        ],
    },
  ]),
) as Record<string, { heroImageUrl: string; teacherImageUrl: string }>;

function buildGalleryUrls(slug: string, filenames: string[]) {
  return filenames.map((filename) => `/brands/feldenkrais-education/masterclasses/galleries/${slug}/${filename}`);
}

const MASTERCLASS_GALLERY_MAP: Record<string, string[]> = {
  "unlearning-pain": buildGalleryUrls("unlearning-pain", [
    "Howard_1.41.1-2-Large.jpeg",
    "Howard_1.41.1-Large.jpeg",
    "Howard_1.366.1-Large.jpeg",
    "Howard_1.602.1-Large.jpeg",
    "Howard_1.621.1-Large.jpeg",
    "Howard_1.731.1-Large.jpeg",
    "Howard_1.916.1-Large.jpeg",
    "Howard_1.983.1-Large.jpeg",
    "Howard_1.1075.1-Large.jpeg",
    "Howard_1.1111.1-Large.jpeg",
    "Howard_1.1120.1-Large.jpeg",
    "Howard_1.1301.1-Large.jpeg",
    "Howard_1.1326.1-Large.jpeg",
    "Howard_1.1331.1-Large.jpeg",
    "Howard_1.1400.1-Large.jpeg",
    "Howard_1.1529.1-Large.jpeg",
    "Howard_1.1593.1-Large.jpeg",
    "Howard_1.1703.1-Large.jpeg",
    "Howard_1.1706.1-Large.jpeg",
    "Howard_1.1721.1-Large.jpeg",
    "Howard_1.1736.1-Large.jpeg",
    "Howard_1.1777.1-Large.jpeg",
    "Howard_1.2065.1-Large.jpeg",
    "Howard_1.2272.1-Large.jpeg",
    "Howard_1.2461.1-Large.jpeg",
    "Howard_1.2500.1-Large.jpeg",
    "Howard_1.2557.1-Large.jpeg",
  ]),
  "the-skeletal-voice": buildGalleryUrls("the-skeletal-voice", [
    "Screenshot-2025-12-08-at-15.12.01-Large.jpeg",
    "Screenshot-2025-12-08-at-15.11.40-Large.jpeg",
    "Screenshot-2025-12-08-at-15.09.15-Large.jpeg",
    "Screenshot-2025-12-08-at-15.09.41-Large.jpeg",
    "Screenshot-2025-12-08-at-15.08.09-Large.jpeg",
    "Screenshot-2025-12-08-at-15.07.58-Large.jpeg",
  ]),
  "the-singers-voice": buildGalleryUrls("the-singers-voice", [
    "Screenshot-2025-12-08-at-15.22.51-Large.jpeg",
    "Screenshot-2025-12-08-at-15.21.10-Large.jpeg",
    "Screenshot-2025-12-08-at-15.20.10-Large.jpeg",
    "Screenshot-2025-12-08-at-15.16.31-Large.jpeg",
    "Screenshot-2025-12-08-at-15.15.43-Large.jpeg",
  ]),
  "feldenkrais-for-sports": buildGalleryUrls("feldenkrais-for-sports", [
    "DSC06677.jpg",
    "DSC05297.jpg",
    "DSC05302.jpg",
    "DSC05309.jpg",
    "DSC06688-scaled.jpeg",
    "DSC06744-scaled.jpeg",
    "DSC06776-scaled.jpeg",
  ]),
};

const DEFAULT_SUPPORT_FEATURES = [
  { en: "Online or with the App", fr: "En ligne ou avec l’application" },
  { en: "Watch at your convenience", fr: "Regardez à votre rythme" },
  { en: "High-quality audio & video", fr: "Audio et vidéo de haute qualité" },
  { en: "Learn at your own rhythm", fr: "Apprenez à votre propre rythme" },
  { en: "Lifetime access anywhere", fr: "Accès à vie, partout" },
  { en: "Join our community forum", fr: "Rejoignez notre forum" },
] as const;

function isFrench(locale: string) {
  return locale.toLowerCase().startsWith("fr");
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&hellip;/g, "...")
    .replace(/&euro;/g, "€")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => {
      const value = Number.parseInt(code, 10);
      return Number.isFinite(value) ? String.fromCodePoint(value) : "";
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => {
      const value = Number.parseInt(code, 16);
      return Number.isFinite(value) ? String.fromCodePoint(value) : "";
    });
}

function stripTags(value: string) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function normalizeText(value: string) {
  return decodeHtmlEntities(stripTags(value)).replace(/\s+/g, " ").trim();
}

function extractParagraphs(section: string) {
  return [...section.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => normalizeText(match[1]))
    .filter(Boolean);
}

function extractHeadingTexts(section: string) {
  return [...section.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((match) => normalizeText(match[2]))
    .filter(Boolean);
}

function extractBetween(source: string, startNeedle: string, endNeedle: string) {
  const startIndex = source.indexOf(startNeedle);
  if (startIndex < 0) {
    return "";
  }

  const sliceStart = startIndex + startNeedle.length;
  const endIndex = source.indexOf(endNeedle, sliceStart);
  if (endIndex < 0) {
    return source.slice(sliceStart);
  }

  return source.slice(sliceStart, endIndex);
}

function findFirstNeedle(source: string, needles: readonly string[]) {
  for (const needle of needles) {
    if (source.includes(needle)) {
      return needle;
    }
  }

  return "";
}

function extractBetweenAny(
  source: string,
  startNeedles: readonly string[],
  endNeedles: readonly string[],
) {
  const startNeedle = findFirstNeedle(source, startNeedles);
  if (!startNeedle) {
    return "";
  }

  const sliceStart = source.indexOf(startNeedle) + startNeedle.length;
  const remainder = source.slice(sliceStart);
  const endNeedle = findFirstNeedle(remainder, endNeedles);

  if (!endNeedle) {
    return remainder;
  }

  return remainder.slice(0, remainder.indexOf(endNeedle));
}

function extractAfterAny(source: string, startNeedles: readonly string[]) {
  const startNeedle = findFirstNeedle(source, startNeedles);
  if (!startNeedle) {
    return "";
  }

  return source.slice(source.indexOf(startNeedle) + startNeedle.length);
}

function firstMatch(source: string, pattern: RegExp) {
  const match = source.match(pattern);
  return match?.[1] ? normalizeText(match[1]) : "";
}

function firstLinkByText(source: string, label: string) {
  const desired = label.trim().toLowerCase();

  for (const match of source.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = match[1] ? decodeHtmlEntities(match[1].trim()) : "";
    const text = normalizeText(match[2] ?? "").toLowerCase();

    if (!href || !text) {
      continue;
    }

    if (text === desired || text.includes(desired)) {
      return href;
    }
  }

  return "";
}

function firstLinkByTexts(source: string, labels: readonly string[]) {
  for (const label of labels) {
    const href = firstLinkByText(source, label);
    if (href) {
      return href;
    }
  }

  return "";
}

function extractPurchaseLine(source: string, locale: string) {
  const match = source.match(/<p><strong>([\s\S]*?)<\/strong>\s*([\s\S]*?)<\/p>/i);
  if (!match) {
    return isFrench(locale) ? "Achat unique · Accès à vie" : "One-time purchase · Lifetime access";
  }

  return [normalizeText(match[1]), normalizeText(match[2])]
    .filter(Boolean)
    .join(" ")
    .replace(/\s*·\s*/g, " · ")
    .trim();
}

function extractGuaranteeLine(source: string, locale: string) {
  const normalized = normalizeText(source);
  const explicitPhrase =
    normalized.match(/(14-day money back guaranteed\.?)/i)?.[1]
    || normalized.match(/(garantie satisfait(?:e)? ou rembours(?:e|é)(?: pendant 14 jours)?\.?)/i)?.[1]
    || normalized.match(/(garantie de remboursement de 14 jours\.?)/i)?.[1];

  if (explicitPhrase) {
    return explicitPhrase.trim();
  }

  return isFrench(locale) ? "Garantie satisfait ou remboursé pendant 14 jours." : "14-day money back guaranteed.";
}

function buildVimeoPosterUrl(url: string) {
  const video = parseVimeoVideo(url);
  return video?.id ? `https://vumbnail.com/${video.id}.jpg` : "";
}

function extractFaqPairs(section: string) {
  return [...section.matchAll(/<div[^>]*class="pp-faq-item"[^>]*>[\s\S]*?<span class="pp-faq-button-label">([\s\S]*?)<\/span>[\s\S]*?<div class="pp-faq-content-text">([\s\S]*?)<\/div>[\s\S]*?<\/div>\s*<\/div>/gi)]
    .map((match) => ({
      question: normalizeText(match[1]),
      answer: normalizeText(match[2]),
    }))
    .filter((item) => item.question && item.answer);
}

function extractAudienceCards(section: string) {
  return [...section.matchAll(/<h[34][^>]*>([\s\S]*?)<\/h[34]>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => ({
      title: normalizeText(match[1]),
      description: normalizeText(match[2]),
    }))
    .filter((item) => item.title && item.description);
}

function extractSampleMeta(section: string, fallbackTeacher: string): MasterclassSampleMeta {
  const teacher =
    firstMatch(section, /<strong>(?:Teacher|Intervenant)\s*:<\/strong>\s*([^<]+)/i) || fallbackTeacher;
  const length = firstMatch(section, /<strong>(?:Length|Durée)\s*:<\/strong>\s*([^<]+)/i);
  const language = firstMatch(section, /<strong>(?:Language|Langue)\s*:<\/strong>\s*([^<]+)/i);

  return {
    teacher,
    length,
    language,
  };
}

function buildFaqTabs(locale: string, title: string, items: MasterclassFaqItem[]): MasterclassFaqTab[] {
  if (items.length === 0) {
    return [];
  }

  const courseItems = items.slice(0, Math.min(5, items.length));
  const remaining = items.slice(courseItems.length);
  const paymentPattern = /payment|gift|share|trial|reimburs|refund|purchase/i;
  const paymentItems = remaining.filter((item) => paymentPattern.test(item.question) || paymentPattern.test(item.answer));
  const generalItems = remaining.filter((item) => !paymentItems.includes(item));

  return [
    {
      id: "course",
      label: title,
      items: courseItems,
    },
    {
      id: "general",
      label: isFrench(locale) ? "Général" : "General",
      items: generalItems,
    },
    {
      id: "payment",
      label: isFrench(locale) ? "Paiement" : "Payment",
      items: paymentItems,
    },
  ].filter((tab) => tab.items.length > 0);
}

function extractFaqTabsFromPanels(section: string, locale: string, fallbackTitle: string) {
  const panels = section.split(/<div class="pp-tabs-panel">/i).slice(1);
  const parsedTabs = panels
    .map((panel, index) => {
      const label = firstMatch(panel, /<div class="pp-tab-title">([\s\S]*?)<\/div>/i)
        || (index === 0 ? fallbackTitle : "");
      const items = extractFaqPairs(panel);

      return {
        id: `${label || "tab"}-${index}`,
        label,
        items,
      };
    })
    .filter((tab) => tab.label && tab.items.length > 0);

  return parsedTabs.length > 0 ? parsedTabs : buildFaqTabs(locale, fallbackTitle, extractFaqPairs(section));
}

function fallbackTitleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeVimeoUrl(rawUrl: string) {
  const decoded = decodeHtmlEntities(rawUrl).trim();
  const video = parseVimeoVideo(decoded);
  if (!video) {
    return decoded;
  }

  return buildVimeoEmbedUrl(video, {
    title: 0,
    byline: 0,
    portrait: 0,
  });
}

export function getMasterclassSupportFeatures(locale: string) {
  return DEFAULT_SUPPORT_FEATURES.map((feature) => (isFrench(locale) ? feature.fr : feature.en));
}

export function buildMasterclassLandingData(offer: OfferDetail, locale: string): MasterclassLandingData {
  const slug = typeof offer.slug === "string" && offer.slug.trim() ? offer.slug.trim() : "masterclass";
  const canonicalSlug = resolveEducationMasterclassSlug(slug);
  const body = typeof offer.body === "string"
    ? offer.body
    : typeof offer.body_html === "string"
    ? offer.body_html
    : "";
  const assetFallback = canonicalSlug ? MASTERCLASS_ASSET_MAP[canonicalSlug] : MASTERCLASS_ASSET_MAP[slug];
  const galleryImageUrls = canonicalSlug ? MASTERCLASS_GALLERY_MAP[canonicalSlug] ?? [] : MASTERCLASS_GALLERY_MAP[slug] ?? [];
  const purchaseFallback = canonicalSlug ? EDUCATION_MASTERCLASS_PURCHASE_LINKS[canonicalSlug] : null;

  const overviewHeadingMarkers = ["Course Overview", "Aperçu du cours"] as const;
  const audienceHeadingMarkers = ['id="mc-whom"'] as const;
  const teacherHeadingMarkers = ['id="mc-teacher"', "Teacher", "Intervenant"] as const;
  const contentHeadingMarkers = ["Content", "Contenu"] as const;
  const benefitHeadingMarkers = [
    "Why Join This Course ?",
    "Why Join This Course",
    "Pourquoi rejoindre ce cours?",
    "Pourquoi rejoindre ce cours",
  ] as const;
  const faqHeadingMarkers = ['id="mc-faq"', "FAQ"] as const;

  const heroSection = extractBetween(body, 'id="mc-hero"', 'id="mc-overview"');
  const sampleSection = extractBetweenAny(body, ['id="mc-overview"'], overviewHeadingMarkers);
  const overviewSection = extractBetweenAny(body, overviewHeadingMarkers, audienceHeadingMarkers);
  const audienceAndBenefitsSection = extractBetweenAny(body, audienceHeadingMarkers, faqHeadingMarkers);
  const audienceSection = extractBetweenAny(body, audienceHeadingMarkers, benefitHeadingMarkers);
  const benefitsSection = extractBetweenAny(audienceAndBenefitsSection, benefitHeadingMarkers, faqHeadingMarkers);
  const faqSection = extractAfterAny(body, faqHeadingMarkers);

  const heroHeadings = extractHeadingTexts(heroSection);
  const sampleDescriptionSection = extractBetween(sampleSection, "Description", "course-meta");
  const teacherSection = extractBetweenAny(overviewSection, teacherHeadingMarkers, contentHeadingMarkers);
  const contentSection = extractAfterAny(overviewSection, contentHeadingMarkers);

  const priceText = firstMatch(heroSection, /<p>\s*([^<]*€)\s*<\/p>/i) || "370€";
  const purchaseLine = extractPurchaseLine(heroSection, locale);
  const guaranteeLine = extractGuaranteeLine(heroSection, locale);
  const buyUrl =
    firstLinkByTexts(heroSection, ["Buy", "Acheter"]) || purchaseFallback?.buyUrl || "";
  const giftUrl =
    firstLinkByTexts(heroSection, ["Gift", "Offrir"]) || purchaseFallback?.giftUrl || "";
  const sampleVideoRaw = (() => {
    const match = sampleSection.match(/data-src="([^"]*vimeo[^"]+)"/i) || body.match(/data-src="([^"]*vimeo[^"]+)"/i);
    return match?.[1] ? match[1] : "";
  })();
  const sampleVideoUrl = sampleVideoRaw ? normalizeVimeoUrl(sampleVideoRaw) : "";
  const samplePosterUrl = sampleVideoUrl ? buildVimeoPosterUrl(sampleVideoUrl) : "";
  const facilitator = normalizeText(getFacilitatorName(getFacilitators(offer)[0] ?? {}, "") || heroHeadings[1] || "");
  const overviewParagraphs = extractParagraphs(teacherSection);
  const overviewTeacherName = overviewParagraphs[0] || facilitator;
  const overviewTeacherBio = overviewParagraphs.slice(1);

  return {
    slug,
    title: typeof offer.title === "string" && offer.title.trim() ? offer.title.trim() : fallbackTitleFromSlug(slug),
    facilitator,
    heroTitle: heroHeadings[0] || (typeof offer.title === "string" ? offer.title : fallbackTitleFromSlug(slug)),
    heroSubtitle: heroHeadings[1] || facilitator,
    heroDescription: heroHeadings[2] || (typeof offer.excerpt === "string" ? offer.excerpt : ""),
    heroImageUrl: assetFallback?.heroImageUrl || (typeof offer.hero_image_url === "string" ? offer.hero_image_url : ""),
    teacherImageUrl: assetFallback?.teacherImageUrl || assetFallback?.heroImageUrl || "",
    galleryImageUrls: galleryImageUrls.length > 0
      ? galleryImageUrls
      : [samplePosterUrl || assetFallback?.heroImageUrl || (typeof offer.hero_image_url === "string" ? offer.hero_image_url : "")]
          .filter(Boolean),
    samplePosterUrl: samplePosterUrl || assetFallback?.heroImageUrl || (typeof offer.hero_image_url === "string" ? offer.hero_image_url : ""),
    priceText,
    purchaseLine,
    guaranteeLine,
    buyUrl,
    giftUrl,
    sampleVideoUrl,
    sampleDescription: extractParagraphs(sampleDescriptionSection),
    sampleMeta: extractSampleMeta(body, facilitator),
    overviewTeacherName,
    overviewTeacherBio,
    contentItems: extractFaqPairs(contentSection).map((item) => ({
      title: item.question,
      description: item.answer,
    })),
    audienceCards: extractAudienceCards(audienceSection),
    benefitItems: extractFaqPairs(benefitsSection).map((item) => ({
      title: item.question,
      description: item.answer.replace(/^:\s*/, ""),
    })),
    faqTabs: extractFaqTabsFromPanels(faqSection, locale, typeof offer.title === "string" ? offer.title : "Course"),
  };
}
