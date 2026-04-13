import { notFound } from "next/navigation";

import EducationMasterclassesPage from "@/components/education/EducationMasterclassesPage";
import { fetchOffers, fetchSiteConfig } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function MasterclassesPage() {
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (siteConfig?.siteSlug !== "feldenkrais-education") {
    notFound();
  }

  const locale = await getRequestLocale(siteConfig.defaultLocale);
  const offers = await fetchOffers({
    hostname,
    center: siteConfig.centerSlug,
    type: "MASTERCLASS",
    locale,
  }).catch(() => []);

  return <EducationMasterclassesPage locale={locale} offers={offers} />;
}
