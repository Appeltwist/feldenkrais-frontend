import type { EducationCenterProfile } from "@/lib/education-content";
import { getEducationCenterActionOption } from "@/lib/education-center-actions";
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
    backgroundVideoUrl?: string;
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
      imageOnly?: boolean;
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
  address?: {
    title: string;
    value: string;
  };
  cohortProgress?: {
    title: string;
    note: string;
    items: Array<{
      label: string;
      progress: number;
      detail: string;
    }>;
  };
  accessibility?: {
    title: string;
    paragraphs: string[];
    links: Array<{ label: string; href: string }>;
  };
  hideCohortDetailsSection?: boolean;
};

function t(locale: string, fr: string, en: string) {
  return resolveLocale(locale) === "fr" ? fr : en;
}

function buildYouTubePoster(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function buildYouTubeBackgroundEmbedUrl(videoId: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    controls: "0",
    loop: "1",
    mute: "1",
    playlist: videoId,
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
  });

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
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
  const centerAction = getEducationCenterActionOption(locale, center.slug as "cantal" | "brussels" | "paris");
  const appointmentHref = centerAction?.bookCallHref || localizePath(locale, "/contact");
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
            ? "/brands/feldenkrais-education/media-library/paris1.jpeg"
            : center.heroImageUrl,
      backgroundVideoUrl:
        center.slug === "cantal"
          ? buildYouTubeBackgroundEmbedUrl("JxcMx_hDEN0")
          : undefined,
      enrollLabel: t(locale, "S’inscrire", "Enroll"),
      appointmentLabel: centerAction?.bookCallHref ? t(locale, "Réserver un appel", "Book a call") : t(locale, "Nous contacter", "Contact us"),
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
          ? "/brands/feldenkrais-education/media-library/paris1.jpeg"
          : center.heroImageUrl,
      imageAlt: center.name,
      classLink: {
        label:
          center.slug === "cantal"
            ? t(locale, "Réserver un appel", "Book a call")
            : center.slug === "brussels"
              ? t(locale, "Réserver un appel", "Book a call")
              : t(locale, "Nous contacter", "Contact us"),
        href:
          center.slug === "cantal" || center.slug === "brussels"
            ? appointmentHref
            : localizePath(locale, "/contact"),
      },
      privateLink: {
        label:
          center.slug === "paris"
            ? t(locale, "Voir la formation", "View the training")
            : t(locale, "Nous contacter", "Contact us"),
        href:
          center.slug === "paris"
            ? localizePath(locale, "/trainings")
            : localizePath(locale, "/contact"),
      },
    },
    upcoming: {
      title:
        center.slug === "paris"
          ? t(locale, "Formation en cours", "Ongoing training")
          : t(locale, "Formation à venir", "Upcoming Training"),
      subtitle: t(locale, "Formation professionnelle", "Professional Training"),
      paragraphs:
        cohort?.overviewParagraphs?.slice(0, 1) ??
        (center.upcomingTraining.body ? [center.upcomingTraining.body] : []),
      note:
        cohort?.note ??
        center.upcomingTraining.note ??
        undefined,
      gallery:
        center.slug === "cantal"
          ? [
              {
                imageUrl: "/brands/feldenkrais-education/media-library/Untitled_1.337.1.jpg",
                alt: "Untitled_1.337.1",
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
                  imageUrl: "/brands/feldenkrais-education/media-library/paris1.jpeg",
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
      appointmentPrefix: centerAction?.bookCallHref ? t(locale, "Réserver un appel :", "Book a call:") : t(locale, "Nous contacter :", "Contact us:"),
      appointmentLabel: centerAction?.bookCallHref ? t(locale, "Ouvrir la réservation", "Open booking") : t(locale, "Aller à la page contact", "Go to the contact page"),
      appointmentHref,
      submitLabel: t(locale, "Envoyer", "Send"),
    },
    address: {
      title: t(locale, "Adresse", "Address"),
      value: center.address,
    },
    cohortProgress:
      center.slug === "cantal"
        ? {
            title: t(locale, "Progression des cohortes", "Cohort progress"),
            note: t(
              locale,
              "Version statique de sécurité pour la bêta. À remplacer par des données de progression réelles dès que la source cohortes sera branchée.",
              "Safe static beta placeholder. Replace with real cohort progress data once the cohort data source is connected.",
            ),
            items: [
              {
                label: "Cantal 5",
                progress: 100,
                detail: t(locale, "Placeholder statique", "Static placeholder"),
              },
              {
                label: "Cantal 6",
                progress: 0,
                detail: t(locale, "Placeholder statique", "Static placeholder"),
              },
            ],
          }
        : center.slug === "brussels"
          ? {
              title: t(locale, "Progression des cohortes", "Cohort progress"),
              note: t(
                locale,
                "Version statique de sécurité pour la bêta. À remplacer par des données de progression réelles dès que la source cohortes sera branchée.",
                "Safe static beta placeholder. Replace with real cohort progress data once the cohort data source is connected.",
              ),
              items: [
                {
                  label: t(locale, "Bruxelles 4", "Brussels 4"),
                  progress: 100,
                  detail: t(locale, "Placeholder statique", "Static placeholder"),
                },
                {
                  label: t(locale, "Bruxelles 5", "Brussels 5"),
                  progress: 0,
                  detail: t(locale, "Placeholder statique", "Static placeholder"),
                },
              ],
            }
        : undefined,
    hideCohortDetailsSection: center.slug === "paris",
  };

  const introByCenter = {
    cantal: {
      title: "Centre Feldenkrais Cantal",
      subtitle: t(locale, "Une oasis pour apprendre", "An oasis for learning"),
      paragraphs: resolveLocale(locale) === "fr"
        ? [
            "Yvo et Pia ont consacré une grande partie de leur vie à l’art de l’enseignement et de la transmission.",
            "Ils ont enseigné le mouvement et le théâtre dans presque tous les contextes imaginables : villages ruraux en France, centres de rééducation, prisons, et même les écoles d’art dramatique les plus prestigieuses.",
            "Créer un centre Feldenkrais était l’occasion idéale de mettre toutes ces années d’expérience en action, et même d’aller un peu plus loin. Leur mission : créer les conditions optimales pour apprendre.",
            "Concevoir un environnement d’apprentissage inspirant et stimulant faisait partie des priorités, au même titre que s’assurer que le café ne manque jamais. Niché entre les montagnes, avec vue sur les collines volcaniques et entouré de livres et de peintures, le lieu est un refuge pour la créativité.",
            "Ce n’est pas seulement un espace physique : ce sont aussi les conférences, concerts et événements organisés après les heures de formation. Au bout de quatre ans, le lieu déborde de souvenirs. Beaucoup d’étudiant·es terminent la formation en l’appelant leur seconde maison.",
          ]
        : [
            "Yvo and Pia spent a big part of their lives crafting the art of teaching and transmission.",
            "They taught movement and theatre in just about every setting imaginable: rural French villages, rehab centers, prisons, and even the most prestigious drama schools.",
            "Creating a Feldenkrais center was the perfect opportunity to put their years of experience into action and even go a step further. Their mission: how to create the optimal conditions for learning.",
            "Crafting an inspiring and stimulating learning environment was high on the priority list, right up there with making sure the coffee never runs out. Nestled amidst mountains with a view on the volcanic hills and surrounded by books and paintings, it is a haven for creativity.",
            "And it is not only a physical space, it is also the conferences, concerts and events that are organized after training hours. At the end of the four years, the place is brimming with memories. Many students finish the training calling it their second home.",
          ],
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
        imageOnly: true,
      },
    },
    paris: {
      title: t(locale, "Centre Feldenkrais Paris", "Feldenkrais Center Paris"),
      subtitle: t(locale, "Un héritage qui perdure", "An enduring legacy"),
      paragraphs: center.overviewParagraphs,
      video: {
        title: t(locale, "Découvrir Paris", "Discover Paris"),
        videoId: "Ea9B3uwfcOI",
        posterUrl: "/brands/feldenkrais-education/media-library/paris1.jpeg",
        posterPosition: "center 42%",
        imageOnly: true,
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
