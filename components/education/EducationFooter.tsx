"use client";

import Image from "next/image";

import { resolveLocale } from "@/lib/i18n";
import { localizePath } from "@/lib/locale-path";

type FooterLink = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

type FooterGroup = {
  title: string;
  links: FooterLink[];
};

const FOOTER_LOGO_URL = "/brands/feldenkrais-education/footer-feldenkrais-education-logo.png";
const QUALIOPI_LOGO_URL = "/brands/feldenkrais-education/footer-qualiopi.png";
const BRUSSELS_LOGO_URL = "/brands/feldenkrais-education/footer-bruxelles-economie.jpg";
const CERTIFICATE_URL =
  "https://feldenkrais-education.com/wp-content/uploads/sites/15/2025/03/Certificat-Qualiopi-SAS-FELDENKRAIS-EDUCATION-copie.pdf";
const INTERNAL_RULES_URL =
  "https://ern6sdee9k2.exactdn.com/wp-content/uploads/sites/15/2022/04/REGLEMENT-INTERIEUR_2022.pdf";
const PRIVACY_URL = "https://feldenkrais-education.com/politique-de-confidentialite/";

const CONTACT_LINES = [
  { label: "info@felded.com", href: "mailto:info@felded.com" },
  { label: "FR +33 6 82 21 61 74", href: "tel:+33682216174" },
  { label: "BE +32 485 72 68 37", href: "tel:+32485726837" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/feldenkraiseducation/" },
  { label: "Instagram", href: "https://www.instagram.com/feldenkraiseducation/" },
  { label: "YouTube", href: "https://youtube.com/channel/UC3xG4shAcoa3fK8MFwRKTjw" },
];

const PROGRAMME_LINKS: FooterLink[] = [
  {
    label: "Fiche Programme Cantal",
    href: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2025/02/C5_Fiche-programme.pdf",
    openInNewTab: true,
  },
  {
    label: "Fiche programme Paris",
    href: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2025/01/Paris14_Fiche-programme-1.pdf",
    openInNewTab: true,
  },
  {
    label: "Fiche programme Bruxelles",
    href: "https://feldenkrais-education.com/wp-content/uploads/sites/15/2025/02/B4_Fiche-programme.pdf",
    openInNewTab: true,
  },
];

function ExternalAwareLink({
  href,
  label,
  className,
  openInNewTab,
}: {
  href: string;
  label: string;
  className?: string;
  openInNewTab?: boolean;
}) {
  const external = /^(https?:|mailto:|tel:)/.test(href);

  return (
    <a
      className={className}
      href={href}
      rel={external || openInNewTab ? "noreferrer" : undefined}
      target={external || openInNewTab ? "_blank" : undefined}
    >
      {label}
    </a>
  );
}

function SocialGlyph({ label }: { label: string }) {
  if (label === "Facebook") {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <path
          d="M13.4 20V12.7H15.85L16.2 9.85H13.4V8.02C13.4 7.2 13.62 6.64 14.8 6.64H16.3V4.08C15.57 4 14.84 3.96 14.1 3.96C11.93 3.96 10.45 5.3 10.45 7.76V9.85H8V12.7H10.45V20H13.4Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (label === "Instagram") {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <rect height="14" rx="4.5" stroke="currentColor" strokeWidth="1.8" width="14" x="5" y="5" />
        <circle cx="12" cy="12" r="3.3" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16.8" cy="7.3" fill="currentColor" r="1.1" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <rect fill="currentColor" height="12" rx="3.2" width="18" x="3" y="6" />
      <path d="M10 9.2L15.2 12L10 14.8V9.2Z" fill="#f7f1e8" />
    </svg>
  );
}

function buildFooterGroups(locale: string): FooterGroup[] {
  const isFr = resolveLocale(locale) === "fr";

  return [
    {
      title: isFr ? "À propos" : "About",
      links: [
        { label: isFr ? "Les intervenants" : "Teachers", href: localizePath(locale, "/teachers") },
        { label: isFr ? "Presse" : "Press", href: localizePath(locale, "/press") },
        { label: isFr ? "L’équipe" : "The team", href: localizePath(locale, "/team") },
        {
          label: isFr ? "Feldenkrais Education" : "Feldenkrais Education",
          href: localizePath(locale, "/about"),
        },
      ],
    },
    {
      title: isFr ? "Liens rapides" : "Quick links",
      links: [
        { label: isFr ? "Vidéos" : "Videos", href: localizePath(locale, "/videos") },
        {
          label: isFr ? "Trouver un praticien" : "Find a practitioner",
          href: localizePath(locale, "/find-a-practitioner"),
        },
        {
          label: isFr ? "Une journée dans la formation" : "A day in training",
          href: localizePath(locale, "/day-in-training"),
        },
        { label: isFr ? "Infolettre" : "Newsletter", href: localizePath(locale, "/newsletter") },
      ],
    },
    {
      title: isFr ? "Outils" : "Tools",
      links: [
        { label: isFr ? "Nous Contacter" : "Contact us", href: localizePath(locale, "/contact") },
        { label: isFr ? "Réclamation" : "Complaints", href: localizePath(locale, "/complaints") },
        { label: "CGV", href: localizePath(locale, "/terms") },
        {
          label: isFr ? "Règlement Intérieur" : "Internal rules",
          href: INTERNAL_RULES_URL,
          openInNewTab: true,
        },
        { label: isFr ? "Financement" : "Financing", href: localizePath(locale, "/financing") },
        {
          label: isFr ? "Comment financer ma formation ?" : "How can I finance my training?",
          href: localizePath(locale, "/financing"),
        },
      ],
    },
  ];
}

export default function EducationFooter({ locale }: { locale: string }) {
  const footerGroups = buildFooterGroups(locale);

  return (
    <footer className="education-footer">
      <div className="education-footer__shell">
        <div className="education-footer__top">
          <div className="education-footer__socials" aria-label="Social media">
            {SOCIAL_LINKS.map((social) => (
              <a
                aria-label={social.label}
                className="education-footer__social-link"
                href={social.href}
                key={social.label}
                rel="noreferrer"
                target="_blank"
              >
                <SocialGlyph label={social.label} />
              </a>
            ))}
          </div>

          <div className="education-footer__contact-summary">
            {CONTACT_LINES.map((line) => (
              <a className="education-footer__contact-line" href={line.href} key={line.label}>
                {line.label}
              </a>
            ))}
          </div>
        </div>

        <div className="education-footer__main">
          <div className="education-footer__content-grid">
            <div className="education-footer__groups">
              {footerGroups.map((group) => (
                <section className="education-footer__group" key={group.title}>
                  <h2>{group.title}</h2>
                  <ul>
                    {group.links.map((link) => (
                      <li key={`${group.title}-${link.label}`}>
                        <ExternalAwareLink
                          href={link.href}
                          label={link.label}
                          openInNewTab={link.openInNewTab}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <section className="education-footer__documents" aria-label="Programme documents">
              <ul>
                {PROGRAMME_LINKS.map((link) => (
                  <li key={link.label}>
                    <ExternalAwareLink
                      className="education-footer__document-link"
                      href={link.href}
                      label={link.label}
                      openInNewTab={link.openInNewTab}
                    />
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="education-footer__compliance">
            <Image
              alt="Feldenkrais Education"
              className="education-footer__compliance-logo"
              height={300}
              priority={false}
              src={FOOTER_LOGO_URL}
              width={932}
            />

            <p className="education-footer__compliance-copy">Le site Cantal est certifié Qualiopi</p>

            <Image
              alt="La certification qualité a été délivrée au titre de la catégorie suivante : ACTIONS DE FORMATION"
              className="education-footer__qualiopi-logo"
              height={339}
              priority={false}
              src={QUALIOPI_LOGO_URL}
              width={634}
            />

            <p className="education-footer__compliance-copy">
              La certification qualité a été délivrée au titre de la catégorie : ACTIONS DE FORMATION
            </p>

            <ExternalAwareLink
              className="education-footer__certificate-link"
              href={CERTIFICATE_URL}
              label="> Certificat Qualiopi"
              openInNewTab
            />

            <p className="education-footer__privacy">
              <ExternalAwareLink href={PRIVACY_URL} label="Politique de confidentialité" openInNewTab />
              {" © 2022 Feldenkrais Education |"}
            </p>

            <Image
              alt="Bruxelles Économie et Emploi"
              className="education-footer__brussels-logo"
              height={73}
              priority={false}
              src={BRUSSELS_LOGO_URL}
              width={287}
            />
          </aside>
        </div>
      </div>
    </footer>
  );
}
