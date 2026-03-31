import type { EducationCenterProfile } from "@/lib/education-content";
import type { EducationTrainingCohort } from "@/lib/education-training";
import { resolveLocale } from "@/lib/i18n";
import { localizePath } from "@/lib/locale-path";

export type EducationCenterPageMedia = {
  imageUrl: string;
  alt: string;
};

export type EducationCenterPageContent = {
  labels: {
    center: string;
    cohort: string;
  };
  hero: {
    title: string;
    subtitle: string;
    backgroundImageUrl: string;
    enrollLabel: string;
    appointmentLabel: string;
    appointmentHref: string;
  };
  intro: {
    title: string;
    subtitle: string;
    paragraphs: string[];
    video: {
      title: string;
      videoId: string;
      posterUrl: string;
      posterPosition?: string;
    };
  };
  centerLife: {
    title: string;
    imageUrl: string;
    imageAlt: string;
    classLink: { label: string; href: string };
    privateLink: { label: string; href: string };
  };
  upcoming: {
    title: string;
    subtitle: string;
    paragraphs: string[];
    note?: string;
    gallery: EducationCenterPageMedia[];
    enrollLabel: string;
    pdfLabel: string;
  };
  cohortDetails: {
    title: string;
    programPreviewUrl: string;
    pdfLabel: string;
    enrollLabel: string;
  };
  contact: {
    title: string;
    subtitle: string;
    intro: string;
    appointmentPrefix: string;
    appointmentLabel: string;
    appointmentHref: string;
    submitLabel: string;
  };
  accessibility?: {
    title: string;
    paragraphs: string[];
    links: Array<{ label: string; href: string }>;
  };
};

function t(locale: string, fr: string, en: string) {
  return resolveLocale(locale) === "fr" ? fr : en;
}

