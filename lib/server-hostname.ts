import "server-only";

import { getOptionalEnv } from "@/lib/server-env";

function stripPort(host: string) {
  const primaryHost = host.split(",")[0]?.trim() ?? host;
  return primaryHost.replace(/:\d+$/, "");
}

export function normalizeHostname(hostname: string) {
  const cleaned = hostname.trim().toLowerCase().replace(/^https?:\/\//, "");
  const firstPart = cleaned.split("/")[0] ?? cleaned;
  return stripPort(firstPart);
}

export function getHostnameOverride() {
  return (
    normalizeHostname(getOptionalEnv("SITE_HOSTNAME_OVERRIDE")) ||
    normalizeHostname(getOptionalEnv("HOSTNAME_OVERRIDE"))
  );
}

export function resolveHostname(hostname: string) {
  return getHostnameOverride() || normalizeHostname(hostname);
}
