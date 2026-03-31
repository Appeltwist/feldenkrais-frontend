import Link from "next/link";

import type { EducationShopData } from "@/lib/education-shop";
import { localizePath } from "@/lib/locale-path";
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
  return (
    <EducationContentPage eyebrow="Shop" page={page}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Catalogue FE", "FE catalog")}</p>
          <h2>{t(locale, "Ressources numériques et supports de pratique", "Digital resources and practice supports")}</h2>
          <p>
            {t(
              locale,
              "Comme sur le site FE précédent, la boutique commence par des ressources numériques et se prolonge avec du matériel de pratique pour l’intégration fonctionnelle.",
              "As on the previous FE site, the shop starts with digital resources and extends into practice equipment for functional integration.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Catalogue en transition", "Catalog in transition")}</p>
          <h2>{t(locale, "Ce qui est visible", "What is visible")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Ressources numériques", "Digital resources")}</dt>
              <dd>{data.highlights.length}</dd>
            </div>
            <div>
              <dt>{t(locale, "Produits physiques", "Physical products")}</dt>
              <dd>{data.products.length}</dd>
            </div>
            <div>
              <dt>{t(locale, "Orientation", "Orientation")}</dt>
              <dd>{t(locale, "Catalogue FE curé à partir de l’archive", "FE catalog curated from the archive")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/platform")}>
              {t(locale, "Voir la plateforme", "View the platform")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/contact")}>
              {t(locale, "Nous contacter", "Contact us")}
            </Link>
          </div>
        </aside>
      </section>

      {data.highlights.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Ressources numériques", "Digital resources")}</h2>
            <Link className="text-link" href={localizePath(locale, "/platform")}>
              {t(locale, "Ouvrir la plateforme", "Open the platform")}
            </Link>
          </div>
          <div className="education-card-grid education-card-grid--shop">
            {data.highlights.map((item) => {
              const isPlatformCard = /lesson-library|platform/i.test(item.href) || /lesson library/i.test(item.title);
              const ctaHref = isPlatformCard ? "https://neurosomatic.com" : item.href;

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
                      <a className="education-button" href={ctaHref} rel="noreferrer" target="_blank">
                        {isPlatformCard ? t(locale, "Ouvrir Neurosomatic", "Open Neurosomatic") : t(locale, "Voir l’offre", "View offer")}
                      </a>
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
          <div className="link-row home-section-head">
            <h2>{t(locale, "Supports physiques", "Physical products")}</h2>
            <Link className="text-link" href={localizePath(locale, "/contact")}>
              {t(locale, "Poser une question", "Ask a question")}
            </Link>
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
