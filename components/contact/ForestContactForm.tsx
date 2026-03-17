"use client";

import { useMemo, useState } from "react";

import { useSiteContext } from "@/lib/site-context";

type ForestContactFormProps = {
  locale: string;
};

export default function ForestContactForm({ locale }: ForestContactFormProps) {
  const { hostname, centerSlug } = useSiteContext();
  const isFr = locale.toLowerCase().startsWith("fr");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({ hostname, center: centerSlug, locale });
    return params.toString();
  }, [centerSlug, hostname, locale]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const payload = {
        full_name: name,
        email,
        source: "contact-form",
        source_url: typeof window !== "undefined" ? window.location.href : "",
        notes: `[${subject}]\n\n${message}`,
        consent_marketing: consent,
      };

      const res = await fetch(`/api/leads?${queryString}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { detail?: string } | null;
        throw new Error(
          body?.detail || (isFr ? "Impossible d'envoyer le message." : "Unable to send message."),
        );
      }

      setIsSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setConsent(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isFr
            ? "Erreur lors de l'envoi."
            : "Submission error.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="fp-contact-form fp-contact-form--success">
        <div className="fp-contact-form__success-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="fp-contact-form__success-title">
          {isFr ? "Message envoyé" : "Message sent"}
        </h3>
        <p className="fp-contact-form__success-body">
          {isFr
            ? "Merci pour votre message. Nous reviendrons vers vous rapidement."
            : "Thank you for reaching out. We'll get back to you shortly."}
        </p>
        <button
          className="fp-contact-form__reset"
          onClick={() => setIsSuccess(false)}
          type="button"
        >
          {isFr ? "Envoyer un autre message" : "Send another message"}
        </button>
      </div>
    );
  }

  return (
    <form className="fp-contact-form" onSubmit={onSubmit}>
      <div className="fp-contact-form__row">
        <div className="fp-contact-form__field">
          <label className="fp-contact-form__label" htmlFor="contact-name">
            {isFr ? "Nom" : "Name"}
          </label>
          <input
            className="fp-contact-form__input"
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isFr ? "Votre nom" : "Your name"}
            required
          />
        </div>
        <div className="fp-contact-form__field">
          <label className="fp-contact-form__label" htmlFor="contact-email">
            {isFr ? "E-mail" : "Email"}
          </label>
          <input
            className="fp-contact-form__input"
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isFr ? "votre@email.com" : "you@email.com"}
            required
          />
        </div>
      </div>

      <div className="fp-contact-form__field">
        <label className="fp-contact-form__label" htmlFor="contact-subject">
          {isFr ? "Sujet" : "Subject"}
        </label>
        <select
          className="fp-contact-form__input fp-contact-form__select"
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        >
          <option value="" disabled>
            {isFr ? "Choisir un sujet..." : "Choose a subject..."}
          </option>
          <option value={isFr ? "Question générale" : "General question"}>
            {isFr ? "Question générale" : "General question"}
          </option>
          <option value={isFr ? "Cours & horaire" : "Classes & schedule"}>
            {isFr ? "Cours & horaire" : "Classes & schedule"}
          </option>
          <option value={isFr ? "Ateliers & formations" : "Workshops & trainings"}>
            {isFr ? "Ateliers & formations" : "Workshops & trainings"}
          </option>
          <option value={isFr ? "Location d'espace" : "Space rental"}>
            {isFr ? "Location d'espace" : "Space rental"}
          </option>
          <option value={isFr ? "Séance privée" : "Private session"}>
            {isFr ? "Séance privée" : "Private session"}
          </option>
          <option value={isFr ? "Autre" : "Other"}>
            {isFr ? "Autre" : "Other"}
          </option>
        </select>
      </div>

      <div className="fp-contact-form__field">
        <label className="fp-contact-form__label" htmlFor="contact-message">
          {isFr ? "Message" : "Message"}
        </label>
        <textarea
          className="fp-contact-form__input fp-contact-form__textarea"
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isFr ? "Comment pouvons-nous vous aider ?" : "How can we help you?"}
          rows={5}
          required
        />
      </div>

      <label className="fp-contact-form__consent">
        <input
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          type="checkbox"
        />
        <span>
          {isFr
            ? "J'accepte de recevoir des nouvelles occasionnelles de Forest Lighthouse."
            : "I agree to receive occasional updates from Forest Lighthouse."}
        </span>
      </label>

      {error ? <p className="fp-contact-form__error">{error}</p> : null}

      <button className="fp-contact-form__submit" disabled={isSubmitting} type="submit">
        {isSubmitting
          ? isFr
            ? "Envoi..."
            : "Sending..."
          : isFr
            ? "Envoyer"
            : "Send message"}
      </button>
    </form>
  );
}
