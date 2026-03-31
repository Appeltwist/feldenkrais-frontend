"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { localizePath } from "@/lib/locale-path";
import { useSiteContext } from "@/lib/site-context";

function inferLocale(pathname: string, defaultLocale: string) {
  if (pathname.startsWith("/fr")) {
    return "fr";
  }
  if (pathname.startsWith("/en")) {
    return "en";
  }
  return defaultLocale.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export default function EducationAnnouncement() {
  const pathname = usePathname() || "/";
  const { announcement, defaultLocale, siteSlug } = useSiteContext();
  const locale = inferLocale(pathname, defaultLocale);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      return window.sessionStorage.getItem("fe-education-announcement-dismissed") === "1";
    } catch {
      return false;
    }
  });

  const resolvedAnnouncement = useMemo(() => {
    if (announcement?.enabled && announcement.text) {
      return announcement;
    }

    if (siteSlug !== "feldenkrais-education") {
      return null;
    }

    return {
      enabled: true,
      text: locale === "fr" ? "Nouvelles masterclasses & ressources" : "New masterclasses & resources",
      linkLabel: locale === "fr" ? "Rendez-vous sur la boutique" : "Visit the shop",
      url: localizePath(locale, "/shop"),
    };
  }, [announcement, locale, siteSlug]);

  if (dismissed || !resolvedAnnouncement?.enabled || !resolvedAnnouncement.text) {
    return null;
  }

  return (
    <div className="education-announcement" role="note">
      <div className="education-announcement__inner">
        <div className="education-announcement__content">
          <span aria-hidden="true" className="education-announcement__icon">
            <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
              <path
                d="M4 6.5h10a2.5 2.5 0 0 1 2.5 2.5v7.5H6.5A2.5 2.5 0 0 1 4 14V6.5Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
              <path
                d="M7.5 3.5h10A2.5 2.5 0 0 1 20 6v10.5H10A2.5 2.5 0 0 1 7.5 14V3.5Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
              <path
                d="m10.5 12 2-2 1.5 1.5 2.5-3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </span>
          <p>{resolvedAnnouncement.text}</p>
          {resolvedAnnouncement.url && resolvedAnnouncement.linkLabel ? (
            <Link className="education-announcement__link" href={resolvedAnnouncement.url}>
              {resolvedAnnouncement.linkLabel}
            </Link>
          ) : null}
        </div>
        <button
          aria-label={locale === "fr" ? "Fermer l’annonce" : "Dismiss announcement"}
          className="education-announcement__dismiss"
          onClick={() => {
            setDismissed(true);
            try {
              window.sessionStorage.setItem("fe-education-announcement-dismissed", "1");
            } catch {
              // Ignore storage failures.
            }
          }}
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  );
}
