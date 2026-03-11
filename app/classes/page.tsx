import ClassesSchedule from "@/components/calendar/ClassesSchedule";
import { ForestPageHero, ForestPageSection, ForestPageShell } from "@/components/forest/ForestPageShell";
import {
  type CalendarDomainLabel,
  type CalendarOccurrenceOption,
  type GroupedCalendarEntry,
} from "@/components/calendar/GroupedCalendar";
import { fetchCalendar, fetchSiteConfig, type CalendarItem } from "@/lib/api";
import { FOREST_PAGE_MEDIA, isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { localizePath } from "@/lib/locale-path";

type RawRecord = Record<string, unknown>;

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

function toPositiveInt(value: unknown) {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return null;
}

function toIsoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function parseOccurrence(value: unknown): CalendarOccurrenceOption | null {
  const record = asRecord(value);
  const id = toPositiveInt(record?.id);
  const startDateTime = pickString(record, ["start_datetime", "start", "start_at"]);
  const endDateTime = pickString(record, ["end_datetime", "end", "end_at"]);
  if (!id || !startDateTime || !endDateTime) {
    return null;
  }

  return {
    id,
    startDateTime,
    endDateTime,
    timezone: pickString(record, ["timezone", "tz", "time_zone"]),
    label: pickString(record, ["label", "title"]),
    bookingUrl: pickString(record, ["booking_url", "bookingUrl"]) || undefined,
    icsUrl: pickString(record, ["ics_url", "icsUrl"]) || undefined,
  };
}

function parseDomains(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as CalendarDomainLabel[];
  }

  const domains: CalendarDomainLabel[] = [];
  for (const item of value) {
    const record = asRecord(item);
    const slug = pickString(record, ["slug"]);
    const name = pickString(record, ["name", "label"]);
    if (!slug || !name) {
      continue;
    }
    domains.push({ slug, name });
  }

  return domains;
}

function parseGroupedEntries(items: CalendarItem[]) {
  const entries: GroupedCalendarEntry[] = [];

  for (const item of items) {
    const record = asRecord(item);
    const offer = asRecord(record?.offer);
    const offerId = toPositiveInt(offer?.id);
    const title = pickString(offer, ["title", "name"]);
    const slug = pickString(offer, ["slug"]);
    if (!offerId || !title || !slug) {
      continue;
    }

    const nextRaw =
      (Array.isArray(record?.next_occurrences) ? record?.next_occurrences : null) ??
      (Array.isArray(record?.nextOccurrences) ? record?.nextOccurrences : []);
    const nextOccurrences = nextRaw
      .map((occurrence) => parseOccurrence(occurrence))
      .filter((occurrence): occurrence is CalendarOccurrenceOption => occurrence !== null);

    entries.push({
      offer: {
        id: offerId,
        type: pickString(offer, ["type"], "WORKSHOP"),
        title,
        slug,
        heroImageUrl: pickString(offer, ["hero_image_url", "heroImageUrl"]) || undefined,
        canonicalUrl: pickString(offer, ["canonical_url", "canonicalUrl"]) || undefined,
        category: pickString(offer, ["category"]) || undefined,
        domains: parseDomains(offer?.domains),
      },
      ctaLabel: pickString(record, ["cta_label", "ctaLabel"], "Join Now"),
      nextOccurrences,
    });
  }

  return entries;
}

export default async function ClassesPage() {
  const hostname = await getHostname();
  const today = new Date();
  const fourteenDaysLater = new Date(today);
  fourteenDaysLater.setDate(today.getDate() + 14);
  const from = toIsoDate(today);
  const to = toIsoDate(fourteenDaysLater);

  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Classes</h1>
        <p>Unable to load schedule right now.</p>
      </section>
    );
  }

  const payload = await fetchCalendar({
    hostname,
    center: siteConfig.centerSlug,
    locale: siteConfig.defaultLocale,
    from,
    to,
    groupBy: "offer",
  }).catch(() => null);
  if (!payload) {
    return (
      <section className="page-section">
        <h1>Classes</h1>
        <p>Unable to load schedule right now.</p>
      </section>
    );
  }

  const entries = parseGroupedEntries(payload);
  const isForest = isForestCenter(siteConfig.centerSlug);

  if (isForest) {
    const isFrench = siteConfig.defaultLocale.toLowerCase().startsWith("fr");

    return (
      <ForestPageShell>
        <ForestPageHero
          actions={[
            { href: localizePath(siteConfig.defaultLocale, "/pricing"), label: isFrench ? "Voir les tarifs" : "See pricing" },
            { href: localizePath(siteConfig.defaultLocale, "/calendar"), label: isFrench ? "Calendrier complet" : "Full calendar", variant: "secondary" },
          ]}
          eyebrow={isFrench ? "Pratique hebdomadaire" : "Weekly practice"}
          mediaUrl={FOREST_PAGE_MEDIA.classes}
          subtitle={
            isFrench
              ? "Les cours réguliers apparaissent ici dans le même langage visuel que la page Tarifs."
              : "Regular classes now live inside the same visual language as the Pricing page."
          }
          title={isFrench ? "Cours" : "Classes"}
        />

        <ForestPageSection
          eyebrow={`${from} - ${to}`}
          subtitle={isFrench ? "Cette vue garde la logique de planning actuelle, mais avec une présentation Forest unifiée." : "This keeps the current schedule logic, but presents it inside the unified Forest theme."}
          title={isFrench ? "Planning des deux prochaines semaines" : "Schedule for the next two weeks"}
        >
          <ClassesSchedule
            center={siteConfig.centerSlug}
            entries={entries}
            from={from}
            hostname={hostname}
            locale={siteConfig.defaultLocale}
            to={to}
          />
        </ForestPageSection>
      </ForestPageShell>
    );
  }

  return (
    <section className="page-section">
      <h1>Weekly classes</h1>
      <p>
        {from} to {to}
      </p>
      <ClassesSchedule
        center={siteConfig.centerSlug}
        entries={entries}
        from={from}
        hostname={hostname}
        locale={siteConfig.defaultLocale}
        to={to}
      />
    </section>
  );
}
