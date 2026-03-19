import GroupedCalendar, {
  type CalendarDomainLabel,
  type CalendarOccurrenceOption,
  type GroupedCalendarEntry,
} from "@/components/calendar/GroupedCalendar";
import ForestCalendarList, {
  type CalendarListEntry,
} from "@/components/calendar/ForestCalendarList";
import { ForestPageShell } from "@/components/forest/ForestPageShell";
import {
  fetchCalendar,
  fetchCalendarWithMeta,
  fetchOffers,
  fetchSiteConfig,
  type CalendarDomainOption,
  type CalendarItem,
} from "@/lib/api";
import { isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { localizePath } from "@/lib/locale-path";
import { getForestImageOverride } from "@/lib/forest-excerpts";
import { getCanonicalOfferPathByTypeAndSlug } from "@/lib/offers";

const CALENDAR_TYPE_COLORS: Record<string, string> = {
  WORKSHOP: "rgba(210, 170, 60, 0.50)",
  TRAINING_INFO: "rgba(60, 120, 180, 0.50)",
  CLASS: "rgba(60, 140, 80, 0.45)",
  PRIVATE_SESSION: "rgba(120, 80, 160, 0.45)",
};

function calendarTypeColor(type: string): string {
  return CALENDAR_TYPE_COLORS[type.toUpperCase()] ?? "rgba(0, 55, 56, 0.45)";
}

type RawRecord = Record<string, unknown>;

type CalendarPageProps = {
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
};

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
      ctaLabel: pickString(record, ["cta_label", "ctaLabel"], "Book"),
      nextOccurrences,
    });
  }

  return entries;
}

function pickSingleSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  keys: string[],
) {
  for (const key of keys) {
    const value = searchParams[key];
    const item = Array.isArray(value) ? value[0] : value;
    if (typeof item === "string" && item.trim()) {
      return item.trim();
    }
  }
  return "";
}

function sortDomains(domains: CalendarDomainOption[]) {
  return [...domains].sort((left, right) => {
    const leftOrder = typeof left.sort_order === "number" ? left.sort_order : 9999;
    const rightOrder = typeof right.sort_order === "number" ? right.sort_order : 9999;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
    return left.name.localeCompare(right.name);
  });
}

function nextOccurrenceStart(entry: GroupedCalendarEntry) {
  return entry.nextOccurrences[0]?.startDateTime ?? "";
}

function sortEntriesByNextOccurrence(entries: GroupedCalendarEntry[]) {
  return [...entries].sort((left, right) =>
    nextOccurrenceStart(left).localeCompare(nextOccurrenceStart(right)),
  );
}

type ForestCalendarOfferCopy = {
  excerpt: string;
  facilitatorNames: string;
};

type FlatClassOccurrence = {
  id: number;
  startDateTime: string;
  endDateTime: string;
  timezone: string;
  facilitatorName: string;
  offer: {
    id: number;
    type: string;
    title: string;
    slug: string;
    heroImageUrl?: string;
    canonicalUrl?: string;
    domains: CalendarDomainLabel[];
  };
};

type DatedListEntry = {
  sortKey: number;
  value: CalendarListEntry;
};

function parseFacilitatorNames(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  const names = value
    .map((item) => {
      const record = asRecord(item);
      return pickString(record, ["display_name", "name", "full_name"]);
    })
    .filter(Boolean);

  return Array.from(new Set(names)).join(" · ");
}

function buildOfferCopyMap(offers: unknown[]) {
  const copyBySlug = new Map<string, ForestCalendarOfferCopy>();

  for (const offer of offers) {
    const record = asRecord(offer);
    const slug = pickString(record, ["slug"]);
    if (!slug) {
      continue;
    }

    copyBySlug.set(slug, {
      excerpt: pickString(record, ["excerpt", "summary", "description"]),
      facilitatorNames: parseFacilitatorNames(record?.facilitators),
    });
  }

  return copyBySlug;
}

function parseFacilitatorName(value: unknown) {
  const record = asRecord(value);
  return pickString(record, ["display_name", "displayName", "name", "full_name"]);
}

