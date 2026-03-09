import Link from "next/link";

import BlockRenderer from "@/components/blocks/BlockRenderer";
import { ForestPageShell } from "@/components/forest/ForestPageShell";
import ForestFacilitatorShowcase from "@/components/offers/ForestFacilitatorShowcase";
import ForestHeroMedia from "@/components/offers/ForestHeroMedia";
import ForestMediaEmbed from "@/components/offers/ForestMediaEmbed";
import OfferActionBar from "@/components/offers/OfferActionBar";
import { FOREST_DEFAULT_HERO_IMAGE } from "@/lib/brand-assets";
import { getForestPlaceholderCopy, getOfferLabels, resolveLocale } from "@/lib/i18n";
import { localizePath } from "@/lib/locale-path";
import {
  getCanonicalOfferPath,
  getDomains,
  getFacilitatorBio,
  getFaqItems,
  getFacilitatorImageUrl,
  getFacilitatorName,
  getFacilitatorQuote,
  getFacilitatorSlug,
  getFacilitators,
  getMediaUrl,
  getOccurrences,
  getOfferHeroImageUrl,
  getOfferHeroVideoUrl,
  getOfferSubtitle,
  getOfferTitle,
  getPriceOptions,
  getPrimaryCta,
  getQuickFacts,
  getScheduleCards,
  getBenefits,
  getSections,
  getTags,
  getThemes,
  normalizeText,
  pickString,
} from "@/lib/offers";
import type { OfferDetail, OfferSummary, OfferType, SectionBlock, SiteFaqSection } from "@/lib/types";

/* ── props ── */

