import { notFound } from "next/navigation";

import EducationPressPage from "@/components/education/EducationPressPage";
import { fetchSiteConfig } from "@/lib/api";
import { getEducationCenters, getEducationFallbackSiteConfig, mergeEducationSiteConfig } from "@/lib/education-content";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getEducationTrainingProgramStats } from "@/lib/education-training";

export default async function PressPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const resolvedSiteConfig = mergeEducationSiteConfig(
    getEducationFallbackSiteConfig(hostname, locale),
    siteConfig,
  );
  const page = await resolveEducationNarrativePage(hostname, "press", locale);

  if (!page) {
    notFound();
  }

  return (
    <EducationPressPage
      centers={getEducationCenters(locale)}
      contact={resolvedSiteConfig.footer.contact}
      locale={locale}
      page={page}
      socials={resolvedSiteConfig.footer.socials}
      trainingStats={getEducationTrainingProgramStats(locale)}
    />
  );
}
