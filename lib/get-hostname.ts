import "server-only";

import { headers } from "next/headers";

function stripPort(host: string) {
  const primaryHost = host.split(",")[0]?.trim() ?? host;
  return primaryHost.replace(/:\d+$/, "");
}

export async function getHostname() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";

  return stripPort(host.toLowerCase()) || "localhost";
}
