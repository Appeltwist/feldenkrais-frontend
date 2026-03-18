import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getForestBookingUrl } from "@/lib/forest-booking";
import { getOfferLabels, resolveLocale } from "@/lib/i18n";
import type { OfferDetail } from "@/lib/types";
import {
  getBookingOptions,
  formatDateTime,
  getFacilitators,
  getCanonicalUrl,
  getFaqItems,
  getMediaUrl,
  getOfferSlug,
  getOccurrences,
  getOfferBodyHtml,
  getOfferType,
  getOfferSubtitle,
  getOfferTitle,
  getPriceOptions,
  getPrimaryCta,
  getQuickFacts,
  getDomains,
  getScheduleCards,
  getSections,
  getTags,
  getThemes,
  isTrialEligible,
  pickString,
} from "@/lib/offers";

import OfferActionBar from "./OfferActionBar";
import LeadMagnetDownload from "./LeadMagnetDownload";
import OfferMobileCtaSync from "./OfferMobileCtaSync";
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
  const rawPrimaryCta = getPrimaryCta(offer);
  const bookingOverride = getForestBookingUrl(offer);
  const primaryCta = bookingOverride
    ? { url: bookingOverride, label: rawPrimaryCta?.label ?? "", style: rawPrimaryCta?.style ?? null }
    : rawPrimaryCta;
  const quickFacts = getQuickFacts(offer);
  const scheduleCards = getScheduleCards(offer);
  const themes = getThemes(offer);
  const domains = getDomains(offer);
  const domainNames = domains
    .map((domain) => (domain && typeof domain.name === "string" ? domain.name : ""))
    .filter(Boolean);
  const sections = getSections(offer);
  const occurrences = getOccurrences(offer);
  const bookingOptions = getBookingOptions(offer);
  const priceOptions = getPriceOptions(offer);
  const facilitators = getFacilitators(offer);
  const tags = getTags(offer);
  const canonicalUrl = getCanonicalUrl(offer);
  const offerSlug = getOfferSlug(offer);
  const mediaUrl = getMediaUrl(offer);
  const faqItems = getFaqItems(offer);
  const offerType = getOfferType(offer);
  const trialEligible = isTrialEligible(offer);
  const primaryOccurrence = (occurrences[0] ?? null) as Record<string, unknown> | null;
  const primaryIcsUrl = pickString(primaryOccurrence, ["ics_url", "icsUrl"]);
  const isPracticeContext = offerType === "CLASS" || offerType === "PRIVATE_SESSION";
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
  const mobileBookingCta = hasMultipleBookingOptions
    ? {
        href: "#offer-pricing",
        label: labels.chooseDatesPricing,
      }
    : bookingOptions.length === 1
    ? (() => {
        const bookingUrl = pickString(bookingOptions[0], ["booking_url", "bookingUrl"]);
        if (!bookingUrl) {
          return primaryCta?.url
            ? {
                href: primaryCta.url,
                label: primaryCta.label || labels.book,
              }
            : null;
        }

        return {
          href: bookingUrl,
          label: primaryCta?.label || labels.book,
        };
      })()
    : primaryCta?.url
    ? {
        href: primaryCta.url,
        label: primaryCta.label || labels.book,
      }
    : null;

  return (
    <section className="page-section">
      <OfferMobileCtaSync cta={mobileBookingCta} />
      <p className="offer-type-label">{typeLabel}</p>
      {domainNames.length > 0 ? <p className="offer-domain-label">{domainNames.join(" · ")}</p> : null}

      <section className="offer-hero">
        <h1>{title}</h1>
        {subtitle ? <p className="offer-subtitle">{subtitle}</p> : null}
        {heroCta ? (
          <p>
            <a
              className={`button-link ${heroCta.style ? `button-link--${heroCta.style}` : ""}`.trim()}
              href={heroCta.url}
              rel={heroCta.url.startsWith("http") ? "noreferrer" : undefined}
              target={heroCta.url.startsWith("http") ? "_blank" : undefined}
            >
              {heroCta.label || `${labels.book} / En savoir plus`}
            </a>
          </p>
        ) : null}
        {bodyHtml ? <div className="rich-text" dangerouslySetInnerHTML={{ __html: bodyHtml }} /> : null}
      </section>

      <OfferActionBar canonicalUrl={canonicalUrl} icsUrl={primaryIcsUrl} title={title} />

      {offerSlug ? <LeadMagnetDownload locale={localeCode} offerSlug={offerSlug} offerType={offerType} /> : null}

      {trialEligible && isPracticeContext ? (
        <section className="offer-trial-banner">
          <p>{localeCode === "fr" ? "Essai gratuit disponible pour ce cours." : "Free trial available for this class."}</p>
          <p>
            <a className="text-link" href={primaryCta?.url || canonicalUrl || "/contact"}>
              {localeCode === "fr" ? "Essayer un cours gratuit" : "Try a free class"}
            </a>
          </p>
        </section>
      ) : null}

      <QuickFacts locale={localeCode} quickFacts={quickFacts} />

      {showScheduleCards ? <ScheduleCards cards={scheduleCards} locale={localeCode} /> : null}

      <ThemesPills locale={localeCode} themes={themes} />

      {sections.length > 0 ? <BlockRenderer blocks={sections} locale={localeCode} /> : null}

      {faqItems.length > 0 ? (
        <section>
          <h2>{localeCode === "fr" ? "FAQ" : "FAQ"}</h2>
          <ul className="stack-list">
            {faqItems.map((item, index) => (
              <li key={`${item.question}-${index}`}>
                <strong>{item.question}</strong>
                <p>{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(bookingOptions.length > 0 || priceOptions.length > 0) ? (
        <section id="offer-pricing">
          <h2>{labels.pricing}</h2>
          <ul className="stack-list">
            {bookingOptions.length > 0 ? bookingOptions.map((option, index) => {
              const label = pickString(option, ["label", "name", "title"], "Option");
              const amount = normalizeText(option.amount ?? option.price ?? option.value ?? option.formatted);
              const currency = normalizeText(option.currency ?? option.currency_code);
              const detail = [amount, currency].filter(Boolean).join(" ");
              const summary = pickString(option, ["summary"]);
              const dateSummary = pickString(option, ["date_summary", "dateSummary"]);
              const bookingUrl = pickString(option, ["booking_url", "bookingUrl"]);

              return (
                <li key={`${label}-${index}`}>
                  <p>
                    <strong>{label}</strong>
                    {detail ? `: ${detail}` : ""}
                  </p>
                  {summary ? <p>{summary}</p> : null}
                  {dateSummary ? <p>{dateSummary}</p> : null}
                  {bookingUrl ? (
                    <div className="link-row">
                      <a className="button-link" href={bookingUrl} rel="noreferrer" target="_blank">
                        {labels.book}
                      </a>
                    </div>
                  ) : null}
                </li>
              );
            }) : priceOptions.map((price, index) => {
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
                pickString(occurrence, ["start_datetime", "start", "start_at", "datetime", "date"]),
                locale,
                pickString(occurrence, ["timezone", "tz", "time_zone"]),
              );
              const end = formatDateTime(
                pickString(occurrence, ["end_datetime", "end", "end_at"]),
                locale,
                pickString(occurrence, ["timezone", "tz", "time_zone"]),
              );
              const line = [start, end].filter(Boolean).join(" - ");
              const label = pickString(occurrence, ["label"]);
              const bookingUrl = pickString(occurrence, ["booking_url", "bookingUrl"]);
              const icsUrl = pickString(occurrence, ["ics_url", "icsUrl"]);

              return (
                <li key={`${line || "occurrence"}-${index}`}>
                  <p>{label || line || "-"}</p>
                  {label ? <p>{line || "-"}</p> : null}
                  <div className="link-row">
                    {bookingUrl && bookingOptions.length === 0 ? (
                      <a className="button-link" href={bookingUrl} rel="noreferrer" target="_blank">
                        {labels.book}
                      </a>
                    ) : null}
                    {icsUrl ? (
                      <a className="text-link" href={icsUrl}>
                        Add to calendar
                      </a>
                    ) : null}
                  </div>
                </li>
              );
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
