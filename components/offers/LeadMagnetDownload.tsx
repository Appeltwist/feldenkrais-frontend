"use client";

import { useMemo, useState } from "react";

import { useSiteContext } from "@/lib/site-context";

type LeadMagnetDownloadProps = {
  offerSlug: string;
  offerType: string;
  locale: string;
};

function normalizeType(value: string) {
  return value.trim().toUpperCase();
}

export default function LeadMagnetDownload({ offerSlug, offerType, locale }: LeadMagnetDownloadProps) {
  const normalizedType = normalizeType(offerType);
  const isSupported = normalizedType === "WORKSHOP" || normalizedType === "TRAINING_INFO";
  const { hostname, centerSlug } = useSiteContext();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);

  const isFrench = locale.toLowerCase().startsWith("fr");

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      hostname,
      center: centerSlug,
      locale,
    });
    return params.toString();
  }, [centerSlug, hostname, locale]);

  const downloadHref = `/api/offers/${encodeURIComponent(offerSlug)}/pdf?${queryString}`;

  if (!isSupported) {
    return null;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/leads?${queryString}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          offer_slug: offerSlug,
          source: "offer_pdf_gate",
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
        throw new Error(payload?.detail || "Unable to save lead.");
      }

      setIsReady(true);
      setEmail("");
      window.open(downloadHref, "_blank", "noopener,noreferrer");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to save lead.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="lead-magnet">
      <h3>{isFrench ? "Télécharger la fiche PDF" : "Download the PDF sheet"}</h3>
      <p>
        {isFrench
          ? "Entrez votre e-mail pour recevoir la version PDF de cette offre."
          : "Enter your email to get the branded PDF version of this offer."}
      </p>
      <form className="lead-magnet__form" onSubmit={onSubmit}>
        <input
          className="lead-magnet__input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={isFrench ? "Votre e-mail" : "Your email"}
          required
        />
        <button className="button-link" disabled={isSubmitting} type="submit">
          {isSubmitting ? (isFrench ? "Envoi..." : "Sending...") : isFrench ? "Télécharger PDF" : "Download PDF"}
        </button>
      </form>
      {isReady ? (
        <p>
          <a className="text-link" href={downloadHref}>
            {isFrench ? "Le téléchargement ne démarre pas ? Cliquez ici." : "Download did not start? Click here."}
          </a>
        </p>
      ) : null}
      {error ? <p className="lead-magnet__error">{error}</p> : null}
    </section>
  );
}
