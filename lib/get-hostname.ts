import "server-only";

import { headers } from "next/headers";

export function stripPort(host: string) {
  const primaryHost = host.split(",")[0]?.trim() ?? host;
  return primaryHost.replace(/:\d+$/, "");
}

export function resolveRuntimeHostname(rawHost: string | null | undefined) {
  const normalized = stripPort((rawHost ?? "").toLowerCase());
  const override = stripPort((process.env.HOSTNAME_OVERRIDE ?? "").toLowerCase());

  if (override && (!normalized || normalized === "localhost" || normalized === "127.0.0.1")) {
    return override;
  }

  return normalized || override || "localhost";
}

export async function getHostname() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";

  return resolveRuntimeHostname(host);
}
