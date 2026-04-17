import { redirect } from "next/navigation";

import { getRequestLocale } from "@/lib/get-locale";
import { localizePath } from "@/lib/locale-path";

export default async function MosheFeldenkraisPage() {
  const locale = await getRequestLocale("en");
  redirect(localizePath(locale, "/what-is-feldenkrais#biography"));
}
