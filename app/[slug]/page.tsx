import { notFound, permanentRedirect } from "next/navigation";

import { ApiError, fetchSiteConfig, fetchTeacherDetail, type TeacherDetail } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { localizePath } from "@/lib/locale-path";

type LegacyProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyProfileRedirectPage({ params }: LegacyProfilePageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Profile</h1>
        <p>Unable to load this profile right now.</p>
      </section>
    );
  }

  const requestLocale = await getRequestLocale(siteConfig.defaultLocale);

  let teacher: TeacherDetail | null = null;

  try {
    teacher = await fetchTeacherDetail({
      hostname,
      slug,
      center: siteConfig.centerSlug,
      locale: requestLocale,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      if (requestLocale !== siteConfig.defaultLocale) {
        try {
          teacher = await fetchTeacherDetail({
            hostname,
            slug,
            center: siteConfig.centerSlug,
            locale: siteConfig.defaultLocale,
          });
        } catch (retryError) {
          if (retryError instanceof ApiError && retryError.status === 404) {
            notFound();
          }
          throw retryError;
        }
      } else {
        notFound();
      }
    } else {
      throw error;
    }
  }

  if (!teacher) {
    notFound();
  }

  const canonicalSlug = typeof teacher.slug === "string" && teacher.slug.trim() ? teacher.slug.trim() : slug;
  permanentRedirect(localizePath(requestLocale, `/teachers/${canonicalSlug}`));
}
