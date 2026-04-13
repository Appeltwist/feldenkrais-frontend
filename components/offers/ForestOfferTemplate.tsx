import Link from "next/link";

import BlockRenderer from "@/components/blocks/BlockRenderer";
import ForestNewsletterForm from "@/components/ForestNewsletterForm";
import ForestImageGallery from "@/components/forest/ForestImageGallery";
import { ForestPageShell } from "@/components/forest/ForestPageShell";
import RevealObserver from "@/components/motion/RevealObserver";
import ForestFacilitatorShowcase from "@/components/offers/ForestFacilitatorShowcase";
import ForestGroupedPricingSelector from "@/components/offers/ForestGroupedPricingSelector";
import ForestHeroMedia from "@/components/offers/ForestHeroMedia";
import ForestMediaEmbed from "@/components/offers/ForestMediaEmbed";
import OfferMobileCtaSync from "@/components/offers/OfferMobileCtaSync";
import ForestPdfForm from "@/components/offers/ForestPdfForm";
import OfferActionBar from "@/components/offers/OfferActionBar";
import { FOREST_DEFAULT_HERO_IMAGE } from "@/lib/brand-assets";
import { getForestHeroImageOverride, getForestImageOverride } from "@/lib/forest-excerpts";
import { isFacilitatorOnlySubtitle } from "@/lib/content-cleanup";
import { getForestFacilitatorNamesOverride } from "@/lib/forest-facilitator-overrides";
import { getForestPlaceholderCopy, getOfferLabels, resolveLocale } from "@/lib/i18n";
import { isExternalHref, localizePath } from "@/lib/locale-path";
import {
  asRecord,
  compareOccurrenceStart,
  getBookingOptions,
  getCanonicalOfferPath,
  getDisplayScheduleEntries,
  getDomains,
  getOfferSlug,
  getFacilitatorBio,
  getFaqItems,
  getFacilitatorImageUrl,
  getFacilitatorName,
  getFacilitatorQuote,
  getFacilitatorSlug,
  getFacilitators,
  getFutureOccurrences,
  getOccurrenceBookingUrl,
  getMediaUrl,
  getOccurrences,
  getOfferHeroImageUrl,
  getOfferHeroVideoUrl,
  getOfferSubtitle,
  getOfferTitle,
  getOfferTypeVariant,
  getPricingGroups,
  getPricingGroupTiers,
  getPriceOptions,
  getPricingPromos,
  getPrimaryCta,
  getQuickFacts,
  getSecondaryCta,
  getFutureDisplayScheduleEntries,
  occurrenceToScheduleCard,
  getBenefits,
  getSections,
  getTags,
  getThemes,
  normalizeText,
  pickString,
} from "@/lib/offers";
import type { OfferDetail, OfferSummary, OfferType, PrimaryCTA, RichSectionBlock, ScheduleCard, SectionBlock, SiteFaqSection } from "@/lib/types";

/* ── props ── */

type ForestOfferTemplateProps = {
  offer: OfferDetail;
  locale: string;
  offerType: OfferType;
  relatedOffers?: OfferSummary[];
  siteFaqSections?: SiteFaqSection[];
  primaryCtaOverride?: PrimaryCTA | null;
};

/* ── constants ── */

const TYPE_LABELS: Record<OfferType, { fr: string; en: string }> = {
  WORKSHOP: { fr: "Atelier", en: "Workshop" },
  CLASS: { fr: "Cours", en: "Class" },
  PRIVATE_SESSION: { fr: "Séance individuelle", en: "Individual session" },
  TRAINING_INFO: { fr: "Formation", en: "Training" },
};

const FACT_ICONS: Record<string, string> = {
  venue:
    "M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z",
  location:
    "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z",
  duration:
    "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z",
  level:
    "M4 18h4v-8H4v8zm6 0h4V6h-4v12zm6 0h4v-4h-4v4z",
  price_note:
    "M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z",
  languages:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L8 14v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  facilitator_note:
    "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
};

const FACT_LABELS: Record<string, { fr: string; en: string }> = {
  venue: { fr: "Lieu", en: "Venue" },
  location: { fr: "Adresse", en: "Location" },
  languages: { fr: "Langues", en: "Languages" },
  level: { fr: "Niveau", en: "Level" },
  duration: { fr: "Durée", en: "Duration" },
  price_note: { fr: "Tarif", en: "Pricing" },
  facilitator_note: { fr: "Intervenant·e", en: "Facilitator" },
};

/* ── helpers ── */

function isDirectAnchorHref(href: string) {
  return isExternalHref(href) || href.startsWith("tel:") || href.startsWith("mailto:");
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.9v3a2 2 0 0 1-2.2 2c-9.8-.9-17.7-8.8-18.6-18.6A2 2 0 0 1 3.1 1h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 2.9a2 2 0 0 1-.4 2.1L7 9a16 16 0 0 0 8 8l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.5 2.9.6a2 2 0 0 1 1.7 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function parseCompactDate(dateStr: string, locale: string, timezone?: string | null) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;

  const loc = locale || "fr";
  const parts = new Intl.DateTimeFormat(loc, {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(timezone ? { timeZone: timezone } : {}),
  }).formatToParts(d);

  const lookup = parts.reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  return {
    dayOfWeek: lookup.weekday ?? "",
    dayNum: lookup.day ?? "",
    month: lookup.month ?? "",
    time: new Intl.DateTimeFormat(loc, {
      hour: "2-digit",
      minute: "2-digit",
      ...(timezone ? { timeZone: timezone } : {}),
    }).format(d),
  };
}

function getLocalizedDateParts(dateStr: string, locale: string, timezone?: string | null) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat(locale || "en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(timezone ? { timeZone: timezone } : {}),
  });
  const parts = formatter.formatToParts(date).reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  if (!parts.day || !parts.month || !parts.year) {
    return null;
  }

  return {
    day: parts.day,
    month: parts.month,
    year: parts.year,
  };
}

function formatSchedulePeriod(card: ScheduleCard, locale: string) {
  const fallbackLabel = normalizeText(card.date_label);
  const start = card.start_datetime
    ? getLocalizedDateParts(card.start_datetime, locale, card.timezone)
    : null;
  const end = card.end_datetime
    ? getLocalizedDateParts(card.end_datetime, locale, card.timezone)
    : null;

  if (!start && !end) {
    return fallbackLabel;
  }

  if (start && (!end || (start.day === end.day && start.month === end.month && start.year === end.year))) {
    return `${start.day} ${start.month} ${start.year}`;
  }

  if (!start && end) {
    return `${end.day} ${end.month} ${end.year}`;
  }

  if (!start || !end) {
    return fallbackLabel;
  }

  if (start.year === end.year && start.month === end.month) {
    return `${start.day}-${end.day} ${start.month} ${start.year}`;
  }

  if (start.year === end.year) {
    return `${start.day} ${start.month} - ${end.day} ${end.month} ${start.year}`;
  }

  return `${start.day} ${start.month} ${start.year} - ${end.day} ${end.month} ${end.year}`;
}

