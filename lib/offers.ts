import { getOfferLabels as getLocalizedOfferLabels } from "@/lib/i18n";
import type {
  Facilitator,
  OfferDetail,
  OfferSummary,
  OfferType,
  PriceOption,
  PrimaryCTA,
  QuickFacts,
  ScheduleCard,
  SectionBlock,
  ThemeTag,
} from "@/lib/types";

export type RawRecord = Record<string, unknown>;
export type { OfferType };

export function asRecord(value: unknown): RawRecord | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as RawRecord;
  }

  return null;
}

export function asRecords(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as RawRecord[];
  }

  return value.map(asRecord).filter((item): item is RawRecord => item !== null);
}

function asNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export function normalizeText(value: unknown) {
  if (typeof value === "number") {
    return String(value);
  }

  return asNonEmptyString(value);
}

export function pickString(source: RawRecord | null, keys: string[], fallback = "") {
  if (!source) {
    return fallback;
  }

  for (const key of keys) {
    const value = source[key];
    const stringValue = asNonEmptyString(value);
    if (stringValue) {
      return stringValue;
    }
  }

  return fallback;
}

export function getOfferType(offer: OfferDetail | OfferSummary) {
  const record = asRecord(offer);
  const rawType = pickString(record, ["type", "offer_type", "offerType"], "WORKSHOP").toUpperCase();

  if (
    rawType === "WORKSHOP" ||
    rawType === "CLASS" ||
    rawType === "PRIVATE_SESSION" ||
    rawType === "TRAINING_INFO"
  ) {
    return rawType as OfferType;
  }

  return "WORKSHOP";
}

export function getOfferCollectionPathByType(offerType: string) {
  const normalized = offerType.trim().toUpperCase();
  if (normalized === "CLASS") {
    return "/classes";
  }
  if (normalized === "PRIVATE_SESSION") {
    return "/private-sessions";
  }
  if (normalized === "TRAINING_INFO") {
    return "/trainings";
  }
  return "/workshops";
}

export function getCanonicalOfferPathByTypeAndSlug(offerType: string, slug: string) {
  const cleanedSlug = slug.trim().replace(/^\/+/, "");
  if (!cleanedSlug) {
    return "";
  }
  return `${getOfferCollectionPathByType(offerType)}/${cleanedSlug}`;
}

export function getCanonicalOfferPath(offer: OfferDetail | OfferSummary) {
  const slug = getOfferSlug(offer);
  if (!slug) {
    return "";
  }
  const offerType = getOfferType(offer);
  return getCanonicalOfferPathByTypeAndSlug(offerType, slug);
}

export function getOfferSlug(offer: OfferDetail | OfferSummary) {
  const record = asRecord(offer);
  return pickString(record, ["slug"]);
}

export function getOfferTitle(offer: OfferDetail | OfferSummary, fallback = "Offer") {
  const record = asRecord(offer);
  return pickString(record, ["title", "name"], fallback);
}

export function getOfferSubtitle(offer: OfferDetail) {
  const record = asRecord(offer);
  return pickString(record, ["subtitle", "sub_title"]);
}

export function getOfferBodyHtml(offer: OfferDetail) {
  const record = asRecord(offer);
  return pickString(record, ["body_html", "bodyHtml", "body", "description_html", "description"]);
}

export function getOfferHeroImageUrl(offer: OfferDetail) {
  const record = asRecord(offer);
  return pickString(record, ["hero_image_url", "heroImageUrl", "offer_hero_image_url", "image_url", "imageUrl"]);
}

export function getOfferHeroVideoUrl(offer: OfferDetail) {
  const record = asRecord(offer);
  return pickString(record, ["hero_video_url", "heroVideoUrl", "video_url", "videoUrl"]);
}

export function getCanonicalUrl(offer: OfferDetail) {
  const record = asRecord(offer);
  return pickString(record, ["canonical_url", "canonicalUrl", "url"]);
}

