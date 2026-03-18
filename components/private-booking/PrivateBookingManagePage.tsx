"use client";

import { useEffect, useMemo, useState } from "react";

import PrivateBookingPrepFields from "@/components/private-booking/PrivateBookingPrepFields";
import PrivateBookingSlotPicker from "@/components/private-booking/PrivateBookingSlotPicker";
import type {
  PrivateBookingAvailability,
  PrivateBookingConfig,
  PrivateBookingPackageSummary,
  PrivateBookingPageEntity,
  PrivateBookingSummary,
} from "@/lib/private-booking";
import {
  formatPrivateBookingDateTime,
  formatPrivateBookingMoney,
  isPrivateBookingPrepAnswerFilled,
  normalizePrivateBookingPrepAnswers,
  withLocalePath,
  withPrivateBookingPrepDefaults,
} from "@/lib/private-booking";

type PrivateBookingManagePageProps = {
  config: PrivateBookingConfig;
  initialEntity: PrivateBookingPageEntity;
  locale: string;
  notice?: string | null;
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

function initialNoticeMessage(notice: string | null | undefined, locale: string) {
  if (notice === "booked") {
    return isFrenchLocale(locale)
      ? "Votre reservation est confirmee. Vous pouvez gerer votre rendez-vous ici."
      : "Your booking is confirmed. You can manage it here.";
  }

  return "";
}

function getLabels(locale: string) {
  const isFrench = isFrenchLocale(locale);

  return {
    eyebrow: isFrench ? "Gestion de reservation" : "Booking management",
    bookingSummary: isFrench ? "Votre rendez-vous" : "Your booking",
    packageSummary: isFrench ? "Votre formule" : "Your package",
    prepHeading: isFrench ? "Mettre a jour les informations de preparation" : "Update preparation details",
    prepSubmit: isFrench ? "Enregistrer les informations" : "Save details",
    prepSubmitting: isFrench ? "Enregistrement..." : "Saving...",
    prepSaved: isFrench ? "Les informations ont ete mises a jour." : "Your details have been updated.",
    prepUnavailable: isFrench
      ? "Les informations de preparation ne peuvent pas encore etre modifiees en ligne pour cette formule."
      : "Preparation details cannot be edited online for this package yet.",
    rescheduleHeading: isFrench ? "Reprogrammer ce rendez-vous" : "Reschedule this booking",
    rescheduleSubmit: isFrench ? "Confirmer la reprogrammation" : "Confirm reschedule",
    rescheduleSubmitting: isFrench ? "Reprogrammation..." : "Rescheduling...",
    rescheduleSuccess: isFrench ? "Le rendez-vous a ete reprogramme." : "Your booking has been rescheduled.",
    cancelHeading: isFrench ? "Annuler ce rendez-vous" : "Cancel this booking",
    cancelSubmit: isFrench ? "Annuler le rendez-vous" : "Cancel booking",
    cancelling: isFrench ? "Annulation..." : "Cancelling...",
    cancelSuccess: isFrench ? "Le rendez-vous a ete annule." : "Your booking has been cancelled.",
    cancelConfirm: isFrench
      ? "Confirmez-vous l'annulation de ce rendez-vous ?"
      : "Do you want to cancel this booking?",
    cutoffMessage: isFrench
      ? "La reprogrammation et l'annulation en ligne ne sont plus disponibles pour ce rendez-vous."
      : "Online rescheduling and cancellation are no longer available for this booking.",
    selectAnotherSlot: isFrench ? "Choisissez un nouveau creneau" : "Choose a new time",
    noTimes: isFrench ? "Aucun autre creneau n'est disponible pour le moment." : "No other times are available right now.",
    loadingTimes: isFrench ? "Chargement des disponibilites..." : "Loading available times...",
    bookNextHeading: isFrench ? "Reserver la prochaine seance" : "Book the next session",
    bookNextSubmit: isFrench ? "Confirmer ce nouveau rendez-vous" : "Confirm this next booking",
    bookNextSubmitting: isFrench ? "Reservation..." : "Booking...",
    introPending: isFrench
      ? "Les seances payantes se debloquent apres la completion de l'appel decouverte."
      : "Paid sessions unlock after the intro call has been completed.",
    noRemainingSessions: isFrench
      ? "Cette formule n'a plus de seances restantes a reserver en ligne."
      : "This package has no remaining sessions left to book online.",
    bookNextError: isFrench ? "Impossible de reserver la prochaine seance." : "Unable to book the next session.",
    currentSessions: isFrench ? "Sessions liees" : "Linked sessions",
    status: isFrench ? "Statut" : "Status",
    practitioner: isFrench ? "Praticien·ne" : "Practitioner",
    duration: isFrench ? "Duree" : "Duration",
    payment: isFrench ? "Paiement" : "Payment",
    remaining: isFrench ? "Seances restantes" : "Sessions remaining",
    validUntil: isFrench ? "Valable jusqu'au" : "Valid until",
    introCall: isFrench ? "Appel decouverte" : "Intro call",
    selfServiceUnavailable: isFrench
      ? "La gestion en ligne n'est plus disponible pour ce rendez-vous."
      : "Self-service is no longer available for this booking.",
    nextBookingHelp: isFrench
      ? "Choisissez le prochain creneau pour cette formule."
      : "Choose the next available time for this package.",
  };
}

function formatStatus(status: string, locale: string) {
  const isFrench = isFrenchLocale(locale);

  switch (status) {
    case "BOOKED":
      return isFrench ? "Confirmee" : "Booked";
    case "CANCELLED":
      return isFrench ? "Annulee" : "Cancelled";
    case "COMPLETED":
      return isFrench ? "Terminee" : "Completed";
    case "ACTIVE":
      return isFrench ? "Active" : "Active";
    case "EXPIRED":
      return isFrench ? "Expiree" : "Expired";
    default:
      return status;
  }
}

function resolvePrepTargetToken(
  booking: PrivateBookingSummary | null,
  packageSummary: PrivateBookingPackageSummary | null,
) {
  if (booking) {
    return booking.token;
  }

  return packageSummary?.bookings.find((item) => item.status === "BOOKED")?.token ?? packageSummary?.bookings[0]?.token ?? null;
}

export default function PrivateBookingManagePage({
  config,
  initialEntity,
  locale,
  notice,
}: PrivateBookingManagePageProps) {
  const labels = getLabels(locale);
  const [booking, setBooking] = useState<PrivateBookingSummary | null>(initialEntity.booking);
  const [standalonePackage, setStandalonePackage] = useState<PrivateBookingPackageSummary | null>(
    initialEntity.kind === "package" ? initialEntity.package : initialEntity.package,
  );
  const [prepAnswers, setPrepAnswers] = useState(() =>
    withPrivateBookingPrepDefaults(
      config.prep_fields,
      initialEntity.booking?.prep_answers ?? initialEntity.package?.prep_answers ?? {},
    ),
  );
  const [pageNotice, setPageNotice] = useState(initialNoticeMessage(notice, locale));
  const [prepError, setPrepError] = useState("");
  const [isSavingPrep, setIsSavingPrep] = useState(false);
  const [rescheduleAvailability, setRescheduleAvailability] = useState<PrivateBookingAvailability | null>(null);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [bookNextAvailability, setBookNextAvailability] = useState<PrivateBookingAvailability | null>(null);
  const [bookNextLoading, setBookNextLoading] = useState(false);
  const [bookNextError, setBookNextError] = useState("");
  const [selectedNextSlot, setSelectedNextSlot] = useState("");
  const [selectedPackageOptionId, setSelectedPackageOptionId] = useState(
    String(
      initialEntity.package?.package_option_id ??
        initialEntity.booking?.package?.package_option_id ??
        config.package_options.find((option) => option.is_default)?.id ??
        config.package_options[0]?.id ??
        "",
    ),
  );
  const [isBookingNext, setIsBookingNext] = useState(false);

  const packageSummary = booking?.package ?? standalonePackage;
  const normalizedPrepAnswers = useMemo(
    () => normalizePrivateBookingPrepAnswers(config.prep_fields, prepAnswers),
    [config.prep_fields, prepAnswers],
  );
  const hasMissingRequiredPrep = config.prep_fields.some(
    (field) => field.required && !isPrivateBookingPrepAnswerFilled(field, normalizedPrepAnswers[field.key]),
  );
  const prepTargetToken = resolvePrepTargetToken(booking, packageSummary);
  const canBookNext = Boolean(
    packageSummary &&
      packageSummary.status === "ACTIVE" &&
      config.package_options.length > 0 &&
      (config.flow_stage === "paid_package" || packageSummary.remaining_sessions > 0),
  );
  const showIntroPending = config.flow_stage === "intro_pending";

  useEffect(() => {
    if (!booking?.can_reschedule) {
      setRescheduleAvailability(null);
      setRescheduleError("");
      setSelectedRescheduleSlot("");
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({
      locale,
      booking_token: booking.token,
    });

    setRescheduleLoading(true);
    setRescheduleError("");

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
        setRescheduleAvailability(data);
        setSelectedRescheduleSlot((current) => {
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
        setRescheduleAvailability(null);
        setSelectedRescheduleSlot("");
        setRescheduleError(
          error instanceof Error
            ? error.message
            : isFrenchLocale(locale)
            ? "Impossible de charger les nouveaux creneaux."
            : "Unable to load replacement times.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setRescheduleLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [booking?.can_reschedule, booking?.start_datetime, booking?.token, locale]);

  useEffect(() => {
    if (!packageSummary?.token || !canBookNext || !selectedPackageOptionId) {
      setBookNextAvailability(null);
      setBookNextError("");
      setSelectedNextSlot("");
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({
      locale,
      package_token: packageSummary.token,
      package_option_id: selectedPackageOptionId,
    });

    setBookNextLoading(true);
    setBookNextError("");

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
        setBookNextAvailability(data);
        setSelectedNextSlot((current) => {
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
        setBookNextAvailability(null);
        setSelectedNextSlot("");
        setBookNextError(
          error instanceof Error
            ? error.message
            : isFrenchLocale(locale)
            ? "Impossible de charger les disponibilites pour la prochaine seance."
            : "Unable to load availability for the next session.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setBookNextLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [canBookNext, locale, packageSummary?.remaining_sessions, packageSummary?.token, selectedPackageOptionId]);

  async function handlePrepSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prepTargetToken) {
      setPrepError(labels.prepUnavailable);
      return;
    }

    if (hasMissingRequiredPrep) {
      setPrepError(
        isFrenchLocale(locale)
          ? "Merci de remplir les champs obligatoires avant d'enregistrer."
          : "Please complete the required fields before saving.",
      );
      return;
    }

    setPrepError("");
    setIsSavingPrep(true);

    try {
      const response = await fetch(
        `/api/private-booking/bookings/${encodeURIComponent(prepTargetToken)}/prep-form?locale=${encodeURIComponent(locale)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prep_answers: normalizedPrepAnswers,
          }),
        },
      );
      const payload = (await response.json().catch(() => null)) as PrivateBookingSummary | Record<string, unknown> | null;

      if (!response.ok) {
        throw new Error(firstErrorMessage(payload, labels.prepUnavailable));
      }

      const updatedBooking = payload as PrivateBookingSummary;
      if (booking) {
        setBooking(updatedBooking);
      }
      if (updatedBooking.package) {
        setStandalonePackage(updatedBooking.package);
      }
      setPrepAnswers(withPrivateBookingPrepDefaults(config.prep_fields, updatedBooking.prep_answers));
      setPageNotice(labels.prepSaved);
    } catch (error) {
      setPrepError(
        error instanceof Error
          ? error.message
          : isFrenchLocale(locale)
          ? "Impossible d'enregistrer les informations."
          : "Unable to save your details.",
      );
    } finally {
      setIsSavingPrep(false);
    }
  }

  async function handleReschedule() {
    if (!booking?.token || !selectedRescheduleSlot) {
      setRescheduleError(
        isFrenchLocale(locale)
          ? "Merci de choisir un nouveau creneau."
          : "Please choose a replacement slot.",
      );
      return;
    }

    setRescheduleError("");
    setIsRescheduling(true);

    try {
      const response = await fetch(
        `/api/private-booking/bookings/${encodeURIComponent(booking.token)}/reschedule?locale=${encodeURIComponent(locale)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start_datetime: selectedRescheduleSlot,
          }),
        },
      );
      const payload = (await response.json().catch(() => null)) as PrivateBookingSummary | Record<string, unknown> | null;

      if (!response.ok) {
        throw new Error(
          firstErrorMessage(
            payload,
            isFrenchLocale(locale) ? "Impossible de reprogrammer le rendez-vous." : "Unable to reschedule the booking.",
          ),
        );
      }

      const updatedBooking = payload as PrivateBookingSummary;
      setBooking(updatedBooking);
      if (updatedBooking.package) {
        setStandalonePackage(updatedBooking.package);
      }
      setPageNotice(labels.rescheduleSuccess);
    } catch (error) {
      setRescheduleError(
        error instanceof Error
          ? error.message
          : isFrenchLocale(locale)
          ? "Erreur de reprogrammation."
          : "Reschedule error.",
      );
    } finally {
      setIsRescheduling(false);
    }
  }

  async function handleCancel() {
    if (!booking?.token) {
      return;
    }

    if (!window.confirm(labels.cancelConfirm)) {
      return;
    }

    setCancelError("");
    setIsCancelling(true);

    try {
      const response = await fetch(
        `/api/private-booking/bookings/${encodeURIComponent(booking.token)}/cancel?locale=${encodeURIComponent(locale)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );
      const payload = (await response.json().catch(() => null)) as PrivateBookingSummary | Record<string, unknown> | null;

      if (!response.ok) {
        throw new Error(
          firstErrorMessage(
            payload,
            isFrenchLocale(locale) ? "Impossible d'annuler le rendez-vous." : "Unable to cancel the booking.",
          ),
        );
      }

      const updatedBooking = payload as PrivateBookingSummary;
      setBooking(updatedBooking);
      if (updatedBooking.package) {
        setStandalonePackage(updatedBooking.package);
      }
      setPageNotice(labels.cancelSuccess);
    } catch (error) {
      setCancelError(
        error instanceof Error
          ? error.message
          : isFrenchLocale(locale)
          ? "Erreur d'annulation."
          : "Cancellation error.",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  async function handleBookNext() {
    if (!packageSummary?.token || !selectedNextSlot) {
      setBookNextError(
        isFrenchLocale(locale)
          ? "Merci de choisir un creneau pour la prochaine seance."
          : "Please choose a time for the next session.",
      );
      return;
    }

    setBookNextError("");
    setIsBookingNext(true);

    try {
      const response = await fetch(
        `/api/private-booking/packages/${encodeURIComponent(packageSummary.token)}/book-next?locale=${encodeURIComponent(locale)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start_datetime: selectedNextSlot,
            package_option_id: selectedPackageOptionId ? Number(selectedPackageOptionId) : null,
          }),
        },
      );
      const payload = (await response.json().catch(() => null)) as PrivateBookingSummary | Record<string, unknown> | null;

      if (!response.ok) {
        throw new Error(firstErrorMessage(payload, labels.bookNextError));
      }

      const nextBooking = payload as PrivateBookingSummary;
      window.location.assign(withLocalePath(locale, `/private-booking/${nextBooking.token}?status=booked`));
    } catch (error) {
      setBookNextError(
        error instanceof Error
          ? error.message
          : labels.bookNextError,
      );
    } finally {
      setIsBookingNext(false);
    }
  }

  return (
    <section className="private-booking-shell">
      <div className="private-booking-header">
        <p className="private-booking-eyebrow">{labels.eyebrow}</p>
        <h1>{config.offer_title}</h1>
        {pageNotice ? <p className="private-booking-banner private-booking-banner--success">{pageNotice}</p> : null}
        {showIntroPending ? <p className="private-booking-banner private-booking-banner--warning">{labels.introPending}</p> : null}
      </div>

      <div className="private-booking-layout">
        <div className="private-booking-stack">
          {booking ? (
            <section className="private-booking-card">
              <div className="private-booking-section-heading">
                <h2>{labels.bookingSummary}</h2>
                <p>{formatPrivateBookingDateTime(booking.start_datetime, locale, booking.timezone)}</p>
              </div>
              <div className="private-booking-summary-grid">
                <div>
                  <strong>{labels.status}</strong>
                  <p>{formatStatus(booking.status, locale)}</p>
                </div>
                <div>
                  <strong>{labels.practitioner}</strong>
                  <p>{booking.practitioner_name}</p>
                </div>
                <div>
                  <strong>{labels.duration}</strong>
                  <p>{booking.duration_minutes} min</p>
                </div>
                <div>
                  <strong>{labels.payment}</strong>
                  <p>{formatPrivateBookingMoney(booking.package_total, booking.currency, locale)}</p>
                </div>
              </div>
              {booking.is_intro_call ? <p className="private-booking-help">{labels.introCall}</p> : null}
              {booking.payment_note ? <p className="private-booking-help">{booking.payment_note}</p> : null}
            </section>
          ) : null}

          {packageSummary ? (
            <section className="private-booking-card">
              <div className="private-booking-section-heading">
                <h2>{labels.packageSummary}</h2>
                <p>{packageSummary.package_label}</p>
              </div>
              <div className="private-booking-summary-grid">
                <div>
                  <strong>{labels.status}</strong>
                  <p>{formatStatus(packageSummary.status, locale)}</p>
                </div>
                <div>
                  <strong>{labels.remaining}</strong>
                  <p>{packageSummary.remaining_sessions}</p>
                </div>
                <div>
                  <strong>{labels.payment}</strong>
                  <p>{formatPrivateBookingMoney(packageSummary.price_total, packageSummary.currency, locale)}</p>
                </div>
                <div>
                  <strong>{labels.validUntil}</strong>
                  <p>
                    {packageSummary.valid_until
                      ? formatPrivateBookingDateTime(packageSummary.valid_until, locale)
                      : "—"}
                  </p>
                </div>
              </div>
              {packageSummary.payment_note ? <p className="private-booking-help">{packageSummary.payment_note}</p> : null}

              {packageSummary.bookings.length > 0 ? (
                <div className="private-booking-list-block">
                  <h3>{labels.currentSessions}</h3>
                  <ul className="private-booking-bookings">
                    {packageSummary.bookings.map((item) => (
                      <li className="private-booking-booking-item" key={item.token}>
                        <strong>{formatPrivateBookingDateTime(item.start_datetime, locale, item.timezone)}</strong>
                        <span>{formatStatus(item.status, locale)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          {config.prep_fields.length > 0 ? (
            <section className="private-booking-card">
              <div className="private-booking-section-heading">
                <h2>{labels.prepHeading}</h2>
              </div>
              <form className="private-booking-stack" onSubmit={handlePrepSubmit}>
                <PrivateBookingPrepFields
                  disabled={isSavingPrep || !prepTargetToken}
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
                {prepError ? <p className="private-booking-banner private-booking-banner--error">{prepError}</p> : null}
                <div className="private-booking-form-actions">
                  <button className="button-link" disabled={isSavingPrep || !prepTargetToken} type="submit">
                    {isSavingPrep ? labels.prepSubmitting : labels.prepSubmit}
                  </button>
                </div>
              </form>
            </section>
          ) : null}
        </div>

        <div className="private-booking-stack">
          {booking ? (
            <section className="private-booking-card">
              <div className="private-booking-section-heading">
                <h2>{labels.rescheduleHeading}</h2>
                {!booking.can_reschedule ? <p>{labels.selfServiceUnavailable}</p> : null}
              </div>

              {booking.can_reschedule ? (
                <>
                  <PrivateBookingSlotPicker
                    description={labels.selectAnotherSlot}
                    emptyMessage={labels.noTimes}
                    error={rescheduleError}
                    loading={rescheduleLoading}
                    loadingMessage={labels.loadingTimes}
                    onSelect={setSelectedRescheduleSlot}
                    selectedSlot={selectedRescheduleSlot}
                    slots={rescheduleAvailability?.slots ?? []}
                    title={labels.selectAnotherSlot}
                  />
                  <div className="private-booking-form-actions">
                    <button
                      className="button-link"
                      disabled={isRescheduling || rescheduleLoading || !selectedRescheduleSlot}
                      onClick={handleReschedule}
                      type="button"
                    >
                      {isRescheduling ? labels.rescheduleSubmitting : labels.rescheduleSubmit}
                    </button>
                  </div>
                </>
              ) : (
                <p className="private-booking-help">
                  {booking.can_cancel ? labels.cutoffMessage : labels.selfServiceUnavailable}
                </p>
              )}
            </section>
          ) : null}

          {booking ? (
            <section className="private-booking-card">
              <div className="private-booking-section-heading">
                <h2>{labels.cancelHeading}</h2>
              </div>
              {booking.can_cancel ? (
                <>
                  {cancelError ? <p className="private-booking-banner private-booking-banner--error">{cancelError}</p> : null}
                  <div className="private-booking-form-actions">
                    <button className="button-link button-link--secondary" disabled={isCancelling} onClick={handleCancel} type="button">
                      {isCancelling ? labels.cancelling : labels.cancelSubmit}
                    </button>
                  </div>
                </>
              ) : (
                <p className="private-booking-help">{labels.cutoffMessage}</p>
              )}
            </section>
          ) : null}

          {showIntroPending ? (
            <section className="private-booking-card">
              <div className="private-booking-section-heading">
                <h2>{labels.bookNextHeading}</h2>
              </div>
              <p className="private-booking-help">{labels.introPending}</p>
            </section>
          ) : null}

          {!showIntroPending && packageSummary ? (
            <section className="private-booking-card">
              <div className="private-booking-section-heading">
                <h2>{labels.bookNextHeading}</h2>
                <p>{labels.nextBookingHelp}</p>
              </div>

              {canBookNext ? (
                <>
                  {config.package_options.length > 1 ? (
                    <div className="private-booking-field">
                      <label htmlFor="private-booking-next-package-option">{labels.packageSummary}</label>
                      <select
                        className="private-booking-input"
                        id="private-booking-next-package-option"
                        onChange={(event) => setSelectedPackageOptionId(event.target.value)}
                        value={selectedPackageOptionId}
                      >
                        {config.package_options.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  <PrivateBookingSlotPicker
                    description={labels.nextBookingHelp}
                    emptyMessage={labels.noTimes}
                    error={bookNextError}
                    loading={bookNextLoading}
                    loadingMessage={labels.loadingTimes}
                    onSelect={setSelectedNextSlot}
                    selectedSlot={selectedNextSlot}
                    slots={bookNextAvailability?.slots ?? []}
                    title={labels.bookNextHeading}
                  />

                  <div className="private-booking-form-actions">
                    <button
                      className="button-link"
                      disabled={isBookingNext || bookNextLoading || !selectedNextSlot}
                      onClick={handleBookNext}
                      type="button"
                    >
                      {isBookingNext ? labels.bookNextSubmitting : labels.bookNextSubmit}
                    </button>
                  </div>
                </>
              ) : (
                <p className="private-booking-help">{labels.noRemainingSessions}</p>
              )}
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}