function formatOfferMoney(amount: unknown, currency: unknown) {
  return [normalizeText(amount), normalizeText(currency)].filter(Boolean).join(" ");
}

function normalizeOccurrenceMatchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(workshop|atelier|session|cours|class)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatLinkedOccurrenceLine(
  occurrence: Record<string, unknown>,
  locale: string,
) {
  const start = pickString(occurrence, ["start_datetime", "start", "start_at", "datetime", "date"]);
  if (!start) {
    return "";
  }

  const timezone = pickString(occurrence, ["timezone", "tz", "time_zone"]) || undefined;
  const compact = parseCompactDate(start, locale, timezone);
  if (!compact) {
    return "";
  }

  return [compact.dayOfWeek, compact.dayNum, compact.month].filter(Boolean).join(" ");
}

function resolveLinkedBookingOccurrences(
  optionRecord: Record<string, unknown>,
  offerOccurrences: Record<string, unknown>[],
  totalBookingOptions: number,
) {
  const sortedOccurrences = [...offerOccurrences].sort(compareOccurrenceStart);
  const now = Date.now();
  const futureOccurrences = sortedOccurrences.filter((occurrence) => {
    const start = pickString(occurrence, ["start_datetime", "start", "start_at", "datetime", "date"]);
    if (!start) {
      return false;
    }
    const parsed = Date.parse(start);
    return Number.isFinite(parsed) ? parsed >= now : false;
  });
  const candidateOccurrences = futureOccurrences.length > 0 ? futureOccurrences : sortedOccurrences;

  const linkedOccurrenceIds = Array.isArray(optionRecord.occurrence_ids)
    ? optionRecord.occurrence_ids
        .map((value) => normalizeText(value))
        .filter(Boolean)
    : [];

  if (linkedOccurrenceIds.length > 0) {
    const idSet = new Set(linkedOccurrenceIds);
    return candidateOccurrences.filter((occurrence) => idSet.has(normalizeText(occurrence.id)));
  }

  const candidates = [
    pickString(optionRecord, ["summary"]),
    pickString(optionRecord, ["label", "name", "title"]),
    pickString(optionRecord, ["date_summary", "dateSummary"]),
  ]
    .map(normalizeOccurrenceMatchText)
    .filter(Boolean);

  if (candidates.length > 0) {
    const matched = candidateOccurrences.filter((occurrence) => {
      const occurrenceLabel = normalizeOccurrenceMatchText(
        pickString(occurrence, ["label", "label_override", "labelOverride"]),
      );
      if (!occurrenceLabel) {
        return false;
      }
      return candidates.some((candidate) => candidate.includes(occurrenceLabel) || occurrenceLabel.includes(candidate));
    });

    if (matched.length > 0) {
      return matched;
    }
  }

  if (totalBookingOptions === 1) {
    return candidateOccurrences;
  }

  return [] as Record<string, unknown>[];
}

function isActivePromo(promo: Record<string, unknown>) {
  const explicit = promo.is_active;
  if (typeof explicit === "boolean") {
    return explicit;
  }

  const now = Date.now();
  const startsAt = pickString(promo, ["starts_at", "startsAt"]);
  const endsAt = pickString(promo, ["ends_at", "endsAt"]);
  if (startsAt) {
    const start = new Date(startsAt);
    if (!Number.isNaN(start.getTime()) && now < start.getTime()) {
      return false;
    }
  }
  if (endsAt) {
    const end = new Date(endsAt);
    if (!Number.isNaN(end.getTime()) && now >= end.getTime()) {
      return false;
    }
  }
  return true;
}

