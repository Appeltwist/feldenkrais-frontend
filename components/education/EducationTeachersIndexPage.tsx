import Link from "next/link";

import type { EducationTeacherProfile } from "@/lib/education-teachers";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import EducationTeacherCardGrid from "./EducationTeacherCardGrid";

type EducationTeachersIndexPageProps = {
  page: NarrativePage;
  teachers: EducationTeacherProfile[];
  locale: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationTeachersIndexPage({
  page,
  teachers,
  locale,
}: EducationTeachersIndexPageProps) {
  const faculty = teachers.filter((teacher) => teacher.section === "faculty");
  const ecosystem = teachers.filter((teacher) => teacher.section === "ecosystem");

  const renderGroup = (
    heading: string,
    intro: string,
    group: EducationTeacherProfile[],
  ) => {
    if (group.length === 0) {
      return null;
    }

    return (
      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{heading}</h2>
          <Link className="text-link" href={localizePath(locale, "/trainings")}>
            {t(locale, "Voir la formation", "View the training")}
          </Link>
        </div>
        <p className="home-section__intro">{intro}</p>
        <EducationTeacherCardGrid locale={locale} teachers={group} />
      </section>
    );
  };

  return (
    <EducationContentPage eyebrow={t(locale, "Enseignant·es", "Teachers")} page={page}>
      {renderGroup(
        t(locale, "L’équipe pédagogique", "Training faculty"),
        t(
          locale,
          "Les pages historiques de FE mettaient en avant les personnes qui portent réellement les cohortes. Nous reprenons ici cette logique avec les intervenant·es les plus structurants pour les parcours de formation.",
          "The historical FE site highlighted the people who actually carry the cohorts. We keep that logic here with the teachers most central to the training pathways.",
        ),
        faculty,
      )}
      {renderGroup(
        t(locale, "L’écosystème des centres", "Center ecosystem"),
        t(
          locale,
          "Autour des formateur·rices, FE s’appuie aussi sur des personnes qui organisent, traduisent, accompagnent et relient les parcours aux centres.",
          "Alongside the trainers, FE also relies on people who organize, translate, accompany, and connect the pathways to the centers.",
        ),
        ecosystem,
      )}
    </EducationContentPage>
  );
}
