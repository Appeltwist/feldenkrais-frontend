export type LocaleCode = "fr" | "en";

export type OfferType = "WORKSHOP" | "CLASS" | "PRIVATE_SESSION" | "TRAINING_INFO";

export type PrimaryCTA = {
  label: string;
  url: string;
  style?: string | null;
};

export type QuickFacts = {
  venue?: string | null;
  location?: string | null;
  languages?: string | null;
  level?: string | null;
  duration?: string | null;
  price_note?: string | null;
  facilitator_note?: string | null;
};

export type ScheduleCardFacilitator = {
  id?: number | string;
  display_name?: string | null;
  photo_url?: string | null;
  has_public_profile?: boolean | null;
};

export type ScheduleCard = {
  date_label?: string | null;
  start_datetime?: string | null;
  end_datetime?: string | null;
  timezone?: string | null;
  facilitator?: ScheduleCardFacilitator | null;
};

export type ThemeTag = {
  id: number | string;
  name: string;
};

export type SiteFaqItem = {
  question: string;
  answer: string;
};

export type SiteFaqSection = {
  title: string;
  items: SiteFaqItem[];
};

export type Occurrence = {
  id?: number | string | null;
  start?: string | null;
  end?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  start_datetime?: string | null;
  end_datetime?: string | null;
  timezone?: string | null;
  label?: string | null;
  facilitator?: ScheduleCardFacilitator | null;
  booking_url?: string | null;
  ics_url?: string | null;
  [key: string]: unknown;
};

export type PriceOption = {
  label?: string | null;
  name?: string | null;
  title?: string | null;
  amount?: string | number | null;
  price?: string | number | null;
  value?: string | number | null;
  formatted?: string | null;
  currency?: string | null;
  currency_code?: string | null;
  [key: string]: unknown;
};

export type BookingOption = {
  label?: string | null;
  amount?: string | number | null;
  currency?: string | null;
  summary?: string | null;
  date_summary?: string | null;
  booking_url?: string | null;
  is_featured?: boolean | null;
  occurrence_ids?: Array<number | string> | null;
  [key: string]: unknown;
};

export type PricingPromo = {
  kind?: string | null;
  label?: string | null;
  amount?: string | number | null;
  currency?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  note?: string | null;
  is_active?: boolean | null;
  [key: string]: unknown;
};

export type Facilitator = {
  id?: number | string;
  name?: string | null;
  full_name?: string | null;
  title?: string | null;
  [key: string]: unknown;
};

export type TeacherDetail = {
  id?: number | string;
  slug?: string;
  display_name?: string;
  title?: string | null;
  short_bio?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  gallery_urls?: string[];
  quote?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  locale?: string;
  center?: { slug?: string | null; name?: string | null } | null;
  [key: string]: unknown;
};

export type TeacherListItem = {
  id?: number | string;
  slug?: string;
  display_name?: string;
  title?: string | null;
  short_bio?: string | null;
  photo_url?: string | null;
  [key: string]: unknown;
};

export type RichSectionBlock = {
  type: "rich_section";
  value: {
    heading?: string | null;
    body?: string | null;
  };
};

export type FeatureStackBlock = {
  type: "feature_stack";
  value: {
    heading?: string | null;
    items?: Array<{
      title?: string | null;
      body?: string | null;
      short_body?: string | null;
    }>;
  };
};

export type FaqBlock = {
  type: "faq";
  value: {
    heading?: string | null;
    items?: Array<{
      question?: string | null;
      answer?: string | null;
    }>;
  };
};

export type ProgramHighlightsBlock = {
  type: "program_highlights";
  value: {
    heading?: string | null;
    items?: Array<{
      icon_key?: string | null;
      title?: string | null;
      body?: string | null;
    }>;
  };
};

export type GalleryBlock = {
  type: "gallery";
  value: {
    heading?: string | null;
    caption?: string | null;
    images?: Array<{
      image_url?: string | null;
      url?: string | null;
      alt?: string | null;
      caption?: string | null;
    }>;
  };
};

