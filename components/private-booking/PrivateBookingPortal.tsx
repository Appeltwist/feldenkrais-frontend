"use client";

import { useEffect, useMemo, useState } from "react";

import { getPrivateBookingLabels, resolveLocale } from "@/lib/i18n";
import type {
  PrivateBookingAvailability,
  PrivateBookingConfig,
  PrivateBookingPackageSummary,
  PrivateBookingSummary,
} from "@/lib/types";

type PrivateBookingPortalProps = {
  hostname: string;
  centerSlug: string;
  token: string;
  locale: string;
};

type JsonRecord = Record<string, unknown>;

function asErrorDetail(value: unknown, fallback: string) {
  if (!value || typeof value !== "object") {
    return fallback;
  }
  const record = value as JsonRecord;
  if (typeof record.detail === "string" && record.detail.trim()) {
    return record.detail.trim();
  }
  for (const entry of Object.values(record)) {
    if (typeof entry === "string" && entry.trim()) {
      return entry.trim();
    }
    if (Array.isArray(entry) && entry.length > 0 && typeof entry[0] === "string") {
      return String(entry[0]);
    }
  }
  return fallback;
}

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

function formatDateTime(value: string, locale: string, timezone?: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: timezone || "Europe/Brussels",
  }).format(new Date(value));
}

