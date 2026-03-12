import ForestOfferCollectionPage from "@/components/offers/ForestOfferCollectionPage";
import OfferListPage from "@/components/offers/OfferListPage";
import { fetchSiteConfig } from "@/lib/api";
import { isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";

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

  return <OfferListPage heading="Individual Sessions" offerType="PRIVATE_SESSION" />;
}
