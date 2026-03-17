export function cleanDisplayText(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .replace(/(?:En savoir plus|Read more)\b.*$/i, "")
    .replace(/([.!?;:])(?=[A-ZÀ-ÖØ-Þ])/g, "$1 ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/(?:\.{3}|…)\s*$/u, "")
    .trim();
}

export function cleanRichTextHtml(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value
    .replace(/<p>\s*(En savoir plus|Read more)\s*<\/p>[\s\S]*$/i, "")
    .replace(/([.!?;:])(?=[A-ZÀ-ÖØ-Þ])/g, "$1 ")
    .replace(/(?:\.{3}|…)\s*(<\/p>\s*)$/giu, "$1")
    .trim();
}

export function isFacilitatorOnlySubtitle(value: string | null | undefined) {
  const cleaned = cleanDisplayText(value);
  return /^(w\/|with\s+|avec\s+)/i.test(cleaned);
}
