"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { localizePath } from "@/lib/locale-path";
import { getCanonicalOfferPathByTypeAndSlug } from "@/lib/offers";

type RawRecord = Record<string, unknown>;

export type CalendarDomainLabel = {
  slug: string;
  name: string;
};

export type CalendarOccurrenceOption = {
  id: number;
  startDateTime: string;
  endDateTime: string;
  timezone: string;
  label: string;
  bookingUrl?: string;
  icsUrl?: string;
};

export type GroupedCalendarOffer = {
  id: number;
  type: string;
  title: string;
  slug: string;
  heroImageUrl?: string;
  canonicalUrl?: string;
  category?: string;
  domains: CalendarDomainLabel[];
};

export type GroupedCalendarEntry = {
  offer: GroupedCalendarOffer;
  ctaLabel: string;
  nextOccurrences: CalendarOccurrenceOption[];
};

type GroupedCalendarProps = {
  entries: GroupedCalendarEntry[];
  hostname: string;
  center?: string;
  locale: string;
  from: string;
  to: string;
};

const OFFERS_PER_PAGE = 12;

function asRecord(value: unknown): RawRecord | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as RawRecord;
  }
  return null;
}

function pickString(source: RawRecord | null, keys: string[]) {
  if (!source) {
    return "";
  }
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
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

function parseFlatOccurrences(payload: unknown) {
  if (!Array.isArray(payload)) {
    return [];
  }

  const parsed: CalendarOccurrenceOption[] = [];
  for (const item of payload) {
    const record = asRecord(item);
    const id = toPositiveInt(record?.id);
    const startDateTime = pickString(record, ["start_datetime", "start", "start_at"]);
    const endDateTime = pickString(record, ["end_datetime", "end", "end_at"]);
    if (!id || !startDateTime || !endDateTime) {
      continue;
    }

    parsed.push({
      id,
      startDateTime,
      endDateTime,
      timezone: pickString(record, ["timezone", "tz", "time_zone"]),
      label: pickString(record, ["label", "title"]),
      bookingUrl: pickString(record, ["booking_url", "bookingUrl"]) || undefined,
      icsUrl: pickString(record, ["ics_url", "icsUrl"]) || undefined,
    });
  }

  return parsed;
}

function formatDateTime(value: string, locale: string, timezone?: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  const formatter = new Intl.DateTimeFormat(locale || "en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone || undefined,
  });
  const formatted = formatter.format(parsed);
  return timezone ? `${formatted} (${timezone})` : formatted;
}

