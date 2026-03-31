import { notFound } from "next/navigation";

import EducationContentPage from "@/components/education/EducationContentPage";
import EducationVideosPage from "@/components/education/EducationVideosPage";
import { fetchSiteConfig } from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getEducationVideosData } from "@/lib/education-videos";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function VideosPage() {
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");
  const page = await resolveEducationNarrativePage(hostname, "videos", locale);

  if (!page) {
    notFound();
  }

  if (siteConfig?.siteSlug === "feldenkrais-education") {
    const data = getEducationVideosData(locale);
    if (data) {
      return <EducationVideosPage data={data} locale={locale} page={page} />;
    }
  }

  return <EducationContentPage eyebrow="Video" page={page} />;
}
