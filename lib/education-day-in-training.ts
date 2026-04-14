import { EDUCATION_BOOK_A_CALL_URL } from "@/lib/education-links";
import { resolveLocale } from "@/lib/i18n";

export type EducationDayInTrainingVideo = {
  title: string;
  videoId: string;
  posterUrl: string;
  posterPosition?: string;
};

export type EducationDayInTrainingAudioCard = {
  imageUrl: string;
  title: string;
  meta: string;
  audioUrl: string;
  note: string;
};

export type EducationDayInTrainingSection = {
  title: string;
  subtitle?: string;
  paragraphs: string[];
  video?: EducationDayInTrainingVideo;
};

export type EducationDayInTrainingContent = {
  hero: {
    title: string;
    subtitle: string;
    backgroundImageUrl: string;
  };
  actions: {
    signUpLabel: string;
    signUpUrl: string;
    meetingLabel: string;
    meetingUrl: string;
  };
  intro: {
    title: string;
    paragraphs: string[];
    morning: EducationDayInTrainingSection;
  };
  groupLessons: EducationDayInTrainingSection & {
    secondaryParagraph: string;
    audioCard: EducationDayInTrainingAudioCard;
  };
  functionalIntegration: EducationDayInTrainingSection & {
    quote: string;
    videos: [EducationDayInTrainingVideo, EducationDayInTrainingVideo];
  };
  lunch: EducationDayInTrainingSection;
  platform: EducationDayInTrainingSection;
  evening: EducationDayInTrainingSection;
  dayOff: EducationDayInTrainingSection;
  testimonials: {
    title: string;
    video: EducationDayInTrainingVideo;
  };
};

function t(locale: string, fr: string, en: string) {
  return resolveLocale(locale) === "fr" ? fr : en;
}

function buildSignupUrl(locale: string) {
  return `https://learn.feldenkrais-education.com/?page=inscription&id_promo=106&lang=${resolveLocale(locale)}`;
}

