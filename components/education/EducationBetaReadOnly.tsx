import { getEducationBetaReadOnlyCopy } from "@/lib/education-beta-read-only";

type EducationBetaReadOnlyNoticeProps = {
  locale: string;
  className?: string;
  title?: string;
  body?: string;
  compact?: boolean;
};

type EducationBetaReadOnlyButtonProps = {
  locale: string;
  className?: string;
  label?: string;
  secondary?: boolean;
};

export function EducationBetaReadOnlyButton({
  locale,
  className = "",
  label,
  secondary = false,
}: EducationBetaReadOnlyButtonProps) {
  const copy = getEducationBetaReadOnlyCopy(locale);

  return (
    <span
      aria-disabled="true"
      className={[
        "education-button",
        secondary ? "education-button--secondary" : "",
        "education-button--disabled",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label || copy.actionLabel}
    </span>
  );
}

export default function EducationBetaReadOnlyNotice({
  locale,
  className = "",
  title,
  body,
  compact = false,
}: EducationBetaReadOnlyNoticeProps) {
  const copy = getEducationBetaReadOnlyCopy(locale);

  return (
    <div
      className={[
        "education-read-only-note",
        compact ? "education-read-only-note--compact" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
    >
      <strong>{title || copy.title}</strong>
      <p>{body || (compact ? copy.compactBody : copy.body)}</p>
    </div>
  );
}
