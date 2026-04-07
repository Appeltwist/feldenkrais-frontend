import Link from "next/link";

import type { EducationWorkshopCollectionItem } from "@/lib/education-workshops";

type EducationWorkshopFeatureCardProps = {
  locale: string;
  workshop: EducationWorkshopCollectionItem;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationWorkshopFeatureCard({
  locale,
  workshop,
}: EducationWorkshopFeatureCardProps) {
  const tags = [workshop.locationLabel, workshop.monthLabel, workshop.audienceLabel].filter(Boolean);
  const actionLabel = workshop.external
    ? t(locale, "Ouvrir le workshop", "Open workshop")
    : t(locale, "Voir la page", "View page");
  const body = (
    <>
      <div
        className="education-workshop-feature-card__media"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(18, 23, 34, 0.14), rgba(18, 23, 34, 0.82)), url(${workshop.imageUrl || "/brands/feldenkrais-education/training/hero-room.jpeg"})`,
        }}
      />
      <div className="education-workshop-feature-card__body">
        {tags.length > 0 ? (
          <div className="education-workshop-feature-card__tags">
            {tags.map((tag) => (
              <span className="education-workshop-feature-card__tag" key={`${workshop.id}-${tag}`}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <h3>{workshop.title}</h3>
        <p className="education-workshop-feature-card__summary">{workshop.summary}</p>
        {workshop.whenLabel ? <p className="education-workshop-feature-card__meta">{workshop.whenLabel}</p> : null}
        <span className="education-button education-button--secondary">{actionLabel}</span>
      </div>
    </>
  );

  if (workshop.external) {
    return (
      <a
        className="education-workshop-feature-card education-card"
        href={workshop.href}
        rel="noreferrer"
        target="_blank"
      >
        {body}
      </a>
    );
  }

  return (
    <Link className="education-workshop-feature-card education-card" href={workshop.href}>
      {body}
    </Link>
  );
}
