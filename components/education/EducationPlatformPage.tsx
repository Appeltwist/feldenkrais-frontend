import Image from "next/image";
import type { ReactNode } from "react";

import { getEducationVideosData } from "@/lib/education-videos";

import EducationNeurosomaticHeader, {
  LESSON_LIBRARY_GIFT_URL,
  LESSON_LIBRARY_TRIAL_URL,
} from "./EducationNeurosomaticHeader";
import EducationPlatformSlider from "./EducationPlatformSlider";
import EducationScrollSequence from "./EducationScrollSequence";
import EducationVideoPreview from "./EducationVideoPreview";

type EducationPlatformPageProps = {
  locale: string;
};

type PlatformBenefit = {
  title: string;
  body: string;
  accent?: "blue" | "orange";
};

type PlatformStep = {
  number: number;
  heading: ReactNode;
  align: "left" | "right";
  sequenceKey: "deadbird" | "chair" | "stone" | "skelet" | "drop";
};

type IncludedSlide = {
  title: string;
  description: string;
  imageUrl: string;
  imageMode?: "cover" | "contain";
};

type CuratedSlide = {
  title: string;
  description: string;
  imageUrl: string;
};

type PlatformCopy = {
  headerTitle: string;
  loginLabel: string;
  heroTitle: string;
  heroPriceLine: string;
  heroCancelLine: string;
  heroFeatures: string[];
  heroTrialLine: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  benefitsTitle: string;
  benefits: PlatformBenefit[];
  movingTitle: string;
  movingBody: string[];
  stepByStepTitle: string;
  stepByStepBody: string;
  steps: PlatformStep[];
  trialTitle: string;
  trialFeatures: string[];
  trialPrimaryCta: string;
  trialSecondaryCta: string;
  includedTitle: string;
  includedSlides: IncludedSlide[];
  lessonAccessTitle: string;
  lessonAccessSubtitle: string;
  lessonAccessBody: string;
  lessonAccessTrial: string;
  lessonAccessAnnual: string;
  lessonAccessPrimaryCta: string;
  lessonAccessSecondaryCta: string;
  lessonAccessFootnote: string;
  curatedTitle: string;
  curatedSlides: CuratedSlide[];
};

const DEVICE_IMAGE_URL = "/brands/feldenkrais-education/training/platform-devices.png";
const PLATFORM_DOMAIN_IMAGE_URLS = [
  "/brands/feldenkrais-education/platform/domains-v2/reeducation-small-1.png",
  "/brands/feldenkrais-education/platform/domains-v2/chronic-small-1.png",
  "/brands/feldenkrais-education/platform/domains-v2/aging-small-1.png",
  "/brands/feldenkrais-education/platform/domains-v2/arts-medium-1.png",
  "/brands/feldenkrais-education/platform/domains-v2/infants-small-1.png",
  "/brands/feldenkrais-education/platform/domains-v2/self2-medium-1.png",
  "/brands/feldenkrais-education/platform/domains-v2/animal-small-1.png",
  "/brands/feldenkrais-education/platform/domains-v2/sports-small-1.png",
  "/brands/feldenkrais-education/platform/domains-v2/work-small-1.png",
  "/brands/feldenkrais-education/platform/domains-v2/creativity-small-1.png",
  "/brands/feldenkrais-education/platform/domains-v2/skeletal-small-1.png",
  "/brands/feldenkrais-education/platform/domains-v2/social-small-1.png",
] as const;
const SEQUENCE_COUNTS = {
  step: 36,
  deadbird: 33,
  drop: 29,
  chair: 33,
  stone: 31,
  skelet: 32,
} as const;

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function buildFrames(sequenceKey: keyof typeof SEQUENCE_COUNTS) {
  const count = SEQUENCE_COUNTS[sequenceKey];
  const basePath = `/brands/feldenkrais-education/platform/sequences/${sequenceKey}`;
  return Array.from(
    { length: count },
    (_value, index) => `${basePath}/frame-${String(index + 1).padStart(2, "0")}.png`,
  );
}

