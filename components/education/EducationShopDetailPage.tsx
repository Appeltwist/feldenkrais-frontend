import Link from "next/link";

import type { EducationShopProduct } from "@/lib/education-shop";
import { rewriteEducationLegacyHtml } from "@/lib/education-legacy-paths";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import MasterclassImageGallery from "@/components/offers/MasterclassImageGallery";

type EducationShopDetailPageProps = {
  product: EducationShopProduct;
  relatedProducts: EducationShopProduct[];
  locale: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function formatDisplayPrice(locale: string, amount: number | null) {
  if (amount === null) {
    return null;
  }

  return new Intl.NumberFormat(locale.toLowerCase().startsWith("fr") ? "fr" : "en", {
    currency: "EUR",
    style: "currency",
  }).format(amount);
}

function cleanProductBodyHtml(html: string, locale: string) {
  return rewriteEducationLegacyHtml(html, locale).replace(
    /(?:(?:<strong>|<b>)\s*(?:Price|Prix)\s*:?\s*(?:<\/strong>|<\/b>)|(?:Price|Prix)\s*:)\s*[^<]*<br\s*\/?>\s*/i,
    "",
  );
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
  const currentPrice = formatDisplayPrice(locale, product.currentPrice);
  const originalPrice = formatDisplayPrice(locale, product.originalPrice);

  return (
    <EducationContentPage className="education-shop-page" eyebrow="Shop" page={page}>
      <section className="education-shop-product">
        <div className="education-shop-product__gallery education-shop-card">
          <MasterclassImageGallery alt={product.title} images={product.galleryImageUrls} />
        </div>

        <aside className="education-shop-product__purchase education-shop-card">
          <p className="home-section-kicker">{t(locale, "Produit physique", "Physical product")}</p>
          <h2>{product.title}</h2>
          <p>{product.excerpt}</p>

          {currentPrice ? (
            <div className="education-shop-product__price">
              {originalPrice ? <span className="education-shop-product__price-original">{originalPrice}</span> : null}
              <strong>{currentPrice}</strong>
            </div>
          ) : null}

          <div className="education-center-intro__actions">
            <a className="education-button" href={product.purchaseUrl} rel="noreferrer" target="_blank">
              {t(locale, "Acheter", "Purchase")}
            </a>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/shop")}>
              {t(locale, "Retour à la boutique", "Back to shop")}
            </Link>
          </div>
        </aside>
      </section>

      {product.bodyHtml ? (
        <section className="education-shop-body education-card">
          <div
            className="legacy-html-block rich-text"
            dangerouslySetInnerHTML={{ __html: cleanProductBodyHtml(product.bodyHtml, locale) }}
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
