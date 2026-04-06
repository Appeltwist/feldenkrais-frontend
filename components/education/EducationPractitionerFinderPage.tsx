import type { EducationPractitionerProfile } from "@/lib/education-practitioners";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import EducationPractitionerDirectory from "./EducationPractitionerDirectory";

type EducationPractitionerFinderPageProps = {
  locale: string;
  page: NarrativePage;
  practitioners: EducationPractitionerProfile[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationPractitionerFinderPage({
  locale,
  page,
  practitioners,
}: EducationPractitionerFinderPageProps) {
  const resolvedPage: NarrativePage = {
    ...page,
    sections: [],
  };

  return (
    <EducationContentPage className="education-practitioner-page" hideHero page={resolvedPage}>
      <EducationPractitionerDirectory
        lead={
          page.hero.body ||
          page.subtitle ||
          t(
            locale,
            "Repérez les praticien·nes sur la carte puis filtrez l’annuaire par ville pour trouver la personne la plus proche.",
            "Explore the map first, then filter the directory by city to find the nearest practitioner.",
          )
        }
        locale={locale}
        practitioners={practitioners}
        title={page.hero.title || page.title || t(locale, "Trouver un praticien", "Find a practitioner")}
      />
    </EducationContentPage>
  );
}
