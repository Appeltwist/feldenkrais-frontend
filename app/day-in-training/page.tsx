import { notFound } from "next/navigation";

import EducationDayInTrainingPage from "@/components/education/EducationDayInTrainingPage";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import {
  getEducationTrainingCohorts,
  getEducationTrainingIncludedItems,
  getEducationTrainingProgramStats,
} from "@/lib/education-training";

export default async function DayInTrainingPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const page = await resolveEducationNarrativePage(hostname, "day-in-training", locale);

  if (!page) {
    notFound();
  }

  return (
    <EducationDayInTrainingPage
      cohorts={getEducationTrainingCohorts(locale)}
      includedItems={getEducationTrainingIncludedItems(locale)}
      locale={locale}
      page={page}
      trainingStats={getEducationTrainingProgramStats(locale)}
    />
  );
}
