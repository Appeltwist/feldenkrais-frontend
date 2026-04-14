"use client";

import { EducationBetaReadOnlyButton } from "./EducationBetaReadOnly";

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
  const selectedCohort =
    cohorts.find((cohort) => cohort.slug === "brussels-4") ??
    cohorts[0] ??
    null;

  if (!selectedCohort) {
    return null;
  }

  return (
    <div className={`education-training-action-bar ${className}`.trim()}>
      <div className="education-training-action-bar__buttons">
        <a
          className="education-button"
          href={selectedCohort.pdfHref}
          rel="noreferrer"
          target="_blank"
        >
          {t(locale, "Télécharger le PDF", "Download the PDF")}
        </a>
        <EducationBetaReadOnlyButton label={t(locale, "S'inscrire", "Sign Up")} locale={locale} secondary />
        <EducationBetaReadOnlyButton label={t(locale, "Réserver un appel", "Book a call")} locale={locale} secondary />
      </div>
    </div>
  );
}
