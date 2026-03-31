import Image from "next/image";
import Link from "next/link";

import ForestHomeOfferExplorer, {
  type ForestHomeOfferCard,
  type ForestHomeOfferFilter,
  type ForestHomeOfferTypeFilter,
} from "@/components/home/ForestHomeOfferExplorer";
import ForestHomeHeroVideo from "@/components/home/ForestHomeHeroVideo";
import { ForestPageShell } from "@/components/forest/ForestPageShell";
import { fetchOfferDetail, fetchOffers } from "@/lib/api";
import { cleanDisplayText } from "@/lib/content-cleanup";
import { getForestExcerptOverride, getForestImageOverride } from "@/lib/forest-excerpts";
import { getForestFacilitatorNamesOverride } from "@/lib/forest-facilitator-overrides";
import { getForestHomeContent } from "@/lib/forest-home-content";
import {
  asRecord,
  getCanonicalOfferPath,
  getCanonicalOfferPathByTypeAndSlug,
  getDomains,
  getFacilitatorName,
  getFacilitators,
  getOfferSlug,
  getOfferTitle,
  getOfferType,
  getOfferTypeVariant,
  getFutureDisplayScheduleEntries,
  pickString,
  readNextOccurrence,
} from "@/lib/offers";
import { localizePath } from "@/lib/locale-path";
import type { OfferDetail, OfferSummary, OfferType } from "@/lib/types";

const FALLBACK_HIGHLIGHT_IMAGE = "/brands/forest-lighthouse/home/hero-main-hall.jpg";
const MAX_HIGHLIGHT_DATE_PILLS = 4;
const MIN_MULTI_DATE_SUMMARY_COUNT = 3;

type ForestHomePageProps = {
  hostname: string;
  locale: string;
};

type HomeHighlightCard = {
  href: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  typeLabel: string;
  typeVariant: ReturnType<typeof getOfferTypeVariant>;
  facilitatorName: string;
  facilitatorImage: string;
  dateSummary: string;
  dateLabels: string[];
};

function HomeStoryIcon({ icon }: { icon: "light" | "pause" | "terrace" }) {
  if (icon === "pause") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 4h10" fill="none" />
        <path d="M9 4v3" fill="none" />
        <path d="M15 4v3" fill="none" />
        <path d="M7 10h10" fill="none" />
        <path d="M8 10c0 3.8 1.9 6.4 4 8 2.1-1.6 4-4.2 4-8" fill="none" />
        <path d="M8.5 20h7" fill="none" />
      </svg>
    );
  }

  if (icon === "terrace") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4 18h16" fill="none" />
        <path d="M7 18v-5" fill="none" />
        <path d="M17 18v-5" fill="none" />
        <path d="M6 13h12" fill="none" />
        <path d="M12 13V5" fill="none" />
        <path d="M9 8.5c.9-.9 2-.9 3 0 .9.9 2 .9 3 0" fill="none" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 3v3" fill="none" />
      <path d="M12 18v3" fill="none" />
      <path d="M4.8 4.8l2.1 2.1" fill="none" />
      <path d="M17.1 17.1l2.1 2.1" fill="none" />
      <path d="M3 12h3" fill="none" />
      <path d="M18 12h3" fill="none" />
      <path d="M4.8 19.2l2.1-2.1" fill="none" />
      <path d="M17.1 6.9l2.1-2.1" fill="none" />
      <circle cx="12" cy="12" fill="none" r="4.2" />
    </svg>
  );
}

function getTypeLabel(offerType: OfferType, locale: string) {
  const isFr = locale.toLowerCase().startsWith("fr");
  if (offerType === "TRAINING_INFO") {
    return isFr ? "Formation" : "Training";
  }
  if (offerType === "CLASS") {
    return isFr ? "Cours" : "Class";
  }
  if (offerType === "PRIVATE_SESSION") {
    return isFr ? "Individuel" : "Individual";
  }
  return isFr ? "Atelier" : "Workshop";
}

