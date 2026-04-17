"use client";

import EducationCenterActionModalButton from "./EducationCenterActionModalButton";

export type TrainingActionCohortOption = {
  slug: string;
  label: string;
  signupHref: string;
  pdfHref: string;
};

type EducationTrainingActionBarProps = {
  className?: string;
  cohorts: TrainingActionCohortOption[];
  locale: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationTrainingActionBar({
  className = "",
  cohorts,
  locale,
}: EducationTrainingActionBarProps) {
  if (cohorts.length === 0) {
    return null;
  }

  return (
    <div className={`education-training-action-bar ${className}`.trim()}>
      <div className="education-training-action-bar__buttons">
        <EducationCenterActionModalButton
          label={t(locale, "Télécharger le PDF", "Download the PDF")}
          locale={locale}
          variant="download-pdf"
        />
        <EducationCenterActionModalButton
          label={t(locale, "S'inscrire", "Sign Up")}
          locale={locale}
          secondary
          variant="signup"
        />
        <EducationCenterActionModalButton
          label={t(locale, "Réserver un appel", "Book a call")}
          locale={locale}
          secondary
          variant="book-call"
        />
      </div>
    </div>
  );
}
