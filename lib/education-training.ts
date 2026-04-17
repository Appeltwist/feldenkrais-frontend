import type { NarrativePage } from "@/lib/site-config";

import { getEducationCenter } from "@/lib/education-content";
import { resolveLocale } from "@/lib/i18n";

export type EducationTrainingCohort = {
  slug: string;
  name: string;
  centerSlug: string;
  centerName: string;
  location: string;
  periodLabel: string;
  director: string;
  segments: string;
  pricing: string;
  admissionsUrl: string;
  programPdfUrl: string;
  pdfRequestHref: string;
  legacyTitle: string;
  overviewParagraphs: string[];
  highlights: Array<{ title: string; body: string }>;
  pathwayIncludes: Array<{ title: string; body: string }>;
  note?: string;
  page: NarrativePage;
};

export type EducationTrainingProgramStat = {
  value: string;
  label: string;
};

export type EducationTrainingCurriculumYear = {
  title: string;
  subtitle: string;
  steps: Array<{ title: string; body: string }>;
};

export type EducationTrainingIncludedItem = {
  title: string;
  body: string;
};

function t(locale: string, fr: string, en: string) {
  return resolveLocale(locale) === "fr" ? fr : en;
}

function buildCohortNarrativePage(
  locale: string,
  routeKey: string,
  options: {
    title: string;
    subtitle: string;
    heroImageUrl: string;
  },
): NarrativePage {
  return {
    routeKey,
    locale: resolveLocale(locale),
    title: options.title,
    subtitle: options.subtitle,
    hero: {
      title: options.title,
      body: options.subtitle,
      imageUrl: options.heroImageUrl,
    },
    sections: [],
    primaryCta: null,
    seo: {
      title: `${options.title} | Feldenkrais Education`,
      description: options.subtitle,
    },
  };
}

function buildAdmissionsUrl(locale: string, key: "cantal" | "brussels" | "paris") {
  if (key === "cantal") {
    return "https://neurosomatic.cloud/intake/cantal-6/";
  }

  if (key === "brussels") {
    return "https://neurosomatic.cloud/intake/bruxelles-5/";
  }

  return "https://docs.google.com/forms/d/e/1FAIpQLSdEDM7IlmDW4UAxr1OHogGWTNSl4dN0fn7EdMqOdxkvY3BlRQ/viewform";
}

function buildPdfRequestHref(locale: string, cohortName: string) {
  const subject = t(
    locale,
    `Demande du programme PDF - ${cohortName}`,
    `Request the program PDF - ${cohortName}`,
  );
  const body = t(
    locale,
    `Bonjour,%0D%0A%0D%0AJe souhaite recevoir le programme PDF pour ${cohortName}.%0D%0A%0D%0AMerci.`,
    `Hello,%0D%0A%0D%0AI would like to receive the program PDF for ${cohortName}.%0D%0A%0D%0AThank you.`,
  );

  return `mailto:info@feldenkrais-education.com?subject=${encodeURIComponent(subject)}&body=${body}`;
}

function buildProgramPdfUrl(key: "cantal" | "brussels" | "paris") {
  if (key === "cantal") {
    return "https://feldenkrais-education.com/wp-content/uploads/sites/15/2025/02/C5_Fiche-programme.pdf";
  }

  if (key === "brussels") {
    return "https://feldenkrais-education.com/wp-content/uploads/sites/15/2025/02/B4_Fiche-programme.pdf";
  }

  return "https://feldenkrais-education.com/wp-content/uploads/sites/15/2025/01/Paris14_Fiche-programme-1.pdf";
}

export function getEducationTrainingProgramStats(locale: string): EducationTrainingProgramStat[] {
  return [
    { value: t(locale, "4 ans", "4 years"), label: t(locale, "Durée du parcours", "Program duration") },
    { value: t(locale, "8 à 12 segments", "8 to 12 segments"), label: t(locale, "Segments selon le centre", "Segments depending on center") },
    { value: t(locale, "160 jours", "160 days"), label: t(locale, "Temps d’étude cumulé", "Cumulative study time") },
    { value: t(locale, "800 heures", "800 hours"), label: t(locale, "Volume pédagogique", "Teaching volume") },
  ];
}

