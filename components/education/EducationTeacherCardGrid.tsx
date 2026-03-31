import Link from "next/link";

import type { EducationTeacherProfile } from "@/lib/education-teachers";
import { localizePath } from "@/lib/locale-path";

type EducationTeacherCardGridProps = {
  teachers: EducationTeacherProfile[];
  locale: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationTeacherCardGrid({
  teachers,
  locale,
}: EducationTeacherCardGridProps) {
  return (
    <div className="education-card-grid education-card-grid--teachers">
      {teachers.map((teacher) => (
        <article className="education-card education-teacher-card" key={teacher.slug}>
          <div
            className="education-teacher-card__media"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.88)), url(${teacher.photoUrl})`,
            }}
          />
          <div className="education-teacher-card__body">
            <p className="education-page__date-range">{teacher.title}</p>
            <h3>{teacher.displayName}</h3>
            <p>{teacher.shortBio}</p>
            <div className="education-teacher-card__chips">
              {teacher.focusAreas.slice(0, 3).map((item) => (
                <span className="education-teacher-chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <div className="education-offer-card__actions">
              <Link className="education-button" href={localizePath(locale, `/teachers/${teacher.slug}`)}>
                {t(locale, "Voir le profil", "View profile")}
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
