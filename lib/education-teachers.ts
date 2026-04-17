import type { NarrativePage } from "@/lib/site-config";

import { resolveLocale } from "@/lib/i18n";

export type EducationTeacherProfile = {
  slug: string;
  legacyAliases: string[];
  displayName: string;
  title: string;
  shortBio: string;
  bioParagraphs: string[];
  photoUrl: string;
  centerSlugs: string[];
  cohortSlugs: string[];
  focusAreas: string[];
  section: "faculty" | "ecosystem";
  page: NarrativePage;
};

function t(locale: string, fr: string, en: string) {
  return resolveLocale(locale) === "fr" ? fr : en;
}

function buildTeacherPage(
  locale: string,
  routeKey: string,
  title: string,
  subtitle: string,
  imageUrl: string,
): NarrativePage {
  return {
    routeKey,
    locale: resolveLocale(locale),
    title,
    subtitle,
    hero: {
      title,
      body: subtitle,
      imageUrl,
    },
    sections: [],
    primaryCta: null,
    seo: {
      title: `${title} | Feldenkrais Education`,
      description: subtitle,
    },
  };
}

export function getEducationTeacherProfiles(locale: string): EducationTeacherProfile[] {
  return [
    {
      slug: "alan-questel",
      legacyAliases: ["alan-questel", "alan-questel-en"],
      displayName: "Alan Questel",
      title: t(locale, "Directeur pédagogique international", "International educational director"),
      shortBio: t(
        locale,
        "Formé par Moshe Feldenkrais à Amherst en 1983, Alan Questel enseigne la méthode depuis des décennies à travers le monde.",
        "Trained by Moshe Feldenkrais in Amherst in 1983, Alan Questel has taught the method for decades around the world.",
      ),
      bioParagraphs: [
        t(
          locale,
          "Alan Questel a été formé directement par Moshe Feldenkrais à Amherst en 1983. Depuis, il consacre l’essentiel de son temps à former de nouveaux praticiens et à accompagner des processus d’apprentissage sur plusieurs continents.",
          "Alan Questel was trained directly by Moshe Feldenkrais in Amherst in 1983. Since then, he has devoted most of his time to training new practitioners and accompanying learning processes across continents.",
        ),
        t(
          locale,
          "Son enseignement mêle clarté, humour et sens pratique. Il a enseigné dans plus de vingt pays, créé de nombreux programmes Feldenkrais, publié plusieurs ouvrages, et garde une relation vivante entre créativité, pédagogie et transformation personnelle.",
          "His teaching combines clarity, humor, and practicality. He has taught in more than twenty countries, created many Feldenkrais programs, published books, and keeps a living connection between creativity, pedagogy, and personal transformation.",
        ),
      ],
      photoUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2021/08/Alan-Q-006-2.jpg",
      centerSlugs: ["cantal"],
      cohortSlugs: ["cantal-6"],
      focusAreas: [
        t(locale, "Formation de praticiens", "Practitioner training"),
        t(locale, "Créativité", "Creativity"),
        t(locale, "Pédagogie", "Pedagogy"),
      ],
      section: "faculty",
      page: buildTeacherPage(
        locale,
        "teacher-alan-questel",
        "Alan Questel",
        t(
          locale,
          "Une voix majeure de la formation Feldenkrais, entre créativité, clarté et transmission.",
          "A major voice in Feldenkrais training, balancing creativity, clarity, and transmission.",
        ),
        "https://feldenkrais-education.com/wp-content/uploads/sites/15/2021/08/Alan-Q-006-2.jpg",
      ),
    },
    {
      slug: "scott-clark",
      legacyAliases: ["scott-clark", "scott-clark-en"],
      displayName: "Scott Clark",
      title: t(locale, "Formateur et directeur pédagogique", "Trainer and educational director"),
      shortBio: t(
        locale,
        "Danseur de formation puis praticien Feldenkrais, Scott Clark enseigne depuis plus de trente ans avec une attention particulière aux artistes.",
        "Originally trained as a dancer, Scott Clark has taught Feldenkrais for more than thirty years, with particular attention to artists.",
      ),
      bioParagraphs: [
        t(
          locale,
          "Originaire du Nouveau-Mexique, Scott Clark a d’abord étudié les mathématiques avant de se former comme danseur. Sa rencontre avec la méthode Feldenkrais remonte à 1982 et il a été diplômé de la première formation professionnelle de Londres en 1990.",
          "Originally from New Mexico, Scott Clark first studied mathematics before training as a dancer. He encountered the Feldenkrais Method in 1982 and graduated from London’s first professional training in 1990.",
        ),
        t(
          locale,
          "Depuis 1997, il se consacre entièrement à l’enseignement du Feldenkrais auprès d’individus, de groupes publics et de formations professionnelles. Il travaille volontiers avec les artistes de scène, des danseurs aux comédiens en passant par les musiciens.",
          "Since 1997, he has dedicated himself entirely to teaching Feldenkrais with individuals, public groups, and professional trainings. He works especially well with performing artists, from dancers to actors to musicians.",
        ),
      ],
      photoUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/07/DSC02109-Large-e1731345495503.jpeg",
      centerSlugs: ["brussels"],
      cohortSlugs: ["brussels-5"],
      focusAreas: [
        t(locale, "Artistes de scène", "Performing artists"),
        t(locale, "Leçons collectives", "Group lessons"),
        t(locale, "Transmission professionnelle", "Professional transmission"),
      ],
      section: "faculty",
      page: buildTeacherPage(
        locale,
        "teacher-scott-clark",
        "Scott Clark",
        t(
          locale,
          "Une approche nourrie par la danse, la scène et une longue expérience de la transmission.",
          "An approach nourished by dance, stage work, and a long experience of transmission.",
        ),
        "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/07/DSC02109-Large-e1731345495503.jpeg",
      ),
    },
    {
      slug: "sabine-pfeffer",
      legacyAliases: ["sabine-pfeffer-en", "sabine-pfeffer-formatrice"],
      displayName: "Sabine Pfeffer",
      title: t(locale, "Formatrice internationale", "International trainer"),
      shortBio: t(
        locale,
        "Formée directement par Moshe Feldenkrais, Sabine Pfeffer porte à Paris une lignée de transmission historique.",
        "Trained directly by Moshe Feldenkrais, Sabine Pfeffer carries a historical lineage of transmission in Paris.",
      ),
      bioParagraphs: [
        t(
          locale,
          "Sabine Pfeffer a suivi l’enseignement de Moshe Feldenkrais en Israël et aux États-Unis. Elle enseigne ensuite la méthode en France et à l’international pendant plus de trente ans.",
          "Sabine Pfeffer followed Moshe Feldenkrais’ teaching in Israel and the United States. She then taught the method in France and internationally for more than thirty years.",
        ),
        t(
          locale,
          "À Paris, elle a fondé en 1988 le centre Accord Mobile avec Myriam Pfeffer et y a formé de nombreux praticiens français et étrangers. Son travail relie fidélité à la source, rigueur pédagogique et dialogue avec les neurosciences, les arts et la pédagogie du mouvement.",
          "In Paris, she founded the Accord Mobile center in 1988 with Myriam Pfeffer and trained many French and international practitioners there. Her work ties fidelity to the source, pedagogical rigor, and dialogue with neuroscience, the arts, and movement pedagogy.",
        ),
      ],
      photoUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/07/Sabine-e1727272136168.jpeg",
      centerSlugs: ["paris"],
      cohortSlugs: ["paris-14"],
      focusAreas: [
        t(locale, "Transmission historique", "Historical transmission"),
        t(locale, "Direction pédagogique", "Educational direction"),
        t(locale, "Neurosciences et pédagogie", "Neuroscience and pedagogy"),
      ],
      section: "faculty",
      page: buildTeacherPage(
        locale,
        "teacher-sabine-pfeffer",
        "Sabine Pfeffer",
        t(
          locale,
          "Une lignée directe avec la source, mise au service d’une pédagogie actuelle.",
          "A direct line to the source, put in service of a contemporary pedagogy.",
        ),
        "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/07/Sabine-e1727272136168.jpeg",
      ),
    },
    {
      slug: "yvo-mentens",
      legacyAliases: ["yvo-mentens", "yvo-mentens-en"],
      displayName: "Yvo Mentens",
      title: t(locale, "Formateur certifié et cofondateur", "Certified trainer and co-founder"),
      shortBio: t(
        locale,
        "Yvo Mentens enseigne la méthode Feldenkrais en Europe, en Asie et aux États-Unis, avec une pédagogie reconnue pour sa créativité et sa sécurité.",
        "Yvo Mentens teaches the Feldenkrais Method in Europe, Asia, and the United States, with a pedagogy known for its creativity and sense of safety.",
      ),
      bioParagraphs: [
        t(
          locale,
          "Yvo Mentens a découvert la méthode il y a plus de trente ans et a été certifié praticien dans la formation de Myriam Pfeffer. Il a ensuite poursuivi son étude auprès des premiers assistants et élèves de Moshe Feldenkrais.",
          "Yvo Mentens discovered the method more than thirty years ago and was certified as a practitioner in Myriam Pfeffer’s training. He then continued studying with Moshe Feldenkrais’ first assistants and students.",
        ),
        t(
          locale,
          "Cofondateur de Feldenkrais Education, il enseigne aujourd’hui dans des formations professionnelles en Europe, en Asie et aux États-Unis. Son parcours traverse aussi la sociologie, la criminologie, le théâtre physique et différentes approches thérapeutiques, ce qui donne une grande amplitude à sa transmission.",
          "As co-founder of Feldenkrais Education, he now teaches in professional trainings in Europe, Asia, and the United States. His path also crosses sociology, criminology, physical theatre, and several therapeutic approaches, which gives breadth to his transmission.",
        ),
      ],
      photoUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/07/2057_08021809_S066-copie.jpeg",
      centerSlugs: ["cantal", "brussels"],
      cohortSlugs: ["cantal-6", "brussels-5"],
      focusAreas: [
        t(locale, "Pédagogie créative", "Creative pedagogy"),
        t(locale, "Environnements d’apprentissage", "Learning environments"),
        t(locale, "Transmission internationale", "International transmission"),
      ],
      section: "faculty",
      page: buildTeacherPage(
        locale,
        "teacher-yvo-mentens",
        "Yvo Mentens",
        t(
          locale,
          "Un pédagogue créatif, engagé dans la qualité de l’environnement d’apprentissage.",
          "A creative pedagogue committed to the quality of the learning environment.",
        ),
        "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/07/2057_08021809_S066-copie.jpeg",
      ),
    },
    {
      slug: "pia-appelquist",
      legacyAliases: ["pia-appelquist", "pia-appelquist-en"],
      displayName: "Pia Appelquist",
      title: t(locale, "Assistante formatrice certifiée", "Certified assistant trainer"),
      shortBio: t(
        locale,
        "Anthropologue de formation et ancienne actrice, Pia Appelquist articule pédagogie du mouvement, art et accompagnement de publics variés.",
        "Trained in anthropology and formerly an actress, Pia Appelquist weaves together movement pedagogy, art, and support for varied publics.",
      ),
      bioParagraphs: [
        t(
          locale,
          "Pia Appelquist est praticienne certifiée depuis 2010 et assistante formatrice certifiée depuis 2019. D’origine danoise, elle vit et travaille en France depuis les années 1990.",
          "Pia Appelquist has been a certified practitioner since 2010 and a certified assistant trainer since 2019. Danish by origin, she has lived and worked in France since the 1990s.",
        ),
        t(
          locale,
          "Après des études d’anthropologie puis une carrière d’actrice, elle a cofondé à Aurillac le Beliashe Institute – Center for Arts and Human Potential. Elle travaille avec des enfants à besoins spécifiques, des artistes, des adultes de tous horizons et développe un lien fin entre scène, apprentissage et transformation.",
          "After studying anthropology and then working as an actress, she co-founded the Beliashe Institute – Center for Arts and Human Potential in Aurillac. She works with children with special needs, artists, and adults from many backgrounds, developing a subtle link between stage work, learning, and transformation.",
        ),
      ],
      photoUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/07/p.jpg",
      centerSlugs: ["cantal"],
      cohortSlugs: ["cantal-6"],
      focusAreas: [
        t(locale, "Arts et mouvement", "Arts and movement"),
        t(locale, "Enfance et besoins spécifiques", "Children and special needs"),
        t(locale, "Transmission", "Transmission"),
      ],
      section: "faculty",
      page: buildTeacherPage(
        locale,
        "teacher-pia-appelquist",
        "Pia Appelquist",
        t(
          locale,
          "Une transmission qui relie mouvement, théâtre, apprentissage et qualité de présence.",
          "A transmission that links movement, theatre, learning, and quality of presence.",
        ),
        "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/07/p.jpg",
      ),
    },
    {
      slug: "eilat-almagor",
      legacyAliases: ["eilat-almagor", "eilat-almagor-en"],
      displayName: "Eilat Almagor",
      title: t(locale, "Formatrice internationale", "International trainer"),
      shortBio: t(
        locale,
        "Neurobiologiste de formation et diplômée d’Amherst 1983, Eilat Almagor relie recherche scientifique et pratique Feldenkrais.",
        "Trained in neurobiology and an Amherst 1983 graduate, Eilat Almagor bridges scientific research and Feldenkrais practice.",
      ),
      bioParagraphs: [
        t(
          locale,
          "Eilat Almagor a suivi la formation de Moshe Feldenkrais à Amherst en 1983. Elle est aussi titulaire d’un doctorat en neurobiologie, d’une maîtrise en sciences de l’environnement et d’une formation en mathématiques et physique.",
          "Eilat Almagor completed Moshe Feldenkrais’ Amherst training in 1983. She also holds a Ph.D. in neurobiology, a master’s degree in environmental science, and training in mathematics and physics.",
        ),
        t(
          locale,
          "Ces dernières années, elle a porté des projets pour introduire le Feldenkrais à l’école, collaboré avec des neuroscientifiques en Israël et en Allemagne, et enseigné à l’Université de Jérusalem dans des formats qui croisent informatique théorique et mouvement.",
          "In recent years, she has led projects bringing Feldenkrais into schools, collaborated with neuroscientists in Israel and Germany, and taught at the University of Jerusalem in formats that combine theoretical computer science and movement.",
        ),
      ],
      photoUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2018/05/Eilat-Almagor.jpg",
      centerSlugs: ["paris"],
      cohortSlugs: ["paris-14"],
      focusAreas: [
        t(locale, "Recherche et neurosciences", "Research and neuroscience"),
        t(locale, "Éducation", "Education"),
        t(locale, "Transmission internationale", "International transmission"),
      ],
      section: "faculty",
      page: buildTeacherPage(
        locale,
        "teacher-eilat-almagor",
        "Eilat Almagor",
        t(
          locale,
          "Une présence qui relie exigence scientifique, pédagogie et mouvement.",
          "A presence that links scientific rigor, pedagogy, and movement.",
        ),
        "https://feldenkrais-education.com/wp-content/uploads/sites/15/2018/05/Eilat-Almagor.jpg",
      ),
    },
    {
      slug: "lionel-gonzalez",
      legacyAliases: ["lionel-gonzalez-assistant-co-organizer", "lionel-gonzalez-assistant-co-organisateur"],
      displayName: "Lionel González",
      title: t(locale, "Assistant formateur et co-organisateur", "Assistant trainer and co-organizer"),
      shortBio: t(
        locale,
        "Ancien acteur et metteur en scène, Lionel González apporte au centre de Paris une forte articulation entre scène, présence et pédagogie.",
        "Former actor and director Lionel González brings to the Paris center a strong articulation between stage work, presence, and pedagogy.",
      ),
      bioParagraphs: [
        t(
          locale,
          "Après des études en sciences de l’ingénieur et un magistère de mathématiques, Lionel González a changé de trajectoire pour se former au théâtre. C’est à l’École Internationale Jacques Lecoq qu’il a entendu parler de Moshe Feldenkrais pour la première fois.",
          "After studies in engineering sciences and a master’s degree in mathematics, Lionel González changed direction to train in theatre. It was at the Ecole Internationale Jacques Lecoq that he first heard about Moshe Feldenkrais.",
        ),
        t(
          locale,
          "Acteur, metteur en scène et pédagogue, il a travaillé dans de nombreux pays avant de suivre la dernière formation d’Accord Mobile à Paris 13. Depuis 2012, il poursuit son travail avec Sabine Pfeffer et participe à la construction de la nouvelle formation parisienne comme organisateur et assistant de continuité.",
          "As an actor, director, and pedagogue, he worked in many countries before joining Accord Mobile’s last training, Paris 13. Since 2012, he has continued working with Sabine Pfeffer and helps build the new Paris training as organizer and continuity assistant.",
        ),
      ],
      photoUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/09/2020_Biographie_lionelgonzalez_400x400.png",
      centerSlugs: ["paris"],
      cohortSlugs: ["paris-14"],
      focusAreas: [
        t(locale, "Théâtre", "Theatre"),
        t(locale, "Continuité pédagogique", "Pedagogical continuity"),
        t(locale, "Organisation de formation", "Training organization"),
      ],
      section: "faculty",
      page: buildTeacherPage(
        locale,
        "teacher-lionel-gonzalez",
        "Lionel González",
        t(
          locale,
          "Une transmission nourrie par le théâtre, la scène et le suivi dans le temps.",
          "A transmission nourished by theatre, stage work, and long-form follow-through.",
        ),
        "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/09/2020_Biographie_lionelgonzalez_400x400.png",
      ),
    },
    {
      slug: "daniel-cohen-seat",
      legacyAliases: ["daniel-cohen-seat-co-organizer", "daniel-cohen-seat-co-organisateur"],
      displayName: "Daniel Cohen-Seat",
      title: t(locale, "Co-organisateur et pédagogue", "Co-organizer and pedagogue"),
      shortBio: t(
        locale,
        "Daniel Cohen-Seat relie recherche vocale, théâtre et organisation de la formation parisienne.",
        "Daniel Cohen-Seat connects vocal research, theatre, and the organization of the Paris training.",
      ),
      bioParagraphs: [
        t(
          locale,
          "Diplômé de l’École Normale Supérieure de Paris, Daniel Cohen-Seat enseigne le théâtre, forme des chanteurs et transmet ses recherches à travers des séminaires consacrés à la science vocale et à l’art de jouer.",
          "A graduate of the Ecole Normale Supérieure in Paris, Daniel Cohen-Seat teaches theatre, trains singers, and shares his research through seminars dedicated to vocal science and the art of acting.",
        ),
        t(
          locale,
          "Il a découvert Feldenkrais très tôt auprès de Sabine et Myriam Pfeffer. Aujourd’hui, il coordonne et organise la formation de Paris avec Lionel González, en apportant une attention rare à la voix, à la relation et à la précision pédagogique.",
          "He discovered Feldenkrais very early with Sabine and Myriam Pfeffer. Today he coordinates and organizes the Paris training with Lionel González, bringing rare attention to voice, relationship, and pedagogical precision.",
        ),
      ],
      photoUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/09/daniel.jpg",
      centerSlugs: ["paris"],
      cohortSlugs: ["paris-14"],
      focusAreas: [
        t(locale, "Voix", "Voice"),
        t(locale, "Théâtre", "Theatre"),
        t(locale, "Coordination pédagogique", "Pedagogical coordination"),
      ],
      section: "faculty",
      page: buildTeacherPage(
        locale,
        "teacher-daniel-cohen-seat",
        "Daniel Cohen-Seat",
        t(
          locale,
          "Une écoute pédagogique nourrie par la voix, le théâtre et la transmission.",
          "A pedagogical listening shaped by voice, theatre, and transmission.",
        ),
        "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/09/daniel.jpg",
      ),
    },
    {
      slug: "nikos-appelqvist",
      legacyAliases: ["nikos-appelqvist", "nikos-appelqvist-co-organiser-translator"],
      displayName: "Nikos Appelqvist",
      title: t(locale, "Co-organisateur, traducteur et praticien", "Co-organizer, translator, and practitioner"),
      shortBio: t(
        locale,
        "Cofondateur de Forest Lighthouse et de Feldenkrais Education, Nikos Appelqvist joue un rôle structurant dans les cohortes de Bruxelles.",
        "Co-founder of Forest Lighthouse and Feldenkrais Education, Nikos Appelqvist plays a structuring role in the Brussels cohorts.",
      ),
      bioParagraphs: [
        t(
          locale,
          "Praticien certifié depuis la série Cantal 1, Nikos Appelqvist poursuit depuis plusieurs années un projet très concret: rendre les principes du Feldenkrais accessibles à un public plus large à travers des lieux, des formations et des outils.",
          "Certified through the Cantal 1 series, Nikos Appelqvist has pursued a very concrete project for years: making Feldenkrais principles accessible to a wider public through places, trainings, and tools.",
        ),
        t(
          locale,
          "Avec Forest Lighthouse, il a créé à Bruxelles un centre dédié à l’éducation somatique. Il accompagne aussi l’organisation des séries Brussels 1 à 4, traduit les formations, développe des outils numériques et poursuit un travail de terrain avec des groupes variés, des musiciens aux personnes vivant avec des douleurs chroniques.",
          "With Forest Lighthouse, he created in Brussels a center dedicated to somatic education. He also helps organize Brussels series 1 through 4, translates trainings, develops digital tools, and continues field work with varied groups, from musicians to people living with chronic pain.",
        ),
      ],
      photoUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/05/079A0516.jpg",
      centerSlugs: ["brussels"],
      cohortSlugs: ["brussels-5"],
      focusAreas: [
        t(locale, "Organisation", "Organization"),
        t(locale, "Traduction", "Translation"),
        t(locale, "Innovation numérique", "Digital innovation"),
      ],
      section: "ecosystem",
      page: buildTeacherPage(
        locale,
        "teacher-nikos-appelqvist",
        "Nikos Appelqvist",
        t(
          locale,
          "Une présence à la croisée de l’organisation, de la transmission et du développement de l’écosystème.",
          "A presence at the intersection of organization, transmission, and ecosystem building.",
        ),
        "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/05/079A0516.jpg",
      ),
    },
    {
      slug: "betzabel-falfan",
      legacyAliases: ["betzabel-falfan-co-organiser", "betzabel-falfan-co-organisatrice"],
      displayName: "Betzabel Falfan",
      title: t(locale, "Praticienne et co-organisatrice", "Practitioner and co-organizer"),
      shortBio: t(
        locale,
        "Betzabel Falfan réunit Feldenkrais, danse, anthropologie et accompagnement des publics vulnérables dans une pratique très incarnée.",
        "Betzabel Falfan brings together Feldenkrais, dance, anthropology, and support for vulnerable publics in a very embodied practice.",
      ),
      bioParagraphs: [
        t(
          locale,
          "Betzabel Falfan est praticienne certifiée, cofondatrice de Forest Lighthouse, et anime à Bruxelles des cours ATM ainsi que des séances individuelles. Elle travaille avec les nourrissons, les enfants à besoins spécifiques, les seniors, les personnes en rééducation ou vivant avec des douleurs chroniques.",
          "Betzabel Falfan is a certified practitioner, co-founder of Forest Lighthouse, and leads ATM classes and individual sessions in Brussels. She works with infants, children with special needs, seniors, people in rehabilitation, and those living with chronic pain.",
        ),
        t(
          locale,
          "Son parcours traverse aussi les arts de la scène, la danse classique indienne, Child’Space, Brighter Minds, la méditation Heartfulness et la thérapie de la douleur. Cette pluralité donne à son approche une qualité d’écoute particulièrement riche et inclusive.",
          "Her path also crosses performing arts, Indian classical dance, Child’Space, Brighter Minds, Heartfulness meditation, and pain therapy. That plurality gives her approach a particularly rich and inclusive listening quality.",
        ),
      ],
      photoUrl: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/11/IMG_3814.jpeg",
      centerSlugs: ["brussels"],
      cohortSlugs: ["brussels-5"],
      focusAreas: [
        t(locale, "Enfance et développement", "Children and development"),
        t(locale, "Danse et présence", "Dance and presence"),
        t(locale, "Douleur chronique", "Chronic pain"),
      ],
      section: "ecosystem",
      page: buildTeacherPage(
        locale,
        "teacher-betzabel-falfan",
        "Betzabel Falfan",
        t(
          locale,
          "Une approche intégrative, attentive à la diversité des corps, des âges et des parcours.",
          "An integrative approach attentive to the diversity of bodies, ages, and pathways.",
        ),
        "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/11/IMG_3814.jpeg",
      ),
    },
  ];
}

export function getEducationTeacherProfile(locale: string, slug: string) {
  const normalized = slug.trim().toLowerCase();
  return (
    getEducationTeacherProfiles(locale).find(
      (teacher) => teacher.slug === normalized || teacher.legacyAliases.includes(normalized),
    ) ?? null
  );
}

export function getEducationTeachersByCenter(locale: string, centerSlug: string) {
  return getEducationTeacherProfiles(locale).filter((teacher) => teacher.centerSlugs.includes(centerSlug));
}

export function getEducationTeachersByCohort(locale: string, cohortSlug: string) {
  return getEducationTeacherProfiles(locale).filter((teacher) => teacher.cohortSlugs.includes(cohortSlug));
}

export function resolveEducationTeacherSlugAlias(locale: string, slug: string) {
  return getEducationTeacherProfile(locale, slug)?.slug ?? null;
}
