import { notFound } from "next/navigation";

import EducationFinancingPage from "@/components/education/EducationFinancingPage";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getEducationTrainingCohorts, getEducationTrainingProgramStats } from "@/lib/education-training";

export default async function FinancingPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const page = await resolveEducationNarrativePage(hostname, "financing", locale);

  if (!page) {
    notFound();
  }

  return (
    <EducationFinancingPage
      cohorts={getEducationTrainingCohorts(locale)}
      locale={locale}
      page={page}
      trainingStats={getEducationTrainingProgramStats(locale)}
    />
  );
}
