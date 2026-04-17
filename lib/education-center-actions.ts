export type EducationCenterActionSlug = "cantal" | "brussels" | "paris";

export type EducationCenterActionOption = {
  slug: EducationCenterActionSlug;
  label: string;
  signupHref: string | null;
  bookCallHref: string | null;
  pdfGroupValue: string;
};

export const EDUCATION_PDF_MAILCHIMP_ACTION =
  "https://Feldenkrais-education.us5.list-manage.com/subscribe/post?u=24a48c8e4ce1743d8d5e18545&id=6a8287d548&f_id=00c9b8edf0";

export const EDUCATION_PDF_MAILCHIMP_U = "24a48c8e4ce1743d8d5e18545";
export const EDUCATION_PDF_MAILCHIMP_ID = "6a8287d548";
export const EDUCATION_PDF_MAILCHIMP_BOT_FIELD =
  "b_24a48c8e4ce1743d8d5e18545_6a8287d548";

function isFrench(locale: string) {
  return locale.toLowerCase().startsWith("fr");
}

export function getEducationCenterActionOptions(
  locale: string,
): EducationCenterActionOption[] {
  const fr = isFrench(locale);

  return [
    {
      slug: "cantal",
      label: "Cantal",
      signupHref: "https://neurosomatic.cloud/intake/cantal-6/",
      bookCallHref: "https://neurosomatic.cloud/book/?training=Cantal+6",
      pdfGroupValue: "131072",
    },
    {
      slug: "brussels",
      label: fr ? "Bruxelles" : "Brussels",
      signupHref: "https://neurosomatic.cloud/intake/bruxelles-5/",
      bookCallHref: "https://neurosomatic.cloud/book/?training=Bruxelles+5",
      pdfGroupValue: "65536",
    },
    {
      slug: "paris",
      label: "Paris",
      signupHref: null,
      bookCallHref: null,
      pdfGroupValue: "16384",
    },
  ];
}

export function getEducationCenterActionOption(
  locale: string,
  slug: EducationCenterActionSlug,
) {
  return (
    getEducationCenterActionOptions(locale).find((option) => option.slug === slug) ??
    null
  );
}
