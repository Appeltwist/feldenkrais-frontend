import GroupedCalendar, {
  type CalendarDomainLabel,
  type CalendarOccurrenceOption,
  type GroupedCalendarEntry,
} from "@/components/calendar/GroupedCalendar";
import { ForestPageHero, ForestPageSection, ForestPageShell } from "@/components/forest/ForestPageShell";
import {
  fetchCalendarWithMeta,
  fetchSiteConfig,
  type CalendarDomainOption,
  type CalendarItem,
} from "@/lib/api";
import { FOREST_PAGE_MEDIA, isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { localizePath } from "@/lib/locale-path";

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

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const hostname = await getHostname();
  const today = new Date();
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(today.getDate() + 30);
  const from = toIsoDate(today);
  const to = toIsoDate(thirtyDaysLater);
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

  const calendar = await fetchCalendarWithMeta({
    hostname,
    center: siteConfig.centerSlug,
    locale: siteConfig.defaultLocale,
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
    const isFrench = siteConfig.defaultLocale.toLowerCase().startsWith("fr");

    return (
      <ForestPageShell>
        <ForestPageHero
          actions={[
            { href: localizePath(siteConfig.defaultLocale, "/workshops"), label: isFrench ? "Voir les ateliers" : "See workshops" },
            { href: localizePath(siteConfig.defaultLocale, "/classes"), label: isFrench ? "Voir les cours" : "See classes", variant: "secondary" },
          ]}
          eyebrow={isFrench ? "À venir" : "Upcoming"}
          mediaUrl={FOREST_PAGE_MEDIA.calendar}
          subtitle={
            isFrench
              ? "Une vue d’ensemble des cours, ateliers et parcours actuellement publiés."
              : "An overview of the classes, workshops, and pathways currently published."
          }
          title={isFrench ? "Calendrier" : "Calendar"}
        />

        <ForestPageSection
          eyebrow={siteConfig.center.name}
          subtitle={`${from} - ${to}`}
          title={isFrench ? "Filtrer les événements" : "Filter events"}
        >
          <form className="calendar-filter-form" method="get">
            <label className="calendar-filter-form__label" htmlFor="calendar-domain-theme">
              {isFrench ? "Domaine" : "Domain"}
            </label>
            <div className="calendar-filter-form__controls">
              <select
                className="calendar-filter-form__select"
                defaultValue={selectedDomainTheme}
                id="calendar-domain-theme"
                name="domain_theme"
              >
                <option value="">{isFrench ? "Tous les domaines" : "All domains"}</option>
                {domains.map((domain) => (
                  <option key={domain.slug} value={domain.slug}>
                    {domain.name}
                  </option>
                ))}
              </select>
              <button className="button-link button-link--secondary" type="submit">
                {isFrench ? "Appliquer" : "Apply"}
              </button>
              {selectedDomainTheme ? (
                <a className="text-link" href="?">
                  {isFrench ? "Effacer" : "Clear"}
                </a>
              ) : null}
            </div>
          </form>
        </ForestPageSection>

        <ForestPageSection
          eyebrow={entries.length > 0 ? `${entries.length}` : undefined}
          subtitle={entries.length === 0 ? (isFrench ? "Aucun événement dans cette période." : "No events in this range.") : undefined}
          title={isFrench ? "Ce qui se passe" : "What is on"}
        >
          {entries.length > 0 ? (
            <GroupedCalendar
              center={siteConfig.centerSlug}
              entries={entries}
              from={from}
              hostname={hostname}
              locale={siteConfig.defaultLocale}
              to={to}
            />
          ) : (
            <p className="forest-empty-state">{isFrench ? "Aucun événement trouvé." : "No events found."}</p>
          )}
        </ForestPageSection>
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
