"use client";

import { useMemo, useState } from "react";

import { useSiteContext } from "@/lib/site-context";

type ForestPdfFormProps = {
  offerSlug: string;
  locale: string;
  placeholderText: string;
  ctaText: string;
};

export default function ForestPdfForm({
  offerSlug,
  locale,
  placeholderText,
  ctaText,
}: ForestPdfFormProps) {
  const { hostname, centerSlug } = useSiteContext();
  const [email, setEmail] = useState("");
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

  const downloadHref = `/api/offers/${encodeURIComponent(offerSlug)}/pdf?${queryString}`;

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
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { detail?: string }
          | null;
        throw new Error(payload?.detail || "Unable to save lead.");
      }

      setIsReady(true);
      setEmail("");
      window.open(downloadHref, "_blank", "noopener,noreferrer");
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unable to save lead.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFr = locale.startsWith("fr");

  return (
    <>
      <form className="forest-journey__pdf-form" onSubmit={onSubmit}>
        <input
          aria-label={placeholderText}
          className="forest-journey__pdf-input"
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholderText}
          type="email"
          value={email}
          required
        />
        <button
          className="forest-journey__pdf-btn"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "…" : ctaText}
        </button>
      </form>
      {isReady ? (
        <a
          className="forest-journey__pdf-fallback"
          href={downloadHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          {isFr ? "Le téléchargement ne démarre pas\u00a0? Cliquez ici." : "Download didn\u2019t start? Click here."}
        </a>
      ) : null}
      {error ? <p className="forest-journey__pdf-error">{error}</p> : null}
    </>
  );
}
