import EducationNeurosomaticHeader from "@/components/education/EducationNeurosomaticHeader";
import { getEducationMasterclassLocalePaths } from "@/lib/education-masterclass-media";
import { buildMasterclassLandingData, getMasterclassSupportFeatures } from "@/lib/masterclass-landing";
import { localizePath } from "@/lib/locale-path";
import type { OfferDetail } from "@/lib/types";

import MasterclassFaqTabs from "./MasterclassFaqTabs";
import MasterclassImageGallery from "./MasterclassImageGallery";
import MasterclassShareButton from "./MasterclassShareButton";

type MasterclassTemplateProps = {
  offer: OfferDetail;
  locale: string;
};

export default function MasterclassTemplate({ offer, locale }: MasterclassTemplateProps) {
  const isFr = locale.toLowerCase().startsWith("fr");
  const content = buildMasterclassLandingData(offer, locale);
  const supportFeatures = getMasterclassSupportFeatures(locale);
  const routePath = localizePath(locale, `/masterclasses/${content.slug}`);
  const localePaths = getEducationMasterclassLocalePaths(content.slug);

  return (
    <div className="neuro-platform-page neuro-masterclass-page">
      <EducationNeurosomaticHeader
        locale={locale}
        loginLabel={isFr ? "Connexion" : "Login"}
        localePaths={localePaths}
        routePath={`/masterclasses/${content.slug}`}
        title={isFr ? "LA PLATEFORME NEUROSOMATIQUE" : "THE NEUROSOMATIC PLATFORM"}
      />

      <section
        className="neuro-masterclass-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(8, 13, 28, 0.68), rgba(8, 13, 28, 0.84)), url(${content.heroImageUrl})`,
        }}
      >
        <div className="neuro-masterclass-shell">
          <div className="neuro-masterclass-hero__content">
            <h1>{content.heroTitle}</h1>
            <p className="neuro-masterclass-hero__teacher">{content.heroSubtitle}</p>
            <p className="neuro-masterclass-hero__description">{content.heroDescription}</p>

            <div className="neuro-masterclass-hero__quick-links">
              <a className="neuro-masterclass-hero__quick-link" href="#masterclass-sample">
                <span aria-hidden="true">▣</span>
                <span>{isFr ? "Extrait" : "Sample"}</span>
              </a>
              <MasterclassShareButton
                copiedLabel={isFr ? "Copié" : "Copied"}
                label={isFr ? "Partager" : "Share"}
                title={content.title}
                url={routePath}
              />
            </div>

            <p className="neuro-masterclass-hero__price">{content.priceText}</p>
            <p className="neuro-masterclass-hero__purchase">{content.purchaseLine}</p>

            {(content.buyUrl || content.giftUrl) ? (
              <div className="neuro-masterclass-hero__actions">
                {content.buyUrl ? (
                  <a className="neuro-platform-button neuro-platform-button--primary" href={content.buyUrl} rel="noreferrer" target="_blank">
                    {isFr ? "Acheter" : "Buy"}
                  </a>
                ) : null}
                {content.giftUrl ? (
                  <a className="neuro-platform-button neuro-platform-button--ghost" href={content.giftUrl} rel="noreferrer" target="_blank">
                    {isFr ? "Offrir" : "Gift"}
                  </a>
                ) : null}
              </div>
            ) : null}

            {content.guaranteeLine ? <p className="neuro-masterclass-hero__guarantee">{content.guaranteeLine}</p> : null}
          </div>
        </div>
      </section>

      <section className="neuro-masterclass-section" id="masterclass-sample">
        <div className="neuro-masterclass-shell">
          <div className="neuro-masterclass-section__heading">
            <h2>{isFr ? "Extrait du cours" : "Course Sample"}</h2>
          </div>

          <div className="neuro-masterclass-sample">
            <div className="neuro-masterclass-sample__media">
              {content.sampleVideoUrl ? (
                <iframe
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  src={content.sampleVideoUrl}
                  title={content.title}
                />
              ) : (
                <img alt={content.title} loading="lazy" src={content.samplePosterUrl || content.heroImageUrl} />
              )}
            </div>

            <aside className="neuro-masterclass-sample__card">
              <h3>{isFr ? "Description" : "Description"}</h3>
              {content.sampleDescription.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <ul className="neuro-masterclass-sample__meta">
                {content.sampleMeta.teacher ? <li>{`${isFr ? "Intervenant" : "Teacher"}: ${content.sampleMeta.teacher}`}</li> : null}
                {content.sampleMeta.length ? <li>{`${isFr ? "Durée" : "Length"}: ${content.sampleMeta.length}`}</li> : null}
                {content.sampleMeta.language ? <li>{`${isFr ? "Langue" : "Language"}: ${content.sampleMeta.language}`}</li> : null}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="neuro-masterclass-section">
        <div className="neuro-masterclass-shell">
          <div className="neuro-masterclass-section__heading">
            <h2>{isFr ? "Aperçu du cours" : "Course Overview"}</h2>
          </div>

          <div className="neuro-masterclass-overview">
            <div className="neuro-masterclass-teacher">
              <div className="neuro-masterclass-teacher__layout">
                <img alt={content.overviewTeacherName} className="neuro-masterclass-teacher__image" loading="lazy" src={content.teacherImageUrl} />
                <div className="neuro-masterclass-teacher__copy">
                  <p className="neuro-masterclass-teacher__label">{isFr ? "Intervenant" : "Teacher"}</p>
                  <h3>{content.overviewTeacherName}</h3>
                  {content.overviewTeacherBio.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <aside className="neuro-masterclass-content-card">
              <h3>{isFr ? "Contenu" : "Content"}</h3>
              <div className="neuro-masterclass-content-card__list">
                {content.contentItems.map((item, index) => (
                  <details className="neuro-masterclass-content-card__item" key={item.title} open={index === 0}>
                    <summary>{item.title}</summary>
                    <p>{item.description}</p>
                  </details>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="neuro-masterclass-section">
        <div className="neuro-masterclass-shell">
          <div className="neuro-masterclass-section__heading">
            <h2>{isFr ? "À qui s’adresse ce cours" : "For Whom Is This Course"}</h2>
          </div>

          <div className="neuro-masterclass-audience-grid">
            {content.audienceCards.map((card) => (
              <article className="neuro-masterclass-audience-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="neuro-masterclass-section">
        <div className="neuro-masterclass-shell">
          <div className="neuro-masterclass-reasons">
            <div className="neuro-masterclass-reasons__media">
              <MasterclassImageGallery alt={content.title} images={content.galleryImageUrls} />
            </div>

            <div className="neuro-masterclass-reasons__card">
              <h2>{isFr ? "Pourquoi rejoindre ce cours ?" : "Why Join This Course ?"}</h2>
              <ul>
                {content.benefitItems.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="neuro-masterclass-price-bar">
            <p className="neuro-masterclass-price-bar__price">{content.priceText}</p>
            <p className="neuro-masterclass-price-bar__purchase">{content.purchaseLine}</p>
            {(content.buyUrl || content.giftUrl) ? (
              <div className="neuro-masterclass-price-bar__actions">
                {content.buyUrl ? (
                  <a className="neuro-platform-button neuro-platform-button--primary" href={content.buyUrl} rel="noreferrer" target="_blank">
                    {isFr ? "Acheter" : "Buy"}
                  </a>
                ) : null}
                {content.giftUrl ? (
                  <a className="neuro-platform-button neuro-platform-button--ghost" href={content.giftUrl} rel="noreferrer" target="_blank">
                    {isFr ? "Offrir" : "Gift"}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="neuro-masterclass-section neuro-masterclass-section--faq">
        <div className="neuro-masterclass-shell">
          <div className="neuro-masterclass-support-list">
            {supportFeatures.map((feature) => (
              <div className="neuro-masterclass-support-list__item" key={feature}>
                <span aria-hidden="true">•</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <MasterclassFaqTabs tabs={content.faqTabs} title={isFr ? "FAQ" : "FAQ"} />
        </div>
      </section>
    </div>
  );
}
