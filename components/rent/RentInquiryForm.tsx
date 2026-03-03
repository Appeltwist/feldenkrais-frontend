"use client";

import { useMemo, useState } from "react";

import { useSiteContext } from "@/lib/site-context";

type RentInquiryFormProps = {
  locale: string;
};

export default function RentInquiryForm({ locale }: RentInquiryFormProps) {
  const { hostname, centerSlug } = useSiteContext();
  const isFrench = locale.toLowerCase().startsWith("fr");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [desiredDates, setDesiredDates] = useState("");
  const [expectedAttendance, setExpectedAttendance] = useState("");
  const [notes, setNotes] = useState("");
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      hostname,
      center: centerSlug,
      locale,
    });
    return params.toString();
  }, [centerSlug, hostname, locale]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const attendanceNumber = Number.parseInt(expectedAttendance, 10);
      const payload = {
        full_name: fullName,
        email,
        source: "space-rental",
        source_url: typeof window !== "undefined" ? window.location.href : "",
        desired_dates: desiredDates,
        expected_attendance: Number.isFinite(attendanceNumber) ? attendanceNumber : null,
        notes,
        consent_marketing: consentMarketing,
      };

      const response = await fetch(`/api/leads?${queryString}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { detail?: string } | null;
        throw new Error(body?.detail || (isFrench ? "Impossible d'envoyer la demande." : "Unable to send inquiry."));
      }

      setIsSuccess(true);
      setFullName("");
      setEmail("");
      setDesiredDates("");
      setExpectedAttendance("");
      setNotes("");
      setConsentMarketing(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : isFrench ? "Erreur de soumission." : "Submission error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="lead-magnet rent-form">
      <h2>{isFrench ? "Demander un devis" : "Request a quote"}</h2>
      <p>
        {isFrench
          ? "Parlez-nous de votre événement et nous vous répondrons rapidement."
          : "Tell us about your event and we will follow up quickly with availability and pricing."}
      </p>
      <form className="rent-form__fields" onSubmit={onSubmit}>
        <input
          className="lead-magnet__input"
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder={isFrench ? "Nom complet" : "Full name"}
        />
        <input
          className="lead-magnet__input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={isFrench ? "E-mail" : "Email"}
          required
        />
        <input
          className="lead-magnet__input"
          type="text"
          value={desiredDates}
          onChange={(event) => setDesiredDates(event.target.value)}
          placeholder={isFrench ? "Dates souhaitées (ex: weekends d’avril)" : "Preferred dates (e.g., April weekends)"}
        />
        <input
          className="lead-magnet__input"
          type="number"
          min={1}
          max={5000}
          value={expectedAttendance}
          onChange={(event) => setExpectedAttendance(event.target.value)}
          placeholder={isFrench ? "Nombre de participants" : "Expected attendance"}
        />
        <textarea
          className="rent-form__textarea"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder={isFrench ? "Besoins techniques, horaire, type d’événement..." : "Technical needs, schedule, event type..."}
          rows={4}
        />
        <label className="rent-form__consent">
          <input
            checked={consentMarketing}
            onChange={(event) => setConsentMarketing(event.target.checked)}
            type="checkbox"
          />
          <span>
            {isFrench
              ? "J’accepte de recevoir des nouvelles occasionnelles de Forest Lighthouse."
              : "I agree to receive occasional updates from Forest Lighthouse."}
          </span>
        </label>
        <button className="button-link" disabled={isSubmitting} type="submit">
          {isSubmitting ? (isFrench ? "Envoi..." : "Sending...") : isFrench ? "Envoyer la demande" : "Send inquiry"}
        </button>
      </form>
      {isSuccess ? (
        <p>{isFrench ? "Merci, votre demande a été envoyée." : "Thanks, your request has been sent."}</p>
      ) : null}
      {error ? <p className="lead-magnet__error">{error}</p> : null}
    </section>
  );
}