function buildYouTubePoster(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function getEducationDayInTrainingContent(locale: string): EducationDayInTrainingContent {
  const signUpUrl = buildSignupUrl(locale);

  return {
    hero: {
      title: t(locale, "La formation Feldenkrais", "The Feldenkrais Training"),
      subtitle: t(locale, "Une journée type", "A Typical Day"),
      backgroundImageUrl: "/brands/feldenkrais-education/day-in-training/headerbanner-cantal.jpg",
    },
    actions: {
      signUpLabel: t(locale, "S’inscrire", "Sign up"),
      signUpUrl,
      meetingLabel: t(locale, "Réserver un appel", "Book a meeting"),
      meetingUrl: EDUCATION_BOOK_A_CALL_URL,
    },
    intro: {
      title: t(locale, "Bien plus qu’une formation", "Much more than a training"),
      paragraphs: [
        t(
          locale,
          "Il y a de nombreuses raisons de vouloir suivre une formation professionnelle à la méthode Feldenkrais, pour des raisons personnelles ou professionnelles. Mais au-delà de ce qui vous amène, c’est l’expérience vécue pendant la formation qui vous donnera envie de rester.",
          "There are many reasons why people may be motivated to do a professional training in the Feldenkrais method, for personal or professional reasons. But beyond the reasons that bring you, it is the experience during the training that will make you stay.",
        ),
        t(
          locale,
          "Voici un aperçu d’une journée typique dans l’une de nos formations, avec son rythme, ses temps d’étude, de pratique, d’échange et d’intégration.",
          "Here is a preview of a typical day in one of our trainings, with its rhythm of study, practice, exchange, and integration.",
        ),
      ],
      morning: {
        title: t(locale, "Pourquoi ne pas commencer…", "Why don’t you start.."),
        subtitle: t(locale, "…avec un bon cappuccino", "..with a nice cappuccino"),
        paragraphs: [
          t(
            locale,
            "Les journées se déroulent généralement de 10h à 17h, avec une pause d’1h30 à midi. Commencez votre journée au coin café, en admirant le lever du soleil sur les montagnes du Cantal ou en profitant de la tranquillité du jardin bruxellois.",
            "The days generally run from 10 AM to 5 PM, with a 1h30 break at noon. Start your day at the coffee corner, where you can enjoy a coffee while admiring the sunrise over the mountains of Cantal or enjoying the tranquility of the peaceful garden in Brussels.",
          ),
        ],
        video: {
          title: t(locale, "Commencer la journée", "Starting the day"),
          videoId: "vD1n0tvjtGw",
          posterUrl: buildYouTubePoster("vD1n0tvjtGw"),
        },
      },
    },
    groupLessons: {
      title: t(locale, "Leçons collectives", "Group lessons"),
      subtitle: "ATM",
      paragraphs: [
        t(
          locale,
          "Dans les leçons d’« Awareness Through Movement », ou ATM, vous êtes guidé verbalement à travers une séquence structurée de mouvements, destinée à suggérer de nouvelles façons de bouger, plus efficaces et plus agréables.",
          "In ‘Awareness Through Movement’ lessons, or ATM, you’re guided verbally through a structured sequence of movements, aimed at suggesting new ways of moving that are more efficient and pleasant.",
        ),
        t(
          locale,
          "Les leçons Feldenkrais utilisent de multiples stratégies : guider l’attention, explorer la coordination, le timing et les relations entre différentes parties du corps, utiliser des mouvements petits et lents, varier les orientations, challenger l’équilibre et mobiliser l’imagination.",
          "Feldenkrais lessons use all sorts of strategies: guiding our attention, exploring coordination, timing and relationships between different body parts, using small and slow movements, varying orientation, challenging balance, and mobilizing imagination.",
        ),
      ],
      secondaryParagraph: t(
        locale,
        "Voici une autre courte leçon enseignée par Pia Appelquist, enseignante à Cantal et Bruxelles. Découvrez en quelques minutes comment augmenter vos possibilités de mouvement en utilisant la neuroplasticité.",
        "Here is another short lesson taught by Pia Appelquist, a teacher in Cantal and Brussels. Discover in a few minutes how to increase movement possibilities by using neuroplasticity.",
      ),
      audioCard: {
        imageUrl: "/brands/feldenkrais-education/day-in-training/alan.jpg",
        title: t(
          locale,
          "Soulever son bassin avec davantage de soi-même, avec Alan Questel",
          "Lifting your pelvis with more of yourself - w/ Alan Questel",
        ),
        meta: t(locale, "Leçon / 28:47", "Lesson / 28:47"),
        audioUrl:
          "https://nikosappel.com/wp-content/uploads/2022/08/Disk-3-Track-3-ATM-4-Lifting-Your-Pelvis-With-More-of-Yourself-.mp3",
        note: t(
          locale,
          "Pour faire cette leçon, prévoyez des vêtements confortables et un endroit agréable où vous allonger au sol, comme un tapis.",
          "To do this lesson you will need comfortable clothing and a comfortable place to lie on the floor, like a mat.",
        ),
      },
      video: {
        title: t(locale, "Leçon de Pia Appelquist", "Pia Appelquist lesson"),
        videoId: "Ea9B3uwfcOI",
        posterUrl: buildYouTubePoster("Ea9B3uwfcOI"),
      },
    },
    functionalIntegration: {
      title: t(locale, "Démonstration", "Demonstration"),
      subtitle: t(locale, "d’intégration fonctionnelle", "of Functional Integration"),
      paragraphs: [
        t(
          locale,
          "Il y a deux façons de pratiquer la méthode Feldenkrais : les leçons collectives et les leçons individuelles. Ces dernières s’appellent l’Intégration Fonctionnelle (FI), et sont à la fois hands-on et personnalisées.",
          "There are two ways to practice the Feldenkrais method: group lessons and individual lessons. The latter is called Functional Integration (FI), which is hands-on and personalized.",
        ),
        t(
          locale,
          "Voici deux démonstrations par Scott Clark et Yvo Mentens, qui montrent une séquence de mouvements que les étudiant·es expérimentent ensuite entre eux.",
          "Here are two demonstrations by Scott Clark and Yvo Mentens that demonstrate a sequence of movements that students later try out with each other.",
        ),
      ],
      quote: t(
        locale,
        "« Avec les mains, vous touchez la personne, vous cherchez ce dont elle a besoin, puis vous lui transmettez une manière de mieux s’organiser. »",
        "“With the hands you touch the person, you’re supposed to find out what he needs, and convey to him a way of organizing himself which is better for him.”",
      ),
      videos: [
        {
          title: t(locale, "Démonstration FI 1", "Functional Integration demo 1"),
          videoId: "Jacm1xKa2kk",
          posterUrl: "/brands/feldenkrais-education/day-in-training/functional-integration-1.jpg",
        },
        {
          title: t(locale, "Démonstration FI 2", "Functional Integration demo 2"),
          videoId: "7LQBvpQdBzY",
          posterUrl: "/brands/feldenkrais-education/day-in-training/functional-integration-2.jpg",
          posterPosition: "center 36%",
        },
      ],
    },
    lunch: {
      title: t(locale, "Pause déjeuner", "Lunch break"),
      subtitle: t(locale, "Un moment à partager", "A moment to share"),
      paragraphs: [
        t(
          locale,
          "Passez un moment à la bibliothèque, dans le jardin, préparez un repas dans la cuisine, ou reprenez simplement un café ensemble. Ces temps de pause font partie de l’apprentissage.",
          "Spend some time in the library, in the garden outside, prepare a meal in the kitchen, and why not another coffee. These shared pauses are part of the learning too.",
        ),
      ],
      video: {
        title: t(locale, "Pause de midi", "Lunch break"),
        videoId: "VPUB0NqN61w",
        posterUrl: buildYouTubePoster("VPUB0NqN61w"),
      },
    },
    platform: {
      title: t(locale, "La plateforme", "The platform"),
      subtitle: t(locale, "Tout est enregistré !", "Everything is recorded!"),
      paragraphs: [
        t(
          locale,
          "Après la journée, qui dure généralement entre 5 et 6 heures, les enregistrements sont déposés sur une plateforme dédiée qui vous permet de revoir le contenu à tout moment ou de rattraper un segment ou une journée manquée.",
          "Following the day, which generally lasts between 5 and 6 hours, the recordings are uploaded to a dedicated platform that allows you to review the content at any time or catch up if you missed a segment or a day.",
        ),
      ],
      video: {
        title: t(locale, "Aperçu de la plateforme", "Platform preview"),
        videoId: "WQolHqbWYAQ",
        posterUrl: "/brands/feldenkrais-education/training/platform-devices.png",
      },
    },
    evening: {
      title: t(locale, "En soirée", "In the evening"),
      subtitle: t(locale, "Un peu de jazz…", "A bit of Jazz..."),
      paragraphs: [
        t(
          locale,
          "La formation dépasse les heures d’enseignement. Elle devient aussi une occasion de créer des liens et d’apprendre les uns des autres. Initiés par les étudiant·es ou l’équipe, des événements spontanés peuvent émerger : repas partagés, documentaires, concerts, open mics, tango…",
          "The training goes beyond the hours of teaching, it is also an opportunity to build connections and learn from each other. Initiated by students or the team, you can attend spontaneous events: potluck dinners, documentary nights, concerts, open mic sessions, tango classes. Time to improvise!",
        ),
      ],
      video: {
        title: t(locale, "Un soir pendant le segment", "An evening during the segment"),
        videoId: "sV57SHzXFHY",
        posterUrl: buildYouTubePoster("sV57SHzXFHY"),
      },
    },
    dayOff: {
      title: t(locale, "Le jour off", "The Day Off"),
      subtitle: t(locale, "En nature ou en ville", "In Nature or in Town"),
      paragraphs: [
        t(
          locale,
          "Le Cantal est une destination singulière avec ses paysages volcaniques, ses vallées verdoyantes et ses villages. Dans cette vidéo, nous avons essayé de vous donner une expérience en temps réel d’une balade dans ses montagnes.",
          "The Cantal is a unique destination with its impressive volcanic landscapes, verdant valleys, and picturesque villages. In this video, we tried to give you a real-time experience of a walk in the mountains of Cantal.",
        ),
        t(
          locale,
          "Bruxelles, capitale de la Belgique et de l’Europe, est une ville vibrante et cosmopolite, idéale pour celles et ceux qui cherchent une expérience de formation riche et diverse, portée par une forte vie culturelle et architecturale.",
          "Brussels, the capital of Belgium and Europe, is a vibrant and cosmopolitan city, ideal for those seeking an enriching and diverse training experience. Known for its rich cultural heritage, impressive architecture, and dynamic art scene, Brussels is a metropolis that inspires.",
        ),
      ],
      video: {
        title: t(locale, "Le jour off", "The day off"),
        videoId: "ljlytxW18y4",
        posterUrl: "/brands/feldenkrais-education/day-in-training/headerbanner-cantal-alt.jpg",
      },
    },
    testimonials: {
      title: t(locale, "Qu’en disent les étudiant·es ?", "What do the students say?"),
      video: {
        title: t(locale, "Témoignages", "Student testimonials"),
        videoId: "03aDEfdFtR8",
        posterUrl: buildYouTubePoster("03aDEfdFtR8"),
      },
    },
  };
}
