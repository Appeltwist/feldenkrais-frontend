import Image from "next/image";
import Link from "next/link";

import type { EducationDomainEntry } from "@/lib/education-domains";
import type { EducationTeacherProfile } from "@/lib/education-teachers";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import EducationMethodInsightSlider from "./EducationMethodInsightSlider";
import EducationBetaReadOnlyNotice from "./EducationBetaReadOnly";
import EducationScrollSequence from "./EducationScrollSequence";
import EducationVideoPreview from "./EducationVideoPreview";

type EducationMethodPageProps = {
  locale: string;
  page: NarrativePage;
  domains: EducationDomainEntry[];
  featuredTeachers: EducationTeacherProfile[];
};

type MethodInsightSlide = {
  title: string;
  paragraphs: string[];
};

type MethodPageCopy = {
  videoTitle: string;
  videoVideoId: string;
  videoPosterUrl: string;
  videoPosterPosition: string;
  videoLinkLabel: string;
  domainsTitle: string;
  domainsSubtitle: string;
  domainsParagraphs: string[];
  methodSlides: MethodInsightSlide[];
  newsletterTitle: string;
  newsletterPlaceholder: string;
  newsletterButton: string;
  mosheTitle: string;
  mosheHeading: string;
  mosheParagraphs: string[];
  platformTitle: string;
  platformSubtitle: string;
  platformBody: string;
  platformButton: string;
  practitionerTitle: string;
  practitionerSubtitle: string;
  practitionerButton: string;
};

type DomainCardConfig = {
  slug: string;
  iconName: string;
  titleFr: string;
  titleEn: string;
};

const DOMAIN_CARD_CONFIG: DomainCardConfig[] = [
  {
    slug: "reeducation-after-illness-or-injury",
    iconName: "reeducation",
    titleFr: "Rééducation",
    titleEn: "Rehabilitation",
  },
  {
    slug: "chronic-pain-relief",
    iconName: "chronic-pain",
    titleFr: "Douleurs Chroniques",
    titleEn: "Chronic Pain",
  },
  {
    slug: "aging-well-for-the-elderly-and-seniors",
    iconName: "aging-well",
    titleFr: "Mieux Vieillir",
    titleEn: "Aging Well",
  },
  {
    slug: "dance-theatre-musicians-voice-and-visual-arts",
    iconName: "performing-arts",
    titleFr: "Arts de la scène",
    titleEn: "Performing Arts",
  },
  {
    slug: "babies-and-children-with-special-needs",
    iconName: "babies-children",
    titleFr: "Bébés & Enfants",
    titleEn: "Babies & Children",
  },
  {
    slug: "improvement-of-abilities-and-self-actualisation-through-self-knowledge",
    iconName: "personal-development",
    titleFr: "Développement Personnel",
    titleEn: "Personal Development",
  },
  {
    slug: "psychological-or-social-challenges",
    iconName: "psychological-social",
    titleFr: "Défis Psychologiques",
    titleEn: "Psychological Challenges",
  },
  {
    slug: "developing-sports-potential-and-peak-performancesfor-athletes-or-martial-arts",
    iconName: "sports",
    titleFr: "Les Athlètes",
    titleEn: "Athletes",
  },
  {
    slug: "personal-organisation-in-the-work-environment",
    iconName: "work",
    titleFr: "Au Bureau",
    titleEn: "At Work",
  },
  {
    slug: "learning-creativity-and-imagination",
    iconName: "learning-creativity",
    titleFr: "Apprentissage & Créativité",
    titleEn: "Learning & Creativity",
  },
  {
    slug: "neurological-and-musculoskeletal-challenges",
    iconName: "neurological-musculoskeletal",
    titleFr: "Défis Musculosquelettiques",
    titleEn: "Neurological & Musculoskeletal",
  },
  {
    slug: "working-with-animals",
    iconName: "animals",
    titleFr: "Les Animaux",
    titleEn: "Animals",
  },
];

