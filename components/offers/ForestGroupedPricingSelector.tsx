"use client";

import { useState } from "react";

import { isExternalHref } from "@/lib/locale-path";
import { asRecord, compareOccurrenceStart, getPricingGroupTiers, normalizeText, pickString } from "@/lib/offers";
import type { Occurrence, OfferType, PricingGroup, PricingGroupTier } from "@/lib/types";

type ForestGroupedPricingSelectorProps = {
  availableActionLabel: string;
  groups: PricingGroup[];
  locale: string;
  occurrences?: Occurrence[];
  offerType: OfferType;
  waitlistActionLabel: string;
};

function formatOfferMoney(amount: unknown, currency: unknown) {
  return [normalizeText(amount), normalizeText(currency)].filter(Boolean).join(" ");
}

function getGroupKey(group: PricingGroup, index: number) {
  return String(group.pricing_group_id ?? group.group_id ?? index);
}

function getGroupHeading(group: PricingGroup, index: number, totalGroups: number) {
  const record = group as Record<string, unknown>;
  const dateSummary = pickString(record, ["date_summary", "dateSummary"]);
  if (dateSummary) {
    return dateSummary;
  }

  if (totalGroups <= 1) {
    return "";
  }

  return `Option ${index + 1}`;
}

function getWaitlistUrl(group: PricingGroup) {
  const record = group as Record<string, unknown>;
  return pickString(record, [
    "waitlist_endpoint",
    "waitlistEndpoint",
    "booking_url",
    "bookingUrl",
    "waitlist_url",
    "waitlistUrl",
  ]);
}

function getBookingUrl(group: PricingGroup) {
  const record = group as Record<string, unknown>;
  return pickString(record, ["booking_url", "bookingUrl"]);
}

function getTierKey(tier: PricingGroupTier, index: number) {
  const record = tier as Record<string, unknown>;
  const explicitKey = record.tier_id ?? record.booking_url ?? record.bookingUrl;
  if (explicitKey !== undefined && explicitKey !== null && String(explicitKey).trim()) {
    return String(explicitKey);
  }

  const label = pickString(record, ["label", "name", "title"], "tier");
  return `${label}-${index}`;
}

function getSelectPlaceholder(locale: string) {
  return locale.toLowerCase().startsWith("fr") ? "Choisir un tarif" : "Select a tier";
}

function getSelectLabel(locale: string, offerType: OfferType) {
  if (locale.toLowerCase().startsWith("fr")) {
    return offerType === "WORKSHOP" ? "Choisissez votre tarif" : "Choisissez une option tarifaire";
  }

  return offerType === "WORKSHOP" ? "Choose your pricing tier" : "Choose a pricing option";
}

function parseCompactDate(dateStr: string, locale: string, timezone?: string | null) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat(locale || "en", {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(timezone ? { timeZone: timezone } : {}),
  }).formatToParts(date);

  const lookup = parts.reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  return {
    dayOfWeek: lookup.weekday ?? "",
    dayNum: lookup.day ?? "",
    month: lookup.month ?? "",
  };
}

function normalizeOccurrenceMatchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(workshop|atelier|session|cours|class)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatLinkedOccurrenceLine(
  occurrence: Record<string, unknown>,
  locale: string,
) {
  const start = pickString(occurrence, ["start_datetime", "start", "start_at", "datetime", "date"]);
  if (!start) {
    return "";
  }

  const timezone = pickString(occurrence, ["timezone", "tz", "time_zone"]) || undefined;
  const compact = parseCompactDate(start, locale, timezone);
  if (!compact) {
    return "";
  }

  return [compact.dayOfWeek, compact.dayNum, compact.month].filter(Boolean).join(" ");
}

