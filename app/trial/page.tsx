import { ForestPageShell } from "@/components/forest/ForestPageShell";
import MindbodyScheduleWidget from "@/components/classes/MindbodyScheduleWidget";
import TrialReviewsCarousel from "@/components/trial/TrialReviewsCarousel";
import { fetchSiteConfig } from "@/lib/api";
import { isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getPricingContent } from "@/lib/pricing-content";
import { getTrialReviewsContent } from "@/lib/trial-reviews-content";

const MINDBODY_SCHEDULE_WIDGET_ID = "db159594878";

export default async function TrialPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const isFr = locale.toLowerCase().startsWith("fr");

  const isForest = siteConfig ? isForestCenter(siteConfig.centerSlug) : true;

  if (siteConfig && !isForest) {
    return (
      <section className="page-section">
        <h1>{isFr ? "Page introuvable" : "Page not found"}</h1>
      </section>
    );
  }

  const content = getPricingContent(locale);
  const journeySteps = content.hero.journeySteps;
  const reviewSection = getTrialReviewsContent(locale);

  return (
    <ForestPageShell>
      <section className="trial-page">
        <div className="trial-page__intro">
          <h1 className="trial-page__title">
            {isFr ? "Votre premier cours est offert" : "Your first class is free"}
          </h1>
          <p className="trial-page__subtitle">
            {isFr
              ? "Découvrez Forest Lighthouse et commencez votre pratique."
              : "Discover Forest Lighthouse and start your practice."}
          </p>

        </div>

        {/* Journey Steps */}
        <div className="fp-journey-steps">
          <div
            className="fl-steps is-visible"
            aria-label={isFr ? "Parcours en 5 étapes" : "5-step journey"}
          >
            {journeySteps.map((step, index) => {
              const isFirst = index === 0 && step.highlighted && step.href;

              const stepContent = (
                <>
                  <div className="fl-step-num">{index + 1}</div>
                  <div className="fl-step-text">
                    {step.label ? `${step.label} ` : null}
                    {step.boldPart ? <strong>{step.boldPart}</strong> : null}
                  </div>
                </>
              );

              if (isFirst) {
                return (
                  <div className="fl-step fl-step-clickable" key={index}>
                    <a
                      aria-label={isFr ? "Réserver un cours d\u2019essai" : "Book a free trial class"}
                      href={step.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {stepContent}
                    </a>
                  </div>
                );
              }

              return (
                <div className="fl-step" key={index}>
                  {stepContent}
                </div>
              );
            })}
          </div>
        </div>

        {reviewSection.reviews.length > 0 ? (
          <div className="trial-page__reviews">
            <TrialReviewsCarousel
              aggregateRating={reviewSection.aggregateRating}
              ctaHref={reviewSection.ctaHref}
              labels={reviewSection.labels}
              reviews={reviewSection.reviews}
            />
          </div>
        ) : null}

        {/* Mindbody Schedule Widget */}
        <div className="trial-page__widget">
          <h2 className="trial-page__widget-title">
            {isFr ? "Choisissez votre cours" : "Choose your class"}
          </h2>
          <MindbodyScheduleWidget
            widgetId={MINDBODY_SCHEDULE_WIDGET_ID}
            loadingLabel={isFr ? "Chargement de l'horaire..." : "Loading schedule..."}
          />
        </div>
      </section>
    </ForestPageShell>
  );
}
