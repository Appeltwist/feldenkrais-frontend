import Link from "next/link";

import { ForestPageShell } from "@/components/forest/ForestPageShell";
import {
  fetchCalendar,
  fetchOffers,
  fetchSiteConfig,
  type CalendarItem,
  type OfferSummary,
} from "@/lib/api";
import { cleanDisplayText } from "@/lib/content-cleanup";
import { getForestExcerptOverride, getForestImageOverride } from "@/lib/forest-excerpts";
import { getForestFacilitatorNamesOverride } from "@/lib/forest-facilitator-overrides";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getOfferLabels as getLocalizedOfferLabels, resolveLocale } from "@/lib/i18n";
import { localizePath } from "@/lib/locale-path";
import {
  asRecord,
  getCanonicalOfferPath,
  getDisplayScheduleEntries,
  getFacilitatorImageUrl,
  getFacilitatorName,
  getFacilitators,
  getFutureDisplayScheduleEntries,
  getNextUpcomingOccurrenceRecord,
  getOccurrenceFacilitator,
  getOfferSlug,
  getOfferTitle,
  getOfferType,
  getOfferTypeVariant,
  pickString,
  readNextOccurrence,
  type OfferType,
  type RawRecord,
} from "@/lib/offers";
import type { OfferDetail } from "@/lib/types";

/* ── types ── */

type CollectionPageConfig = {
  /** Offer types to fetch from the API */
  offerTypes: OfferType[];
  /** Heading fallback if site config is unavailable */
  fallbackHeading: string;
};

type ForestOfferCollectionPageProps = {
  config: CollectionPageConfig;
};

/* ── localised copy ── */

type CollectionCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  sectionTitle: string;
  emptyTitle: string;
  emptyBody: string;
  unavailableTitle: string;
  unavailableBody: string;
  newsletterTitle: string;
  newsletterBody: string;
  newsletterPlaceholder: string;
  newsletterCta: string;
  contactLabel: string;
  viewLabel: string;
  nextDateLabel: string;
  datesComingSoonLabel: string;
  facilitatedByLabel: string;
};

const CLASS_CALENDAR_HORIZON_DAYS = 120;

const TYPE_LABELS: Record<OfferType, { fr: string; en: string }> = {
  WORKSHOP: { fr: "Atelier", en: "Workshop" },
  CLASS: { fr: "Cours", en: "Class" },
  PRIVATE_SESSION: { fr: "Séance individuelle", en: "Individual session" },
  TRAINING_INFO: { fr: "Formation", en: "Training" },
};

/** CTA label per offer type */
function getOfferCTA(offerType: string, locale: string): string {
  const fr = locale.toLowerCase().startsWith("fr");
  switch (offerType) {
    case "TRAINING_INFO":    return fr ? "Postuler"   : "Apply";
    case "WORKSHOP":         return fr ? "Participer" : "Join";
    case "CLASS":            return fr ? "Réserver"   : "Book";
    case "PRIVATE_SESSION":  return fr ? "Commencer"  : "Start";
    default:                 return fr ? "Réserver"   : "Book";
  }
}

