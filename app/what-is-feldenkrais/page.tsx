import { notFound } from "next/navigation";

import EducationMethodPage from "@/components/education/EducationMethodPage";
import { getEducationDomainArchive } from "@/lib/education-domains";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getEducationTeacherProfiles } from "@/lib/education-teachers";
import { getEducationTrainingProgramStats } from "@/lib/education-training";

export default async function WhatIsFeldenkraisPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const page = await resolveEducationNarrativePage(hostname, "what-is-feldenkrais", locale);

  if (!page) {
    notFound();
  }

  return (
    <EducationMethodPage
      domains={getEducationDomainArchive(locale)}
      featuredTeachers={getEducationTeacherProfiles(locale)}
      locale={locale}
      page={page}
      trainingStats={getEducationTrainingProgramStats(locale)}
    />
  );
}
