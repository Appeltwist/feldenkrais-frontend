import { notFound } from "next/navigation";

import EducationPractitionerFinderPage from "@/components/education/EducationPractitionerFinderPage";
import EducationContentPage from "@/components/education/EducationContentPage";
import { fetchSiteConfig } from "@/lib/api";
import { getEducationCenters } from "@/lib/education-content";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getEducationTeacherProfiles } from "@/lib/education-teachers";

export default async function FindPractitionerPage() {
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");
  const page = await resolveEducationNarrativePage(hostname, "find-a-practitioner", locale);

  if (!page) {
    notFound();
  }

  if (siteConfig?.siteSlug === "feldenkrais-education") {
    const centers = getEducationCenters(locale);
    const featuredTeachers = getEducationTeacherProfiles(locale).slice(0, 6);

    return (
      <EducationPractitionerFinderPage
        centers={centers}
        featuredTeachers={featuredTeachers}
        locale={locale}
        page={page}
      />
    );
  }

  return <EducationContentPage eyebrow="Orientation" page={page} />;
}
