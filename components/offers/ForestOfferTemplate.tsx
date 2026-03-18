import Link from "next/link";

import BlockRenderer from "@/components/blocks/BlockRenderer";
import ForestHeroMedia from "@/components/offers/ForestHeroMedia";
import { FOREST_DEFAULT_HERO_IMAGE } from "@/lib/brand-assets";
import { getForestPlaceholderCopy, getOfferLabels, resolveLocale } from "@/lib/i18n";
import {
  getBookingOptions,
  getFacilitatorBio,
  getFacilitatorImageUrl,
  getFacilitatorName,
  getFacilitatorSlug,
  getFacilitators,
  getOfferBodyHtml,
  getOfferHeroImageUrl,
  getOfferHeroVideoUrl,
  getOfferSubtitle,
  getOfferTitle,
  getPriceOptions,
  getPrimaryCta,
  getQuickFacts,
  getScheduleCards,
  getSections,
  getTags,
  getThemes,
  normalizeText,
  pickString,
} from "@/lib/offers";
import type { OfferDetail, OfferType, SectionBlock } from "@/lib/types";

/* ── props ── */

type ForestOfferTemplateProps = {
  offer: OfferDetail;
  locale: string;
  offerType: OfferType;
};

/* ── constants ── */

const TYPE_LABELS: Record<OfferType, { fr: string; en: string }> = {
  WORKSHOP: { fr: "Atelier", en: "Workshop" },
  CLASS: { fr: "Cours", en: "Class" },
  PRIVATE_SESSION: { fr: "Séance privée", en: "Private session" },
  TRAINING_INFO: { fr: "Formation", en: "Training" },
};

const FACT_ICONS: Record<string, string> = {
  venue:
    "M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z",
  location:
    "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z",
  duration:
    "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z",
  level:
    "M4 18h4v-8H4v8zm6 0h4V6h-4v12zm6 0h4v-4h-4v4z",
  price_note:
    "M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z",
  languages:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L8 14v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  facilitator_note:
    "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
};

const FACT_LABELS: Record<string, { fr: string; en: string }> = {
  venue: { fr: "Lieu", en: "Venue" },
  location: { fr: "Adresse", en: "Location" },
  languages: { fr: "Langues", en: "Languages" },
  level: { fr: "Niveau", en: "Level" },
  duration: { fr: "Durée", en: "Duration" },
  price_note: { fr: "Tarif", en: "Pricing" },
  facilitator_note: { fr: "Intervenant·e", en: "Facilitator" },
};

/* ── helpers ── */

function parseCompactDate(dateStr: string, locale: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const loc = locale || "fr";
  return {
    dayOfWeek: d.toLocaleDateString(loc, { weekday: "short" }),
    dayNum: d.getDate(),
    month: d.toLocaleDateString(loc, { month: "short" }),
    time: d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" }),
  };
}

function groupSectionsForLayout(sections: SectionBlock[]) {
  const groups: Array<{ type: "pair" | "single"; blocks: SectionBlock[] }> = [];
  const pairableTypes = ["rich_section", "feature_stack"];
  let i = 0;
  while (i < sections.length) {
    const current = sections[i];
    const next = sections[i + 1];
    if (
      next &&
      pairableTypes.includes(current.type) &&
      pairableTypes.includes(next.type) &&
      current.type !== next.type
    ) {
      groups.push({ type: "pair", blocks: [current, next] });
      i += 2;
    } else {
      groups.push({ type: "single", blocks: [current] });
      i += 1;
    }
  }
  return groups;
}