function getCopy(
  offerTypes: OfferType[],
  locale: string,
): CollectionCopy {
  const fr = locale.toLowerCase().startsWith("fr");
  const primary = offerTypes[0];

  if (primary === "PRIVATE_SESSION") {
    return {
      eyebrow: fr ? "Accompagnement individuel" : "One-to-one guidance",
      title: fr ? "Séances individuelles" : "Individual Sessions",
      subtitle: fr
        ? "Des séances personnalisées pour explorer, approfondir, ou trouver un chemin de travail qui vous correspond."
        : "Personalized sessions to explore, deepen your practice, or find a path of work that resonates with you.",
      sectionTitle: fr ? "Nos séances" : "Our sessions",
      emptyTitle: fr ? "Bientôt disponible" : "Coming soon",
      emptyBody: fr
        ? "Les séances individuelles seront publiées ici prochainement."
        : "Individual sessions will be published here soon.",
      unavailableTitle: fr ? "Chargement indisponible" : "Unable to load right now",
      unavailableBody: fr
        ? "Les séances individuelles n'ont pas pu être chargées pour le moment. Réessayez dans un instant."
        : "Individual sessions could not be loaded right now. Please try again in a moment.",
      newsletterTitle: fr ? "Rester informé·e" : "Stay in the loop",
      newsletterBody: fr
        ? "Recevez les nouvelles ouvertures et temps forts de Forest Lighthouse."
        : "Receive new openings and key updates from Forest Lighthouse.",
      newsletterPlaceholder: fr ? "Votre e-mail" : "Your email",
      newsletterCta: fr ? "S'abonner" : "Subscribe",
      contactLabel: fr ? "Nous écrire" : "Contact us",
      viewLabel: fr ? "Voir la page" : "View page",

      nextDateLabel: fr ? "Prochaine date" : "Next date",
      datesComingSoonLabel: fr ? "Dates à venir" : "Dates coming soon",
      facilitatedByLabel: fr ? "avec" : "with",
    };
  }

  if (primary === "CLASS") {
    return {
      eyebrow: fr ? "Pratique hebdomadaire" : "Weekly practice",
      title: fr ? "Cours réguliers" : "Regular Classes",
      subtitle: fr
        ? "Intégrez le mouvement dans votre quotidien avec nos cours hebdomadaires, ouverts à toutes et tous."
        : "Integrate movement into your daily life with our weekly classes, open to all levels.",
      sectionTitle: fr ? "Les cours" : "Our classes",
      emptyTitle: fr ? "Bientôt disponible" : "Coming soon",
      emptyBody: fr
        ? "Les cours réguliers seront publiés ici prochainement."
        : "Regular classes will be published here soon.",
      unavailableTitle: fr ? "Chargement indisponible" : "Unable to load right now",
      unavailableBody: fr
        ? "Les cours n'ont pas pu être chargés pour le moment. Réessayez dans un instant."
        : "Classes could not be loaded right now. Please try again in a moment.",
      newsletterTitle: fr ? "Rester informé·e" : "Stay in the loop",
      newsletterBody: fr
        ? "Recevez les nouvelles ouvertures et temps forts de Forest Lighthouse."
        : "Receive new openings and key updates from Forest Lighthouse.",
      newsletterPlaceholder: fr ? "Votre e-mail" : "Your email",
      newsletterCta: fr ? "S'abonner" : "Subscribe",
      contactLabel: fr ? "Nous écrire" : "Contact us",
      viewLabel: fr ? "Voir la page" : "View page",

      nextDateLabel: fr ? "Prochaine date" : "Next date",
      datesComingSoonLabel: fr ? "Dates à venir" : "Dates coming soon",
      facilitatedByLabel: fr ? "avec" : "with",
    };
  }

  // WORKSHOP (+ TRAINING_INFO)
  const includesTrainings = offerTypes.includes("TRAINING_INFO");
  return {
    eyebrow: fr ? "À l'affiche" : "What's on",
    title: fr
      ? (includesTrainings ? "Ateliers & Formations" : "Ateliers")
      : (includesTrainings ? "Workshops & Trainings" : "Workshops"),
    subtitle: fr
      ? "Ateliers immersifs, formats spéciaux et parcours de fond à Forest Lighthouse."
      : "Immersive workshops, special formats, and long-form pathways at Forest Lighthouse.",
    sectionTitle: fr
      ? (includesTrainings ? "Explorer les offres" : "Explorer les ateliers")
      : (includesTrainings ? "Explore offers" : "Explore workshops"),
    emptyTitle: fr ? "Bientôt à l'affiche" : "Coming soon",
    emptyBody: fr
      ? "Les prochains ateliers seront annoncés ici. Abonnez-vous pour être prévenu·e."
      : "Upcoming workshops will be announced here. Subscribe to stay in the loop.",
    unavailableTitle: fr ? "Chargement indisponible" : "Unable to load right now",
    unavailableBody: fr
      ? "Les offres n'ont pas pu être chargées pour le moment. Réessayez dans un instant."
      : "Offers could not be loaded right now. Please try again in a moment.",
    newsletterTitle: fr ? "Rester informé·e" : "Stay in the loop",
    newsletterBody: fr
      ? "Recevez les nouvelles ouvertures et temps forts de Forest Lighthouse."
      : "Receive new openings and key updates from Forest Lighthouse.",
    newsletterPlaceholder: fr ? "Votre e-mail" : "Your email",
    newsletterCta: fr ? "S'abonner" : "Subscribe",
    contactLabel: fr ? "Nous écrire" : "Contact us",
    viewLabel: fr ? "Voir la page" : "View page",
    nextDateLabel: fr ? "Prochaine date" : "Next date",
    datesComingSoonLabel: fr ? "Dates à venir" : "Dates coming soon",
    facilitatedByLabel: fr ? "avec" : "with",
  };
}

