import { notFound } from "next/navigation";

import EducationContentPage from "@/components/education/EducationContentPage";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function ComplaintsPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const page = await resolveEducationNarrativePage(hostname, "complaints", locale);

  if (!page) {
    notFound();
  }

  return <EducationContentPage eyebrow="Complaints" page={page} />;
}
