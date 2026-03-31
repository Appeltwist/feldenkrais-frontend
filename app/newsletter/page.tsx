import { notFound } from "next/navigation";

import EducationContentPage from "@/components/education/EducationContentPage";
import EducationNewsletterArchivePage from "@/components/education/EducationNewsletterArchivePage";
import { fetchSiteConfig } from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getEducationNewsletterArchive } from "@/lib/education-newsletters";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function NewsletterPage() {
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");
  const page = await resolveEducationNarrativePage(hostname, "newsletter", locale);

  if (!page) {
    notFound();
  }

  if (siteConfig?.siteSlug === "feldenkrais-education") {
    const entries = getEducationNewsletterArchive(locale);
    if (entries.length > 0) {
      return <EducationNewsletterArchivePage entries={entries} locale={locale} page={page} />;
    }
  }

  return <EducationContentPage eyebrow="Newsletter" page={page} />;
}
