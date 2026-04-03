import { notFound } from "next/navigation";

import { ForestPageShell } from "@/components/forest/ForestPageShell";
import { getOrigin } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { fetchNewsletterDocument } from "@/lib/newsletter-html";

type NewsletterDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewsletterDetailPage({ params }: NewsletterDetailPageProps) {
  const { slug } = await params;
  const locale = await getRequestLocale("en");
  const requestOrigin = await getOrigin();
  const document = await fetchNewsletterDocument(locale, requestOrigin, slug);

  if (!document) {
    notFound();
  }

  return (
    <ForestPageShell className="forest-newsletter-page forest-newsletter-page--detail">
      {document.headHtml ? <div dangerouslySetInnerHTML={{ __html: document.headHtml }} /> : null}
      <section className="forest-newsletter-page__frame forest-panel">
        <div className="forest-newsletter-page__body" dangerouslySetInnerHTML={{ __html: document.bodyHtml }} />
      </section>
    </ForestPageShell>
  );
}
