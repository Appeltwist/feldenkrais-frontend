import { fetchCalendar, fetchOffers } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getPricingContent, type ScheduleDay, type ScheduleEntry } from "@/lib/pricing-content";

import ForestScheduleList from "./ForestScheduleList";

type ForestWeeklyScheduleSectionProps = {
  locale: string;
  eyebrow?: string;
  heading?: string;
  subtitle?: string | null;
  className?: string;
  /** @deprecated No longer used — kept for backward compat with pricing page */
  parallax?: boolean;
};

type RawRecord = Record<string, unknown>;

type LiveOccurrence = {
  id: number;
  startDateTime: string;
  endDateTime: string;
  timezone: string;
  offerType: string;
  bookingUrl?: string;
  facilitatorName: string;
  facilitatorPhotoUrl?: string;
  offerSlug: string;
  offerTitle: string;
  offerExcerpt?: string;
  offerCanonicalUrl?: string;
};

type OfferMetadata = {
  title: string;
  slug: string;
  excerpt?: string;
  canonicalUrl?: string;
};

type LiveScheduleState = "ready" | "empty" | "unavailable";

const WEEKDAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function asRecord(value: unknown): RawRecord | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as RawRecord;
  }
  return null;
}

function pickString(source: RawRecord | null, keys: string[], fallback = "") {
  if (!source) {
    return fallback;
  }
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return fallback;
}

function normalizeName(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function normalizeClassKey(value: string | null | undefined) {
  return normalizeName(value).replace(/[^a-z0-9à-ÿ/&]+/gi, " ").replace(/\s+/g, " ").trim();
}

function firstWord(value: string | null | undefined) {
  const normalized = normalizeName(value);
  if (!normalized) {
    return "";
  }

  return normalized.split(/\s+/)[0] ?? normalized;
}

function formatTimeLabel(value: string, locale: string, timezone?: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(locale || "en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...(timezone ? { timeZone: timezone } : {}),
  }).format(parsed);
}

function weekdayOrder(value: string, timezone?: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 999;
  }
  const weekday = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    ...(timezone ? { timeZone: timezone } : {}),
  }).format(parsed);
  const index = WEEKDAY_ORDER.indexOf(weekday as (typeof WEEKDAY_ORDER)[number]);
  return index === -1 ? 999 : index;
}

function weekdayLabel(value: string, locale: string, timezone?: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(locale || "en", {
    weekday: "long",
    ...(timezone ? { timeZone: timezone } : {}),
  }).format(parsed);
}

function profileFromUnknown(value: unknown) {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const displayName = pickString(record, ["display_name", "displayName", "name"]);
  const photoUrl = pickString(record, ["photo_url", "photoUrl", "image_url", "imageUrl"]);
  if (!displayName) {
    return null;
  }

  return {
    displayName,
    photoUrl: photoUrl || undefined,
  };
}

function parseOccurrence(value: unknown): LiveOccurrence | null {
  const record = asRecord(value);
  const offer = asRecord(record?.offer);
  if (!record || !offer) {
    return null;
  }

  const id = Number.parseInt(String(record.id ?? ""), 10);
  const startDateTime = pickString(record, ["start_datetime", "start", "start_at"]);
  const endDateTime = pickString(record, ["end_datetime", "end", "end_at"]);
  const offerSlug = pickString(offer, ["slug"]);
  const offerTitle = pickString(offer, ["title", "name"]);
  if (!Number.isFinite(id) || !startDateTime || !endDateTime || !offerSlug || !offerTitle) {
    return null;
  }

  const facilitator = profileFromUnknown(record.facilitator);
  return {
    id,
    startDateTime,
    endDateTime,
    timezone: pickString(record, ["timezone", "tz", "time_zone"]),
    offerType: pickString(offer, ["type"], "CLASS").toUpperCase(),
    bookingUrl: pickString(record, ["booking_url", "bookingUrl"]) || undefined,
    facilitatorName: facilitator?.displayName || "",
    facilitatorPhotoUrl: facilitator?.photoUrl,
    offerSlug,
    offerTitle,
    offerExcerpt: pickString(offer, ["excerpt", "summary", "description"]) || undefined,
    offerCanonicalUrl: pickString(offer, ["canonical_url", "canonicalUrl"]) || undefined,
  };
}

