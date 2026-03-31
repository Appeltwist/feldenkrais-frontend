import { notFound } from "next/navigation";

import EducationEventDetailPage from "@/components/education/EducationEventDetailPage";
import { fetchSiteConfig } from "@/lib/api";
import { getEducationEventArchive, getEducationEventDetail } from "@/lib/education-events";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (!siteConfig || siteConfig.siteSlug !== "feldenkrais-education") {
    notFound();
  }

  const locale = await getRequestLocale(siteConfig.defaultLocale);
  const event = getEducationEventDetail(locale, slug);

  if (!event) {
    notFound();
  }

  const relatedEvents = getEducationEventArchive(locale)
    .filter((entry) => entry.slug !== event.slug)
    .slice(0, 3);

  return <EducationEventDetailPage event={event} locale={locale} relatedEvents={relatedEvents} />;
}
