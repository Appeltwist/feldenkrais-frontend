"use client";

import { useState } from "react";

type CalendarEvent = {
  start: string; /* ISO 8601 */
  end: string;
  location?: string;
};

type OfferActionBarProps = {
  title: string;
  canonicalUrl?: string;
  icsUrl?: string;
  calendarEvent?: CalendarEvent;
  variant?: "default" | "cinematic";
};

function normalizeUrl(value: string | undefined) {
  if (!value) {
    return "";
  }
  return value.trim();
}

/* ── ICS generation ── */

function toIcsDate(isoStr: string) {
  /* Convert "2026-03-06T18:00:00+01:00" → "20260306T170000Z" (UTC) */
  const d = new Date(isoStr);
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function downloadIcs(event: CalendarEvent, title: string) {
  const uid = `${Date.now()}@forest-lighthouse`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Forest Lighthouse//Offer//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART:${toIcsDate(event.start)}`,
    `DTEND:${toIcsDate(event.end)}`,
    `SUMMARY:${title}`,
    event.location ? `LOCATION:${event.location}` : "",
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  const blob = new Blob([lines], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── inline SVG icons ── */

function DescriptionIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CalendarPlusIcon() {
  /* Calendar with integrated + sign (Lucide calendar-plus style) */
  return (
    <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18">
      <path d="M21 13V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <line x1="19" x2="19" y1="16" y2="22" />
      <line x1="16" x2="22" y1="19" y2="19" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}

export default function OfferActionBar({
  title,
  canonicalUrl,
  icsUrl,
  calendarEvent,
  variant = "default",
}: OfferActionBarProps) {
  const [shareMessage, setShareMessage] = useState("");

  async function onShare() {
    const raw = normalizeUrl(canonicalUrl);
    if (!raw) {
      setShareMessage("No share URL available.");
      return;
    }
    /* resolve relative path to absolute URL */
    const shareUrl = raw.startsWith("/") ? `${window.location.origin}${raw}` : raw;

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title,
          url: shareUrl,
        });
        setShareMessage("Shared.");
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage("Link copied.");
        return;
      }

      setShareMessage("Sharing is not available on this device.");
    } catch {
      setShareMessage("Unable to share right now.");
    }
  }

  function onAddToCalendar() {
    if (calendarEvent) {
      downloadIcs(calendarEvent, title);
    }
  }

  function scrollToDetails() {
    const el = document.getElementById("offer-details");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  /* calendar action: ICS URL > client-side generation > disabled */
  const hasCalendar = Boolean(icsUrl) || Boolean(calendarEvent);

  /* ── cinematic variant ── */
  if (variant === "cinematic") {
    return (
      <div className="offer-action-bar offer-action-bar--cinematic">
        <button
          className="offer-action-bar__item"
          onClick={scrollToDetails}
          type="button"
        >
          <span className="offer-action-bar__icon">
            <DescriptionIcon />
          </span>
          <span className="offer-action-bar__label">Description</span>
        </button>

        {icsUrl ? (
          <a className="offer-action-bar__item" href={icsUrl}>
            <span className="offer-action-bar__icon">
              <CalendarPlusIcon />
            </span>
            <span className="offer-action-bar__label">Save the date</span>
          </a>
        ) : (
          <button
            className={`offer-action-bar__item${hasCalendar ? "" : " offer-action-bar__item--disabled"}`}
            onClick={hasCalendar ? onAddToCalendar : undefined}
            type="button"
          >
            <span className="offer-action-bar__icon">
              <CalendarPlusIcon />
            </span>
            <span className="offer-action-bar__label">Save the date</span>
          </button>
        )}

        <button
          className="offer-action-bar__item"
          onClick={() => void onShare()}
          type="button"
        >
          <span className="offer-action-bar__icon">
            <ShareIcon />
          </span>
          <span className="offer-action-bar__label">
            {shareMessage || "Share"}
          </span>
        </button>
      </div>
    );
  }

  /* ── default variant ── */
  return (
    <div className="offer-action-bar">
      <button className="text-link offer-action-bar__button" onClick={() => void onShare()} type="button">
        Share
      </button>
      {icsUrl ? (
        <a className="text-link" href={icsUrl}>
          Add to calendar
        </a>
      ) : hasCalendar ? (
        <button className="text-link offer-action-bar__button" onClick={onAddToCalendar} type="button">
          Add to calendar
        </button>
      ) : null}
      {shareMessage ? <span className="offer-action-bar__status">{shareMessage}</span> : null}
    </div>
  );
}
