import { notFound } from "next/navigation";

import EducationDomainDetailPage from "@/components/education/EducationDomainDetailPage";
import { fetchSiteConfig } from "@/lib/api";
import { getEducationDomain, getEducationDomainArchive } from "@/lib/education-domains";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EducationDomainDetailRoute({ params }: PageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");

  if (siteConfig?.siteSlug !== "feldenkrais-education") {
    notFound();
  }

  const entry = getEducationDomain(locale, slug);
  if (!entry) {
    notFound();
  }

  const archive = getEducationDomainArchive(locale);
  const relatedEntries =
    archive.filter((candidate) => entry.relatedSlugs.includes(candidate.slug) && candidate.slug !== entry.slug).slice(0, 4) ||
    [];

  return <EducationDomainDetailPage entry={entry} locale={locale} relatedEntries={relatedEntries} />;
}