function resolveLinkedPricingGroupOccurrences(
  groupRecord: Record<string, unknown>,
  offerOccurrences: Record<string, unknown>[],
  totalGroups: number,
) {
  const sortedOccurrences = [...offerOccurrences].sort(compareOccurrenceStart);
  const now = Date.now();
  const futureOccurrences = sortedOccurrences.filter((occurrence) => {
    const start = pickString(occurrence, ["start_datetime", "start", "start_at", "datetime", "date"]);
    if (!start) {
      return false;
    }
    const parsed = Date.parse(start);
    return Number.isFinite(parsed) ? parsed >= now : false;
  });
  const candidateOccurrences = futureOccurrences.length > 0 ? futureOccurrences : sortedOccurrences;

  const linkedOccurrenceIds = Array.isArray(groupRecord.occurrence_ids)
    ? groupRecord.occurrence_ids.map((value) => normalizeText(value)).filter(Boolean)
    : [];
  if (linkedOccurrenceIds.length > 0) {
    const idSet = new Set(linkedOccurrenceIds);
    return candidateOccurrences.filter((occurrence) => idSet.has(normalizeText(occurrence.id)));
  }

  const candidates = [
    pickString(groupRecord, ["summary"]),
    pickString(groupRecord, ["label", "name", "title"]),
    pickString(groupRecord, ["date_summary", "dateSummary"]),
  ]
    .map(normalizeOccurrenceMatchText)
    .filter(Boolean);

  if (candidates.length > 0) {
    const matched = candidateOccurrences.filter((occurrence) => {
      const occurrenceLabel = normalizeOccurrenceMatchText(
        pickString(occurrence, ["label", "label_override", "labelOverride"]),
      );
      if (!occurrenceLabel) {
        return false;
      }
      return candidates.some((candidate) => candidate.includes(occurrenceLabel) || occurrenceLabel.includes(candidate));
    });

    if (matched.length > 0) {
      return matched;
    }
  }

  if (totalGroups === 1) {
    return candidateOccurrences;
  }

  return [] as Record<string, unknown>[];
}

