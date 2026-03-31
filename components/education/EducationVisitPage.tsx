import Link from "next/link";

import type { EducationCenterProfile } from "@/lib/education-content";
import type { EducationTrainingCohort } from "@/lib/education-training";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage, SiteFooterContact } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationVisitPageProps = {
  locale: string;
  page: NarrativePage;
  centers: EducationCenterProfile[];
  cohorts: EducationTrainingCohort[];
  contact: SiteFooterContact | null;
};

type VisitMarker = {
  title: string;
  body: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function getVisitMarkers(locale: string, center: EducationCenterProfile): VisitMarker[] {
  switch (center.slug) {
    case "cantal":
      return [
        {
          title: t(locale, "Arriver", "Arrival"),
          body: t(
            locale,
            "Le Cantal demande davantage d’anticipation. C’est moins un arrêt de passage qu’un vrai déplacement vers une période d’étude immersive.",
            "Cantal asks for more anticipation. It is less a quick stop and more a real journey toward an immersive period of study.",
          ),
        },
        {
          title: t(locale, "Séjour", "Stay"),
          body: t(
            locale,
            "On pense ici en termes de séjour: rythme du segment, repas, environnement, temps d’intégration et vie collective.",
            "Here you think in terms of a stay: the segment rhythm, meals, environment, integration time, and communal life.",
          ),
        },
      ];
    case "brussels":
      return [
        {
          title: t(locale, "Arriver", "Arrival"),
          body: t(
            locale,
            "Bruxelles est le centre le plus simple à rejoindre pour beaucoup d’étudiant·es: ville internationale, accès ferroviaire et vie urbaine dense.",
            "Brussels is the easiest center for many students to reach: an international city, strong rail access, and dense urban life.",
          ),
        },
        {
          title: t(locale, "Séjour", "Stay"),
          body: t(
            locale,
            "La visite s’organise plus facilement autour de trajets urbains, d’hébergements variés et d’un centre relié à d’autres pratiques dans la ville.",
            "A visit is easier to organize around city travel, varied accommodation, and a center linked to other practices in the city.",
          ),
        },
      ];
    default:
      return [
        {
          title: t(locale, "Arriver", "Arrival"),
          body: t(
            locale,
            "Paris combine une grande accessibilité avec un ancrage pédagogique dense. C’est un point d’entrée utile si vous cherchez une forte continuité de transmission dans un contexte urbain.",
            "Paris combines strong accessibility with dense pedagogical grounding. It is a useful entry point if you are looking for a strong continuity of transmission in an urban context.",
          ),
        },
        {
          title: t(locale, "Séjour", "Stay"),
          body: t(
            locale,
            "On prépare surtout ici le rythme du segment, les trajets et la manière d’articuler la vie de ville avec le travail de formation.",
            "Here the main preparation is the rhythm of the segment, transport, and how to articulate city life with the work of the training.",
          ),
        },
      ];
  }
}

export default function EducationVisitPage({
  locale,
  page,
  centers,
  cohorts,
  contact,
}: EducationVisitPageProps) {
  const fallbackTitle = t(locale, "Préparer ma visite", "Plan my visit");
  const fallbackSubtitle = t(
    locale,
    "Des repères simples pour préparer un segment, une visite de centre, une candidature ou un premier déplacement.",
    "Simple guidance for preparing a segment, a center visit, an application, or a first trip.",
  );
  const fallbackHeroBody = t(
    locale,
    "Sur FE, une visite dépend toujours du centre, de la cohorte et du type de parcours envisagé. Le but ici n’est pas de tout standardiser, mais de vous aider à préparer le bon déplacement au bon moment.",
    "On FE, a visit always depends on the center, the cohort, and the kind of pathway you are considering. The goal here is not to standardize everything, but to help you prepare the right trip at the right time.",
  );
  const resolvedPage: NarrativePage = {
    ...page,
    title: page.title || fallbackTitle,
    subtitle: page.subtitle || fallbackSubtitle,
    hero: {
      ...page.hero,
      title: page.hero.title || page.title || fallbackTitle,
      body: page.hero.body || page.subtitle || fallbackHeroBody,
    },
    primaryCta: page.primaryCta ?? {
      label: t(locale, "Nous contacter", "Contact us"),
      url: localizePath(locale, "/contact"),
    },
  };

  const checklist: VisitMarker[] = [
    {
      title: t(locale, "Choisir la bonne cohorte", "Choose the right cohort"),
      body: t(
        locale,
        "Avant de réserver quoi que ce soit, commencez par la cohorte ou le centre qui vous correspond le mieux.",
        "Before booking anything, start with the cohort or center that fits you best.",
      ),
    },
    {
      title: t(locale, "Vérifier le calendrier", "Check the schedule"),
      body: t(
        locale,
        "Segments, journées, intensité, temps entre les sessions: la forme du déplacement dépend du rythme réel de la formation.",
        "Segments, days, intensity, and time between sessions: the form of the trip depends on the real rhythm of the training.",
      ),
    },
    {
      title: t(locale, "Préparer les documents", "Prepare documents"),
      body: t(
        locale,
        "Programme PDF, informations financières, coordonnées du centre et repères pratiques vous feront gagner du temps.",
        "Program PDF, financing information, center details, and practical markers will save you time.",
      ),
    },
  ];

  return (
    <EducationContentPage className="education-visit-page" eyebrow={t(locale, "Visiter", "Visit")} page={resolvedPage}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Avant de venir", "Before you come")}</p>
          <h2>{t(locale, "Un même site, des visites très différentes selon le centre", "One site, very different visits depending on the center")}</h2>
          <p>
            {t(
              locale,
              "Venir à Bruxelles, au Cantal ou à Paris n’implique pas la même logistique, ni la même atmosphère. Cette page sert à vous orienter avant de passer aux détails plus concrets avec l’équipe ou le centre concerné.",
              "Coming to Brussels, Cantal, or Paris does not imply the same logistics or the same atmosphere. This page helps orient you before moving to more concrete details with the team or the relevant center.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "Si vous êtes encore en phase de comparaison, commencez plutôt par les pages centre et cohorte. Si votre venue se précise, utilisez cette page comme checklist pratique.",
              "If you are still in a comparison phase, start with the center and cohort pages instead. If your visit is becoming concrete, use this page as a practical checklist.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Checklist FE", "FE checklist")}</p>
          <h2>{t(locale, "Ce qu’il faut clarifier", "What to clarify")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Lieu", "Place")}</dt>
              <dd>{t(locale, "Quel centre ? quelle cohorte ?", "Which center? which cohort?")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Rythme", "Rhythm")}</dt>
              <dd>{t(locale, "Segment long, ville, retraite, cadence", "Long segment, city, retreat, cadence")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Contact", "Contact")}</dt>
              <dd>{contact?.email || t(locale, "Équipe FE", "FE team")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/location")}>
              {t(locale, "Voir les lieux", "See locations")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/contact")}>
              {t(locale, "Nous contacter", "Contact us")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Checklist avant de partir", "Checklist before you travel")}</h2>
          <Link className="text-link" href={localizePath(locale, "/trainings")}>
            {t(locale, "Revenir aux cohortes", "Back to cohorts")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {checklist.map((item) => (
            <article className="education-card education-home-link-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Préparer selon le centre", "Prepare depending on the center")}</h2>
          <Link className="text-link" href={localizePath(locale, "/centers")}>
            {t(locale, "Voir tous les centres", "View all centers")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--centers">
          {centers.map((center) => {
            const cohort = cohorts.find((item) => item.centerSlug === center.slug) ?? null;
            const markers = getVisitMarkers(locale, center);

            return (
              <article className="education-card home-center-card" key={center.slug}>
                <div
                  className="home-center-card__media"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.92)), url(${center.heroImageUrl})`,
                  }}
                />
                <div className="home-center-card__body">
                  <p className="home-center-card__location">{center.location}</p>
                  <h3>{center.name}</h3>
                  <p>{center.address}</p>
                  {markers.map((marker) => (
                    <p className="education-offer-card__meta" key={marker.title}>
                      <strong>{marker.title}:</strong> {marker.body}
                    </p>
                  ))}
                  {cohort ? (
                    <p className="education-offer-card__meta">
                      <strong>{t(locale, "Cohorte liée", "Related cohort")}:</strong> {cohort.name}
                    </p>
                  ) : null}
                  <div className="education-offer-card__actions">
                    <Link className="education-button" href={localizePath(locale, `/centers/${center.slug}`)}>
                      {t(locale, "Voir ce centre", "View this center")}
                    </Link>
                    {cohort ? (
                      <Link className="education-button education-button--secondary" href={localizePath(locale, `/trainings/${cohort.slug}`)}>
                        {t(locale, "Voir la cohorte", "View cohort")}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Dernier repère", "Last marker")}</p>
          <h2>{t(locale, "Mieux vaut un bon échange qu’une mauvaise supposition logistique", "A good exchange is better than the wrong logistical assumption")}</h2>
          <p>
            {t(
              locale,
              "Dès que votre venue devient concrète, écrivez-nous. Nous pourrons confirmer le bon centre, les bonnes dates, les bons documents et la bonne personne à contacter.",
              "As soon as your visit becomes concrete, write to us. We can confirm the right center, the right dates, the right documents, and the right person to contact.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/contact")}>
            {t(locale, "Nous écrire", "Write to us")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/financing")}>
            {t(locale, "Voir le financement", "See financing")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
