import { localizePath } from "@/lib/locale-path";

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
  const href = content?.href?.startsWith("/") ? localizePath(locale, content.href) : content?.href || localizePath(locale, "/newsletter");

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
        <form action={href} className="education-promo-row__signup" method="get">
          <input
            aria-label={t(locale, "Adresse e-mail", "Email address")}
            name="email"
            placeholder={t(locale, "Adresse e-mail", "Email Address")}
            type="email"
          />
          <button type="submit">{content?.buttonLabel || t(locale, "S’abonner", "Subscribe")}</button>
        </form>
      </div>
    </section>
  );
}
