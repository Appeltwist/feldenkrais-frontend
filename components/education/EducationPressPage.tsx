import Link from "next/link";

import type { EducationCenterProfile } from "@/lib/education-content";
import type { EducationTrainingProgramStat } from "@/lib/education-training";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage, SiteFooterContact, SocialLink } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationPressPageProps = {
  locale: string;
  page: NarrativePage;
  centers: EducationCenterProfile[];
  trainingStats: EducationTrainingProgramStat[];
  contact: SiteFooterContact | null;
  socials: SocialLink[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationPressPage({
  locale,
  page,
  centers,
  trainingStats,
  contact,
  socials,
}: EducationPressPageProps) {
  const resolvedPage: NarrativePage = {
    ...page,
    title: t(locale, "Presse", "Press"),
    subtitle: t(
      locale,
      "Repères rapides pour comprendre FE, le situer dans l’écosystème, et trouver la bonne personne ou la bonne page à citer.",
      "A quick guide to understand FE, place it in the ecosystem, and find the right person or page to cite.",
    ),
    hero: {
      ...page.hero,
      title: t(locale, "Presse", "Press"),
      body: t(
        locale,
        "Feldenkrais Education est un site de marque centré sur la transmission: formations professionnelles, cohortes, centres partenaires, ressources éditoriales et liens vers le reste de l’écosystème.",
        "Feldenkrais Education is a brand site centered on transmission: professional trainings, cohorts, partner centers, editorial resources, and links to the wider ecosystem.",
      ),
    },
  };

  const angles = [
    {
      title: t(locale, "Un site de recrutement et de transmission", "A recruitment and transmission site"),
      body: t(
        locale,
        "FE présente des parcours longs, des cohortes concrètes, des ressources et des contextes d’application, avec une voix plus institutionnelle et internationale que celle d’un centre unique.",
        "FE presents long-form pathways, concrete cohorts, resources, and application contexts, with a more institutional and international voice than a single center site.",
      ),
    },
    {
      title: t(locale, "Un écosystème multi-sites", "A multi-site ecosystem"),
      body: t(
        locale,
        "Le site relie plusieurs centres et, à terme, plusieurs marques du même backend. FE n’est donc pas un lieu physique mais une porte d’entrée éditoriale et pédagogique.",
        "The site links multiple centers and, eventually, multiple brands on the same backend. FE is therefore not a physical place but an editorial and pedagogical entry point.",
      ),
    },
    {
      title: t(locale, "Une continuité avec Neurosomatic", "A continuity with Neurosomatic"),
      body: t(
        locale,
        "Certaines ressources, pratiques et masterclasses vivent aussi sur Neurosomatic. FE sert à orienter vers ces autres couches du paysage sans les confondre.",
        "Some resources, practices, and masterclasses also live on Neurosomatic. FE helps orient people toward those other layers of the landscape without collapsing them together.",
      ),
    },
  ];

  const usefulPages = [
    {
      title: t(locale, "Formations", "Trainings"),
      body: t(locale, "Programmes, cohortes, documents et logique pédagogique.", "Programs, cohorts, documents, and pedagogical logic."),
      href: "/trainings",
    },
    {
      title: t(locale, "Centres", "Centers"),
      body: t(locale, "Les lieux partenaires qui accueillent les cohortes et parcours FE.", "Partner places hosting FE cohorts and pathways."),
      href: "/centers",
    },
    {
      title: t(locale, "12 domaines", "12 domains"),
      body: t(locale, "Les grands thèmes d’application historiquement portés par FE.", "The main application themes historically carried by FE."),
      href: "/domains",
    },
    {
      title: t(locale, "Newsletter", "Newsletter"),
      body: t(locale, "Une archive éditoriale utile pour voir la voix FE dans le temps.", "An editorial archive useful for seeing FE’s voice over time."),
      href: "/newsletter",
    },
  ];

  return (
    <EducationContentPage className="education-press-page" eyebrow={t(locale, "Presse", "Press")} page={resolvedPage}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "En une phrase", "In one sentence")}</p>
          <h2>{t(locale, "FE relie les parcours, les lieux et les personnes", "FE connects pathways, places, and people")}</h2>
          <p>
            {t(
              locale,
              "Pour la presse, le point important est simple: Feldenkrais Education n’est pas un centre. C’est le site public qui présente la logique d’ensemble, relie plusieurs centres, et met en avant les cohortes, ressources et formations de l’écosystème.",
              "For the press, the important point is simple: Feldenkrais Education is not a center. It is the public site that presents the overall logic, connects multiple centers, and brings the ecosystem’s cohorts, resources, and trainings into view.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "C’est aussi ce qui explique la différence de ton avec Forest Lighthouse: FE parle à une audience plus large, plus internationale, et plus orientée formation.",
              "That also explains the tonal difference from Forest Lighthouse: FE speaks to a broader, more international, and more training-oriented audience.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Faits rapides", "Quick facts")}</p>
          <h2>{t(locale, "Repères utiles", "Useful markers")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Type de site", "Site type")}</dt>
              <dd>{t(locale, "Site de marque / recrutement", "Brand / recruitment site")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Centres visibles", "Visible centers")}</dt>
              <dd>{centers.length}</dd>
            </div>
            <div>
              <dt>{t(locale, "Parcours FE", "FE pathway")}</dt>
              <dd>{trainingStats[0]?.value || t(locale, "4 ans", "4 years")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/about")}>
              {t(locale, "À propos de FE", "About FE")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/trainings")}>
              {t(locale, "Voir les formations", "View trainings")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Angles utiles", "Useful media angles")}</h2>
          <Link className="text-link" href={localizePath(locale, "/platform")}>
            {t(locale, "Voir la plateforme", "See the platform")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {angles.map((angle) => (
            <article className="education-card education-home-link-card" key={angle.title}>
              <h3>{angle.title}</h3>
              <p>{angle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Pages à citer ou à partager", "Pages to cite or share")}</h2>
          <Link className="text-link" href={localizePath(locale, "/newsletter")}>
            {t(locale, "Voir l’archive éditoriale", "See the editorial archive")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--home-links">
          {usefulPages.map((item) => (
            <article className="education-card education-home-link-card" key={item.href}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <Link className="education-text-link" href={localizePath(locale, item.href)}>
                {t(locale, "Ouvrir la page", "Open page")}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="education-contact-grid">
        <article className="education-contact-card">
          <h2>{t(locale, "Contact presse", "Press contact")}</h2>
          <div className="education-contact-card__links">
            {contact?.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : null}
            {contact?.phone ? <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a> : null}
          </div>
          <p>
            {t(
              locale,
              "Pour une demande d’entretien, un besoin de précision sur les formations, ou pour être dirigé vers le bon centre ou le bon intervenant.",
              "For interview requests, clarification about trainings, or to be directed to the right center or contributor.",
            )}
          </p>
        </article>

        <article className="education-contact-card">
          <h2>{t(locale, "Réseaux utiles", "Useful channels")}</h2>
          <div className="education-contact-card__links">
            {socials.map((social) => (
              <a href={social.url} key={social.url} rel="noreferrer" target="_blank">
                {social.label}
              </a>
            ))}
          </div>
          <p>
            {t(
              locale,
              "Ces canaux complètent le site pour suivre annonces, vidéos, publications et nouvelles ouvertures.",
              "These channels complement the site for following announcements, videos, publications, and new openings.",
            )}
          </p>
        </article>
      </section>

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Besoin d’un raccourci", "Need a shortcut")}</p>
          <h2>{t(locale, "Le plus simple est souvent de partir d’une page formation ou centre", "The simplest path is often to start from a training or center page")}</h2>
          <p>
            {t(
              locale,
              "Comme FE agrège plusieurs couches du projet, les pages les plus concrètes pour la presse sont souvent celles des cohortes, centres et ressources éditoriales.",
              "Because FE aggregates multiple layers of the project, the most concrete pages for press use are often the cohort, center, and editorial resource pages.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/trainings")}>
            {t(locale, "Voir les formations", "View trainings")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/centers")}>
            {t(locale, "Voir les centres", "View centers")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
