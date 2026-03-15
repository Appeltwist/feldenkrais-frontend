"use client";

import { useSiteContext } from "@/lib/site-context";

export default function MobileFixedFooter({ locale }: { locale: string }) {
  const { centerSlug, mobileBookingCta } = useSiteContext();
  if (centerSlug !== "forest-lighthouse") return null;
  if (!mobileBookingCta) return null;

  const isEn = !locale.startsWith("fr");
  const bookingUrl = mobileBookingCta.href;
  const bookingLabel = mobileBookingCta.label || (isEn ? "Book Now" : "Réserver");

  return (
    <div className="fl-mobile-footer">
      <div className="fl-mobile-footer__inner">
        <a
          className="fl-mobile-footer__book"
          href={bookingUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {bookingLabel}
        </a>
        <a
          className="fl-mobile-footer__call"
          href="tel:+32485726837"
          aria-label={isEn ? "Call" : "Appeler"}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M22 16.9v3a2 2 0 0 1-2.2 2c-9.8-.9-17.7-8.8-18.6-18.6A2 2 0 0 1 3.1 1h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 2.9a2 2 0 0 1-.4 2.1L7 9a16 16 0 0 0 8 8l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.5 2.9.6a2 2 0 0 1 1.7 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