const PRACTITIONER_LAYOUT = [
  { top: "10%", left: "14%", size: "8.75rem" },
  { top: "6%", left: "29%", size: "7rem" },
  { top: "29%", left: "23%", size: "10.75rem" },
  { top: "68%", left: "12%", size: "9.5rem" },
  { top: "66%", left: "34%", size: "7.75rem" },
  { top: "57%", left: "57%", size: "6rem" },
  { top: "6%", left: "69%", size: "6.25rem" },
  { top: "18%", left: "77%", size: "10rem" },
  { top: "30%", left: "67%", size: "9rem" },
  { top: "58%", left: "80%", size: "8.5rem" },
];

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function buildFrames(basePath: string, count: number) {
  return Array.from({ length: count }, (_value, index) => `${basePath}/frame-${String(index + 1).padStart(2, "0")}.png`);
}

function getMethodPageCopy(locale: string): MethodPageCopy {
  if (locale.toLowerCase().startsWith("fr")) {
    return {
      videoTitle: "La Méthode Feldenkrais®",
      videoVideoId: "Fia0H2Am7eM",
      videoPosterUrl:
        "https://feldenkrais-education.com/wp-content/uploads/sites/15/2025/01/cest-quoi-le-feldenkrais-scaled.jpg",
      videoPosterPosition: "center center",
      videoLinkLabel: "Regarder d'autres vidéos",
      domainsTitle: "12 Domaines",
      domainsSubtitle: "d'application pour la méthode",
      domainsParagraphs: [
        "Les praticiens du monde entier utilisent les stratégies de la méthode dans une grande variété de contextes professionnels: avec des bébés et nourrissons ayant des besoins spécifiques, pour améliorer les performances d’acteurs, musiciens, danseurs et athlètes, pour accompagner des personnes souffrant de douleurs chroniques, en prévention ou en rééducation après une maladie ou une blessure, et dans bien d’autres domaines.",
        "La méthode Feldenkrais offre des avantages dans une large gamme de domaines parce que le mouvement est central à toute activité humaine. Au fil des ans, nous avons essayé de catégoriser ses applications dans une liste finie de disciplines: nous les appelons les 12 domaines.",
      ],
      methodSlides: [
        {
          title: "La méthode Feldenkrais",
          paragraphs: [
            "Lorsque l’on lui demanda de décrire sa méthode en une phrase, Feldenkrais a dit: « Know thyself ». Cette méthode consiste à changer des habitudes et à améliorer l’organisation du mouvement, mais elle concerne également la prise de conscience mentale et émotionnelle que ce processus engendre.",
            "Le mouvement, la pensée, la sensation et l’émotion sont étroitement liés, formant les éléments essentiels de qui nous sommes et de tout ce que nous faisons. Améliorez votre façon de bouger et vous changerez votre façon de vous sentir, de penser et de percevoir le monde et vous-même.",
            "Les leçons Feldenkrais utilisent toutes sortes de stratégies: guider notre attention vers différents aspects sensoriels d’un mouvement, explorer la coordination, le timing et les relations entre différentes parties du corps, utiliser des mouvements petits et lents pour améliorer notre sensibilité et notre traitement des informations sensorielles, varier systématiquement l’orientation dans laquelle nous effectuons un mouvement, défier notre équilibre pour créer un meilleur équilibre, imagination active et visualisation, et bien d’autres stratégies encore.",
          ],
        },
        {
          title: "Prise de conscience par le mouvement",
          paragraphs: [
            "Dans les leçons de Prise de conscience par le mouvement, vous êtes guidé verbalement à travers une séquence structurée de mouvements, conçue pour suggérer de nouvelles façons de bouger, plus efficaces et plus agréables.",
            "Ces leçons durent généralement entre vingt et soixante minutes. Elles affinent l’attention, la coordination, la respiration et la relation entre effort et aisance.",
          ],
        },
        {
          title: "Intégration fonctionnelle",
          paragraphs: [
            "Les séances d’Intégration fonctionnelle sont des leçons individuelles par le toucher, adaptées aux besoins spécifiques de chaque personne.",
            "Elles permettent d’aborder finement une douleur, une récupération, une pratique artistique, une difficulté d’organisation ou un désir de changement plus global.",
          ],
        },
      ],
      newsletterTitle: "Abonnez vous à la newsletter",
      newsletterPlaceholder: "Email Address",
      newsletterButton: "S'abonner",
      mosheTitle: "Qui est Moshe Feldenkrais ?",
      mosheHeading: "Biographie",
      mosheParagraphs: [
        "Moshe Feldenkrais, né en 1904 en Ukraine, s'est installé dans les années 1930 en France pour étudier l’ingénierie à la Sorbonne. C'est à Paris qu'il est devenu l’un des premiers Européens à obtenir une ceinture noire de judo et a co-fondé le premier centre de jiu-jitsu dans la capitale.",
        "Sa carrière d’ingénieur et sa passion pour le judo l’ont conduit à explorer la mécanique du corps et le mouvement. Une blessure persistante au genou l’a ensuite poussé à approfondir ses connaissances en anatomie et en neurophysiologie, et à développer une méthode unique visant à améliorer la conscience corporelle et l’efficacité du mouvement.",
        "Cette méthode, désormais reconnue à l’échelle mondiale sous le nom de méthode Feldenkrais, a permis à des personnes de tous âges et de toutes professions de surmonter douleurs et limitations fonctionnelles et à retrouver une meilleure qualité de vie.",
      ],
      platformTitle: "La Plateforme Neuro Somatic",
      platformSubtitle: "Améliorez vos capacités",
      platformBody:
        "Cette plateforme propose une vaste bibliothèque audio et vidéo offrant une diversité de stratégies neurosomatiques pour vous aider à surmonter la douleur chronique et les troubles persistants, dépasser les limitations physiques, libérer votre créativité, améliorer vos performances de haut niveau, acquérir des outils concrets pour votre travail avec les clients, et gérer efficacement le stress.",
      platformButton: "Commencer maintenant",
      practitionerTitle: "Trouver un praticien",
      practitionerSubtitle: "Près de chez vous",
      practitionerButton: "Cliquez ici",
    };
  }

  return {
    videoTitle: "The Feldenkrais Method®",
    videoVideoId: "voC0aWkl3f8",
    videoPosterUrl:
      "https://feldenkrais-education.com/wp-content/uploads/sites/15/2025/01/what-is-feldenkrais-scaled.jpg",
    videoPosterPosition: "center center",
    videoLinkLabel: "Watch more videos",
    domainsTitle: "12 Domains",
    domainsSubtitle: "of application for the method",
    domainsParagraphs: [
      "Practitioners around the world use the strategies of the method in a wide variety of professional contexts: working with babies and infants with special needs, improving the performances of actors, musicians, dancers and athletes, helping people who suffer from chronic pain, and supporting prevention or rehabilitation after illness or injury.",
      "The Feldenkrais Method offers benefits across a large range of domains because movement is central to all human activity. Over the years, we have tried to categorize its applications in a finite list of disciplines. We call them the 12 domains.",
    ],
    methodSlides: [
      {
        title: "The Feldenkrais Method",
        paragraphs: [
          "When asked to describe his method in one sentence, Feldenkrais said: “Know thyself.” This method is about changing habits and improving movement organization, but it is also about the mental and emotional self-awareness this process brings about.",
          "Movement, thought, sensation and emotion are closely linked, forming the essential elements of who we are and of everything we do. Improve the way you move and you will change the way you feel, think, and perceive the world and yourself.",
          "Feldenkrais lessons use many strategies: guiding attention to different sensory aspects of movement, exploring coordination, timing and relationships between body parts, using small and slow movements to improve sensitivity and sensory processing, varying orientation, challenging balance, and activating imagination and visualization.",
        ],
      },
      {
        title: "Awareness Through Movement",
        paragraphs: [
          "In Awareness Through Movement lessons, you are guided verbally through a structured sequence of movements aimed at suggesting new ways of moving that are more efficient and pleasant.",
          "These lessons usually last between twenty and sixty minutes. They refine attention, coordination, breathing, and the relationship between effort and ease.",
        ],
      },
      {
        title: "Functional Integration",
        paragraphs: [
          "Functional Integration sessions are individualized hands-on lessons, tailored to the specific needs of each person.",
          "They offer a precise way to work with pain, recovery, artistic practice, functional organization, or a broader desire for change.",
        ],
      },
    ],
    newsletterTitle: "Subscribe to the newsletter",
    newsletterPlaceholder: "Email Address",
    newsletterButton: "Subscribe",
    mosheTitle: "Who is Moshe Feldenkrais?",
    mosheHeading: "Biography",
    mosheParagraphs: [
      "Moshe Feldenkrais, born in 1904 in Ukraine, moved to France in the 1930s to study engineering at the Sorbonne. It was in Paris that he became one of the first Europeans to earn a black belt in judo and co-founded the first jiu-jitsu club in the capital.",
      "His engineering background and passion for judo led him to explore body mechanics and movement. A persistent knee injury then pushed him to deepen his knowledge of anatomy and neurophysiology, and to develop a unique method aimed at improving bodily awareness and efficiency in movement.",
      "That method, now known worldwide as the Feldenkrais Method, has helped people of all ages and professions overcome pain, functional limitations, and discover a better quality of life.",
    ],
    platformTitle: "The Neuro Somatic Platform",
    platformSubtitle: "Improve Your Abilities",
    platformBody:
      "This platform provides an extensive audio and video library offering diverse neurosomatic strategies to help you overcome chronic pain and persistent conditions, surpass physical barriers, unlock creativity, enhance high-level performance, gain practical tools for client work, and effectively manage stress.",
    platformButton: "Start now",
    practitionerTitle: "Find a practitioner",
    practitionerSubtitle: "Near you",
    practitionerButton: "Click here",
  };
}

