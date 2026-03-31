import { cleanDisplayText, cleanRichTextHtml } from "@/lib/content-cleanup";
import { getOfferLabels as getLocalizedOfferLabels } from "@/lib/i18n";
import type {
  BookingOption,
  Facilitator,
  Occurrence,
  OfferDetail,
  OfferSummary,
  OfferType,
  PriceOption,
  PricingGroup,
  PricingGroupTier,
  PricingPromo,
  PrimaryCTA,
  QuickFacts,
  ScheduleCard,
  ScheduleCardFacilitator,
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

export function getOfferTypeVariant(offerType: string) {
  const normalized = offerType.trim().toUpperCase();
  if (normalized === "CLASS") {
    return "class" as const;
  }
  if (normalized === "PRIVATE_SESSION") {
    return "private-session" as const;
  }
  if (normalized === "TRAINING_INFO") {
    return "training" as const;
  }
  return "workshop" as const;
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

export function getOfferSeoTitle(offer: OfferDetail | OfferSummary) {
  const record = asRecord(offer);
  return pickString(record, ["seo_title", "seoTitle", "title", "name"]);
}

export function getOfferSeoDescription(offer: OfferDetail | OfferSummary) {
  const record = asRecord(offer);
  return pickString(record, ["seo_description", "seoDescription", "excerpt"]);
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
  return pickString(record, [
    "hero_image_url",
    "heroImageUrl",
    "offer_hero_image_url",
    "image_url",
    "imageUrl",
    "featured_image",
  ]);
}

export function getOfferHeroVideoUrl(offer: OfferDetail) {
  const record = asRecord(offer);
  return pickString(record, ["hero_video_url", "heroVideoUrl", "video_url", "videoUrl", "media_url", "mediaUrl"]);
}

export function getCanonicalUrl(offer: OfferDetail) {
  const record = asRecord(offer);
  return pickString(record, ["canonical_url", "canonicalUrl", "url"]);
}

export function getDeclaredCanonicalUrl(offer: OfferDetail) {
  const record = asRecord(offer);
  return pickString(record, ["canonical_url", "canonicalUrl"]);
}

export function getMediaUrl(offer: OfferDetail) {
  const record = asRecord(offer);
  return pickString(record, ["media_url", "mediaUrl", "video_url", "videoUrl"]);
}

function pickImageUrlFromRecords(records: RawRecord[]) {
  for (const record of records) {
    const imageUrl = pickString(record, ["image_url", "imageUrl", "url", "src"]);
    if (imageUrl) {
      return imageUrl;
    }
  }

  return "";
}

export function getOfferSocialImageUrl(offer: OfferDetail) {
  const record = asRecord(offer);

  const directImage = pickString(record, [
    "seo_image_url",
    "seoImageUrl",
    "og_image_url",
    "ogImageUrl",
    "hero_image_url",
    "heroImageUrl",
    "image_url",
    "imageUrl",
    "featured_image",
  ]);
  if (directImage) {
    return directImage;
  }

  const images = pickImageUrlFromRecords(asRecords(record?.images));
  if (images) {
    return images;
  }

  for (const section of asRecords(record?.sections)) {
    const sectionValue = asRecord(section.value);
    const sectionImages = pickImageUrlFromRecords(asRecords(sectionValue?.images));
    if (sectionImages) {
      return sectionImages;
    }
  }

  return "";
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

  return asRecords(record.occurrences ?? record.next_occurrences ?? record.sessions) as Occurrence[];
}

export function getOccurrenceStartValue(occurrence: unknown) {
  const record = asRecord(occurrence);
  return pickString(record, ["start_datetime", "start", "start_at", "datetime", "date"]);
}

export function getOccurrenceEndValue(occurrence: unknown) {
  const record = asRecord(occurrence);
  return pickString(record, ["end_datetime", "end", "end_at"]);
}

export function getOccurrenceBookingUrl(occurrence: unknown) {
  const record = asRecord(occurrence);
  return pickString(record, ["booking_url", "bookingUrl"]);
}

export function getOccurrenceIcsUrl(occurrence: unknown) {
  const record = asRecord(occurrence);
  return pickString(record, ["ics_url", "icsUrl"]);
}

export function compareOccurrenceStart(left: unknown, right: unknown) {
  const leftStart = getOccurrenceStartValue(left);
  const rightStart = getOccurrenceStartValue(right);

  if (!leftStart && !rightStart) {
    return 0;
  }
  if (!leftStart) {
    return 1;
  }
  if (!rightStart) {
    return -1;
  }

  const leftTime = Date.parse(leftStart);
  const rightTime = Date.parse(rightStart);
  const leftValid = Number.isFinite(leftTime);
  const rightValid = Number.isFinite(rightTime);

  if (leftValid && rightValid && leftTime !== rightTime) {
    return leftTime - rightTime;
  }

  return leftStart.localeCompare(rightStart);
}

export function getSortedOccurrences(offer: OfferDetail) {
  return [...getOccurrences(offer)].sort(compareOccurrenceStart);
}

export function getFutureOccurrences(offer: OfferDetail, now = new Date()) {
  return filterFutureEntries(getSortedOccurrences(offer), now);
}

export function getUpcomingOccurrenceBookingUrl(offer: OfferDetail, now = new Date()) {
  for (const occurrence of getFutureOccurrences(offer, now)) {
    const bookingUrl = getOccurrenceBookingUrl(occurrence);
    if (bookingUrl) {
      return bookingUrl;
    }
  }

  return "";
}

export function getPriceOptions(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record) {
    return [] as PriceOption[];
  }

  return asRecords(record.price_options ?? record.priceOptions ?? record.pricing) as PriceOption[];
}

export function getPricingGroups(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record) {
    return [] as PricingGroup[];
  }

  return asRecords(record.pricing_groups ?? record.pricingGroups) as PricingGroup[];
}

