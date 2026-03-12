"use client";

import { useEffect, useRef, useState } from "react";

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
  /** Hide the "Save the date" / calendar button entirely */
  hideCalendar?: boolean;
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

function CopyIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16">
      <rect height="13" rx="2" ry="2" width="13" x="9" y="9" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function OfferActionBar({
  title,
  canonicalUrl,
  icsUrl,
  calendarEvent,
  variant = "default",
  hideCalendar = false,
}: OfferActionBarProps) {
  const [shareMessage, setShareMessage] = useState("");
  const [showSharePopover, setShowSharePopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const shareButtonRef = useRef<HTMLButtonElement>(null);

  /* close popover on click-outside or ESC */
  useEffect(() => {
    if (!showSharePopover) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        shareButtonRef.current &&
        !shareButtonRef.current.contains(e.target as Node)
      ) {
        setShowSharePopover(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowSharePopover(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showSharePopover]);

  /* ── share helpers ── */

  function getShareUrl() {
    const raw = normalizeUrl(canonicalUrl);
    if (!raw) return "";
    return raw.startsWith("/") ? `${window.location.origin}${raw}` : raw;
  }

  async function onCopyLink() {
    const shareUrl = getShareUrl();
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Copied!");
      setTimeout(() => setShareMessage(""), 2000);
    } catch {
      setShareMessage("Unable to copy.");
    }
    setShowSharePopover(false);
  }

  function onShareEmail() {
    const shareUrl = getShareUrl();
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${title}\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
    setShowSharePopover(false);
  }

  function onShareWhatsApp() {
    const shareUrl = getShareUrl();
    const text = encodeURIComponent(`${title} ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
    setShowSharePopover(false);
  }

  async function onShareFallback() {
    const raw = normalizeUrl(canonicalUrl);
    if (!raw) {
      setShareMessage("No share URL available.");
      return;
    }
    const shareUrl = raw.startsWith("/") ? `${window.location.origin}${raw}` : raw;
    try {
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
    const el = document.getElementById("forest-apercu") || document.getElementById("offer-details");
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

        {hideCalendar ? null : icsUrl ? (
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

        <div className="offer-action-bar__share-wrap">
          <button
            ref={shareButtonRef}
            className="offer-action-bar__item"
            onClick={() => setShowSharePopover((prev) => !prev)}
            type="button"
          >
            <span className="offer-action-bar__icon">
              <ShareIcon />
            </span>
            <span className="offer-action-bar__label">
              {shareMessage || "Share"}
            </span>
          </button>

          {showSharePopover ? (
            <div className="share-popover" ref={popoverRef}>
              <button className="share-popover__item" onClick={() => void onCopyLink()} type="button">
                <CopyIcon />
                <span>Copy link</span>
              </button>
              <button className="share-popover__item" onClick={onShareEmail} type="button">
                <EmailIcon />
                <span>Email</span>
              </button>
              <button className="share-popover__item" onClick={onShareWhatsApp} type="button">
                <WhatsAppIcon />
                <span>WhatsApp</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  /* ── default variant ── */
  return (
    <div className="offer-action-bar">
      <button className="text-link offer-action-bar__button" onClick={() => void onShareFallback()} type="button">
        Share
      </button>
      {hideCalendar ? null : icsUrl ? (
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
