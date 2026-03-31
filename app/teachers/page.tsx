import { notFound } from "next/navigation";

import EducationTeachersIndexPage from "@/components/education/EducationTeachersIndexPage";
import EducationContentPage from "@/components/education/EducationContentPage";
import { fetchSiteConfig } from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getEducationTeacherProfiles } from "@/lib/education-teachers";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function TeachersIndexPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const page = await resolveEducationNarrativePage(hostname, "teachers", locale);

  if (!page) {
    notFound();
  }

  if (siteConfig?.siteSlug === "feldenkrais-education") {
    const teachers = getEducationTeacherProfiles(locale);

    if (teachers.length > 0) {
      return <EducationTeachersIndexPage locale={locale} page={page} teachers={teachers} />;
    }
  }

  return <EducationContentPage eyebrow={locale.toLowerCase().startsWith("fr") ? "Enseignant·es" : "Teachers"} page={page} />;
}
