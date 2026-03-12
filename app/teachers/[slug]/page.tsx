import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import ForestImageGallery from "@/components/forest/ForestImageGallery";
import { ForestPageShell, ForestPageSection } from "@/components/forest/ForestPageShell";
import RevealObserver from "@/components/motion/RevealObserver";
import {
  ApiError,
  fetchOffers,
  fetchSiteConfig,
  fetchTeacherDetail,
  type OfferSummary,
  type TeacherDetail,
} from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { resolveLocale, getTeacherLabels, getForestPlaceholderCopy } from "@/lib/i18n";
import { localizePath } from "@/lib/locale-path";
import { isForestCenter } from "@/lib/forest-theme";
import {
  getCanonicalOfferPath,
  getFacilitatorSlug,
  getFacilitators,
  getOfferHeroImageUrl,
  getOfferType,
} from "@/lib/offers";
import type { OfferType } from "@/lib/types";

/* ── constants ── */

const TYPE_LABELS: Record<OfferType, { fr: string; en: string }> = {
  WORKSHOP: { fr: "Atelier", en: "Workshop" },
  CLASS: { fr: "Cours", en: "Class" },
  PRIVATE_SESSION: { fr: "Séance individuelle", en: "Individual session" },
  TRAINING_INFO: { fr: "Formation", en: "Training" },
};

/* ── helpers ── */

function pickStr(record: Record<string, unknown> | null | undefined, keys: string[], fallback = "") {
  if (!record) return fallback;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallback;
}

/* ── types ── */

type TeacherPageProps = {
  params: Promise<{ slug: string }>;
};

/* ── metadata ── */

export async function generateMetadata({ params }: TeacherPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  if (!siteConfig) return {};

  const requestLocale = await getRequestLocale(siteConfig.defaultLocale);
  const teacher = await fetchTeacherDetail({
    hostname,
    slug,
    center: siteConfig.centerSlug,
    locale: requestLocale,
  }).catch(() => null);

  if (!teacher) return {};

  const displayName = pickStr(teacher, ["display_name"]) || "Facilitator";
  const seoTitle = pickStr(teacher, ["seo_title"]) || `${displayName} — ${siteConfig.siteName}`;
  const seoDescription = pickStr(teacher, ["seo_description", "short_bio"]) || "";

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: teacher.photo_url ? [{ url: teacher.photo_url }] : [],
    },
  };
}

/* ── page ── */

