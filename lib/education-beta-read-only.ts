function normalizeHostname(hostname: string | null | undefined) {
  const cleaned = (hostname ?? "").trim().toLowerCase().replace(/^https?:\/\//, "");
  const firstPart = cleaned.split("/")[0] ?? cleaned;
  const primaryHost = firstPart.split(",")[0]?.trim() ?? firstPart;
  return primaryHost.replace(/:\d+$/, "");
}

export function isEducationBetaReadOnlyHostname(hostname: string | null | undefined) {
  const normalized = normalizeHostname(hostname);

  return (
    normalized === "feldenkrais-education.com" ||
    normalized === "beta.feldenkrais-education.com" ||
    normalized === "feldenkrais-education.local" ||
    normalized.endsWith(".feldenkrais-education.local")
  );
}

export function getEducationBetaReadOnlyCopy(locale: string) {
  const isFr = locale.toLowerCase().startsWith("fr");

  if (isFr) {
    return {
      actionLabel: "Bêta en lecture seule",
      compactBody: "Cette bêta est en lecture seule jusqu'au lancement.",
      body: "Cette bêta permet uniquement de parcourir le contenu importé. Les formulaires, prises de contact, inscriptions et réservations restent désactivés jusqu'au lancement.",
      title: "Les actions ouvriront au lancement",
    };
  }

  return {
    actionLabel: "Read-only beta",
    compactBody: "This beta stays read-only until launch.",
    body: "This beta is for browsing the imported content only. Forms, contact requests, applications, and bookings stay disabled until launch.",
    title: "Interactive actions open at launch",
  };
}
