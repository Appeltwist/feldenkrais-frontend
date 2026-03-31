import Link from "next/link";
import { notFound } from "next/navigation";

import EducationContentPage from "@/components/education/EducationContentPage";
import { getEducationCenters } from "@/lib/education-content";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { localizePath } from "@/lib/locale-path";

export default async function CentersPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const page = await resolveEducationNarrativePage(hostname, "centers", locale);

  if (!page) {
    notFound();
  }

  const centers = getEducationCenters(locale);
  const isFr = locale.toLowerCase().startsWith("fr");

  return (
    <EducationContentPage eyebrow={isFr ? "Centres" : "Centers"} page={page}>
      <section className="education-card-grid education-card-grid--centers">
        {centers.map((center) => (
          <article className="education-card home-center-card" key={center.slug}>
            <div
              className="home-center-card__media"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.92)), url(${center.heroImageUrl})`,
              }}
              />
            <div className="home-center-card__body">
              <p className="home-center-card__location">{center.location}</p>
              <h2>{center.name}</h2>
              <p className="education-center-card__strap">{center.legacyTitle}</p>
              <p>{center.summary}</p>
              <div className="link-row">
                <Link className="education-text-link" href={localizePath(locale, `/centers/${center.slug}`)}>
                  {isFr ? "Découvrir le centre" : "Discover the center"}
                </Link>
                <Link className="education-button education-button--secondary" href={localizePath(locale, "/trainings")}>
                  {isFr ? "Voir la formation" : "View training"}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </EducationContentPage>
  );
}
