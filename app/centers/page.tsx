import Link from "next/link";
import { notFound } from "next/navigation";

import EducationContentPage from "@/components/education/EducationContentPage";
import { getEducationCenters } from "@/lib/education-content";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { localizePath } from "@/lib/locale-path";
import { getEducationTrainingCohortByCenter } from "@/lib/education-training";

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function CenterFactIcon({ kind }: { kind: "cohort" | "director" | "segments" | "pricing" }) {
  if (kind === "cohort") {
    return (
      <svg fill="none" viewBox="0 0 24 24">
        <path
          d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Zm4 2.7v3.5c0 1.2 2.4 2.8 5 2.8s5-1.6 5-2.8v-3.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (kind === "director") {
    return (
      <svg fill="none" viewBox="0 0 24 24">
        <path
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c0-3.1 3.1-5.5 7-5.5s7 2.4 7 5.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (kind === "segments") {
    return (
      <svg fill="none" viewBox="0 0 24 24">
        <path
          d="M7 3v4M17 3v4M4 9h16M6 6h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path
        d="M15 6.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5S10.3 9 12 9s3 1.1 3 2.5S13.7 14 12 14s-3-1.1-3-2.5M12 4v16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function getCenterCardImage(slug: string, fallbackUrl: string) {
  if (slug === "cantal") {
    return "/brands/feldenkrais-education/centers/cantal-room.jpeg";
  }

  if (slug === "paris") {
    return "/brands/feldenkrais-education/training/hero-room.jpeg";
  }

  return fallbackUrl;
}

export default async function CentersPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const page = await resolveEducationNarrativePage(hostname, "centers", locale);

  if (!page) {
    notFound();
  }

  const resolvedPage = {
    ...page,
    sections: [],
  };

  const centers = getEducationCenters(locale).map((center) => {
    const cohort = getEducationTrainingCohortByCenter(locale, center.slug);

    return {
      ...center,
      cohort,
      imageUrl: getCenterCardImage(center.slug, center.heroImageUrl),
    };
  });

  return (
    <EducationContentPage
      className="education-centers-overview-page"
      hideHero
      page={resolvedPage}
    >
      <section className="education-centers-overview">
        <header className="education-centers-overview__intro">
          <h1>{t(locale, "Où faire la formation ?", "Where should you do the training?")}</h1>
          <p>{t(locale, "Trois centres, trois atmosphères", "Three centers, three atmospheres")}</p>
          <span className="education-centers-overview__rule" />
        </header>

        <div className="education-centers-overview__grid">
          {centers.map((center) => {
            const cohort = center.cohort;
            if (!cohort) {
              return null;
            }

            return (
              <Link
                aria-label={`${center.name} ${t(locale, "centre", "center")}`}
                className="education-centers-overview-card"
                href={localizePath(locale, `/centers/${center.slug}`)}
                key={center.slug}
              >
                <h2>{center.name}</h2>
                <div
                  className="education-centers-overview-card__image"
                  style={{ backgroundImage: `url(${center.imageUrl})` }}
                />

                <ul className="education-centers-overview-card__facts">
                  <li>
                    <span className="education-centers-overview-card__icon" aria-hidden="true">
                      <CenterFactIcon kind="cohort" />
                    </span>
                    <div>
                      <strong>{cohort.name}</strong>
                      <span>{cohort.periodLabel}</span>
                    </div>
                  </li>
                  <li>
                    <span className="education-centers-overview-card__icon" aria-hidden="true">
                      <CenterFactIcon kind="director" />
                    </span>
                    <div>
                      <strong>{cohort.director}</strong>
                      <span>{t(locale, "Direction pédagogique", "Educational Director")}</span>
                    </div>
                  </li>
                  <li>
                    <span className="education-centers-overview-card__icon" aria-hidden="true">
                      <CenterFactIcon kind="segments" />
                    </span>
                    <div>
                      <strong>{t(locale, "Segments", "Segments")}</strong>
                      <span>{cohort.segments}</span>
                    </div>
                  </li>
                  <li>
                    <span className="education-centers-overview-card__icon" aria-hidden="true">
                      <CenterFactIcon kind="pricing" />
                    </span>
                    <div>
                      <strong>{t(locale, "Tarif", "Pricing")}</strong>
                      <span>{cohort.pricing}</span>
                    </div>
                  </li>
                </ul>
              </Link>
            );
          })}
        </div>
      </section>
    </EducationContentPage>
  );
}
