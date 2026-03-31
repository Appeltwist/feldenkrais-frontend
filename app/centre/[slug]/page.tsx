import { notFound, permanentRedirect } from "next/navigation";

import { mapEducationLegacyCenterSlug } from "@/lib/education-legacy-paths";
import { getRequestLocale } from "@/lib/get-locale";
import { localizePath } from "@/lib/locale-path";

type LegacyCenterPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyCenterRedirectPage({ params }: LegacyCenterPageProps) {
  const { slug } = await params;
  const locale = await getRequestLocale("en");
  const centerSlug = mapEducationLegacyCenterSlug(slug);

  if (!centerSlug) {
    notFound();
  }

  permanentRedirect(localizePath(locale, `/centers/${centerSlug}`));
}