function formatFacilitatorNames(names: readonly string[]) {
  const cleaned = names.map((name) => cleanDisplayText(name)).filter(Boolean);
  if (cleaned.length === 0) {
    return "";
  }
  if (cleaned.length === 1) {
    return cleaned[0];
  }
  if (cleaned.length === 2) {
    return `${cleaned[0]} & ${cleaned[1]}`;
  }
  return `${cleaned.slice(0, -1).join(", ")} & ${cleaned[cleaned.length - 1]}`;
}

/* ── date helpers ── */

type FormattedOccurrence = { date: string; timeRange: string };

function toIsoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function getOccurrenceEntries(offer: unknown, mode: "all" | "future" = "future"): RawRecord[] {
  return mode === "future"
    ? getFutureDisplayScheduleEntries(offer as OfferDetail)
    : getDisplayScheduleEntries(offer as OfferDetail);
}

/** Format a single occurrence into { date, timeRange } */
function formatOccurrence(
  occ: RawRecord,
  locale: string,
  timezone?: string,
): FormattedOccurrence | null {
  const startStr = pickString(occ, ["start_datetime", "start", "start_at", "datetime", "date"]);
  if (!startStr) return null;

  const start = new Date(startStr);
  if (Number.isNaN(start.getTime())) return null;

  const dateOpts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  if (timezone) {
    dateOpts.timeZone = timezone;
    timeOpts.timeZone = timezone;
  }

  const datePart = new Intl.DateTimeFormat(locale || "en", dateOpts).format(start);
  const startTime = new Intl.DateTimeFormat(locale || "en", timeOpts).format(start);

  const endStr = pickString(occ, ["end_datetime", "end", "end_at"]);
  let timeRange = startTime;
  if (endStr) {
    const end = new Date(endStr);
    if (!Number.isNaN(end.getTime())) {
      const endTime = new Intl.DateTimeFormat(locale || "en", timeOpts).format(end);
      timeRange = `${startTime} – ${endTime}`;
    }
  }

  return { date: datePart, timeRange };
}

/** Resolve a single occurrence from the offer (next_occurrence fallback) */
function resolveOneOccurrenceEntry(offer: unknown): RawRecord | null {
  return getNextUpcomingOccurrenceRecord(offer as OfferDetail);
}

function resolveOneOccurrence(offer: unknown, locale: string): FormattedOccurrence | null {
  const nextOcc = resolveOneOccurrenceEntry(offer);
  if (!nextOcc) return null;
  const tz = pickString(nextOcc, ["timezone", "tz", "time_zone"]);
  return formatOccurrence(nextOcc, locale, tz);
}

/** Resolve all occurrences from the offer */
function resolveAllOccurrences(offer: unknown, locale: string): FormattedOccurrence[] {
  const futureOccs = getOccurrenceEntries(offer, "future");
  if (futureOccs.length === 0) {
    return [];
  }

  const tz = pickString(futureOccs[0], ["timezone", "tz", "time_zone"]);
  const formatted: FormattedOccurrence[] = [];
  for (const occ of futureOccs) {
    const result = formatOccurrence(occ, locale, tz);
    if (result) {
      formatted.push(result);
    }
  }
  return formatted;
}

function getLocalizedDateParts(dateStr: string, locale: string, timezone?: string) {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat(locale || "en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(timezone ? { timeZone: timezone } : {}),
  });
  const parts = formatter.formatToParts(parsed).reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  if (!parts.day || !parts.month || !parts.year) {
    return null;
  }

  return {
    day: parts.day,
    month: parts.month,
    year: parts.year,
  };
}

