import { notFound } from "next/navigation";

import EducationContentPage from "@/components/education/EducationContentPage";
import EducationPlatformLandingPage from "@/components/education/EducationPlatformLandingPage";
import { fetchSiteConfig } from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function PlatformPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (siteConfig?.siteSlug === "feldenkrais-education") {
    return <EducationPlatformLandingPage locale={locale} />;
  }

  const page = await resolveEducationNarrativePage(hostname, "platform", locale);

  if (!page) {
    notFound();
  }

  return <EducationContentPage eyebrow={locale.toLowerCase().startsWith("fr") ? "Plateforme" : "Platform"} page={page} />;
}
