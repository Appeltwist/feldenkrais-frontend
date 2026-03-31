import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EducationNewsletterDetailPage from "@/components/education/EducationNewsletterDetailPage";
import { fetchSiteConfig } from "@/lib/api";
import { getEducationNewsletter, getEducationNewsletterArchive } from "@/lib/education-newsletters";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

type NewsletterDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: NewsletterDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");

  if (siteConfig?.siteSlug !== "feldenkrais-education") {
    return {};
  }

  const entry = getEducationNewsletter(locale, slug);
  if (!entry) {
    return {};
  }

  return {
    title: `${entry.title} | Feldenkrais Education`,
    description: entry.excerpt,
    openGraph: entry.imageUrl
      ? {
          title: `${entry.title} | Feldenkrais Education`,
          description: entry.excerpt,
          images: [{ url: entry.imageUrl }],
        }
      : undefined,
  };
}

export default async function NewsletterDetailPage({
  params,
}: NewsletterDetailPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");

  if (siteConfig?.siteSlug !== "feldenkrais-education") {
    notFound();
  }

  const entry = getEducationNewsletter(locale, slug);
  if (!entry) {
    notFound();
  }

  const relatedEntries = getEducationNewsletterArchive(locale)
    .filter((item) => item.slug !== entry.slug)
    .slice(0, 3);

  return (
    <EducationNewsletterDetailPage
      entry={entry}
      locale={locale}
      relatedEntries={relatedEntries}
    />
  );
}
