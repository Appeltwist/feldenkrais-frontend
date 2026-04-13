import { notFound } from "next/navigation";

import EducationPlatformPage from "@/components/education/EducationPlatformPage";
import { fetchSiteConfig } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function LessonLibraryAccessPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (siteConfig?.siteSlug === "feldenkrais-education") {
    return <EducationPlatformPage locale={locale} />;
  }

  notFound();
}
