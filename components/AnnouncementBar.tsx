"use client";

import { useState } from "react";

import { useSiteContext } from "@/lib/site-context";

export default function AnnouncementBar({ locale }: { locale: string }) {
  const { centerSlug } = useSiteContext();
  const [dismissed, setDismissed] = useState(false);

  if (centerSlug !== "forest-lighthouse" || dismissed) return null;

  const isEn = !locale.startsWith("fr");

  return (
    <div className="fl-announcement-bar" id="fl-announcement-bar">
      <div className="fl-announcement-inner">
        <span className="fl-announcement-text">
          {isEn ? "🌿 First class offered —" : "🌿 Premier cours offert —"}
        </span>
        <a
          className="fl-announcement-link"
          href={isEn ? "/en/trial" : "/fr/essai"}
        >
          {isEn ? "Join Now!" : "Commencer\u00a0!"}
        </a>
        <button
          aria-label="Close"
          className="fl-announcement-close"
          onClick={() => setDismissed(true)}
          type="button"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
