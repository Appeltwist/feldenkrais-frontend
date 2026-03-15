import "server-only";

import { headers } from "next/headers";
import { resolveHostname } from "@/lib/server-hostname";

export async function getHostname() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";

  return resolveHostname(host.toLowerCase()) || "localhost";
}
