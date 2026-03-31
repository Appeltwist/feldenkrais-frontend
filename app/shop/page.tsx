import { notFound } from "next/navigation";

import EducationContentPage from "@/components/education/EducationContentPage";
import EducationShopArchivePage from "@/components/education/EducationShopArchivePage";
import { fetchSiteConfig } from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getEducationShopData } from "@/lib/education-shop";

export default async function ShopPage() {
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");
  const page = await resolveEducationNarrativePage(hostname, "shop", locale);

  if (!page) {
    notFound();
  }

  if (siteConfig?.siteSlug === "feldenkrais-education") {
    const data = getEducationShopData(locale);
    if (data.highlights.length > 0 || data.products.length > 0) {
      return <EducationShopArchivePage data={data} locale={locale} page={page} />;
    }
  }

  return <EducationContentPage eyebrow="Shop" page={page} />;
}
