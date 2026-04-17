import Link from "next/link";

import { isExternalHref, localizePath } from "@/lib/locale-path";

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
  const title =
    content?.title ?? t(locale, "S’inscrire à la newsletter", "Sign up for the Newsletter");
  const subtitle =
    content?.subtitle ?? t(locale, "& rester informé·e", "& Stay updated");
  const body =
    content?.body ??
    t(
      locale,
      "Inscrivez-vous et recevez la newsletter bimensuelle avec des articles, des recommandations de livres et les actualités Feldenkrais.",
      "Sign up and get the bi-weekly newsletter with articles, book recommendations and Feldenkrais Opportunities.",
    );
  const href = content?.href?.startsWith("/") ? localizePath(locale, content.href) : content?.href || "#";
  const buttonLabel =
    content?.buttonLabel ?? t(locale, "S’inscrire à la newsletter", "Sign up to the newsletter");
  const isExternal = isExternalHref(href);

  return (
    <section className={`education-promo-row education-promo-row--newsletter ${className}`.trim()}>
      <div className="education-promo-row__visual">
        <img
          alt={title || t(locale, "Aperçu de la newsletter Feldenkrais Education", "Preview of the Feldenkrais Education newsletter")}
          loading="lazy"
          src={content?.imageUrl || "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/10/Group-23675.png"}
        />
      </div>
      <div className="education-promo-row__copy education-promo-row__copy--dark">
        <h2>
          <span>{title}</span>
          {subtitle ? <em>{subtitle}</em> : null}
        </h2>
        <div className="education-promo-row__rule" />
        {body ? <p>{body}</p> : null}
        <div className="education-promo-row__actions education-promo-row__signup">
          {isExternal ? (
            <a className="education-button" href={href} rel="noreferrer" target="_blank">
              {buttonLabel}
            </a>
          ) : (
            <Link className="education-button" href={href}>
              {buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