export default function EducationMethodPage({
  locale,
  page,
  domains,
  featuredTeachers,
}: EducationMethodPageProps) {
  const copy = getMethodPageCopy(locale);
  const resolvedPage: NarrativePage = {
    ...page,
    title: copy.videoTitle,
    subtitle: "",
    sections: [],
  };
  const domainLookup = new Map(domains.map((domain) => [domain.slug, domain]));
  const domainCards = DOMAIN_CARD_CONFIG.map((config) => ({
    ...config,
    href: localizePath(locale, `/domains/${config.slug}`),
    title: domainLookup.get(config.slug)?.title || t(locale, config.titleFr, config.titleEn),
  }));
  const practitionerProfiles = featuredTeachers.slice(0, PRACTITIONER_LAYOUT.length);
  const babyFrameUrls = buildFrames("/brands/feldenkrais-education/method/sequences/baby", 35);
  const deadbirdFrameUrls = buildFrames("/brands/feldenkrais-education/method/sequences/deadbird", 33);

  return (
    <EducationContentPage className="education-method-page education-method-page--reworked" hideHero page={resolvedPage}>
      <section className="education-method-section education-method-section--video">
        <div className="education-method-section__inner education-method-video">
          <h1>{copy.videoTitle}</h1>
          <EducationVideoPreview
            aspectRatio="16 / 9"
            className="education-method-video__preview"
            playLabel={copy.videoTitle}
            posterPosition={copy.videoPosterPosition}
            posterUrl={copy.videoPosterUrl}
            title={copy.videoTitle}
            videoId={copy.videoVideoId}
          />
          <Link className="education-method-video__more" href={localizePath(locale, "/videos")}>
            {copy.videoLinkLabel}
          </Link>
        </div>
      </section>

      <section className="education-method-section" id="12domains">
        <div className="education-method-section__inner education-method-split education-method-split--domains">
          <div className="education-method-copy">
            <h2>
              <span>{copy.domainsTitle}</span>
              <em>{copy.domainsSubtitle}</em>
            </h2>
            <div className="education-method-rule" />
            {copy.domainsParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="education-method-animation education-method-animation--baby">
            <EducationScrollSequence alt={copy.domainsTitle} frameUrls={babyFrameUrls} height={360} width={640} />
          </div>
        </div>
      </section>

      <section className="education-method-section" id="biography">
        <div className="education-method-section__inner education-method-split education-method-split--method">
          <div className="education-method-animation education-method-animation--deadbird">
            <EducationScrollSequence
              alt={copy.methodSlides[0]?.title || copy.videoTitle}
              frameUrls={deadbirdFrameUrls}
              height={360}
              width={640}
            />
          </div>
          <EducationMethodInsightSlider slides={copy.methodSlides} />
        </div>
      </section>

      <section className="education-method-section education-method-section--domains-grid">
        <div className="education-method-section__inner">
          <div className="education-method-domain-grid">
            {domainCards.map((domain) => (
              <Link className="education-method-domain-card" href={domain.href} key={domain.slug}>
                <Image
                  alt={domain.title}
                  className="education-method-domain-card__icon"
                  height={320}
                  src={`/brands/feldenkrais-education/method/domains/${domain.iconName}.png`}
                  width={320}
                />
                <h3>{domain.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="education-method-section education-method-section--newsletter">
        <div className="education-method-section__inner education-method-newsletter">
          <h2>{copy.newsletterTitle}</h2>
          <EducationBetaReadOnlyNotice
            body={t(
              locale,
              "Cette bêta reste en lecture seule. L'inscription à la newsletter rouvrira avec le lancement public.",
              "This beta stays read-only. Newsletter signup will reopen with the public launch.",
            )}
            className="education-method-newsletter__form"
            locale={locale}
            title={copy.newsletterButton}
          />
        </div>
      </section>

      <section className="education-method-section">
        <div className="education-method-section__inner education-method-split education-method-split--moshe">
          <div className="education-method-moshe__photo">
            <Image
              alt={copy.mosheTitle}
              className="education-method-moshe__image"
              height={209}
              src="/brands/feldenkrais-education/method/moshe-feldenkrais.jpg"
              width={300}
            />
          </div>
          <article className="education-method-copy education-method-copy--moshe">
            <h2>{copy.mosheTitle}</h2>
            <h3>{copy.mosheHeading}</h3>
            {copy.mosheParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        </div>
      </section>

      <section className="education-method-section education-method-section--dark">
        <div className="education-method-section__inner education-method-platform">
          <div className="education-method-platform__visual">
            <Image
              alt={copy.platformTitle}
              height={1020}
              src="/brands/feldenkrais-education/method/platform-phones.png"
              width={678}
            />
          </div>
          <div className="education-method-copy education-method-copy--light">
            <h2>
              <span>{copy.platformTitle}</span>
              <em>{copy.platformSubtitle}</em>
            </h2>
            <div className="education-method-rule education-method-rule--light" />
            <p>{copy.platformBody}</p>
            <div className="education-method-actions">
              <Link className="education-button education-method-button--light" href={localizePath(locale, "/platform")}>
                {copy.platformButton}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="education-method-section education-method-section--finder">
        <div className="education-method-section__inner education-practitioner-cloud">
          {practitionerProfiles.map((teacher, index) => {
            const layout = PRACTITIONER_LAYOUT[index];
            if (!layout) {
              return null;
            }

            return (
              <Link
                aria-label={teacher.displayName}
                className="education-practitioner-cloud__portrait"
                href={localizePath(locale, `/teachers/${teacher.slug}`)}
                key={teacher.slug}
                style={{
                  backgroundImage: `url("${teacher.photoUrl}")`,
                  height: layout.size,
                  left: layout.left,
                  top: layout.top,
                  width: layout.size,
                }}
              />
            );
          })}

          <div className="education-practitioner-cloud__content">
            <h2>
              <span>{copy.practitionerTitle}</span>
              <em>{copy.practitionerSubtitle}</em>
            </h2>
            <Link
              className="education-button education-button--secondary education-method-button--finder"
              href={localizePath(locale, "/find-a-practitioner")}
            >
              {copy.practitionerButton}
            </Link>
          </div>
        </div>
      </section>
    </EducationContentPage>
  );
}
