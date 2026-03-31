import Link from "next/link";

import { localizePath } from "@/lib/locale-path";
import type { NarrativePage, SiteFooterContact, SocialLink } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationContactPageProps = {
  locale: string;
  page: NarrativePage;
  contact: SiteFooterContact | null;
  socials: SocialLink[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationContactPage({
  locale,
  page,
  contact,
  socials,
}: EducationContactPageProps) {
  const resolvedPage: NarrativePage = {
    ...page,
    title: t(locale, "Contact", "Contact"),
    subtitle: t(
      locale,
      "Une question sur les formations, les centres, les cohortes, ou le bon point d’entrée dans l’écosystème FE ?",
      "A question about trainings, centers, cohorts, or the right entry point into the FE ecosystem?",
    ),
    hero: {
      ...page.hero,
      title: t(locale, "Contact", "Contact"),
      body: t(
        locale,
        "FE sert souvent de point d’orientation. Écrivez-nous si vous hésitez entre plusieurs centres, si vous voulez demander une brochure, ou si vous cherchez la bonne personne à qui parler.",
        "FE often works as an orientation point. Write to us if you are hesitating between centers, if you want to request a brochure, or if you are trying to find the right person to speak with.",
      ),
    },
  };

  const routes = [
    {
      title: t(locale, "Question sur la formation", "Training question"),
      body: t(
        locale,
        "Dates, cohortes, conditions d’entrée, PDF, financement, ou différence entre plusieurs centres.",
        "Dates, cohorts, entry conditions, PDFs, financing, or the difference between multiple centers.",
      ),
      href: "/trainings",
      cta: t(locale, "Voir les formations", "View trainings"),
    },
    {
      title: t(locale, "Trouver le bon point d’entrée", "Find the right entry point"),
      body: t(
        locale,
        "Praticien, centre, cours, séance individuelle, atelier ou parcours long: on vous aide à clarifier.",
        "Practitioner, center, class, private session, workshop, or long-form pathway: we help you clarify.",
      ),
      href: "/find-a-practitioner",
      cta: t(locale, "Être orienté·e", "Get oriented"),
    },
    {
      title: t(locale, "Questions administratives", "Administrative questions"),
      body: t(
        locale,
        "Besoin d’un document, d’un lien, d’une précision sur le financement ou d’un point de contact plus précis.",
        "Need a document, a link, a clarification on financing, or a more precise contact point.",
      ),
      href: "/financing",
      cta: t(locale, "Voir le financement", "See financing"),
    },
  ];

  return (
    <EducationContentPage className="education-contact-page" eyebrow={t(locale, "Échange", "Get in touch")} page={resolvedPage}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Orientation FE", "FE orientation")}</p>
          <h2>{t(locale, "Nous écrire peut faire gagner beaucoup de temps", "Writing to us can save a lot of time")}</h2>
          <p>
            {t(
              locale,
              "Comme FE n’est pas un centre unique mais un site de marque, une même question peut concerner un programme, une cohorte, un lieu, une ressource ou un·e enseignant·e. Cette page sert justement à repartir vers la bonne direction.",
              "Because FE is not a single center but a brand site, the same question can concern a program, a cohort, a place, a resource, or a teacher. This page exists precisely to point you in the right direction.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "Si vous n’êtes pas sûr·e du bon interlocuteur, écrivez quand même ici: on vous réorientera.",
              "If you are not sure who the right contact is, write here anyway: we will redirect you.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Contact direct", "Direct contact")}</p>
          <h2>{t(locale, "Équipe FE", "FE team")}</h2>
          <dl className="education-center-facts">
            {contact?.email ? (
              <div>
                <dt>Email</dt>
                <dd>{contact.email}</dd>
              </div>
            ) : null}
            {contact?.phone ? (
              <div>
                <dt>{t(locale, "Téléphone", "Phone")}</dt>
                <dd>{contact.phone}</dd>
              </div>
            ) : null}
            <div>
              <dt>{t(locale, "Convient pour", "Best for")}</dt>
              <dd>{t(locale, "Formations, centres, orientation, documents", "Trainings, centers, orientation, documents")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            {contact?.email ? (
              <a className="education-button" href={`mailto:${contact.email}`}>
                {t(locale, "Écrire à l’équipe", "Write to the team")}
              </a>
            ) : null}
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/newsletter")}>
              {t(locale, "Recevoir les nouvelles", "Get updates")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Comment pouvons-nous vous aider ?", "How can we help?")}</h2>
          <Link className="text-link" href={localizePath(locale, "/about")}>
            {t(locale, "À propos de FE", "About FE")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {routes.map((route) => (
            <article className="education-card education-home-link-card" key={route.title}>
              <h3>{route.title}</h3>
              <p>{route.body}</p>
              <Link className="education-text-link" href={localizePath(locale, route.href)}>
                {route.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="education-contact-grid">
        <article className="education-contact-card">
          <h2>{t(locale, "Contact direct", "Direct contact")}</h2>
          <div className="education-contact-card__links">
            {contact?.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : null}
            {contact?.phone ? (
              <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a>
            ) : null}
          </div>
          <p>
            {contact?.body ||
              t(
                locale,
                "Écrivez-nous si vous avez besoin d’un lien, d’un document ou d’un repère pour trouver le bon centre ou la bonne cohorte.",
                "Write to us if you need a link, a document, or help finding the right center or cohort.",
              )}
          </p>
        </article>

        <article className="education-contact-card">
          <h2>{t(locale, "Suivre les ouvertures", "Stay informed")}</h2>
          <p>
            {t(
              locale,
              "Les ouvertures d’inscription, nouvelles cohortes, ateliers et ressources passent aussi par l’infolettre FE.",
              "Registration openings, new cohorts, workshops, and resources also flow through the FE newsletter.",
            )}
          </p>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/newsletter")}>
            {t(locale, "Voir la newsletter", "View the newsletter")}
          </Link>
        </article>

        {socials.length > 0 ? (
          <article className="education-contact-card">
            <h2>{t(locale, "Réseaux", "Social channels")}</h2>
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
                "Une autre manière de suivre les annonces, vidéos, ouvertures et publications de FE.",
                "Another way to follow FE announcements, videos, openings, and publications.",
              )}
            </p>
          </article>
        ) : null}
      </section>

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Si vous hésitez", "If you are unsure")}</p>
          <h2>{t(locale, "Commencez par nous écrire, puis nous vous orienterons", "Start by writing to us, then we will point you in the right direction")}</h2>
          <p>
            {t(
              locale,
              "C’est souvent plus simple que de chercher seul·e entre les centres, cohortes, brochures et liens externes. FE peut servir de première boussole.",
              "That is often simpler than navigating alone between centers, cohorts, brochures, and external links. FE can act as the first compass.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          {contact?.email ? (
            <a className="education-button" href={`mailto:${contact.email}`}>
              {t(locale, "Nous écrire", "Write to us")}
            </a>
          ) : (
            <Link className="education-button" href={localizePath(locale, "/newsletter")}>
              {t(locale, "Recevoir les nouvelles", "Get updates")}
            </Link>
          )}
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/find-a-practitioner")}>
            {t(locale, "Trouver un point d’entrée", "Find an entry point")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