export function getPricingGroupTiers(group: PricingGroup) {
  const record = asRecord(group);
  if (!record) {
    return [] as PricingGroupTier[];
  }

  return asRecords(record.tiers ?? record.price_options ?? record.priceOptions) as PricingGroupTier[];
}

export function getBookingOptions(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record) {
    return [] as BookingOption[];
  }

  return asRecords(record.booking_options ?? record.bookingOptions) as BookingOption[];
}

export function getPricingPromos(offer: OfferDetail) {
  const record = asRecord(offer);
  if (!record) {
    return [] as PricingPromo[];
  }

  return asRecords(record.pricing_promos ?? record.pricingPromos ?? record.discounts) as PricingPromo[];
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
  const richBio = pickString(record, ["bio"]);
  if (richBio) {
    return cleanRichTextHtml(richBio);
  }

  return cleanDisplayText(pickString(record, ["short_bio", "shortBio", "description"]));
}

export function getFacilitatorQuote(facilitator: Facilitator) {
  const record = asRecord(facilitator);
  return pickString(record, ["quote", "citation", "inspirational_sentence"]);
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
      const facRaw = asRecord(card.facilitator);
      const normalized: ScheduleCard = {
        date_label: pickString(card, ["date_label", "dateLabel"]),
        start_datetime: pickString(card, ["start_datetime", "start", "start_at", "datetime"]),
        end_datetime: pickString(card, ["end_datetime", "end", "end_at"]),
        timezone: pickString(card, ["timezone", "tz", "time_zone"]),
        facilitator: facRaw
          ? {
              id: (facRaw.id as number | string) ?? undefined,
              display_name: pickString(facRaw, ["display_name", "displayName", "name"]),
              photo_url: pickString(facRaw, ["photo_url", "photoUrl", "image_url", "imageUrl"]),
              has_public_profile: typeof facRaw.has_public_profile === "boolean" ? facRaw.has_public_profile : undefined,
            }
          : null,
      };

      const hasAny = Object.values(normalized).some((value) => Boolean(value));
      return hasAny ? normalized : null;
    })
    .filter((card): card is ScheduleCard => card !== null);
}

function filterFutureEntries<T>(entries: T[], now = new Date()) {
  const nowTime = now.getTime();

  return entries.filter((entry) => {
    const start = getOccurrenceStartValue(entry);
    if (!start) {
      return false;
    }

    const startTime = Date.parse(start);
    return Number.isFinite(startTime) && startTime >= nowTime;
  });
}

export function getSortedScheduleCards(offer: OfferDetail) {
  return [...getScheduleCards(offer)].sort(compareOccurrenceStart);
}

export function getFutureScheduleCards(offer: OfferDetail, now = new Date()) {
  return filterFutureEntries(getSortedScheduleCards(offer), now);
}

export function hasExplicitScheduleCards(offer: OfferDetail | OfferSummary) {
  const record = asRecord(offer);
  return Boolean(record)
    && (
      Object.prototype.hasOwnProperty.call(record, "schedule_cards")
      || Object.prototype.hasOwnProperty.call(record, "scheduleCards")
    );
}

