const FOREST_FACILITATOR_NAME_OVERRIDES = {} as const;

export function getForestFacilitatorNamesOverride(slug: string | null | undefined) {
  if (!slug) {
    return null;
  }

  return FOREST_FACILITATOR_NAME_OVERRIDES[slug as keyof typeof FOREST_FACILITATOR_NAME_OVERRIDES] ?? null;
}
