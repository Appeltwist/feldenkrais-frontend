import type { CSSProperties } from "react";

import Image from "next/image";
import Link from "next/link";

import ForestVisitTravelTabs from "@/components/visit/ForestVisitTravelTabs";
import { ForestPageShell } from "@/components/forest/ForestPageShell";
import { fetchSiteConfig } from "@/lib/api";
import {
  getForestVisitContent,
  type ForestVisitFaqItem,
  type ForestVisitIconItem,
  type ForestVisitLink,
} from "@/lib/forest-visit-content";
import { isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { isExternalHref, localizePath } from "@/lib/locale-path";
import type { LocaleCode } from "@/lib/types";

function resolveVisitHref(locale: string, href: string) {
  return isExternalHref(href) ? href : localizePath(locale, href);
}

function VisitActionLink({
  link,
  locale,
}: {
  link: ForestVisitLink;
  locale: string;
}) {
  const href = resolveVisitHref(locale, link.href);
  const className = `fl-btn${link.variant === "secondary" ? " fl-btn--secondary" : ""}`;

  if (isExternalHref(link.href)) {
    const shouldOpenInNewTab = /^https?:/.test(link.href);
    return (
      <a
        className={className}
        href={href}
        rel={shouldOpenInNewTab ? "noreferrer" : undefined}
        target={shouldOpenInNewTab ? "_blank" : undefined}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {link.label}
    </Link>
  );
}

function VisitTextLink({
  link,
  locale,
  className = "",
}: {
  link: ForestVisitLink;
  locale: string;
  className?: string;
}) {
  const href = resolveVisitHref(locale, link.href);
  const classes = `forest-visit-text-link ${className}`.trim();

  if (isExternalHref(link.href)) {
    const shouldOpenInNewTab = /^https?:/.test(link.href);
    return (
      <a
        className={classes}
        href={href}
        rel={shouldOpenInNewTab ? "noreferrer" : undefined}
        target={shouldOpenInNewTab ? "_blank" : undefined}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {link.label}
    </Link>
  );
}

function VisitSectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="fp-chapter__intro fp-visit-section__intro">
      <p className="fp-chapter__eyebrow">{eyebrow}</p>
      <h2 className="fp-section__heading fp-section__heading--left">{title}</h2>
      {intro ? <p className="fp-section__subtitle fp-section__subtitle--left">{intro}</p> : null}
    </div>
  );
}

function Separator() {
  return (
    <div aria-hidden="true" className="fl-separator" role="separator">
      <span className="fl-separator__dot" />
    </div>
  );
}

function VisitIcon({ icon }: { icon: ForestVisitIconItem["icon"] }) {
  switch (icon) {
    case "tea":
      return (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="M4 8h10v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z" />
          <path d="M14 10h2a2 2 0 1 1 0 4h-2" />
          <path d="M7 5h4" />
        </svg>
      );
    case "kitchen":
      return (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="M5 8h14v8H5z" />
          <path d="M8 8V5" />
          <path d="M16 8V5" />
          <path d="M9 12h6" />
        </svg>
      );
    case "changing":
      return (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="M12 6a2 2 0 1 0-2-2" />
          <path d="M6 9l4-3 4 3" />
          <path d="M6 9v9h12V9" />
        </svg>
      );
    case "studio":
      return (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <rect height="10" rx="2" width="16" x="4" y="7" />
          <path d="M8 7V5" />
          <path d="M16 7V5" />
        </svg>
      );
    case "stairs":
      return (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="M5 18h4v-4h4v-4h6" />
          <path d="M15 6h4v4" />
        </svg>
      );
    case "ground":
      return (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="M4 19h16" />
          <path d="M7 19V6h10v13" />
          <path d="M11 19v-5h2v5" />
        </svg>
      );
    case "toilet":
      return (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="M8 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M16 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M8 8v8" />
          <path d="M16 8v8" />
          <path d="M5 12h6" />
          <path d="M13 12h6" />
        </svg>
      );
    case "seat":
    default:
      return (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="M7 10a3 3 0 1 1 6 0v3H7z" />
          <path d="M6 13h8a3 3 0 0 1 3 3v2H3v-2a3 3 0 0 1 3-3Z" />
          <path d="M5 18v2" />
          <path d="M15 18v2" />
        </svg>
      );
  }
}

function VisitIconCard({ item }: { item: ForestVisitIconItem }) {
  return (
    <article className="fp-platform__card fp-visit-icon-card">
      <span className="fp-platform__icon forest-visit-icon-card__icon">
        <VisitIcon icon={item.icon} />
      </span>
      <h3 className="fp-platform__card-title">{item.title}</h3>
      <p className="fp-platform__card-desc">{item.body}</p>
    </article>
  );
}

function VisitFaq({ items }: { items: ForestVisitFaqItem[] }) {
  return (
    <div className="fp-faq forest-visit-faq">
      <div className="fp-faq__category">
        <div className="faq-list">
          {items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisitMediaFigure({
  image,
  className,
  sizes,
  priority = false,
}: {
  image: { src: string; alt: string; caption?: string };
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <figure className={className}>
      <Image alt={image.alt} className={`${className}__image`} fill priority={priority} sizes={sizes} src={image.src} />
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  );
}

export default async function VisitPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const localeCode: LocaleCode = locale.toLowerCase().startsWith("fr") ? "fr" : "en";

  if (!siteConfig || !isForestCenter(siteConfig.centerSlug)) {
    return (
      <section className="page-section">
        <h1>Visit</h1>
        <p>Visit information is being prepared and will be available soon.</p>
      </section>
    );
  }

  const content = getForestVisitContent(localeCode);

  return (
    <ForestPageShell className="forest-site-shell--visit">
      <section aria-labelledby="visit-hero-title" className="fp-hero-fade fp-visit-hero">
        <div
          className="fp-hero-fade__img fp-visit-hero__media"
          style={
            {
              "--fp-banner-image": `url('${content.hero.image.src}')`,
            } as CSSProperties
          }
        >
          <div aria-hidden="true" className="fp-visit-hero__overlay" />
          <div className="fp-hero-fade__content fp-visit-hero__content">
            <div className="fp-visit-hero__layout">
              <div className="fp-visit-hero__main">
                <p className="fp-hero-fade__eyebrow">{content.hero.eyebrow}</p>
                <h1 className="fp-hero__title" id="visit-hero-title">
                  {content.hero.title}
                </h1>
                <p className="fp-hero__subtitle fp-visit-hero__intro">{content.hero.intro}</p>
              </div>

              <a
                className="fp-visit-hero__location"
                href={content.hero.mapsLink.href}
                rel="noreferrer"
                target="_blank"
              >
                <svg aria-hidden="true" className="fp-visit-hero__location-icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <span className="fp-visit-hero__location-text">
                  {content.hero.addressLines.join(", ")}
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="fp-page fp-visit-page">
        <section className="fp-section fp-visit-section">
          <VisitSectionHeader
            eyebrow={content.travelTabs.eyebrow}
            intro={content.travelTabs.intro}
            title={content.travelTabs.title}
          />
          <ForestVisitTravelTabs locale={locale} tabs={content.travelTabs.tabs} />
        </section>

        <Separator />

        <section className="fp-section fp-visit-section fp-visit-section--entrance">
          <VisitSectionHeader
            eyebrow={content.entrance.eyebrow}
            intro={content.entrance.intro}
            title={content.entrance.title}
          />
          <div className="fp-visit-arrival">
            <div className="fp-support__section-head fp-visit-arrival__intro">
              <p className="fp-support__subtitle">{content.entrance.arrivalNote}</p>
            </div>
            <div className="fp-visit-arrival__gallery">
              {content.entrance.images.map((image, index) => (
                <figure
                  className={`fp-visit-arrival__figure${index === 0 ? " fp-visit-arrival__figure--wide" : ""}`}
                  key={image.src}
                >
                  <Image
                    alt={image.alt}
                    className="fp-visit-arrival__image"
                    fill
                    sizes={index === 0 ? "(max-width: 900px) 100vw, 62vw" : "(max-width: 900px) 100vw, 30vw"}
                    src={image.src}
                  />
                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        <section className="fp-section fp-visit-section">
          <VisitSectionHeader
            eyebrow={content.whatYouWillFind.eyebrow}
            intro={content.whatYouWillFind.intro}
            title={content.whatYouWillFind.title}
          />
          <div className="fp-platform__grid fp-platform__grid--support fp-visit-icon-grid">
            {content.whatYouWillFind.items.map((item) => (
              <VisitIconCard item={item} key={item.title} />
            ))}
          </div>
          <div className="fp-support__section fp-visit-bring">
            <p className="forest-visit-bring__title">{content.whatYouWillFind.bringTitle}</p>
            <ul className="forest-visit-bring__list">
              {content.whatYouWillFind.bringItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="fp-support__note fp-visit-note">{content.whatYouWillFind.note}</p>
        </section>

        <Separator />

        <section className="fp-section fp-visit-section">
          <VisitSectionHeader
            eyebrow={content.accessibility.eyebrow}
            intro={content.accessibility.intro}
            title={content.accessibility.title}
          />
          <div className="fp-platform__grid fp-platform__grid--support fp-visit-icon-grid">
            {content.accessibility.items.map((item) => (
              <VisitIconCard item={item} key={item.title} />
            ))}
          </div>
          <div className="fp-visit-note-row">
            <p className="fp-support__note fp-visit-note">{content.accessibility.note}</p>
            <VisitTextLink link={content.accessibility.contactLink} locale={locale} />
          </div>
        </section>

        <Separator />

        <section className="fp-section fp-visit-section">
          <VisitSectionHeader
            eyebrow={content.around.eyebrow}
            intro={content.around.intro}
            title={content.around.title}
          />
          <div className="fp-visit-around-layout">
            <div className="fp-support__section fp-visit-around__lead">
              <h3 className="fp-support__heading">{content.around.leadTitle}</h3>
              <p className="fp-support__subtitle">{content.around.leadBody}</p>
              <VisitTextLink link={content.around.contactLink} locale={locale} />
            </div>

            <div className="fp-visit-around">
              {content.around.groups.map((group) => (
                <article className="fp-visit-around__group" key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={`${group.title}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
          <div className="fp-visit-note-row">
            <p className="fp-support__note fp-visit-note">{content.around.note}</p>
          </div>
        </section>

        <Separator />

        <section className="fp-section fp-section--faq fp-visit-section fp-visit-section--faq">
          <VisitSectionHeader eyebrow={content.faq.eyebrow} title={content.faq.title} />
          <VisitFaq items={content.faq.items} />
        </section>

        <Separator />

        <section className="fp-section fp-visit-contact">
          <p className="fp-chapter__eyebrow">{content.finalContact.eyebrow}</p>
          <h2 className="fp-section__heading fp-section__heading--left fp-visit-contact__title">{content.finalContact.title}</h2>
          <p className="fp-section__subtitle fp-section__subtitle--left fp-visit-contact__body">{content.finalContact.body}</p>
          <div className="fp-support__actions fp-visit-contact__actions">
            {content.finalContact.actions.map((link) => (
              <VisitActionLink key={`${link.label}-${link.href}`} link={link} locale={locale} />
            ))}
          </div>
        </section>
      </div>
    </ForestPageShell>
  );
}
