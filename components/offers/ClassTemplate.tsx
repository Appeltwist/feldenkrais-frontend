import type { OfferDetail } from "@/lib/types";

import OfferTemplateBase from "./OfferTemplateBase";

type ClassTemplateProps = {
  offer: OfferDetail;
  locale: string;
};

export default function ClassTemplate({ offer, locale }: ClassTemplateProps) {
  const typeLabel = locale.toLowerCase().startsWith("fr") ? "Cours" : "Class";

  return <OfferTemplateBase locale={locale} offer={offer} showScheduleCards typeLabel={typeLabel} />;
}