function formatMoney(value: string | number, currency: string, locale: string) {
  const amount = typeof value === "number" ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(amount)) {
    return `${value} ${currency}`;
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function PrivateBookingPortal({
  hostname,
  centerSlug,
  token,
  locale,
}: PrivateBookingPortalProps) {
  const localeCode = resolveLocale(locale);
  const labels = getPrivateBookingLabels(localeCode);
  const [booking, setBooking] = useState<PrivateBookingSummary | null>(null);
  const [pkg, setPkg] = useState<PrivateBookingPackageSummary | null>(null);
  const [config, setConfig] = useState<PrivateBookingConfig | null>(null);
  const [availability, setAvailability] = useState<PrivateBookingAvailability | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedPackageOptionId, setSelectedPackageOptionId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const bookingPath = `/api/private-booking/bookings/${encodeURIComponent(token)}?hostname=${encodeURIComponent(hostname)}&center=${encodeURIComponent(centerSlug)}&locale=${encodeURIComponent(localeCode)}`;
  const packagePath = `/api/private-booking/packages/${encodeURIComponent(token)}?hostname=${encodeURIComponent(hostname)}&center=${encodeURIComponent(centerSlug)}&locale=${encodeURIComponent(localeCode)}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const bookingResponse = await fetch(bookingPath, { cache: "no-store" });
        if (bookingResponse.ok) {
          const bookingPayload = await readJson<PrivateBookingSummary>(bookingResponse);
          if (!cancelled) {
            setBooking(bookingPayload);
            setPkg(null);
          }
          return;
        }

        const packageResponse = await fetch(packagePath, { cache: "no-store" });
        const packagePayload = await readJson<PrivateBookingPackageSummary | JsonRecord>(packageResponse);
        if (!packageResponse.ok) {
          throw new Error(asErrorDetail(packagePayload, labels.unavailable));
        }
        if (!cancelled) {
          setPkg(packagePayload as PrivateBookingPackageSummary);
          setBooking(null);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : labels.unavailable);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [bookingPath, packagePath, labels.unavailable]);

  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      const offerSlug = booking?.offer_slug ?? pkg?.offer_slug;
      if (!offerSlug) {
        return;
      }
      const packageToken = booking?.package_token ?? pkg?.token ?? "";
      const response = await fetch(
        `/api/private-booking/config/${encodeURIComponent(offerSlug)}?hostname=${encodeURIComponent(hostname)}&center=${encodeURIComponent(centerSlug)}&locale=${encodeURIComponent(localeCode)}${packageToken ? `&package_token=${encodeURIComponent(packageToken)}` : ""}`,
        { cache: "no-store" },
      );
      const data = await readJson<PrivateBookingConfig | JsonRecord>(response);
      if (!response.ok) {
        if (!cancelled) {
          setError(asErrorDetail(data, labels.unavailable));
        }
        return;
      }
      if (!cancelled) {
        const configPayload = data as PrivateBookingConfig;
        setConfig(configPayload);
        setSelectedPackageOptionId(
          configPayload.package?.package_option_id
            ?? configPayload.package_options.find((option) => option.is_default)?.id
            ?? configPayload.package_options[0]?.id
            ?? null,
        );
      }
    }

    void loadConfig();
    return () => {
      cancelled = true;
    };
  }, [booking?.offer_slug, booking?.package_token, centerSlug, hostname, labels.unavailable, localeCode, pkg?.offer_slug, pkg?.token, pkg?.package_option_id]);

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      if (booking?.can_reschedule) {
        const response = await fetch(
          `/api/private-booking/availability?hostname=${encodeURIComponent(hostname)}&center=${encodeURIComponent(centerSlug)}&locale=${encodeURIComponent(localeCode)}&booking_token=${encodeURIComponent(booking.token)}`,
          { cache: "no-store" },
        );
        const data = await readJson<PrivateBookingAvailability | JsonRecord>(response);
        if (!response.ok) {
          if (!cancelled) {
            setError(asErrorDetail(data, labels.noSlots));
          }
          return;
        }
        if (!cancelled) {
          setAvailability(data as PrivateBookingAvailability);
        }
        return;
      }

      const activePackageToken = pkg?.token;
      if (!activePackageToken || !selectedPackageOptionId || !config) {
        setAvailability(null);
        return;
      }
      if (config.flow_stage === "intro_pending") {
        setAvailability(null);
        return;
      }

      const response = await fetch(
        `/api/private-booking/availability?hostname=${encodeURIComponent(hostname)}&center=${encodeURIComponent(centerSlug)}&locale=${encodeURIComponent(localeCode)}&package_token=${encodeURIComponent(activePackageToken)}&package_option_id=${selectedPackageOptionId}`,
        { cache: "no-store" },
      );
      const data = await readJson<PrivateBookingAvailability | JsonRecord>(response);
      if (!response.ok) {
        if (!cancelled) {
          setError(asErrorDetail(data, labels.noSlots));
        }
        return;
      }
      if (!cancelled) {
        setAvailability(data as PrivateBookingAvailability);
      }
    }

    void loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [booking, centerSlug, config, hostname, labels.noSlots, localeCode, pkg, selectedPackageOptionId]);

  const activePackage = useMemo(() => booking?.package ?? pkg ?? null, [booking, pkg]);

  async function postAndRefresh(url: string, body: Record<string, unknown>) {
    setWorking(true);
    setError("");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await readJson<PrivateBookingSummary | JsonRecord>(response);
      if (!response.ok) {
        throw new Error(asErrorDetail(data, labels.unavailable));
      }
      setBooking(data as PrivateBookingSummary);
      setPkg(null);
      setSelectedSlot("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : labels.unavailable);
    } finally {
      setWorking(false);
    }
  }

  async function handleReschedule() {
    if (!booking || !selectedSlot) {
      return;
    }
    await postAndRefresh(
      `/api/private-booking/bookings/${encodeURIComponent(booking.token)}/reschedule?hostname=${encodeURIComponent(hostname)}&center=${encodeURIComponent(centerSlug)}&locale=${encodeURIComponent(localeCode)}`,
      { start_datetime: selectedSlot },
    );
  }

  async function handleCancel() {
    if (!booking) {
      return;
    }
    await postAndRefresh(
      `/api/private-booking/bookings/${encodeURIComponent(booking.token)}/cancel?hostname=${encodeURIComponent(hostname)}&center=${encodeURIComponent(centerSlug)}&locale=${encodeURIComponent(localeCode)}`,
      {},
    );
  }

  async function handleBookNext() {
    if (!activePackage || !selectedSlot) {
      return;
    }
    await postAndRefresh(
      `/api/private-booking/packages/${encodeURIComponent(activePackage.token)}/book-next?hostname=${encodeURIComponent(hostname)}&center=${encodeURIComponent(centerSlug)}&locale=${encodeURIComponent(localeCode)}`,
      {
        start_datetime: selectedSlot,
        package_option_id: selectedPackageOptionId,
      },
    );
  }

  if (loading) {
    return (
      <section className="forest-panel private-booking-panel">
        <h1>{labels.manageBooking}</h1>
        <p>{labels.loading}</p>
      </section>
    );
  }

  if (error && !booking && !pkg) {
    return (
      <section className="forest-panel private-booking-panel">
        <h1>{labels.manageBooking}</h1>
        <p>{error}</p>
      </section>
    );
  }

  if (booking) {
    return (
      <section className="forest-panel private-booking-panel">
        <p className="fp-chapter__eyebrow">{labels.manageBooking}</p>
        <h1>{booking.offer_title}</h1>
        <p>{booking.practitioner_name}</p>
        <p>{formatDateTime(booking.start_datetime, localeCode, booking.timezone)}</p>
        <p>
          {booking.package_label} · {formatMoney(booking.package_total, booking.currency, localeCode)}
        </p>
        {booking.payment_note ? (
          <p>
            <strong>{labels.paymentNote}:</strong> {booking.payment_note}
          </p>
        ) : null}
        <p>
          {booking.status === "BOOKED"
            ? labels.booked
            : booking.status === "COMPLETED"
              ? labels.completed
              : labels.cancelled}
        </p>

        {booking.can_reschedule && availability?.slots?.length ? (
          <div className="private-booking-panel__group">
            <h2>{labels.reschedule}</h2>
            <div className="private-booking-panel__choices private-booking-panel__choices--slots">
              {availability.slots.map((slot) => (
                <label className="private-booking-panel__choice private-booking-panel__choice--slot" key={slot.start_datetime}>
                  <input
                    checked={selectedSlot === slot.start_datetime}
                    name="booking_slot"
                    onChange={() => setSelectedSlot(slot.start_datetime)}
                    type="radio"
                  />
                  <span>
                    <strong>{slot.date_label}</strong>
                    <span className="private-booking-panel__choice-summary">{slot.time_label}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="private-booking-panel__actions">
              <button className="fl-btn fl-btn--primary" disabled={!selectedSlot || working} onClick={handleReschedule} type="button">
                {working ? labels.loading : labels.reschedule}
              </button>
              {booking.can_cancel ? (
                <button className="fl-btn fl-btn--secondary" disabled={working} onClick={handleCancel} type="button">
                  {labels.cancel}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {booking.package && booking.package.remaining_sessions > 0 ? (
          <div className="private-booking-panel__group">
            <h2>{labels.managePackage}</h2>
            <p>
              {booking.package.remaining_sessions} / {booking.package.total_sessions} remaining
            </p>
          </div>
        ) : null}

        {error ? <p className="private-booking-panel__error">{error}</p> : null}
      </section>
    );
  }

  if (!pkg) {
    return null;
  }

  return (
    <section className="forest-panel private-booking-panel">
      <p className="fp-chapter__eyebrow">{labels.managePackage}</p>
      <h1>{pkg.offer_title}</h1>
      <p>{pkg.practitioner_name}</p>
      <p>
        {pkg.package_label} · {formatMoney(pkg.price_total, pkg.currency, localeCode)}
      </p>
      <p>
        {pkg.remaining_sessions} / {pkg.total_sessions} remaining
      </p>

      {config?.flow_stage === "intro_pending" ? (
        <p>{labels.introPending}</p>
      ) : (
        <>
          {config?.package_options.length && config.flow_stage === "paid_package" ? (
            <div className="private-booking-panel__group">
              <h2>{labels.choosePackage}</h2>
              <div className="private-booking-panel__choices">
                {config.package_options.map((option) => (
                  <label className="private-booking-panel__choice" key={option.id}>
                    <input
                      checked={selectedPackageOptionId === option.id}
                      name="package_option"
                      onChange={() => {
                        setSelectedPackageOptionId(option.id);
                        setSelectedSlot("");
                      }}
                      type="radio"
                    />
                    <span>
                      <strong>{option.label}</strong>
                      <span className="private-booking-panel__choice-summary">
                        {formatMoney(option.price_total, option.currency, localeCode)}
                        {option.summary ? ` · ${option.summary}` : ""}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="private-booking-panel__group">
            <h2>{labels.nextSession}</h2>
            <div className="private-booking-panel__choices private-booking-panel__choices--slots">
              {availability?.slots.map((slot) => (
                <label className="private-booking-panel__choice private-booking-panel__choice--slot" key={slot.start_datetime}>
                  <input
                    checked={selectedSlot === slot.start_datetime}
                    name="package_slot"
                    onChange={() => setSelectedSlot(slot.start_datetime)}
                    type="radio"
                  />
                  <span>
                    <strong>{slot.date_label}</strong>
                    <span className="private-booking-panel__choice-summary">{slot.time_label}</span>
                  </span>
                </label>
              ))}
            </div>
            {!availability?.slots?.length ? <p>{labels.noSlots}</p> : null}
            <div className="private-booking-panel__actions">
              <button className="fl-btn fl-btn--primary" disabled={!selectedSlot || working} onClick={handleBookNext} type="button">
                {working ? labels.loading : labels.nextSession}
              </button>
            </div>
          </div>
        </>
      )}

      {pkg.bookings?.length ? (
        <div className="private-booking-panel__group">
          <h2>{labels.manageBooking}</h2>
          <ul className="private-booking-panel__booking-list">
            {pkg.bookings.map((item) => (
              <li key={item.token}>
                {formatDateTime(item.start_datetime, localeCode, item.timezone)} · {item.status}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? <p className="private-booking-panel__error">{error}</p> : null}
    </section>
  );
}
