import { getOfferLabels, resolveLocale } from "@/lib/i18n";
import type { QuickFacts as QuickFactsData } from "@/lib/types";

type QuickFactsProps = {
  quickFacts: QuickFactsData | null;
  locale: string;
};

const ROW_LABELS = {
  fr: {
    venue: "Lieu",
    location: "Adresse",
    languages: "Langues",
    level: "Niveau",
    duration: "Dur\u00e9e",
    price_note: "Note tarif",
    facilitator_note: "Note intervenant\u00b7e",
  },
  en: {
    venue: "Venue",
    location: "Location",
    languages: "Languages",
    level: "Level",
    duration: "Duration",
    price_note: "Pricing note",
    facilitator_note: "Facilitator note",
  },
};

export default function QuickFacts({ quickFacts, locale }: QuickFactsProps) {
  if (!quickFacts) {
    return null;
  }

  const localeCode = resolveLocale(locale);
  const labels = getOfferLabels(localeCode);
  const rowLabels = ROW_LABELS[localeCode];

  const rows = [
    { key: "venue", label: rowLabels.venue, value: quickFacts.venue },
    { key: "location", label: rowLabels.location, value: quickFacts.location },
    { key: "languages", label: rowLabels.languages, value: quickFacts.languages },
    { key: "level", label: rowLabels.level, value: quickFacts.level },
    { key: "duration", label: rowLabels.duration, value: quickFacts.duration },
    { key: "price_note", label: rowLabels.price_note, value: quickFacts.price_note },
    { key: "facilitator_note", label: rowLabels.facilitator_note, value: quickFacts.facilitator_note },
  ].filter((row) => typeof row.value === "string" && row.value.trim().length > 0);

  if (rows.length === 0) {
    return null;
  }

  return (
    <section className="offer-quick-facts">
      <h2>{labels.quickFacts}</h2>
      <dl className="quick-facts-grid">
        {rows.map((row) => (
          <div className="quick-facts-row" key={row.key}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
