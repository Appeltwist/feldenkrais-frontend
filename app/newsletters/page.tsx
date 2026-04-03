import { notFound } from "next/navigation";

import { ForestPageShell } from "@/components/forest/ForestPageShell";
import { fetchNewsletterDocument } from "@/lib/newsletter-html";
import { getOrigin } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function NewsletterArchivePage() {
  const locale = await getRequestLocale("en");
  const requestOrigin = await getOrigin();
  const document = await fetchNewsletterDocument(locale, requestOrigin);

  if (!document) {
    notFound();
  }

  return (
    <ForestPageShell className="forest-newsletter-page forest-newsletter-page--archive">
      {document.headHtml ? <div dangerouslySetInnerHTML={{ __html: document.headHtml }} /> : null}
      <section className="forest-newsletter-page__frame forest-newsletter-page__frame--archive forest-panel">
        <div className="forest-newsletter-page__body" dangerouslySetInnerHTML={{ __html: document.bodyHtml }} />
      </section>
    </ForestPageShell>
  );
}
