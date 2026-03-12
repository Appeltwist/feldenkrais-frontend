import ForestOfferCollectionPage from "@/components/offers/ForestOfferCollectionPage";
import OfferListPage from "@/components/offers/OfferListPage";
import { fetchSiteConfig } from "@/lib/api";
import { isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";

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

  return <OfferListPage heading="Workshops" offerType="WORKSHOP" />;
}
