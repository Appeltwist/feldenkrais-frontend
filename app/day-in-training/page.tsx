import EducationDayInTrainingPage from "@/components/education/EducationDayInTrainingPage";
import { getRequestLocale } from "@/lib/get-locale";

export default async function DayInTrainingPage() {
  const locale = await getRequestLocale("en");

  return (
    <EducationDayInTrainingPage
      locale={locale}
      page={{
        routeKey: "day-in-training",
        locale,
        title: locale.toLowerCase().startsWith("fr") ? "Une journée dans la formation" : "A day in training",
        sections: [],
        subtitle: null,
        hero: {
          title: null,
          body: null,
          imageUrl: null,
        },
        primaryCta: null,
      }}
    />
  );
}
