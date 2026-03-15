export const FOREST_PAGE_MEDIA = {
  about: "/brands/forest-lighthouse/photos/forest-lighthouse-evening.jpg",
  calendar: "/brands/forest-lighthouse/photos/DSC00594.jpg",
  classes: "/brands/forest-lighthouse/photos/DSC00137.jpg",
  contact: "/brands/forest-lighthouse/photos/DSC02156.JPG",
  domains: "/brands/forest-lighthouse/photos/DSC04924.jpg",
  privateSessions: "/brands/forest-lighthouse/photos/forest-lighthouse-evening.jpg",
  rent: "/brands/forest-lighthouse/home/main-hall-wide.jpg",
  trainings: "/brands/forest-lighthouse/photos/DSC01120.JPG",
  visit: "/brands/forest-lighthouse/home/terrace.jpg",
  workshops: "/brands/forest-lighthouse/photos/DSC02374.jpg",
} as const;

export function isForestCenter(centerSlug: string | null | undefined) {
  return centerSlug === "forest-lighthouse";
}