function stripHtml(value: string | null | undefined) {
  return (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function compactText(value: string | null | undefined, limit = 150) {
  const text = stripHtml(value);
  if (!text) {
    return "";
  }
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit).trimEnd()}...`;
}

function isUsableExcerpt(value: string) {
  return Boolean(value) && !value.includes("Guest name cannot be repeated");
}

function getOfferDescription(offer: OfferSummary | OfferDetail, limit = 150) {
  const record = asRecord(offer);
  const rawDescription =
    pickString(record, ["excerpt", "summary", "short_description", "shortDescription"]) ||
    pickString(record, ["subtitle", "sub_title"]);
  const cleanedDescription = cleanDisplayText(stripHtml(rawDescription));
  const override = getForestExcerptOverride(getOfferTitle(offer, ""));

  if (isUsableExcerpt(cleanedDescription)) {
    if (/(?:\.{3}|…)$/.test(cleanedDescription) && override) {
      return override;
    }
    return compactText(cleanedDescription, limit);
  }

  return override || "";
}

function getOfferHref(offer: OfferSummary | OfferDetail, locale: string) {
  const offerType = getOfferType(offer);
  const slug = getOfferSlug(offer);
  const canonicalPath = getCanonicalOfferPath(offer) || getCanonicalOfferPathByTypeAndSlug(offerType, slug);
  return localizePath(locale, canonicalPath || "/workshops");
}

function getOfferTimestamp(offer: OfferSummary | OfferDetail) {
  const { start } = readNextOccurrence(offer);
  if (!start) {
    return Number.POSITIVE_INFINITY;
  }
  const parsed = new Date(start);
  return Number.isNaN(parsed.getTime()) ? Number.POSITIVE_INFINITY : parsed.getTime();
}

function sortByNextOccurrence(a: OfferSummary | OfferDetail, b: OfferSummary | OfferDetail) {
  const aTime = getOfferTimestamp(a);
  const bTime = getOfferTimestamp(b);
  if (aTime !== bTime) {
    return aTime - bTime;
  }
  return getOfferTitle(a, "").localeCompare(getOfferTitle(b, ""));
}

function getLocalizedDateParts(dateValue: string, locale: string, timezone?: string) {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat(locale || "en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(timezone ? { timeZone: timezone } : {}),
  }).formatToParts(parsed);

  const result = parts.reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  if (!result.day || !result.month || !result.year) {
    return null;
  }

  return {
    day: result.day,
    month: result.month,
    year: result.year,
  };
}

function getOccurrenceEntries(offer: OfferSummary | OfferDetail) {
  return getFutureDisplayScheduleEntries(offer as OfferDetail);
}

function formatTrainingPeriodLabel(offer: OfferSummary | OfferDetail, locale: string) {
  const entries = getOccurrenceEntries(offer);
  const labels: string[] = [];
  const seen = new Set<string>();

  entries.forEach((entry) => {
    const start = pickString(asRecord(entry), ["start_datetime", "start", "start_at", "datetime", "date"]);
    const end = pickString(asRecord(entry), ["end_datetime", "end", "end_at"]);
    const timezone = pickString(asRecord(entry), ["timezone", "tz", "time_zone"]);
    const startParts = start ? getLocalizedDateParts(start, locale, timezone) : null;
    const endParts = end ? getLocalizedDateParts(end, locale, timezone) : null;

    if (!startParts && !endParts) {
      return;
    }

    let label = "";
    if (startParts && (!endParts || (startParts.day === endParts.day && startParts.month === endParts.month && startParts.year === endParts.year))) {
      label = `${startParts.day} ${startParts.month} ${startParts.year}`;
    } else if (startParts && endParts && startParts.year === endParts.year && startParts.month === endParts.month) {
      label = `${startParts.day}-${endParts.day} ${startParts.month} ${startParts.year}`;
    } else if (startParts && endParts && startParts.year === endParts.year) {
      label = `${startParts.day} ${startParts.month} - ${endParts.day} ${endParts.month} ${startParts.year}`;
    } else if (startParts && endParts) {
      label = `${startParts.day} ${startParts.month} ${startParts.year} - ${endParts.day} ${endParts.month} ${endParts.year}`;
    } else if (startParts) {
      label = `${startParts.day} ${startParts.month} ${startParts.year}`;
    } else if (endParts) {
      label = `${endParts.day} ${endParts.month} ${endParts.year}`;
    }

    if (label && !seen.has(label)) {
      seen.add(label);
      labels.push(label);
    }
  });

  return labels;
}

function formatWorkshopDateLabels(offer: OfferSummary | OfferDetail, locale: string) {
  const labels: string[] = [];
  const seen = new Set<string>();

  getOccurrenceEntries(offer).forEach((entry) => {
    const start = pickString(asRecord(entry), ["start_datetime", "start", "start_at", "datetime", "date"]);
    const timezone = pickString(asRecord(entry), ["timezone", "tz", "time_zone"]);
    if (!start) {
      return;
    }

    const parsed = new Date(start);
    if (Number.isNaN(parsed.getTime())) {
      return;
    }

    const label = new Intl.DateTimeFormat(locale || "en", {
      day: "numeric",
      month: "short",
      ...(timezone ? { timeZone: timezone } : {}),
    }).format(parsed);

    if (!seen.has(label)) {
      seen.add(label);
      labels.push(label);
    }
  });

  return labels;
}

function getFallbackDateLabel(offer: OfferSummary | OfferDetail, locale: string) {
  const { start, timezone } = readNextOccurrence(offer);
  if (!start) {
    return "";
  }

  const parsed = new Date(start);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale || "en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(timezone ? { timeZone: timezone } : {}),
  }).format(parsed);
}

function formatClassOccurrenceLabel(start: string, locale: string, timezone?: string) {
  const parsed = new Date(start);
  if (Number.isNaN(parsed.getTime())) {
    return start;
  }

  return new Intl.DateTimeFormat(locale || "en", {
    dateStyle: "medium",
    timeStyle: "short",
    ...(timezone ? { timeZone: timezone } : {}),
  }).format(parsed);
}

function formatDateRangeLabel(
  startDate: Date,
  endDate: Date,
  locale: string,
  timezone?: string,
) {
  const startParts = getLocalizedDateParts(startDate.toISOString(), locale, timezone);
  const endParts = getLocalizedDateParts(endDate.toISOString(), locale, timezone);

  if (!startParts || !endParts) {
    return "";
  }

  if (
    startParts.day === endParts.day &&
    startParts.month === endParts.month &&
    startParts.year === endParts.year
  ) {
    return `${startParts.day} ${startParts.month} ${startParts.year}`;
  }

  if (startParts.year === endParts.year && startParts.month === endParts.month) {
    return `${startParts.day}-${endParts.day} ${startParts.month} ${startParts.year}`;
  }

  if (startParts.year === endParts.year) {
    return `${startParts.day} ${startParts.month} - ${endParts.day} ${endParts.month} ${startParts.year}`;
  }

  return `${startParts.day} ${startParts.month} ${startParts.year} - ${endParts.day} ${endParts.month} ${endParts.year}`;
}

function getDateSummary(offerType: OfferType, labels: string[], locale: string) {
  if (labels.length < MIN_MULTI_DATE_SUMMARY_COUNT) {
    return "";
  }

  const isFr = locale.toLowerCase().startsWith("fr");
  if (offerType === "TRAINING_INFO") {
    return isFr ? `${labels.length} périodes` : `${labels.length} periods`;
  }

  return isFr ? `${labels.length} dates` : `${labels.length} dates`;
}

function getWithLabel(locale: string) {
  return locale.toLowerCase().startsWith("fr") ? "avec" : "with";
}

function formatFacilitatorNames(names: readonly string[]) {
  const cleaned = names.map((name) => cleanDisplayText(name)).filter(Boolean);
  if (cleaned.length === 0) {
    return "";
  }
  if (cleaned.length === 1) {
    return cleaned[0];
  }
  if (cleaned.length === 2) {
    return `${cleaned[0]} & ${cleaned[1]}`;
  }
  return `${cleaned.slice(0, -1).join(", ")} & ${cleaned[cleaned.length - 1]}`;
}

function formatGroupedTrainingLabels(offer: OfferSummary | OfferDetail, locale: string) {
  const occurrences = getFutureDisplayScheduleEntries(offer as OfferDetail)
    .map((entry) => {
      const start = pickString(asRecord(entry), ["start_datetime", "start", "start_at", "datetime", "date"]);
      const timezone = pickString(asRecord(entry), ["timezone", "tz", "time_zone"]);
      return { start, timezone };
    })
    .filter((entry) => entry.start)
    .sort((a, b) => a.start.localeCompare(b.start));

  if (occurrences.length === 0) {
    return [];
  }

  const uniqueDays: Array<{ date: Date; timezone: string }> = [];
  const seen = new Set<string>();
  occurrences.forEach((entry) => {
    const dayKey = entry.start.slice(0, 10);
    if (seen.has(dayKey)) {
      return;
    }
    seen.add(dayKey);
    const parsed = new Date(`${dayKey}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return;
    }
    uniqueDays.push({ date: parsed, timezone: entry.timezone });
  });

  const groups: Array<Array<{ date: Date; timezone: string }>> = [];
  uniqueDays.forEach((entry) => {
    const current = groups[groups.length - 1];
    if (!current) {
      groups.push([entry]);
      return;
    }

    const previous = current[current.length - 1];
    const diffDays = Math.round((entry.date.getTime() - previous.date.getTime()) / 86400000);
    if (diffDays <= 3) {
      current.push(entry);
      return;
    }

    groups.push([entry]);
  });

  return groups
    .map((group) => {
      const start = group[0];
      const end = group[group.length - 1];
      return formatDateRangeLabel(start.date, end.date, locale, start.timezone || end.timezone);
    })
    .filter(Boolean);
}

