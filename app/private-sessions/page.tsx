import EducationPrivateSessionsPage from "@/components/education/EducationPrivateSessionsPage";
import ForestOfferCollectionPage from "@/components/offers/ForestOfferCollectionPage";
import OfferListPage from "@/components/offers/OfferListPage";
import { fetchSiteConfig } from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getEducationTeacherProfiles } from "@/lib/education-teachers";
import { isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function PrivateSessionsPage() {
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const isForest = siteConfig ? isForestCenter(siteConfig.centerSlug) : false;

  if (isForest) {
    return (
      <ForestOfferCollectionPage
        config={{
          offerTypes: ["PRIVATE_SESSION"],
          fallbackHeading: "Individual Sessions",
        }}
      />
    );
  }

  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");

  if (siteConfig?.siteSlug === "feldenkrais-education") {
    const page = await resolveEducationNarrativePage(hostname, "private-sessions", locale);
    const featuredTeachers = getEducationTeacherProfiles(locale)
      .filter((teacher) => teacher.section === "faculty")
      .slice(0, 4);

    return (
      <EducationPrivateSessionsPage
        featuredTeachers={featuredTeachers}
        locale={locale}
        page={
          page ?? {
            routeKey: "private-sessions",
            locale,
            title: "Private sessions",
            subtitle: "One-to-one guidance through the FE network.",
            hero: {
              title: "Private sessions",
              body: "One-to-one guidance through the FE network.",
              imageUrl: null,
            },
            sections: [],
            primaryCta: null,
          }
        }
      />
    );
  }

  return <OfferListPage heading="Individual Sessions" offerType="PRIVATE_SESSION" routeKey="private-sessions" />;
}