export default function ForestGroupedPricingSelector({
  availableActionLabel,
  groups,
  locale,
  occurrences = [],
  offerType,
  waitlistActionLabel,
}: ForestGroupedPricingSelectorProps) {
  const [selectedTierByGroup, setSelectedTierByGroup] = useState<Record<string, string>>({});
  const selectPlaceholder = getSelectPlaceholder(locale);
  const selectLabel = getSelectLabel(locale, offerType);
  const offerOccurrences = occurrences
    .map((occurrence) => asRecord(occurrence))
    .filter((occurrence): occurrence is Record<string, unknown> => occurrence !== null);

  return (
    <div className="forest-pricing-compact__list forest-pricing-compact__list--grouped">
      {groups.map((group, groupIndex) => {
        const groupRecord = group as Record<string, unknown>;
        const groupKey = getGroupKey(group, groupIndex);
        const groupHeading = getGroupHeading(group, groupIndex, groups.length);
        const groupIsSoldOut = groupRecord.is_sold_out === true;
        const waitlistUrl = getWaitlistUrl(group);
        const groupBookingUrl = getBookingUrl(group);
        const tiers = getPricingGroupTiers(group);
        const hasTierChoice = !groupIsSoldOut && tiers.length > 1;
        const selectedTierId = selectedTierByGroup[groupKey] ?? "";
        const defaultTier = !groupIsSoldOut && tiers.length === 1 ? tiers[0] : null;
        const selectedTier = hasTierChoice
          ? tiers.find((tier, tierIndex) => getTierKey(tier, tierIndex) === selectedTierId) ?? null
          : defaultTier;
        const selectedTierRecord = selectedTier as Record<string, unknown> | null;
        const selectedTierUrl = selectedTierRecord ? pickString(selectedTierRecord, ["booking_url", "bookingUrl"]) : "";
        const directTierLabel = selectedTierRecord ? pickString(selectedTierRecord, ["label", "name", "title"], "Tier") : "";
        const directTierAmount = selectedTierRecord
          ? formatOfferMoney(
              selectedTierRecord.amount ?? selectedTierRecord.price ?? selectedTierRecord.value ?? selectedTierRecord.formatted,
              selectedTierRecord.currency ?? selectedTierRecord.currency_code,
            )
          : "";
        const actionLabel = groupIsSoldOut ? waitlistActionLabel : availableActionLabel;
        const actionUrl = groupIsSoldOut ? waitlistUrl : selectedTierUrl || groupBookingUrl;
        const actionDisabled = !actionUrl;
        const external = actionUrl ? isExternalHref(actionUrl) : false;
        const linkedOccurrences = resolveLinkedPricingGroupOccurrences(groupRecord, offerOccurrences, groups.length);
        const occurrenceLines = linkedOccurrences
          .map((occurrence) => formatLinkedOccurrenceLine(occurrence, locale))
          .filter(Boolean);
        const visibleOccurrenceLines = occurrenceLines.slice(0, 3);
        const remainingOccurrenceCount = occurrenceLines.length - visibleOccurrenceLines.length;

        return (
          <section className="forest-pricing-compact__group" key={groupKey}>
            {(groupHeading || groupIsSoldOut) ? (
              <div className={`forest-pricing-compact__group-head${groupHeading ? "" : " forest-pricing-compact__group-head--status-only"}`}>
                {groupHeading ? <span className="forest-pricing-compact__group-label">{groupHeading}</span> : null}
                {groupIsSoldOut ? (
                  <span className="forest-pricing-compact__group-status">
                    {locale.toLowerCase().startsWith("fr") ? "Complet" : "Sold out"}
                  </span>
                ) : null}
              </div>
            ) : null}
            {visibleOccurrenceLines.length > 0 ? (
              <div className="forest-pricing-compact__occurrences forest-pricing-compact__occurrences--group">
                {visibleOccurrenceLines.map((occurrenceLine, occurrenceIndex) => (
                  <span
                    className="forest-pricing-compact__occurrence"
                    key={`${groupKey}-occurrence-${occurrenceIndex}`}
                  >
                    {occurrenceLine}
                  </span>
                ))}
                {remainingOccurrenceCount > 0 ? (
                  <span className="forest-pricing-compact__occurrence forest-pricing-compact__occurrence--more">
                    {locale.toLowerCase().startsWith("fr")
                      ? `+${remainingOccurrenceCount} autre${remainingOccurrenceCount > 1 ? "s" : ""} date${remainingOccurrenceCount > 1 ? "s" : ""}`
                      : `+${remainingOccurrenceCount} more date${remainingOccurrenceCount > 1 ? "s" : ""}`}
                  </span>
                ) : null}
              </div>
            ) : null}

            {hasTierChoice ? (
              <label className="forest-pricing-compact__select-field">
                <span className="sr-only">{selectLabel}</span>
                <div className="forest-pricing-compact__select-wrap">
                  <select
                    aria-label={selectLabel}
                    className="forest-pricing-compact__select"
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setSelectedTierByGroup((current) => ({
                        ...current,
                        [groupKey]: nextValue,
                      }));
                    }}
                    value={selectedTierId}
                  >
                    <option value="">{selectPlaceholder}</option>
                    {tiers.map((tier, tierIndex) => {
                      const tierRecord = tier as Record<string, unknown>;
                      const tierId = getTierKey(tier, tierIndex);
                      const tierLabel = pickString(tierRecord, ["label", "name", "title"], "Tier");
                      const tierAmount = formatOfferMoney(
                        tierRecord.amount ?? tierRecord.price ?? tierRecord.value ?? tierRecord.formatted,
                        tierRecord.currency ?? tierRecord.currency_code,
                      );
                      const optionLabel = tierAmount ? `${tierLabel} · ${tierAmount}` : tierLabel;

                      return (
                        <option key={tierId || optionLabel} value={tierId}>
                          {optionLabel}
                        </option>
                      );
                    })}
                  </select>
                  <span aria-hidden="true" className="forest-pricing-compact__select-icon">
                    ▾
                  </span>
                </div>
              </label>
            ) : !groupIsSoldOut && selectedTierRecord ? (
              <div className="forest-pricing-compact__group-tier">
                <div className="forest-pricing-compact__copy">
                  <span className="forest-pricing-compact__label">{directTierLabel}</span>
                </div>
                {directTierAmount ? <span className="forest-pricing-compact__amount">{directTierAmount}</span> : null}
              </div>
            ) : null}

            <div className="forest-pricing-compact__group-action">
              {actionDisabled ? (
                <button className="forest-pricing-compact__row-cta forest-pricing-compact__row-cta--disabled" disabled type="button">
                  {actionLabel}
                </button>
              ) : (
                <a
                  className="forest-pricing-compact__row-cta forest-pricing-compact__row-cta--primary"
                  href={actionUrl}
                  rel={external ? "noreferrer" : undefined}
                  target={external ? "_blank" : undefined}
                >
                  {actionLabel}
                </a>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
