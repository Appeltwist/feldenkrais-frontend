import Link from "next/link";

import AboutPeopleTrack, { type AboutPerson } from "@/components/about/AboutPeopleTrack";
import EducationAboutPage from "@/components/education/EducationAboutPage";
import ForestImageGallery from "@/components/forest/ForestImageGallery";
import RevealObserver from "@/components/motion/RevealObserver";
import { ForestPageSection, ForestPageShell } from "@/components/forest/ForestPageShell";
import { fetchSiteConfig, fetchTeachersList, type TeacherListItem } from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getEducationCenters } from "@/lib/education-content";
import {
  FOREST_ABOUT_GALLERY_IMAGES,
  getForestAboutContent,
  getForestAboutPeople,
  type ForestAboutPersonSeed,
} from "@/lib/forest-about-content";
import { getEducationTeacherProfiles } from "@/lib/education-teachers";
import { cleanDisplayText } from "@/lib/content-cleanup";
import { isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { resolveLocale } from "@/lib/i18n";
import { localizePath } from "@/lib/locale-path";
import type { LocaleCode } from "@/lib/types";

type ResolvedAboutPerson = {
  id: string;
  featured: boolean;
  href?: string;
  imageAlt: string;
  name: string;
  photoUrl?: string;
  role: string;
  summary: string;
};

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function resolveAboutPerson(
  person: ForestAboutPersonSeed,
  teacherBySlug: Map<string, TeacherListItem>,
  locale: LocaleCode,
): ResolvedAboutPerson {
  const teacher = person.localSlug ? teacherBySlug.get(person.localSlug) : undefined;

  return {
    id: person.id,
    featured: Boolean(person.featured),
    href: person.localSlug ? localizePath(locale, `/teachers/${person.localSlug}`) : undefined,
    imageAlt: person.imageAlt[locale],
    name: readString(teacher?.display_name) || person.name,
    photoUrl: person.imageUrl || readString(teacher?.photo_url),
    role: person.role[locale],
    summary: person.summary[locale],
  };
}

export default async function AboutPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale();
  const localeCode = resolveLocale(locale);
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (!siteConfig || !isForestCenter(siteConfig.centerSlug)) {
    const page = await resolveEducationNarrativePage(hostname, "about", localeCode);

    if (!page) {
      return (
        <div className="page-section">
          <h1>About</h1>
          <p>Coming soon.</p>
        </div>
      );
    }

    return (
      <EducationAboutPage
        centers={getEducationCenters(localeCode)}
        featuredTeachers={getEducationTeacherProfiles(localeCode)}
        locale={localeCode}
        page={page}
      />
    );
  }

  const teachers = await fetchTeachersList({
    hostname,
    center: siteConfig.centerSlug,
    locale: localeCode,
  }).catch(() => [] as TeacherListItem[]);

  const teacherBySlug = new Map(
    teachers
      .map((teacher) => [readString(teacher.slug), teacher] as const)
      .filter(([slug]) => Boolean(slug)),
  );

  const content = getForestAboutContent(localeCode);
  const aboutPeople = getForestAboutPeople();
  const resolvedAboutPeople = aboutPeople.map((person) => resolveAboutPerson(person, teacherBySlug, localeCode));

  // Slugs already covered by the hardcoded about people
  const coveredSlugs = new Set(aboutPeople.map((p) => p.localSlug).filter(Boolean));

  // Add API teachers not already in the about list
  const extraTeachers: ResolvedAboutPerson[] = teachers
    .filter((t) => {
      const slug = readString(t.slug);
      return slug && !coveredSlugs.has(slug) && readString(t.display_name);
    })
    .map((t) => {
      const slug = readString(t.slug);
      return {
        id: slug || String(t.id),
        featured: false,
        href: localizePath(localeCode, `/teachers/${slug}`),
        imageAlt: readString(t.display_name),
        name: readString(t.display_name),
        photoUrl: readString(t.photo_url) || undefined,
        role: readString(t.title) || (localeCode === "fr" ? "Enseignant·e" : "Teacher"),
        summary: cleanDisplayText(readString(t.short_bio)) || "",
      };
    });

  const allPeople: AboutPerson[] = [...resolvedAboutPeople, ...extraTeachers];

  return (
    <ForestPageShell className="forest-site-shell--about">
      <div className="page-section forest-about-page" id="about-motion">
        <RevealObserver scopeId="about-motion" />

        <div data-reveal="section">
          <section className="fc-intro">
            <p className="fc-intro__eyebrow">{content.hero.eyebrow}</p>
            <h1 className="fc-intro__title">{content.hero.title}</h1>
            <p className="fc-intro__subtitle">{content.hero.subtitle}</p>
          </section>
        </div>

        <div data-reveal="section">
          <section className="forest-about-story-section">
            <div className="forest-about-story-layout">
              <div className="forest-about-story-layout__image">
                <img
                  alt={localeCode === "fr" ? "Nikos et Betzabel au Forest Lighthouse" : "Nikos and Betzabel at Forest Lighthouse"}
                  loading="lazy"
                  src="/brands/forest-lighthouse/photos/forest-lighthouse-evening.jpg"
                />
              </div>
              <div className="forest-about-story-layout__text">
                <p className="forest-page-section__eyebrow">{content.story.eyebrow}</p>
                <h2 className="forest-page-section__title">{content.story.title}</h2>
                <p className="forest-page-section__subtitle">{content.story.subtitle}</p>
                {content.story.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <p className="forest-about-story-layout__aside-title">{content.story.asideTitle}</p>
                <p>{content.story.asideBody}</p>
              </div>
            </div>
          </section>
        </div>

        <div data-reveal="section">
          <ForestPageSection
            className="forest-about-practice-section"
            eyebrow={content.gallery.eyebrow}
            subtitle={content.gallery.subtitle}
            title={content.gallery.title}
          >
            <div className="forest-about-gallery">
              <ForestImageGallery alt={content.gallery.alt} images={[...FOREST_ABOUT_GALLERY_IMAGES]} />
            </div>
          </ForestPageSection>
        </div>

        <div data-reveal="section">
          <section className="forest-about-sticky-reveal">
            <div className="forest-about-sticky-reveal__lede">
              <p className="forest-page-section__eyebrow">{content.practice.eyebrow}</p>
              <h2 className="forest-page-section__title">{content.practice.title}</h2>
              <p className="forest-page-section__subtitle">{content.practice.subtitle}</p>
            </div>
            <div className="forest-about-sticky-reveal__cards" data-reveal="stagger">
              {content.practice.items.map((item) => (
                <article className="forest-content-card forest-about-practice-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div data-reveal="section">
          <section className="forest-about-people-section">
            <p className="forest-page-section__eyebrow">{content.people.eyebrow}</p>
            <h2 className="forest-page-section__title">{content.people.title}</h2>
            <p className="forest-page-section__subtitle">{content.people.subtitle}</p>
            <AboutPeopleTrack ctaLabel={content.people.viewProfileLabel} people={allPeople} />
          </section>
        </div>

        <div data-reveal="section">
          <ForestPageSection
            className="forest-about-roots-section"
            eyebrow={content.roots.eyebrow}
            subtitle={content.roots.subtitle}
            title={content.roots.title}
          >
            <div className="forest-about-roots-grid" data-reveal="stagger">
              {content.roots.items.map((item) => (
                <article className="forest-content-card forest-about-root-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </ForestPageSection>
        </div>

        <div data-reveal="section">
          <section className="forest-about-cta forest-panel">
            <p className="forest-page-section__eyebrow">{content.closing.eyebrow}</p>
            <h2 className="forest-page-section__title">{content.closing.title}</h2>
            <p className="forest-page-section__subtitle">{content.closing.body}</p>
            <div className="forest-page-hero__actions">
              {content.closing.actions.map((action) => (
                <Link
                  className={action.variant === "secondary" ? "fl-btn fl-btn--secondary" : "fl-btn"}
                  href={localizePath(localeCode, action.href)}
                  key={`${action.href}-${action.label}`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </ForestPageShell>
  );
}