function buildOfferSequence(
  source: {
    workshops: OfferSummary[];
    trainings: OfferSummary[];
    classes: OfferSummary[];
    privateSessions: OfferSummary[];
  },
) {
  const sortedBuckets = [
    [...source.workshops].sort(sortByNextOccurrence),
    [...source.trainings].sort(sortByNextOccurrence),
    [...source.classes].sort(sortByNextOccurrence),
    [...source.privateSessions].sort(sortByNextOccurrence),
  ];

  const selected: OfferSummary[] = [];
  const seen = new Set<string>();

  while (sortedBuckets.some((bucket) => bucket.length > 0)) {
    sortedBuckets.forEach((bucket) => {
      while (bucket.length > 0) {
        const offer = bucket.shift();
        if (!offer) {
          return;
        }
        const slug = getOfferSlug(offer);
        if (!slug || seen.has(slug)) {
          continue;
        }
        seen.add(slug);
        selected.push(offer);
        break;
      }
    });
  }

  return selected;
}

async function safeFetchOffers(hostname: string, locale: string, type: OfferType) {
  try {
    return await fetchOffers({ hostname, locale, type });
  } catch {
    return [] as OfferSummary[];
  }
}

async function safeFetchOfferDetail(hostname: string, locale: string, slug: string) {
  try {
    return await fetchOfferDetail({ hostname, locale, slug });
  } catch {
    return null;
  }
}

