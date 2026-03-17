"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { cleanDisplayText } from "@/lib/content-cleanup";
import { getPrivateBookingLabels, resolveLocale } from "@/lib/i18n";
import { localizePath } from "@/lib/locale-path";
import type {
  PrivateBookingAvailability,
  PrivateBookingConfig,
  PrivateBookingPackageOption,
  PrivateBookingPractitioner,
  PrivateBookingSummary,
  PrivateBookingSlot,
} from "@/lib/types";

type PrivateBookingPanelProps = {
  hostname: string;
  centerSlug: string;
  offerSlug: string;
  locale: string;
  initialConfig?: PrivateBookingConfig | null;
  mode?: "page" | "compact";
};

type JsonRecord = Record<string, unknown>;
type StepKey = "practitioner" | "package" | "slot" | "details";

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

function formatDateTime(value: string, locale: string, timezone?: string | null) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "short",
    ...(timezone ? { timeZone: timezone } : {}),
  }).format(new Date(value));
}

function getDateKey(value: string, timezone?: string | null) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(timezone ? { timeZone: timezone } : {}),
  }).formatToParts(date).reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});
  return [parts.year, parts.month, parts.day].filter(Boolean).join("-");
}

function getSlotDayMeta(value: string, locale: string, timezone?: string | null) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return {
    key: getDateKey(value, timezone),
    shortDay: new Intl.DateTimeFormat(locale, {
      weekday: "short",
      ...(timezone ? { timeZone: timezone } : {}),
    }).format(date),
    day: new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      ...(timezone ? { timeZone: timezone } : {}),
    }).format(date),
    month: new Intl.DateTimeFormat(locale, {
      month: "short",
      ...(timezone ? { timeZone: timezone } : {}),
    }).format(date),
    longLabel: new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      ...(timezone ? { timeZone: timezone } : {}),
    }).format(date),
  };
}

function formatValidityDays(days: number, locale: string) {
  if (!days) {
    return "";
  }
  if (locale === "fr") {
    return `${days} jours`;
  }
  return `${days} days`;
}

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