export function getEducationTrainingCurriculum(locale: string): EducationTrainingCurriculumYear[] {
  return [
    {
      title: t(locale, "Année 1", "Year 1"),
      subtitle: t(locale, "Sentir davantage, faire moins", "Feel more, do less"),
      steps: [
        {
          title: t(locale, "Se sentir soi-même", "Focus on sensing yourself"),
          body: t(
            locale,
            "Le début du parcours est consacré à reconnaître les habitudes qui participent à la douleur, au stress et à la fatigue, puis à organiser ses mouvements avec plus d’efficacité.",
            "The beginning of the pathway is dedicated to recognizing the habits that contribute to pain, stress, and fatigue, then organizing your movements more efficiently.",
          ),
        },
        {
          title: t(locale, "Fondations théoriques", "Learn the theoretical foundations"),
          body: t(
            locale,
            "Physique, psychologie, kinésiologie, développement moteur, anatomie et neurophysiologie viennent soutenir la pratique dès la première année.",
            "Physics, psychology, kinesiology, motor development, anatomy, and neurophysiology support the practice from the first year.",
          ),
        },
        {
          title: t(locale, "Introduction au toucher", "Introduction to touch"),
          body: t(
            locale,
            "Le toucher professionnel devient un axe de travail dès la première semaine, même si la pratique individuelle prend toute son ampleur plus tard dans le cursus.",
            "Professional touch becomes a line of work from the first week, even if individual practice takes its full place later in the curriculum.",
          ),
        },
      ],
    },
    {
      title: t(locale, "Année 2", "Year 2"),
      subtitle: t(locale, "Apprendre à apprendre", "Learning to learn"),
      steps: [
        {
          title: t(locale, "Pédagogie et stratégies d’enseignement", "Teaching strategies and pedagogy"),
          body: t(
            locale,
            "Vous développez des outils pour enseigner, prendre la parole en public et affiner votre pensée pédagogique.",
            "You develop tools for teaching, public speaking, and refining your pedagogical thinking.",
          ),
        },
        {
          title: t(locale, "Analyser les leçons", "Analyse the structure of lessons"),
          body: t(
            locale,
            "Le travail porte sur la structure et la fonction des leçons ATM, ainsi que sur leur adaptation à des publics et contextes variés.",
            "The work focuses on the structure and function of ATM lessons, as well as adapting them to varied audiences and contexts.",
          ),
        },
        {
          title: t(locale, "Affiner le toucher", "Refine your touch and sensitivity"),
          body: t(
            locale,
            "L’observation des organisations de mouvement et la finesse du toucher se développent au contact des collègues et des situations pratiques.",
            "Observation of movement organization and tactile finesse deepen through work with colleagues and practical situations.",
          ),
        },
      ],
    },
    {
      title: t(locale, "Année 3", "Year 3"),
      subtitle: t(locale, "Toucher et perception", "Touch and perception"),
      steps: [
        {
          title: t(locale, "Pratique hands-on", "Practice hands-on"),
          body: t(
            locale,
            "Les capacités d’observation et d’analyse s’affinent, avec une attention plus précise aux schémas de mouvement et à leur impact global.",
            "Observation and analysis sharpen further, with more precise attention to movement patterns and their broader impact.",
          ),
        },
        {
          title: t(locale, "Self-use dans le hands-on", "Self-use in hands-on"),
          body: t(
            locale,
            "L’exploration de votre propre organisation continue en profondeur, car une meilleure qualité d’usage de soi améliore le travail manuel.",
            "Exploration of your own organization continues in depth, because better self-use improves hands-on work.",
          ),
        },
        {
          title: t(locale, "Structure FI et contextualisation", "FI structure and contextualization"),
          body: t(
            locale,
            "Vous étudiez les stratégies de Functional Integration, leur articulation sur une séance complète, et leur application auprès de publics divers.",
            "You study Functional Integration strategies, how they articulate over a full lesson, and how they apply with diverse audiences.",
          ),
        },
      ],
    },
    {
      title: t(locale, "Année 4", "Year 4"),
      subtitle: t(locale, "De l’étudiant au praticien", "From student in training to student in life"),
      steps: [
        {
          title: t(locale, "Élargir son vocabulaire", "Expand your vocabulary"),
          body: t(
            locale,
            "Les leçons individuelles se développent dans des positions variées: assis, debout, en marche, à genoux ou allongé.",
            "Individual lessons develop in varied positions: sitting, standing, walking, kneeling, or lying down.",
          ),
        },
        {
          title: t(locale, "Reverse-engineering", "Reverse-engineering"),
          body: t(
            locale,
            "Le travail avec les enregistrements de Moshe Feldenkrais et l’assistance à des sessions expérimentées affinent l’analyse de la structure FI.",
            "Working with Moshe Feldenkrais recordings and assisting experienced live sessions sharpens analysis of FI structure.",
          ),
        },
        {
          title: t(locale, "Installer sa pratique", "Setting up a practice"),
          body: t(
            locale,
            "Éthique, organisation, coordination et premiers pas professionnels deviennent des sujets explicites du parcours.",
            "Ethics, organization, coordination, and first professional steps become explicit topics in the pathway.",
          ),
        },
      ],
    },
  ];
}

