import PrivateBookingPortal from "@/components/private-booking/PrivateBookingPortal";
import { fetchSiteConfig } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

type PrivateBookingPageProps = {
  params: Promise<{ token: string }>;
};

export default async function PrivateBookingPage({ params }: PrivateBookingPageProps) {
  const { token } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");

  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Private booking</h1>
        <p>Unable to load booking details right now.</p>
      </section>
    );
  }

  return (
    <PrivateBookingPortal
      centerSlug={siteConfig.centerSlug}
      hostname={hostname}
      locale={locale}
      token={token}
    />
  );
}