function selectPriorityHighlights(workshops: OfferSummary[], trainings: OfferSummary[], limit: number) {
  const selected: OfferSummary[] = [];
  const seen = new Set<string>();

  const addOffer = (offer: OfferSummary) => {
    const slug = getOfferSlug(offer);
    if (!slug || seen.has(slug) || selected.length >= limit) {
      return;
    }
    seen.add(slug);
    selected.push(offer);
  };

  [...workshops].sort(sortByNextOccurrence).forEach(addOffer);
  if (selected.length < limit) {
    [...trainings].sort(sortByNextOccurrence).forEach(addOffer);
  }

  return selected.slice(0, limit);
}

function buildHighlightCard(
  offer: OfferSummary | OfferDetail,
  locale: string,
  fallbackDateLabel: string,
): HomeHighlightCard {
  const record = asRecord(offer);
  const offerType = getOfferType(offer);
  const facilitators = getFacilitators(offer as OfferDetail);
  const firstFacilitator = facilitators[0];
  const facilitatorName = firstFacilitator ? getFacilitatorName(firstFacilitator) : "";
  const facilitatorImage = pickString(asRecord(firstFacilitator), [
    "photo_url",
    "photoUrl",
    "image_url",
    "imageUrl",
    "avatar_url",
    "avatarUrl",
  ]);
  const excerpt = getOfferDescription(offer, 155);
  const heroImage = pickString(record, ["hero_image_url", "heroImageUrl", "image_url", "imageUrl"]);
  const rawDateLabels =
    offerType === "TRAINING_INFO"
      ? (() => {
          const scheduleCardLabels = formatTrainingPeriodLabel(offer, locale);
          return scheduleCardLabels.length > 0 ? scheduleCardLabels : formatGroupedTrainingLabels(offer, locale);
        })()
      : formatWorkshopDateLabels(offer, locale);
  const fallbackDate = getFallbackDateLabel(offer, locale);
  const dateLabels = rawDateLabels.slice(0, MAX_HIGHLIGHT_DATE_PILLS);
  const resolvedDateLabels = dateLabels.length > 0 ? dateLabels : [fallbackDate || fallbackDateLabel];

  const title = getOfferTitle(offer, "Untitled");
  const imageOverride = getForestImageOverride(title);

  return {
    href: getOfferHref(offer, locale),
    title,
    excerpt,
    imageUrl: imageOverride || heroImage || facilitatorImage || FALLBACK_HIGHLIGHT_IMAGE,
    typeLabel: getTypeLabel(offerType, locale),
    typeVariant: getOfferTypeVariant(offerType),
    facilitatorName,
    facilitatorImage,
    dateSummary: getDateSummary(offerType, rawDateLabels, locale),
    dateLabels: resolvedDateLabels,
  };
}

