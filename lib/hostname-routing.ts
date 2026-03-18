export function normalizeRequestedHostname(hostname: string) {
  const cleaned = hostname.trim().toLowerCase().replace(/^https?:\/\//, "");
  const firstPart = cleaned.split("/")[0] ?? cleaned;
  const firstHost = firstPart.split(",")[0]?.trim() ?? firstPart;

  return firstHost.replace(/:\d+$/, "");
}

export function isForestPreviewHostname(hostname: string) {
  const normalized = normalizeRequestedHostname(hostname);
  return normalized.endsWith(".vercel.app") && normalized.includes("feldenkrais-frontend");
}

export function resolveApiHostname(hostname: string) {
  const normalized = normalizeRequestedHostname(hostname);

  if (isForestPreviewHostname(normalized)) {
    return "forest-lighthouse.be";
  }

  return normalized;
}