function FactIcon({ iconKey }: { iconKey: string }) {
  const path = FACT_ICONS[iconKey];
  if (!path) return null;
  return (
    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
      <path d={path} />
    </svg>
  );
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

/* ── component ── */

export default function ForestOfferTemplate({ offer, locale, offerType }: ForestOfferTemplateProps) {
  const localeCode = resolveLocale(locale);
  const labels = getOfferLabels(localeCode);
  const placeholderCopy = getForestPlaceholderCopy(localeCode);
  const typeLabel = TYPE_LABELS[offerType]?.[localeCode] ?? TYPE_LABELS.WORKSHOP[localeCode];

  const title = getOfferTitle(offer);
  const subtitle = getOfferSubtitle(offer);
  const bodyHtml = getOfferBodyHtml(offer);
  const primaryCta = getPrimaryCta(offer);
  const heroVideoUrl = getOfferHeroVideoUrl(offer);
  const heroImageUrl = getOfferHeroImageUrl(offer);
  const quickFacts = getQuickFacts(offer);
  const scheduleCards = getScheduleCards(offer);
  const themes = getThemes(offer);
  const sections = getSections(offer);
  const bookingOptions = getBookingOptions(offer);
  const priceOptions = getPriceOptions(offer);
  const facilitators = getFacilitators(offer);
  const tags = getTags(offer);
  const showScheduleCards = offerType === "WORKSHOP" || offerType === "CLASS";
  const hasMultipleBookingOptions = bookingOptions.length > 1;
  const heroCta = primaryCta
    ? hasMultipleBookingOptions
      ? {
          label: labels.chooseDatesPricing,
          url: "#offer-pricing",
          style: primaryCta.style,
        }
      : bookingOptions.length === 1
      ? {
          label: primaryCta.label || labels.book,
          url: pickString(bookingOptions[0], ["booking_url", "bookingUrl"]) || primaryCta.url,
          style: primaryCta.style,
        }
      : primaryCta
    : null;

  /* quick‑fact rows */
  const factRows = quickFacts
    ? [
        { key: "venue", value: quickFacts.venue },
        { key: "location", value: quickFacts.location },
        { key: "languages", value: quickFacts.languages },
        { key: "level", value: quickFacts.level },
        { key: "duration", value: quickFacts.duration },
        { key: "price_note", value: quickFacts.price_note },
        { key: "facilitator_note", value: quickFacts.facilitator_note },
      ].filter(
        (row): row is { key: string; value: string } =>
          typeof row.value === "string" && row.value.trim().length > 0,
      )
    : [];

  /* facilitator inline names */
  const facilitatorNames = facilitators
    .map((f) => {
      const name = getFacilitatorName(f, "");
      const nickname = pickString(f, ["nickname", "alias", "short_name"]);
      if (!name && nickname) {
        return nickname;
      }
      return nickname && name ? `${name} (${nickname})` : name;
    })
    .filter(Boolean);

  /* section grouping for paired layout */
  const groupedSections = groupSectionsForLayout(sections);

  return (
    <section className="page-section forest-offer-page">
      {/* ── HERO ── */}
      <section className="forest-hero forest-panel">
        <ForestHeroMedia
          defaultImageUrl={FOREST_DEFAULT_HERO_IMAGE}
          imageUrl={heroImageUrl}
          title={title}
          videoUrl={heroVideoUrl}
        />
        <p className="offer-type-label">{typeLabel}</p>
        <h1 className="forest-hero__title">{title}</h1>

        {subtitle ? <p className="offer-subtitle forest-hero__subtitle">{subtitle}</p> : null}

        {facilitatorNames.length > 0 ? (
          <p className="forest-hero__facilitator">w/ {facilitatorNames.join(", ")}</p>
        ) : null}

        {heroCta ? (
          <p>
            <a
              className={`button-link forest-primary-cta ${
                heroCta.style ? `button-link--${heroCta.style.toLowerCase()}` : ""
              }`.trim()}
              href={heroCta.url}
              rel={isExternalHref(heroCta.url) ? "noreferrer" : undefined}
              target={isExternalHref(heroCta.url) ? "_blank" : undefined}
            >
              {heroCta.label || labels.book}
            </a>
          </p>
        ) : null}

        {bodyHtml ? (
          <div className="rich-text forest-hero__body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        ) : null}

        {/* quick facts icon cards */}
        {factRows.length > 0 ? (
          <div className="forest-hero__facts">
            {factRows.map((row) => (
              <div className="forest-hero__fact" key={row.key}>
                <FactIcon iconKey={row.key} />
                <span className="forest-hero__fact-label">
                  {FACT_LABELS[row.key]?.[localeCode] ?? row.key}
                </span>
                <span className="forest-hero__fact-value">{row.value}</span>
              </div>
            ))}
          </div>
        ) : null}

        {/* schedule date cards */}
        {showScheduleCards && scheduleCards.length > 0 ? (
          <div className="forest-hero__schedule">
            {scheduleCards.map((card, index) => {
              const startParsed = card.start_datetime
                ? parseCompactDate(card.start_datetime, locale)
                : null;
              const endParsed = card.end_datetime
                ? parseCompactDate(card.end_datetime, locale)
                : null;
              const label = typeof card.date_label === "string" ? card.date_label.trim() : "";
              const timeRange = [startParsed?.time, endParsed?.time].filter(Boolean).join(" – ");

              return (
                <div className="forest-hero__schedule-card" key={`schedule-${index}`}>
                  {label ? (
                    <span className="forest-hero__schedule-label">{label}</span>
                  ) : startParsed ? (
                    <>
                      <span className="forest-hero__schedule-day">{startParsed.dayOfWeek}</span>
                      <span className="forest-hero__schedule-num">{startParsed.dayNum}</span>
                      <span className="forest-hero__schedule-month">{startParsed.month}</span>
                    </>
                  ) : null}
                  {timeRange ? (
                    <span className="forest-hero__schedule-time">{timeRange}</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {/* theme pills */}
        {themes.length > 0 ? (
          <div className="forest-hero__themes">
            <p className="forest-hero__themes-title">{labels.themes}:</p>
            {themes.map((theme) => (
              <span className="forest-hero__theme-pill" key={String(theme.id)}>
                {theme.name}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <hr aria-hidden="true" className="forest-section-divider" />

      {/* ── CONTENT BLOCKS ── */}
      {groupedSections.length > 0 ? (
        <section className="forest-section forest-section--blocks">
          {groupedSections.map((group, gi) => {
            if (group.type === "pair") {
              return (
                <div className="forest-content-pair" key={`group-${gi}`}>
                  <BlockRenderer blocks={[group.blocks[0]]} locale={localeCode} />
                  <BlockRenderer blocks={[group.blocks[1]]} locale={localeCode} />
                </div>
              );
            }
            return <BlockRenderer blocks={group.blocks} locale={localeCode} key={`group-${gi}`} />;
          })}
        </section>
      ) : null}

      {/* ── FACILITATORS ── */}
      {facilitators.length > 0 ? (
        <section className="forest-panel forest-facilitators">
          <h2>{labels.facilitators}</h2>
          <div className="forest-facilitators__grid">
            {facilitators.map((f, i) => {
              const name = getFacilitatorName(f);
              const bio = getFacilitatorBio(f);
              const imageUrl = getFacilitatorImageUrl(f);
              const facilitatorSlug = getFacilitatorSlug(f);

              const cardContent = (
                <>
                  {imageUrl ? (
                    <img
                      alt={name}
                      className="forest-facilitator-card__avatar"
                      loading="lazy"
                      src={imageUrl}
                    />
                  ) : (
                    <div aria-hidden="true" className="forest-facilitator-card__avatar-placeholder">
                      <svg fill="currentColor" height="32" viewBox="0 0 24 24" width="32">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                  <div className="forest-facilitator-card__info">
                    <h3>{name}</h3>
                    {bio ? <div className="rich-text" dangerouslySetInnerHTML={{ __html: bio }} /> : null}
                  </div>
                </>
              );

              return (
                <article className="forest-facilitator-card" key={`facilitator-${name}-${i}`}>
                  {facilitatorSlug ? (
                    <Link className="forest-facilitator-card__link" href={`/teachers/${facilitatorSlug}`}>
                      {cardContent}
                    </Link>
                  ) : (
                    cardContent
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* ── PRICING ── */}
      {(bookingOptions.length > 0 || priceOptions.length > 0) ? (
        <section className="forest-panel forest-pricing" id="offer-pricing">
          <h2>{labels.pricing}</h2>
          <div className="forest-pricing__grid">
            {bookingOptions.length > 0 ? bookingOptions.map((option, index) => {
              const label = pickString(option, ["label", "name", "title"], "Option");
              const amount = normalizeText(option.amount ?? option.price ?? option.value ?? option.formatted);
              const currency = normalizeText(option.currency ?? option.currency_code);
              const detail = [amount, currency].filter(Boolean).join(" ");
              const summary = pickString(option, ["summary"]);
              const dateSummary = pickString(option, ["date_summary", "dateSummary"]);
              const bookingUrl = pickString(option, ["booking_url", "bookingUrl"]);

              return (
                <div className="forest-pricing__card forest-pricing__card--booking" key={`booking-${label}-${index}`}>
                  <div className="forest-pricing__content">
                    <span className="forest-pricing__label">{label}</span>
                    {summary ? <span className="forest-pricing__summary">{summary}</span> : null}
                    {dateSummary ? <span className="forest-pricing__summary">{dateSummary}</span> : null}
                  </div>
                  <div className="forest-pricing__aside">
                    {detail ? <span className="forest-pricing__amount">{detail}</span> : null}
                    {bookingUrl ? (
                      <a
                        className="button-link forest-pricing__cta"
                        href={bookingUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {labels.book}
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            }) : priceOptions.map((price, index) => {
              const label = pickString(price, ["label", "name", "title"], "Option");
              const amount = normalizeText(price.amount ?? price.price ?? price.value ?? price.formatted);
              const currency = normalizeText(price.currency ?? price.currency_code);
              const detail = [amount, currency].filter(Boolean).join(" ");

              return (
                <div className="forest-pricing__card" key={`price-${label}-${index}`}>
                  <span className="forest-pricing__label">{label}</span>
                  {detail ? <span className="forest-pricing__amount">{detail}</span> : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="forest-promo-grid">
        {/* ── NEWSLETTER ── */}
        <section className="forest-panel forest-newsletter">
          <h2>{placeholderCopy.newsletterTitle}</h2>
          <p>{placeholderCopy.newsletterBody}</p>
          <div className="forest-newsletter__controls">
            <input aria-label={placeholderCopy.newsletterPlaceholder} placeholder={placeholderCopy.newsletterPlaceholder} />
            <button type="button">{placeholderCopy.newsletterCta}</button>
          </div>
        </section>

        {/* ── DISCOVER ── */}
        <section className="forest-panel forest-discover">
          <h2>{placeholderCopy.discoverTitle}</h2>
          <p>{placeholderCopy.discoverDescription}</p>
          <div className="forest-discover__mini-card">
            <small>{typeLabel}</small>
            <strong>{title}</strong>
            <span>{subtitle || labels.upcomingDates}</span>
          </div>
          <Link className="button-link forest-secondary-cta" href="/workshops">
            {placeholderCopy.discoverCta}
          </Link>
        </section>
      </section>

      {/* ── EXTRA FAQ ── */}
      <section className="forest-panel forest-section">
        <h2>{placeholderCopy.extraFaqHeading}</h2>
        <div className="faq-list forest-faq-placeholder">
          {placeholderCopy.extraFaqItems.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <div>
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── TAGS ── */}
      {tags.length > 0 ? (
        <section className="forest-panel forest-section">
          <h2>Tags</h2>
          <ul className="tag-list">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}
