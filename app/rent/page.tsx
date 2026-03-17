import { headers } from "next/headers";
import Link from "next/link";

import { ForestPageSection, ForestPageShell } from "@/components/forest/ForestPageShell";
import RentInquiryForm from "@/components/rent/RentInquiryForm";
import RentSpaceShowcase from "@/components/rent/RentSpaceShowcase";
import { fetchSiteConfig } from "@/lib/api";
import { getForestRentContent } from "@/lib/forest-rent-content";
import { isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";

const ICON_MAP: Record<string, React.ReactNode> = {
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  body: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2" /><path d="M12 6v6" /><path d="M8 12l-3 8" /><path d="M16 12l3 8" /><path d="M7 10h10" /></svg>
  ),
  coffee: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
  ),
  stretch: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="4" r="2" /><path d="M22 14l-4.35-3.62a1 1 0 0 0-1.41.13L12 16" /><path d="M2 18l6-6 4 4" /><path d="M18 6l-1 8" /></svg>
  ),
  video: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
  ),
  utensils: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
  ),
  "coffee-cup": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>
  ),
};

const TALL_GALLERY_INDICES = new Set([0, 4, 6]);

export default async function RentPage() {
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = (await headers()).get("x-locale") ?? "en";
  const isFrench = locale.toLowerCase().startsWith("fr");

  if (!siteConfig || !isForestCenter(siteConfig.centerSlug)) {
    return (
      <section className="page-section rent-page">
        <header className="rent-page__header">
          <h1>{isFrench ? "Location d'espace" : "Rent the space"}</h1>
          <p>
            {isFrench
              ? "Parlez-nous de votre événement, de vos dates et de vos besoins. Nous vous répondrons avec les disponibilités et une première orientation."
              : "Tell us about your event, your dates, and what you need. We will follow up with availability and a first recommendation."}
          </p>
        </header>

        <RentInquiryForm locale={locale} />
      </section>
    );
  }

  const content = getForestRentContent(locale);
  const inquiryHref = "#rent-inquiry";
  const emailHref = `mailto:${content.inquiry.email}`;

  return (
    <ForestPageShell className="forest-rent-page">
      {/* ── 1. Cinematic Hero ── */}
      <section className="rent-hero">
        <div
          className="rent-hero__backdrop"
          style={{
            backgroundImage: `url(${content.hero.imageUrl})`,
          }}
        />
        <div className="rent-hero__grain" aria-hidden="true" />

        <div className="rent-hero__content">
          <p className="rent-hero__eyebrow">{content.hero.eyebrow}</p>
          <h1 className="rent-hero__title">{content.hero.title}</h1>
          <p className="rent-hero__subtitle">{content.hero.subtitle}</p>
          <div className="rent-hero__actions">
            <Link className="fl-btn" href={inquiryHref}>
              {content.hero.ctaLabel}
            </Link>
          </div>
        </div>

      </section>

      {/* ── 2. Spaces Showcase ── */}
      <ForestPageSection
        className="rent-spaces-section"
        eyebrow={content.spaces.eyebrow}
        subtitle={content.spaces.subtitle}
        title={content.spaces.title}
      >
        <RentSpaceShowcase spaces={content.spaces.cards} />
      </ForestPageSection>

      {/* ── 3. Gallery (masonry) ── */}
      <section className="rent-gallery-section">
        <div className="rent-gallery-section__header">
          <p className="forest-page-section__eyebrow">{content.gallery.eyebrow}</p>
          <h2 className="forest-page-section__title">{content.gallery.title}</h2>
          <p className="forest-page-section__subtitle">{content.gallery.subtitle}</p>
        </div>
        <div className="rent-gallery-grid">
          {content.gallery.images.map((src, idx) => (
            <div
              className={`rent-gallery-grid__item${TALL_GALLERY_INDICES.has(idx) ? " rent-gallery-grid__item--tall" : ""}`}
              key={src}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={`${content.gallery.alt} ${idx + 1}`} loading="lazy" src={src} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Strengths ── */}
      <section className="rent-strengths-section">
        <p className="forest-page-section__eyebrow">{content.strengths.eyebrow}</p>
        <h2 className="forest-page-section__title">{content.strengths.title}</h2>
        <p className="forest-page-section__subtitle">{content.strengths.subtitle}</p>
        <div className="rent-strength-grid">
          {content.strengths.items.map((item, idx) => (
            <article
              className="rent-strength-card"
              key={item.title}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {item.icon && ICON_MAP[item.icon] && (
                <span aria-hidden="true" className="rent-card-icon">
                  {ICON_MAP[item.icon]}
                </span>
              )}
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── 5. Add-ons ── */}
      <section className="rent-addons-section">
        <p className="forest-page-section__eyebrow">{content.addOns.eyebrow}</p>
        <h2 className="forest-page-section__title">{content.addOns.title}</h2>
        <p className="forest-page-section__subtitle">{content.addOns.subtitle}</p>
        <div className="rent-addon-strip">
          {content.addOns.items.map((item) => (
            <article className="rent-addon-card" key={item.title}>
              {item.icon && ICON_MAP[item.icon] && (
                <span aria-hidden="true" className="rent-card-icon">
                  {ICON_MAP[item.icon]}
                </span>
              )}
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── 6. Inquiry ── */}
      <section className="rent-inquiry-section" id="rent-inquiry">
        <p className="forest-page-section__eyebrow">{content.inquiry.eyebrow}</p>
        <h2 className="forest-page-section__title">{content.inquiry.title}</h2>
        <p className="forest-page-section__subtitle">{content.inquiry.subtitle}</p>
        <div className="rent-inquiry__layout">
          <div className="rent-inquiry__form-wrapper">
            <RentInquiryForm locale={locale} />
          </div>
          <div className="rent-inquiry__contact-header">
            <p className="forest-rent-inquiry__email-label">{content.inquiry.emailLabel}</p>
            <a className="forest-rent-inquiry__email" href={emailHref}>
              {content.inquiry.email}
            </a>
          </div>
        </div>
      </section>
    </ForestPageShell>
  );
}
