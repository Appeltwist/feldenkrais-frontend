import Link from "next/link";

import type { EducationTrainingCohort, EducationTrainingProgramStat } from "@/lib/education-training";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationFinancingPageProps = {
  locale: string;
  page: NarrativePage;
  cohorts: EducationTrainingCohort[];
  trainingStats: EducationTrainingProgramStat[];
};

type GuidanceCard = {
  title: string;
  body: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationFinancingPage({
  locale,
  page,
  cohorts,
  trainingStats,
}: EducationFinancingPageProps) {
  const fallbackTitle = t(locale, "Financer ma formation", "Financing your training");
  const fallbackSubtitle = t(
    locale,
    "Repères concrets pour comprendre les documents, les centres et les interlocuteurs selon votre situation.",
    "Concrete guidance for understanding the documents, centers, and contacts that matter for your situation.",
  );
  const fallbackHeroBody = t(
    locale,
    "Sur FE, le financement fait partie du parcours de recrutement. On ne cherche pas à tout standardiser: on aide plutôt à identifier le bon cadre, le bon centre, les bons documents et la bonne personne à contacter.",
    "On FE, financing is part of the recruitment pathway. We are not trying to standardize everything: we help identify the right framework, the right center, the right documents, and the right person to contact.",
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
      label: t(locale, "Parler financement", "Talk about financing"),
      url: localizePath(locale, "/contact"),
    },
  };

  const situations: GuidanceCard[] = [
    {
      title: t(locale, "Intermittent·e / secteur culturel", "Intermittent / cultural sector"),
      body: t(
        locale,
        "En France, l’AFDAS peut prendre en charge le coût pédagogique si les conditions de recevabilité sont réunies. Pôle Emploi peut aussi intervenir dans certains cas.",
        "In France, AFDAS may cover the pedagogical cost when eligibility conditions are met. Pôle Emploi may also support some pathways.",
      ),
    },
    {
      title: t(locale, "Indépendant·e / profession libérale", "Self-employed / liberal profession"),
      body: t(
        locale,
        "Selon votre activité, un fonds d’assurance formation peut financer tout ou partie du parcours. La première étape est souvent d’identifier le bon organisme.",
        "Depending on your activity, a training insurance fund may finance all or part of the pathway. The first step is usually identifying the right organism.",
      ),
    },
    {
      title: t(locale, "Salarié·e", "Employee"),
      body: t(
        locale,
        "Le plan de développement des compétences, les congés éducation payés, ou un échange avec l’employeur et les RH peuvent ouvrir des possibilités concrètes.",
        "The skills-development plan, paid educational leave, or a conversation with your employer and HR can open concrete possibilities.",
      ),
    },
    {
      title: t(locale, "Demandeur·euse d’emploi / situation spécifique", "Job seeker / specific situation"),
      body: t(
        locale,
        "Des dispositifs existent aussi pour les personnes en recherche d’emploi ou en situation de handicap, souvent avec un accompagnement au cas par cas.",
        "There are also pathways for job seekers or people with disabilities, often with case-by-case support.",
      ),
    },
  ];

  const preparation: GuidanceCard[] = [
    {
      title: t(locale, "Identifier votre cadre", "Identify your framework"),
      body: t(
        locale,
        "Pays, statut professionnel, employeur, organisme de financement potentiel: tout part de là.",
        "Country, professional status, employer, and possible funding body: everything starts there.",
      ),
    },
    {
      title: t(locale, "Réunir les bons documents", "Gather the right documents"),
      body: t(
        locale,
        "Programme, calendrier, fiche centre, points de contact, et parfois certification ou preuve d’agrément.",
        "Program, calendar, center sheet, contact points, and sometimes certification or accreditation evidence.",
      ),
    },
    {
      title: t(locale, "Parler avec le bon interlocuteur", "Talk to the right contact"),
      body: t(
        locale,
        "Conseiller·ère, RH, employeur ou organisme financeur: une bonne orientation évite beaucoup de friction.",
        "Advisor, HR, employer, or funding body: the right orientation saves a lot of friction.",
      ),
    },
  ];

  const regionMarkers: GuidanceCard[] = [
    {
      title: t(locale, "France", "France"),
      body: t(
        locale,
        "La page historique FE mettait en avant Qualiopi, l’AFDAS et les dispositifs liés à la formation professionnelle continue comme repères structurants.",
        "The historic FE page highlighted Qualiopi, AFDAS, and continuing professional training mechanisms as key markers.",
      ),
    },
    {
      title: t(locale, "Belgique", "Belgium"),
      body: t(
        locale,
        "Les Congés Éducation Payés et les conversations avec l’employeur ou le bon organisme restent des points d’entrée importants.",
        "Paid educational leave and conversations with an employer or the right organism remain important entry points.",
      ),
    },
    {
      title: t(locale, "International", "International"),
      body: t(
        locale,
        "Dès qu’un financement sort des cadres les plus classiques, le plus utile est souvent de repartir d’un programme PDF et d’un échange direct avec l’équipe.",
        "As soon as financing moves outside the most standard frameworks, the most useful step is often to start from a PDF program and a direct exchange with the team.",
      ),
    },
  ];

  return (
    <EducationContentPage className="education-financing-page" eyebrow={t(locale, "Financement", "Financing")} page={resolvedPage}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Se faire accompagner", "Get support")}</p>
          <h2>
            {t(
              locale,
              "Le financement dépend du centre, du pays, du statut et du bon dossier.",
              "Financing depends on the center, the country, the status, and the right dossier.",
            )}
          </h2>
          <p>
            {t(
              locale,
              "Quel que soit votre point de départ, l’idée n’est pas de tout savoir seul·e. FE accompagne la préparation du dossier, la lecture des programmes et l’identification des bons interlocuteurs.",
              "Whatever your starting point, the goal is not to figure everything out alone. FE helps with dossier preparation, reading the programs, and identifying the right contacts.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "Le cadre exact change selon la cohorte et le centre concernés. C’est pour cela qu’il est souvent utile de commencer par choisir la bonne page formation.",
              "The exact framework changes depending on the cohort and center involved. That is why it is often useful to start by choosing the right training page.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Repères FE", "FE markers")}</p>
          <h2>{t(locale, "Avant de commencer", "Before you begin")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Durée du parcours", "Program duration")}</dt>
              <dd>{trainingStats[0]?.value || t(locale, "4 ans", "4 years")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Documents clés", "Key documents")}</dt>
              <dd>{t(locale, "Programme PDF, calendrier, centre, contact", "Program PDF, calendar, center, contact")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Point d’entrée", "Entry point")}</dt>
              <dd>{t(locale, "Choisir la bonne cohorte", "Choose the right cohort")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/contact")}>
              {t(locale, "Parler financement", "Talk about financing")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/trainings")}>
              {t(locale, "Revenir à la formation", "Back to training")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Choisir d’abord la bonne cohorte", "Start by choosing the right cohort")}</h2>
          <Link className="text-link" href={localizePath(locale, "/trainings")}>
            {t(locale, "Voir toutes les cohortes", "See all cohorts")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-cohorts">
          {cohorts.map((cohort) => (
            <article className="education-card education-training-cohort-card" key={cohort.slug}>
              <p className="education-page__date-range">{cohort.location}</p>
              <h3>{cohort.name}</h3>
              <p>{cohort.page.subtitle ?? cohort.overviewParagraphs[0] ?? ""}</p>
              <div className="education-training-cohort-card__facts">
                <div>
                  <strong>{t(locale, "Période", "Period")}</strong>
                  <span>{cohort.periodLabel}</span>
                </div>
                <div>
                  <strong>{t(locale, "Tarif", "Price")}</strong>
                  <span>{cohort.pricing}</span>
                </div>
                <div>
                  <strong>{t(locale, "Direction", "Direction")}</strong>
                  <span>{cohort.director}</span>
                </div>
              </div>
              <div className="education-offer-card__actions">
                <Link className="education-button" href={localizePath(locale, `/trainings/${cohort.slug}`)}>
                  {t(locale, "Voir cette cohorte", "View this cohort")}
                </Link>
                <a className="education-text-link" href={cohort.pdfRequestHref}>
                  {t(locale, "Demander le PDF", "Request PDF")}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Situations fréquentes", "Common situations")}</h2>
          <Link className="text-link" href={localizePath(locale, "/contact")}>
            {t(locale, "Nous écrire", "Write to us")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-pathway">
          {situations.map((item) => (
            <article className="education-card education-training-pathway-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Ce qu’il faut préparer", "What to prepare")}</h2>
          <Link className="text-link" href={localizePath(locale, "/day-in-training")}>
            {t(locale, "Voir une journée type", "See a typical day")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--home-links">
          {preparation.map((item) => (
            <article className="education-card education-home-link-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Repères par contexte", "Markers by context")}</h2>
          <Link className="text-link" href={localizePath(locale, "/contact")}>
            {t(locale, "Clarifier ma situation", "Clarify my situation")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {regionMarkers.map((item) => (
            <article className="education-card education-home-link-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="education-training-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Étape suivante", "Next step")}</p>
          <h2>{t(locale, "Le plus utile reste souvent un échange direct.", "The most useful next move is often a direct conversation.")}</h2>
          <p>
            {t(
              locale,
              "Si vous hésitez entre plusieurs dispositifs ou ne savez pas par où commencer, écrivez-nous. Nous pourrons vous orienter vers le bon centre, les bons documents et le bon rythme.",
              "If you are unsure between several pathways or don’t know where to start, write to us. We can orient you toward the right center, documents, and rhythm.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/contact")}>
            {t(locale, "Nous contacter", "Contact us")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/day-in-training")}>
            {t(locale, "Voir une journée type", "See a typical day")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