function buildExploreDateLine(
  offer: OfferSummary | OfferDetail,
  locale: string,
  labels: {
    datesComingSoonLabel: string;
    byAppointmentLabel: string;
  },
) {
  const offerType = getOfferType(offer);
  const fallbackDate = getFallbackDateLabel(offer, locale);

  if (offerType === "PRIVATE_SESSION") {
    return fallbackDate || labels.byAppointmentLabel;
  }

  if (offerType === "CLASS") {
    const { start, timezone } = readNextOccurrence(offer);
    return start ? formatClassOccurrenceLabel(start, locale, timezone) : labels.datesComingSoonLabel;
  }

  const rawDateLabels =
    offerType === "TRAINING_INFO"
      ? (() => {
          const scheduleCardLabels = formatTrainingPeriodLabel(offer, locale);
          return scheduleCardLabels.length > 0 ? scheduleCardLabels : formatGroupedTrainingLabels(offer, locale);
        })()
      : formatWorkshopDateLabels(offer, locale);

  if (rawDateLabels.length === 0) {
    return fallbackDate || labels.datesComingSoonLabel;
  }

  const summary = getDateSummary(offerType, rawDateLabels, locale);
  return summary ? `${rawDateLabels[0]} · ${summary}` : rawDateLabels[0];
}

function buildExploreCard(
  offer: OfferSummary | OfferDetail,
  locale: string,
  labels: {
    datesComingSoonLabel: string;
    byAppointmentLabel: string;
  },
): ForestHomeOfferCard {
  const record = asRecord(offer);
  const offerType = getOfferType(offer);
  const facilitators = getFacilitators(offer as OfferDetail);
  const slug = getOfferSlug(offer);
  const facilitatorOverride = getForestFacilitatorNamesOverride(slug);
  const facilitatorNames = formatFacilitatorNames(
    facilitators.map((facilitator) => getFacilitatorName(facilitator, "")).filter(Boolean),
  );
  const facilitatorName = facilitatorOverride
    ? formatFacilitatorNames(facilitatorOverride)
    : facilitatorNames;
  const excerpt = getOfferDescription(offer, 160);
  const imageUrl =
    pickString(record, ["hero_image_url", "heroImageUrl", "image_url", "imageUrl"]) ||
    FALLBACK_HIGHLIGHT_IMAGE;
  const domains = getDomains(offer as OfferDetail);

  return {
    href: getOfferHref(offer, locale),
    title: getOfferTitle(offer, "Untitled"),
    imageUrl,
    excerpt,
    typeLabel: getTypeLabel(offerType, locale),
    typeVariant: getOfferTypeVariant(offerType),
    facilitatorLine: facilitatorName ? `${getWithLabel(locale)} ${facilitatorName}` : "",
    dateLine: buildExploreDateLine(offer, locale, labels),
    domainSlugs: domains.map((domain) => String(domain.id)),
  };
}

function Separator() {
  return (
    <div aria-hidden="true" className="fl-separator fl-separator--subtle" role="separator">
      <span className="fl-separator__dot" />
    </div>
  );
}