function getPlatformCopy(locale: string): PlatformCopy {
  const isFr = locale.toLowerCase().startsWith("fr");
  const domainSlides: CuratedSlide[] = [
    {
      title: t(locale, "Domaine 1 : Rééducation", "Domain 1: Rehabilitation"),
      description: t(
        locale,
        "Retrouver fluidité, confiance et options après une blessure ou une opération.",
        "Recover fluidity, confidence, and options after injury or surgery.",
      ),
      imageUrl: PLATFORM_DOMAIN_IMAGE_URLS[0],
    },
    {
      title: t(locale, "Domaine 2 : Douleurs chroniques", "Domain 2: Chronic Pain"),
      description: t(
        locale,
        "Des leçons guidées pour calmer l’effort parasite et retrouver du confort.",
        "Guided lessons to calm unnecessary effort and restore ease.",
      ),
      imageUrl: PLATFORM_DOMAIN_IMAGE_URLS[1],
    },
    {
      title: t(locale, "Domaine 3 : Mieux vieillir", "Domain 3: Aging Well"),
      description: t(
        locale,
        "Stabilité, mobilité et vitalité pour soutenir l’autonomie au quotidien.",
        "Stability, mobility, and vitality to support autonomy in daily life.",
      ),
      imageUrl: PLATFORM_DOMAIN_IMAGE_URLS[2],
    },
    {
      title: t(locale, "Domaine 4 : Arts de la scène", "Domain 4: Performing Arts"),
      description: t(
        locale,
        "Approfondir présence, coordination et finesse d’action pour la scène.",
        "Deepen presence, coordination, and refinement for performance.",
      ),
      imageUrl: PLATFORM_DOMAIN_IMAGE_URLS[3],
    },
    {
      title: t(locale, "Domaine 5 : Bébés & Enfants", "Domain 5: Babies & Children"),
      description: t(
        locale,
        "Observer le développement moteur avec plus de nuance et de délicatesse.",
        "Approach motor development with more nuance and delicacy.",
      ),
      imageUrl: PLATFORM_DOMAIN_IMAGE_URLS[4],
    },
    {
      title: t(locale, "Domaine 6 : Développement personnel", "Domain 6: Personal Development"),
      description: t(
        locale,
        "Utiliser le mouvement pour clarifier les habitudes et ouvrir de nouvelles options.",
        "Use movement to clarify habits and open new possibilities.",
      ),
      imageUrl: PLATFORM_DOMAIN_IMAGE_URLS[5],
    },
    {
      title: t(locale, "Domaine 7 : Les Animaux", "Domain 7: Animals"),
      description: t(
        locale,
        "L’évolution de la locomotion en 5 leçons.",
        "The evolution of locomotion in 5 lessons.",
      ),
      imageUrl: PLATFORM_DOMAIN_IMAGE_URLS[6],
    },
    {
      title: t(locale, "Domaine 8 : Les Athlètes", "Domain 8: Athletes"),
      description: t(
        locale,
        "Affiner puissance, timing et récupération par des stratégies neuromécaniques.",
        "Refine power, timing, and recovery with neuromechanical strategies.",
      ),
      imageUrl: PLATFORM_DOMAIN_IMAGE_URLS[7],
    },
    {
      title: t(locale, "Domaine 9 : Au bureau", "Domain 9: At Work"),
      description: t(
        locale,
        "Réorganiser posture, attention et respiration dans l’environnement de travail.",
        "Reorganize posture, attention, and breath in the work environment.",
      ),
      imageUrl: PLATFORM_DOMAIN_IMAGE_URLS[8],
    },
    {
      title: t(locale, "Domaine 10 : Apprentissage & Créativité", "Domain 10: Learning & Creativity"),
      description: t(
        locale,
        "Développer curiosité, adaptabilité et imagination par le mouvement.",
        "Develop curiosity, adaptability, and imagination through movement.",
      ),
      imageUrl: PLATFORM_DOMAIN_IMAGE_URLS[9],
    },
    {
      title: t(locale, "Domaine 11 : Défis musculosquelettiques", "Domain 11: Musculoskeletal Challenges"),
      description: t(
        locale,
        "Des parcours ciblés pour articulations, dos, nuque et récupération durable.",
        "Targeted pathways for joints, back, neck, and sustainable recovery.",
      ),
      imageUrl: PLATFORM_DOMAIN_IMAGE_URLS[10],
    },
    {
      title: t(locale, "Domaine 12 : Défis psychologiques", "Domain 12: Psychological Challenges"),
      description: t(
        locale,
        "Explorer des stratégies pour réguler stress, charge mentale et disponibilité.",
        "Explore strategies to regulate stress, mental load, and availability.",
      ),
      imageUrl: PLATFORM_DOMAIN_IMAGE_URLS[11],
    },
  ];

  return {
    headerTitle: t(locale, "LA PLATEFORME NEUROSOMATIQUE", "THE NEUROSOMATIC PLATFORM"),
    loginLabel: t(locale, "Connexion", "Login"),
    heroTitle: t(locale, "Commencez votre voyage aujourd’hui", "Start your journey today"),
    heroPriceLine: t(locale, "Abonnement annuel 240€ / an", "Annual 240€ / year"),
    heroCancelLine: t(locale, "Résiliez à tout moment", "Cancel Anytime"),
    heroFeatures: [
      t(locale, "Une bibliothèque grandissante de leçons guidées", "A growing library of guided lessons"),
      t(locale, "Des séries organisées autour de thèmes spécialisés", "Curated series around specialized themes"),
      t(locale, "Une leçon live chaque semaine", "Join live lessons once a week"),
      t(locale, "Des achats in-app pour aller plus loin", "In-app purchases for further specialised training"),
      t(locale, "Créez vos propres playlists", "Make your own playlists"),
      t(locale, "Des audios courts pour comprendre les principes", "Short audios explaining principles of the method"),
      t(locale, "12 conférences complètes avec des points de vue uniques", "12 full conferences with unique insights"),
      t(locale, "Déjà 26 documentaires en profondeur", "Already 26 deep dive documentaries"),
    ],
    heroTrialLine: t(locale, "7 jours illimités", "7 Days Unlimited"),
    heroPrimaryCta: t(locale, "Essayer gratuitement", "Try it for free"),
    heroSecondaryCta: t(locale, "L’offrir à quelqu’un", "Gift it to someone"),
    benefitsTitle: t(locale, "Bénéfices", "Benefits"),
    benefits: [
      {
        title: t(locale, "Soulager la douleur", "Relieve Pain"),
        body: t(
          locale,
          "Par des mouvements doux et une attention plus fine, la méthode aide à calmer le système nerveux et à retrouver du confort.",
          "Through gentle movements and fluid attention, the method is a great tool to calm the nervous system and (re)find comfort and ease.",
        ),
      },
      {
        title: t(locale, "Conscience accrue", "Increased Awareness"),
        body: t(
          locale,
          "Améliorer la façon dont vous bougez transforme aussi la façon dont vous sentez, pensez et percevez.",
          "Improving the way you move will also change the way you feel, think, and the way you sense or perceive the world and yourself.",
        ),
        accent: "blue",
      },
      {
        title: t(locale, "Rééducation", "Re-education"),
        body: t(
          locale,
          "Les leçons Feldenkrais offrent des pistes concrètes pour retrouver une capacité d’apprentissage après un accident, une chirurgie ou un AVC.",
          "Feldenkrais lessons offer concrete ways through movement to stimulate your ability to learn or relearn following an accident, surgery or stroke.",
        ),
      },
      {
        title: t(locale, "Vitalité & spontanéité", "Vitality & Spontaneity"),
        body: t(
          locale,
          "En identifiant les efforts parasites, la méthode redonne disponibilité et énergie dans la vie quotidienne.",
          "By improving the efficiency of movements and identifying parasitic efforts, the Feldenkrais Method can help increase vitality and availability in daily life.",
        ),
        accent: "orange",
      },
      {
        title: t(locale, "Sommeil & concentration", "Sleep and Focus"),
        body: t(
          locale,
          "Développez votre sens kinesthésique et découvrez comment mieux faire coopérer les différentes parties de vous-même.",
          "Develop your kinesthetic sense and discover how to make the different parts of yourself cooperate better.",
        ),
      },
      {
        title: t(locale, "Posture, mobilité & stabilité", "Posture, mobility & stability"),
        body: t(
          locale,
          "La qualité d’attention cultivée dans les leçons améliore les facultés mentales et peut soutenir un meilleur sommeil et une plus grande clarté.",
          "The quality of awareness and attention fostered in Feldenkrais lessons helps improve your mental faculties and can promote better sleep, greater clarity of mind and emotional flexibility.",
        ),
        accent: "orange",
      },
    ],
    movingTitle: t(locale, "Dépasser les schémas habituels", "Moving Beyond Habitual Patterns"),
    movingBody: [
      t(
        locale,
        "Au fil de la vie, nous développons des habitudes qui nous limitent physiquement, cognitivement ou émotionnellement. Cette plateforme propose une vaste bibliothèque audio et vidéo de stratégies neurosomatiques pour dépasser des douleurs persistantes, des limitations physiques et des blocages créatifs.",
        "Through out our lives we develop habitual patterns that restrict us physically, cognitively, or emotionally. This platform provides an extensive audio and video library offering diverse neurosomatic strategies to help you overcome chronic pain and persistent conditions, surpass physical barriers, unlock creativity, and enhance high-level performance.",
      ),
      t(
        locale,
        "En intégrant ces stratégies dans votre vie personnelle ou professionnelle, vous pouvez découvrir de nouvelles possibilités concrètes et vivre avec plus de liberté.",
        "By integrating these strategies into your personal or professional life, you can move beyond outdated self-limiting patterns, discover new possibilities, and learn to live more fully.",
      ),
    ],
    steps: [
      {
        number: 1,
        align: "right",
        sequenceKey: "deadbird",
        heading: isFr ? (
          <>
            <strong>Faire moins</strong>,
            <br />
            ressentir <strong>plus</strong>
          </>
        ) : (
          <>
            <strong>Do Less</strong>,
            <br />
            Feel <strong>more</strong>
          </>
        ),
      },
      {
        number: 2,
        align: "left",
        sequenceKey: "chair",
        heading: isFr ? (
          <>
            Devenez conscient
            <br />
            de <strong>vos habitudes</strong>
          </>
        ) : (
          <>
            Become aware
            <br />
            of <strong>your habits</strong>
          </>
        ),
      },
      {
        number: 3,
        align: "right",
        sequenceKey: "stone",
        heading: isFr ? (
          <>
            Utilisez la <strong>neuromécanique</strong>
            <br />
            pour améliorer l’<strong>efficacité</strong> du mouvement
          </>
        ) : (
          <>
            Use <strong>neuromechanics</strong>
            <br />
            to improve <strong>movement efficiency</strong>
          </>
        ),
      },
      {
        number: 4,
        align: "left",
        sequenceKey: "skelet",
        heading: isFr ? (
          <>
            Explorez de nouveaux schémas qui s’appuient moins
            <br />
            sur la <strong>musculature</strong> et davantage
            <br />
            sur le <strong>squelette</strong>
          </>
        ) : (
          <>
            Explore <strong>new patterns</strong> that
            <br />
            rely less on your <strong>musculature</strong>
            <br />
            &amp; more on your <strong>skeleton</strong>
          </>
        ),
      },
      {
        number: 5,
        align: "right",
        sequenceKey: "drop",
        heading: isFr ? (
          <>
            <strong>Améliorez</strong> vos capacités
            <br />
            &amp; votre <strong>vie quotidienne</strong>
          </>
        ) : (
          <>
            <strong>Improve</strong> your abilities
            <br />
            &amp; daily <strong>life</strong>
          </>
        ),
      },
    ],
    stepByStepTitle: t(locale, "Pas à pas", "Step by step"),
    stepByStepBody: t(
      locale,
      "Votre rythme d’apprentissage vous appartient, mais nous vous accompagnons tout au long du parcours. À travers les leçons guidées et les conférences, vous comprendrez comment appliquer les stratégies neurosomatiques dans votre vie.",
      "Your learning pace is your own, but we will help along the way. Through the guided lessons and conferences, you will understand how to apply neurosomatic strategies of the method and how to apply them in your life.",
    ),
    trialTitle: t(locale, "7 jours illimités", "7 Days Unlimited"),
    trialFeatures: [
      t(locale, "Une bibliothèque grandissante de leçons guidées", "A growing library of guided lessons"),
      t(locale, "Des séries organisées autour de thèmes spécialisés", "Curated series around specialized themes"),
      t(locale, "Une leçon live chaque semaine", "Join live lessons once a week"),
      t(locale, "Accès à toutes les conférences et documentaires", "Access to all conferences and documentaries"),
    ],
    trialPrimaryCta: t(locale, "Essayer gratuitement", "Try it for free"),
    trialSecondaryCta: t(locale, "L’offrir à quelqu’un", "Gift it to someone"),
    includedTitle: t(locale, "Qu’est-ce qui est inclus ?", "What's included ?"),
    includedSlides: [
      {
        title: t(locale, "26 documentaires avec des experts", "26 Documentaries with Experts"),
        description: t(
          locale,
          "Des regards concrets sur les stratégies neurosomatiques dans des contextes aussi variés que la danse, le chant, la natation, la psychothérapie, l’éducation ou la performance sportive.",
          "These documentaries offer a vivid look at how Feldenkrais-inspired neurosomatic strategies are applied in diverse real-world contexts: dance, opera singing, psychotherapy, theatre education, choir leading, Olympic swimming, horse training, and more.",
        ),
        imageUrl: "/brands/feldenkrais-education/platform/docus.png",
      },
      {
        title: t(locale, "12 conférences complètes", "12 Full Conferences"),
        description: t(
          locale,
          "Un accès complet aux conférences produites par Feldenkrais Education, à regarder à votre rythme et à revisiter quand vous le souhaitez.",
          "A complete archive of full conferences produced by Feldenkrais Education, ready to watch at your own pace and revisit whenever you need.",
        ),
        imageUrl: "/brands/feldenkrais-education/platform/group-23930.png",
      },
      {
        title: t(locale, "Leçons audio Feldenkrais", "Feldenkrais audio lessons"),
        description: t(
          locale,
          "Des leçons audio guidées pour approfondir le mouvement à votre rythme et revenir aux essentiels quand vous en avez besoin.",
          "Guided audio lessons to deepen movement at your own pace and return to core principles whenever you need.",
        ),
        imageUrl: "/brands/feldenkrais-education/platform/what-is-feldenkrais-scaled.jpg",
      },
      {
        title: t(locale, "Commencer avec les 12 domaines", "Get started with 12 Domains"),
        description: t(
          locale,
          "Des parcours organisés par domaine d’application pour aller plus vite vers ce qui vous concerne vraiment.",
          "Organized pathways by field of application so you can move faster toward what is actually relevant to you.",
        ),
        imageUrl: "/brands/feldenkrais-education/platform/albums-1.png",
      },
      {
        title: t(locale, "Leçons live chaque semaine", "Live lessons every week"),
        description: t(
          locale,
          "Une pratique régulière avec un rendez-vous hebdomadaire pour rester engagé, poser des questions et continuer à affiner votre attention.",
          "A regular weekly rendezvous to stay engaged, ask questions, and keep refining your attention with live guidance.",
        ),
        imageUrl: "/brands/feldenkrais-education/platform/live-lessons.png",
        imageMode: "contain",
      },
      {
        title: t(locale, "Plus de 40 enseignants", "Over 40 Teachers"),
        description: t(
          locale,
          "Un large éventail de voix, d’approches et de spécialisations pour vous accompagner dans différents contextes de pratique.",
          "A wide range of voices, approaches, and specializations to support you across different learning contexts.",
        ),
        imageUrl: "/brands/feldenkrais-education/platform/group-23933.png",
      },
    ],
    lessonAccessTitle: t(locale, "Accès à la bibliothèque de leçons", "Lesson Library Access"),
    lessonAccessSubtitle: t(locale, "Abonnement annuel", "Yearly Membership"),
    lessonAccessBody: t(
      locale,
      "Commencez aujourd’hui avec un accès illimité à des centaines de leçons audio et vidéo, ainsi qu’à une leçon live chaque semaine.",
      "Start today with unlimited access to hundreds of audio lessons and video content, and live lessons every week.",
    ),
    lessonAccessTrial: t(locale, "7 jours gratuits", "7 days for free"),
    lessonAccessAnnual: t(locale, "Abonnement annuel 240€ / an", "Annual 240€ / year"),
    lessonAccessPrimaryCta: t(locale, "Essayer gratuitement", "Try it for free"),
    lessonAccessSecondaryCta: t(locale, "L’offrir à quelqu’un", "Gift it to someone"),
    lessonAccessFootnote: t(
      locale,
      "À la fin de l’essai, l’abonnement annuel de 240€ sera reconduit automatiquement. Résiliable à tout moment.",
      "After your free trial ends, you will be charged 240€ and your subscription will automatically renew each year. Cancel anytime.",
    ),
    curatedTitle: t(locale, "Leçons thématiques", "Curated lessons"),
    curatedSlides: domainSlides,
  };
}

function GiftIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 8.75h16v10.5a1.25 1.25 0 0 1-1.25 1.25H5.25A1.25 1.25 0 0 1 4 19.25V8.75Zm0 0h16V6.5a1.25 1.25 0 0 0-1.25-1.25H5.25A1.25 1.25 0 0 0 4 6.5v2.25Zm8-3.5V20.5M8.4 5.25c-1.18 0-2.15-.87-2.15-1.95 0-1.16 1.06-1.95 2.26-1.68 1.08.25 2.03 1.53 2.74 3.63H8.4Zm7.2 0c1.18 0 2.15-.87 2.15-1.95 0-1.16-1.06-1.95-2.26-1.68-1.08.25-2.03 1.53-2.74 3.63h2.85Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export default function EducationPlatformPage({
  locale,
}: EducationPlatformPageProps) {
  const copy = getPlatformCopy(locale);
  const featuredVideoId = getEducationVideosData(locale)?.featuredVideo?.videoId || "voC0aWkl3f8";

  return (
    <div className="neuro-platform-page">
      <EducationNeurosomaticHeader
        locale={locale}
        loginLabel={copy.loginLabel}
        routePath="/lesson-library-access"
        title={copy.headerTitle}
      />

      <section className="neuro-platform-section neuro-platform-membership">
        <div className="neuro-platform-shell">
          <article className="neuro-platform-membership__card">
            <header className="neuro-platform-membership__header">
              <h2>{copy.lessonAccessTitle}</h2>
              <p>{copy.lessonAccessSubtitle}</p>
              <span>{copy.lessonAccessBody}</span>
            </header>

            <div className="neuro-platform-membership__content">
              <div className="neuro-platform-membership__devices">
                <Image
                  alt={copy.lessonAccessTitle}
                  className="neuro-platform-membership__devices-image"
                  height={639}
                  src={DEVICE_IMAGE_URL}
                  width={820}
                />
              </div>

              <div className="neuro-platform-membership__pricing">
                <div className="neuro-platform-membership__pricing-card">
                  <p>{copy.lessonAccessTrial}</p>
                  <strong>{copy.lessonAccessAnnual}</strong>
                  <a className="neuro-platform-button neuro-platform-button--primary" href={LESSON_LIBRARY_TRIAL_URL} rel="noreferrer" target="_blank">
                    {copy.lessonAccessPrimaryCta}
                  </a>
                </div>

                <a className="neuro-platform-button neuro-platform-button--ghost" href={LESSON_LIBRARY_GIFT_URL} rel="noreferrer" target="_blank">
                  <GiftIcon />
                  <span>{copy.lessonAccessSecondaryCta}</span>
                </a>

                <p className="neuro-platform-membership__footnote">{copy.lessonAccessFootnote}</p>
              </div>
            </div>

            <div className="neuro-platform-membership__arrow" aria-hidden="true">
              ↓
            </div>
          </article>
        </div>
      </section>

      <section className="neuro-platform-section neuro-platform-included">
        <div className="neuro-platform-shell">
          <div className="neuro-platform-section-heading neuro-platform-section-heading--center neuro-platform-section-heading--icon">
            <span className="neuro-platform-section-heading__icon" aria-hidden="true">
              <svg fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 5h10v10H9zM5 9H3v10h10v-2M9 5V3H1v10h2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
            </span>
            <h2>{copy.includedTitle}</h2>
          </div>

          <EducationPlatformSlider
            ariaLabel={copy.includedTitle}
            className="neuro-platform-slider--included"
          >
            {copy.includedSlides.map((slide) => (
              <article className="neuro-platform-included-slide" key={slide.title}>
                <div className={`neuro-platform-included-slide__art${slide.imageMode === "contain" ? " is-contained" : ""}`}>
                  <Image alt={slide.title} height={900} src={slide.imageUrl} width={900} />
                </div>

                <div className="neuro-platform-included-slide__copy">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </article>
            ))}
          </EducationPlatformSlider>
        </div>
      </section>

      <section className="neuro-platform-section neuro-platform-trial">
        <div className="neuro-platform-shell neuro-platform-trial__inner">
          <h2>{copy.trialTitle}</h2>
          <ul className="neuro-platform-trial__features">
            {copy.trialFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <a className="neuro-platform-button neuro-platform-button--light" href={LESSON_LIBRARY_TRIAL_URL} rel="noreferrer" target="_blank">
            {copy.trialPrimaryCta}
          </a>
          <a className="neuro-platform-button neuro-platform-button--ghost" href={LESSON_LIBRARY_GIFT_URL} rel="noreferrer" target="_blank">
            <GiftIcon />
            <span>{copy.trialSecondaryCta}</span>
          </a>
        </div>
      </section>

      <section className="neuro-platform-section neuro-platform-story">
        <div className="neuro-platform-shell neuro-platform-story__grid">
          <div className="neuro-platform-story__media">
            <EducationVideoPreview
              aspectRatio="16 / 10"
              className="neuro-platform-story__video"
              playLabel={copy.movingTitle}
              posterPosition="center center"
              posterUrl={DEVICE_IMAGE_URL}
              title={copy.movingTitle}
              videoId={featuredVideoId}
            />
          </div>

          <article className="neuro-platform-story__copy">
            <div className="neuro-platform-section-heading">
              <h2>{copy.movingTitle}</h2>
            </div>
            {copy.movingBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        </div>
      </section>

      <section className="neuro-platform-section neuro-platform-process">
        <div className="neuro-platform-shell neuro-platform-process__grid">
          <div className="neuro-platform-process__media">
            <EducationScrollSequence
              alt={copy.stepByStepTitle}
              className="neuro-platform-process__sequence"
              frameUrls={buildFrames("step")}
              height={360}
              width={640}
            />
          </div>

          <article className="neuro-platform-process__copy">
            <div className="neuro-platform-section-heading">
              <h2>{copy.stepByStepTitle}</h2>
            </div>
            <p>{copy.stepByStepBody}</p>
          </article>
        </div>
      </section>

      {copy.steps.map((step) => (
        <section
          className={`neuro-platform-section neuro-platform-step neuro-platform-step--${step.align}`}
          key={step.number}
        >
          <div className="neuro-platform-shell neuro-platform-step__grid">
            {step.align === "left" ? (
              <>
                <div className="neuro-platform-step__media">
                  <EducationScrollSequence
                    alt={`Platform step ${step.number}`}
                    className={`neuro-platform-step__sequence neuro-platform-step__sequence--${step.sequenceKey}`}
                    frameUrls={buildFrames(step.sequenceKey)}
                    height={360}
                    width={640}
                  />
                </div>
                <div className="neuro-platform-step__copy">
                  <span className="neuro-platform-step__badge">{step.number}</span>
                  <h3>{step.heading}</h3>
                </div>
              </>
            ) : (
              <>
                <div className="neuro-platform-step__copy">
                  <span className="neuro-platform-step__badge">{step.number}</span>
                  <h3>{step.heading}</h3>
                </div>
                <div className="neuro-platform-step__media">
                  <EducationScrollSequence
                    alt={`Platform step ${step.number}`}
                    className={`neuro-platform-step__sequence neuro-platform-step__sequence--${step.sequenceKey}`}
                    frameUrls={buildFrames(step.sequenceKey)}
                    height={360}
                    width={640}
                  />
                </div>
              </>
            )}
          </div>
        </section>
      ))}

      <section className="neuro-platform-section neuro-platform-curated">
        <div className="neuro-platform-shell">
          <div className="neuro-platform-section-heading neuro-platform-section-heading--center">
            <h2>{copy.curatedTitle}</h2>
          </div>

          <EducationPlatformSlider
            ariaLabel={copy.curatedTitle}
            className="neuro-platform-slider--curated"
          >
            {copy.curatedSlides.map((slide) => (
              <article className="neuro-platform-curated-slide" key={slide.title}>
                <div className="neuro-platform-curated-slide__art">
                  <Image alt={slide.title} height={720} src={slide.imageUrl} width={720} />
                </div>
                <div className="neuro-platform-curated-slide__copy">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </article>
            ))}
          </EducationPlatformSlider>
        </div>
      </section>

      <section className="neuro-platform-section neuro-platform-benefits">
        <div className="neuro-platform-shell">
          <div className="neuro-platform-section-heading neuro-platform-section-heading--center">
            <h2>{copy.benefitsTitle}</h2>
          </div>

          <div className="neuro-platform-benefits__grid">
            {copy.benefits.map((benefit) => (
              <article
                className={`neuro-platform-benefit${benefit.accent ? ` neuro-platform-benefit--${benefit.accent}` : ""}`}
                key={benefit.title}
              >
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="neuro-platform-section neuro-platform-hero">
        <div className="neuro-platform-shell neuro-platform-hero__grid">
          <div className="neuro-platform-hero__media">
            <h1>{copy.heroTitle}</h1>
            <div className="neuro-platform-devices-card neuro-platform-devices-card--hero">
              <Image
                alt={copy.heroTitle}
                className="neuro-platform-devices-card__image"
                height={639}
                priority
                src={DEVICE_IMAGE_URL}
                width={820}
              />
            </div>
          </div>

          <aside className="neuro-platform-pricing-card">
            <h2>{copy.heroPriceLine}</h2>
            <p className="neuro-platform-pricing-card__subhead">{copy.heroCancelLine}</p>

            <ul className="neuro-platform-pricing-card__features">
              {copy.heroFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <div className="neuro-platform-pricing-card__trial">
              <strong>{copy.heroTrialLine}</strong>
            </div>

            <a className="neuro-platform-button neuro-platform-button--primary" href={LESSON_LIBRARY_TRIAL_URL} rel="noreferrer" target="_blank">
              {copy.heroPrimaryCta}
            </a>
            <a className="neuro-platform-button neuro-platform-button--ghost" href={LESSON_LIBRARY_GIFT_URL} rel="noreferrer" target="_blank">
              <GiftIcon />
              <span>{copy.heroSecondaryCta}</span>
            </a>
          </aside>
        </div>
      </section>
    </div>
  );
}
