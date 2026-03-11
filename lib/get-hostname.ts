import "server-only";

import { headers } from "next/headers";

function stripPort(host: string) {
  const primaryHost = host.split(",")[0]?.trim() ?? host;
  return primaryHost.replace(/:\d+$/, "");
}

export async function getHostname() {
  /* Dev override: when running locally via localhost, resolve to the real site hostname */
  const override = process.env.HOSTNAME_OVERRIDE;
  if (override) {
    return stripPort(override.toLowerCase()) || "localhost";
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";

  return stripPort(host.toLowerCase()) || "localhost";
}