export default async function ForestHomePage({ hostname, locale }: ForestHomePageProps) {
  const content = getForestHomeContent(locale);

  const [workshops, trainings, classes, privateSessions] = await Promise.all([
    safeFetchOffers(hostname, locale, "WORKSHOP"),
    safeFetchOffers(hostname, locale, "TRAINING_INFO"),
    safeFetchOffers(hostname, locale, "CLASS"),
    safeFetchOffers(hostname, locale, "PRIVATE_SESSION"),
  ]);

  const highlightSelection = selectPriorityHighlights(workshops, trainings, 3);
  const highlightCards = (
    await Promise.all(
      highlightSelection.map(async (offer) => {
        const slug = getOfferSlug(offer);
        if (!slug) {
          return buildHighlightCard(offer, locale, content.highlights.dateFallbackLabel);
        }

        const detail = await safeFetchOfferDetail(hostname, locale, slug);
        return buildHighlightCard(detail ?? offer, locale, content.highlights.dateFallbackLabel);
      }),
    )
  ).filter(Boolean);

  const mixedSelection = buildOfferSequence(
    {
      workshops,
      trainings,
      classes,
      privateSessions,
    },
  );

  const exploreCards = mixedSelection.map((offer) =>
    buildExploreCard(offer, locale, {
      datesComingSoonLabel: content.explore.datesComingSoonLabel,
      byAppointmentLabel: content.explore.byAppointmentLabel,
    }),
  );

  const exploreFilters = mixedSelection.reduce<ForestHomeOfferFilter[]>((filters, offer) => {
    getDomains(offer as OfferDetail).forEach((domain) => {
      const slug = String(domain.id);
      if (!slug || filters.some((filter) => filter.slug === slug)) {
        return;
      }
      if (!domain.name) {
        return;
      }
      filters.push({ slug, label: domain.name });
    });
    return filters;
  }, []);
  exploreFilters.sort((a, b) => a.label.localeCompare(b.label, locale));

  const typeOrder: Array<ForestHomeOfferCard["typeVariant"]> = [
    "class",
    "workshop",
    "training",
    "private-session",
  ];
  const exploreTypeFilters = typeOrder.reduce<ForestHomeOfferTypeFilter[]>((filters, typeVariant) => {
    const match = exploreCards.find((card) => card.typeVariant === typeVariant);
    if (!match) {
      return filters;
    }
    filters.push({
      slug: typeVariant,
      label: match.typeLabel,
    });
    return filters;
  }, []);

  return (
    <ForestPageShell className="forest-site-shell--home">
      <section className="fh-home-hero">
        <ForestHomeHeroVideo
          posterImage={content.hero.posterImage}
          title={content.hero.title}
          videoId={content.hero.videoId}
        />
        <div className="fh-home-hero__veil" />
        <div className="fh-home-hero__content">
          <div className="fh-home-hero__copy">
            <p className="fh-home-hero__eyebrow">{content.hero.eyebrow}</p>
            <h1 className="fc-intro__title fh-home-hero__title">{content.hero.title}</h1>
            <p className="fh-home-hero__subtitle">{content.hero.subtitle}</p>
            <div className="fh-home-hero__actions">
              <Link className="fl-btn" href={localizePath(locale, "/calendar")}>
                {content.hero.primaryCta}
              </Link>
              <a className="fh-home-hero__secondary" href="https://www.google.com/maps/place/Rue+des+Alli%C3%A9s+274,+1190+Forest" target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {content.hero.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="fh-home-page">
        <section className="fh-home-section">
          <div className="fh-home-section__head">
            <div>
              <p className="fp-chapter__eyebrow">{content.highlights.eyebrow}</p>
              <h2 className="fp-section__heading fp-section__heading--left">{content.highlights.title}</h2>
              <p className="fp-section__subtitle fp-section__subtitle--left">{content.highlights.subtitle}</p>
            </div>
            <Link className="text-link" href={localizePath(locale, "/workshops")}>
              {content.highlights.linkLabel}
            </Link>
          </div>

          {highlightCards.length > 0 ? (
            <div className="fh-home-highlights">
              {highlightCards.map((card, index) => (
                <Link
                  className={`fh-home-highlight-card fh-home-highlight-card--${card.typeVariant}${index === 0 ? " is-primary" : ""}`}
                  href={card.href}
                  key={card.href}
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(2, 10, 11, 0.14), rgba(2, 10, 11, 0.72) 62%, rgba(2, 10, 11, 0.92)), url(${card.imageUrl})`,
                  }}
                >
                  <span className={`fh-home-highlight-card__badge fh-home-highlight-card__badge--${card.typeVariant}`}>
                    {card.typeLabel}
                  </span>
                  <div className="fh-home-highlight-card__content">
                    {card.facilitatorName ? (
                      <div className="fh-home-highlight-card__facilitator">
                        {card.facilitatorImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt={card.facilitatorName}
                            className="fh-home-highlight-card__facilitator-avatar"
                            loading="lazy"
                            src={card.facilitatorImage}
                          />
                        ) : null}
                        <span>{card.facilitatorName}</span>
                      </div>
                    ) : null}
                    <h3>{card.title}</h3>
                    {card.excerpt ? <p className="fh-home-highlight-card__excerpt">{card.excerpt}</p> : null}
                    <div className="fh-home-highlight-card__schedule">
                      {card.dateSummary ? (
                        <p className="fh-home-highlight-card__date-summary">{card.dateSummary}</p>
                      ) : null}
                      <div className="fh-home-highlight-card__dates">
                        {card.dateLabels.map((label) => (
                          <span className="fh-home-highlight-card__date-pill" key={`${card.href}-${label}`}>
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="forest-empty-state">
              <h3>{content.highlights.emptyTitle}</h3>
              <p>{content.highlights.emptyBody}</p>
            </div>
          )}
        </section>

        <Separator />

        <section className="fh-home-section">
          <div className="fh-home-section__head">
            <div>
              <p className="fp-chapter__eyebrow">{content.explore.eyebrow}</p>
              <h2 className="fp-section__heading fp-section__heading--left">{content.explore.title}</h2>
              <p className="fp-section__subtitle fp-section__subtitle--left">{content.explore.subtitle}</p>
            </div>
          </div>

          {exploreCards.length > 0 ? (
            <ForestHomeOfferExplorer
              cards={exploreCards}
              domainFilters={exploreFilters}
              typeFilters={exploreTypeFilters}
              labels={{
                domainFilter: content.explore.domainFilterLabel,
                typeFilter: content.explore.typeFilterLabel,
                allDomains: content.explore.allDomainsLabel,
                allTypes: content.explore.allTypesLabel,
                noResultsTitle: content.explore.noResultsTitle,
                noResultsBody: content.explore.noResultsBody,
                previous: content.explore.previousLabel,
                next: content.explore.nextLabel,
                goTo: content.explore.goToLabel,
              }}
            />
          ) : (
            <div className="forest-empty-state">
              <h3>{content.explore.emptyTitle}</h3>
              <p>{content.explore.emptyBody}</p>
            </div>
          )}
        </section>

        <Separator />

        <section className="fh-home-story">
          <div className="fh-home-story__intro">
            <p className="fp-chapter__eyebrow">{content.story.eyebrow}</p>
            <h2 className="fp-section__heading fp-section__heading--left">{content.story.title}</h2>
            <p className="fp-section__subtitle fp-section__subtitle--left">{content.story.body}</p>
            <Link className="text-link" href={localizePath(locale, "/visit")}>
              {content.story.supportLinkLabel}
            </Link>
          </div>

          <div className="fh-home-story__layout">
            <div className="fh-home-story__points">
              {content.story.points.map((point) => (
                <article className="fh-home-story__point" key={point.title}>
                  <span className="fh-home-story__point-icon">
                    <HomeStoryIcon icon={point.icon} />
                  </span>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </article>
              ))}
            </div>
            <div className="fh-home-story__gallery">
              {content.story.gallery.map((image, index) => (
                <figure className={`fh-home-story__figure fh-home-story__figure--${index + 1}`} key={image.src}>
                  <Image
                    alt={image.alt}
                    className="fh-home-story__image"
                    height={index === 0 ? 760 : 420}
                    sizes={index === 0 ? "(max-width: 1024px) 100vw, 42vw" : "(max-width: 1024px) 100vw, 22vw"}
                    src={image.src}
                    width={index === 0 ? 960 : 560}
                  />
                  <figcaption>{image.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        <section className="fh-home-final">
          <div className="fh-home-final__copy">
            <p className="fp-chapter__eyebrow">{content.closing.eyebrow}</p>
            <h2 className="fp-section__heading">{content.closing.title}</h2>
            <p className="fp-section__subtitle">{content.closing.body}</p>
            <p className="fh-home-final__note">{content.closing.note}</p>
          </div>
          <div className="fh-home-final__actions">
            <Link className="fl-btn" href={localizePath(locale, "/visit")}>
              {content.closing.primaryCta}
            </Link>
            <Link className="fl-btn fl-btn--secondary" href={localizePath(locale, "/about")}>
              {content.closing.secondaryCta}
            </Link>
          </div>
        </section>
      </div>
    </ForestPageShell>
  );
}