export type CtaSectionBlock = {
  type: "cta_section";
  value: {
    heading?: string | null;
    body?: string | null;
    button_label?: string | null;
    button_url?: string | null;
  };
};

export type JourneyStepsBlock = {
  type: "journey_steps";
  value: {
    heading?: string | null;
    items?: Array<{
      title?: string | null;
      description?: string | null;
    }>;
  };
};

export type OfferBenefitsBlock = {
  type: "offer_benefits";
  value: {
    heading?: string | null;
    items?: Array<{
      title?: string | null;
      description?: string | null;
    }>;
  };
};

export type SectionBlock =
  | RichSectionBlock
  | FeatureStackBlock
  | FaqBlock
  | ProgramHighlightsBlock
  | GalleryBlock
  | CtaSectionBlock
  | JourneyStepsBlock
  | OfferBenefitsBlock
  | {
      type: string;
      value?: unknown;
    };

export type NextOccurrence = {
  start?: string | null;
  timezone?: string | null;
};

export type OfferSummary = {
  id?: number | string;
  slug?: string;
  title?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  excerpt?: string | null;
  canonical_url?: string | null;
  hero_image_url?: string | null;
  image_url?: string | null;
  featured_image?: string | null;
  next_occurrence?: NextOccurrence | string | null;
  type?: OfferType | string;
  [key: string]: unknown;
};

export type OfferDetail = {
  id?: number | string;
  slug?: string;
  type?: OfferType | string;
  title?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  subtitle?: string | null;
  excerpt?: string | null;
  body?: string | null;
  body_html?: string | null;
  canonical_url?: string | null;
  hero_image_url?: string | null;
  image_url?: string | null;
  featured_image?: string | null;
  seo_image_url?: string | null;
  media_url?: string | null;
  images?:
    | Array<{
        image_url?: string | null;
        imageUrl?: string | null;
        url?: string | null;
        src?: string | null;
        alt?: string | null;
      }>
    | null;
  trial_eligible?: boolean;
  primary_cta?: PrimaryCTA | null;
  quick_facts?: QuickFacts | null;
  schedule_cards?: ScheduleCard[] | null;
  themes?: ThemeTag[] | null;
  sections?: SectionBlock[] | null;
  occurrences?: Occurrence[] | null;
  price_options?: PriceOption[] | null;
  booking_options?: BookingOption[] | null;
  pricing_promos?: PricingPromo[] | null;
  facilitators?: Facilitator[] | null;
  tags?: Array<string | ThemeTag> | string | null;
  faq?: Array<{ question?: string | null; answer?: string | null }> | null;
  next_occurrence?: NextOccurrence | string | null;
  [key: string]: unknown;
};

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
  price_total: string | number;
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
  options?: Array<{ value?: string; label?: string } | string>;
  required?: boolean;
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

export type PrivateBookingPackageSummary = {
  token: string;
  offer_slug: string;
  offer_title: string;
  practitioner_id: number;
  practitioner_name: string;
  locale: string;
  package_option_id?: number | null;
  package_code: string;
  package_label: string;
  total_sessions: number;
  remaining_sessions: number;
  price_total: string | number;
  unit_price: string | number;
  currency: string;
  payment_note?: string | null;
  valid_until?: string | null;
  intro_call_required?: boolean;
  intro_call_completed_at?: string | null;
  unlocked_at?: string | null;
  status: string;
  bookings?: Array<{
    token: string;
    start_datetime: string;
    end_datetime: string;
    timezone: string;
    status: string;
    is_intro_call?: boolean;
  }>;
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
  start_datetime: string;
  end_datetime: string;
  timezone: string;
  duration_minutes: number;
  is_intro_call?: boolean;
  package_label: string;
  package_total: string | number;
  session_unit_price: string | number;
  currency: string;
  payment_note?: string | null;
  status: string;
  reschedule_cutoff_hours: number;
  can_reschedule?: boolean;
  can_cancel?: boolean;
  package?: PrivateBookingPackageSummary;
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
  flow_stage?: "standard" | "intro_call" | "intro_pending" | "paid_package" | "active_package" | string;
  package?: PrivateBookingPackageSummary;
};

export type CalendarItem = Record<string, unknown>;
