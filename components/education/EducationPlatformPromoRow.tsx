import Link from "next/link";

import { localizePath } from "@/lib/locale-path";

type EducationPlatformPromoRowProps = {
  locale: string;
  className?: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationPlatformPromoRow({
  locale,
  className = "",
}: EducationPlatformPromoRowProps) {
  return (
    <section className={`education-promo-row education-promo-row--platform ${className}`.trim()}>
      <div className="education-promo-row__visual">
        <img
          alt={t(locale, "Aperçu de la plateforme Neuro Somatic", "Preview of the Neuro Somatic Platform")}
          loading="lazy"
          src="https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/10/Group-23809-1.png"
        />
      </div>
      <div className="education-promo-row__copy education-promo-row__copy--dark">
        <h2>
          <span>{t(locale, "La Plateforme Neuro Somatic", "The Neuro Somatic Platform")}</span>
          <em>{t(locale, "Développez vos capacités", "Improve Your Abilities")}</em>
        </h2>
        <div className="education-promo-row__rule" />
        <p>
          {t(
            locale,
            "Cette plateforme propose une vaste bibliothèque audio et vidéo avec des stratégies neurosomatiques pour dépasser certaines limites physiques, nourrir la créativité, soutenir la pratique professionnelle et prolonger l’étude en ligne.",
            "This platform provides an extensive audio and video library offering diverse neurosomatic strategies to help you overcome chronic pain and persistent conditions, surpass physical barriers, unlock creativity, enhance high-level performance, gain practical tools for client work, and effectively manage stress.",
          )}
        </p>
        <div className="education-promo-row__actions">
          <Link className="education-button" href={localizePath(locale, "/platform")}>
            {t(locale, "Commencer", "Start now")}
          </Link>
        </div>
      </div>
    </section>
  );
}
