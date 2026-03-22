"use client";

import OfferLeadCaptureForm from "@/components/offers/OfferLeadCaptureForm";

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
  const isFrench = locale.toLowerCase().startsWith("fr");

  if (!isSupported) {
    return null;
  }

  const copy = isFrench
    ? {
        title: "Recevoir la fiche PDF",
        prompt: "Recevez une version claire et partageable de cette offre par e-mail.",
        placeholder: "Votre e-mail",
        cta: "Recevoir le PDF",
        submitting: "Préparation du PDF...",
        fallback: "Le téléchargement ne démarre pas ? Ouvrez le PDF directement.",
        consentLabel: "Je souhaite aussi recevoir des nouvelles et offres occasionnelles par e-mail.",
        consentHint: "Optionnel. Votre demande de PDF fonctionne sans inscription à la newsletter.",
        error: "Impossible de préparer le PDF pour le moment. Réessayez dans un instant.",
      }
    : {
        title: "Get the PDF guide",
        prompt: "Receive a clear, shareable PDF version of this offer by email.",
        placeholder: "Your email",
        cta: "Get the PDF",
        submitting: "Preparing your PDF...",
        fallback: "If the download does not start, open the PDF directly.",
        consentLabel: "I would also like occasional news and upcoming offers by email.",
        consentHint: "Optional. Your PDF request works without joining the newsletter.",
        error: "We could not prepare the PDF right now. Please try again in a moment.",
      };

  return (
    <section className="lead-magnet">
      <h3>{copy.title}</h3>
      <p>{copy.prompt}</p>
      <OfferLeadCaptureForm
        consentHint={copy.consentHint}
        consentLabel={copy.consentLabel}
        ctaText={copy.cta}
        defaultErrorText={copy.error}
        emailPlaceholder={copy.placeholder}
        fallbackText={copy.fallback}
        locale={locale}
        offerSlug={offerSlug}
        submittingText={copy.submitting}
      />
    </section>
  );
}
