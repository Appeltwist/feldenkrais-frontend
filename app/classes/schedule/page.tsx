import ForestWeeklyScheduleSection from "@/components/classes/ForestWeeklyScheduleSection";
import { ForestPageShell } from "@/components/forest/ForestPageShell";
import { fetchSiteConfig } from "@/lib/api";
import { isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getPricingContent } from "@/lib/pricing-content";

export default async function ClassesSchedulePage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const isFrench = locale.toLowerCase().startsWith("fr");

  const isForest = siteConfig ? isForestCenter(siteConfig.centerSlug) : true;

  if (siteConfig && !isForest) {
    return (
      <section className="page-section">
        <h1>{isFrench ? "Horaire des cours" : "Class schedule"}</h1>
        <p>{isFrench ? "Indisponible pour le moment." : "Unavailable right now."}</p>
      </section>
    );
  }

  const pricingContent = getPricingContent(locale);

  return (
    <ForestPageShell>
      <section className="fc-intro">
        <p className="fc-intro__eyebrow">
          {isFrench ? "Pratique hebdomadaire" : "Weekly practice"}
        </p>
        <h1 className="fc-intro__title">
          {isFrench ? "Horaire des cours" : "Class Schedule"}
        </h1>
        <p className="fc-intro__subtitle">
          {isFrench
            ? "Retrouvez le rythme hebdomadaire des cours collectifs à Forest Lighthouse."
            : "See the weekly rhythm of group classes at Forest Lighthouse."}
        </p>
      </section>

      <ForestWeeklyScheduleSection
        heading=""
        locale={locale}
        subtitle={pricingContent.schedule.subtitle}
      />
    </ForestPageShell>
  );
}
