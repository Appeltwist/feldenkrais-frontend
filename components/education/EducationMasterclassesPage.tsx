import Link from "next/link";

import type { OfferSummary } from "@/lib/api";
import { localizePath } from "@/lib/locale-path";
import { asRecord, getOfferSlug, getOfferTitle, pickString } from "@/lib/offers";

import EducationNeurosomaticHeader from "./EducationNeurosomaticHeader";
import EducationMasterclassSlider from "./EducationMasterclassSlider";

type EducationMasterclassesPageProps = {
  locale: string;
  offers: OfferSummary[];
};

type MasterclassCard = {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  facilitatorLabel: string;
  chips: string[];
};

const MASTERCLASS_ORDER = [
  "the-singers-voice",
  "the-skeletal-voice",
  "unlearning-pain",
  "feldenkrais-for-sports",
] as const;

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const trimmed = value.slice(0, maxLength).trimEnd();
  const safe = trimmed.replace(/[.,;:!?-]+$/u, "").trimEnd();
  return `${safe}...`;
}

function buildMasterclassCards(offers: OfferSummary[]): MasterclassCard[] {
  const orderMap = new Map<string, number>(MASTERCLASS_ORDER.map((slug, index) => [slug, index]));

  return offers
    .map((offer) => {
      const slug = getOfferSlug(offer);
      if (!slug) {
        return null;
      }

      const record = asRecord(offer);
      const facilitators = Array.isArray(record?.facilitators)
        ? record.facilitators
            .map((facilitator) => {
              const facilitatorRecord =
                typeof facilitator === "object" && facilitator !== null
                  ? (facilitator as Record<string, unknown>)
                  : null;
              return pickString(facilitatorRecord, ["display_name", "name"]);
            })
            .filter(Boolean)
        : [];
      const themes = Array.isArray(record?.themes)
        ? record.themes
            .map((theme) => {
              const themeRecord =
                typeof theme === "object" && theme !== null
                  ? (theme as Record<string, unknown>)
                  : null;
              return pickString(themeRecord, ["name"]);
            })
            .filter(Boolean)
            .slice(0, 2)
        : [];

      return {
        slug,
        title: getOfferTitle(offer, "Masterclass"),
        excerpt: truncateText(pickString(record, ["excerpt", "summary"]), 170),
        imageUrl: pickString(record, ["hero_image_url", "heroImageUrl", "image_url", "imageUrl"]),
        facilitatorLabel: facilitators.join(" / "),
        chips: themes,
      };
    })
    .filter((offer): offer is MasterclassCard => offer !== null)
    .sort((a, b) => {
      const aIndex = orderMap.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
      const bIndex = orderMap.get(b.slug) ?? Number.MAX_SAFE_INTEGER;

      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }

      return a.title.localeCompare(b.title);
    });
}

export default function EducationMasterclassesPage({
  locale,
  offers,
}: EducationMasterclassesPageProps) {
  const cards = buildMasterclassCards(offers);

  return (
    <div className="neuro-platform-page neuro-platform-page--masterclasses">
      <EducationNeurosomaticHeader
        locale={locale}
        loginLabel={t(locale, "Connexion", "Login")}
        routePath="/masterclasses"
        title={t(locale, "LA PLATEFORME NEUROSOMATIQUE", "THE NEUROSOMATIC PLATFORM")}
      />

      <section className="neuro-masterclasses-section neuro-masterclasses-section--intro">
        <div className="neuro-platform-shell">
          <div className="neuro-masterclasses-intro">
            <p className="neuro-masterclasses-intro__eyebrow">
              {t(locale, "Masterclasses à la demande", "On-demand masterclasses")}
            </p>
            <h1>{t(locale, "Approfondir un sujet, une voix, un champ de pratique", "Go deep into one topic, one voice, one field of practice")}</h1>
            <p>
              {t(
                locale,
                "Des achats uniques pour étudier avec des spécialistes de la voix, de la douleur, du sport et de l’apprentissage incarné, dans le même univers Neurosomatic que la plateforme.",
                "One-time purchase masterclasses with specialists in voice, pain, sports, and embodied learning, all within the same Neurosomatic universe.",
              )}
            </p>
          </div>

          <EducationMasterclassSlider ariaLabel={t(locale, "Liste des masterclasses", "Masterclass list")}>
            {cards.map((card) => (
              <article className="neuro-masterclass-card" key={card.slug}>
                {card.imageUrl ? (
                  <div className="neuro-masterclass-card__media">
                    <img alt={card.title} src={card.imageUrl} />
                  </div>
                ) : null}
                <div className="neuro-masterclass-card__body">
                  {card.facilitatorLabel ? (
                    <p className="neuro-masterclass-card__facilitator">{card.facilitatorLabel}</p>
                  ) : null}
                  <h2>{card.title}</h2>
                  {card.chips.length > 0 ? (
                    <div className="neuro-masterclass-card__chips">
                      {card.chips.map((chip) => (
                        <span key={`${card.slug}-${chip}`}>{chip}</span>
                      ))}
                    </div>
                  ) : null}
                  {card.excerpt ? <p className="neuro-masterclass-card__excerpt">{card.excerpt}</p> : null}
                  <Link className="neuro-platform-button neuro-platform-button--primary" href={localizePath(locale, `/masterclasses/${card.slug}`)}>
                    {t(locale, "Voir la masterclass", "Open masterclass")}
                  </Link>
                </div>
              </article>
            ))}
          </EducationMasterclassSlider>
        </div>
      </section>
    </div>
  );
}