export function getEducationTrainingIncludedItems(locale: string): EducationTrainingIncludedItem[] {
  return [
    {
      title: t(locale, "12 leçons individuelles", "12 individual lessons"),
      body: t(
        locale,
        "Le parcours comprend douze leçons individuelles de Functional Integration avec des assistant·es, formateur·rices et praticien·nes expérimenté·es.",
        "The pathway includes twelve individual Functional Integration lessons with experienced assistants, trainers, and practitioners.",
      ),
    },
    {
      title: t(locale, "Souplesse en cas d’absence", "Make-up flexibility"),
      body: t(
        locale,
        "Si vous manquez des jours du cursus, plusieurs solutions existent: rejoindre des segments d’autres formations ou travailler en autonomie avec les enregistrements.",
        "If you miss days of the curriculum, several solutions exist: joining segments in other trainings or working independently with the recordings.",
      ),
    },
    {
      title: t(locale, "Espaces d’apprentissage ouverts", "Open learning space"),
      body: t(
        locale,
        "Les espaces du centre restent accessibles avant et après les heures de formation pour continuer à pratiquer ou simplement rester en lien.",
        "The center spaces remain accessible before and after training hours so you can keep practicing or simply stay connected.",
      ),
    },
    {
      title: t(locale, "Revoir les segments", "Revisit the training"),
      body: t(
        locale,
        "Les cours enregistrés sur la plateforme restent disponibles pendant toute la durée du programme.",
        "Recorded courses remain available on the platform during the whole program.",
      ),
    },
    {
      title: t(locale, "Guides de pratique", "Practice guidelines"),
      body: t(
        locale,
        "Après chaque segment, des recommandations de pratique prolongent le travail à la maison entre deux rencontres.",
        "After each segment, practice guidelines help extend the work at home between meetings.",
      ),
    },
    {
      title: t(locale, "Leçons live hebdomadaires", "Weekly live lessons"),
      body: t(
        locale,
        "Deux fois par semaine, des leçons en ligne permettent de garder le fil du travail depuis chez soi.",
        "Twice a week, online lessons help keep the thread of the work alive from home.",
      ),
    },
    {
      title: t(locale, "Groupes de pratique", "Practice groups"),
      body: t(
        locale,
        "Des groupes se forment entre étudiant·es de la même formation pour pratiquer ensemble en ligne ou en présence.",
        "Groups form between students in the same training so they can practice together online or in person.",
      ),
    },
  ];
}

