import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import EducationContactTabs from "./EducationContactTabs";
import EducationNewsletterSignupRow from "./EducationNewsletterSignupRow";

type EducationContactPageProps = {
  locale: string;
  page: NarrativePage;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

const CONTACT_ENTRIES = [
  {
    slug: "cantal",
    label: "Cantal, France",
    centerName: "Centre Feldenkrais Cantal",
    email: "cantal@felded.com",
    phone: "+33 6 82 21 61 74",
    lines: ["38 Bd des Hortes", "15000 Aurillac", "France"],
    icon: "mountain" as const,
  },
  {
    slug: "brussels",
    label: "Brussels, Belgium",
    centerName: "Centre Feldenkrais Brussels",
    email: "brussels@felded.com",
    phone: "+32 485 72 68 37",
    lines: ["274 Rue des Alliés", "1190 Forest", "Belgium"],
    icon: "city" as const,
  },
  {
    slug: "paris",
    label: "Paris, France",
    centerName: "Centre Feldenkrais Paris",
    email: "paris@felded.com",
    phone: "+33 661 15 26 27",
    lines: ["53 Rue Camélinat", "94400 Vitry-sur-Seine", "France"],
    icon: "building" as const,
  },
];

export default function EducationContactPage({
  locale,
  page,
}: EducationContactPageProps) {
  const resolvedPage: NarrativePage = {
    ...page,
    sections: [],
  };

  return (
    <EducationContentPage
      className="education-contact-page education-contact-page--reworked"
      hideHero
      page={resolvedPage}
    >
      <section className="education-contact-section">
        <div className="education-contact-section__intro">
          <h1>{t(locale, "Contactez-nous", "Contact Us")}</h1>
          <p>
            {t(
              locale,
              "Avez-vous des questions à propos de la formation, des cours de groupe ou des séances individuelles ? N’hésitez pas à nous contacter.",
              "Do you have any questions about the training, the group lessons or the private sessions? Do not hesitate to contact us.",
            )}
          </p>
        </div>
        <EducationContactTabs entries={CONTACT_ENTRIES} locale={locale} />
      </section>

      <EducationNewsletterSignupRow
        className="education-contact-page__newsletter"
        content={{
          body: t(
            locale,
            "Inscrivez-vous et recevez la newsletter bimensuelle avec des articles, des recommandations de livres et des opportunités Feldenkrais.",
            "Sign up and get the bi-weekly newsletter with articles, book recommendations and Feldenkrais Opportunities.",
          ),
          subtitle: t(locale, "& Restez informé·e", "& Stay updated"),
          title: t(locale, "Inscrivez-vous à la newsletter", "Sign up for the Newsletter"),
        }}
        locale={locale}
      />
    </EducationContentPage>
  );
}
