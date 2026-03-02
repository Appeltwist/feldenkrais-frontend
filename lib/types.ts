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

export type ScheduleCard = {
  date_label?: string | null;
  start_datetime?: string | null;
  end_datetime?: string | null;
  timezone?: string | null;
};

export type ThemeTag = {
  id: number | string;
  name: string;
};

export type Occurrence = {
  start?: string | null;
  end?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  timezone?: string | null;
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

export type Facilitator = {
  id?: number | string;
  name?: string | null;
  full_name?: string | null;
  title?: string | null;
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

export type SectionBlock =
  | RichSectionBlock
  | FeatureStackBlock
  | FaqBlock
  | ProgramHighlightsBlock
  | GalleryBlock
  | CtaSectionBlock
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
  excerpt?: string | null;
  next_occurrence?: NextOccurrence | string | null;
  type?: OfferType | string;
  [key: string]: unknown;
};

export type OfferDetail = {
  id?: number | string;
  slug?: string;
  type?: OfferType | string;
  title?: string;
  subtitle?: string | null;
  excerpt?: string | null;
  body?: string | null;
  body_html?: string | null;
  canonical_url?: string | null;
  primary_cta?: PrimaryCTA | null;
  quick_facts?: QuickFacts | null;
  schedule_cards?: ScheduleCard[] | null;
  themes?: ThemeTag[] | null;
  sections?: SectionBlock[] | null;
  occurrences?: Occurrence[] | null;
  price_options?: PriceOption[] | null;
  facilitators?: Facilitator[] | null;
  tags?: Array<string | ThemeTag> | string | null;
  next_occurrence?: NextOccurrence | string | null;
  [key: string]: unknown;
};

export type CalendarItem = Record<string, unknown>;