type ForestOfferTemplateProps = {
  offer: OfferDetail;
  locale: string;
  offerType: OfferType;
  relatedOffers?: OfferSummary[];
  siteFaqSections?: SiteFaqSection[];
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

/* ── component ── */

export default function ForestOfferTemplate({
  offer,
  locale,
  offerType,
  relatedOffers = [],
  siteFaqSections = [],
}: ForestOfferTemplateProps) {
  const localeCode = resolveLocale(locale);
  const labels = getOfferLabels(localeCode);
  const placeholderCopy = getForestPlaceholderCopy(localeCode);
  const typeLabel = TYPE_LABELS[offerType]?.[localeCode] ?? TYPE_LABELS.WORKSHOP[localeCode];

  const title = getOfferTitle(offer);
  const subtitle = getOfferSubtitle(offer);
  const primaryCta = getPrimaryCta(offer);
  const heroVideoUrl = getOfferHeroVideoUrl(offer);
  const heroImageUrl = getOfferHeroImageUrl(offer);
  const quickFacts = getQuickFacts(offer);
  const scheduleCards = getScheduleCards(offer);
  const themes = getThemes(offer);
  const domains = getDomains(offer);
  const sections = getSections(offer);
  const mediaUrl = getMediaUrl(offer);
  const priceOptions = getPriceOptions(offer);
  const benefits = getBenefits(offer);
  const facilitators = getFacilitators(offer);
  const tags = getTags(offer);
  const faqItems = getFaqItems(offer);
  const showScheduleCards = offerType === "WORKSHOP" || offerType === "CLASS";

  /* split first rich_section (Aperçu) from remaining sections */
  const apercuSection =
    sections.length > 0 && sections[0].type === "rich_section" ? sections[0] : null;
  const apercuHeading = apercuSection?.value?.heading as string | undefined;
  const apercuBody = apercuSection?.value?.body as string | undefined;
  const afterApercu = apercuSection ? sections.slice(1) : sections;
  const hasMedia = Boolean(mediaUrl);

  /* pull out journey_steps section if present */
  const journeySection = afterApercu.find((s) => s.type === "journey_steps") ?? null;
  const rawJourneyItems = (
    (journeySection?.value as Record<string, unknown> | undefined)?.items as
      Array<Record<string, unknown>> | undefined
  ) ?? [];
  /* Wagtail ListBlock wraps each item as {type:"item", value:{…}} — unwrap */
  const journeyItems = rawJourneyItems.map((item) => {
    const inner = (item.value ?? item) as { title?: string; description?: string };
    return { title: inner.title, description: inner.description };
  });
  const remainingSections = afterApercu.filter((s) => s !== journeySection);

  /* quick‑fact rows (venue is a Maps link, removed location/price/facilitator) */
  const venueMapUrl = quickFacts?.venue
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        [quickFacts.venue, quickFacts.location].filter(Boolean).join(", "),
      )}`
    : undefined;

  const factRows = quickFacts
    ? [
        { key: "venue", value: quickFacts.venue },
        { key: "languages", value: quickFacts.languages },
        { key: "level", value: quickFacts.level },
        { key: "duration", value: quickFacts.duration },
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

  /* facilitator slides for showcase */
  const facilitatorSlides = facilitators.map((f) => {
    const slug = getFacilitatorSlug(f);
    return {
      name: getFacilitatorName(f),
      title: pickString(f, ["title"]),
      imageUrl: getFacilitatorImageUrl(f),
      slug: slug || undefined,
      quote: getFacilitatorQuote(f),
      bio: getFacilitatorBio(f),
      profileHref: slug ? localizePath(localeCode, `/teachers/${slug}`) : undefined,
    };
  });

  /* section grouping for paired layout (remaining after Aperçu + journey) */
  const groupedSections = groupSectionsForLayout(remainingSections);
  const faqSections = siteFaqSections.filter((section) => section.items.length > 0);

  /* price hint for cinematic hero */
  const priceHint = priceOptions.length > 0
    ? (() => {
        const first = priceOptions[0];
        const label = pickString(first, ["label", "name", "title"]);
        const amount = normalizeText(first.amount ?? first.price ?? first.value ?? first.formatted);
        const currency = normalizeText(first.currency ?? first.currency_code);
        return [label, amount, currency].filter(Boolean).join(" ");
      })()
    : "";

  /* canonical URL for share (relative path — OfferActionBar resolves on client) */
  const canonicalPath = getCanonicalOfferPath(offer);

  /* first occurrence → calendar event for "Add to Calendar" */
  const occurrences = getOccurrences(offer);
  const firstOcc = occurrences[0] as Record<string, unknown> | undefined;
  const calendarEvent =
    firstOcc && typeof firstOcc.start_datetime === "string" && typeof firstOcc.end_datetime === "string"
      ? {
          start: firstOcc.start_datetime,
          end: firstOcc.end_datetime,
          location: quickFacts?.venue
            ? `${quickFacts.venue}${quickFacts.location ? `, ${quickFacts.location}` : ""}`
            : undefined,
        }
      : undefined;

  return (
    <ForestPageShell className="forest-site-shell--offer">
      <section className="page-section forest-offer-page">
        {/* ── CINEMATIC HERO ── */}
        <section className="forest-hero forest-hero--cinematic">
          <ForestHeroMedia
            defaultImageUrl={FOREST_DEFAULT_HERO_IMAGE}
            imageUrl={heroImageUrl}
            title={title}
            videoUrl={heroVideoUrl}
          />

          <div className="forest-hero__overlay-content">
            <p className="offer-type-label">{typeLabel}</p>
            <hr aria-hidden="true" className="forest-hero__divider" />
            <h1 className="forest-hero__title">{title}</h1>

            {subtitle ? <p className="offer-subtitle forest-hero__subtitle">{subtitle}</p> : null}

            {facilitatorNames.length > 0 ? (
              <p className="forest-hero__facilitator">
                {localeCode === "fr" ? "avec" : "w/"} {facilitatorNames.join(", ")}
              </p>
            ) : null}

            <OfferActionBar
              calendarEvent={calendarEvent}
              canonicalUrl={canonicalPath}
              title={title}
              variant="cinematic"
            />

            {primaryCta ? (
              <a
                className="forest-hero__cta"
                href={primaryCta.url}
                rel="noreferrer"
                target="_blank"
              >
                {primaryCta.label || labels.book}
              </a>
            ) : null}

            {priceHint ? (
              <p className="forest-hero__price-hint">{priceHint}</p>
            ) : null}
          </div>
        </section>

        {/* ── DETAILS BELOW HERO ── */}
        <section className="forest-panel forest-hero__details" id="offer-details">
          {/* quick facts */}
          {factRows.length > 0 ? (
            <div className="forest-hero__facts">
              {factRows.map((row) => {
                const isVenue = row.key === "venue" && venueMapUrl;
                return (
                  <div className="forest-hero__fact" key={row.key}>
                    <FactIcon iconKey={row.key} />
                    <span className="forest-hero__fact-label">
                      {FACT_LABELS[row.key]?.[localeCode] ?? row.key}
                    </span>
                    {isVenue ? (
                      <a
                        className="forest-hero__fact-value forest-hero__fact-link"
                        href={venueMapUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <span className="forest-hero__fact-value">{row.value}</span>
                    )}
                  </div>
                );
              })}
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
                const timeRange = [startParsed?.time, endParsed?.time].filter(Boolean).join(" – ");

                return (
                  <div className="forest-hero__schedule-card" key={`schedule-${index}`}>
                    {startParsed ? (
                      <>
                        <span className="forest-hero__schedule-day">{startParsed.dayOfWeek}</span>
                        <span className="forest-hero__schedule-date">
                          {startParsed.dayNum} {startParsed.month}
                        </span>
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

        </section>

        <div aria-hidden="true" className="fl-separator" role="separator">
          <span className="fl-separator__dot" />
        </div>

      {/* ── APERÇU (two separate boxes side by side) ── */}
      {apercuSection ? (
        <div className={`forest-apercu${hasMedia ? " forest-apercu--two-col" : ""}`}>
          {hasMedia ? (
            <div className="forest-apercu__media">
              <ForestMediaEmbed
                fallbackImageUrl={heroImageUrl}
                title={title}
                vimeoUrl={mediaUrl}
              />
            </div>
          ) : null}
          <section className="forest-panel forest-apercu__content">
            {apercuHeading ? <h2>{apercuHeading}</h2> : null}
            {apercuBody ? (
              <div className="rich-text" dangerouslySetInnerHTML={{ __html: apercuBody }} />
            ) : null}

            {/* domain & theme pills */}
            {(domains.length > 0 || themes.length > 0) ? (
              <div className="forest-hero__themes">
                <span className="forest-hero__themes-label">
                  {localeCode === "fr" ? "Thèmes" : "Themes"}
                </span>
                {domains.map((domain) => (
                  <span className="forest-hero__theme-pill forest-hero__domain-pill" key={String(domain.id)}>
                    {domain.name}
                  </span>
                ))}
                {themes.map((theme) => (
                  <span className="forest-hero__theme-pill" key={String(theme.id)}>
                    {theme.name}
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      ) : null}

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

      {/* ── FACILITATOR SHOWCASE ── */}
      {facilitatorSlides.length > 0 ? (
        <>
          <div aria-hidden="true" className="fl-separator" role="separator">
            <span className="fl-separator__dot" />
          </div>
          <ForestFacilitatorShowcase
            facilitators={facilitatorSlides}
            heading={labels.facilitators}
          />
        </>
      ) : null}

      {/* ── WHAT YOU'LL LEARN ── */}
      {journeyItems.length > 0 ? (
        <>
          <div aria-hidden="true" className="fl-separator" role="separator">
            <span className="fl-separator__dot" />
          </div>
          <section className="forest-journey">
            <h2 className="forest-journey__heading">
              {localeCode === "fr" ? "Ce que vous apprendrez" : "What you\u2019ll learn"}
            </h2>
            <ol className="forest-journey__trail">
              {journeyItems.map((step, index) => (
                <li className="forest-journey__waypoint" key={`step-${index}`}>
                  <span aria-hidden="true" className="forest-journey__marker">{index + 1}</span>
                  <div className="forest-journey__content">
                    {step.title ? <h3 className="forest-journey__title">{step.title}</h3> : null}
                    {step.description ? (
                      <div
                        className="forest-journey__desc rich-text"
                        dangerouslySetInnerHTML={{ __html: step.description }}
                      />
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
            {primaryCta ? (
              <div className="forest-journey__cta">
                <a className="fl-btn fl-btn--primary" href={primaryCta.url}>
                  {primaryCta.label || labels.book}
                </a>
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      {/* ── FEATURED IMAGE + EVENT FAQ ── */}
      {(heroImageUrl || faqItems.length > 0) ? (
        <>
          <div aria-hidden="true" className="fl-separator" role="separator">
            <span className="fl-separator__dot" />
          </div>
          <section className="forest-image-faq">
            {heroImageUrl ? (
              <div className="forest-image-faq__media">
                <img
                  alt={title}
                  className="forest-image-faq__img"
                  loading="lazy"
                  src={heroImageUrl}
                />
              </div>
            ) : null}
            {faqItems.length > 0 ? (
              <div className="forest-image-faq__questions fp-faq">
                <h2>{labels.eventFaq}</h2>
                <div className="fp-faq__category">
                  <div className="faq-list">
                    {faqItems.map((item) => (
                      <details key={item.question}>
                        <summary>{item.question}</summary>
                        <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      {/* ── PRICING & BENEFITS ── */}
      {priceOptions.length > 0 ? (
        <section className={`forest-pricing-benefits${benefits ? " forest-pricing-benefits--two-col" : ""}`}>
          {/* compact pricing box */}
          <div className="forest-panel forest-pricing-compact">
            <h2>{labels.pricing}</h2>
            <div className="forest-pricing-compact__list">
              {priceOptions.map((price, index) => {
                const label = pickString(price, ["label", "name", "title"], "Option");
                const amount = normalizeText(price.amount ?? price.price ?? price.value ?? price.formatted);
                const currency = normalizeText(price.currency ?? price.currency_code);
                const detail = [amount, currency].filter(Boolean).join(" ");

                return (
                  <div className="forest-pricing-compact__row" key={`price-${label}-${index}`}>
                    <span className="forest-pricing-compact__label">{label}</span>
                    {detail ? <span className="forest-pricing-compact__amount">{detail}</span> : null}
                  </div>
                );
              })}
            </div>
            {primaryCta ? (
              <a className="fl-btn fl-btn--primary forest-pricing-compact__cta" href={primaryCta.url}>
                {primaryCta.label || labels.book}
              </a>
            ) : null}
          </div>

          {/* benefits column */}
          {benefits && benefits.items.length > 0 ? (
            <div className="forest-benefits">
              <h2 className="forest-benefits__heading">
                {benefits.heading || labels.benefits}
              </h2>
              <ul className="forest-benefits__list">
                {benefits.items.map((item, index) => (
                  <li className="forest-benefits__item" key={`benefit-${index}`}>
                    <svg aria-hidden="true" className="forest-benefits__icon" fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
                      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                    </svg>
                    <div className="forest-benefits__content">
                      {item.title ? <h3 className="forest-benefits__title">{item.title}</h3> : null}
                      {item.description ? (
                        <div className="forest-benefits__desc rich-text" dangerouslySetInnerHTML={{ __html: item.description }} />
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ── NEWSLETTER ── */}
      <section className="forest-panel forest-newsletter forest-newsletter--standalone">
        <h2>{placeholderCopy.newsletterTitle}</h2>
        <p>{placeholderCopy.newsletterBody}</p>
        <div className="forest-newsletter__controls">
          <input aria-label={placeholderCopy.newsletterPlaceholder} placeholder={placeholderCopy.newsletterPlaceholder} />
          <button type="button">{placeholderCopy.newsletterCta}</button>
        </div>
      </section>

      {/* ── DISCOVER / RELATED OFFERS ── */}
      {relatedOffers.length > 0 ? (
        <section className="forest-discover-slider">
          <h2 className="forest-discover-slider__heading">{placeholderCopy.discoverTitle}</h2>
          <div className="forest-discover-slider__track">
            {relatedOffers.slice(0, 6).map((ro) => {
              const roType = (ro.type ?? "WORKSHOP").toString().toUpperCase();
              const roLabel = TYPE_LABELS[roType as OfferType]?.[localeCode] ?? TYPE_LABELS.WORKSHOP[localeCode];
              const roTitle = ro.title ?? "Offer";
              const roExcerpt = typeof ro.excerpt === "string" ? ro.excerpt : "";
              const roImage = getOfferHeroImageUrl(ro as OfferDetail);
              const roPath = getCanonicalOfferPath(ro);
              return (
                <Link className="forest-discover-slider__card" href={localizePath(localeCode, roPath)} key={ro.slug}>
                  {roImage ? (
                    <img alt={roTitle} className="forest-discover-slider__img" loading="lazy" src={roImage} />
                  ) : (
                    <div className="forest-discover-slider__img-placeholder" />
                  )}
                  <div className="forest-discover-slider__body">
                    <small>{roLabel}</small>
                    <strong>{roTitle}</strong>
                    {roExcerpt ? <p>{roExcerpt}</p> : null}
                  </div>
                </Link>
              );
            })}
          </div>
          <Link className="button-link forest-secondary-cta" href={localizePath(localeCode, "/workshops")}>
            {placeholderCopy.discoverCta}
          </Link>
        </section>
      ) : null}

      {/* ── SITE FAQ ── */}
      {faqSections.length > 0 ? (
        <section className="forest-panel fp-section fp-section--faq forest-site-faq">
          <div className="fp-chapter__intro fp-chapter__intro--faq">
            <p className="fp-chapter__eyebrow">Questions</p>
            <h2 className="fp-section__heading fp-section__heading--left">{placeholderCopy.extraFaqHeading}</h2>
          </div>
          <div className="fp-faq">
            {faqSections.map((section) => (
              <div className="fp-faq__category" key={section.title}>
                <h3 className="fp-faq__category-name">{section.title}</h3>
                <div className="faq-list">
                  {section.items.map((item) => (
                    <details key={`${section.title}-${item.question}`}>
                      <summary>{item.question}</summary>
                      <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

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
    </ForestPageShell>
  );
}
