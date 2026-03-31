import EducationLocationPage from "@/components/education/EducationLocationPage";
import RentPage from "@/app/rent/page";
import { fetchSiteConfig } from "@/lib/api";
import { getEducationFallbackNarrativePage, getEducationCenters } from "@/lib/education-content";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getEducationTrainingCohorts } from "@/lib/education-training";
import type { LocaleCode } from "@/lib/types";

export default async function LocationPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale();
  const localeCode: LocaleCode = locale.toLowerCase().startsWith("fr") ? "fr" : "en";
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (!siteConfig || !isForestCenter(siteConfig.centerSlug)) {
    const page =
      (await resolveEducationNarrativePage(hostname, "location", localeCode)) ??
      getEducationFallbackNarrativePage("location", localeCode);

    if (!page) {
      return (
        <section className="page-section">
          <h1>Location</h1>
          <p>Location information is being prepared and will be available soon.</p>
        </section>
      );
    }

    return (
      <EducationLocationPage
        centers={getEducationCenters(localeCode)}
        cohorts={getEducationTrainingCohorts(localeCode)}
        locale={localeCode}
        page={page}
      />
    );
  }

  return <RentPage />;
}