export function getDisplayScheduleEntries(offer: OfferDetail | OfferSummary) {
  const record = asRecord(offer);
  if (!record) {
    return [] as RawRecord[];
  }

  const scheduleCards = asRecords(record.schedule_cards ?? record.scheduleCards);
  const directOccurrences = getOccurrences(offer as OfferDetail) as RawRecord[];
  const offerType = getOfferType(offer);

  if ((offerType === "WORKSHOP" || offerType === "TRAINING_INFO") && hasExplicitScheduleCards(offer)) {
    return [...scheduleCards].sort(compareOccurrenceStart);
  }

  if (directOccurrences.length > 0) {
    return [...directOccurrences].sort(compareOccurrenceStart);
  }

  if (scheduleCards.length > 0) {
    return [...scheduleCards].sort(compareOccurrenceStart);
  }

  const nextRaw = record.next_occurrence ?? record.nextOccurrence;
  if (typeof nextRaw === "string") {
    return [{ start_datetime: nextRaw }];
  }

  const nextOccurrence = asRecord(nextRaw);
  if (nextOccurrence) {
    return [nextOccurrence];
  }

  return [] as RawRecord[];
}

export function getFutureDisplayScheduleEntries(
  offer: OfferDetail | OfferSummary,
  now = new Date(),
) {
  return filterFutureEntries(getDisplayScheduleEntries(offer), now);
}

export function getNextUpcomingOccurrenceRecord(
  offer: OfferDetail | OfferSummary,
  now = new Date(),
) {
  const futureEntries = getFutureDisplayScheduleEntries(offer, now);
  return futureEntries[0] ?? null;
}

export function occurrenceToScheduleCard(occurrence: unknown): ScheduleCard | null {
  const record = asRecord(occurrence);
  if (!record) {
    return null;
  }

  const startDateTime = getOccurrenceStartValue(record);
  const endDateTime = getOccurrenceEndValue(record);
  const timezone = pickString(record, ["timezone", "tz", "time_zone"]);
  const facilitator = getOccurrenceFacilitator(record);

  if (!startDateTime && !endDateTime && !timezone && !facilitator) {
    return null;
  }

  return {
    date_label: pickString(record, ["date_label", "dateLabel", "label", "title"]),
    start_datetime: startDateTime || null,
    end_datetime: endDateTime || null,
    timezone: timezone || null,
    facilitator,
  };
}

export function getOccurrenceFacilitator(occurrence: unknown): ScheduleCardFacilitator | null {
  const record = asRecord(occurrence);
  const facRaw = asRecord(record?.facilitator);
  if (!facRaw) {
    return null;
  }

  const displayName = pickString(facRaw, ["display_name", "displayName", "name"]);
  const photoUrl = pickString(facRaw, ["photo_url", "photoUrl", "image_url", "imageUrl"]);
  const hasPublicProfile =
    typeof facRaw.has_public_profile === "boolean" ? facRaw.has_public_profile : undefined;

  if (!displayName && !photoUrl && typeof hasPublicProfile === "undefined") {
    return null;
  }

  return {
    id: (facRaw.id as number | string) ?? undefined,
    display_name: displayName || null,
    photo_url: photoUrl || null,
    has_public_profile: hasPublicProfile,
  };
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

export type BenefitItem = { title: string; description: string };

export function getBenefits(
  offer: OfferDetail,
): { heading: string; items: BenefitItem[] } | null {
  const sections = getSections(offer);
  const section = sections.find((s) => s.type === "offer_benefits");
  if (!section) return null;

  const value = section.value as Record<string, unknown> | undefined;
  const heading = (value?.heading as string) || "";
  const rawItems =
    (value?.items as Array<Record<string, unknown>>) || [];

  const items = rawItems
    .map((item) => {
      const inner = ((item as Record<string, unknown>).value ?? item) as {
        title?: string;
        description?: string;
      };
      return {
        title: inner.title || "",
        description: inner.description || "",
      };
    })
    .filter((item) => item.title || item.description);

  return items.length > 0 ? { heading, items } : null;
}

export function readNextOccurrence(offer: OfferSummary | OfferDetail) {
  const occurrence = getNextUpcomingOccurrenceRecord(offer);
  if (!occurrence) {
    const record = asRecord(offer);
    if (!record) {
      return { start: "", timezone: "" };
    }

    const rawOccurrence = record.next_occurrence ?? record.nextOccurrence;
    if (typeof rawOccurrence === "string") {
      const startTime = Date.parse(rawOccurrence);
      if (Number.isFinite(startTime) && startTime >= Date.now()) {
        return { start: rawOccurrence, timezone: "" };
      }
    } else {
      const fallbackOccurrence = asRecord(rawOccurrence);
      const fallbackStart = getOccurrenceStartValue(fallbackOccurrence);
      if (fallbackOccurrence && fallbackStart) {
        const startTime = Date.parse(fallbackStart);
        if (Number.isFinite(startTime) && startTime >= Date.now()) {
          return {
            start: fallbackStart,
            timezone: pickString(fallbackOccurrence, ["timezone", "tz", "time_zone"]),
          };
        }
      }
    }

    return { start: "", timezone: "" };
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
