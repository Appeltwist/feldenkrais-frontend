import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EducationAtelierIntroPage from "@/components/education/EducationAtelierIntroPage";
import { fetchNarrativePage, fetchSiteConfig } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getEducationTeacherProfiles, type EducationTeacherProfile } from "@/lib/education-teachers";
import { getEducationAtelierIntroContent } from "@/lib/education-workshops";

export async function generateMetadata(): Promise<Metadata> {
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (!siteConfig || siteConfig.siteSlug !== "feldenkrais-education") {
    return {};
  }

  const locale = await getRequestLocale(siteConfig?.defaultLocale || "en");
  const backendPage = await fetchNarrativePage(hostname, "atelier_intro", locale).catch(() => null);
  const content = getEducationAtelierIntroContent(locale, backendPage);

  return {
    title: content.page.seo?.title || content.page.title,
    description: content.page.seo?.description || content.page.subtitle || content.lead,
  };
}

export default async function AtelierIntroPage() {
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (!siteConfig || siteConfig.siteSlug !== "feldenkrais-education") {
    notFound();
  }

  const locale = await getRequestLocale(siteConfig.defaultLocale);
  const backendPage = await fetchNarrativePage(hostname, "atelier_intro", locale).catch(() => null);
  const content = getEducationAtelierIntroContent(locale, backendPage);
  const teacherBySlug = new Map(getEducationTeacherProfiles(locale).map((teacher) => [teacher.slug, teacher]));
  const teachers = content.teacherSlugs
    .map((slug) => teacherBySlug.get(slug))
    .filter((teacher): teacher is EducationTeacherProfile => Boolean(teacher));

  return <EducationAtelierIntroPage content={content} locale={locale} teachers={teachers} />;
}
