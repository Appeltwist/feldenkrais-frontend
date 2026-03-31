"use client";

import { useMemo, useState } from "react";

import { useSiteContext } from "@/lib/site-context";

type EducationCenterContactFormProps = {
  centerName: string;
  centerSlug: string;
  locale: string;
  submitLabel: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationCenterContactForm({
  centerName,
  centerSlug,
  locale,
  submitLabel,
}: EducationCenterContactFormProps) {
  const { hostname } = useSiteContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
      const response = await fetch(`/api/leads?${queryString}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          email,
          source: "center-page-contact",
          source_url: typeof window !== "undefined" ? window.location.href : "",
          notes: `[${centerName}]\n\n${message}`,
          consent_marketing: false,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
        throw new Error(
          payload?.detail ||
            t(locale, "Impossible d'envoyer le message.", "Unable to send message."),
        );
      }

      setIsSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : t(locale, "Erreur lors de l'envoi.", "Submission error."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="education-center-contact-form education-center-contact-form--success">
        <h3>{t(locale, "Message envoyé", "Message sent")}</h3>
        <p>
          {t(
            locale,
            "Merci pour votre message. Nous reviendrons vers vous rapidement.",
            "Thank you for your message. We'll get back to you shortly.",
          )}
        </p>
      </div>
    );
  }

  return (
    <form className="education-center-contact-form" onSubmit={onSubmit}>
      <div className="education-center-contact-form__field">
        <label htmlFor={`center-contact-name-${centerSlug}`}>{t(locale, "Nom*", "Name*")}</label>
        <input
          id={`center-contact-name-${centerSlug}`}
          onChange={(event) => setName(event.target.value)}
          required
          type="text"
          value={name}
        />
      </div>

      <div className="education-center-contact-form__field">
        <label htmlFor={`center-contact-email-${centerSlug}`}>{t(locale, "Email*", "Email*")}</label>
        <input
          id={`center-contact-email-${centerSlug}`}
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </div>

      <div className="education-center-contact-form__field">
        <label htmlFor={`center-contact-message-${centerSlug}`}>{t(locale, "Votre message*", "Your message*")}</label>
        <textarea
          id={`center-contact-message-${centerSlug}`}
          onChange={(event) => setMessage(event.target.value)}
          required
          rows={5}
          value={message}
        />
      </div>

      {error ? <p className="education-center-contact-form__error">{error}</p> : null}

      <button className="education-center-contact-form__submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? t(locale, "Envoi...", "Sending...") : submitLabel}
      </button>
    </form>
  );
}
