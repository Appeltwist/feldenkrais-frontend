import { notFound } from "next/navigation";

import EducationMoshePage from "@/components/education/EducationMoshePage";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getEducationTeacherProfiles } from "@/lib/education-teachers";

export default async function MosheFeldenkraisPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const page = await resolveEducationNarrativePage(hostname, "moshe-feldenkrais", locale);

  if (!page) {
    notFound();
  }

  return <EducationMoshePage featuredTeachers={getEducationTeacherProfiles(locale)} locale={locale} page={page} />;
}
