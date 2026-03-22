"use client";

import OfferLeadCaptureForm from "@/components/offers/OfferLeadCaptureForm";

type ForestPdfFormProps = {
  offerSlug: string;
  locale: string;
  placeholderText: string;
  ctaText: string;
  submittingText: string;
  fallbackText: string;
  consentLabel: string;
  consentHint: string;
  errorText: string;
};

export default function ForestPdfForm({
  offerSlug,
  locale,
  placeholderText,
  ctaText,
  submittingText,
  fallbackText,
  consentLabel,
  consentHint,
  errorText,
}: ForestPdfFormProps) {
  return (
    <OfferLeadCaptureForm
      consentHint={consentHint}
      consentLabel={consentLabel}
      ctaText={ctaText}
      defaultErrorText={errorText}
      emailPlaceholder={placeholderText}
      fallbackText={fallbackText}
      locale={locale}
      offerSlug={offerSlug}
      submittingText={submittingText}
      variant="forest"
    />
  );
}