function parseFlatClassOccurrences(items: CalendarItem[]) {
  const parsed: FlatClassOccurrence[] = [];

  for (const item of items) {
    const record = asRecord(item);
    const offer = asRecord(record?.offer);
    const offerId = toPositiveInt(offer?.id);
    const title = pickString(offer, ["title", "name"]);
    const slug = pickString(offer, ["slug"]);
    const startDateTime = pickString(record, ["start_datetime", "start", "start_at"]);
    const endDateTime = pickString(record, ["end_datetime", "end", "end_at"]);
    const id = toPositiveInt(record?.id);
    if (!offerId || !title || !slug || !startDateTime || !endDateTime || !id) {
      continue;
    }

    parsed.push({
      id,
      startDateTime,
      endDateTime,
      timezone: pickString(record, ["timezone", "tz", "time_zone"]),
      facilitatorName: parseFacilitatorName(record?.facilitator),
      offer: {
        id: offerId,
        type: pickString(offer, ["type"], "CLASS"),
        title,
        slug,
        heroImageUrl: pickString(offer, ["hero_image_url", "heroImageUrl"]) || undefined,
        canonicalUrl: pickString(offer, ["canonical_url", "canonicalUrl"]) || undefined,
        domains: parseDomains(offer?.domains),
      },
    });
  }

  return parsed;
}

