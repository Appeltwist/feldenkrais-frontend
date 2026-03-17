import type { OfferDetail } from "@/lib/types";

import OfferTemplateBase from "./OfferTemplateBase";

type PrivateSessionTemplateProps = {
  offer: OfferDetail;
  locale: string;
};

export default function PrivateSessionTemplate({ offer, locale }: PrivateSessionTemplateProps) {
  const typeLabel = locale.toLowerCase().startsWith("fr") ? "Séance individuelle" : "Individual session";

  return <OfferTemplateBase locale={locale} offer={offer} showScheduleCards={false} typeLabel={typeLabel} />;
}
