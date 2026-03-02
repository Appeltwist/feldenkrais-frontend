import type { CSSProperties } from "react";

import { getRequestLocale } from "@/lib/get-locale";
import type { FeatureItem } from "@/lib/pricing-content";
import { getPricingContent } from "@/lib/pricing-content";
import FeatureSlider from "./FeatureSlider";
import StrategyCarousel from "./StrategyCarousel";

/* ── Booking & contact URLs ── */
const BOOKING_URLS = {
  book: "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=41&sTG=23&prodId=100023",
  dropIn: "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=41&sTG=23&prodId=100003",
  memberships: "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=40",
  classPasses: "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=41&sTG=23",
} as const;
const CONTACT_EMAIL = "mailto:learn@forest-lighthouse.be";

/* ── SVG icon paths (24×24 viewBox) ── */
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
      {pathArray.map((d, i) => (
        <path
          d={d}
          key={i}
          strokeDasharray={dashed && dashed[i] ? `${dashed[i]} ${dashed[i]}` : undefined}
        />
      ))}
    </svg>
  );
}

function FeatureText({ feature }: { feature: FeatureItem }) {
  if (typeof feature === "string") return <span>{feature}</span>;
  return (
    <span>
      <strong>{feature.main}</strong>
      {feature.sub ? ` ${feature.sub}` : null}
    </span>
  );
}

function Separator({ label }: { label?: string }) {
  return (
    <div aria-hidden="true" className="fl-separator" role="separator">
      {label ? <span className="fl-separator__label">{label}</span> : null}
      <span className="fl-separator__dot" />
    </div>
  );
}

