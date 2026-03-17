"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSiteContext } from "@/lib/site-context";

function isOfferDetailPath(pathname: string | null) {
  if (!pathname) return false;

  const segments = pathname.split("/").filter(Boolean);
  const normalizedSegments =
    segments[0] && /^[a-z]{2}$/i.test(segments[0]) ? segments.slice(1) : segments;

  return (
    normalizedSegments.length === 2 &&
    ["workshops", "trainings", "classes", "private-sessions"].includes(normalizedSegments[0] || "")
  );
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export default function MobileFixedFooter({ locale }: { locale: string }) {
  const { centerSlug, mobileBookingCta } = useSiteContext();
  const pathname = usePathname();
  if (centerSlug !== "forest-lighthouse") return null;

  const isEn = !locale.startsWith("fr");
  const isOfferPage = isOfferDetailPath(pathname);
  const defaultBookingUrl =
    "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=41&sTG=23&prodId=100023";
  const bookingUrl = mobileBookingCta?.href || defaultBookingUrl;
  const bookingLabel = mobileBookingCta?.label || (isEn ? "Book Now" : "Réserver");

  if (isOfferPage) {
    if (!mobileBookingCta?.href) {
      return null;
    }

    const external = isExternalHref(mobileBookingCta.href);

    return (
      <div className="fl-mobile-footer fl-mobile-footer--offer">
        <a
          className="fl-mobile-footer__link fl-mobile-footer__link--cta fl-mobile-footer__link--offer"
          href={mobileBookingCta.href}
          rel={external ? "noopener noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        >
          {bookingLabel}
        </a>
      </div>
    );
  }

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