export function getMediaUrl(offer: OfferDetail) {
  const record = asRecord(offer);
  return pickString(record, ["media_url", "mediaUrl", "video_url", "videoUrl"]);
}

export function isTrialEligible(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record) {
    return false;
  }
  const value = record.trial_eligible ?? record.trialEligible;
  return value === true;
}

export function getFaqItems(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record || !Array.isArray(record.faq)) {
    return [] as Array<{ question: string; answer: string }>;
  }

  return asRecords(record.faq)
    .map((item) => {
      const question = pickString(item, ["question"]);
      const answer = pickString(item, ["answer"]);
      if (!question || !answer) {
        return null;
      }
      return { question, answer };
    })
    .filter((item): item is { question: string; answer: string } => item !== null);
}

export function getPrimaryCta(offer: OfferDetail): PrimaryCTA | null {
  const record = asRecord(offer);
  if (!record) {
    return null;
  }

  const ctaRecord = asRecord(record.primary_cta ?? record.primaryCTA);
  const fallbackUrl = getCanonicalUrl(offer);
  const url = pickString(ctaRecord, ["url", "href"], fallbackUrl);

  if (!url) {
    return null;
  }

  const label = pickString(ctaRecord, ["label", "title", "text"]);
  const style = pickString(ctaRecord, ["style", "variant"]);

  return {
    label,
    url,
    style: style || null,
  };
}

export function getOccurrences(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record) {
    return [] as RawRecord[];
  }

  return asRecords(record.occurrences ?? record.next_occurrences ?? record.sessions);
}

export function getPriceOptions(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record) {
    return [] as PriceOption[];
  }

  return asRecords(record.price_options ?? record.priceOptions ?? record.pricing) as PriceOption[];
}

export function getFacilitators(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record) {
    return [] as Facilitator[];
  }

  return asRecords(record.facilitators ?? record.teachers ?? record.instructors) as Facilitator[];
}

export function getFacilitatorName(facilitator: Facilitator, fallback = "Facilitator") {
  const record = asRecord(facilitator);
  return pickString(record, ["name", "full_name", "display_name", "title"], fallback);
}

export function getFacilitatorSlug(facilitator: Facilitator) {
  const record = asRecord(facilitator);
  return pickString(record, ["slug"]);
}

export function getFacilitatorImageUrl(facilitator: Facilitator) {
  const record = asRecord(facilitator);
  return pickString(record, ["photo_url", "photoUrl", "image_url", "imageUrl", "avatar_url", "avatarUrl"]);
}

export function getFacilitatorBio(facilitator: Facilitator) {
  const record = asRecord(facilitator);
  return pickString(record, ["bio", "short_bio", "shortBio", "description"]);
}

export function getTags(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record) {
    return [] as string[];
  }

  const tags = record.tags;
  if (typeof tags === "string" && tags.trim()) {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(tags)) {
    return [] as string[];
  }

  return tags
    .map((tag) => {
      if (typeof tag === "string" && tag.trim()) {
        return tag.trim();
      }

      return pickString(asRecord(tag), ["name", "label", "slug"]);
    })
    .filter(Boolean);
}

export function getQuickFacts(offer: OfferDetail): QuickFacts | null {
  const record = asRecord(offer);
  if (!record) {
    return null;
  }

  const quickFactsRecord = asRecord(record.quick_facts ?? record.quickFacts);
  if (!quickFactsRecord) {
    return null;
  }

  const quickFacts: QuickFacts = {
    venue: pickString(quickFactsRecord, ["venue"]),
    location: pickString(quickFactsRecord, ["location"]),
    languages: pickString(quickFactsRecord, ["languages"]),
    level: pickString(quickFactsRecord, ["level"]),
    duration: pickString(quickFactsRecord, ["duration"]),
    price_note: pickString(quickFactsRecord, ["price_note", "priceNote"]),
    facilitator_note: pickString(quickFactsRecord, ["facilitator_note", "facilitatorNote"]),
  };

  const hasValues = Object.values(quickFacts).some((value) => Boolean(value));
  return hasValues ? quickFacts : null;
}