function buildOfferMetadataMap(classOffers: unknown[]) {
  const metadata = new Map<string, OfferMetadata>();

  for (const offer of classOffers) {
    const record = asRecord(offer);
    const slug = pickString(record, ["slug"]);
    if (!slug) {
      continue;
    }

    metadata.set(slug, {
      title: pickString(record, ["title", "name"]),
      slug,
      excerpt: pickString(record, ["excerpt", "summary", "description"]) || undefined,
      canonicalUrl: pickString(record, ["canonical_url", "canonicalUrl"]) || undefined,
    });
  }

  return metadata;
}

function buildStaticScheduleMetadata(days: ScheduleDay[]) {
  const metadata = new Map<string, Partial<ScheduleEntry>>();

  for (const day of days) {
    for (const entry of day.entries) {
      const key = normalizeClassKey(entry.className);
      if (!key || metadata.has(key)) {
        continue;
      }
      metadata.set(key, {
        className: entry.className,
        languages: entry.languages,
        level: entry.level,
        description: entry.description,
        bookingUrl: entry.bookingUrl,
        color: entry.color,
      });
    }
  }

  return metadata;
}

function resolveStaticMetadata(
  title: string,
  slug: string,
  metadataByTitle: Map<string, Partial<ScheduleEntry>>,
) {
  const titleKey = normalizeClassKey(title);
  if (metadataByTitle.has(titleKey)) {
    return metadataByTitle.get(titleKey) ?? null;
  }

  const slugKey = normalizeClassKey(slug.replace(/-/g, " "));
  if (metadataByTitle.has(slugKey)) {
    return metadataByTitle.get(slugKey) ?? null;
  }

  const titleFirstWord = firstWord(title);
  for (const [candidate, value] of metadataByTitle.entries()) {
    if (!titleFirstWord) {
      continue;
    }
    if (candidate.startsWith(titleFirstWord) || titleFirstWord.startsWith(firstWord(candidate))) {
      return value;
    }
  }

  return null;
}

function buildLiveScheduleDays(
  occurrences: LiveOccurrence[],
  metadataByTitle: Map<string, Partial<ScheduleEntry>>,
  offerMetadataBySlug: Map<string, OfferMetadata>,
  locale: string,
) {
  const uniqueSlots = new Map<
    string,
    {
      weekday: string;
      weekdayOrder: number;
      timeSort: string;
      entry: ScheduleEntry;
    }
  >();

  const sortedOccurrences = [...occurrences].sort((left, right) =>
    left.startDateTime.localeCompare(right.startDateTime),
  );

  for (const occurrence of sortedOccurrences) {
    const fallbackMetadata =
      resolveStaticMetadata(occurrence.offerTitle, occurrence.offerSlug, metadataByTitle) ?? {};
    const offerMetadata = offerMetadataBySlug.get(occurrence.offerSlug);
    const weekday = weekdayLabel(occurrence.startDateTime, locale, occurrence.timezone);
    const order = weekdayOrder(occurrence.startDateTime, occurrence.timezone);
    if (!weekday || order === 999) {
      continue;
    }

    const startTime = formatTimeLabel(occurrence.startDateTime, locale, occurrence.timezone);
    const endTime = formatTimeLabel(occurrence.endDateTime, locale, occurrence.timezone);
    if (!startTime) {
      continue;
    }

    const entry: ScheduleEntry = {
      time: endTime ? `${startTime} – ${endTime}` : startTime,
      className: offerMetadata?.title || occurrence.offerTitle,
      instructor: occurrence.facilitatorName || "",
      languages: fallbackMetadata.languages ?? [],
      level: fallbackMetadata.level,
      description:
        fallbackMetadata.description
        || offerMetadata?.excerpt
        || occurrence.offerExcerpt
        || undefined,
      bookingUrl: occurrence.bookingUrl,
      color: fallbackMetadata.color,
      instructorImage: occurrence.facilitatorPhotoUrl,
    };

    const slotKey = [
      order,
      startTime,
      endTime,
      normalizeClassKey(entry.className),
    ].join("|");
    if (uniqueSlots.has(slotKey)) {
      continue;
    }

    uniqueSlots.set(slotKey, {
      weekday,
      weekdayOrder: order,
      timeSort: startTime,
      entry,
    });
  }

  const grouped = new Map<string, { weekdayOrder: number; entries: Array<{ timeSort: string; entry: ScheduleEntry }> }>();
  for (const slot of uniqueSlots.values()) {
    const existing = grouped.get(slot.weekday);
    if (existing) {
      existing.entries.push({ timeSort: slot.timeSort, entry: slot.entry });
      continue;
    }
    grouped.set(slot.weekday, {
      weekdayOrder: slot.weekdayOrder,
      entries: [{ timeSort: slot.timeSort, entry: slot.entry }],
    });
  }

  return [...grouped.entries()]
    .sort((left, right) => left[1].weekdayOrder - right[1].weekdayOrder)
    .map(([day, value]) => ({
      day,
      entries: [...value.entries]
        .sort((left, right) => left.timeSort.localeCompare(right.timeSort))
        .map((item) => item.entry),
    }));
}

