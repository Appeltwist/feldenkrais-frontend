import { notFound } from "next/navigation";

import EducationCenterDetailPage from "@/components/education/EducationCenterDetailPage";
import { resolveEducationCenterPage } from "@/lib/education-page";
import { getRequestLocale } from "@/lib/get-locale";

type CenterDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CenterDetailPage({ params }: CenterDetailPageProps) {
  const { slug } = await params;
  const locale = await getRequestLocale("en");
  const center = await resolveEducationCenterPage(locale, slug);

  if (!center) {
    notFound();
  }

  return <EducationCenterDetailPage center={center} locale={locale} />;
}
