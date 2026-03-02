"use client";

import Link from "next/link";

import { useSiteContext } from "@/lib/site-context";

export default function MobileFixedFooter({ locale }: { locale: string }) {
  const { centerSlug, mobileBookingCta } = useSiteContext();
  if (centerSlug !== "forest-lighthouse") return null;

  const isEn = !locale.startsWith("fr");
  const defaultBookingUrl =
    "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=41&sTG=23&prodId=100023";
  const bookingUrl = mobileBookingCta?.href || defaultBookingUrl;
  const bookingLabel = mobileBookingCta?.label || (isEn ? "Book Now" : "Réserver");

  return (
    <div className="fl-mobile-footer">
      <Link className="fl-mobile-footer__link" href={isEn ? "/en/pricing" : "/fr/prix"}>
        {isEn ? "Pricing" : "Tarifs"}
      </Link>
      <a
        className="fl-mobile-footer__link fl-mobile-footer__link--cta"
        href={bookingUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        {bookingLabel}
      </a>
    </div>
  );
}
