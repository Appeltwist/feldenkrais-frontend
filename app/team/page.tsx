import { notFound } from "next/navigation";

import EducationContentPage from "@/components/education/EducationContentPage";
import EducationTeamPage from "@/components/education/EducationTeamPage";
import { fetchSiteConfig } from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getEducationTeacherProfiles } from "@/lib/education-teachers";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function TeamPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const page = await resolveEducationNarrativePage(hostname, "team", locale);

  if (!page) {
    notFound();
  }

  if (siteConfig?.siteSlug === "feldenkrais-education") {
    const team = getEducationTeacherProfiles(locale).filter((teacher) => teacher.section === "ecosystem");

    if (team.length > 0) {
      return <EducationTeamPage locale={locale} page={page} teachers={team} />;
    }
  }

  return <EducationContentPage eyebrow={locale.toLowerCase().startsWith("fr") ? "Équipe" : "Team"} page={page} />;
}
