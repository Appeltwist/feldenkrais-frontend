/**
 * Forest Lighthouse — MindBody booking URL overrides
 *
 * Temporary hard-coded mapping that replaces the API-provided `primary_cta`
 * URLs with direct MindBody links.
 *
 * • All CLASS offers → generic MindBody class schedule page
 * • WORKSHOP / TRAINING_INFO offers → per-enrollment cart links (matched by title)
 */

import type { OfferDetail, OfferSummary } from "@/lib/types";
import { getOfferTitle, getOfferType } from "@/lib/offers";

/* ── classes ── */

const FOREST_CLASS_BOOKING_URL =
  "http://clients.mindbodyonline.com/classic/mainclass?fl=true&tabID=7";

/* ── workshops ── */

function mbCartUrl(id: number): string {
  return `https://cart.mindbodyonline.com/sites/124505/cart/add_booking?item[class_schedule_id]=${id}&item[mbo_id]=${id}&item[type]=Enrollment&item[mbo_location_id]=1`;
}

/**
 * Each entry matches by case-insensitive substring of the offer title.
 * For workshops with duplicate titles but different dates, the first match is
 * used (the next upcoming enrollment). Entries are ordered chronologically.
 */
const FOREST_WORKSHOP_BOOKINGS: Array<{ titleMatch: string; url: string }> = [
  // Gaga People (2 dates — first match = next upcoming)
  { titleMatch: "gaga people", url: mbCartUrl(52) },
  // Gaga Dancer (2 dates — first match = next upcoming)
  { titleMatch: "gaga dancer", url: mbCartUrl(54) },
  // Gaga & Les Oiseaux
  { titleMatch: "oiseaux", url: mbCartUrl(64) },
  // Making Smaller Circles / Faire des cercles plus petits
  { titleMatch: "smaller circles", url: mbCartUrl(58) },
  { titleMatch: "cercles plus petits", url: mbCartUrl(58) },
  // Child'Space Shelhav / Étapes du développement moteur
  { titleMatch: "child'space", url: mbCartUrl(56) },
  { titleMatch: "childspace", url: mbCartUrl(56) },
  { titleMatch: "shelhav", url: mbCartUrl(56) },
  { titleMatch: "veloppement moteur", url: mbCartUrl(56) },
  // The practitioner's vocal toolkit / La boite a outils vocale
  { titleMatch: "vocal toolkit", url: mbCartUrl(63) },
  { titleMatch: "outils vocale", url: mbCartUrl(63) },
  // Feldenkrais & Musicians / Feldenkrais pour les musiciens
  { titleMatch: "feldenkrais & musicians", url: mbCartUrl(57) },
  { titleMatch: "feldenkrais musicians", url: mbCartUrl(57) },
  { titleMatch: "feldenkrais pour les musicien", url: mbCartUrl(57) },
  { titleMatch: "feldenkrais pour musicien", url: mbCartUrl(57) },
  // Bones for Life diploma training / formation diplômante
  { titleMatch: "bones for life", url: mbCartUrl(65) },
];

/* ── public API ── */

/**
 * Returns a MindBody booking URL override for the given offer, or `null` if
 * no override applies (so the caller can fall back to the API's primary CTA).
 */
export function getForestBookingUrl(offer: OfferDetail | OfferSummary): string | null {
  const offerType = getOfferType(offer);

  if (offerType === "CLASS") {
    return FOREST_CLASS_BOOKING_URL;
  }

  if (offerType === "WORKSHOP" || offerType === "TRAINING_INFO") {
    const title = (getOfferTitle(offer) ?? "").toLowerCase();
    for (const entry of FOREST_WORKSHOP_BOOKINGS) {
      if (title.includes(entry.titleMatch)) {
        return entry.url;
      }
    }
  }

  return null;
}
