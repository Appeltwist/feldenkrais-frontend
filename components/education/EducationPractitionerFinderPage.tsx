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
          t(
            locale,
            "Cette carte ne présente pas une liste exhaustive des praticien·nes, mais les praticien·nes qui ont choisi d’y faire apparaître leurs coordonnées. Vous pouvez aussi trouver d’autres praticien·nes via les outils des guildes locales, à partir des liens ci-dessous.",
            "This is not an exhaustive list of practitioners, but practitioners who signed up to have their contacts listed in this map. You can also find more practitioners using the tools of your local guilds, find the links below our directory.",
          )
        }
        locale={locale}
        practitioners={practitioners}
        title={page.hero.title || page.title || t(locale, "Trouver un praticien", "Find a practitioner")}
      />

      <section className="education-practitioner-guilds education-card">
        <h2>{t(locale, "Guildes locales", "Local guilds")}</h2>
        <div className="education-practitioner-guilds__links">
          <a href="https://www.feldenkrais-france.org/praticiens/annuaire" rel="noreferrer" target="_blank">
            France
          </a>
          <a href="https://www.feldenkrais.co.uk/find-a-teacher/" rel="noreferrer" target="_blank">
            UK
          </a>
          <a href="https://feldenkrais.com/location-search/" rel="noreferrer" target="_blank">
            North America
          </a>
          <a href="https://feldenkrais.it/professionisti/" rel="noreferrer" target="_blank">
            Italy
          </a>
          <a href="https://feldenkraisbelgium.be/fr/trouver-un-praticien-0" rel="noreferrer" target="_blank">
            Belgium
          </a>
        </div>
      </section>
    </EducationContentPage>
  );
}