function toSortTimestamp(value: string) {
  const parsed = new Date(value);
  const timestamp = parsed.getTime();
  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const hostname = await getHostname();
  const requestLocale = await getRequestLocale();
  const today = new Date();
  const weekLater = new Date(today);
  weekLater.setDate(today.getDate() + 7);
  const from = toIsoDate(today);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedDomainTheme = pickSingleSearchParam(
    resolvedSearchParams,
    ["domain_theme", "domain_slug", "domains", "domain_filter", "theme"],
  );

  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Calendar</h1>
        <p>Unable to load calendar right now.</p>
      </section>
    );
  }

  const horizonDate = new Date(today);
  if (isForestCenter(siteConfig.centerSlug)) {
    horizonDate.setDate(today.getDate() + 365);
  } else {
    horizonDate.setDate(today.getDate() + 30);
  }
  const to = toIsoDate(horizonDate);

  const calendar = await fetchCalendarWithMeta({
    hostname,
    center: siteConfig.centerSlug,
    locale: requestLocale,
    from,
    to,
    groupBy: "offer",
    domainTheme: selectedDomainTheme || undefined,
  }).catch(() => null);
  if (!calendar) {
    return (
      <section className="page-section">
        <h1>Calendar</h1>
        <p>Unable to load calendar right now.</p>
      </section>
    );
  }

  const entries = parseGroupedEntries(calendar.items);
  const domains = sortDomains(calendar.meta.domains);
  const isForest = isForestCenter(siteConfig.centerSlug);



  if (isForest) {
    const isFrench = requestLocale.toLowerCase().startsWith("fr");
    const locale = requestLocale;
    const [classOffers, workshopOffers, trainingOffers, classCalendarItems] = await Promise.all([
      fetchOffers({
        hostname,
        center: siteConfig.centerSlug,
        locale,
        type: "CLASS",
      }).catch(() => []),
      fetchOffers({
        hostname,
        center: siteConfig.centerSlug,
        locale,
        type: "WORKSHOP",
      }).catch(() => []),
      fetchOffers({
        hostname,
        center: siteConfig.centerSlug,
        locale,
        type: "TRAINING_INFO",
      }).catch(() => []),
      fetchCalendar({
        hostname,
        center: siteConfig.centerSlug,
        locale,
        from,
        to: toIsoDate(weekLater),
        domainTheme: selectedDomainTheme || undefined,
      }).catch(() => []),
    ]);
    const offerCopyBySlug = buildOfferCopyMap([
      ...classOffers,
      ...workshopOffers,
      ...trainingOffers,
    ]);

    const classEntries = parseFlatClassOccurrences(classCalendarItems)
      .filter((entry) => entry.offer.type === "CLASS")
      .sort((left, right) => left.startDateTime.localeCompare(right.startDateTime));
    const workshops = sortEntriesByNextOccurrence(
      entries.filter((entry) => entry.offer.type === "WORKSHOP"),
    ).slice(0, 5);
    const trainings = sortEntriesByNextOccurrence(
      entries.filter((entry) => entry.offer.type === "TRAINING_INFO"),
    ).slice(0, 2);
    const datedEntries: DatedListEntry[] = [
      ...classEntries.map((entry) => {
        const dt = new Date(entry.startDateTime);
        const offerPath = localizePath(
          locale,
          getCanonicalOfferPathByTypeAndSlug(entry.offer.type, entry.offer.slug) || `/offer/${entry.offer.slug}`,
        );
        return {
          sortKey: toSortTimestamp(entry.startDateTime),
          value: {
            id: `class-${entry.id}`,
            title: entry.offer.title,
            href: offerPath,
            type: entry.offer.type,
            typeLabel: isFrench ? "Cours" : "Class",
            description: offerCopyBySlug.get(entry.offer.slug)?.excerpt ?? "",
            facilitator: entry.facilitatorName || offerCopyBySlug.get(entry.offer.slug)?.facilitatorNames || "",
            dateLabel: dt.toLocaleDateString(isFrench ? "fr-FR" : "en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
            }),
            timeLabel: dt.toLocaleTimeString(isFrench ? "fr-FR" : "en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            domainsLabel: entry.offer.domains.map((d) => d.name).join(" · "),
            heroImageUrl: getForestImageOverride(entry.offer.title) || entry.offer.heroImageUrl,
            color: calendarTypeColor(entry.offer.type),
          } satisfies CalendarListEntry,
        };
      }),
      ...[...workshops, ...trainings].map((entry) => {
        const nextOcc = entry.nextOccurrences[0];
        const offerPath = localizePath(
          locale,
          getCanonicalOfferPathByTypeAndSlug(entry.offer.type, entry.offer.slug) || `/offer/${entry.offer.slug}`,
        );
        let dateLabel = "";
        let timeLabel = "";
        if (nextOcc) {
          const dt = new Date(nextOcc.startDateTime);
          dateLabel = dt.toLocaleDateString(isFrench ? "fr-FR" : "en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
          timeLabel = dt.toLocaleTimeString(isFrench ? "fr-FR" : "en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        return {
          sortKey: nextOcc?.startDateTime ? toSortTimestamp(nextOcc.startDateTime) : Number.MAX_SAFE_INTEGER,
          value: {
            id: `${entry.offer.type.toLowerCase()}-${entry.offer.id}`,
            title: entry.offer.title,
            href: offerPath,
            type: entry.offer.type,
            typeLabel: ({ WORKSHOP: isFrench ? "Atelier" : "Workshop", TRAINING_INFO: isFrench ? "Formation" : "Training" } as Record<string, string>)[entry.offer.type] ?? entry.offer.type,
            description: offerCopyBySlug.get(entry.offer.slug)?.excerpt ?? "",
            facilitator: offerCopyBySlug.get(entry.offer.slug)?.facilitatorNames ?? "",
            dateLabel,
            timeLabel,
            domainsLabel: entry.offer.domains.map((d) => d.name).join(" · "),
            heroImageUrl: getForestImageOverride(entry.offer.title) || entry.offer.heroImageUrl,
            color: calendarTypeColor(entry.offer.type),
          } satisfies CalendarListEntry,
        };
      }),
    ].sort((left, right) => left.sortKey - right.sortKey);
    const listEntries: CalendarListEntry[] = datedEntries.map((entry) => entry.value);

    return (
      <ForestPageShell>
        <div className="fp-page fp-calendar-page">
          <section className="fc-intro">
            <p className="fc-intro__eyebrow">{isFrench ? "À venir" : "Upcoming"}</p>
            <h1 className="fc-intro__title">{isFrench ? "Calendrier" : "Calendar"}</h1>
            <p className="fc-intro__subtitle">
              {isFrench
                ? "Les cours de la semaine, puis les prochains ateliers et formations."
                : "This week’s classes, followed by the next workshops and training programmes."}
            </p>
          </section>

          <ForestCalendarList
            entries={listEntries}
            labels={{
              all: isFrench ? "Tout" : "All",
              classes: isFrench ? "Cours" : "Classes",
              workshops: isFrench ? "Ateliers" : "Workshops",
              trainings: isFrench ? "Formations" : "Trainings",
            }}
          />
        </div>
      </ForestPageShell>
    );
  }

  return (
    <section className="page-section">
      <h1>Calendar</h1>
      <p>
        {from} to {to}
      </p>
      <form className="calendar-filter-form" method="get">
        <label className="calendar-filter-form__label" htmlFor="calendar-domain-theme">
          Domain
        </label>
        <div className="calendar-filter-form__controls">
          <select
            className="calendar-filter-form__select"
            defaultValue={selectedDomainTheme}
            id="calendar-domain-theme"
            name="domain_theme"
          >
            <option value="">All domains</option>
            {domains.map((domain) => (
              <option key={domain.slug} value={domain.slug}>
                {domain.name}
              </option>
            ))}
          </select>
          <button className="button-link button-link--secondary" type="submit">
            Apply
          </button>
          {selectedDomainTheme ? (
            <a className="text-link" href="?">
              Clear
            </a>
          ) : null}
        </div>
      </form>
      {entries.length === 0 ? <p>No events in this date range.</p> : null}
      <GroupedCalendar
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