export default function GroupedCalendar({
  entries,
  hostname,
  center,
  locale,
  from,
  to,
}: GroupedCalendarProps) {
  const isFrench = locale.toLowerCase().startsWith("fr");
  const [visibleCount, setVisibleCount] = useState(OFFERS_PER_PAGE);
  const [expandedOfferId, setExpandedOfferId] = useState<number | null>(null);
  const [loadingOfferId, setLoadingOfferId] = useState<number | null>(null);
  const [occurrencesByOffer, setOccurrencesByOffer] = useState<Record<number, CalendarOccurrenceOption[]>>({});
  const [selectedByOffer, setSelectedByOffer] = useState<Record<number, number>>({});
  const [errorsByOffer, setErrorsByOffer] = useState<Record<number, string>>({});

  useEffect(() => {
    setVisibleCount(OFFERS_PER_PAGE);
    setExpandedOfferId(null);
  }, [entries]);

  async function loadOfferOccurrences(offerId: number) {
    if (occurrencesByOffer[offerId]) {
      return;
    }

    setLoadingOfferId(offerId);
    try {
      const params = new URLSearchParams({
        hostname,
        from,
        to,
        offering_id: String(offerId),
      });
      if (locale) {
        params.set("locale", locale);
      }
      if (center) {
        params.set("center", center);
      }
      const response = await fetch(`/api/calendar/occurrences?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(isFrench ? "Impossible de charger les dates." : "Failed to fetch sessions.");
      }
      const payload = (await response.json()) as unknown;
      const occurrences = parseFlatOccurrences(payload);
      setOccurrencesByOffer((previous) => ({ ...previous, [offerId]: occurrences }));
      if (occurrences.length > 0) {
        setSelectedByOffer((previous) => ({
          ...previous,
          [offerId]: previous[offerId] ?? occurrences[0].id,
        }));
      }
      setErrorsByOffer((previous) => ({ ...previous, [offerId]: "" }));
    } catch {
      setErrorsByOffer((previous) => ({
        ...previous,
        [offerId]: isFrench ? "Impossible de charger les dates pour le moment." : "Unable to load sessions right now.",
      }));
    } finally {
      setLoadingOfferId(null);
    }
  }

  async function toggleOffer(offerId: number) {
    if (expandedOfferId === offerId) {
      setExpandedOfferId(null);
      return;
    }
    setExpandedOfferId(offerId);
    await loadOfferOccurrences(offerId);
  }

  function selectOccurrence(offerId: number, occurrenceId: number) {
    setSelectedByOffer((previous) => ({ ...previous, [offerId]: occurrenceId }));
  }

  const visibleEntries = entries.slice(0, visibleCount);
  const hasMoreEntries = visibleCount < entries.length;

  return (
    <>
      <ul className="calendar-group-grid">
        {visibleEntries.map((entry) => {
          const isExpanded = expandedOfferId === entry.offer.id;
          const loadedOccurrences = occurrencesByOffer[entry.offer.id] ?? [];
          const sessionList = loadedOccurrences.length > 0 ? loadedOccurrences : entry.nextOccurrences;
          const selectedId = selectedByOffer[entry.offer.id];
          const selectedOccurrence = sessionList.find((session) => session.id === selectedId) ?? sessionList[0];
          const bookingUrl = selectedOccurrence?.bookingUrl || entry.offer.canonicalUrl || undefined;
          const offerDetailsPath = localizePath(
            locale,
            getCanonicalOfferPathByTypeAndSlug(entry.offer.type, entry.offer.slug) || `/offer/${entry.offer.slug}`,
          );
          const previewSecondary = entry.nextOccurrences.slice(1, 3);
          const domainsLabel = entry.offer.domains.map((domain) => domain.name).join(" · ");

          return (
            <li className="card calendar-group-card" key={entry.offer.id}>
              {entry.offer.heroImageUrl ? (
                <div
                  className="calendar-group-card__hero"
                  style={{
                    backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.48), rgba(0,0,0,0.18)), url(${entry.offer.heroImageUrl})`,
                  }}
                >
                  <p className="offer-type-label">{entry.offer.type.replaceAll("_", " ")}</p>
                  <h2>{entry.offer.title}</h2>
                </div>
              ) : (
                <>
                  <p className="offer-type-label">{entry.offer.type.replaceAll("_", " ")}</p>
                  <h2>{entry.offer.title}</h2>
                </>
              )}

              {domainsLabel ? <p className="calendar-group-card__domains">{domainsLabel}</p> : null}
              {selectedOccurrence ? (
                <p className="calendar-group-card__primary-time">
                  {formatDateTime(selectedOccurrence.startDateTime, locale, selectedOccurrence.timezone)}
                </p>
              ) : (
                <p className="calendar-group-card__primary-time">
                  {isFrench ? "Aucune date dans cette période." : "No upcoming sessions in this range."}
                </p>
              )}

              {previewSecondary.length > 0 ? (
                <ul className="calendar-group-card__next-list">
                  {previewSecondary.map((occurrence) => (
                    <li key={occurrence.id}>
                      {formatDateTime(occurrence.startDateTime, locale, occurrence.timezone)}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="link-row">
                <button
                  className="button-link button-link--secondary"
                  onClick={() => void toggleOffer(entry.offer.id)}
                  type="button"
                >
                  {isExpanded ? (isFrench ? "Masquer les dates" : "Hide sessions") : isFrench ? "Voir les dates" : "See sessions"}
                </button>
                {bookingUrl ? (
                  <a className="button-link" href={bookingUrl} rel="noreferrer" target="_blank">
                    {entry.ctaLabel}
                  </a>
                ) : (
                  <Link className="text-link" href={offerDetailsPath}>
                    {isFrench ? "Voir l’offre" : "View offer"}
                  </Link>
                )}
              </div>

              {isExpanded ? (
                <div className="calendar-group-card__expanded">
                  {loadingOfferId === entry.offer.id ? (
                    <p>{isFrench ? "Chargement des dates..." : "Loading sessions..."}</p>
                  ) : null}
                  {errorsByOffer[entry.offer.id] ? <p>{errorsByOffer[entry.offer.id]}</p> : null}
                  {loadingOfferId !== entry.offer.id && !errorsByOffer[entry.offer.id] && sessionList.length === 0 ? (
                    <p>
                      {isFrench
                        ? "Aucune date trouvée pour cette offre dans la période choisie."
                        : "No sessions found for this offering in the selected date range."}
                    </p>
                  ) : null}
                  {sessionList.length > 0 ? (
                    <>
                      <ul className="calendar-group-card__session-list">
                        {sessionList.map((session) => {
                          const isSelected = selectedOccurrence?.id === session.id;
                          return (
                            <li key={session.id}>
                              <button
                                className={`calendar-group-card__session-button${isSelected ? " is-selected" : ""}`}
                                onClick={() => selectOccurrence(entry.offer.id, session.id)}
                                type="button"
                              >
                                <span>{session.label || (isFrench ? "Séance" : "Session")}</span>
                                <span>{formatDateTime(session.startDateTime, locale, session.timezone)}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="link-row">
                        {selectedOccurrence?.bookingUrl ? (
                          <a className="button-link" href={selectedOccurrence.bookingUrl} rel="noreferrer" target="_blank">
                            {entry.ctaLabel}
                          </a>
                        ) : (
                          <Link className="text-link" href={offerDetailsPath}>
                            {isFrench ? "Voir l’offre" : "View offer"}
                          </Link>
                        )}
                        {selectedOccurrence?.icsUrl ? (
                          <a className="text-link" href={selectedOccurrence.icsUrl}>
                            {isFrench ? "Ajouter au calendrier" : "Add to calendar"}
                          </a>
                        ) : null}
                        <Link className="text-link" href={offerDetailsPath}>
                          {isFrench ? "Détail de l’offre" : "Offer details"}
                        </Link>
                      </div>
                    </>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {hasMoreEntries ? (
        <div className="calendar-group-grid__footer">
          <button
            className="button-link button-link--secondary"
            onClick={() => setVisibleCount((current) => current + OFFERS_PER_PAGE)}
            type="button"
          >
            {isFrench ? "Afficher plus" : "Load more"}
          </button>
        </div>
      ) : null}
    </>
  );
}
