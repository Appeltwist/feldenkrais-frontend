import type { CSSProperties } from "react";

import Image from "next/image";

import ForestWeeklyScheduleSection from "@/components/classes/ForestWeeklyScheduleSection";
import PricingScrollEffects from "@/components/motion/PricingScrollEffects";
import RevealObserver from "@/components/motion/RevealObserver";
import { getRequestLocale } from "@/lib/get-locale";
import type { FeatureItem, Strategy } from "@/lib/pricing-content";
import { getPricingContent } from "@/lib/pricing-content";

const BOOKING_URLS = {
  book: "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=41&sTG=23&prodId=100023",
  dropIn: "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=41&sTG=23&prodId=100003",
  memberships: "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=40",
  classPasses: "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=41&sTG=23",
} as const;

const CONTACT_EMAIL = "mailto:learn@forest-lighthouse.be";

const ICON_PATHS = {
  infinity:
    "M17 8c-2 0-3.5 1.2-5 4-1.5-2.8-3-4-5-4-2.2 0-4 1.8-4 4s1.8 4 4 4c2 0 3.5-1.2 5-4 1.5 2.8 3 4 5 4 2.2 0 4-1.8 4-4s-1.8-4-4-4Z",
  compass: [
    "M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z",
    "M14.5 9.5 9.8 11.2l-1.7 4.7 4.7-1.7 1.7-4.7Z",
  ],
  star: "M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17.9 6.6 19.8l1-6.1L3.2 9.4l6.1-.9L12 3Z",
  calendar: [
    "M7 3v3M17 3v3",
    "M4 8h16",
    "M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  ],
  ticket: [
    "M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V8Z",
    "M9 8v12",
  ],
  grid: ["M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"],
  video: [
    "M15 10l5-3v10l-5-3z",
    "M4 6h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
  ],
  film: [
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z",
    "M10 8l6 4-6 4V8z",
  ],
  book: [
    "M4 19.5A2.5 2.5 0 0 1 6.5 17H20",
    "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  ],
} as const;

function IconSvg({ paths, dashed }: { paths: string | readonly string[]; dashed?: number[] }) {
  const pathArray = Array.isArray(paths) ? paths : [paths];

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="18"
    >
      {pathArray.map((d, index) => (
        <path
          d={d}
          key={index}
          strokeDasharray={dashed && dashed[index] ? `${dashed[index]} ${dashed[index]}` : undefined}
        />
      ))}
    </svg>
  );
}

function FeatureText({ feature }: { feature: FeatureItem }) {
  if (typeof feature === "string") {
    return <span>{feature}</span>;
  }

  return (
    <span>
      <strong>{feature.main}</strong>
      {feature.sub ? ` ${feature.sub}` : null}
    </span>
  );
}

function Separator() {
  return (
    <div aria-hidden="true" className="fl-separator" role="separator">
      <span className="fl-separator__dot" />
    </div>
  );
}

function StrategyList({ strategies }: { strategies: Strategy[] }) {
  return (
    <ol className="fp-strategy-list">
      {strategies.map((strategy, index) => (
        <li className="fp-strategy-list__item" data-hover-lift="true" key={strategy.title}>
          <span className="fp-strategy-list__num">{index + 1}</span>
          <div className="fp-strategy-list__body">
            <h3 className="fp-strategy-list__title">{strategy.title}</h3>
            <p className="fp-strategy-list__text">{strategy.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default async function ForestPricingPage() {
  const locale = await getRequestLocale();
  const c = getPricingContent(locale);
  const isFr = locale.toLowerCase().startsWith("fr");
  const motionScopeId = "fp-page-motion";
  const swipeHint = isFr ? "\u2190 Glissez pour voir les options \u2192" : "\u2190 Swipe to view options \u2192";
  const heroLabel = isFr ? "Forest Lighthouse, Bruxelles" : "Forest Lighthouse, Brussels";
  const pricingIntro = isFr
    ? "Choisissez la mani\u00e8re dont vous souhaitez \u00eatre accompagn\u00e9 pendant vos huit premi\u00e8res semaines."
    : "Choose the level of accompaniment that best matches how you want to move through your first eight weeks.";
  const passesIntro = isFr
    ? "Pour une pratique plus libre, plus flexible, ou simplement r\u00e9guli\u00e8re sans cadre de programme."
    : "For a lighter rhythm, a flexible routine, or a steady weekly practice without the programme format.";
  const scheduleHeading = isFr ? "I. Cours hebdomadaires" : "I. Weekly classes";
  const programBenefitsVariants = ["lite", "featured", "premium"] as const;
  const packageIcons: Array<keyof typeof ICON_PATHS> = ["infinity", "compass", "star"];
  const passIcons: Array<keyof typeof ICON_PATHS> = ["compass", "calendar", "ticket"];
  const passDashed: Array<number[] | undefined> = [undefined, undefined, [0, 2]];
  const platformIcons: Array<keyof typeof ICON_PATHS> = ["grid", "video", "film", "book"];

  return (
    <div className="fp-page" id={motionScopeId}>
      <RevealObserver scopeId={motionScopeId} />
      <PricingScrollEffects scopeId={motionScopeId} />
      {/* Botanical illustrations — decorative transition elements */}
      {/* Pair A: hero exit — bird of paradise + small fan palm companion */}
      <div aria-hidden="true" className="fp-botanical fp-botanical--1a" data-botanical="1a">
        <Image alt="" className="fp-botanical__img" fill sizes="360px" src="/brands/forest-lighthouse/photos/leaves1.png" />
      </div>
      <div aria-hidden="true" className="fp-botanical fp-botanical--1b" data-botanical="1b">
        <Image alt="" className="fp-botanical__img" fill sizes="160px" src="/brands/forest-lighthouse/photos/leaves3.png" />
      </div>
      {/* Pair: passes → packages — hibiscus (left) + calathea companion (right) */}
      <div aria-hidden="true" className="fp-botanical fp-botanical--2" data-botanical="2">
        <Image alt="" className="fp-botanical__img" fill sizes="340px" src="/brands/forest-lighthouse/photos/leaves2.png" />
      </div>
      <div aria-hidden="true" className="fp-botanical fp-botanical--2b" data-botanical="2b">
        <Image alt="" className="fp-botanical__img" fill sizes="180px" src="/brands/forest-lighthouse/photos/leaves5.png" />
      </div>
      {/* Pair B: packages → commitment — fan palm + small monstera */}
      <div aria-hidden="true" className="fp-botanical fp-botanical--3a" data-botanical="3a">
        <Image alt="" className="fp-botanical__img" fill sizes="380px" src="/brands/forest-lighthouse/photos/leaves3.png" />
      </div>
      <div aria-hidden="true" className="fp-botanical fp-botanical--3b" data-botanical="3b">
        <Image alt="" className="fp-botanical__img" fill sizes="180px" src="/brands/forest-lighthouse/photos/leaves4.png" />
      </div>
      {/* Pair: commitment → schedule — monstera (left) + hibiscus companion (right) */}
      <div aria-hidden="true" className="fp-botanical fp-botanical--4" data-botanical="4">
        <Image alt="" className="fp-botanical__img" fill sizes="400px" src="/brands/forest-lighthouse/photos/leaves4.png" />
      </div>
      <div aria-hidden="true" className="fp-botanical fp-botanical--4b" data-botanical="4b">
        <Image alt="" className="fp-botanical__img" fill sizes="200px" src="/brands/forest-lighthouse/photos/leaves2.png" />
      </div>
      {/* Pair D: schedule → session — calathea (right) + small calathea companion (left) */}
      <div aria-hidden="true" className="fp-botanical fp-botanical--7a" data-botanical="7a">
        <Image alt="" className="fp-botanical__img" fill sizes="340px" src="/brands/forest-lighthouse/photos/leaves5.png" />
      </div>
      <div aria-hidden="true" className="fp-botanical fp-botanical--7b" data-botanical="7b">
        <Image alt="" className="fp-botanical__img" fill sizes="180px" src="/brands/forest-lighthouse/photos/leaves5.png" />
      </div>
      {/* Single: session → platform — fan palm, flipped */}
      <div aria-hidden="true" className="fp-botanical fp-botanical--8" data-botanical="8">
        <Image alt="" className="fp-botanical__img" fill sizes="320px" src="/brands/forest-lighthouse/photos/leaves3.png" />
      </div>
      {/* Pair C: platform → benefits — calathea + small bird of paradise */}
      <div aria-hidden="true" className="fp-botanical fp-botanical--5a" data-botanical="5a">
        <Image alt="" className="fp-botanical__img" fill sizes="360px" src="/brands/forest-lighthouse/photos/leaves5.png" />
      </div>
      <div aria-hidden="true" className="fp-botanical fp-botanical--5b" data-botanical="5b">
        <Image alt="" className="fp-botanical__img" fill sizes="200px" src="/brands/forest-lighthouse/photos/leaves1.png" />
      </div>
      {/* Single: near FAQ — hibiscus repeat, flipped */}
      <div aria-hidden="true" className="fp-botanical fp-botanical--6" data-botanical="6">
        <Image alt="" className="fp-botanical__img" fill sizes="300px" src="/brands/forest-lighthouse/photos/leaves2.png" />
      </div>

      {/* ── Page intro (matches schedule / rent page style) ── */}
      <section className="fc-intro">
        <p className="fc-intro__eyebrow">
          {isFr ? "Tarifs & formules" : "Pricing & plans"}
        </p>
        <h1 className="fc-intro__title">
          {isFr ? "Pass & Abonnements" : "Passes & Memberships"}
        </h1>
        <p className="fc-intro__subtitle">
          {passesIntro}
        </p>
      </section>

      {/* ── 2. PRICING CHAPTER (reordered: passes first, packages second) ── */}
      <section className="fp-chapter fp-chapter--pricing">
        {/* 2a. FLEXIBLE OPTIONS — shown first (intro already in fc-intro above) */}

        <section
          aria-label={isFr ? "Pass et abonnements" : "Passes and subscriptions"}
          className="fl-pricing fl-pricing--passes"
        >
          <div className="fl-pricing-wrap">
            <div className="fl-pricing-grid" role="list">
              {c.passes.cards.map((card, index) => (
                <article
                  className={`fl-card fl-card--${card.cardVariant || "lite"}`}
                  data-hover-lift="true"
                  key={card.name}
                  role="listitem"
                >
                  <header className="fl-card-head">
                    <div className="fl-headline">
                      <div className="fl-left">
                        <div className="fl-illus" aria-hidden="true">
                          <IconSvg dashed={passDashed[index]} paths={ICON_PATHS[passIcons[index] || "compass"]} />
                        </div>
                        <div className="fl-head">
                          <h3 className="fl-title">{card.name}</h3>
                        </div>
                      </div>
                    </div>
                    {card.description ? <p className="fl-sub">{card.description}</p> : null}
                    <div className="fl-price">
                      <span className="fl-price-main">{card.price}</span>
                      {card.perClass ? <span className="fl-price-suffix">{card.perClass}</span> : null}
                    </div>
                  </header>

                  <div className="fl-divider" />

                  <ul className="fl-list">
                    {card.features.map((feature, featureIndex) => (
                      <li className="fl-item" key={featureIndex}>
                        <span aria-hidden="true" className="fl-icon">
                          ✓
                        </span>
                        <FeatureText feature={feature} />
                      </li>
                    ))}
                  </ul>

                  {card.ctaUrl ? (
                    <a className="fl-btn fl-btn--primary" href={card.ctaUrl} rel="noopener noreferrer" target="_blank">
                      {card.cta}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
          <p aria-hidden="true" className="fl-swipe-hint">
            {swipeHint}
          </p>
        </section>

        <div className="fp-chapter__actions">
          <a className="fl-btn fl-btn--secondary" href={CONTACT_EMAIL}>
            {c.passes.contactCta || c.packages.contactCta}
          </a>
        </div>

        <Separator />

        {/* 2b. 8-WEEK PACKAGES — shown second */}
        <div className="fp-chapter__intro" id="fp-packages">
          <p className="fp-chapter__eyebrow">{isFr ? "Tarifs" : "Pricing"}</p>
          <h2 className="fp-section__heading fp-section__heading--left">{c.packages.heading}</h2>
          <p className="fp-section__subtitle fp-section__subtitle--left">{pricingIntro}</p>
        </div>

        <section className="fl-pricing" aria-label={isFr ? "Programmes de 8 semaines" : "8-week programmes"}>
          <div className="fl-pricing-wrap">
            <div className="fl-pricing-grid" role="list">
              {c.packages.cards.map((card, index) => (
                <article
                  className={`fl-card fl-card--${card.cardVariant || "lite"}${card.recommended ? " is-featured" : ""}`}
                  data-hover-lift="true"
                  data-featured={card.recommended ? "true" : undefined}
                  key={card.tier}
                  role="listitem"
                >
                  <header className="fl-card-head">
                    {card.badgeText ? (
                      <span className={`fl-badge fl-badge--${card.badgeVariant || "mint"}`}>
                        {card.badgeText}
                      </span>
                    ) : null}
                    <div className="fl-top">
                      <div className="fl-left">
                        <div className="fl-illus" aria-hidden="true">
                          <IconSvg paths={ICON_PATHS[packageIcons[index] || "infinity"]} />
                        </div>
                        <div className="fl-head">
                          <h3 className="fl-title">{card.tier}</h3>
                          <p className="fl-sub fl-sub--inline">{card.period}</p>
                        </div>
                      </div>
                    </div>
                    {card.description ? <p className="fl-sub">{card.description}</p> : null}
                    <div className="fl-price">
                      <span className="fl-price-main">{card.price}</span>
                      {card.strikePrice ? <span className="fl-price-old">{card.strikePrice}</span> : null}
                      <span className="fl-price-suffix">/ {card.period}</span>
                    </div>
                  </header>

                  <div className="fl-divider" />

                  <ul className="fl-list">
                    {card.features.map((feature, featureIndex) => (
                      <li className="fl-item" key={featureIndex}>
                        <span aria-hidden="true" className="fl-icon">
                          ✓
                        </span>
                        <FeatureText feature={feature} />
                      </li>
                    ))}
                  </ul>

                  {card.ctaUrl ? (
                    <a className="fl-btn fl-btn--primary" href={card.ctaUrl} rel="noopener noreferrer" target="_blank">
                      {card.cta}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
          <p aria-hidden="true" className="fl-swipe-hint">
            {swipeHint}
          </p>
        </section>
      </section>

      <Separator />

      {/* ── 3. WHY PACKAGES — commitment + vertical feature reveal ── */}
      <section className="fp-commitment-reveal">
        <div className="fp-commitment-reveal__lede">
          <p className="fp-chapter__eyebrow">{isFr ? "Pourquoi un programme" : "Why a programme"}</p>
          <h2 className="fp-section__heading fp-section__heading--left">{c.commitment.heading}</h2>
          <p className="fp-commitment-reveal__subheading">{c.commitment.subheading}</p>
          <div className="fp-commitment">
            {c.commitment.paragraphs.map((paragraph) => (
              <p className="fp-commitment__body" key={paragraph}>
                {paragraph}
              </p>
            ))}
            {c.commitment.bullets?.length ? (
              <ul className="fp-commitment__bullets">
                {c.commitment.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="fp-feature-reveal" data-scroll-feature-reveal>
          {c.features.columns.map((column) => (
            <article
              className="fp-feature-card"
              data-scroll-feature-card
              key={column.title}
            >
              <div className="fp-feature-card__image-wrap">
                <Image
                  alt={column.title}
                  className="fp-feature-card__image"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  src={column.image}
                />
              </div>
              <div className="fp-feature-card__body">
                <h3 className="fp-feature-card__title">{column.title}</h3>
                {column.paragraphs.map((paragraph) => (
                  <p className="fp-feature-card__text" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── 4. SECTION I: SCHEDULE ── */}
      <ForestWeeklyScheduleSection
        eyebrow={isFr ? "Pratique hebdomadaire" : "Weekly practice"}
        heading={scheduleHeading}
        locale={locale}
        parallax
      />

      {/* ── 5. SECTION II: INDIVIDUAL SESSION (full-width) ── */}
      <section className="fp-session-section" data-reveal="section">
        <div className="fp-session-section__header">
          <div className="fp-session-section__text">
            <p className="fp-chapter__eyebrow">
              {isFr ? "Accompagnement personnalis\u00e9" : "Tailored support"}
            </p>
            <h2 className="fp-section__heading fp-section__heading--left">{c.individualSession.heading}</h2>
            {c.individualSession.subtitle ? (
              <p className="fp-section__subtitle fp-section__subtitle--left">{c.individualSession.subtitle}</p>
            ) : null}
            <p className="fp-support__note">{c.individualSession.subheading}</p>
          </div>
          <div className="fp-session-section__illus">
            <Image
              alt={c.features.columns[1]?.title || "Individual session"}
              className="fp-session-section__illus-img"
              height={200}
              sizes="220px"
              src="/brands/forest-lighthouse/hands.png"
              width={280}
            />
          </div>
        </div>

        <div className="fp-strategy-marquee" data-strategy-marquee>
          <div className="fp-strategy-marquee__track">
            <StrategyList strategies={c.individualSession.strategies} />
            <StrategyList strategies={c.individualSession.strategies} />
          </div>
        </div>

        <div className="fp-session-section__photo">
          <Image
            alt={isFr ? "S\u00e9ance Feldenkrais individuelle" : "Individual Feldenkrais session"}
            className="fp-detail-section__photo-img"
            height={400}
            sizes="(max-width: 900px) 100vw, 70vw"
            src="/brands/forest-lighthouse/feldenkrais-session.jpg"
            width={900}
          />
        </div>
      </section>

      {/* ── 6. SECTION III: NEUROSOMATIC PLATFORM ── */}
      <section className="fp-detail-section fp-detail-section--platform" data-scroll-parallax-section>
        <div className="fp-detail-section__illustration" data-scroll-parallax-illus>
          <Image
            alt="Headphones illustration"
            className="fp-detail-section__illus-img"
            fill
            sizes="(max-width: 900px) 100vw, 40vw"
            src="/brands/forest-lighthouse/headphones.png"
          />
        </div>
        <div className="fp-detail-section__content" data-scroll-parallax-content>
          <p className="fp-chapter__eyebrow">{isFr ? "Plateforme" : "Platform"}</p>
          <h2 className="fp-section__heading fp-section__heading--left">{c.platform.heading}</h2>
          <p className="fp-section__subtitle fp-section__subtitle--left">{c.platform.subtitle}</p>

          <div className="fp-platform__grid fp-platform__grid--support">
            {c.platform.features.map((feature, index) => (
              <article className="fp-platform__card" data-hover-lift="true" key={feature.title}>
                <div className="fp-platform__icon">
                  <IconSvg paths={ICON_PATHS[platformIcons[index] || "grid"]} />
                </div>
                <h4 className="fp-platform__card-title">{feature.title}</h4>
                <p className="fp-platform__card-desc">{feature.description}</p>
              </article>
            ))}
          </div>

          <div className="fp-support__actions">
            <a className="fl-btn fl-btn--primary" href={BOOKING_URLS.book} rel="noopener noreferrer" target="_blank">
              {isFr ? "Commencer" : "Start"}
            </a>
            <a className="fl-btn fl-btn--secondary" href={CONTACT_EMAIL}>
              {c.benefits.contactCta}
            </a>
          </div>
        </div>
        <div className="fp-detail-section__phones" data-scroll-parallax-illus>
          <div className="fp-phone-mockups">
            <div className="fp-phone-frame">
              <Image
                alt={isFr ? "Capture de l\u2019application \u2014 biblioth\u00e8que" : "App screenshot \u2014 library"}
                className="fp-phone-frame__screen"
                height={812}
                src="/brands/forest-lighthouse/app-screenshot-1.jpeg"
                width={375}
              />
            </div>
            <div className="fp-phone-frame">
              <Image
                alt={isFr ? "Capture de l\u2019application \u2014 le\u00e7on" : "App screenshot \u2014 lesson"}
                className="fp-phone-frame__screen"
                height={812}
                src="/brands/forest-lighthouse/app-screenshot-2.jpeg"
                width={375}
              />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── 7. BENEFITS REMINDER (clickable, before FAQ) ── */}
      <section className="fp-benefits-reminder" aria-label={c.benefits.heading} data-reveal="section">
        <div className="fp-benefits-strip__intro">
          <p className="fp-chapter__eyebrow">{isFr ? "Inclus" : "Included"}</p>
          <h3 className="fp-benefits-strip__heading">
            {isFr ? "Alors, quel programme pour commencer\u00a0?" : "So which package to start with?"}
          </h3>
        </div>

        <div className="fp-benefits__overview fp-benefits__overview--inline" role="list">
          {c.benefits.overview.map((pack, index) => (
            <a
              className={`fp-benefits__pack fp-benefits__pack--${programBenefitsVariants[index] || "lite"} fp-benefits__pack--clickable`}
              data-hover-lift="true"
              href="#fp-packages"
              key={pack.tier}
              role="listitem"
            >
              <h4 className="fp-benefits__pack-name">{pack.tier}</h4>
              <ul className="fp-benefits__pack-list">
                {pack.highlights.map((highlight, highlightIndex) => (
                  <li key={highlightIndex}>✓ {highlight}</li>
                ))}
              </ul>
              <span className="fp-benefits__pack-cta">
                {isFr ? "Voir les programmes \u2191" : "View packages \u2191"}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <section className="forest-panel fp-section fp-section--faq" data-reveal="section">
        <div className="fp-chapter__intro fp-chapter__intro--faq">
          <p className="fp-chapter__eyebrow">{isFr ? "Questions" : "Questions"}</p>
          <h2 className="fp-section__heading fp-section__heading--left">{c.faq.heading}</h2>
        </div>

        <div className="fp-faq">
          {c.faq.categories.map((category) => (
            <div className="fp-faq__category" key={category.category}>
              <h3 className="fp-faq__category-name">{category.category}</h3>
              <div className="faq-list">
                {category.items.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <div>
                      <p>{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
