const FOREST_FACILITATOR_NAME_OVERRIDES: Record<string, readonly string[]> = {};

export function getForestFacilitatorNamesOverride(slug: string | null | undefined) {
  if (!slug) {
    return null;
  }

  return FOREST_FACILITATOR_NAME_OVERRIDES[slug as keyof typeof FOREST_FACILITATOR_NAME_OVERRIDES] ?? null;
}
