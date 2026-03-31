import { notFound } from "next/navigation";

import EducationContentPage from "@/components/education/EducationContentPage";
import EducationPlatformPage from "@/components/education/EducationPlatformPage";
import { fetchSiteConfig } from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function PlatformPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const page = await resolveEducationNarrativePage(hostname, "platform", locale);

  if (!page) {
    notFound();
  }

  if (siteConfig?.siteSlug === "feldenkrais-education") {
    return <EducationPlatformPage locale={locale} page={page} />;
  }

  return <EducationContentPage eyebrow={locale.toLowerCase().startsWith("fr") ? "Plateforme" : "Platform"} page={page} />;
}
