import EducationBetaReadOnlyNotice from "./EducationBetaReadOnly";

type EducationNewsletterSignupRowProps = {
  locale: string;
  className?: string;
  content?: {
    title?: string | null;
    subtitle?: string | null;
    body?: string | null;
    imageUrl?: string | null;
    href?: string | null;
    buttonLabel?: string | null;
  };
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationNewsletterSignupRow({
  locale,
  className = "",
  content,
}: EducationNewsletterSignupRowProps) {
  return (
    <section className={`education-promo-row education-promo-row--newsletter ${className}`.trim()}>
      <div className="education-promo-row__visual">
        <img
          alt={content?.title || t(locale, "Aperçu de la newsletter Feldenkrais Education", "Preview of the Feldenkrais Education newsletter")}
          loading="lazy"
          src={content?.imageUrl || "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/10/Group-23675.png"}
        />
      </div>
      <div className="education-promo-row__copy education-promo-row__copy--dark">
        <h2>
          <span>{content?.title || t(locale, "S’inscrire à la newsletter", "Sign up for the Newsletter")}</span>
          <em>{content?.subtitle || t(locale, "& rester informé·e", "& Stay updated")}</em>
        </h2>
        <div className="education-promo-row__rule" />
        <p>
          {content?.body ||
            t(
              locale,
              "Inscrivez-vous et recevez la newsletter bimensuelle avec des articles, des recommandations de livres et les actualités Feldenkrais.",
              "Sign up and get the bi-weekly newsletter with articles, book recommendations and Feldenkrais Opportunities.",
            )}
        </p>
        <EducationBetaReadOnlyNotice
          body={t(
            locale,
            "L'inscription à la newsletter restera fermée pendant la bêta. Vous pouvez parcourir le contenu, mais les inscriptions ouvriront au lancement.",
            "Newsletter signup stays closed during the beta. You can browse the content now, and subscriptions will open at launch.",
          )}
          className="education-promo-row__signup"
          compact
          locale={locale}
          title={content?.buttonLabel || t(locale, "Newsletter en pause", "Newsletter paused for beta")}
        />
      </div>
    </section>
  );
}