export default async function ForestWeeklyScheduleSection({
  locale,
  eyebrow,
  heading,
  subtitle,
  className = "",
}: ForestWeeklyScheduleSectionProps) {
  const isFr = locale.toLowerCase().startsWith("fr");
  const content = getPricingContent(locale);
  const resolvedHeading = heading ?? content.schedule.heading;
  const resolvedSubtitle = subtitle ?? content.schedule.subtitle ?? null;
  let scheduleDays: ScheduleDay[] = [];
  let liveScheduleState: LiveScheduleState = "unavailable";

  try {
    const hostname = await getHostname();
    const today = new Date();
    const horizon = new Date(today);
    horizon.setDate(today.getDate() + 120);

    const [calendarItems, classOffers] = await Promise.all([
      fetchCalendar({
        hostname,
        center: "forest-lighthouse",
        locale,
        from: today.toISOString().slice(0, 10),
        to: horizon.toISOString().slice(0, 10),
      }),
      fetchOffers({
        hostname,
        center: "forest-lighthouse",
        type: "CLASS",
        locale,
      }),
    ]);

    const classOccurrences = calendarItems
      .map((item) => parseOccurrence(item))
      .filter((item): item is LiveOccurrence => item !== null)
      .filter((item) => item.offerType === "CLASS");

    if (classOccurrences.length > 0) {
      scheduleDays = buildLiveScheduleDays(
        classOccurrences,
        buildStaticScheduleMetadata(content.schedule.days),
        buildOfferMetadataMap(classOffers),
        locale,
      );
      liveScheduleState = scheduleDays.length > 0 ? "ready" : "empty";
    } else {
      liveScheduleState = "empty";
    }
  } catch {
    liveScheduleState = "unavailable";
  }

  const labels = {
    allClassesLabel: isFr ? "Tous" : "All",
    classDetailsLabel: isFr ? "Plus de détails" : "More details",
    classBookLabel: isFr ? "Réserver le cours" : "Book class",
    classTeacherPrefix: isFr ? "avec" : "w/",
    scheduleScrollHint: isFr
      ? "<- Glissez pour voir tous les jours ->"
      : "<- Scroll to see all days ->",
    scheduleEmptyLabel: isFr
      ? "Aucun cours n'est programmé pour le moment."
      : "No classes are currently scheduled.",
    scheduleUnavailableLabel: isFr
      ? "Impossible de charger l'horaire en direct pour le moment."
      : "Unable to load the live class schedule right now.",
  };

  return (
    <section
      aria-label={resolvedHeading || undefined}
      className={`fp-schedule-section ${className}`.trim()}
    >
      {eyebrow ? <p className="fp-chapter__eyebrow">{eyebrow}</p> : null}
      {resolvedHeading ? (
        <h2 className="fp-section__heading fp-section__heading--left">
          {resolvedHeading}
        </h2>
      ) : null}
      {resolvedSubtitle ? (
        <p className="fp-section__subtitle fp-section__subtitle--left">
          {resolvedSubtitle}
        </p>
      ) : null}

      {liveScheduleState === "ready" ? (
        <ForestScheduleList
          days={scheduleDays}
          labels={labels}
        />
      ) : (
        <p className="fp-section__subtitle fp-section__subtitle--left">
          {liveScheduleState === "empty"
            ? labels.scheduleEmptyLabel
            : labels.scheduleUnavailableLabel}
        </p>
      )}
    </section>
  );
}
