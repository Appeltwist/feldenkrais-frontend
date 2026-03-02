"use client";

import Link from "next/link";

import { useSiteContext } from "@/lib/site-context";

export default function HomePage() {
  const { siteName, centerSlug, defaultLocale } = useSiteContext();

  return (
    <section className="page-section">
      <h1>{siteName}</h1>
      <p>
        Center: <strong>{centerSlug}</strong> | Locale: <strong>{defaultLocale}</strong>
      </p>
      <div className="link-row">
        <Link className="text-link" href="/workshops">
          View workshops
        </Link>
        <Link className="text-link" href="/calendar">
          View calendar
        </Link>
      </div>
      <div className="theme-swatches">
        <div className="theme-swatch" style={{ background: "var(--color-primary)" }}>
          Primary
        </div>
        <div className="theme-swatch" style={{ background: "var(--color-secondary)" }}>
          Secondary
        </div>
        <div className="theme-swatch" style={{ background: "var(--color-accent)" }}>
          Accent
        </div>
      </div>
    </section>
  );
}
