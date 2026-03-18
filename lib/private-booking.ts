export type PrivateBookingFlowStage =
  | "standard"
  | "intro_call"
  | "intro_pending"
  | "paid_package"
  | "active_package";

export type PrivateBookingPrepAnswers = Record<string, unknown>;

export type PrivateBookingPractitioner = {
  id: number;
  display_name: string;
  title?: string | null;
  short_bio?: string | null;
  photo_url?: string | null;
};

export type PrivateBookingPackageOption = {
  id: number;
  code: string;
  label: string;
  summary?: string | null;
  session_count: number;
  price_total: string;
  currency: string;
  validity_days: number;
  is_intro_call?: boolean;
  requires_intro_call_completion?: boolean;
  is_default?: boolean;
  is_featured?: boolean;
};

export type PrivateBookingPrepField = {
  key: string;
  field_type: "TEXT" | "TEXTAREA" | "SELECT" | "CHECKBOX" | string;
  label: string;
  help_text?: string | null;
  placeholder?: string | null;
  options?: string[];
  required?: boolean;
};

export type PrivateBookingPackageBooking = {
  token: string;
  start_datetime: string;
  end_datetime: string;
  timezone: string;
  status: string;
  is_intro_call: boolean;
};

export type PrivateBookingPackageSummary = {
  token: string;
  offer_slug: string;
  offer_title: string;
  practitioner_id: number;
  practitioner_name: string;
  locale: string;
  package_option_id?: number | null;
  prep_answers: PrivateBookingPrepAnswers;
  package_code: string;
  package_label: string;
  total_sessions: number;
  remaining_sessions: number;
  price_total: string;
  unit_price: string;
  currency: string;
  payment_note?: string | null;
  valid_until?: string | null;
  intro_call_required?: boolean;
  intro_call_completed_at?: string | null;
  unlocked_at?: string | null;
  status: string;
  bookings: PrivateBookingPackageBooking[];
};

export type PrivateBookingSummary = {
  token: string;
  package_token?: string | null;
  offer_slug: string;
  offer_title: string;
  practitioner_id: number;
  practitioner_name: string;
  locale: string;
  package_option_id?: number | null;
  prep_answers: PrivateBookingPrepAnswers;
  start_datetime: string;
  end_datetime: string;
  timezone: string;
  duration_minutes: number;
  is_intro_call?: boolean;
  package_label: string;
  package_total: string;
  session_unit_price: string;
  currency: string;
  payment_note?: string | null;
  status: string;
  reschedule_cutoff_hours: number;
  can_reschedule?: boolean;
  can_cancel?: boolean;
  package?: PrivateBookingPackageSummary | null;
};

export type PrivateBookingConfig = {
  offer_slug: string;
  offer_title: string;
  locale: string;
  booking_enabled: boolean;
  requires_intro_call: boolean;
  intro_call_label?: string | null;
  intro_call_duration_minutes: number;
  intro_call_format: string;
  paid_session_duration_minutes: number;
  payment_note?: string | null;
  reschedule_cutoff_hours: number;
  prep_instructions?: string | null;
  confirmation_note?: string | null;
  reminder_note?: string | null;
  followup_note?: string | null;
  practitioners: PrivateBookingPractitioner[];
  package_options: PrivateBookingPackageOption[];
  prep_fields: PrivateBookingPrepField[];
  flow_stage?: PrivateBookingFlowStage;
  package?: PrivateBookingPackageSummary | null;
};

export type PrivateBookingSlot = {
  start_datetime: string;
  end_datetime: string;
  timezone: string;
  date_label: string;
  time_label: string;
};

export type PrivateBookingAvailability = {
  practitioner_id: number;
  package_option_id: number;
  duration_minutes: number;
  timezone: string;
  slots: PrivateBookingSlot[];
};

export type PrivateBookingPageEntity =
  | {
      kind: "booking";
      booking: PrivateBookingSummary;
      package: PrivateBookingPackageSummary | null;
    }
  | {
      kind: "package";
      booking: null;
      package: PrivateBookingPackageSummary;
    };

export function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function withLocalePath(locale: string, path: string) {
  const prefix = locale.toLowerCase().startsWith("fr") ? "/fr" : "/en";
  if (!path.startsWith("/")) {
    return `${prefix}/${path}`;
  }
  return `${prefix}${path}`;
}

export function withPrivateBookingPrepDefaults(
  fields: PrivateBookingPrepField[],
  current: PrivateBookingPrepAnswers = {},
) {
  const values: PrivateBookingPrepAnswers = { ...current };

  for (const field of fields) {
    if (!(field.key in values)) {
      values[field.key] = field.field_type === "CHECKBOX" ? false : "";
    }
  }

  return values;
}

export function normalizePrivateBookingPrepAnswers(
  fields: PrivateBookingPrepField[],
  current: PrivateBookingPrepAnswers = {},
) {
  const normalized = withPrivateBookingPrepDefaults(fields, current);

  for (const field of fields) {
    const value = normalized[field.key];

    if (field.field_type === "CHECKBOX") {
      normalized[field.key] = Boolean(value);
      continue;
    }

    if (Array.isArray(value)) {
      normalized[field.key] = value.map((item) => String(item).trim()).filter(Boolean);
      continue;
    }

    if (typeof value === "string") {
      normalized[field.key] = value.trim();
      continue;
    }

    if (value === null || value === undefined) {
      normalized[field.key] = "";
      continue;
    }

    normalized[field.key] = String(value).trim();
  }

  return normalized;
}

export function isPrivateBookingPrepAnswerFilled(field: PrivateBookingPrepField, value: unknown) {
  if (field.field_type === "CHECKBOX") {
    return Boolean(value);
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function formatPrivateBookingMoney(value: string | number, currency: string, locale: string) {
  const amount = typeof value === "number" ? value : Number.parseFloat(String(value));

  if (Number.isFinite(amount)) {
    return new Intl.NumberFormat(locale.toLowerCase().startsWith("fr") ? "fr-BE" : "en-BE", {
      style: "currency",
      currency: currency || "EUR",
    }).format(amount);
  }

  return [value, currency].filter(Boolean).join(" ");
}

export function formatPrivateBookingDateTime(value: string, locale: string, timeZone?: string) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale.toLowerCase().startsWith("fr") ? "fr-BE" : "en-BE", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: timeZone || undefined,
  }).format(parsed);
}
