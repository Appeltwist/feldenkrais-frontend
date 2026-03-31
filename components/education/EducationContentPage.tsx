import Link from "next/link";
import type { ReactNode } from "react";

import BlockRenderer from "@/components/blocks/BlockRenderer";
import type { NarrativePage } from "@/lib/site-config";
import { resolveLocale } from "@/lib/i18n";

type EducationContentPageProps = {
  page: NarrativePage;
  children?: ReactNode;
  className?: string;
  eyebrow?: string;
};

export default function EducationContentPage({
  page,
  children,
  className = "",
  eyebrow,
}: EducationContentPageProps) {
  const locale = resolveLocale(page.locale);
  const intro = page.hero.body || page.subtitle;

  return (
    <section className={`education-page ${className}`.trim()}>
      <header
        className="education-page__hero"
        style={
          page.hero.imageUrl
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.30), rgba(255,255,255,0.88)), url(${page.hero.imageUrl})`,
              }
            : undefined
        }
      >
        <div className="education-page__hero-inner">
          <p className="education-page__eyebrow">{eyebrow || page.routeKey.replaceAll("-", " ")}</p>
          <h1>{page.hero.title || page.title}</h1>
          {intro ? <p className="education-page__subtitle">{intro}</p> : null}
          {page.primaryCta ? (
            <div className="education-page__actions">
              <Link className="education-button" href={page.primaryCta.url}>
                {page.primaryCta.label}
              </Link>
            </div>
          ) : null}
        </div>
      </header>

      <div className="education-page__surface">
        {children}
        {page.sections.length > 0 ? <BlockRenderer blocks={page.sections} locale={locale} /> : null}
      </div>
    </section>
  );
}
