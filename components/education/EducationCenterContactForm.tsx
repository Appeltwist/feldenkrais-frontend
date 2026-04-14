import EducationBetaReadOnlyNotice from "./EducationBetaReadOnly";

type EducationCenterContactFormProps = {
  centerName: string;
  centerSlug: string;
  locale: string;
  submitLabel: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationCenterContactForm({
  centerName,
  centerSlug: _centerSlug,
  locale,
  submitLabel,
}: EducationCenterContactFormProps) {
  return (
    <EducationBetaReadOnlyNotice
      body={t(
        locale,
        `La bêta FE reste en lecture seule. Le formulaire de contact pour ${centerName} rouvrira au lancement.`,
        `The FE beta stays read-only. The contact form for ${centerName} will reopen at launch.`,
      )}
      className="education-center-contact-form"
      locale={locale}
      title={submitLabel}
    />
  );
}
