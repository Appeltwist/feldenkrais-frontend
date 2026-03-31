import { redirect } from "next/navigation";

import { getRequestLocale } from "@/lib/get-locale";
import { localizePath } from "@/lib/locale-path";

export default async function YourVisitPage() {
  const locale = await getRequestLocale("en");
  redirect(localizePath(locale, "/visit"));
}
