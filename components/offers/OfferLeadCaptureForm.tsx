"use client";

import { useMemo, useState } from "react";

import { useSiteContext } from "@/lib/site-context";

type OfferLeadCaptureFormVariant = "default" | "forest";

type OfferLeadCaptureFormProps = {
  offerSlug: string;
  locale: string;
  emailPlaceholder: string;
  ctaText: string;
  submittingText: string;
  fallbackText: string;
  consentLabel: string;
  consentHint?: string;
  defaultErrorText: string;
  variant?: OfferLeadCaptureFormVariant;
};

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function triggerDownload(href: string) {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.append(link);
  link.click();
  link.remove();
}

export default function OfferLeadCaptureForm({
  offerSlug,
  locale,
  emailPlaceholder,
  ctaText,
  submittingText,
  fallbackText,
  consentLabel,
  consentHint,
  defaultErrorText,
  variant = "default",
}: OfferLeadCaptureFormProps) {
  const { hostname, centerSlug } = useSiteContext();
  const [email, setEmail] = useState("");
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      hostname,
      center: centerSlug,
      locale,
    });
    return params.toString();
  }, [centerSlug, hostname, locale]);

  const downloadHref = useMemo(
    () => `/api/offers/${encodeURIComponent(offerSlug)}/pdf?${queryString}`,
    [offerSlug, queryString],
  );

  const consentHintId = useMemo(
    () =>
      `offer-lead-form-consent-${variant}-${offerSlug}`
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-"),
    [offerSlug, variant],
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/leads?${queryString}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          offer_slug: offerSlug,
          source: "offer_pdf_gate",
          consent_marketing: consentMarketing,
          source_url: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { detail?: string }
          | null;
        throw new Error(payload?.detail || defaultErrorText);
      }

      setIsReady(true);
      setEmail("");
      triggerDownload(downloadHref);
    } catch (submitError) {
      setError(
        submitError instanceof Error && submitError.message
          ? submitError.message
          : defaultErrorText,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const formClassName =
    variant === "forest" ? "forest-journey__pdf-form" : "lead-magnet__form";
  const inputClassName =
    variant === "forest" ? "forest-journey__pdf-input" : "lead-magnet__input";
  const buttonClassName =
    variant === "forest"
      ? "forest-journey__pdf-btn"
      : "button-link lead-magnet__button";
  const fallbackClassName =
    variant === "forest"
      ? "forest-journey__pdf-fallback"
      : "offer-lead-form__fallback text-link";
  const errorClassName =
    variant === "forest" ? "forest-journey__pdf-error" : "lead-magnet__error";

  return (
    <div className={joinClasses("offer-lead-form", `offer-lead-form--${variant}`)}>
      <form className={formClassName} onSubmit={onSubmit}>
        <input
          aria-label={emailPlaceholder}
          autoComplete="email"
          className={inputClassName}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={emailPlaceholder}
          required
          type="email"
          value={email}
        />
        <button className={buttonClassName} disabled={isSubmitting} type="submit">
          {isSubmitting ? submittingText : ctaText}
        </button>
      </form>

      <label className="offer-lead-form__consent">
        <input
          aria-describedby={consentHint ? consentHintId : undefined}
          checked={consentMarketing}
          className="offer-lead-form__checkbox"
          onChange={(event) => setConsentMarketing(event.target.checked)}
          type="checkbox"
        />
        <span className="offer-lead-form__consent-label">{consentLabel}</span>
      </label>

      {consentHint ? (
        <p className="offer-lead-form__hint" id={consentHintId}>
          {consentHint}
        </p>
      ) : null}

      {isReady ? (
        <a
          className={fallbackClassName}
          href={downloadHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          {fallbackText}
        </a>
      ) : null}

      {error ? <p className={errorClassName}>{error}</p> : null}
    </div>
  );
}
