"use client";

import { useEffect, useMemo, useState } from "react";

import PrivateBookingPrepFields from "@/components/private-booking/PrivateBookingPrepFields";
import PrivateBookingSlotPicker from "@/components/private-booking/PrivateBookingSlotPicker";
import type {
  PrivateBookingAvailability,
  PrivateBookingConfig,
  PrivateBookingSummary,
} from "@/lib/private-booking";
import {
  formatPrivateBookingMoney,
  isPrivateBookingPrepAnswerFilled,
  normalizePrivateBookingPrepAnswers,
  withLocalePath,
  withPrivateBookingPrepDefaults,
} from "@/lib/private-booking";

type PrivateBookingFormProps = {
  config: PrivateBookingConfig;
  locale: string;
};

function isFrenchLocale(locale: string) {
  return locale.toLowerCase().startsWith("fr");
}

function firstErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  if ("detail" in payload && typeof payload.detail === "string" && payload.detail.trim()) {
    return payload.detail.trim();
  }

  for (const value of Object.values(payload)) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim()) {
      return value[0].trim();
    }
  }

  return fallback;
}

function getBookingLabels(locale: string) {
  const isFrench = isFrenchLocale(locale);

  return {
    eyebrow: isFrench ? "Reservation privee" : "Private booking",
    title: isFrench ? "Reservez votre seance" : "Book your session",
    introRequired: isFrench
      ? "Cet accompagnement commence actuellement par un appel decouverte."
      : "This pathway currently starts with an intro call.",
    practitioner: isFrench ? "Praticien·ne" : "Practitioner",
    package: isFrench ? "Formule" : "Package",
    yourDetails: isFrench ? "Vos coordonnees" : "Your details",
    fullName: isFrench ? "Nom complet" : "Full name",
    email: isFrench ? "E-mail" : "Email",
    phone: isFrench ? "Telephone" : "Phone",
    prep: isFrench ? "Avant la seance" : "Before the session",
    selectTime: isFrench ? "Choisissez un horaire" : "Choose a time",
    selectTimeHelp: isFrench
      ? "Les horaires ci-dessous sont les disponibilites actuelles de la praticienne."
      : "The times below reflect the practitioner’s current availability.",
    noTimes: isFrench
      ? "Aucun horaire n'est disponible pour cette combinaison pour le moment."
      : "No times are available for this combination right now.",
    loadingTimes: isFrench ? "Chargement des disponibilites..." : "Loading available times...",
    submit: isFrench ? "Confirmer la reservation" : "Confirm booking",
    submitting: isFrench ? "Reservation en cours..." : "Booking...",
    requiredPrep: isFrench
      ? "Merci de remplir les champs obligatoires avant de continuer."
      : "Please complete the required fields before continuing.",
    disabled: isFrench
      ? "La reservation privee n'est pas disponible pour cette offre."
      : "Private booking is not currently available for this offer.",
    noSetup: isFrench
      ? "Cette offre n'a pas encore de praticien ou de formule reservezable."
      : "This offer does not yet have a practitioner or package configured for booking.",
    confirmationNote: isFrench ? "Apres confirmation" : "After booking",
  };
}

function formatSessionCount(sessionCount: number, locale: string, introCallLabel?: string | null) {
  if (sessionCount <= 0) {
    return introCallLabel || (isFrenchLocale(locale) ? "Appel decouverte" : "Intro call");
  }

  if (isFrenchLocale(locale)) {
    return `${sessionCount} ${sessionCount > 1 ? "seances" : "seance"}`;
  }

  return `${sessionCount} ${sessionCount > 1 ? "sessions" : "session"}`;
}

