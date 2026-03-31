import Link from "next/link";

import type { EducationShopProduct } from "@/lib/education-shop";
import { rewriteEducationLegacyHtml } from "@/lib/education-legacy-paths";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationShopDetailPageProps = {
  product: EducationShopProduct;
  relatedProducts: EducationShopProduct[];
  locale: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationShopDetailPage({
  product,
  relatedProducts,
  locale,
}: EducationShopDetailPageProps) {
  const page: NarrativePage = {
    routeKey: `shop-${product.slug}`,
    locale,
    title: product.title,
    subtitle: product.excerpt,
    hero: {
      title: product.title,
      body: product.excerpt,
      imageUrl: product.imageUrl,
    },
    sections: [],
    primaryCta: null,
    seo: {
      title: `${product.title} | Feldenkrais Education`,
      description: product.excerpt,
    },
  };

  return (
    <EducationContentPage className="education-shop-page" eyebrow="Shop" page={page}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Produit FE", "FE product")}</p>
          <h2>{t(locale, "Un support de pratique issu du catalogue historique FE", "A practice support from the historical FE catalog")}</h2>
          <p>{product.excerpt}</p>
        </article>
        <aside className="education-center-intro__facts">
          {product.priceLabel ? <p className="education-page__date-range">{product.priceLabel}</p> : null}
          <h2>{t(locale, "Étape suivante", "Next step")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Type", "Type")}</dt>
              <dd>{t(locale, "Support de pratique", "Practice support")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Source", "Source")}</dt>
              <dd>{t(locale, "Archive boutique FE", "FE shop archive")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/shop")}>
              {t(locale, "Retour à la boutique", "Back to shop")}
            </Link>
            {product.sourceUrl ? (
              <a className="education-button education-button--secondary" href={product.sourceUrl} rel="noreferrer" target="_blank">
                {t(locale, "Voir la source d’origine", "See original source")}
              </a>
            ) : null}
          </div>
        </aside>
      </section>

      {product.bodyHtml ? (
        <section className="education-shop-body education-card">
          <div
            className="legacy-html-block rich-text"
            dangerouslySetInnerHTML={{ __html: rewriteEducationLegacyHtml(product.bodyHtml, locale) }}
          />
        </section>
      ) : null}

      {relatedProducts.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Autres produits", "Other products")}</h2>
            <Link className="text-link" href={localizePath(locale, "/shop")}>
              {t(locale, "Voir toute la boutique", "View the full shop")}
            </Link>
          </div>
          <div className="education-card-grid education-card-grid--shop">
            {relatedProducts.map((item) => (
              <article className="education-card education-shop-card" key={item.slug}>
                {item.imageUrl ? (
                  <div
                    className="education-shop-card__media"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.9)), url(${item.imageUrl})`,
                    }}
                  />
                ) : null}
                <div className="education-shop-card__body">
                  {item.priceLabel ? <p className="education-page__date-range">{item.priceLabel}</p> : null}
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <div className="education-offer-card__actions">
                    <Link className="education-button" href={localizePath(locale, `/shop/${item.slug}`)}>
                      {t(locale, "Voir le produit", "View product")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </EducationContentPage>
  );
}