export function hasQuickFacts(offer: OfferDetail) {
  return getQuickFacts(offer) !== null;
}

export function getScheduleCards(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record) {
    return [] as ScheduleCard[];
  }

  return asRecords(record.schedule_cards ?? record.scheduleCards)
    .map((card) => {
      const normalized: ScheduleCard = {
        date_label: pickString(card, ["date_label", "dateLabel"]),
        start_datetime: pickString(card, ["start_datetime", "start", "start_at", "datetime"]),
        end_datetime: pickString(card, ["end_datetime", "end", "end_at"]),
        timezone: pickString(card, ["timezone", "tz", "time_zone"]),
      };

      const hasAny = Object.values(normalized).some((value) => Boolean(value));
      return hasAny ? normalized : null;
    })
    .filter((card): card is ScheduleCard => card !== null);
}

export function getThemes(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record) {
    return [] as ThemeTag[];
  }

  const themes: ThemeTag[] = [];
  for (const theme of asRecords(record.themes)) {
    const name = pickString(theme, ["name", "label", "title"]);
    if (!name) {
      continue;
    }

    const rawId = theme.id;
    const id = typeof rawId === "number" || typeof rawId === "string" ? rawId : name;
    themes.push({ id, name });
  }

  return themes;
}

export function getDomains(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record) {
    return [] as ThemeTag[];
  }

  const domains: ThemeTag[] = [];
  for (const domain of asRecords(record.domains)) {
    const name = pickString(domain, ["name", "label"]);
    if (!name) {
      continue;
    }

    const slug = pickString(domain, ["slug"], name);
    domains.push({
      id: slug,
      name,
    });
  }

  return domains;
}

export function getSections(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record || !Array.isArray(record.sections)) {
    return [] as SectionBlock[];
  }

  return record.sections
    .map((block) => {
      const blockRecord = asRecord(block);
      if (!blockRecord) {
        return null;
      }

      const type = pickString(blockRecord, ["type"]);
      if (!type) {
        return null;
      }

      return {
        type,
        value: blockRecord.value,
      } as SectionBlock;
    })
    .filter((block): block is SectionBlock => block !== null);
}

export function readNextOccurrence(offer: OfferSummary | OfferDetail) {
  const record = asRecord(offer);
  if (!record) {
    return { start: "", timezone: "" };
  }

  const rawOccurrence = record.next_occurrence ?? record.nextOccurrence;

  if (typeof rawOccurrence === "string") {
    return { start: rawOccurrence, timezone: "" };
  }

  const occurrence = asRecord(rawOccurrence);
  if (!occurrence) {
    const allOccurrences = asRecords(record.occurrences ?? record.next_occurrences ?? record.sessions);
    if (allOccurrences.length === 0) {
      return { start: "", timezone: "" };
    }

    return {
      start: pickString(allOccurrences[0], ["start_datetime", "start", "start_at", "datetime", "date"]),
      timezone: pickString(allOccurrences[0], ["timezone", "tz", "time_zone"]),
    };
  }

  return {
    start: pickString(occurrence, ["start_datetime", "start", "start_at", "datetime", "date"]),
    timezone: pickString(occurrence, ["timezone", "tz", "time_zone"]),
  };
}

export function formatDateTime(dateValue: string, locale: string, timezone?: string) {
  if (!dateValue) {
    return "";
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  };

  if (timezone) {
    formatOptions.timeZone = timezone;
  }

  const formatted = new Intl.DateTimeFormat(locale || "en", formatOptions).format(parsed);
  return timezone ? `${formatted} (${timezone})` : formatted;
}

export function getOfferLabels(locale: string) {
  return getLocalizedOfferLabels(locale);
}
