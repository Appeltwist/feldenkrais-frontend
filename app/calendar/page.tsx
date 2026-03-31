import GroupedCalendar, {
  type CalendarDomainLabel,
  type CalendarOccurrenceOption,
  type GroupedCalendarEntry,
} from "@/components/calendar/GroupedCalendar";
import EducationContentPage from "@/components/education/EducationContentPage";
import EducationEventArchivePage from "@/components/education/EducationEventArchivePage";
import ForestCalendarList, { type CalendarListEntry } from "@/components/calendar/ForestCalendarList";
import MindbodyScheduleWidget from "@/components/classes/MindbodyScheduleWidget";
import { ForestPageShell } from "@/components/forest/ForestPageShell";
import {
  fetchCalendarWithMeta,
  fetchOffers,
  fetchSiteConfig,
  type CalendarDomainOption,
  type CalendarItem,
} from "@/lib/api";
import { getEducationEventArchive } from "@/lib/education-events";
import { resolveEducationNarrativePage } from "@/lib/education-page";
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

function formatForestDateLabel(value: string, locale: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString(locale.toLowerCase().startsWith("fr") ? "fr-FR" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatForestTimeLabel(value: string, locale: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleTimeString(locale.toLowerCase().startsWith("fr") ? "fr-FR" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildGroupedOfferEntries(
  entries: GroupedCalendarEntry[],
  offerCopyBySlug: Map<string, ForestCalendarOfferCopy>,
  locale: string,
) {
  const isFrench = locale.toLowerCase().startsWith("fr");

  return entries.map((entry) => {
    const nextOccurrence = entry.nextOccurrences[0];
    const offerPath = localizePath(
      locale,
      getCanonicalOfferPathByTypeAndSlug(entry.offer.type, entry.offer.slug) || `/offer/${entry.offer.slug}`,
    );

    return {
      id: `${entry.offer.type.toLowerCase()}-${entry.offer.id}`,
      title: entry.offer.title,
      href: offerPath,
      type: entry.offer.type,
      typeLabel:
        ({
          WORKSHOP: isFrench ? "Atelier" : "Workshop",
          TRAINING_INFO: isFrench ? "Formation" : "Training",
        } as Record<string, string>)[entry.offer.type] ?? entry.offer.type,
      description: offerCopyBySlug.get(entry.offer.slug)?.excerpt ?? "",
      facilitator: offerCopyBySlug.get(entry.offer.slug)?.facilitatorNames ?? "",
      dateLabel: nextOccurrence ? formatForestDateLabel(nextOccurrence.startDateTime, locale) : "",
      timeLabel: nextOccurrence ? formatForestTimeLabel(nextOccurrence.startDateTime, locale) : "",
      domainsLabel: entry.offer.domains.map((domain) => domain.name).join(" · "),
      heroImageUrl: getForestImageOverride(entry.offer.title) || entry.offer.heroImageUrl,
      color: calendarTypeColor(entry.offer.type),
    } satisfies CalendarListEntry;
  });
}

function buildPrivateSessionEntries(offers: unknown[], locale: string) {
  const isFrench = locale.toLowerCase().startsWith("fr");

  return offers.flatMap((offer, index) => {
    const record = asRecord(offer);
    const slug = pickString(record, ["slug"]);
    const title = pickString(record, ["title", "name"]);

    if (!slug || !title) {
      return [];
    }

    return [
      {
        id: `private-session-${slug || index}`,
        title,
        href: localizePath(locale, `/private-sessions/${slug}/book`),
        type: "PRIVATE_SESSION",
        typeLabel: isFrench ? "Séance individuelle" : "Private session",
        description: pickString(record, ["excerpt", "summary", "short_description", "description"]),
        facilitator: parseFacilitatorNames(record?.facilitators),
        dateLabel: isFrench ? "Sur rendez-vous" : "By appointment",
        timeLabel: "",
        domainsLabel: parseDomains(record?.domains).map((domain) => domain.name).join(" · "),
        heroImageUrl:
          getForestImageOverride(title) ||
          pickString(record, ["hero_image_url", "heroImageUrl", "image_url", "imageUrl"]) ||
          undefined,
        color: calendarTypeColor("PRIVATE_SESSION"),
      } satisfies CalendarListEntry,
    ];
  });
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const hostname = await getHostname();
  const requestLocale = await getRequestLocale();
  const today = new Date();
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
    const [workshopOffers, trainingOffers, privateSessionOffers] = await Promise.all([
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
      fetchOffers({
        hostname,
        center: siteConfig.centerSlug,
        locale,
        type: "PRIVATE_SESSION",
      }).catch(() => []),
    ]);
    const offerCopyBySlug = buildOfferCopyMap([
      ...workshopOffers,
      ...trainingOffers,
      ...privateSessionOffers,
    ]);

    const workshopEntries = buildGroupedOfferEntries(
      sortEntriesByNextOccurrence(entries.filter((entry) => entry.offer.type === "WORKSHOP")),
      offerCopyBySlug,
      locale,
    ).slice(0, 5);
    const trainingEntries = buildGroupedOfferEntries(
      sortEntriesByNextOccurrence(entries.filter((entry) => entry.offer.type === "TRAINING_INFO")),
      offerCopyBySlug,
      locale,
    ).slice(0, 2);
    const privateSessionEntries = buildPrivateSessionEntries(privateSessionOffers, locale);

    return (
      <ForestPageShell>
        <div className="fp-page fp-calendar-page">
          <section className="fc-intro">
            <p className="fc-intro__eyebrow">{isFrench ? "À venir" : "Upcoming"}</p>
            <h1 className="fc-intro__title">{isFrench ? "Calendrier" : "Calendar"}</h1>
            <p className="fc-intro__subtitle">
              {isFrench
                ? "Réservez un cours, puis découvrez les prochains ateliers, formations et séances individuelles."
                : "Book a class, then explore upcoming workshops, trainings, and private sessions."}
            </p>
          </section>

          <div className="fp-calendar-sections">
            <section className="fc-grid-section forest-mindbody-section">
              <div className="fc-grid-header">
                <div>
                  <p className="fc-grid-header__eyebrow">{isFrench ? "Réserver" : "Book"}</p>
                  <h2 className="fc-grid-header__title">{isFrench ? "Cours" : "Classes"}</h2>
                </div>
              </div>
              <MindbodyScheduleWidget
                loadingLabel={isFrench ? "Chargement des cours..." : "Loading classes..."}
                widgetId="db159594878"
              />
            </section>

            {workshopEntries.length > 0 ? (
              <section className="fc-grid-section fp-calendar-section">
                <div className="fc-grid-header">
                  <div>
                    <p className="fc-grid-header__eyebrow">{isFrench ? "Explorer" : "Explore"}</p>
                    <h2 className="fc-grid-header__title">{isFrench ? "Ateliers" : "Workshops"}</h2>
                  </div>
                </div>
                <ForestCalendarList entries={workshopEntries} />
              </section>
            ) : null}

            {trainingEntries.length > 0 ? (
              <section className="fc-grid-section fp-calendar-section">
                <div className="fc-grid-header">
                  <div>
                    <p className="fc-grid-header__eyebrow">{isFrench ? "Explorer" : "Explore"}</p>
                    <h2 className="fc-grid-header__title">{isFrench ? "Formations" : "Trainings"}</h2>
                  </div>
                </div>
                <ForestCalendarList entries={trainingEntries} />
              </section>
            ) : null}

            {privateSessionEntries.length > 0 ? (
              <section className="fc-grid-section fp-calendar-section">
                <div className="fc-grid-header">
                  <div>
                    <p className="fc-grid-header__eyebrow">{isFrench ? "Explorer" : "Explore"}</p>
                    <h2 className="fc-grid-header__title">
                      {isFrench ? "Séances individuelles" : "Private Sessions"}
                    </h2>
                  </div>
                </div>
                <ForestCalendarList entries={privateSessionEntries} />
              </section>
            ) : null}
          </div>
        </div>
      </ForestPageShell>
    );
  }

  const page = await resolveEducationNarrativePage(hostname, "calendar", requestLocale);
  const educationArchiveEvents =
    siteConfig.siteSlug === "feldenkrais-education" && entries.length === 0
      ? getEducationEventArchive(requestLocale)
      : [];

  if (siteConfig.siteSlug === "feldenkrais-education" && educationArchiveEvents.length > 0) {
    return (
      <EducationEventArchivePage
        entries={educationArchiveEvents}
        locale={requestLocale}
        page={
          page ?? {
            routeKey: "calendar",
            locale: requestLocale,
            title: "Calendar",
            subtitle: "",
            hero: {
              title: "Calendar",
              body: "",
              imageUrl: null,
            },
            sections: [],
            primaryCta: null,
          }
        }
      />
    );
  }

  return (
    <EducationContentPage
      eyebrow={requestLocale.toLowerCase().startsWith("fr") ? "À venir" : "Upcoming"}
      page={
        page ?? {
          routeKey: "calendar",
          locale: requestLocale,
          title: "Calendar",
          subtitle: `${from} to ${to}`,
          hero: {
            title: "Calendar",
            body: `${from} to ${to}`,
            imageUrl: null,
          },
          sections: [],
          primaryCta: null,
          seo: undefined,
        }
      }
    >
      <section className="education-listing">
        <p className="education-page__date-range">
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
            <button className="education-button education-button--secondary" type="submit">
              Apply
            </button>
            {selectedDomainTheme ? (
              <a className="education-text-link" href="?">
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
          locale={requestLocale}
          to={to}
        />
      </section>
    </EducationContentPage>
  );
}
