import { notFound } from "next/navigation";

import EducationDayInTrainingPage from "@/components/education/EducationDayInTrainingPage";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function DayInTrainingPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const page = await resolveEducationNarrativePage(hostname, "day-in-training", locale);

  if (!page) {
    notFound();
  }

  return <EducationDayInTrainingPage locale={locale} page={page} />;
}
