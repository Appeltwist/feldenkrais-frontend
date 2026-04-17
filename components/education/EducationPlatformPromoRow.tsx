import Link from "next/link";

import { localizePath } from "@/lib/locale-path";

type EducationPlatformPromoRowProps = {
  locale: string;
  className?: string;
  content?: {
    title?: string | null;
    subtitle?: string | null;
    body?: string | null;
    imageUrl?: string | null;
    href?: string | null;
    buttonLabel?: string | null;
  };
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationPlatformPromoRow({
  locale,
  className = "",
  content,
}: EducationPlatformPromoRowProps) {
  const href = content?.href?.startsWith("/") ? localizePath(locale, content.href) : content?.href || localizePath(locale, "/platform");
  const title =
    content?.title ?? t(locale, "La Plateforme Neuro Somatic", "The Neuro Somatic Platform");
  const subtitle =
    content?.subtitle ?? t(locale, "Développez vos capacités", "Improve Your Abilities");
  const body =
    content?.body ??
    t(
      locale,
      "Cette plateforme propose une vaste bibliothèque audio et vidéo avec des stratégies neurosomatiques pour dépasser certaines limites physiques, nourrir la créativité, soutenir la pratique professionnelle et prolonger l’étude en ligne.",
      "This platform provides an extensive audio and video library offering diverse neurosomatic strategies to help you overcome chronic pain and persistent conditions, surpass physical barriers, unlock creativity, enhance high-level performance, gain practical tools for client work, and effectively manage stress.",
    );
  const buttonLabel = content?.buttonLabel ?? t(locale, "Commencer", "Start now");

  return (
    <section className={`education-promo-row education-promo-row--platform ${className}`.trim()}>
      <div className="education-promo-row__visual">
        <img
          alt={title || t(locale, "Aperçu de la plateforme Neuro Somatic", "Preview of the Neuro Somatic Platform")}
          loading="lazy"
          src={content?.imageUrl || "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/10/Group-23809-1.png"}
        />
      </div>
      <div className="education-promo-row__copy education-promo-row__copy--dark">
        <h2>
          <span>{title}</span>
          {subtitle ? <em>{subtitle}</em> : null}
        </h2>
        <div className="education-promo-row__rule" />
        {body ? <p>{body}</p> : null}
        <div className="education-promo-row__actions">
          <Link className="education-button" href={href}>
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
