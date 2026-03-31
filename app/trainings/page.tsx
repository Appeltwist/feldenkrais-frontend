import { notFound } from "next/navigation";

import EducationTrainingLandingPage from "@/components/education/EducationTrainingLandingPage";
import OfferListPage from "@/components/offers/OfferListPage";
import { fetchSiteConfig } from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function TrainingsPage() {
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const isForest = siteConfig ? isForestCenter(siteConfig.centerSlug) : false;

  if (isForest) {
    return <OfferListPage heading="Training" offerType="TRAINING_INFO" routeKey="trainings" />;
  }

  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Training</h1>
        <p>Unable to load training information right now.</p>
      </section>
    );
  }

  const locale = await getRequestLocale(siteConfig.defaultLocale);
  const page = await resolveEducationNarrativePage(hostname, "trainings", locale);

  if (!page) {
    notFound();
  }

  return <EducationTrainingLandingPage locale={locale} page={page} />;
}