function formatTrainingPeriodLabel(occ: RawRecord, locale: string) {
  const timezone = pickString(occ, ["timezone", "tz", "time_zone"]);
  const startStr = pickString(occ, ["start_datetime", "start", "start_at", "datetime", "date"]);
  const endStr = pickString(occ, ["end_datetime", "end", "end_at"]);
  const start = startStr ? getLocalizedDateParts(startStr, locale, timezone) : null;
  const end = endStr ? getLocalizedDateParts(endStr, locale, timezone) : null;

  if (!start && !end) {
    return null;
  }

  if (start && (!end || (start.day === end.day && start.month === end.month && start.year === end.year))) {
    return `${start.day} ${start.month} ${start.year}`;
  }

  if (!start && end) {
    return `${end.day} ${end.month} ${end.year}`;
  }

  if (!start || !end) {
    return null;
  }

  if (start.year === end.year && start.month === end.month) {
    return `${start.day}-${end.day} ${start.month} ${start.year}`;
  }

  if (start.year === end.year) {
    return `${start.day} ${start.month} - ${end.day} ${end.month} ${start.year}`;
  }

  return `${start.day} ${start.month} ${start.year} - ${end.day} ${end.month} ${end.year}`;
}

/** For TRAINING_INFO: list each training period with its year */
function resolveTrainingPeriodLabels(offer: unknown, locale: string): string[] {
  const futureOccs = getOccurrenceEntries(offer, "future");
  const labels: string[] = [];
  const seen = new Set<string>();

  for (const occ of futureOccs) {
    const label = formatTrainingPeriodLabel(occ, locale);
    if (!label || seen.has(label)) {
      continue;
    }
    seen.add(label);
    labels.push(label);
  }

  return labels;
}

function resolveWorkshopDateLabels(offer: unknown, locale: string): string[] {
  const occurrences = resolveAllOccurrences(offer, locale);
  if (occurrences.length === 0) {
    return [];
  }

  const seen = new Set<string>();
  const labels: string[] = [];
  for (const occurrence of occurrences) {
    if (!occurrence.date || seen.has(occurrence.date)) {
      continue;
    }
    seen.add(occurrence.date);
    labels.push(occurrence.date);
  }

  return labels;
}