export function getEducationTrainingCohorts(locale: string): EducationTrainingCohort[] {
  const cantalCenter = getEducationCenter(locale, "cantal");
  const brusselsCenter = getEducationCenter(locale, "brussels");
  const parisCenter = getEducationCenter(locale, "paris");

  if (!cantalCenter || !brusselsCenter || !parisCenter) {
    return [];
  }

  return [
    {
      slug: "cantal-6",
      name: "Cantal 6",
      centerSlug: "cantal",
      centerName: cantalCenter.name,
      location: cantalCenter.location,
      periodLabel: t(locale, "Commence en juillet 2026", "Starts in July 2026"),
      director: "Yvo Mentens",
      segments: "8",
      pricing: t(locale, "4500 € / an", "4500 € / year"),
      admissionsUrl: buildAdmissionsUrl(locale, "cantal"),
      programPdfUrl: buildProgramPdfUrl("cantal"),
      pdfRequestHref: buildPdfRequestHref(locale, "Cantal 6"),
      legacyTitle: t(locale, "Une oasis pour apprendre", "An oasis for learning"),
      overviewParagraphs: [
        t(
          locale,
          "Cantal 6 s’adresse aux personnes qui cherchent un parcours approfondi dans un cadre d’étude immersif. Ici, la formation prend la forme d’un séjour de recherche, avec du temps réel pour apprendre, intégrer et vivre ensemble.",
          "Cantal 6 is for people looking for a deep pathway inside an immersive study setting. Here, the training takes the form of a research retreat, with real time to learn, integrate, and live together.",
        ),
        t(
          locale,
          "Le centre d’Aurillac met la montagne, les collines volcaniques, la bibliothèque, les repas et les événements du soir au service du travail. Cela change la qualité de présence et la continuité du parcours.",
          "The Aurillac center places the mountains, volcanic hills, library, meals, and evening events in service of the work. It changes the quality of presence and continuity across the pathway.",
        ),
      ],
      highlights: [
        {
          title: t(locale, "Immersion", "Immersion"),
          body: t(
            locale,
            "Le rythme du centre favorise des segments plus concentrés, une attention soutenue et une vraie sensation de retraite d’étude.",
            "The center rhythm favors more concentrated segments, sustained attention, and a real feeling of study retreat.",
          ),
        },
        {
          title: t(locale, "Continuité", "Continuity"),
          body: t(
            locale,
            "Le parcours est pensé pour laisser de la place à l’intégration entre les sessions, sans perdre le fil du travail.",
            "The pathway is designed to leave room for integration between sessions without losing the thread of the work.",
          ),
        },
        {
          title: t(locale, "Communauté", "Community"),
          body: t(
            locale,
            "Au fil des années, le centre devient pour beaucoup un second lieu d’appartenance, pas seulement un endroit où suivre des cours.",
            "Over the years, the center becomes for many people a second place of belonging, not only a place to attend classes.",
          ),
        },
      ],
      pathwayIncludes: [
        {
          title: t(locale, "Awareness Through Movement", "Awareness Through Movement"),
          body: t(
            locale,
            "Des leçons collectives pour apprendre à sentir plus finement, à réduire l’effort inutile, et à élargir les options d’action.",
            "Group lessons for learning to sense more finely, reduce unnecessary effort, and widen options for action.",
          ),
        },
        {
          title: t(locale, "Functional Integration", "Functional Integration"),
          body: t(
            locale,
            "Des démonstrations et de la pratique autour du toucher, de l’écoute manuelle et de la relation d’apprentissage.",
            "Demonstrations and practice around touch, hands-on listening, and the learning relationship.",
          ),
        },
        {
          title: t(locale, "Fondations théoriques", "Theoretical foundations"),
          body: t(
            locale,
            "Physique, psychologie, développement moteur et pédagogie nourrissent le travail tout au long du parcours.",
            "Physics, psychology, motor development, and pedagogy feed the work all along the pathway.",
          ),
        },
        {
          title: t(locale, "Pratique entre pairs", "Peer practice"),
          body: t(
            locale,
            "Entre les segments, les échanges, les enregistrements et la pratique entre étudiants soutiennent la continuité.",
            "Between segments, exchanges, recordings, and peer practice support continuity.",
          ),
        },
      ],
      note: t(
        locale,
        "La cohorte répond aux exigences imposées par EuroTAB.",
        "The cohort meets the requirements imposed by EuroTAB.",
      ),
      page: buildCohortNarrativePage(locale, "training-cantal-6", {
        title: "Cantal 6",
        subtitle: t(
          locale,
          "Une cohorte de formation professionnelle ancrée dans un cadre d’étude immersif à Aurillac.",
          "A professional training cohort rooted in an immersive study setting in Aurillac.",
        ),
        heroImageUrl: cantalCenter.heroImageUrl,
      }),
    },
    {
      slug: "brussels-5",
      name: t(locale, "Bruxelles 5", "Brussels 5"),
      centerSlug: "brussels",
      centerName: brusselsCenter.name,
      location: brusselsCenter.location,
      periodLabel: t(locale, "Commence en janvier 2027", "Starts in January 2027"),
      director: "Scott Clark / Yvo Mentens",
      segments: "12",
      pricing: t(locale, "4200 € / an", "4200 € / year"),
      admissionsUrl: buildAdmissionsUrl(locale, "brussels"),
      programPdfUrl: buildProgramPdfUrl("brussels"),
      pdfRequestHref: buildPdfRequestHref(locale, t(locale, "Bruxelles 5", "Brussels 5")),
      legacyTitle: t(locale, "Un refuge dans la ville", "A haven in the city"),
      overviewParagraphs: [
        t(
          locale,
          "Bruxelles 5 s’adresse aux personnes qui veulent étudier la méthode dans un contexte urbain, vivant et international. La cohorte s’appuie sur l’écosystème de Forest Lighthouse, où Feldenkrais rencontre d’autres pratiques somatiques et artistiques.",
          "Brussels 5 is for people who want to study the method in an urban, lively, and international context. The cohort is anchored in the Forest Lighthouse ecosystem, where Feldenkrais meets other somatic and artistic practices.",
        ),
        t(
          locale,
          "Ce cadre donne une couleur particulière au parcours: énergie de ville, diversité des profils, circulation entre recherche pédagogique, cours, ateliers et vie du lieu.",
          "That setting gives the pathway a particular color: city energy, diversity of profiles, and circulation between pedagogical research, classes, workshops, and the life of the place.",
        ),
      ],
      highlights: [
        {
          title: t(locale, "Ancrage urbain", "Urban anchor"),
          body: t(
            locale,
            "La cohorte se déploie dans un centre actif, connecté à la ville et à des pratiques multiples.",
            "The cohort unfolds inside an active center connected to the city and to multiple practices.",
          ),
        },
        {
          title: t(locale, "Dimension internationale", "International dimension"),
          body: t(
            locale,
            "Bruxelles attire des étudiants venus de différents horizons et crée un espace d’étude plus cosmopolite.",
            "Brussels attracts students from different horizons and creates a more cosmopolitan study space.",
          ),
        },
        {
          title: t(locale, "Transmission vivante", "Living transmission"),
          body: t(
            locale,
            "Le travail est nourri par des enseignants expérimentés et une culture du lieu qui valorise la curiosité et l’expérimentation.",
            "The work is nourished by experienced teachers and by a place culture that values curiosity and experimentation.",
          ),
        },
      ],
      pathwayIncludes: [
        {
          title: t(locale, "Leçons collectives", "Group lessons"),
          body: t(
            locale,
            "Les leçons ATM structurent le parcours et développent une compréhension sensible de l’organisation du mouvement.",
            "ATM lessons structure the pathway and develop a sensitive understanding of movement organization.",
          ),
        },
        {
          title: t(locale, "Applications cliniques et pédagogiques", "Clinical and pedagogical applications"),
          body: t(
            locale,
            "Le contexte du centre rend plus visibles les passages entre étude personnelle, accompagnement et transmission.",
            "The context of the center makes the passages between personal study, accompaniment, and transmission more visible.",
          ),
        },
        {
          title: t(locale, "Travail interdisciplinaire", "Interdisciplinary environment"),
          body: t(
            locale,
            "La proximité avec d’autres pratiques donne du relief aux questions de présence, relation, performance et santé.",
            "The proximity to other practices gives depth to questions of presence, relationship, performance, and health.",
          ),
        },
        {
          title: t(locale, "Suivi dans le temps", "Long-form follow-through"),
          body: t(
            locale,
            "La durée du programme permet de laisser le travail transformer réellement la manière d’enseigner, de toucher et de se mouvoir.",
            "The duration of the program allows the work to genuinely transform the way you teach, touch, and move.",
          ),
        },
      ],
      note: t(
        locale,
        "La cohorte répond aux exigences imposées par EuroTAB.",
        "The cohort meets the requirements imposed by EuroTAB.",
      ),
      page: buildCohortNarrativePage(locale, "training-brussels-5", {
        title: t(locale, "Bruxelles 5", "Brussels 5"),
        subtitle: t(
          locale,
          "Une cohorte de formation professionnelle portée par Forest Lighthouse à Bruxelles.",
          "A professional training cohort carried by Forest Lighthouse in Brussels.",
        ),
        heroImageUrl: brusselsCenter.heroImageUrl,
      }),
    },
    {
      slug: "paris-14",
      name: "Paris 14",
      centerSlug: "paris",
      centerName: parisCenter.name,
      location: parisCenter.location,
      periodLabel: "2025 - 2029",
      director: "Sabine Pfeffer",
      segments: "12",
      pricing: t(locale, "4300 € / an", "4300 € / year"),
      admissionsUrl: buildAdmissionsUrl(locale, "paris"),
      programPdfUrl: buildProgramPdfUrl("paris"),
      pdfRequestHref: buildPdfRequestHref(locale, "Paris 14"),
      legacyTitle: t(locale, "Un héritage qui perdure", "An enduring legacy"),
      overviewParagraphs: [
        t(
          locale,
          "Paris 14 reprend le flambeau des formations portées par Myriam Pfeffer et s’inscrit dans une continuité rare avec l’histoire de la méthode dans l’espace francophone.",
          "Paris 14 picks up the torch from the trainings carried by Myriam Pfeffer and stands in rare continuity with the history of the method in the French-speaking world.",
        ),
        t(
          locale,
          "Avec Sabine Pfeffer, l’enjeu n’est pas seulement de préserver un héritage, mais de le mettre au service de l’expérience singulière de chaque étudiant et d’une pratique bien vivante.",
          "With Sabine Pfeffer, the challenge is not only to preserve a heritage, but to place it in service of each student’s singular experience and a very living practice.",
        ),
      ],
      highlights: [
        {
          title: t(locale, "Proximité avec la source", "Close to the source"),
          body: t(
            locale,
            "La cohorte s’appuie sur une filiation explicite avec les premières formations professionnelles et leur exigence pédagogique.",
            "The cohort draws on an explicit lineage with the first professional trainings and their pedagogical rigor.",
          ),
        },
        {
          title: t(locale, "Transmission", "Transmission"),
          body: t(
            locale,
            "Paris 14 place la question de la transmission au cœur du parcours, autant dans la pratique que dans la relation à l’histoire de la méthode.",
            "Paris 14 places the question of transmission at the center of the pathway, both in practice and in its relation to the history of the method.",
          ),
        },
        {
          title: t(locale, "Innovation", "Innovation"),
          body: t(
            locale,
            "L’héritage sert ici de point d’appui pour inventer, affiner et transmettre autrement, pas pour répéter mécaniquement.",
            "Here heritage serves as a base for inventing, refining, and transmitting differently, not for repeating mechanically.",
          ),
        },
      ],
      pathwayIncludes: [
        {
          title: t(locale, "Étude de la méthode", "Method study"),
          body: t(
            locale,
            "Le parcours développe une compréhension approfondie du mouvement, de l’apprentissage et de la relation pédagogique.",
            "The pathway develops an in-depth understanding of movement, learning, and pedagogical relationship.",
          ),
        },
        {
          title: t(locale, "Direction pédagogique", "Educational direction"),
          body: t(
            locale,
            "La cohorte bénéficie d’une direction qui relie directement l’histoire de la méthode à sa transmission contemporaine.",
            "The cohort benefits from an educational direction that directly links the history of the method to its contemporary transmission.",
          ),
        },
        {
          title: t(locale, "Pratique et recherche", "Practice and inquiry"),
          body: t(
            locale,
            "Les segments alternent pratique, théorie, démonstrations et temps d’intégration, avec une attention forte portée à l’expérience vécue.",
            "Segments alternate practice, theory, demonstrations, and integration time, with strong attention to lived experience.",
          ),
        },
        {
          title: t(locale, "Ouverture professionnelle", "Professional opening"),
          body: t(
            locale,
            "La formation accompagne l’entrée dans une communauté internationale de praticiens et une nouvelle manière de travailler.",
            "The training supports entry into an international community of practitioners and a new way of working.",
          ),
        },
      ],
      note: t(
        locale,
        "La cohorte a l’intention de demander une accréditation EuroTAB.",
        "The cohort intends to apply for EuroTAB accreditation.",
      ),
      page: buildCohortNarrativePage(locale, "training-paris-14", {
        title: "Paris 14",
        subtitle: t(
          locale,
          "Une cohorte de formation professionnelle ancrée dans l’héritage pédagogique de Paris.",
          "A professional training cohort rooted in Paris’ pedagogical heritage.",
        ),
        heroImageUrl: parisCenter.heroImageUrl,
      }),
    },
  ];
}

export function getEducationTrainingCohort(locale: string, slug: string) {
  const normalizedSlug = slug === "brussels-4" ? "brussels-5" : slug;
  return getEducationTrainingCohorts(locale).find((cohort) => cohort.slug === normalizedSlug) ?? null;
}

export function getEducationTrainingCohortByCenter(locale: string, centerSlug: string) {
  return getEducationTrainingCohorts(locale).find((cohort) => cohort.centerSlug === centerSlug) ?? null;
}
