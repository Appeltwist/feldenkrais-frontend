"use client";

import { useMemo, useState } from "react";

import { useSiteContext } from "@/lib/site-context";

type ForestNewsletterFormVariant = "cta" | "footer";

type ForestNewsletterFormProps = {
  locale: string;
  placeholder: string;
  ctaText: string;
  source: string;
  variant?: ForestNewsletterFormVariant;
};

function getStatusCopy(locale: string) {
  const isFrench = locale.toLowerCase().startsWith("fr");

  return {
    submitting: isFrench ? "Envoi..." : "Sending...",
    success: isFrench
      ? "Merci, votre inscription à la newsletter est confirmée."
      : "Thanks, your newsletter signup is confirmed.",
    error: isFrench
      ? "Impossible de vous inscrire pour le moment. Réessayez dans un instant."
      : "We couldn't sign you up right now. Please try again in a moment.",
  };
}

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function ForestNewsletterForm({
  locale,
  placeholder,
  ctaText,
  source,
  variant = "cta",
}: ForestNewsletterFormProps) {
  const { hostname, centerSlug } = useSiteContext();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const statusCopy = useMemo(() => getStatusCopy(locale), [locale]);

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
    setIsSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/leads?${queryString}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          source,
          source_url: typeof window !== "undefined" ? window.location.href : "",
          consent_marketing: true,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { detail?: string }
          | null;
        throw new Error(body?.detail || statusCopy.error);
      }

      setEmail("");
      setIsSuccess(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error && submitError.message
          ? submitError.message
          : statusCopy.error,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const formClassName =
    variant === "footer" ? "fl-footer__form" : "forest-newsletter-cta__form";
  const inputClassName = variant === "footer" ? "fl-footer__input" : undefined;
  const buttonClassName = variant === "footer" ? "fl-footer__submit" : undefined;
  const statusClassName =
    variant === "footer" ? "fl-footer__status" : "forest-newsletter-cta__status";

  return (
    <div
      className={joinClasses(
        "forest-newsletter-form",
        `forest-newsletter-form--${variant}`,
      )}
    >
      <form className={formClassName} onSubmit={onSubmit}>
        <input
          aria-label={placeholder}
          autoComplete="email"
          className={inputClassName}
          name="email"
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError("");
            if (isSuccess) setIsSuccess(false);
          }}
          placeholder={placeholder}
          required
          type="email"
          value={email}
        />
        <button className={buttonClassName} disabled={isSubmitting} type="submit">
          {isSubmitting ? statusCopy.submitting : ctaText}
        </button>
      </form>

      {isSuccess ? (
        <p
          aria-live="polite"
          className={joinClasses(statusClassName, `${statusClassName}--success`)}
          role="status"
        >
          {statusCopy.success}
        </p>
      ) : null}

      {error ? (
        <p
          aria-live="assertive"
          className={joinClasses(statusClassName, `${statusClassName}--error`)}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
