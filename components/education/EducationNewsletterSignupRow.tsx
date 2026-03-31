import { localizePath } from "@/lib/locale-path";

type EducationNewsletterSignupRowProps = {
  locale: string;
  className?: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationNewsletterSignupRow({
  locale,
  className = "",
}: EducationNewsletterSignupRowProps) {
  return (
    <section className={`education-promo-row education-promo-row--newsletter ${className}`.trim()}>
      <div className="education-promo-row__visual">
        <img
          alt={t(locale, "Aperçu de la newsletter Feldenkrais Education", "Preview of the Feldenkrais Education newsletter")}
          loading="lazy"
          src="https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/10/Group-23675.png"
        />
      </div>
      <div className="education-promo-row__copy education-promo-row__copy--dark">
        <h2>
          <span>{t(locale, "S’inscrire à la newsletter", "Sign up for the Newsletter")}</span>
          <em>{t(locale, "& rester informé·e", "& Stay updated")}</em>
        </h2>
        <div className="education-promo-row__rule" />
        <p>
          {t(
            locale,
            "Inscrivez-vous et recevez la newsletter bimensuelle avec des articles, des recommandations de livres et les actualités Feldenkrais.",
            "Sign up and get the bi-weekly newsletter with articles, book recommendations and Feldenkrais Opportunities.",
          )}
        </p>
        <form action={localizePath(locale, "/newsletter")} className="education-promo-row__signup" method="get">
          <input
            aria-label={t(locale, "Adresse e-mail", "Email address")}
            name="email"
            placeholder={t(locale, "Adresse e-mail", "Email Address")}
            type="email"
          />
          <button type="submit">{t(locale, "S’abonner", "Subscribe")}</button>
        </form>
      </div>
    </section>
  );
}