function renderComingSoonDates(label: string) {
  return (
    <div className="fc-offer-card__date-cluster">
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
      </svg>
      <div className="fc-offer-card__date-status">
        <div className="fc-offer-card__date-pills">
          <span className="fc-offer-card__date-pill fc-offer-card__date-pill--pending">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

function renderNoUpcomingDates(label: string, contactHref: string, contactLabel: string) {
  return (
    <div className="fc-offer-card__date-cluster">
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
      </svg>
      <div className="fc-offer-card__date-status">
        <div className="fc-offer-card__date-pills">
          <span className="fc-offer-card__date-pill fc-offer-card__date-pill--expired">
            {label}
          </span>
        </div>
        <Link className="fc-offer-card__date-link" href={contactHref}>
          {contactLabel}
        </Link>
      </div>
    </div>
  );
}

/* ── component ── */

export default async function ForestOfferCollectionPage({
  config,
}: ForestOfferCollectionPageProps) {
  const hostname = await getHostname();

  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>{config.fallbackHeading}</h1>
        <p>Unable to load offers right now.</p>
      </section>
    );
  }

  const requestLocale = await getRequestLocale(siteConfig.defaultLocale);
  const localeCode = resolveLocale(requestLocale);
  const copy = getCopy(config.offerTypes, requestLocale);
  const offerLabels = getLocalizedOfferLabels(requestLocale);
  const contactHref = localizePath(requestLocale, "/contact");

  /* Fetch all offer types in parallel */
  const offerResults = await Promise.allSettled(
    config.offerTypes.map((type) =>
      fetchOffers({
        hostname,
        center: siteConfig.centerSlug,
        type,
        locale: requestLocale,
      }),
    ),
  );
  const offerLoadFailed = offerResults.some((result) => result.status === "rejected");
  const offers = offerResults.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  /* Classes use flat occurrences so cards can preview the real next session teacher.
     Workshops/trainings stay on the grouped offer feed. */
  const today = new Date();
  const horizon = new Date(today);
  const fetchesClassesOnly =
    config.offerTypes.length === 1 && config.offerTypes[0] === "CLASS";
  horizon.setDate(today.getDate() + (fetchesClassesOnly ? CLASS_CALENDAR_HORIZON_DAYS : 365));
  const from = toIsoDate(today);
  const to = toIsoDate(horizon);
  const calendarItems = await fetchCalendar({
    hostname,
    center: siteConfig.centerSlug,
    locale: requestLocale,
    from,
    to,
    groupBy: fetchesClassesOnly ? undefined : "offer",
  }).catch(() => [] as CalendarItem[]);

  /* Build slug → occurrences map */
  const occurrencesBySlug = new Map<string, unknown[]>();
  for (const item of calendarItems) {
    const rec = asRecord(item);
    const offerRec = asRecord(rec?.offer);
    const slug = pickString(offerRec, ["slug"]);
    if (!slug) {
      continue;
    }

    if (fetchesClassesOnly) {
      const existing = occurrencesBySlug.get(slug) ?? [];
      occurrencesBySlug.set(slug, [...existing, rec]);
      continue;
    }

    const occs = rec?.next_occurrences;
    if (Array.isArray(occs)) {
      occurrencesBySlug.set(slug, occs);
    }
  }

  /* Merge occurrences into offer summaries so getOccurrences() finds them */
  const enriched = offers.map((offer) => {
    const slug = getOfferSlug(offer);
    const occs = slug ? occurrencesBySlug.get(slug) : undefined;
    if (occs) {
      return { ...offer, next_occurrences: occs } as OfferSummary;
    }
    return offer;
  });

  /* Sort: offers with images first, then by next occurrence date */
  const sorted = [...enriched].sort((a, b) => {
    const aImg = Boolean(
      pickString(asRecord(a), ["hero_image_url", "heroImageUrl"])
        || getFacilitatorImageUrl(getFacilitators(a as OfferDetail)[0] ?? {}),
    );
    const bImg = Boolean(
      pickString(asRecord(b), ["hero_image_url", "heroImageUrl"])
        || getFacilitatorImageUrl(getFacilitators(b as OfferDetail)[0] ?? {}),
    );
    if (aImg !== bImg) return aImg ? -1 : 1;

    const aDate = readNextOccurrence(a).start;
    const bDate = readNextOccurrence(b).start;
    if (aDate && bDate) return aDate.localeCompare(bDate);
    if (aDate && !bDate) return -1;
    if (!aDate && bDate) return 1;
    return 0;
  });

  const offerCountLabel = localeCode === "fr"
    ? `${sorted.length} offre${sorted.length > 1 ? "s" : ""} publiée${sorted.length > 1 ? "s" : ""}`
    : `${sorted.length} published ${sorted.length === 1 ? "offer" : "offers"}`;

  return (
    <ForestPageShell>
      <div className="forest-collection-page" id="collection-motion">
        {/* ── PAGE INTRO ── */}
        <section className="fc-intro">
          <p className="fc-intro__eyebrow">{copy.eyebrow}</p>
          <h1 className="fc-intro__title">{copy.title}</h1>
          <p className="fc-intro__subtitle">{copy.subtitle}</p>
        </section>

        {/* ── OFFER GRID ── */}
        {sorted.length === 0 ? (
          <section className="fc-empty forest-panel">
            <div className="fc-empty__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8M12 8v8" />
              </svg>
            </div>
            <h2>{offerLoadFailed ? copy.unavailableTitle : copy.emptyTitle}</h2>
            <p>{offerLoadFailed ? copy.unavailableBody : copy.emptyBody}</p>
            <Link className="fl-btn fl-btn--secondary" href={localizePath(requestLocale, "/contact")}>
              {copy.contactLabel}
            </Link>
          </section>
        ) : (
          <section className="fc-grid-section">
            <div className="fc-grid-header">
              <div>
                <p className="fc-grid-header__eyebrow">{siteConfig.center.name}</p>
                <h2 className="fc-grid-header__title">{copy.sectionTitle}</h2>
              </div>
              <p className="fc-grid-header__count">{offerCountLabel}</p>
            </div>

            <div className="fc-offer-grid">
              {sorted.map((offer, index) => {
                const offerRecord = asRecord(offer);
                const slug = getOfferSlug(offer);
                const title = getOfferTitle(offer, "Untitled");
                const offerType = getOfferType(offer);
                const canonicalPath = getCanonicalOfferPath(offer);
                const detailsPath = localizePath(requestLocale, canonicalPath || `/workshops/${slug}`);
                const rawExcerpt = pickString(offerRecord, ["excerpt", "summary", "short_description"]);
                const strippedExcerpt = rawExcerpt ? cleanDisplayText(rawExcerpt.replace(/<[^>]*>/g, "").trim()) : "";
                const apiExcerpt = strippedExcerpt && !strippedExcerpt.includes("Guest name cannot be repeated") ? strippedExcerpt : "";
                const overrideExcerpt = getForestExcerptOverride(title) || "";
                const excerpt = apiExcerpt && !/(?:\.{3}|…)$/.test(apiExcerpt) ? apiExcerpt : overrideExcerpt || apiExcerpt;
                const heroImage = pickString(offerRecord, ["hero_image_url", "heroImageUrl"]);
                const facilitators = getFacilitators(offer as OfferDetail);
                const firstFacilitator = facilitators[0];
                const facilitatorOverride = getForestFacilitatorNamesOverride(slug);
                const facilitatorNames = formatFacilitatorNames(
                  facilitators.map((facilitator) => getFacilitatorName(facilitator, "")).filter(Boolean),
                );
                const primaryOccurrence = resolveOneOccurrenceEntry(offer);
                const occurrenceFacilitator =
                  offerType === "CLASS" && primaryOccurrence
                    ? getOccurrenceFacilitator(primaryOccurrence)
                    : null;
                const facilitatorAvatars = occurrenceFacilitator
                  ? [
                      {
                        name: occurrenceFacilitator.display_name,
                        imageUrl: occurrenceFacilitator.photo_url || "",
                      },
                    ]
                  : facilitatorOverride
                    ? facilitatorOverride.slice(0, 2).map((name) => ({
                        name,
                        imageUrl: "",
                      }))
                    : facilitators
                        .map((facilitator) => ({
                          name: getFacilitatorName(facilitator, ""),
                          imageUrl: getFacilitatorImageUrl(facilitator),
                        }))
                        .filter((facilitator) => facilitator.name)
                        .slice(0, 2);
                const facilitatorName = occurrenceFacilitator?.display_name
                  || (facilitatorOverride ? formatFacilitatorNames(facilitatorOverride) : "")
                  || facilitatorNames;
                const facilitatorImage = occurrenceFacilitator?.photo_url
                  || (facilitatorOverride ? "" : firstFacilitator ? getFacilitatorImageUrl(firstFacilitator) : "");
                const cardImage = getForestImageOverride(title) || heroImage || facilitatorImage;
                const offerTypeVariant = getOfferTypeVariant(offerType);
                const typeLabel = TYPE_LABELS[offerType]?.[localeCode] ?? TYPE_LABELS.WORKSHOP[localeCode];
                const isClassCard = offerType === "CLASS";
                const isPrivateSessionCard = offerType === "PRIVATE_SESSION";
                const isSplitActionCard = isClassCard || isPrivateSessionCard;
                const bookingPath = isPrivateSessionCard && slug
                  ? localizePath(requestLocale, `/private-sessions/${slug}/book`)
                  : isClassCard && primaryOccurrence
                    ? pickString(primaryOccurrence, ["booking_url", "bookingUrl"])
                    : "";
                const cardDateSource = offer;
                const allDateEntries = getOccurrenceEntries(cardDateSource, "all");
                const futureDateEntries = getOccurrenceEntries(cardDateSource, "future");
                const hasPastOnlyDates =
                  (offerType === "WORKSHOP" || offerType === "TRAINING_INFO") &&
                  allDateEntries.length > 0 &&
                  futureDateEntries.length === 0;

                /* Domains for tag pills */
                const rawDomains = Array.isArray(offerRecord?.domains)
                  ? (offerRecord.domains as Array<{ name?: string; slug?: string }>)
                  : [];
                const domainNames = rawDomains
                  .map((d) => d.name ?? "")
                  .filter(Boolean)
                  .slice(0, 4);

                const cardInner = (
                  <>
                    {/* Card image */}
                    {isSplitActionCard ? (
                      <Link className="fc-offer-card__media-link" href={detailsPath}>
                        <div className="fc-offer-card__media">
                          {cardImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              alt={title}
                              className="fc-offer-card__img"
                              loading={index < 4 ? "eager" : "lazy"}
                              src={cardImage}
                            />
                          ) : (
                            <div className="fc-offer-card__img-placeholder" aria-hidden="true">
                              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                              </svg>
                            </div>
                          )}
                          <span className={`fc-offer-card__type-badge fc-offer-card__type-badge--${offerTypeVariant}`}>{typeLabel}</span>
                        </div>
                      </Link>
                    ) : (
                      <div className="fc-offer-card__media">
                        {cardImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt={title}
                            className="fc-offer-card__img"
                            loading={index < 4 ? "eager" : "lazy"}
                            src={cardImage}
                          />
                        ) : (
                          <div className="fc-offer-card__img-placeholder" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                            </svg>
                          </div>
                        )}
                        <span className={`fc-offer-card__type-badge fc-offer-card__type-badge--${offerTypeVariant}`}>{typeLabel}</span>
                      </div>
                    )}

                    {/* Card body */}
                    <div className="fc-offer-card__body">
                      {isSplitActionCard ? (
                        <h3 className="fc-offer-card__title">
                          <Link className="fc-offer-card__title-link" href={detailsPath}>
                            {title}
                          </Link>
                        </h3>
                      ) : (
                        <h3 className="fc-offer-card__title">{title}</h3>
                      )}
                      {excerpt ? (
                        <p className="fc-offer-card__excerpt">{excerpt}</p>
                      ) : null}

                      {/* Meta: facilitator + dates */}
                      <div className="fc-offer-card__meta">
                        {facilitatorName ? (
                          <div className="fc-offer-card__facilitator">
                            <div className="fc-offer-card__facilitator-avatars" aria-hidden="true">
                              {facilitatorAvatars.length > 0 ? (
                                facilitatorAvatars.map((facilitator, avatarIndex) =>
                                  facilitator.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      alt=""
                                      className="fc-offer-card__facilitator-avatar"
                                      key={`${facilitator.name}-${avatarIndex}`}
                                      loading="lazy"
                                      src={facilitator.imageUrl}
                                    />
                                  ) : (
                                    <div
                                      className="fc-offer-card__facilitator-avatar fc-offer-card__facilitator-avatar--placeholder"
                                      key={`${facilitator.name}-${avatarIndex}`}
                                    >
                                      {(facilitator.name || facilitatorName).charAt(0).toUpperCase()}
                                    </div>
                                  ),
                                )
                              ) : facilitatorImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  alt=""
                                  className="fc-offer-card__facilitator-avatar"
                                  loading="lazy"
                                  src={facilitatorImage}
                                />
                              ) : (
                                <div className="fc-offer-card__facilitator-avatar fc-offer-card__facilitator-avatar--placeholder">
                                  {facilitatorName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <span>{copy.facilitatedByLabel} {facilitatorName}</span>
                          </div>
                        ) : null}

                        {/* Dates — varies by offer type */}
                        {(() => {
                          /* CLASS → "Next: Mar 21, 10:00 AM – 11:15 AM" */
                          if (offerType === "CLASS") {
                            const next = resolveOneOccurrence(offer, requestLocale);
                            if (!next) return null;
                            return (
                              <div className="fc-offer-card__date-row">
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
                                </svg>
                                <span className="fc-offer-card__date-label">
                                  {copy.nextDateLabel}:
                                </span>
                                <span className="fc-offer-card__date-time">
                                  {next.date}, {next.timeRange}
                                </span>
                              </div>
                            );
                          }

                          /* TRAINING_INFO → one pill per period, with year */
                          if (offerType === "TRAINING_INFO") {
                            const trainingPeriods = resolveTrainingPeriodLabels(cardDateSource, requestLocale);
                            if (trainingPeriods.length === 0) {
                              if (hasPastOnlyDates) {
                                return renderNoUpcomingDates(
                                  offerLabels.noOccurrences,
                                  contactHref,
                                  copy.contactLabel,
                                );
                              }
                              return renderComingSoonDates(copy.datesComingSoonLabel);
                            }
                            return (
                              <div className="fc-offer-card__date-cluster">
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
                                </svg>
                                <div className="fc-offer-card__date-pills">
                                  {trainingPeriods.map((periodLabel) => (
                                    <span className="fc-offer-card__date-pill" key={periodLabel}>
                                      {periodLabel}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          }

                          /* WORKSHOP → list all dates */
                          if (offerType === "PRIVATE_SESSION") return null;
                          const workshopDates = resolveWorkshopDateLabels(cardDateSource, requestLocale);
                          if (workshopDates.length === 0) {
                            if (hasPastOnlyDates) {
                              return renderNoUpcomingDates(
                                offerLabels.noOccurrences,
                                contactHref,
                                copy.contactLabel,
                              );
                            }
                            return renderComingSoonDates(copy.datesComingSoonLabel);
                          }
                          return (
                            <div className="fc-offer-card__date-cluster">
                              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                                <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
                              </svg>
                              <div className="fc-offer-card__date-pills">
                                {workshopDates.map((dateLabel) => (
                                  <span className="fc-offer-card__date-pill" key={dateLabel}>
                                    {dateLabel}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Domain pills */}
                      {domainNames.length > 0 ? (
                        <div className="fc-offer-card__domains">
                          {domainNames.map((name) => (
                            <span className="fc-offer-card__domain-pill" key={name}>{name}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {/* Card footer */}
                    <div className="fc-offer-card__footer">
                      {isSplitActionCard ? (
                        <>
                          <Link className="fc-offer-card__cta" href={detailsPath}>
                            {copy.viewLabel}
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                            </svg>
                          </Link>
                          {bookingPath ? (
                            isClassCard ? (
                              <a
                                className="fc-offer-card__book"
                                href={bookingPath}
                                rel="noreferrer"
                                target="_blank"
                              >
                                {getOfferCTA(offerType, requestLocale)}
                              </a>
                            ) : (
                              <Link className="fc-offer-card__book" href={bookingPath}>
                                {getOfferCTA(offerType, requestLocale)}
                              </Link>
                            )
                          ) : (
                            <span className="fc-offer-card__book">{getOfferCTA(offerType, requestLocale)}</span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="fc-offer-card__cta">
                            {copy.viewLabel}
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                            </svg>
                          </span>
                          <span className="fc-offer-card__book">{getOfferCTA(offerType, requestLocale)}</span>
                        </>
                      )}
                    </div>
                  </>
                );

                return isSplitActionCard ? (
                  <article
                    className={`fc-offer-card fc-offer-card--${offerTypeVariant}`}
                    key={slug || `offer-${index}`}
                  >
                    {cardInner}
                  </article>
                ) : (
                  <Link
                    className={`fc-offer-card fc-offer-card--${offerTypeVariant}`}
                    href={detailsPath}
                    key={slug || `offer-${index}`}
                  >
                    {cardInner}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── NEWSLETTER ── */}
        <section className="forest-newsletter-cta">
          <p className="forest-newsletter-cta__eyebrow">
            {localeCode === "fr" ? "Communauté" : "Community"}
          </p>
          <h2 className="forest-newsletter-cta__heading">
            {copy.newsletterTitle}
          </h2>
          <p className="forest-newsletter-cta__body">
            {copy.newsletterBody}
          </p>
          <div className="forest-newsletter-cta__form">
            <input
              aria-label={copy.newsletterPlaceholder}
              placeholder={copy.newsletterPlaceholder}
              type="email"
            />
            <button type="button">{copy.newsletterCta}</button>
          </div>
        </section>
      </div>
    </ForestPageShell>
  );
}