export default async function TeacherProfilePage({ params }: TeacherPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Facilitator</h1>
        <p>Unable to load this profile right now.</p>
      </section>
    );
  }

  const requestLocale = await getRequestLocale(siteConfig.defaultLocale);
  const localeCode = resolveLocale(requestLocale);

  let teacher: TeacherDetail | null = null;
  let contentLocale = requestLocale;

  try {
    teacher = await fetchTeacherDetail({
      hostname,
      slug,
      center: siteConfig.centerSlug,
      locale: requestLocale,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      if (requestLocale !== siteConfig.defaultLocale) {
        try {
          teacher = await fetchTeacherDetail({
            hostname,
            slug,
            center: siteConfig.centerSlug,
            locale: siteConfig.defaultLocale,
          });
          contentLocale = siteConfig.defaultLocale;
        } catch (retryError) {
          if (retryError instanceof ApiError && retryError.status === 404) {
            notFound();
          }
          throw retryError;
        }
      } else {
        notFound();
      }
    } else {
      throw error;
    }
  }

  if (!teacher) {
    notFound();
  }

  /* ── extract teacher fields ── */
  const displayName = pickStr(teacher, ["display_name"]) || "Facilitator";
  const title = pickStr(teacher, ["title"]);
  const bio = pickStr(teacher, ["bio"]);
  const photoUrl = pickStr(teacher, ["photo_url"]);
  const galleryUrls = Array.isArray(teacher.gallery_urls) ? teacher.gallery_urls.filter(Boolean) : [];
  const quote = pickStr(teacher, ["quote"]);

  /* ── fetch related offers taught by this teacher ── */
  const allOffers = await fetchOffers({
    hostname,
    center: siteConfig.centerSlug,
    locale: contentLocale,
  }).catch(() => [] as OfferSummary[]);

  const teacherOffers = allOffers.filter((offer) => {
    const facilitators = getFacilitators(offer as Record<string, unknown>);
    return facilitators.some((f) => getFacilitatorSlug(f) === slug);
  });

  const labels = getTeacherLabels(localeCode);
  const placeholderCopy = getForestPlaceholderCopy(localeCode);

  /* ── Forest Lighthouse layout ── */
  if (isForestCenter(siteConfig.centerSlug)) {
    return (
      <ForestPageShell className="forest-site-shell--teacher">
        <section className="page-section forest-teacher-page" id="teacher-motion">
          <RevealObserver scopeId="teacher-motion" />

          {/* ── TWO-COLUMN LAYOUT ── */}
          <div className="forest-teacher-columns">
            {/* LEFT: identity + quote + bio */}
            <div className="forest-teacher-columns__left">
              <div className="forest-teacher-identity" data-reveal="section">
                <Link
                  className="forest-teacher-identity__back"
                  href={localizePath(localeCode, "/workshops")}
                >
                  &#8249; {labels.backToWorkshops}
                </Link>
                {photoUrl ? (
                  <img
                    alt={displayName}
                    className="forest-teacher-identity__photo"
                    loading="eager"
                    src={photoUrl}
                  />
                ) : (
                  <div aria-hidden="true" className="forest-teacher-identity__photo-placeholder">
                    <svg fill="currentColor" height="64" viewBox="0 0 24 24" width="64">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
                <p className="forest-teacher-identity__eyebrow">{labels.yourGuide}</p>
                <h1 className="forest-teacher-identity__name">{displayName}</h1>
                {title ? <p className="forest-teacher-identity__title">{title}</p> : null}
              </div>

              {quote ? (
                <div className="forest-teacher-quote" data-reveal="section">
                  <blockquote className="forest-teacher-quote__block">
                    <span aria-hidden="true" className="forest-teacher-quote__mark">&ldquo;</span>
                    <p>{quote}</p>
                  </blockquote>
                </div>
              ) : null}

              {bio ? (
                <ForestPageSection eyebrow={labels.biography} className="forest-teacher-bio-section">
                  <div
                    className="forest-teacher-bio rich-text"
                    dangerouslySetInnerHTML={{ __html: bio }}
                    data-reveal="section"
                  />
                </ForestPageSection>
              ) : null}
            </div>

            {/* RIGHT: gallery */}
            {galleryUrls.length > 0 ? (
              <div className="forest-teacher-columns__right" data-reveal="section">
                <ForestImageGallery images={galleryUrls} alt={displayName} />
              </div>
            ) : null}
          </div>

          {/* ── UPCOMING WORKSHOPS ── */}
          {teacherOffers.length > 0 ? (
            <section className="forest-discover-slider" data-reveal="section">
              <p className="fp-chapter__eyebrow">
                {localeCode === "fr" ? "Explorer" : "Explore"}
              </p>
              <h2 className="forest-discover-slider__heading">{labels.upcomingWorkshops}</h2>
              <div className="forest-discover-slider__track">
                {teacherOffers.slice(0, 6).map((ro) => {
                  const roType = (ro.type ?? "WORKSHOP").toString().toUpperCase();
                  const roLabel =
                    TYPE_LABELS[roType as OfferType]?.[localeCode] ?? TYPE_LABELS.WORKSHOP[localeCode];
                  const roTitle = ro.title ?? "Offer";
                  const roExcerpt = typeof ro.excerpt === "string" ? ro.excerpt : "";
                  const roImage = getOfferHeroImageUrl(ro as Record<string, unknown>);
                  const roPath = getCanonicalOfferPath(ro);
                  return (
                    <Link
                      className="forest-discover-slider__card"
                      href={localizePath(localeCode, roPath)}
                      key={ro.slug}
                    >
                      {roImage ? (
                        <img
                          alt={roTitle}
                          className="forest-discover-slider__img"
                          loading="lazy"
                          src={roImage}
                        />
                      ) : (
                        <div className="forest-discover-slider__img-placeholder" />
                      )}
                      <div className="forest-discover-slider__body">
                        <small>{roLabel}</small>
                        <strong>{roTitle}</strong>
                        {roExcerpt ? <p>{roExcerpt}</p> : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}

          {/* ── NEWSLETTER CTA ── */}
          <section className="forest-newsletter-cta" data-reveal="section">
            <p className="forest-newsletter-cta__eyebrow">
              {localeCode === "fr" ? "Communauté" : "Community"}
            </p>
            <h2 className="forest-newsletter-cta__heading">{placeholderCopy.newsletterTitle}</h2>
            <p className="forest-newsletter-cta__body">{placeholderCopy.newsletterBody}</p>
            <div className="forest-newsletter-cta__form">
              <input
                aria-label={placeholderCopy.newsletterPlaceholder}
                placeholder={placeholderCopy.newsletterPlaceholder}
              />
              <button type="button">{placeholderCopy.newsletterCta}</button>
            </div>
          </section>
        </section>
      </ForestPageShell>
    );
  }

  /* ── generic fallback ── */
  return (
    <section className="page-section">
      <h1>{displayName}</h1>
      {title ? <p>{title}</p> : null}
      {bio ? <div className="rich-text" dangerouslySetInnerHTML={{ __html: bio }} /> : null}
    </section>
  );
}
