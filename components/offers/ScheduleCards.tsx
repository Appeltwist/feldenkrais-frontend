import { getOfferLabels } from "@/lib/i18n";
import { formatDateTime } from "@/lib/offers";
import type { ScheduleCard } from "@/lib/types";

type ScheduleCardsProps = {
  cards: ScheduleCard[];
  locale: string;
};

export default function ScheduleCards({ cards, locale }: ScheduleCardsProps) {
  const normalizedCards = cards.filter((card) =>
    [card.date_label, card.start_datetime, card.end_datetime, card.timezone].some(
      (value) => typeof value === "string" && value.trim().length > 0,
    ),
  );

  if (normalizedCards.length === 0) {
    return null;
  }

  const labels = getOfferLabels(locale);

  return (
    <section>
      <h2>{labels.upcomingDates}</h2>
      <div className="cards">
        {normalizedCards.map((card, index) => {
          const start = formatDateTime(card.start_datetime ?? "", locale, card.timezone ?? undefined);
          const end = formatDateTime(card.end_datetime ?? "", locale, card.timezone ?? undefined);
          const label = typeof card.date_label === "string" ? card.date_label.trim() : "";
          const timeLine = [start, end].filter(Boolean).join(" -> ");
          const facilitatorName =
            typeof card.facilitator?.display_name === "string" ? card.facilitator.display_name.trim() : "";

          return (
            <article className="card" key={`${label || timeLine || "schedule"}-${index}`}>
              {label ? <h3>{label}</h3> : null}
              {timeLine ? <p>{timeLine}</p> : null}
              {facilitatorName ? <p>{facilitatorName}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
