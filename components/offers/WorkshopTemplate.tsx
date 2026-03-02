import type { OfferDetail } from "@/lib/types";

import OfferTemplateBase from "./OfferTemplateBase";

type WorkshopTemplateProps = {
  offer: OfferDetail;
  locale: string;
};

export default function WorkshopTemplate({ offer, locale }: WorkshopTemplateProps) {
  const typeLabel = locale.toLowerCase().startsWith("fr") ? "Atelier" : "Workshop";

  return <OfferTemplateBase locale={locale} offer={offer} showScheduleCards typeLabel={typeLabel} />;
}