export default async function ForestPricingPage() {
  const locale = await getRequestLocale();
  const c = getPricingContent(locale);
  const isFr = locale.toLowerCase().startsWith("fr");
  const swipeHint = isFr ? "\u2190 Glissez pour voir les options \u2192" : "\u2190 Swipe to view options \u2192";

  const packageIcons: Array<keyof typeof ICON_PATHS> = ["infinity", "compass", "star"];
  const passIcons: Array<keyof typeof ICON_PATHS> = ["compass", "calendar", "ticket"];
  const passDashed: Array<number[] | undefined> = [undefined, undefined, [0, 2]];
  const platformIcons: Array<keyof typeof ICON_PATHS> = ["grid", "video", "film", "book"];

  return (
    <div className="fp-page">
      {/* ═══ HERO ═══ */}
      <section className="fp-hero">
        <h1 className="fp-hero__title">{c.hero.title}</h1>
        <p className="fp-hero__subtitle">{c.hero.subtitle}</p>

        {/* ═══ STEPS ═══ */}
        <div className="fl-steps" aria-label={isFr ? "Parcours en 5 étapes" : "5-step journey"}>
          {c.hero.journeySteps.map((step, i) => {
            const isFirst = i === 0 && step.highlighted;
            const inner = (
              <>
                <div className="fl-step-num">{i + 1}</div>
                <div className="fl-step-text">
                  {step.label ? `${step.label} ` : null}
                  {step.boldPart ? <strong>{step.boldPart}</strong> : null}
                </div>
              </>
            );

            if (isFirst && step.href) {
              return (
                <div className="fl-step fl-step-clickable" key={i}>
                  <a
                    aria-label={isFr ? "Réserver un cours d'essai" : "Book a free trial class"}
                    href={step.href}
                    rel="noopener"
                    target="_blank"
                  >
                    {inner}
                  </a>
                </div>
              );
            }

            return (
              <div className="fl-step" key={i}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* ═══ 8-WEEK PACKAGES ═══ */}
      <section className="fl-pricing" id="fl-pricing-8w" aria-label={isFr ? "Programmes 8 semaines" : "8-week packages"}>
        <h2 className="fp-section__heading">{c.packages.heading}</h2>
        <div className="fl-pricing-wrap">
          <div className="fl-pricing-grid" role="list">
            {c.packages.cards.map((card, idx) => (
              <article
                className={`fl-card fl-card--${card.cardVariant || "lite"}${card.recommended ? " is-featured" : ""}`}
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
                        <IconSvg paths={ICON_PATHS[packageIcons[idx] || "infinity"]} />
                      </div>
                      <div className="fl-head">
                        <h3 className="fl-title">{card.tier}</h3>
                        &middot; {card.period}
                      </div>
                    </div>
                  </div>
                  {card.description ? <p className="fl-sub">{card.description}</p> : null}
                  <div className="fl-price">
                    <span className="fl-price-main">{card.price}</span>
                    {card.strikePrice ? (
                      <span className="fl-price-old">{card.strikePrice}</span>
                    ) : null}
                    <span className="fl-price-suffix">/ {card.period}</span>
                  </div>
                </header>
                <div className="fl-divider" />
                <ul className="fl-list">
                  {card.features.map((f, i) => (
                    <li className="fl-item" key={i}>
                      <span className="fl-icon" aria-hidden="true">✓</span>
                      <FeatureText feature={f} />
                    </li>
                  ))}
                </ul>
                {card.ctaUrl ? (
                  <a
                    className="fl-btn fl-btn--primary"
                    href={card.ctaUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {card.cta}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
        <p className="fl-swipe-hint" aria-hidden="true">{swipeHint}</p>
      </section>

      <Separator />

      {/* ═══ PASSES & SUBSCRIPTIONS ═══ */}
      <section className="fl-pricing" aria-label={isFr ? "Pass et abonnements" : "Passes and subscriptions"}>
        <h2 className="fp-section__heading">{c.passes.heading}</h2>
        <div className="fl-pricing-wrap">
          <div className="fl-pricing-grid" role="list">
            {c.passes.cards.map((card, idx) => (
              <article
                className={`fl-card fl-card--${card.cardVariant || "lite"}`}
                key={card.name}
                role="listitem"
              >
                <header className="fl-card-head">
                  <div className="fl-headline">
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div className="fl-illus" aria-hidden="true">
                        <IconSvg
                          dashed={passDashed[idx]}
                          paths={ICON_PATHS[passIcons[idx] || "compass"]}
                        />
                      </div>
                      <h3 className="fl-title">{card.name}</h3>
                    </div>
                  </div>
                  {card.description ? <p className="fl-sub">{card.description}</p> : null}
                  <div className="fl-price">
                    <span className="fl-price-main">{card.price}</span>
                    {card.perClass ? (
                      <span className="fl-price-suffix">{card.perClass}</span>
                    ) : null}
                  </div>
                </header>
                <div className="fl-divider" />
                <ul className="fl-list">
                  {card.features.map((f, i) => (
                    <li className="fl-item" key={i}>
                      <span className="fl-icon" aria-hidden="true">✓</span>
                      <FeatureText feature={f} />
                    </li>
                  ))}
                </ul>
                {card.ctaUrl ? (
                  <a
                    className="fl-btn fl-btn--primary"
                    href={card.ctaUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {card.cta}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
        <p className="fl-swipe-hint" aria-hidden="true">{swipeHint}</p>
      </section>

      <Separator label={isFr ? "En savoir plus sur les Programmes" : "Learn More about the Packs"} />

      {/* ═══ COMMITMENT ═══ */}
      <section className="fp-commitment">
        <h2 className="fp-commitment__heading">{c.commitment.heading}</h2>
        <p className="fp-commitment__subheading">{c.commitment.subheading}</p>
        {c.commitment.paragraphs.map((p, i) => (
          <p className="fp-commitment__body" key={i}>
            {p}
          </p>
        ))}
        {c.commitment.bullets && c.commitment.bullets.length > 0 ? (
          <ul className="fp-commitment__bullets">
            {c.commitment.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        ) : null}
      </section>

      {/* ═══ FEATURE SLIDER ═══ */}
      <section className="fp-section">
        <FeatureSlider slides={c.features.columns} />
      </section>

      <Separator />

      {/* ═══ WEEKLY SCHEDULE ═══ */}
      <section className="fp-section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="fp-section__illustration"
          loading="lazy"
          src={c.features.columns[0]?.image}
        />
        <h2 className="fp-section__heading">{c.schedule.heading}</h2>
        {c.schedule.subtitle ? (
          <p className="fp-section__subtitle">{c.schedule.subtitle}</p>
        ) : null}
        {c.features.columns[0] && (
          <p className="fp-section__subtitle">{c.features.columns[0].paragraphs[0]}</p>
        )}
        <div className="fp-schedule">
          {c.schedule.days.map((day) => (
            <div className="fp-schedule__day" key={day.day}>
              <h3 className="fp-schedule__day-name">{day.day}</h3>
              <div className="fp-schedule__entries">
                {day.entries.map((entry, i) => (
                  <div
                    className="fp-class-card"
                    key={i}
                    style={{ "--card-bg": entry.color || "rgba(0,55,56,0.55)" } as CSSProperties}
                  >
                    <div className="fp-class-card__meta">
                      <div className="fp-class-card__meta-left">
                        <span className="fp-class-card__time">{entry.time}</span>
                        <span className="fp-class-card__langs">
                          {entry.languages.map((lang) => (
                            <span className="fp-class-card__lang" key={lang}>
                              {lang}
                            </span>
                          ))}
                        </span>
                        {entry.level ? (
                          <span className="fp-class-card__level">{entry.level}</span>
                        ) : null}
                      </div>
                    </div>
                    <h4 className="fp-class-card__name">{entry.className}</h4>
                    <span className="fp-class-card__teacher">
                      w/ <strong>{entry.instructor}</strong>
                    </span>
                    {entry.description ? (
                      <details className="fp-class-details">
                        <summary className="fp-class-summary">
                          <span className="fp-class-summary__label">More</span>
                          <span className="fp-class-plus" />
                        </summary>
                        <div className="fp-class-desc">{entry.description}</div>
                      </details>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ═══ INDIVIDUAL SESSION ═══ */}
      <section className="fp-section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="fp-section__illustration"
          loading="lazy"
          src={c.features.columns[1]?.image}
        />
        <h2 className="fp-section__heading">{c.individualSession.heading}</h2>
        {c.individualSession.subtitle ? (
          <p className="fp-section__subtitle">{c.individualSession.subtitle}</p>
        ) : null}
        {c.features.columns[1] && (
          <p className="fp-section__subtitle">{c.features.columns[1].paragraphs[0]}</p>
        )}
        <p className="fp-section__subtitle">{c.individualSession.subheading}</p>
        <StrategyCarousel strategies={c.individualSession.strategies} />
      </section>

      <Separator />

      {/* ═══ PLATFORM ═══ */}
      <section className="fp-platform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="fp-section__illustration"
          loading="lazy"
          src={c.features.columns[2]?.image}
        />
        <h2 className="fp-platform__heading">{c.platform.heading}</h2>
        {c.features.columns[2] && (
          <p className="fp-platform__subtitle">{c.features.columns[2].paragraphs[0]}</p>
        )}
        <p className="fp-platform__subtitle">{c.platform.subtitle}</p>
        <div className="fp-platform__grid">
          {c.platform.features.map((f, idx) => (
            <div className="fp-platform__card" key={f.title}>
              <div className="fp-platform__icon">
                <IconSvg paths={ICON_PATHS[platformIcons[idx] || "grid"]} />
              </div>
              <h3 className="fp-platform__card-title">{f.title}</h3>
              <p className="fp-platform__card-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ═══ BENEFITS SUMMARY ═══ */}
      <section className="forest-panel fp-benefits">
        <h2 className="fp-section__heading">{c.benefits.heading}</h2>
        <div className="fp-benefits__overview">
          {c.benefits.overview.map((pack) => (
            <div className="fp-benefits__pack" key={pack.tier}>
              <h3 className="fp-benefits__pack-name">{pack.tier}</h3>
              <ul className="fp-benefits__pack-list">
                {pack.highlights.map((h, i) => (
                  <li key={i}>✓ {h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="fp-benefits__ctas">
          <a className="fl-btn fl-btn--primary" href={BOOKING_URLS.book} rel="noopener noreferrer" target="_blank">
            {c.benefits.cta}
          </a>
          <a className="fl-btn fl-btn--secondary" href={CONTACT_EMAIL}>
            {c.benefits.contactCta}
          </a>
        </div>
      </section>

      <Separator />

      {/* ═══ FAQ ═══ */}
      <section className="fp-section">
        <h2 className="fp-section__heading">{c.faq.heading}</h2>
        <div className="fp-faq">
          {c.faq.categories.map((cat) => (
            <div className="fp-faq__category" key={cat.category}>
              <h3 className="fp-faq__category-name">{cat.category}</h3>
              <div className="faq-list">
                {cat.items.map((item) => (
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
