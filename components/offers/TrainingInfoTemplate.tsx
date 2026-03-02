import type { OfferDetail } from "@/lib/types";

import OfferTemplateBase from "./OfferTemplateBase";

type TrainingInfoTemplateProps = {
  offer: OfferDetail;
  locale: string;
};

export default function TrainingInfoTemplate({ offer, locale }: TrainingInfoTemplateProps) {
  const typeLabel = locale.toLowerCase().startsWith("fr") ? "Formation" : "Training";

  return <OfferTemplateBase locale={locale} offer={offer} showScheduleCards={false} typeLabel={typeLabel} />;
}