function formatPromoSupportingText(promo: Record<string, unknown>, locale: string) {
  const note = pickString(promo, ["note"]);
  if (note) {
    return note;
  }

  const endsAt = pickString(promo, ["ends_at", "endsAt"]);
  if (!endsAt) {
    return "";
  }

  const parsed = new Date(endsAt);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const dateLabel = parsed.toLocaleDateString(locale || "en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return locale === "fr" ? `Jusqu'au ${dateLabel}` : `Until ${dateLabel}`;
}

function getForestPricingActionLabel(offerType: OfferType, locale: string) {
  const isFr = locale === "fr";
  switch (offerType) {
    case "WORKSHOP":
      return isFr ? "Participer" : "Join";
    case "TRAINING_INFO":
      return isFr ? "Postuler" : "Apply";
    case "PRIVATE_SESSION":
      return isFr ? "Commencer" : "Start";
    case "CLASS":
    default:
      return isFr ? "Réserver" : "Book";
  }
}

function getForestWaitlistActionLabel(locale: string) {
  return locale === "fr" ? "Liste d'attente" : "Join waitlist";
}

function getGalleryImagesFromSection(section: SectionBlock | null) {
  if (!section || section.type !== "gallery") {
    return [] as Array<{ url: string; alt?: string }>;
  }

  const value = section.value as Record<string, unknown> | undefined;
  const rawImages = Array.isArray(value?.images) ? value.images : [];

  return rawImages
    .map((item) => {
      if (typeof item === "string" && item.trim()) {
        return { url: item.trim() };
      }

      const image = item && typeof item === "object" && !Array.isArray(item)
        ? (item as Record<string, unknown>)
        : null;
      const url = pickString(image, ["url", "image_url", "src"]);
      if (!url) {
        return null;
      }

      const alt = pickString(image, ["alt", "title", "caption"]);
      return {
        url,
        alt: alt || undefined,
      };
    })
    .filter((image): image is { url: string; alt?: string } => image !== null);
}

function groupSectionsForLayout(sections: SectionBlock[]) {
  const groups: Array<{ type: "pair" | "single"; blocks: SectionBlock[] }> = [];
  const pairableTypes = ["rich_section", "feature_stack"];
  let i = 0;
  while (i < sections.length) {
    const current = sections[i];
    const next = sections[i + 1];
    if (
      next &&
      pairableTypes.includes(current.type) &&
      pairableTypes.includes(next.type) &&
      current.type !== next.type
    ) {
      groups.push({ type: "pair", blocks: [current, next] });
      i += 2;
    } else {
      groups.push({ type: "single", blocks: [current] });
      i += 1;
    }
  }
  return groups;
}

function FactIcon({ iconKey }: { iconKey: string }) {
  const path = FACT_ICONS[iconKey];
  if (!path) return null;
  return (
    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
      <path d={path} />
    </svg>
  );
}

/* ── component ── */

export default function ForestOfferTemplate({
  offer,
  locale,
  offerType,
  relatedOffers = [],
  siteFaqSections = [],
  primaryCtaOverride,
}: ForestOfferTemplateProps) {
  const localeCode = resolveLocale(locale);
  const labels = getOfferLabels(localeCode);
  const placeholderCopy = getForestPlaceholderCopy(localeCode);
  const typeLabel = TYPE_LABELS[offerType]?.[localeCode] ?? TYPE_LABELS.WORKSHOP[localeCode];
  const isTraining = offerType === "TRAINING_INFO";
  const contactPath = localizePath(localeCode, "/contact");

  const title = getOfferTitle(offer);
  const subtitle = getOfferSubtitle(offer);
  const rawPrimaryCta = getPrimaryCta(offer);
  const secondaryCta = getSecondaryCta(offer);
  const allOccurrences = getOccurrences(offer);
  const upcomingClassOccurrences = offerType === "CLASS" ? getFutureOccurrences(offer) : [];
  const allDisplayScheduleEntries = offerType === "CLASS" ? [] : getDisplayScheduleEntries(offer);
  const futureDisplayScheduleEntries = offerType === "CLASS" ? [] : getFutureDisplayScheduleEntries(offer);
  const classScheduleCards = offerType === "CLASS"
    ? upcomingClassOccurrences
        .map((occurrence) => occurrenceToScheduleCard(occurrence))
        .filter((card): card is ScheduleCard => card !== null)
        .slice(0, 4)
    : [];
  const classBookingUrl = offerType === "CLASS"
    ? (upcomingClassOccurrences.map((occurrence) => getOccurrenceBookingUrl(occurrence)).find(Boolean) ?? "")
    : "";
  const resolvedPrimaryCta = offerType === "CLASS" && classBookingUrl
    ? {
        url: classBookingUrl,
        label: rawPrimaryCta?.label ?? "",
        style: rawPrimaryCta?.style ?? null,
      }
    : rawPrimaryCta;
  const primaryCta = primaryCtaOverride ?? resolvedPrimaryCta;
  const heroVideoUrl = getOfferHeroVideoUrl(offer);
  const heroImageUrl = getOfferHeroImageUrl(offer);
  const offerSlug = getOfferSlug(offer) ?? "";
  const quickFacts = getQuickFacts(offer);
  const scheduleCards = offerType === "CLASS"
    ? classScheduleCards
    : futureDisplayScheduleEntries
        .map((entry) => occurrenceToScheduleCard(entry))
        .filter((card): card is ScheduleCard => card !== null);
  const themes = getThemes(offer);
  const domains = getDomains(offer);
  const sections = getSections(offer);
  const mediaUrl = getMediaUrl(offer);
  const bookingOptions = getBookingOptions(offer);
  const offerOccurrences = allOccurrences
    .map((occurrence) => asRecord(occurrence))
    .filter((occurrence): occurrence is Record<string, unknown> => occurrence !== null);
  const pricingGroups = getPricingGroups(offer);
  const pricingPromos = getPricingPromos(offer);
  const priceOptions = getPriceOptions(offer);
  const benefits = getBenefits(offer);
  const facilitators = getFacilitators(offer);
  const tags = getTags(offer);
  const faqItems = getFaqItems(offer);
  const trainingScheduleCards = isTraining
    ? scheduleCards.filter((card) => Boolean(formatSchedulePeriod(card, localeCode)))
    : [];
  const displayedScheduleCards = isTraining ? trainingScheduleCards : scheduleCards;
  const hasAnyScheduleData = offerType === "CLASS"
    ? allOccurrences.length > 0
    : allDisplayScheduleEntries.length > 0;
  const showScheduleCards =
    displayedScheduleCards.length > 0 &&
    (offerType === "WORKSHOP" || offerType === "CLASS" || isTraining);
  const showNoUpcomingDatesFallback =
    !showScheduleCards &&
    hasAnyScheduleData &&
    (offerType === "WORKSHOP" || offerType === "CLASS" || isTraining);

  /* split first rich_section (Aperçu) from remaining sections */
  const apercuSection =
    sections.length > 0 && sections[0].type === "rich_section"
      ? (sections[0] as RichSectionBlock)
      : null;
  const apercuHeading = apercuSection?.value?.heading as string | undefined;
  const apercuBody = apercuSection?.value?.body as string | undefined;
  const afterApercu = apercuSection ? sections.slice(1) : sections;

  /* collect ALL gallery images across every gallery block */
  const galleryImages = afterApercu.flatMap((section) => getGalleryImagesFromSection(section));
  const hasMedia = Boolean(mediaUrl) || galleryImages.length > 0;

  /* hero image: prefer local override, then explicit hero_image_url, fall back to first gallery image */
  const effectiveHeroImage =
    getForestHeroImageOverride(title ?? "")
    || getForestImageOverride(title ?? "")
    || heroImageUrl
    || galleryImages[0]?.url
    || "";

  /* pull out journey_steps section if present */
  const journeySection = afterApercu.find((s) => s.type === "journey_steps") ?? null;
  const rawJourneyItems = (
    (journeySection?.value as Record<string, unknown> | undefined)?.items as
      Array<Record<string, unknown>> | undefined
  ) ?? [];
  const journeyHeading = pickString(
    (journeySection?.value as Record<string, unknown> | undefined) ?? null,
    ["heading"],
    localeCode === "fr" ? "Ce que vous apprendrez" : "What you’ll learn",
  );
  /* Wagtail ListBlock wraps each item as {type:"item", value:{…}} — unwrap */
  const journeyItems = rawJourneyItems.map((item) => {
    const inner = (item.value ?? item) as { title?: string; description?: string };
    return { title: inner.title, description: inner.description };
  });
  /* Only template-native blocks remain visible here; extra informational sections belong in FAQ. */
  const remainingSections = afterApercu.filter(
    (section) => section !== journeySection && section.type === "offer_benefits",
  );

  /* quick‑fact rows (venue is a Maps link, removed location/price/facilitator) */
  const venueMapUrl = quickFacts?.venue
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        [quickFacts.venue, quickFacts.location].filter(Boolean).join(", "),
      )}`
    : undefined;

  const factRows = quickFacts
    ? [
        { key: "venue", value: quickFacts.venue },
        { key: "languages", value: quickFacts.languages },
        { key: "level", value: quickFacts.level },
        { key: "duration", value: quickFacts.duration },
      ].filter(
        (row): row is { key: string; value: string } =>
          typeof row.value === "string" && row.value.trim().length > 0,
      )
    : [];

  /* facilitator inline names */
  const facilitatorNames = getForestFacilitatorNamesOverride(offerSlug) ?? facilitators
    .map((f) => {
      const name = getFacilitatorName(f, "");
      const nickname = pickString(f, ["nickname", "alias", "short_name"]);
      if (!name && nickname) {
        return nickname;
      }
      return nickname && name ? `${name} (${nickname})` : name;
    })
    .filter(Boolean);
  const showSubtitle = Boolean(subtitle) && !(facilitatorNames.length > 0 && isFacilitatorOnlySubtitle(subtitle));

  /* facilitator slides for showcase */
  const facilitatorSlides = facilitators.map((f) => {
    const slug = getFacilitatorSlug(f);
    return {
      name: getFacilitatorName(f),
      title: pickString(f, ["title"]),
      imageUrl: getFacilitatorImageUrl(f),
      slug: slug || undefined,
      quote: getFacilitatorQuote(f),
      bio: getFacilitatorBio(f),
      profileHref: slug ? localizePath(localeCode, `/teachers/${slug}`) : undefined,
    };
  });

  /* section grouping for paired layout (remaining after Aperçu + journey) */
  const groupedSections = groupSectionsForLayout(remainingSections);
  const faqSections = siteFaqSections.filter((section) => section.items.length > 0);
  const showGalleryInProgramPanel = Boolean(mediaUrl) && galleryImages.length > 0;
  const activePricingPromos = pricingPromos.filter((promo) => isActivePromo(promo as Record<string, unknown>));
  const totalPricingTiers = pricingGroups.reduce((count, group) => count + getPricingGroupTiers(group).length, 0);
  const shouldRenderGroupedPricing = pricingGroups.length > 0;
  const pricingActionLabel = getForestPricingActionLabel(offerType, localeCode);
  const waitlistActionLabel = getForestWaitlistActionLabel(localeCode);
  const scheduleEventLocation = quickFacts?.venue
    ? `${quickFacts.venue}${quickFacts.location ? `, ${quickFacts.location}` : ""}`
    : undefined;
  const hasStructuredPricing =
    pricingGroups.length > 0 ||
    bookingOptions.length > 0 ||
    activePricingPromos.length > 0 ||
    priceOptions.length > 0;

  /* price hint for cinematic hero */
  const priceHint = offerType === "PRIVATE_SESSION"
    ? ""
    : activePricingPromos.length > 0
    ? (() => {
        const first = activePricingPromos[0] as Record<string, unknown>;
        const label = pickString(first, ["label", "name", "title"]);
        const amount = formatOfferMoney(first.amount ?? first.price ?? first.value ?? first.formatted, first.currency ?? first.currency_code);
        const supportingText = formatPromoSupportingText(first, localeCode);
        return [label, amount, supportingText].filter(Boolean).join(" ");
      })()
    : shouldRenderGroupedPricing
    ? (() => {
        const firstGroup = pricingGroups[0] as Record<string, unknown>;
        const firstTier = getPricingGroupTiers(pricingGroups[0])[0] as Record<string, unknown> | undefined;
        const dateSummary = pickString(firstGroup, ["date_summary", "dateSummary"]);
        if (!firstTier) {
          return dateSummary;
        }

        const label = pickString(firstTier, ["label", "name", "title"]);
        const amount = formatOfferMoney(
          firstTier.amount ?? firstTier.price ?? firstTier.value ?? firstTier.formatted,
          firstTier.currency ?? firstTier.currency_code,
        );
        return [dateSummary, label, amount].filter(Boolean).join(" · ");
      })()
    : bookingOptions.length > 0
    ? (() => {
        const first = bookingOptions[0] as Record<string, unknown>;
        const label = pickString(first, ["label", "name", "title"]);
        const amount = formatOfferMoney(first.amount ?? first.price ?? first.value ?? first.formatted, first.currency ?? first.currency_code);
        return [label, amount].filter(Boolean).join(" ");
      })()
    : priceOptions.length > 0
    ? (() => {
        const first = priceOptions[0];
        const label = pickString(first, ["label", "name", "title"]);
        const amount = formatOfferMoney(first.amount ?? first.price ?? first.value ?? first.formatted, first.currency ?? first.currency_code);
        return [label, amount].filter(Boolean).join(" ");
      })()
    : "";

  /* canonical URL for share (relative path — OfferActionBar resolves on client) */
  const canonicalPath = getCanonicalOfferPath(offer);

  /* first occurrence → calendar event for "Add to Calendar" */
  const pricedOccurrenceCount = offerType === "CLASS"
    ? upcomingClassOccurrences.length
    : futureDisplayScheduleEntries.length;
  const hasMultipleChoicePricing =
    pricingGroups.length > 1 ||
    totalPricingTiers > 1 ||
    bookingOptions.length > 1 ||
    priceOptions.length > 1 ||
    (pricedOccurrenceCount > 1 && (bookingOptions.length > 0 || priceOptions.length > 0));
  const shouldUsePricingAnchorCta =
    Boolean(primaryCta) &&
    hasMultipleChoicePricing &&
    offerType !== "PRIVATE_SESSION";
  const heroCta = shouldUsePricingAnchorCta
    ? {
        label: localeCode === "fr" ? "Voir les dates & tarifs" : "See dates & pricing",
        url: "#offer-pricing",
        style: primaryCta?.style ?? null,
      }
    : primaryCta;
  const mobileBookingCta = heroCta?.url
    ? {
        href: heroCta.url,
        label: heroCta.label || labels.book,
        secondaryHref: secondaryCta?.url || undefined,
        secondaryLabel: secondaryCta?.label || undefined,
        secondaryIcon: secondaryCta?.icon || null,
      }
    : null;
  const firstCalendarEntry = asRecord(
    offerType === "CLASS"
      ? upcomingClassOccurrences[0]
      : futureDisplayScheduleEntries[0],
  );
  const firstCalendarStart = pickString(firstCalendarEntry, ["start_datetime", "start", "start_at", "datetime", "date"]);
  const firstCalendarEnd = pickString(firstCalendarEntry, ["end_datetime", "end", "end_at"]);
  const calendarEvent =
    !isTraining && firstCalendarStart && firstCalendarEnd
      ? {
          start: firstCalendarStart,
          end: firstCalendarEnd,
          location: scheduleEventLocation,
        }
      : undefined;
  const trainingCalendarEvents = isTraining
    ? trainingScheduleCards.flatMap((card) => {
        if (!card.start_datetime || !card.end_datetime) {
          return [];
        }

        return [{
          start: card.start_datetime,
          end: card.end_datetime,
          location: scheduleEventLocation,
        }];
      })
    : [];
  const hideCalendarAction = offerType === "PRIVATE_SESSION" || (isTraining && trainingCalendarEvents.length === 0);

  return (
    <ForestPageShell className="forest-site-shell--offer">
      <OfferMobileCtaSync cta={mobileBookingCta} />
      <section className="page-section forest-offer-page" id="offer-motion">
        <RevealObserver scopeId="offer-motion" />
        {/* ── CINEMATIC HERO ── */}
        <section className="forest-hero forest-hero--cinematic">
          <ForestHeroMedia
            defaultImageUrl={FOREST_DEFAULT_HERO_IMAGE}
            imageUrl={effectiveHeroImage}
            title={title}
            videoUrl={heroVideoUrl}
          />

          <div className="forest-hero__overlay-content">
            <p className="offer-type-label">{typeLabel}</p>
            <hr aria-hidden="true" className="forest-hero__divider" />
            <h1 className="forest-hero__title">{title}</h1>

            {showSubtitle ? <p className="offer-subtitle forest-hero__subtitle">{subtitle}</p> : null}

            {facilitatorNames.length > 0 ? (
              <p className="forest-hero__facilitator">
                {localeCode === "fr" ? "avec" : "w/"} {facilitatorNames.join(", ")}
              </p>
            ) : null}

            <OfferActionBar
              calendarEvent={calendarEvent}
              calendarEvents={isTraining ? trainingCalendarEvents : undefined}
              canonicalUrl={canonicalPath}
              hideCalendar={hideCalendarAction}
              title={title}
              variant="cinematic"
            />

            {heroCta ? (
              <div className="forest-hero__cta-group">
                {isExternalHref(heroCta.url) ? (
                  <a
                    className="forest-hero__cta"
                    href={heroCta.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {heroCta.label || labels.book}
                  </a>
                ) : (
                  heroCta.url.startsWith("#") ? (
                    <a className="forest-hero__cta" href={heroCta.url}>
                      {heroCta.label || labels.book}
                    </a>
                  ) : (
                    <Link className="forest-hero__cta" href={heroCta.url}>
                      {heroCta.label || labels.book}
                    </Link>
                  )
                )}
                {secondaryCta?.url ? (
                  isDirectAnchorHref(secondaryCta.url) ? (
                    <a
                      className="forest-hero__cta forest-hero__cta--secondary"
                      href={secondaryCta.url}
                      aria-label={secondaryCta.label || (localeCode === "fr" ? "Appeler" : "Call")}
                    >
                      <PhoneIcon />
                      <span className="sr-only">{secondaryCta.label || (localeCode === "fr" ? "Appeler" : "Call")}</span>
                    </a>
                  ) : (
                    <Link
                      className="forest-hero__cta forest-hero__cta--secondary"
                      href={secondaryCta.url}
                      aria-label={secondaryCta.label || (localeCode === "fr" ? "Appeler" : "Call")}
                    >
                      <PhoneIcon />
                      <span className="sr-only">{secondaryCta.label || (localeCode === "fr" ? "Appeler" : "Call")}</span>
                    </Link>
                  )
                ) : null}
              </div>
            ) : null}

            {priceHint ? (
              <p className="forest-hero__price-hint">{priceHint}</p>
            ) : null}
          </div>
        </section>

        {/* ── DETAILS BELOW HERO ── */}
        <section className="forest-panel forest-hero__details" data-reveal="section" id="offer-details">
          {/* quick facts */}
          {factRows.length > 0 ? (
            <div className="forest-hero__facts" data-reveal="stagger">
              {factRows.map((row) => {
                const isVenue = row.key === "venue" && venueMapUrl;
                return (
                  <div className="forest-hero__fact" key={row.key}>
                    <FactIcon iconKey={row.key} />
                    <span className="forest-hero__fact-label">
                      {FACT_LABELS[row.key]?.[localeCode] ?? row.key}
                    </span>
                    {isVenue ? (
                      <a
                        className="forest-hero__fact-value forest-hero__fact-link"
                        href={venueMapUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <span className="forest-hero__fact-value">{row.value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* schedule date cards */}
          {showScheduleCards ? (
            <div className="forest-hero__schedule">
              {isTraining ? displayedScheduleCards.map((card, index) => {
                const periodLabel = formatSchedulePeriod(card, localeCode);
                if (!periodLabel) {
                  return null;
                }

                return (
                  <div className="forest-hero__schedule-card forest-hero__schedule-card--period" key={`schedule-${index}`}>
                    <span className="forest-hero__schedule-date forest-hero__schedule-date--period">
                      {periodLabel}
                    </span>
                  </div>
                );
              }) : (() => {
                /* Offer-level facilitator as fallback */
                const defaultFacImg = getFacilitatorImageUrl(facilitators[0] ?? {});
                const defaultFacName = getFacilitatorName(facilitators[0] ?? {});
                return displayedScheduleCards.map((card, index) => {
                  const startParsed = card.start_datetime
                    ? parseCompactDate(card.start_datetime, locale, card.timezone)
                    : null;
                  const endParsed = card.end_datetime
                    ? parseCompactDate(card.end_datetime, locale, card.timezone)
                    : null;
                  const timeRange = [startParsed?.time, endParsed?.time].filter(Boolean).join(" – ");

                  /* Per-card facilitator (from API) wins. If they have no photo, keep the name and fall back to initials. */
                  const hasOccurrenceFacilitator = Boolean(card.facilitator?.display_name);
                  const cardFacImg = hasOccurrenceFacilitator
                    ? (card.facilitator?.photo_url || "")
                    : defaultFacImg;
                  const cardFacName = card.facilitator?.display_name || defaultFacName;

                  return (
                    <div className="forest-hero__schedule-card" key={`schedule-${index}`}>
                      {cardFacImg ? (
                        <img
                          alt={cardFacName}
                          className="forest-hero__schedule-avatar"
                          loading="lazy"
                          src={cardFacImg}
                        />
                      ) : cardFacName ? (
                        <span
                          aria-hidden="true"
                          className="forest-hero__schedule-avatar forest-hero__schedule-avatar--placeholder"
                        >
                          {cardFacName.charAt(0).toUpperCase()}
                        </span>
                      ) : null}
                      {startParsed ? (
                        <>
                          <span className="forest-hero__schedule-day">{startParsed.dayOfWeek}</span>
                          <span className="forest-hero__schedule-date">
                            {startParsed.dayNum} {startParsed.month}
                          </span>
                        </>
                      ) : null}
                      {timeRange ? (
                        <span className="forest-hero__schedule-time">{timeRange}</span>
                      ) : null}
                      {cardFacName ? (
                        <span className="forest-hero__schedule-label">{cardFacName}</span>
                      ) : null}
                    </div>
                  );
                });
              })()}
            </div>
          ) : showNoUpcomingDatesFallback ? (
            <div className="forest-hero__schedule forest-hero__schedule--empty">
              <p className="forest-hero__schedule-empty">{labels.noOccurrences}</p>
              <Link className="forest-hero__schedule-contact" href={contactPath}>
                {labels.contactUs}
              </Link>
            </div>
          ) : null}

        </section>

        <div aria-hidden="true" className="fl-separator" role="separator">
          <span className="fl-separator__dot" />
        </div>

      {/* ── APERÇU (two separate boxes side by side) ── */}
      {apercuSection ? (
        <div id="forest-apercu" className={`forest-apercu${hasMedia ? " forest-apercu--two-col" : ""}`} data-reveal="section">
          {hasMedia ? (
            <div className="forest-apercu__media">
              <ForestMediaEmbed
                fallbackImageUrl={heroImageUrl}
                galleryImages={galleryImages}
                title={title}
                videoUrl={mediaUrl}
              />
            </div>
          ) : null}
          <section className="forest-panel forest-apercu__content">
            {apercuHeading ? <h2>{apercuHeading}</h2> : null}
            {apercuBody ? (
              <div className="rich-text" dangerouslySetInnerHTML={{ __html: apercuBody }} />
            ) : null}

            {/* domain, theme & tag pills — deduplicate tags already shown as domains/themes */}
            {(() => {
              const shownNames = new Set([
                ...domains.map((d) => d.name.toLowerCase()),
                ...themes.map((t) => t.name.toLowerCase()),
              ]);
              const uniqueTags = tags.filter((tag) => !shownNames.has(tag.toLowerCase()));
              const hasAny = domains.length > 0 || themes.length > 0 || uniqueTags.length > 0;
              if (!hasAny) return null;
              return (
                <div className="forest-hero__themes">
                  <span className="forest-hero__themes-label">
                    {localeCode === "fr" ? "Thèmes" : "Themes"}
                  </span>
                  {domains.map((domain) => (
                    <span className="forest-hero__theme-pill forest-hero__domain-pill" key={String(domain.id)}>
                      {domain.name}
                    </span>
                  ))}
                  {themes.map((theme) => (
                    <span className="forest-hero__theme-pill" key={String(theme.id)}>
                      {theme.name}
                    </span>
                  ))}
                  {uniqueTags.map((tag) => (
                    <span className="forest-hero__theme-pill" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              );
            })()}
          </section>
        </div>
      ) : null}


      {/* ── CONTENT BLOCKS ── */}
      {groupedSections.length > 0 ? (
        <section className="forest-section forest-section--blocks" data-reveal="section">
          {groupedSections.map((group, gi) => {
            if (group.type === "pair") {
              return (
                <div className="forest-content-pair" key={`group-${gi}`}>
                  <BlockRenderer blocks={[group.blocks[0]]} locale={localeCode} />
                  <BlockRenderer blocks={[group.blocks[1]]} locale={localeCode} />
                </div>
              );
            }
            return <BlockRenderer blocks={group.blocks} locale={localeCode} key={`group-${gi}`} />;
          })}
        </section>
      ) : null}

      {/* ── FACILITATOR SHOWCASE ── */}
      {facilitatorSlides.length > 0 ? (
        <>
          <div aria-hidden="true" className="fl-separator" role="separator">
            <span className="fl-separator__dot" />
          </div>
          <ForestFacilitatorShowcase
            facilitators={facilitatorSlides}
            heading={labels.facilitators}
          />
        </>
      ) : null}

      {/* ── WHAT YOU'LL LEARN ── */}
      {journeyItems.length > 0 ? (
        <>
          <div aria-hidden="true" className="fl-separator fl-separator--subtle" role="separator" />
          <section className="forest-journey" data-reveal="section">
            <h2 className="forest-journey__heading">{journeyHeading}</h2>
            <ol className="forest-journey__trail" data-reveal="stagger">
              {journeyItems.map((step, index) => (
                <li className="forest-journey__waypoint" key={`step-${index}`}>
                  <span aria-hidden="true" className="forest-journey__marker">{index + 1}</span>
                  <div className="forest-journey__content">
                    {step.title ? <h3 className="forest-journey__title">{step.title}</h3> : null}
                    {step.description ? (
                      <div
                        className="forest-journey__desc rich-text"
                        dangerouslySetInnerHTML={{ __html: step.description }}
                      />
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
            {heroCta ? (
              <div className="forest-journey__cta">
                {isExternalHref(heroCta.url) ? (
                  <a className="fl-btn fl-btn--primary" href={heroCta.url} rel="noreferrer" target="_blank">
                    {heroCta.label || labels.book}
                  </a>
                ) : heroCta.url.startsWith("#") ? (
                  <a className="fl-btn fl-btn--primary" href={heroCta.url}>
                    {heroCta.label || labels.book}
                  </a>
                ) : (
                  <Link className="fl-btn fl-btn--primary" href={heroCta.url}>
                    {heroCta.label || labels.book}
                  </Link>
                )}
              </div>
            ) : null}

            {/* PDF lead magnet */}
            <div className="forest-journey__pdf" data-reveal="section">
              <svg aria-hidden="true" className="forest-journey__pdf-icon" fill="none" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <h3 className="forest-journey__pdf-title">{placeholderCopy.pdfTitle}</h3>
              <p className="forest-journey__pdf-text">{placeholderCopy.pdfPrompt}</p>
              <ForestPdfForm
                consentHint={placeholderCopy.pdfConsentHint}
                consentLabel={placeholderCopy.pdfConsentLabel}
                offerSlug={offerSlug}
                locale={localeCode}
                errorText={placeholderCopy.pdfError}
                fallbackText={placeholderCopy.pdfFallback}
                placeholderText={placeholderCopy.pdfPlaceholder}
                ctaText={placeholderCopy.pdfCta}
                submittingText={placeholderCopy.pdfSubmitting}
              />
            </div>
          </section>
        </>
      ) : null}

      {/* ── FEATURED IMAGE + EVENT FAQ ── */}
      {showGalleryInProgramPanel || heroImageUrl || faqItems.length > 0 ? (
        <>
          <div aria-hidden="true" className="fl-separator fl-separator--subtle" role="separator" />
          <section className="forest-image-faq" data-reveal="section">
            {showGalleryInProgramPanel ? (
              <div className="forest-image-faq__media">
                <ForestImageGallery
                  alt={title}
                  images={galleryImages.map((image) => image.url)}
                />
              </div>
            ) : heroImageUrl ? (
              <div className="forest-image-faq__media">
                <img
                  alt={title}
                  className="forest-image-faq__img"
                  loading="lazy"
                  src={heroImageUrl}
                />
              </div>
            ) : null}
            {faqItems.length > 0 ? (
              <div className="forest-image-faq__questions fp-faq">
                <h2>{labels.eventFaq}</h2>
                <div className="fp-faq__category">
                  <div className="faq-list">
                    {faqItems.map((item) => (
                      <details key={item.question}>
                        <summary>{item.question}</summary>
                        <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      {/* ── PRICING & BENEFITS ── */}
      {(hasStructuredPricing || (benefits && benefits.items.length > 0)) ? (
        <section className={`forest-pricing-benefits${benefits && hasStructuredPricing ? " forest-pricing-benefits--two-col" : ""}`} data-reveal="section" id="offer-pricing">
          {/* compact pricing box */}
          {hasStructuredPricing ? (
            <div className="forest-panel forest-pricing-compact forest-pricing-compact--glow" data-hover-lift>
              <p className="fp-chapter__eyebrow">{localeCode === "fr" ? "Tarifs" : "Pricing"}</p>
              <h2>{labels.pricing}</h2>
              {activePricingPromos.length > 0 ? (
                <div className="forest-pricing-compact__promo-list">
                  {activePricingPromos.map((promo, index) => {
                    const promoRecord = promo as Record<string, unknown>;
                    const label = pickString(promoRecord, ["label", "name", "title"], "Promo");
                    const detail = formatOfferMoney(
                      promoRecord.amount ?? promoRecord.price ?? promoRecord.value ?? promoRecord.formatted,
                      promoRecord.currency ?? promoRecord.currency_code,
                    );
                    const supportingText = formatPromoSupportingText(promoRecord, localeCode);

                    return (
                      <div className="forest-pricing-compact__promo" key={`promo-${label}-${index}`}>
                        <div className="forest-pricing-compact__promo-copy">
                          <span className="forest-pricing-compact__promo-label">{label}</span>
                          {supportingText ? (
                            <span className="forest-pricing-compact__promo-note">{supportingText}</span>
                          ) : null}
                        </div>
                        {detail ? <span className="forest-pricing-compact__promo-amount">{detail}</span> : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
              {shouldRenderGroupedPricing ? (
                <ForestGroupedPricingSelector
                  availableActionLabel={pricingActionLabel}
                  groups={pricingGroups}
                  locale={localeCode}
                  occurrences={allOccurrences}
                  offerType={offerType}
                  waitlistActionLabel={waitlistActionLabel}
                />
              ) : (
                <div className="forest-pricing-compact__list">
                  {bookingOptions.length > 0 ? bookingOptions.map((option, index) => {
                  const optionRecord = option as Record<string, unknown>;
                  const label = pickString(optionRecord, ["label", "name", "title"], "Option");
                  const detail = formatOfferMoney(
                    optionRecord.amount ?? optionRecord.price ?? optionRecord.value ?? optionRecord.formatted,
                    optionRecord.currency ?? optionRecord.currency_code,
                  );
                  const summary = pickString(optionRecord, ["summary"]);
                  const dateSummary = pickString(optionRecord, ["date_summary", "dateSummary"]);
                  const linkedOccurrences = resolveLinkedBookingOccurrences(optionRecord, offerOccurrences, bookingOptions.length);
                  const occurrenceLines = linkedOccurrences
                    .map((occurrence) => formatLinkedOccurrenceLine(occurrence, localeCode))
                    .filter(Boolean);
                  const visibleOccurrenceLines = occurrenceLines.slice(0, 3);
                  const remainingOccurrenceCount = occurrenceLines.length - visibleOccurrenceLines.length;
                  const supportingText = [summary, occurrenceLines.length === 0 ? dateSummary : ""].filter(Boolean).join(" · ");
                  const optionActionType = pickString(optionRecord, ["action_type", "actionType"]);
                  const isWaitlistOption = optionRecord.is_sold_out === true || optionActionType === "WAITLIST_FORM";
                  const bookingUrl = offerType === "PRIVATE_SESSION"
                    ? primaryCta?.url || ""
                    : pickString(optionRecord, ["booking_url", "bookingUrl"]);
                  return (
                    <div className="forest-pricing-compact__row" key={`booking-option-${label}-${index}`}>
                      <div className="forest-pricing-compact__copy">
                        <span className="forest-pricing-compact__label">{label}</span>
                        {supportingText ? (
                          <span className="forest-pricing-compact__summary">{supportingText}</span>
                        ) : null}
                        {visibleOccurrenceLines.length > 0 ? (
                          <div className="forest-pricing-compact__occurrences">
                            {visibleOccurrenceLines.map((occurrenceLine, occurrenceIndex) => (
                              <span
                                className="forest-pricing-compact__occurrence"
                                key={`booking-option-${label}-${index}-occurrence-${occurrenceIndex}`}
                              >
                                {occurrenceLine}
                              </span>
                            ))}
                            {remainingOccurrenceCount > 0 ? (
                              <span className="forest-pricing-compact__occurrence forest-pricing-compact__occurrence--more">
                                {localeCode === "fr"
                                  ? `+${remainingOccurrenceCount} autre${remainingOccurrenceCount > 1 ? "s" : ""} date${remainingOccurrenceCount > 1 ? "s" : ""}`
                                  : `+${remainingOccurrenceCount} more date${remainingOccurrenceCount > 1 ? "s" : ""}`}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                      <div className="forest-pricing-compact__meta">
                        {detail ? <span className="forest-pricing-compact__amount">{detail}</span> : null}
                        {bookingUrl ? (
                          isExternalHref(bookingUrl) ? (
                            <a
                              className="forest-pricing-compact__row-cta"
                              href={bookingUrl}
                              rel="noreferrer"
                              target="_blank"
                            >
                              {isWaitlistOption ? waitlistActionLabel : pricingActionLabel}
                            </a>
                          ) : (
                            <Link className="forest-pricing-compact__row-cta" href={bookingUrl}>
                              {isWaitlistOption ? waitlistActionLabel : pricingActionLabel}
                            </Link>
                          )
                        ) : null}
                      </div>
                    </div>
                  );
                }) : priceOptions.map((price, index) => {
                  const label = pickString(price, ["label", "name", "title"], "Option");
                  const detail = formatOfferMoney(
                    price.amount ?? price.price ?? price.value ?? price.formatted,
                    price.currency ?? price.currency_code,
                  );
                  return (
                    <div className="forest-pricing-compact__row" key={`price-${label}-${index}`}>
                      <span className="forest-pricing-compact__label">{label}</span>
                      {detail ? <span className="forest-pricing-compact__amount">{detail}</span> : null}
                    </div>
                  );
                })}
                </div>
              )}
              {primaryCta && bookingOptions.length === 0 && !shouldRenderGroupedPricing ? (
                <div className="forest-pricing-compact__cta-row">
                  {isDirectAnchorHref(primaryCta.url) ? (
                    <a className="fl-btn fl-btn--primary forest-pricing-compact__cta" href={primaryCta.url} rel={isExternalHref(primaryCta.url) ? "noreferrer" : undefined} target={isExternalHref(primaryCta.url) ? "_blank" : undefined}>
                      {primaryCta.label || labels.book}
                    </a>
                  ) : (
                    <Link className="fl-btn fl-btn--primary forest-pricing-compact__cta" href={primaryCta.url}>
                      {primaryCta.label || labels.book}
                    </Link>
                  )}
                  {secondaryCta?.url ? (
                    isDirectAnchorHref(secondaryCta.url) ? (
                      <a
                        className="forest-pricing-compact__cta-secondary"
                        href={secondaryCta.url}
                        aria-label={secondaryCta.label || (localeCode === "fr" ? "Appeler" : "Call")}
                      >
                        <PhoneIcon />
                        <span className="sr-only">{secondaryCta.label || (localeCode === "fr" ? "Appeler" : "Call")}</span>
                      </a>
                    ) : (
                      <Link
                        className="forest-pricing-compact__cta-secondary"
                        href={secondaryCta.url}
                        aria-label={secondaryCta.label || (localeCode === "fr" ? "Appeler" : "Call")}
                      >
                        <PhoneIcon />
                        <span className="sr-only">{secondaryCta.label || (localeCode === "fr" ? "Appeler" : "Call")}</span>
                      </Link>
                    )
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* benefits column */}
          {benefits && benefits.items.length > 0 ? (
            <div className="forest-benefits">
              <p className="fp-chapter__eyebrow">{localeCode === "fr" ? "Avantages" : "Benefits"}</p>
              <h2 className="forest-benefits__heading">
                {benefits.heading || labels.benefits}
              </h2>
              <ul className="forest-benefits__list" data-reveal="stagger">
                {benefits.items.map((item, index) => (
                  <li className="forest-benefits__item" key={`benefit-${index}`}>
                    <svg aria-hidden="true" className="forest-benefits__icon" fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
                      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                    </svg>
                    <div className="forest-benefits__content">
                      {item.title ? <h3 className="forest-benefits__title">{item.title}</h3> : null}
                      {item.description ? (
                        <div className="forest-benefits__desc rich-text" dangerouslySetInnerHTML={{ __html: item.description }} />
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ── NEWSLETTER ── */}
      <section className="forest-newsletter-cta" data-reveal="section">
        <p className="forest-newsletter-cta__eyebrow">
          {localeCode === "fr" ? "Communauté" : "Community"}
        </p>
        <h2 className="forest-newsletter-cta__heading">
          {placeholderCopy.newsletterTitle}
        </h2>
        <p className="forest-newsletter-cta__body">
          {placeholderCopy.newsletterBody}
        </p>
        <ForestNewsletterForm
          ctaText={placeholderCopy.newsletterCta}
          locale={localeCode}
          placeholder={placeholderCopy.newsletterPlaceholder}
          source="newsletter-offer-detail"
        />
      </section>

      {/* ── DISCOVER / RELATED OFFERS ── */}
      {relatedOffers.length > 0 ? (
        <section className="forest-discover-slider" data-reveal="section">
          <p className="fp-chapter__eyebrow">{localeCode === "fr" ? "Explorer" : "Explore"}</p>
          <h2 className="forest-discover-slider__heading">{placeholderCopy.discoverTitle}</h2>
          <div className="forest-discover-slider__track">
            {(() => {
              const currentDomainSet = new Set(domains.map((d) => String(d.id)));
              const scored = [...relatedOffers].map((ro) => {
                const hasImg = Boolean(
                  getOfferHeroImageUrl(ro as OfferDetail)
                  || getFacilitatorImageUrl(getFacilitators(ro as OfferDetail)[0] ?? {}),
                );
                const roDomains = Array.isArray(ro.domains) ? (ro.domains as Array<{slug?: string}>) : [];
                const shared = roDomains.filter((d) => d.slug && currentDomainSet.has(d.slug)).length;
                const sameType = (ro.type ?? "").toString().toUpperCase() === offerType ? 1 : 0;
                return { ro, score: (hasImg ? 1000 : 0) + shared * 100 + sameType * 10 };
              });
              scored.sort((a, b) => b.score - a.score);
              return scored.slice(0, 6).map(({ ro }) => ro);
            })().map((ro) => {
              const roType = (ro.type ?? "WORKSHOP").toString().toUpperCase();
              const roTypeVariant = getOfferTypeVariant(roType);
              const roLabel = TYPE_LABELS[roType as OfferType]?.[localeCode] ?? TYPE_LABELS.WORKSHOP[localeCode];
              const roTitle = ro.title ?? "Offer";
              const roExcerpt = typeof ro.excerpt === "string" ? ro.excerpt : "";
              const roImage = getOfferHeroImageUrl(ro as OfferDetail)
                || getFacilitatorImageUrl(getFacilitators(ro as OfferDetail)[0] ?? {});
              const roPath = getCanonicalOfferPath(ro);
              return (
                <Link
                  className={`forest-discover-slider__card forest-discover-slider__card--${roTypeVariant}`}
                  href={localizePath(localeCode, roPath)}
                  key={ro.slug}
                >
                  {roImage ? (
                    <img alt={roTitle} className="forest-discover-slider__img" loading="lazy" src={roImage} />
                  ) : (
                    <div className="forest-discover-slider__img-placeholder" />
                  )}
                  <div className="forest-discover-slider__body">
                    <small className={`forest-discover-slider__type forest-discover-slider__type--${roTypeVariant}`}>{roLabel}</small>
                    <strong>{roTitle}</strong>
                    {roExcerpt ? <p>{roExcerpt}</p> : null}
                  </div>
                </Link>
              );
            })}
          </div>
          <Link className="button-link forest-secondary-cta" href={localizePath(localeCode, "/workshops")}>
            {placeholderCopy.discoverCta}
          </Link>
        </section>
      ) : null}

      {/* ── SITE FAQ ── */}
      {faqSections.length > 0 ? (
        <section className="forest-panel fp-section fp-section--faq forest-site-faq" data-reveal="section">
          <div className="fp-chapter__intro fp-chapter__intro--faq">
            <p className="fp-chapter__eyebrow">Questions</p>
            <h2 className="fp-section__heading fp-section__heading--left">{placeholderCopy.extraFaqHeading}</h2>
          </div>
          <div className="fp-faq">
            {faqSections.map((section) => (
              <div className="fp-faq__category" key={section.title}>
                <h3 className="fp-faq__category-name">{section.title}</h3>
                <div className="faq-list">
                  {section.items.map((item) => (
                    <details key={`${section.title}-${item.question}`}>
                      <summary>{item.question}</summary>
                      <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Tags integrated into Aperçu pills — no standalone section */}
      </section>
    </ForestPageShell>
  );
}
