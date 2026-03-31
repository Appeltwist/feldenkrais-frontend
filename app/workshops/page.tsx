import EducationWorkshopArchivePage from "@/components/education/EducationWorkshopArchivePage";
import ForestOfferCollectionPage from "@/components/offers/ForestOfferCollectionPage";
import OfferListPage from "@/components/offers/OfferListPage";
import { fetchOffers, fetchSiteConfig } from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { buildEducationWorkshopCollection, fetchForestFeaturedWorkshops } from "@/lib/education-workshops";
import { isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function WorkshopsPage() {
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const isForest = siteConfig ? isForestCenter(siteConfig.centerSlug) : false;

  if (isForest) {
    return (
      <ForestOfferCollectionPage
        config={{
          offerTypes: ["WORKSHOP", "TRAINING_INFO"],
          fallbackHeading: "Workshops & Trainings",
        }}
      />
    );
  }

  if (siteConfig?.siteSlug === "feldenkrais-education") {
    const locale = await getRequestLocale(siteConfig.defaultLocale);
    const page =
      (await resolveEducationNarrativePage(hostname, "workshops", locale)) ?? {
        routeKey: "workshops",
        locale,
        title: "Workshops",
        subtitle: "",
        hero: {
          title: "Workshops",
          body: "",
          imageUrl: null,
        },
        sections: [],
        primaryCta: null,
        seo: undefined,
      };
    const offers = await fetchOffers({
      hostname,
      center: siteConfig.centerSlug,
      type: "WORKSHOP",
      locale,
    }).catch(() => []);
    const forestWorkshops = await fetchForestFeaturedWorkshops(locale).catch(() => []);
    const upcomingWorkshops = buildEducationWorkshopCollection(locale, offers, forestWorkshops);

    return <EducationWorkshopArchivePage locale={locale} page={page} upcomingWorkshops={upcomingWorkshops} />;
  }

  return <OfferListPage heading="Workshops" offerType="WORKSHOP" routeKey="workshops" />;
}
