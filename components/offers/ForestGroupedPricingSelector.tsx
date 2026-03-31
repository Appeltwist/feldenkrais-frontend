"use client";

import { useState } from "react";

import { isExternalHref } from "@/lib/locale-path";
import { normalizeText, pickString } from "@/lib/offers";
import type { OfferType, PricingGroup } from "@/lib/types";

type ForestGroupedPricingSelectorProps = {
  availableActionLabel: string;
  groups: PricingGroup[];
  locale: string;
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

function getSelectPlaceholder(locale: string) {
  return locale.toLowerCase().startsWith("fr") ? "Choisir un tarif" : "Select a tier";
}

function getSelectLabel(locale: string, offerType: OfferType) {
  if (locale.toLowerCase().startsWith("fr")) {
    return offerType === "WORKSHOP" ? "Choisissez votre tarif" : "Choisissez une option tarifaire";
  }

  return offerType === "WORKSHOP" ? "Choose your pricing tier" : "Choose a pricing option";
}

export default function ForestGroupedPricingSelector({
  availableActionLabel,
  groups,
  locale,
  offerType,
  waitlistActionLabel,
}: ForestGroupedPricingSelectorProps) {
  const [selectedTierByGroup, setSelectedTierByGroup] = useState<Record<string, string>>({});
  const selectPlaceholder = getSelectPlaceholder(locale);
  const selectLabel = getSelectLabel(locale, offerType);

  return (
    <div className="forest-pricing-compact__list forest-pricing-compact__list--grouped">
      {groups.map((group, groupIndex) => {
        const groupRecord = group as Record<string, unknown>;
        const groupKey = getGroupKey(group, groupIndex);
        const groupHeading = getGroupHeading(group, groupIndex, groups.length);
        const groupIsSoldOut = groupRecord.is_sold_out === true;
        const waitlistUrl = getWaitlistUrl(group);
        const tiers = Array.isArray(group.tiers) ? group.tiers : [];
        const selectedTierId = selectedTierByGroup[groupKey] ?? "";
        const selectedTier = tiers.find((tier) => String(tier.tier_id ?? "") === selectedTierId) ?? null;
        const selectedTierUrl = selectedTier ? pickString(selectedTier as Record<string, unknown>, ["booking_url", "bookingUrl"]) : "";
        const actionLabel = groupIsSoldOut ? waitlistActionLabel : availableActionLabel;
        const actionUrl = groupIsSoldOut ? waitlistUrl : selectedTierUrl;
        const actionDisabled = !actionUrl;
        const external = actionUrl ? isExternalHref(actionUrl) : false;

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

            {!groupIsSoldOut && tiers.length > 0 ? (
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
                    {tiers.map((tier) => {
                      const tierRecord = tier as Record<string, unknown>;
                      const tierId = String(tier.tier_id ?? "");
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
