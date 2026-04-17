import Link from "next/link";

import type { EducationShopData } from "@/lib/education-shop";
import { isExternalHref, localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationShopArchivePageProps = {
  page: NarrativePage;
  data: EducationShopData;
  locale: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationShopArchivePage({
  page,
  data,
  locale,
}: EducationShopArchivePageProps) {
  const resolvedPage: NarrativePage = {
    ...page,
    sections: [],
  };

  return (
    <EducationContentPage eyebrow="Shop" hideHero page={resolvedPage}>
      {data.highlights.length > 0 ? (
        <section className="home-section">
          <div className="home-section-head">
            <h2>{t(locale, "Ressources numériques", "Digital resources")}</h2>
          </div>
          <div className="education-card-grid education-card-grid--shop">
            {data.highlights.map((item) => {
              const isPlatformCard = /lesson-library|platform/i.test(item.href) || /lesson library/i.test(item.title);
              const ctaHref = item.href;
              const isExternal = isExternalHref(ctaHref);

              return (
                <article className="education-card education-shop-card" key={item.title}>
                  {item.imageUrl ? (
                    <div
                      className="education-shop-card__media"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.88)), url(${item.imageUrl})`,
                      }}
                    />
                  ) : null}
                  <div className="education-shop-card__body">
                    {item.priceLabel ? <p className="education-page__date-range">{item.priceLabel}</p> : null}
                    <h3>{item.title}</h3>
                    {item.metaLabels.length > 0 ? (
                      <div className="education-teacher-card__chips">
                        {item.metaLabels.map((label) => (
                          <span className="education-teacher-chip" key={`${item.title}-${label}`}>
                            {label}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="education-offer-card__actions">
                      {isExternal ? (
                        <a className="education-button" href={ctaHref} rel="noreferrer" target="_blank">
                          {isPlatformCard ? t(locale, "Ouvrir l’accès", "Open access") : t(locale, "Voir l’offre", "View offer")}
                        </a>
                      ) : (
                        <Link className="education-button" href={ctaHref}>
                          {isPlatformCard ? t(locale, "Voir l’accès", "View access") : t(locale, "Voir l’offre", "View offer")}
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {data.products.length > 0 ? (
        <section className="home-section">
          <div className="home-section-head">
            <h2>{t(locale, "Supports physiques", "Physical products")}</h2>
          </div>
          <div className="education-card-grid education-card-grid--shop">
            {data.products.map((product) => (
              <article className="education-card education-shop-card" key={product.slug}>
                {product.imageUrl ? (
                  <div
                    className="education-shop-card__media"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.9)), url(${product.imageUrl})`,
                    }}
                  />
                ) : null}
                <div className="education-shop-card__body">
                  {product.priceLabel ? <p className="education-page__date-range">{product.priceLabel}</p> : null}
                  <h3>{product.title}</h3>
                  <p>{product.excerpt}</p>
                  <div className="education-offer-card__actions">
                    <Link className="education-button" href={localizePath(locale, `/shop/${product.slug}`)}>
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
