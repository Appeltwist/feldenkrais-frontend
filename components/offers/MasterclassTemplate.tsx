import type { OfferDetail } from "@/lib/types";

import OfferTemplateBase from "./OfferTemplateBase";

type MasterclassTemplateProps = {
  offer: OfferDetail;
  locale: string;
};

export default function MasterclassTemplate({ offer, locale }: MasterclassTemplateProps) {
  const typeLabel = locale.toLowerCase().startsWith("fr") ? "Masterclass" : "Masterclass";

  return <OfferTemplateBase locale={locale} offer={offer} showScheduleCards={false} typeLabel={typeLabel} />;
}
