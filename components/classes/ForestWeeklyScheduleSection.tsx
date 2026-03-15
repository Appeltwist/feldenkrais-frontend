import { fetchOffers, fetchTeachersList } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getPricingContent, type ScheduleDay } from "@/lib/pricing-content";

import ForestScheduleList from "./ForestScheduleList";

type ForestWeeklyScheduleSectionProps = {
  locale: string;
  eyebrow?: string;
  heading?: string;
  subtitle?: string | null;
  className?: string;
  /** @deprecated No longer used — kept for backward compat with pricing page */
  parallax?: boolean;
};

type InstructorProfile = {
  display_name: string;
  photo_url: string;
};

function normalizeName(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function firstWord(value: string | null | undefined) {
  const normalized = normalizeName(value);
  if (!normalized) {
    return "";
  }

  return normalized.split(/\s+/)[0] ?? normalized;
}

function profileFromUnknown(value: unknown): InstructorProfile | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const display_name = typeof record.display_name === "string" ? record.display_name : null;
  const photo_url = typeof record.photo_url === "string" ? record.photo_url : null;

  if (!display_name || !photo_url) {
    return null;
  }

  return { display_name, photo_url };
}

function buildInstructorImageMap(days: ScheduleDay[], classOffers: unknown[], teachers: InstructorProfile[]) {
  const instructorNames = Array.from(
    new Set(
      days.flatMap((day) => day.entries.map((entry) => entry.instructor)).filter(Boolean),
    ),
  );

  const instructors = instructorNames.map((name) => ({
    original: name,
    normalized: normalizeName(name),
    first: firstWord(name),
  }));

  const profiles: InstructorProfile[] = [
    ...classOffers.flatMap((offer) => {
      if (typeof offer !== "object" || offer === null) {
        return [];
      }

      const facilitators = Array.isArray((offer as Record<string, unknown>).facilitators)
        ? ((offer as Record<string, unknown>).facilitators as unknown[])
        : [];

      return facilitators
        .map(profileFromUnknown)
        .filter((profile): profile is InstructorProfile => profile !== null);
    }),
    ...teachers,
  ];

  const imageMap = new Map<string, string>();

  for (const instructor of instructors) {
    const match = profiles.find((profile) => {
      const displayName = normalizeName(profile.display_name);
      return (
        displayName === instructor.normalized ||
        displayName.startsWith(`${instructor.first} `) ||
        firstWord(displayName) === instructor.first
      );
    });

    if (match?.photo_url) {
      imageMap.set(instructor.normalized, match.photo_url);
    }
  }

  return imageMap;
}

function mergeInstructorImages(days: ScheduleDay[], imageMap: Map<string, string>) {
  return days.map((day) => ({
    ...day,
    entries: day.entries.map((entry) => {
      const resolvedImage = imageMap.get(normalizeName(entry.instructor));
      if (!resolvedImage || entry.instructorImage === resolvedImage) {
        return entry;
      }

      return {
        ...entry,
        instructorImage: resolvedImage,
      };
    }),
  }));
}

export default async function ForestWeeklyScheduleSection({
  locale,
  eyebrow,
  heading,
  subtitle,
  className = "",
}: ForestWeeklyScheduleSectionProps) {
  const isFr = locale.toLowerCase().startsWith("fr");
  const content = getPricingContent(locale);
  const resolvedHeading = heading ?? content.schedule.heading;
  const resolvedSubtitle = subtitle ?? content.schedule.subtitle ?? null;

  let scheduleDays = content.schedule.days;

  try {
    const hostname = await getHostname();
    const [classOffers, teachers] = await Promise.all([
      fetchOffers({
        hostname,
        center: "forest-lighthouse",
        type: "CLASS",
        locale,
      }),
      fetchTeachersList({
        hostname,
        center: "forest-lighthouse",
        locale,
      }),
    ]);

    const teacherProfiles: InstructorProfile[] = teachers.flatMap((teacher) => {
      const display_name = typeof teacher.display_name === "string" ? teacher.display_name : "";
      const photo_url = typeof teacher.photo_url === "string" ? teacher.photo_url : "";

      if (!display_name || !photo_url) {
        return [];
      }

      return [{ display_name, photo_url }];
    });

    const imageMap = buildInstructorImageMap(scheduleDays, classOffers, teacherProfiles);
    scheduleDays = mergeInstructorImages(scheduleDays, imageMap);
  } catch {
    /* Keep the static schedule content as a safe fallback when the API is unavailable. */
  }

  const labels = {
    classDetailsLabel: isFr ? "Plus de détails" : "More details",
    classBookLabel: isFr ? "Réserver le cours" : "Book class",
    classTeacherPrefix: isFr ? "avec" : "w/",
    scheduleScrollHint: isFr
      ? "<- Glissez pour voir tous les jours ->"
      : "<- Scroll to see all days ->",
  };

  return (
    <section
      aria-label={resolvedHeading || undefined}
      className={`fp-schedule-section ${className}`.trim()}
    >
      {eyebrow ? <p className="fp-chapter__eyebrow">{eyebrow}</p> : null}
      {resolvedHeading ? (
        <h2 className="fp-section__heading fp-section__heading--left">
          {resolvedHeading}
        </h2>
      ) : null}
      {resolvedSubtitle ? (
        <p className="fp-section__subtitle fp-section__subtitle--left">
          {resolvedSubtitle}
        </p>
      ) : null}

      <ForestScheduleList
        days={scheduleDays}
        labels={labels}
      />
    </section>
  );
}
