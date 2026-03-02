import { getOfferLabels } from "@/lib/i18n";
import type { ThemeTag } from "@/lib/types";

type ThemesPillsProps = {
  themes: ThemeTag[];
  locale: string;
};

export default function ThemesPills({ themes, locale }: ThemesPillsProps) {
  if (themes.length === 0) {
    return null;
  }

  const labels = getOfferLabels(locale);

  return (
    <section>
      <h2>{labels.themes}</h2>
      <ul className="tag-list">
        {themes.map((theme) => (
          <li key={String(theme.id)}>{theme.name}</li>
        ))}
      </ul>
    </section>
  );
}
