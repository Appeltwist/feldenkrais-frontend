import { notFound } from "next/navigation";

import EducationCenterDetailPage from "@/components/education/EducationCenterDetailPage";
import { fetchCenterDetail } from "@/lib/api";
import { resolveEducationCenterPage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

type CenterDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CenterDetailPage({ params }: CenterDetailPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const [center, cmsCenter] = await Promise.all([
    resolveEducationCenterPage(locale, slug),
    fetchCenterDetail(hostname, slug, locale).catch(() => null),
  ]);

  if (!center) {
    notFound();
  }

  return <EducationCenterDetailPage center={center} cmsCenter={cmsCenter} locale={locale} />;
}
