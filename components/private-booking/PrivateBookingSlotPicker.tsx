"use client";

import { useMemo } from "react";

import type { PrivateBookingSlot } from "@/lib/private-booking";

type PrivateBookingSlotPickerProps = {
  title: string;
  description?: string | null;
  emptyMessage: string;
  error?: string;
  loading?: boolean;
  loadingMessage?: string;
  selectedSlot: string;
  slots: PrivateBookingSlot[];
  onSelect: (value: string) => void;
};

export default function PrivateBookingSlotPicker({
  title,
  description,
  emptyMessage,
  error = "",
  loading = false,
  loadingMessage = "Loading available times…",
  selectedSlot,
  slots,
  onSelect,
}: PrivateBookingSlotPickerProps) {
  const groupedSlots = useMemo(() => {
    const groups = new Map<string, PrivateBookingSlot[]>();

    for (const slot of slots) {
      const current = groups.get(slot.date_label) ?? [];
      current.push(slot);
      groups.set(slot.date_label, current);
    }

    return Array.from(groups.entries());
  }, [slots]);

  return (
    <section className="private-booking-card private-booking-slot-card">
      <div className="private-booking-section-heading">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>

      {loading ? <p className="private-booking-muted">{loadingMessage}</p> : null}
      {!loading && error ? <p className="private-booking-banner private-booking-banner--error">{error}</p> : null}
      {!loading && !error && slots.length === 0 ? <p className="private-booking-muted">{emptyMessage}</p> : null}

      {!loading && !error && groupedSlots.length > 0 ? (
        <div className="private-booking-slot-groups">
          {groupedSlots.map(([dateLabel, group]) => (
            <div className="private-booking-slot-group" key={dateLabel}>
              <h3>{dateLabel}</h3>
              <div className="private-booking-slot-buttons">
                {group.map((slot) => {
                  const isSelected = selectedSlot === slot.start_datetime;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={isSelected ? "private-booking-slot is-selected" : "private-booking-slot"}
                      key={slot.start_datetime}
                      onClick={() => onSelect(slot.start_datetime)}
                      type="button"
                    >
                      {slot.time_label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
