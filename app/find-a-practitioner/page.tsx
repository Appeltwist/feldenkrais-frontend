import { notFound } from "next/navigation";

import EducationPractitionerFinderPage from "@/components/education/EducationPractitionerFinderPage";
import EducationContentPage from "@/components/education/EducationContentPage";
import { fetchSiteConfig } from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getEducationPractitionerProfiles } from "@/lib/education-practitioners";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function FindPractitionerPage() {
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");
  const page = await resolveEducationNarrativePage(hostname, "find-a-practitioner", locale);

  if (!page) {
    notFound();
  }

  if (siteConfig?.siteSlug === "feldenkrais-education") {
    const practitioners = getEducationPractitionerProfiles();

    return (
      <EducationPractitionerFinderPage
        locale={locale}
        page={page}
        practitioners={practitioners}
      />
    );
  }

  return <EducationContentPage eyebrow="Orientation" page={page} />;
}
