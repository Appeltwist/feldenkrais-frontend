"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import {
  EDUCATION_PDF_MAILCHIMP_ACTION,
  EDUCATION_PDF_MAILCHIMP_BOT_FIELD,
  EDUCATION_PDF_MAILCHIMP_ID,
  EDUCATION_PDF_MAILCHIMP_U,
  getEducationCenterActionOptions,
  type EducationCenterActionSlug,
} from "@/lib/education-center-actions";

type EducationCenterActionVariant = "signup" | "book-call" | "download-pdf";

type EducationCenterActionModalButtonProps = {
  variant: EducationCenterActionVariant;
  locale: string;
  label: string;
  className?: string;
  secondary?: boolean;
  centers?: EducationCenterActionSlug[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function defaultCentersForVariant(
  variant: EducationCenterActionVariant,
): EducationCenterActionSlug[] {
  if (variant === "download-pdf") {
    return ["cantal", "brussels", "paris"];
  }

  return ["cantal", "brussels"];
}

export default function EducationCenterActionModalButton({
  variant,
  locale,
  label,
  className = "",
  secondary = false,
  centers,
}: EducationCenterActionModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] =
    useState<EducationCenterActionSlug | null>(null);
  const headingId = useId();
  const emailId = useId();
  const availableCenters = getEducationCenterActionOptions(locale).filter((option) =>
    (centers || defaultCentersForVariant(variant)).includes(option.slug),
  );
  const selectedOption =
    availableCenters.find((option) => option.slug === selectedCenter) ?? null;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const modalTitle =
    variant === "download-pdf"
      ? t(
          locale,
          "Choisissez un centre pour recevoir le PDF",
          "Choose a center to receive the PDF",
        )
      : t(locale, "Choisissez un centre", "Choose a center");
  const modalBody =
    variant === "signup"
      ? t(
          locale,
          "Sélectionnez le centre dans lequel vous souhaitez vous inscrire.",
          "Select the center where you want to sign up.",
        )
      : variant === "book-call"
        ? t(
            locale,
            "Sélectionnez le centre avec lequel vous souhaitez réserver un appel.",
            "Select the center you want to book a call with.",
          )
        : t(
            locale,
            "Sélectionnez un centre puis entrez votre email pour recevoir le PDF correspondant.",
            "Select a center, then enter your email to receive the matching PDF.",
          );

  const triggerClassName = [
    "education-button",
    secondary ? "education-button--secondary" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const modal =
    isOpen && typeof document !== "undefined" ? (
      <div
        aria-labelledby={headingId}
        aria-modal="true"
        className="education-center-modal"
        onClick={() => setIsOpen(false)}
        role="dialog"
      >
        <div
          className="education-center-modal__dialog"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            aria-label={t(locale, "Fermer", "Close")}
            className="education-center-modal__close"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            ×
          </button>

          <p className="education-center-modal__eyebrow">
            {variant === "signup"
              ? t(locale, "Inscription", "Sign up")
              : variant === "book-call"
                ? t(locale, "Réserver un appel", "Book a call")
                : t(locale, "Télécharger le PDF", "Download the PDF")}
          </p>
          <h3 id={headingId}>{modalTitle}</h3>
          <p className="education-center-modal__body">{modalBody}</p>

          {variant === "download-pdf" ? (
            <>
              <div className="education-center-modal__options">
                {availableCenters.map((option) => (
                  <button
                    className={`education-center-modal__option${selectedCenter === option.slug ? " is-selected" : ""}`}
                    key={option.slug}
                    onClick={() => setSelectedCenter(option.slug)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {selectedOption ? (
                <form
                  action={EDUCATION_PDF_MAILCHIMP_ACTION}
                  className="education-center-modal__form"
                  method="post"
                  onSubmit={() => setIsOpen(false)}
                  target="_blank"
                >
                  <label htmlFor={emailId}>
                    {t(locale, "Entrez votre email", "Enter your email")}
                  </label>
                  <input
                    id={emailId}
                    name="EMAIL"
                    placeholder={t(locale, "Votre email", "Your email")}
                    required
                    type="email"
                  />
                  <input name="u" type="hidden" value={EDUCATION_PDF_MAILCHIMP_U} />
                  <input name="id" type="hidden" value={EDUCATION_PDF_MAILCHIMP_ID} />
                  <input
                    name="group[383113]"
                    type="hidden"
                    value={selectedOption.pdfGroupValue}
                  />
                  <div aria-hidden="true" className="education-center-modal__honeypot">
                    <input
                      autoComplete="off"
                      name={EDUCATION_PDF_MAILCHIMP_BOT_FIELD}
                      tabIndex={-1}
                      type="text"
                    />
                  </div>
                  <button className="education-button" type="submit">
                    {t(locale, "Recevoir le PDF", "Request PDF")}
                  </button>
                </form>
              ) : null}
            </>
          ) : (
            <div className="education-center-modal__option-grid">
              {availableCenters
                .filter((option) =>
                  variant === "signup"
                    ? Boolean(option.signupHref)
                    : Boolean(option.bookCallHref),
                )
                .map((option) => {
                  const href =
                    variant === "signup" ? option.signupHref : option.bookCallHref;

                  if (!href) {
                    return null;
                  }

                  return (
                    <a
                      className="education-center-modal__option education-center-modal__option--link"
                      href={href}
                      key={`${variant}-${option.slug}`}
                      onClick={() => setIsOpen(false)}
                      rel="noreferrer"
                    >
                      <strong>{option.label}</strong>
                      <span>
                        {variant === "signup"
                          ? t(locale, "Commencer l’inscription", "Start application")
                          : t(locale, "Réserver un appel", "Book a call")}
                      </span>
                    </a>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    ) : null;

  return (
    <>
      <button
        className={triggerClassName}
        onClick={() => {
          setSelectedCenter(null);
          setIsOpen(true);
        }}
        type="button"
      >
        {label}
      </button>
      {modal ? createPortal(modal, document.body) : null}
    </>
  );
}
