import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getOfferLabels, resolveLocale } from "@/lib/i18n";
import type { OfferDetail } from "@/lib/types";
import {
  formatDateTime,
  getFacilitators,
  getOccurrences,
  getOfferBodyHtml,
  getOfferSubtitle,
  getOfferTitle,
  getPriceOptions,
  getPrimaryCta,
  getQuickFacts,
  getScheduleCards,
  getSections,
  getTags,
  getThemes,
  pickString,
} from "@/lib/offers";

import QuickFacts from "./QuickFacts";
import ScheduleCards from "./ScheduleCards";
import ThemesPills from "./ThemesPills";

type OfferTemplateBaseProps = {
  offer: OfferDetail;
  locale: string;
  typeLabel: string;
  showScheduleCards: boolean;
};

function normalizeText(value: unknown) {
  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return "";
}

export default function OfferTemplateBase({
  offer,
  locale,
  typeLabel,
  showScheduleCards,
}: OfferTemplateBaseProps) {
  const localeCode = resolveLocale(locale);
  const labels = getOfferLabels(localeCode);

  const title = getOfferTitle(offer);
  const subtitle = getOfferSubtitle(offer);
  const bodyHtml = getOfferBodyHtml(offer);
  const primaryCta = getPrimaryCta(offer);
  const quickFacts = getQuickFacts(offer);
  const scheduleCards = getScheduleCards(offer);
  const themes = getThemes(offer);
  const sections = getSections(offer);
  const occurrences = getOccurrences(offer);
  const priceOptions = getPriceOptions(offer);
  const facilitators = getFacilitators(offer);
  const tags = getTags(offer);

  return (
    <section className="page-section">
      <p className="offer-type-label">{typeLabel}</p>

      <section className="offer-hero">
        <h1>{title}</h1>
        {subtitle ? <p className="offer-subtitle">{subtitle}</p> : null}
        {primaryCta ? (
          <p>
            <a
              className={`button-link ${primaryCta.style ? `button-link--${primaryCta.style}` : ""}`.trim()}
              href={primaryCta.url}
              rel="noreferrer"
              target="_blank"
            >
              {primaryCta.label || `${labels.book} / En savoir plus`}
            </a>
          </p>
        ) : null}
        {bodyHtml ? <div className="rich-text" dangerouslySetInnerHTML={{ __html: bodyHtml }} /> : null}
      </section>

      <QuickFacts locale={localeCode} quickFacts={quickFacts} />

      {showScheduleCards ? <ScheduleCards cards={scheduleCards} locale={localeCode} /> : null}

      <ThemesPills locale={localeCode} themes={themes} />

      {sections.length > 0 ? <BlockRenderer blocks={sections} locale={localeCode} /> : null}

      {priceOptions.length > 0 ? (
        <section>
          <h2>{labels.pricing}</h2>
          <ul className="stack-list">
            {priceOptions.map((price, index) => {
              const label = pickString(price, ["label", "name", "title"], "Option");
              const amount = normalizeText(price.amount ?? price.price ?? price.value ?? price.formatted);
              const currency = normalizeText(price.currency ?? price.currency_code);
              const detail = [amount, currency].filter(Boolean).join(" ");

              return (
                <li key={`${label}-${index}`}>
                  {label}
                  {detail ? `: ${detail}` : ""}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {occurrences.length > 0 ? (
        <section>
          <h2>{labels.upcomingDates}</h2>
          <ul className="stack-list">
            {occurrences.map((occurrence, index) => {
              const start = formatDateTime(
                pickString(occurrence, ["start", "start_at", "datetime", "date"]),
                locale,
                pickString(occurrence, ["timezone", "tz", "time_zone"]),
              );
              const end = formatDateTime(
                pickString(occurrence, ["end", "end_at"]),
                locale,
                pickString(occurrence, ["timezone", "tz", "time_zone"]),
              );
              const line = [start, end].filter(Boolean).join(" -> ");

              return <li key={`${line || "occurrence"}-${index}`}>{line || "-"}</li>;
            })}
          </ul>
        </section>
      ) : null}

      {facilitators.length > 0 ? (
        <section>
          <h2>{labels.facilitators}</h2>
          <ul className="stack-list">
            {facilitators.map((facilitator, index) => {
              const name = pickString(facilitator, ["name", "full_name", "title"], "Facilitator");
              return <li key={`${name}-${index}`}>{name}</li>;
            })}
          </ul>
        </section>
      ) : null}

      {tags.length > 0 ? (
        <section>
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