export default function PrivateBookingForm({ config, locale }: PrivateBookingFormProps) {
  const labels = getBookingLabels(locale);
  const hasBookingSetup = config.booking_enabled && config.practitioners.length > 0 && config.package_options.length > 0;

  const [practitionerId, setPractitionerId] = useState(
    String(config.package?.practitioner_id ?? config.practitioners[0]?.id ?? ""),
  );
  const [packageOptionId, setPackageOptionId] = useState(
    String(
      config.package?.package_option_id ??
        config.package_options.find((option) => option.is_default)?.id ??
        config.package_options[0]?.id ??
        "",
    ),
  );
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [prepAnswers, setPrepAnswers] = useState(() => withPrivateBookingPrepDefaults(config.prep_fields));
  const [availability, setAvailability] = useState<PrivateBookingAvailability | null>(null);
  const [availabilityError, setAvailabilityError] = useState("");
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPractitioner = useMemo(
    () => config.practitioners.find((item) => String(item.id) === practitionerId) ?? null,
    [config.practitioners, practitionerId],
  );
  const selectedPackage = useMemo(
    () => config.package_options.find((item) => String(item.id) === packageOptionId) ?? null,
    [config.package_options, packageOptionId],
  );
  const normalizedPrepAnswers = useMemo(
    () => normalizePrivateBookingPrepAnswers(config.prep_fields, prepAnswers),
    [config.prep_fields, prepAnswers],
  );
  const hasMissingRequiredPrep = config.prep_fields.some(
    (field) => field.required && !isPrivateBookingPrepAnswerFilled(field, normalizedPrepAnswers[field.key]),
  );

  useEffect(() => {
    if (!hasBookingSetup || !practitionerId || !packageOptionId) {
      setAvailability(null);
      setAvailabilityError("");
      setSelectedSlot("");
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({
      locale,
      offer_slug: config.offer_slug,
      practitioner_id: practitionerId,
      package_option_id: packageOptionId,
    });

    setAvailabilityLoading(true);
    setAvailabilityError("");

    fetch(`/api/private-booking/availability?${params.toString()}`, {
      method: "GET",
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => null)) as PrivateBookingAvailability | Record<string, unknown> | null;

        if (!response.ok) {
          throw new Error(firstErrorMessage(payload, "Availability request failed."));
        }

        const data = payload as PrivateBookingAvailability;
        setAvailability(data);
        setSelectedSlot((current) => {
          if (data.slots.some((slot) => slot.start_datetime === current)) {
            return current;
          }
          return data.slots[0]?.start_datetime ?? "";
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        setAvailability(null);
        setSelectedSlot("");
        setAvailabilityError(
          error instanceof Error
            ? error.message
            : isFrenchLocale(locale)
            ? "Impossible de charger les disponibilites."
            : "Unable to load availability.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setAvailabilityLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [config.offer_slug, hasBookingSetup, locale, packageOptionId, practitionerId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (hasMissingRequiredPrep) {
      setSubmitError(labels.requiredPrep);
      return;
    }

    if (!selectedSlot) {
      setSubmitError(
        isFrenchLocale(locale) ? "Merci de choisir un horaire." : "Please choose a time slot.",
      );
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/private-booking/book?locale=${encodeURIComponent(locale)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offer_slug: config.offer_slug,
          practitioner_id: Number(practitionerId),
          package_option_id: Number(packageOptionId),
          start_datetime: selectedSlot,
          locale: isFrenchLocale(locale) ? "fr" : "en",
          client_name: clientName.trim(),
          client_email: clientEmail.trim(),
          client_phone: clientPhone.trim(),
          prep_answers: normalizedPrepAnswers,
        }),
      });

      const payload = (await response.json().catch(() => null)) as PrivateBookingSummary | Record<string, unknown> | null;

      if (!response.ok) {
        throw new Error(
          firstErrorMessage(
            payload,
            isFrenchLocale(locale) ? "Impossible de finaliser la reservation." : "Unable to complete the booking.",
          ),
        );
      }

      const booking = payload as PrivateBookingSummary;
      window.location.assign(withLocalePath(locale, `/private-booking/${booking.token}?status=booked`));
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : isFrenchLocale(locale)
          ? "Erreur pendant la reservation."
          : "Booking error.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="private-booking-shell">
      <div className="private-booking-header">
        <p className="private-booking-eyebrow">{labels.eyebrow}</p>
        <h1>{config.offer_title}</h1>
        {config.flow_stage === "intro_call" ? (
          <p className="private-booking-banner private-booking-banner--warning">{labels.introRequired}</p>
        ) : null}
        {config.prep_instructions ? <p>{config.prep_instructions}</p> : null}
      </div>

      {!config.booking_enabled ? (
        <p className="private-booking-banner private-booking-banner--warning">{labels.disabled}</p>
      ) : null}

      {config.booking_enabled && !hasBookingSetup ? (
        <p className="private-booking-banner private-booking-banner--warning">{labels.noSetup}</p>
      ) : null}

      {hasBookingSetup ? (
        <form className="private-booking-layout" onSubmit={handleSubmit}>
          <div className="private-booking-stack">
            <section className="private-booking-card">
              <div className="private-booking-section-heading">
                <h2>{labels.package}</h2>
                {selectedPackage?.summary ? <p>{selectedPackage.summary}</p> : null}
              </div>

              <div className="private-booking-fields">
                <div className="private-booking-field">
                  <label htmlFor="private-booking-practitioner">{labels.practitioner}</label>
                  <select
                    className="private-booking-input"
                    id="private-booking-practitioner"
                    onChange={(event) => setPractitionerId(event.target.value)}
                    value={practitionerId}
                  >
                    {config.practitioners.map((practitioner) => (
                      <option key={practitioner.id} value={practitioner.id}>
                        {practitioner.display_name}
                      </option>
                    ))}
                  </select>
                  {selectedPractitioner?.title ? (
                    <p className="private-booking-help">{selectedPractitioner.title}</p>
                  ) : selectedPractitioner?.short_bio ? (
                    <p className="private-booking-help">{selectedPractitioner.short_bio}</p>
                  ) : null}
                </div>

                <div className="private-booking-field">
                  <label htmlFor="private-booking-package">{labels.package}</label>
                  <select
                    className="private-booking-input"
                    id="private-booking-package"
                    onChange={(event) => setPackageOptionId(event.target.value)}
                    value={packageOptionId}
                  >
                    {config.package_options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedPackage ? (
                <div className="private-booking-summary-grid">
                  <div>
                    <strong>{selectedPackage.label}</strong>
                    {selectedPackage.summary ? <p>{selectedPackage.summary}</p> : null}
                  </div>
                  <div>
                    <strong>{formatPrivateBookingMoney(selectedPackage.price_total, selectedPackage.currency, locale)}</strong>
                    <p>{formatSessionCount(selectedPackage.session_count, locale, config.intro_call_label)}</p>
                  </div>
                </div>
              ) : null}

              {config.payment_note ? <p className="private-booking-help">{config.payment_note}</p> : null}
            </section>

            <section className="private-booking-card">
              <div className="private-booking-section-heading">
                <h2>{labels.yourDetails}</h2>
              </div>

              <div className="private-booking-fields">
                <div className="private-booking-field">
                  <label htmlFor="private-booking-name">{labels.fullName}</label>
                  <input
                    className="private-booking-input"
                    id="private-booking-name"
                    onChange={(event) => setClientName(event.target.value)}
                    required
                    type="text"
                    value={clientName}
                  />
                </div>
                <div className="private-booking-field">
                  <label htmlFor="private-booking-email">{labels.email}</label>
                  <input
                    className="private-booking-input"
                    id="private-booking-email"
                    onChange={(event) => setClientEmail(event.target.value)}
                    required
                    type="email"
                    value={clientEmail}
                  />
                </div>
                <div className="private-booking-field">
                  <label htmlFor="private-booking-phone">{labels.phone}</label>
                  <input
                    className="private-booking-input"
                    id="private-booking-phone"
                    onChange={(event) => setClientPhone(event.target.value)}
                    type="tel"
                    value={clientPhone}
                  />
                </div>
              </div>
            </section>

            {config.prep_fields.length > 0 ? (
              <section className="private-booking-card">
                <div className="private-booking-section-heading">
                  <h2>{labels.prep}</h2>
                </div>
                <PrivateBookingPrepFields
                  disabled={isSubmitting}
                  fields={config.prep_fields}
                  locale={locale}
                  onChange={(key, value) => {
                    setPrepAnswers((current) => ({
                      ...current,
                      [key]: value,
                    }));
                  }}
                  values={prepAnswers}
                />
              </section>
            ) : null}
          </div>

          <div className="private-booking-stack">
            <PrivateBookingSlotPicker
              description={labels.selectTimeHelp}
              emptyMessage={labels.noTimes}
              error={availabilityError}
              loading={availabilityLoading}
              loadingMessage={labels.loadingTimes}
              onSelect={setSelectedSlot}
              selectedSlot={selectedSlot}
              slots={availability?.slots ?? []}
              title={labels.selectTime}
            />

            {config.confirmation_note ? (
              <section className="private-booking-card">
                <div className="private-booking-section-heading">
                  <h2>{labels.confirmationNote}</h2>
                </div>
                <p>{config.confirmation_note}</p>
              </section>
            ) : null}

            {submitError ? <p className="private-booking-banner private-booking-banner--error">{submitError}</p> : null}

            <div className="private-booking-form-actions">
              <button className="button-link" disabled={isSubmitting || availabilityLoading || !selectedSlot} type="submit">
                {isSubmitting ? labels.submitting : labels.submit}
              </button>
            </div>
          </div>
        </form>
      ) : null}
    </section>
  );
}