function buildYouTubePoster(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function buildAppointmentHref(locale: string, centerName: string) {
  const subject = t(
    locale,
    `Prise de rendez-vous - ${centerName}`,
    `Book an appointment - ${centerName}`,
  );

  return `mailto:info@feldenkrais-education.com?subject=${encodeURIComponent(subject)}`;
}

function heroTitle(locale: string, slug: string) {
  switch (slug) {
    case "cantal":
      return t(locale, "Cantal, France", "Cantal, France");
    case "brussels":
      return t(locale, "Bruxelles, Belgique", "Brussels, Belgium");
    case "paris":
      return t(locale, "Paris, France", "Paris, France");
    default:
      return "";
  }
}

export function getEducationCenterPageContent(
  locale: string,
  center: EducationCenterProfile,
  cohort: EducationTrainingCohort | null,
): EducationCenterPageContent {
  const appointmentHref = buildAppointmentHref(locale, center.name);
  const cohortName = cohort?.name ?? center.upcomingTraining.name;

  const shared = {
    labels: {
      center: t(locale, "Le centre", "The center"),
      cohort: t(locale, "Cohorte actuelle", "Current cohort"),
    },
    hero: {
      title: heroTitle(locale, center.slug),
      subtitle:
        center.slug === "cantal"
          ? t(
              locale,
              "Un centre Feldenkrais au pays des volcans",
              "A Feldenkrais centre in the land of volcanoes",
            )
          : center.slug === "brussels"
            ? t(
                locale,
                "Un centre Feldenkrais au coeur de Bruxelles",
                "A Feldenkrais centre in the heart of Brussels",
              )
            : t(
                locale,
                "Un centre Feldenkrais porté par une lignée vivante",
                "A Feldenkrais centre carried by a living lineage",
              ),
      backgroundImageUrl:
        center.slug === "cantal"
          ? "/brands/feldenkrais-education/day-in-training/headerbanner-cantal-alt.jpg"
          : center.slug === "paris"
            ? "/brands/feldenkrais-education/centers/paris-city.jpeg"
            : center.heroImageUrl,
      enrollLabel: t(locale, "S’inscrire", "Enroll"),
      appointmentLabel: t(locale, "Prendre rendez-vous", "Book appointment"),
      appointmentHref,
    },
    centerLife: {
      title:
        center.slug === "cantal"
          ? "Centre Feldenkrais Cantal"
          : center.slug === "brussels"
            ? t(locale, "Centre Feldenkrais Bruxelles", "Feldenkrais Center Brussels")
            : t(locale, "Centre Feldenkrais Paris", "Feldenkrais Center Paris"),
      imageUrl:
        center.slug === "paris"
          ? "/brands/feldenkrais-education/centers/paris-city.jpeg"
          : center.heroImageUrl,
      imageAlt: center.name,
      classLink: {
        label: t(locale, "Rejoindre les cours collectifs", "Join Group Lessons"),
        href: localizePath(locale, "/classes"),
      },
      privateLink: {
        label: t(locale, "Réserver une séance individuelle", "Book Private Session"),
        href: localizePath(locale, "/private-sessions"),
      },
    },
    upcoming: {
      title: t(locale, "Formation à venir", "Upcoming Training"),
      subtitle: t(locale, "Formation professionnelle", "Professional Training"),
      paragraphs: [
        center.upcomingTraining.body,
        ...(cohort?.overviewParagraphs?.slice(0, 1) ?? []),
      ],
      note:
        cohort?.note ??
        center.upcomingTraining.note ??
        undefined,
      gallery:
        center.slug === "cantal"
          ? [
              {
                imageUrl: "/brands/feldenkrais-education/training/hero-room.jpeg",
                alt: "Training room",
              },
              {
                imageUrl: center.heroImageUrl,
                alt: center.name,
              },
              {
                imageUrl: "/brands/feldenkrais-education/centers/cantal-room.jpeg",
                alt: "Cantal room",
              },
              {
                imageUrl: "/brands/feldenkrais-education/day-in-training/headerbanner-cantal.jpg",
                alt: "Cantal landscape",
              },
              {
                imageUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/07/p.jpg",
                alt: "Pia Appelquist",
              },
              {
                imageUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/07/2057_08021809_S066-copie.jpeg",
                alt: "Yvo Mentens",
              },
            ]
          : center.slug === "brussels"
            ? [
                { imageUrl: center.heroImageUrl, alt: center.name },
                {
                  imageUrl: "/brands/feldenkrais-education/training/hero-room.jpeg",
                  alt: "Training room",
                },
                {
                  imageUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/07/DSC02109-Large-e1731345495503.jpeg",
                  alt: "Scott Clark",
                },
                {
                  imageUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/05/079A0516.jpg",
                  alt: "Nikos Appelqvist",
                },
                {
                  imageUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/11/IMG_3814.jpeg",
                  alt: "Betzabel Falfan",
                },
                {
                  imageUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/07/2057_08021809_S066-copie.jpeg",
                  alt: "Yvo Mentens",
                },
              ]
            : [
                {
                  imageUrl: "/brands/feldenkrais-education/centers/paris-city.jpeg",
                  alt: "Paris",
                },
                {
                  imageUrl: center.heroImageUrl,
                  alt: center.name,
                },
                {
                  imageUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/07/Sabine-e1727272136168.jpeg",
                  alt: "Sabine Pfeffer",
                },
                {
                  imageUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/09/2020_Biographie_lionelgonzalez_400x400.png",
                  alt: "Lionel González",
                },
                {
                  imageUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/09/daniel.jpg",
                  alt: "Daniel Cohen-Seat",
                },
                {
                  imageUrl: "/brands/feldenkrais-education/training/hero-room.jpeg",
                  alt: "Training room",
                },
              ],
      enrollLabel: t(locale, "S’inscrire à la formation", "Enroll in training"),
      pdfLabel: t(locale, "Programme PDF complet", "Full PDF Programme"),
    },
    cohortDetails: {
      title: cohortName,
      programPreviewUrl: "/brands/feldenkrais-education/centers/program-preview.jpg",
      pdfLabel: t(locale, "Programme PDF complet", "Full PDF Programme"),
      enrollLabel: t(locale, "S’inscrire à la formation", "Enroll in training"),
    },
    contact: {
      title: t(locale, "Nous contacter", "Contact us"),
      subtitle: t(locale, "Nous serons ravis de vous aider", "We are happy to help"),
      intro: t(
        locale,
        "Des questions sur la formation, le lieu, la cohorte actuelle ou le processus d’inscription ?",
        "Any questions about the training program, the venue, the current cohort, or the enrolment process?",
      ),
      appointmentPrefix: t(locale, "Prendre rendez-vous :", "Book an appointment :"),
      appointmentLabel: t(locale, "> cliquez ici", "> click here"),
      appointmentHref,
      submitLabel: t(locale, "Envoyer", "Send"),
    },
  };

  const introByCenter = {
    cantal: {
      title: "Centre Feldenkrais Cantal",
      subtitle: t(locale, "Une oasis pour apprendre", "An oasis for learning"),
      paragraphs: center.overviewParagraphs,
      video: {
        title: t(locale, "Découvrir le Cantal", "Discover Cantal"),
        videoId: "03aDEfdFtR8",
        posterUrl: buildYouTubePoster("03aDEfdFtR8"),
      },
    },
    brussels: {
      title: t(locale, "Centre Feldenkrais Bruxelles", "Feldenkrais Center Brussels"),
      subtitle: t(locale, "Un refuge dans la ville", "A haven in the city"),
      paragraphs: center.overviewParagraphs,
      video: {
        title: t(locale, "Découvrir Bruxelles", "Discover Brussels"),
        videoId: "sV57SHzXFHY",
        posterUrl: center.heroImageUrl,
      },
    },
    paris: {
      title: t(locale, "Centre Feldenkrais Paris", "Feldenkrais Center Paris"),
      subtitle: t(locale, "Un héritage qui perdure", "An enduring legacy"),
      paragraphs: center.overviewParagraphs,
      video: {
        title: t(locale, "Découvrir Paris", "Discover Paris"),
        videoId: "Ea9B3uwfcOI",
        posterUrl: "/brands/feldenkrais-education/centers/paris-city.jpeg",
        posterPosition: "center 42%",
      },
    },
  } as const;

  if (resolveLocale(locale) === "fr") {
    return {
      ...shared,
      intro: introByCenter[center.slug as keyof typeof introByCenter],
      accessibility: {
        title: "Accessibilité",
        paragraphs: [
          `${shared.centerLife.title} accueille et accompagne les personnes en situation de handicap qui souhaitent se former au métier de praticien de la Méthode Feldenkrais.`,
          "Pour permettre l’accès sans discrimination à notre formation, des solutions de compensation peuvent être mises en place tout au long du cursus en fonction des éventuelles difficultés de la personne en situation de handicap.",
          "Avant toute inscription définitive, un contact préalable est obligatoire pour vérifier l’adéquation entre votre projet, vos attentes et le contenu de la formation. Ce contact permet d’identifier les besoins particuliers et d’anticiper la faisabilité du parcours.",
          "La Référente Handicap, Pia Appelquist, se tient à votre disposition pour un entretien individuel et la construction d’un parcours de formation sécurisé et adapté, en collaboration avec les partenaires utiles.",
          "Contact : piaappelquist@gmail.com",
        ],
        links: [
          { label: "Agefiph", href: "https://www.agefiph.fr/" },
          { label: "Cap emploi", href: "https://www.capemploi.net/" },
          { label: "L’Adapt", href: "https://www.ladapt.net/" },
          { label: "MDPH", href: "https://www.mdph.fr/" },
          { label: "handicap.gouv.fr", href: "https://handicap.gouv.fr/" },
        ],
      },
    };
  }

  return {
    ...shared,
    intro: introByCenter[center.slug as keyof typeof introByCenter],
  };
}
