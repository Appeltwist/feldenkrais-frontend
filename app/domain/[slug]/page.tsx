import { permanentRedirect } from "next/navigation";

import { fetchSiteConfig } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { localizePath } from "@/lib/locale-path";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EducationDomainLegacyRoute({ params }: PageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");

  permanentRedirect(localizePath(locale, `/domains/${slug}`));
}