function fieldIsFilled(value: unknown) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== null && value !== undefined;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function PrivateBookingPanel({
  hostname,
  centerSlug,
  offerSlug,
  locale,
  initialConfig = null,
  mode = "page",
}: PrivateBookingPanelProps) {
  const localeCode = resolveLocale(locale);
  const labels = getPrivateBookingLabels(localeCode);
  const [config, setConfig] = useState<PrivateBookingConfig | null>(initialConfig);
  const [availability, setAvailability] = useState<PrivateBookingAvailability | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(!initialConfig);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedPractitionerId, setSelectedPractitionerId] = useState<number | null>(null);
  const [selectedPackageOptionId, setSelectedPackageOptionId] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [prepAnswers, setPrepAnswers] = useState<Record<string, unknown>>({});
  const [createdBooking, setCreatedBooking] = useState<PrivateBookingSummary | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedDateKey, setSelectedDateKey] = useState("");

  useEffect(() => {
    if (!initialConfig) {
      return;
    }
    setConfig(initialConfig);
    const defaultPractitioner =
      initialConfig.practitioners.length === 1
        ? initialConfig.practitioners[0]?.id ?? null
        : null;
    const defaultPackage =
      initialConfig.package_options.find((option) => option.is_default)?.id
      ?? initialConfig.package_options[0]?.id
      ?? null;
    setSelectedPractitionerId(defaultPractitioner);
    setSelectedPackageOptionId(defaultPackage);
    setLoadingConfig(false);
    setError("");
  }, [initialConfig]);

  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      if (initialConfig) {
        return;
      }
      setLoadingConfig(true);
      setError("");
      try {
        const response = await fetch(
          `/api/private-booking/config/${encodeURIComponent(offerSlug)}?hostname=${encodeURIComponent(hostname)}&center=${encodeURIComponent(centerSlug)}&locale=${encodeURIComponent(localeCode)}`,
          { cache: "no-store" },
        );
        const data = await readJson<PrivateBookingConfig | JsonRecord>(response);
        if (!response.ok) {
          throw new Error(asErrorDetail(data, labels.unavailable));
        }
        if (cancelled) {
          return;
        }
        const configPayload = data as PrivateBookingConfig;
        setConfig(configPayload);
        const defaultPractitioner =
          configPayload.practitioners.length === 1
            ? configPayload.practitioners[0]?.id ?? null
            : null;
        const defaultPackage =
          configPayload.package_options.find((option) => option.is_default)?.id
          ?? configPayload.package_options[0]?.id
          ?? null;
        setSelectedPractitionerId(defaultPractitioner);
        setSelectedPackageOptionId(defaultPackage);
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : labels.unavailable);
        }
      } finally {
        if (!cancelled) {
          setLoadingConfig(false);
        }
      }
    }

    void loadConfig();
    return () => {
      cancelled = true;
    };
  }, [centerSlug, hostname, initialConfig, labels.unavailable, localeCode, offerSlug]);

  const steps = useMemo<StepKey[]>(() => {
    if (!config) {
      return [];
    }
    return config.practitioners.length > 1
      ? ["practitioner", "package", "slot", "details"]
      : ["package", "slot", "details"];
  }, [config]);

  useEffect(() => {
    setCurrentStepIndex(0);
  }, [offerSlug, steps.length]);

  useEffect(() => {
    setSelectedSlot("");
    setSelectedDateKey("");
  }, [selectedPractitionerId, selectedPackageOptionId]);

  useEffect(() => {
    if (currentStepIndex > Math.max(steps.length - 1, 0)) {
      setCurrentStepIndex(Math.max(steps.length - 1, 0));
    }
  }, [currentStepIndex, steps.length]);

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      if (!config || !config.booking_enabled) {
        return;
      }
      if (config.flow_stage === "intro_pending") {
        setAvailability(null);
        return;
      }
      if (!selectedPractitionerId || !selectedPackageOptionId) {
        setAvailability(null);
        return;
      }

      setLoadingSlots(true);
      setError("");

      try {
        const response = await fetch(
          `/api/private-booking/availability?hostname=${encodeURIComponent(hostname)}&center=${encodeURIComponent(centerSlug)}&locale=${encodeURIComponent(localeCode)}&offer_slug=${encodeURIComponent(offerSlug)}&practitioner_id=${selectedPractitionerId}&package_option_id=${selectedPackageOptionId}`,
          { cache: "no-store" },
        );
        const data = await readJson<PrivateBookingAvailability | JsonRecord>(response);
        if (!response.ok) {
          throw new Error(asErrorDetail(data, labels.noSlots));
        }
        if (!cancelled) {
          setAvailability(data as PrivateBookingAvailability);
        }
      } catch (caught) {
        if (!cancelled) {
          setAvailability(null);
          setError(caught instanceof Error ? caught.message : labels.noSlots);
        }
      } finally {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      }
    }

    void loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [config, selectedPackageOptionId, selectedPractitionerId, hostname, centerSlug, localeCode, offerSlug, labels.noSlots]);

  const currentStep = steps[currentStepIndex] ?? null;

  const selectedPackageOption = useMemo<PrivateBookingPackageOption | null>(
    () => config?.package_options.find((option) => option.id === selectedPackageOptionId) ?? null,
    [config, selectedPackageOptionId],
  );

  const selectedPractitioner = useMemo<PrivateBookingPractitioner | null>(
    () => config?.practitioners.find((practitioner) => practitioner.id === selectedPractitionerId) ?? null,
    [config, selectedPractitionerId],
  );

  const selectedSlotDetails = useMemo<PrivateBookingSlot | null>(
    () => availability?.slots.find((slot) => slot.start_datetime === selectedSlot) ?? null,
    [availability, selectedSlot],
  );

  const slotDays = useMemo(() => {
    const grouped = new Map<string, { key: string; shortDay: string; day: string; month: string; longLabel: string; slots: PrivateBookingSlot[] }>();
    for (const slot of availability?.slots ?? []) {
      const meta = getSlotDayMeta(slot.start_datetime, localeCode, slot.timezone);
      if (!meta) {
        continue;
      }
      if (!grouped.has(meta.key)) {
        grouped.set(meta.key, { ...meta, slots: [] });
      }
      grouped.get(meta.key)?.slots.push(slot);
    }
    return Array.from(grouped.values());
  }, [availability, localeCode]);

  const visibleSlots = useMemo(() => {
    if (slotDays.length === 0) {
      return [] as PrivateBookingSlot[];
    }
    const activeKey = selectedDateKey || slotDays[0]?.key;
    return slotDays.find((day) => day.key === activeKey)?.slots ?? [];
  }, [selectedDateKey, slotDays]);

  useEffect(() => {
    if (selectedSlotDetails) {
      const key = getDateKey(selectedSlotDetails.start_datetime, selectedSlotDetails.timezone);
      setSelectedDateKey(key);
      return;
    }
    if (slotDays.length > 0 && !slotDays.some((day) => day.key === selectedDateKey)) {
      setSelectedDateKey(slotDays[0]?.key ?? "");
    }
  }, [selectedDateKey, selectedSlotDetails, slotDays]);

  const detailsAreValid = useMemo(() => {
    if (!clientName.trim() || !clientEmail.trim()) {
      return false;
    }
    if (!config) {
      return false;
    }
    return config.prep_fields.every((field) => {
      if (!field.required) {
        return true;
      }
      return fieldIsFilled(prepAnswers[field.key]);
    });
  }, [clientEmail, clientName, config, prepAnswers]);

  const canContinue = useMemo(() => {
    switch (currentStep) {
      case "practitioner":
        return Boolean(selectedPractitionerId);
      case "package":
        return Boolean(selectedPackageOptionId);
      case "slot":
        return Boolean(selectedSlot);
      case "details":
        return detailsAreValid;
      default:
        return false;
    }
  }, [currentStep, detailsAreValid, selectedPackageOptionId, selectedPractitionerId, selectedSlot]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPractitionerId || !selectedPackageOptionId || !selectedSlot) {
      setError(labels.needSelection);
      return;
    }

    if (!detailsAreValid) {
      setError(labels.needSelection);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/private-booking/book?hostname=${encodeURIComponent(hostname)}&center=${encodeURIComponent(centerSlug)}&locale=${encodeURIComponent(localeCode)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            offer_slug: offerSlug,
            practitioner_id: selectedPractitionerId,
            package_option_id: selectedPackageOptionId,
            start_datetime: selectedSlot,
            locale: localeCode,
            client_name: clientName,
            client_email: clientEmail,
            client_phone: clientPhone,
            prep_answers: prepAnswers,
          }),
        },
      );
      const data = await readJson<PrivateBookingSummary | JsonRecord>(response);
      if (!response.ok) {
        throw new Error(asErrorDetail(data, labels.unavailable));
      }
      setCreatedBooking(data as PrivateBookingSummary);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : labels.unavailable);
    } finally {
      setSubmitting(false);
    }
  }

  function renderPrepField(field: PrivateBookingConfig["prep_fields"][number]) {
    const value = prepAnswers[field.key];

    if (field.field_type === "TEXTAREA") {
      return (
        <label key={field.key}>
          <span>{field.label}</span>
          <textarea
            onChange={(event) => setPrepAnswers((current) => ({ ...current, [field.key]: event.target.value }))}
            placeholder={field.placeholder ?? ""}
            required={Boolean(field.required)}
            value={typeof value === "string" ? value : ""}
          />
          {field.help_text ? <small>{field.help_text}</small> : null}
        </label>
      );
    }

    if (field.field_type === "SELECT") {
      const options = Array.isArray(field.options) ? field.options : [];
      return (
        <label key={field.key}>
          <span>{field.label}</span>
          <select
            onChange={(event) => setPrepAnswers((current) => ({ ...current, [field.key]: event.target.value }))}
            required={Boolean(field.required)}
            value={typeof value === "string" ? value : ""}
          >
            <option value="">{field.placeholder ?? "-"}</option>
            {options.map((option) => {
              if (typeof option === "string") {
                return (
                  <option key={option} value={option}>
                    {option}
                  </option>
                );
              }
              return (
                <option key={option.value ?? option.label} value={option.value ?? option.label ?? ""}>
                  {option.label ?? option.value}
                </option>
              );
            })}
          </select>
          {field.help_text ? <small>{field.help_text}</small> : null}
        </label>
      );
    }

    if (field.field_type === "CHECKBOX") {
      return (
        <label className="private-booking-panel__checkbox" key={field.key}>
          <input
            checked={Boolean(value)}
            onChange={(event) => setPrepAnswers((current) => ({ ...current, [field.key]: event.target.checked }))}
            required={Boolean(field.required)}
            type="checkbox"
          />
          <span>{field.label}</span>
          {field.help_text ? <small>{field.help_text}</small> : null}
        </label>
      );
    }

    return (
      <label key={field.key}>
        <span>{field.label}</span>
        <input
          onChange={(event) => setPrepAnswers((current) => ({ ...current, [field.key]: event.target.value }))}
          placeholder={field.placeholder ?? ""}
          required={Boolean(field.required)}
          value={typeof value === "string" ? value : ""}
        />
        {field.help_text ? <small>{field.help_text}</small> : null}
      </label>
    );
  }

  function handleContinue() {
    if (!canContinue) {
      setError(labels.needSelection);
      return;
    }
    setError("");
    setCurrentStepIndex((index) => Math.min(index + 1, steps.length - 1));
  }

  function handleBack() {
    setError("");
    setCurrentStepIndex((index) => Math.max(index - 1, 0));
  }

  const rootClassName = `private-booking-panel private-booking-panel--${mode}`;

  if (loadingConfig) {
    return (
      <section className={rootClassName} id="private-booking">
        <div className="private-booking-panel__state private-booking-wizard__panel">
          <p className="private-booking-wizard__panel-kicker">{labels.heading}</p>
          <h2>{labels.heading}</h2>
          <p>{labels.loading}</p>
        </div>
      </section>
    );
  }

  if (!config || !config.booking_enabled) {
    return (
      <section className={rootClassName} id="private-booking">
        <div className="private-booking-panel__state private-booking-wizard__panel">
          <p className="private-booking-wizard__panel-kicker">{labels.heading}</p>
          <h2>{labels.heading}</h2>
          <p>{error || labels.unavailable}</p>
        </div>
      </section>
    );
  }

  if (createdBooking) {
    return (
      <section className={rootClassName} id="private-booking">
        <div className="private-booking-panel__state private-booking-wizard__panel">
          <p className="fp-chapter__eyebrow">{labels.booked}</p>
          <h2>{createdBooking.offer_title}</h2>
          <p>{createdBooking.practitioner_name}</p>
          <p>{formatDateTime(createdBooking.start_datetime, localeCode, createdBooking.timezone)}</p>
          <p>
            {createdBooking.package_label} · {formatMoney(createdBooking.package_total, createdBooking.currency, localeCode)}
          </p>
          {createdBooking.payment_note ? (
            <p>
              <strong>{labels.paymentNote}:</strong> {createdBooking.payment_note}
            </p>
          ) : null}
          <div className="private-booking-panel__actions">
            <Link className="fl-btn fl-btn--primary" href={localizePath(localeCode, `/private-booking/${createdBooking.token}`)}>
              {labels.manageBooking}
            </Link>
            {createdBooking.package_token ? (
              <Link className="fl-btn fl-btn--secondary" href={localizePath(localeCode, `/private-booking/${createdBooking.package_token}`)}>
                {labels.managePackage}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (config.flow_stage === "intro_pending") {
    return (
      <section className={rootClassName} id="private-booking">
        <div className="private-booking-panel__state private-booking-wizard__panel">
          <p className="fp-chapter__eyebrow">{labels.heading}</p>
          <h2>{config.offer_title}</h2>
          <p>{labels.introPending}</p>
          <div className="private-booking-panel__actions">
            {config.package?.token ? (
              <Link className="fl-btn fl-btn--primary" href={localizePath(localeCode, `/private-booking/${config.package.token}`)}>
                {labels.managePackage}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  const stepTitles: Record<StepKey, string> = {
    practitioner: labels.stepPractitioner,
    package: labels.stepPackage,
    slot: labels.stepSlot,
    details: labels.stepDetails,
  };

  const currentStepTitle = currentStep ? stepTitles[currentStep] : labels.heading;
  const shouldShowInlineSummary = currentStep === "details" || mode === "compact";
  const isIntroCallSelection = Boolean(config?.requires_intro_call) && currentStep === "package" && config.flow_stage === "intro_call";
  const packageStepTitle = isIntroCallSelection ? labels.chooseIntroCall : labels.choosePackage;
  const packageStepDescription = isIntroCallSelection ? labels.chooseIntroCallDescription : "";

  function renderInlineSummary() {
    return (
      <div
        className={`private-booking-inline-summary${
          currentStep === "details" ? " private-booking-inline-summary--compact" : ""
        }`}
      >
        <div className="private-booking-inline-summary__item">
          <span>{labels.selectedPractitioner}</span>
          <strong>{selectedPractitioner?.display_name ?? labels.noSelectionYet}</strong>
        </div>
        <div className="private-booking-inline-summary__item">
          <span>{labels.selectedPackage}</span>
          <strong>{selectedPackageOption?.label ?? labels.noSelectionYet}</strong>
          {selectedPackageOption ? (
            <small>
              {formatMoney(selectedPackageOption.price_total, selectedPackageOption.currency, localeCode)} · {formatValidityDays(selectedPackageOption.validity_days, localeCode)}
            </small>
          ) : null}
        </div>
        <div className="private-booking-inline-summary__item">
          <span>{labels.selectedSlot}</span>
          <strong>
            {selectedSlotDetails
              ? `${selectedSlotDetails.date_label} · ${selectedSlotDetails.time_label}`
              : labels.noSelectionYet}
          </strong>
        </div>
        {config?.payment_note ? (
          <div className="private-booking-inline-summary__item">
            <span>{labels.paymentNote}</span>
            <strong>{config.payment_note}</strong>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <section className={rootClassName} id="private-booking">
      <div className="private-booking-wizard__progress" aria-label={labels.heading}>
        {steps.map((step, index) => {
          const isCurrent = index === currentStepIndex;
          const isDone = index < currentStepIndex;
          return (
            <Fragment key={step}>
              <button
                aria-current={isCurrent ? "step" : undefined}
                className={`private-booking-wizard__step-dot${isCurrent ? " is-current" : ""}${isDone ? " is-done" : ""}`}
                disabled={index > currentStepIndex}
                onClick={() => setCurrentStepIndex(index)}
                title={stepTitles[step]}
                type="button"
              >
                <span>{index + 1}</span>
              </button>
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={`private-booking-wizard__step-line${isDone ? " is-done" : ""}`}
                />
              ) : null}
            </Fragment>
          );
        })}
      </div>

      {shouldShowInlineSummary ? renderInlineSummary() : null}

      {currentStep === "practitioner" ? (
        <section className="private-booking-panel__group private-booking-wizard__panel">
          <div className="private-booking-wizard__panel-head">
            <p className="private-booking-wizard__panel-kicker">01</p>
            <h3>{labels.choosePractitioner}</h3>
          </div>
          <div className="private-booking-panel__choices private-booking-panel__choices--cards">
            {config.practitioners.map((practitioner) => (
              <label className={`private-booking-panel__choice private-booking-panel__choice--card private-booking-panel__choice--practitioner${selectedPractitionerId === practitioner.id ? " is-selected" : ""}`} key={practitioner.id}>
                <input
                  checked={selectedPractitionerId === practitioner.id}
                  name="practitioner"
                  onChange={() => setSelectedPractitionerId(practitioner.id)}
                  type="radio"
                />
                <span className="private-booking-panel__choice-content private-booking-panel__choice-content--practitioner">
                  <span className="private-booking-panel__choice-heading">
                    <strong>{practitioner.display_name}</strong>
                    <span className="private-booking-panel__avatar" aria-hidden="true">
                      {practitioner.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt="" src={practitioner.photo_url} />
                      ) : (
                        <span>{getInitials(practitioner.display_name)}</span>
                      )}
                    </span>
                  </span>
                  {practitioner.title ? <span className="private-booking-panel__choice-summary">{practitioner.title}</span> : null}
                  {practitioner.short_bio ? <span className="private-booking-panel__choice-copy">{cleanDisplayText(practitioner.short_bio)}</span> : null}
                </span>
              </label>
            ))}
          </div>
        </section>
      ) : null}

      {currentStep === "package" ? (
        <section className="private-booking-panel__group private-booking-wizard__panel">
          <div className="private-booking-wizard__panel-head">
            <p className="private-booking-wizard__panel-kicker">{steps.indexOf("package") + 1 < 10 ? `0${steps.indexOf("package") + 1}` : steps.indexOf("package") + 1}</p>
            <h3>{packageStepTitle}</h3>
          </div>
          {packageStepDescription ? <p className="private-booking-panel__summary">{packageStepDescription}</p> : null}
          <div className="private-booking-panel__choices private-booking-panel__choices--cards">
            {config.package_options.map((option) => (
              <label className={`private-booking-panel__choice private-booking-panel__choice--card${selectedPackageOptionId === option.id ? " is-selected" : ""}`} key={option.id}>
                <input
                  checked={selectedPackageOptionId === option.id}
                  name="package_option"
                  onChange={() => setSelectedPackageOptionId(option.id)}
                  type="radio"
                />
                <span className="private-booking-panel__choice-content">
                  <strong>{option.label}</strong>
                  <span className="private-booking-panel__choice-price">
                    {formatMoney(option.price_total, option.currency, localeCode)}
                  </span>
                  {option.summary ? <span className="private-booking-panel__choice-copy">{option.summary}</span> : null}
                  <span className="private-booking-panel__choice-summary">
                    {option.session_count} · {labels.packageValidity}: {formatValidityDays(option.validity_days, localeCode)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </section>
      ) : null}

      {currentStep === "slot" ? (
        <section className="private-booking-panel__group private-booking-wizard__panel">
          <div className="private-booking-wizard__panel-head">
            <p className="private-booking-wizard__panel-kicker">{steps.indexOf("slot") + 1 < 10 ? `0${steps.indexOf("slot") + 1}` : steps.indexOf("slot") + 1}</p>
            <h3>{labels.chooseSlot}</h3>
          </div>
          {loadingSlots ? <p>{labels.loading}</p> : null}
          {!loadingSlots && (!availability || availability.slots.length === 0) ? (
            <p>{labels.noSlots}</p>
          ) : null}
          {slotDays.length > 0 ? (
            <div className="private-booking-slot-picker">
              <div className="private-booking-slot-picker__dates" role="tablist" aria-label={labels.chooseSlot}>
                {slotDays.map((day) => (
                  <button
                    aria-selected={selectedDateKey === day.key}
                    className={`private-booking-slot-picker__date${selectedDateKey === day.key ? " is-selected" : ""}`}
                    key={day.key}
                    onClick={() => {
                      setSelectedDateKey(day.key);
                      setSelectedSlot("");
                    }}
                    role="tab"
                    type="button"
                  >
                    <span className="private-booking-slot-picker__date-day">{day.shortDay}</span>
                    <span className="private-booking-slot-picker__date-number">{day.day}</span>
                    <span className="private-booking-slot-picker__date-month">{day.month}</span>
                  </button>
                ))}
              </div>

              <div className="private-booking-slot-picker__times">
                <p className="private-booking-slot-picker__times-label">
                  {slotDays.find((day) => day.key === (selectedDateKey || slotDays[0]?.key))?.longLabel ?? ""}
                </p>
                <div className="private-booking-slot-picker__time-grid">
                  {visibleSlots.map((slot) => (
                    <label className="private-booking-slot-picker__time-option" key={slot.start_datetime}>
                      <input
                        checked={selectedSlot === slot.start_datetime}
                        name="slot"
                        onChange={() => setSelectedSlot(slot.start_datetime)}
                        type="radio"
                      />
                      <span>{slot.time_label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {currentStep === "details" ? (
        <form className="private-booking-panel__form private-booking-wizard__panel" onSubmit={handleSubmit}>
          <div className="private-booking-wizard__panel-head">
            <p className="private-booking-wizard__panel-kicker">{steps.indexOf("details") + 1 < 10 ? `0${steps.indexOf("details") + 1}` : steps.indexOf("details") + 1}</p>
            <h3>{labels.yourDetails}</h3>
          </div>
          <p className="private-booking-panel__summary">{labels.reviewBeforeConfirm}</p>
          {config.prep_instructions ? (
            <p className="private-booking-panel__note private-booking-panel__note--intro">
              {config.prep_instructions}
            </p>
          ) : null}
          <div className="private-booking-panel__inputs">
            <label>
              <span>{labels.name}</span>
              <input onChange={(event) => setClientName(event.target.value)} required value={clientName} />
            </label>
            <label>
              <span>{labels.email}</span>
              <input onChange={(event) => setClientEmail(event.target.value)} required type="email" value={clientEmail} />
            </label>
            <label>
              <span>{labels.phone}</span>
              <input onChange={(event) => setClientPhone(event.target.value)} value={clientPhone} />
            </label>
            {config.prep_fields.map((field) => renderPrepField(field))}
          </div>
          {error ? <p className="private-booking-panel__error">{error}</p> : null}
          <div className="private-booking-panel__actions private-booking-panel__actions--wizard">
            <button className="fl-btn fl-btn--secondary" onClick={handleBack} type="button">
              {labels.back}
            </button>
            <button className="fl-btn fl-btn--primary" disabled={submitting || !detailsAreValid || !selectedSlot} type="submit">
              {submitting ? labels.loading : labels.submit}
            </button>
          </div>
        </form>
      ) : null}

      {currentStep !== "details" ? (
        <div
          className={`private-booking-panel__actions private-booking-panel__actions--wizard${
            currentStepIndex === 0 ? " private-booking-panel__actions--single" : ""
          }`}
        >
          {currentStepIndex > 0 ? (
            <button className="fl-btn fl-btn--secondary" onClick={handleBack} type="button">
              {labels.back}
            </button>
          ) : null}
          <button className="fl-btn fl-btn--primary" onClick={handleContinue} type="button">
            {labels.continue}
          </button>
        </div>
      ) : null}

      {error && currentStep !== "details" ? <p className="private-booking-panel__error">{error}</p> : null}
    </section>
  );
}
