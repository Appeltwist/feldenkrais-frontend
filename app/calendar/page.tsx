import Link from "next/link";

import { fetchCalendar, fetchSiteConfig, type CalendarItem } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";

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
      return value;
    }
  }

  return fallback;
}

function toIsoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function formatDateTime(dateValue: string, locale: string, timezone?: string) {
  if (!dateValue) {
    return "Date unavailable";
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  const formatter = new Intl.DateTimeFormat(locale || "en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone || "UTC",
  });

  const formatted = formatter.format(parsed);
  return timezone ? `${formatted} (${timezone})` : formatted;
}

function readOfferData(event: CalendarItem) {
  const eventRecord = asRecord(event);
  const offerRecord = asRecord(eventRecord?.offer);

  return {
    title:
      pickString(eventRecord, ["offer_title", "offerTitle", "title"]) ||
      pickString(offerRecord, ["title", "name"], "Untitled offer"),
    slug:
      pickString(eventRecord, ["offer_slug", "offerSlug", "slug"]) ||
      pickString(offerRecord, ["slug"]),
    start: pickString(eventRecord, ["start", "start_at", "datetime", "date"]),
    timezone: pickString(eventRecord, ["timezone", "tz", "time_zone"]),
  };
}

export default async function CalendarPage() {
  const hostname = await getHostname();
  let siteConfig: Awaited<ReturnType<typeof fetchSiteConfig>> | null = null;
  const today = new Date();
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(today.getDate() + 30);
  let entries: CalendarItem[] = [];

  try {
    siteConfig = await fetchSiteConfig(hostname);
    entries = await fetchCalendar({
      hostname,
      center: siteConfig.centerSlug,
      locale: siteConfig.defaultLocale,
      from: toIsoDate(today),
      to: toIsoDate(thirtyDaysLater),
    });
  } catch {
    return (
      <section className="page-section">
        <h1>Calendar</h1>
        <p>Unable to load calendar right now.</p>
      </section>
    );
  }

  return (
    <section className="page-section">
      <h1>Calendar</h1>
      <p>
        {toIsoDate(today)} to {toIsoDate(thirtyDaysLater)}
      </p>
      {entries.length === 0 ? <p>No events in this date range.</p> : null}
      <ul className="stack-list">
        {entries.map((entry, index) => {
          const event = readOfferData(entry);

          return (
            <li className="card" key={`${event.slug || "event"}-${index}`}>
              <p>{formatDateTime(event.start, siteConfig.defaultLocale, event.timezone)}</p>
              <p>{event.title}</p>
              {event.slug ? (
                <Link className="text-link" href={`/offer/${event.slug}`}>
                  View offer
                </Link>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
