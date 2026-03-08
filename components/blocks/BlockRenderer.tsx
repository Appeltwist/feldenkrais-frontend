import { getOfferLabels } from "@/lib/i18n";
import type { LocaleCode, SectionBlock } from "@/lib/types";

type BlockRendererProps = {
  blocks: SectionBlock[];
  locale: LocaleCode;
};

type RawRecord = Record<string, unknown>;

function asRecord(value: unknown): RawRecord | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as RawRecord;
  }

  return null;
}

function pickString(source: RawRecord | null, keys: string[], fallback = "") {
  if (!source) {
    return fallback;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return fallback;
}

function asRecordList(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as RawRecord[];
  }

  return value.map(asRecord).filter((item): item is RawRecord => item !== null);
}

function asStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => Boolean(item));
}

export default function BlockRenderer({ blocks, locale }: BlockRendererProps) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  const labels = getOfferLabels(locale);
  const questionFallback = locale === "fr" ? "Question" : "Question";

  return (
    <div className="block-renderer">
      {blocks.map((block, index) => {
        const blockRecord = asRecord(block);
        const type = pickString(blockRecord, ["type"]);
        const value = asRecord(blockRecord?.value);
        const heading = pickString(value, ["heading"]);
        const key = `${type || "block"}-${index}`;

        if (type === "rich_section") {
          const body = pickString(value, ["body", "text", "content"]);
          if (!heading && !body) {
            return null;
          }

          return (
            <section className="content-block" key={key}>
              {heading ? <h2>{heading}</h2> : null}
              {body ? <div className="rich-text" dangerouslySetInnerHTML={{ __html: body }} /> : null}
            </section>
          );
        }

        if (type === "feature_stack") {
          const items = asRecordList(value?.items);
          if (!heading && items.length === 0) {
            return null;
          }

          return (
            <section className="content-block" key={key}>
              {heading ? <h2>{heading}</h2> : null}
              <div className="feature-stack">
                {items.map((item, itemIndex) => {
                  const title = pickString(item, ["title", "heading", "name"]);
                  const body = pickString(item, ["short_body", "body", "description"]);
                  if (!title && !body) {
                    return null;
                  }

                  return (
                    <article className="feature-stack__item" key={`${key}-feature-${itemIndex}`}>
                      {title ? <h3>{title}</h3> : null}
                      {body ? <p>{body}</p> : null}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        }

        if (type === "faq") {
          const items = asRecordList(value?.items);
          if (!heading && items.length === 0) {
            return null;
          }

          return (
            <section className="content-block" key={key}>
              {heading ? <h2>{heading}</h2> : null}
              <div className="faq-list">
                {items.map((item, itemIndex) => {
                  const question = pickString(item, ["question", "title", "heading"]);
                  const answer = pickString(item, ["answer", "body", "text"]);
                  if (!question && !answer) {
                    return null;
                  }

                  return (
                    <details key={`${key}-faq-${itemIndex}`}>
                      <summary>{question || questionFallback}</summary>
                      {answer ? <div dangerouslySetInnerHTML={{ __html: answer }} /> : null}
                    </details>
                  );
                })}
              </div>
            </section>
          );
        }

        if (type === "program_highlights") {
          const items = asRecordList(value?.items);
          if (!heading && items.length === 0) {
            return null;
          }

          return (
            <section className="content-block" key={key}>
              {heading ? <h2>{heading}</h2> : null}
              <div className="program-highlights">
                {items.map((item, itemIndex) => {
                  const iconKey = pickString(item, ["icon_key", "icon", "iconKey"]);
                  const title = pickString(item, ["title", "heading", "name"]);
                  const body = pickString(item, ["body", "description", "text"]);

                  if (!iconKey && !title && !body) {
                    return null;
                  }

                  return (
                    <article className="program-highlights__item" key={`${key}-highlight-${itemIndex}`}>
                      {iconKey ? <small className="icon-key">{iconKey}</small> : null}
                      {title ? <h3>{title}</h3> : null}
                      {body ? <p>{body}</p> : null}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        }

        if (type === "gallery") {
          const imageRecords = asRecordList(value?.images ?? value?.items);
          const imageUrls = asStringList(value?.images);

          if (!heading && imageRecords.length === 0 && imageUrls.length === 0) {
            return null;
          }

          return (
            <section className="content-block" key={key}>
              {heading ? <h2>{heading}</h2> : null}
              <div className="gallery-grid">
                {imageRecords.map((image, itemIndex) => {
                  const imageUrl = pickString(image, ["image_url", "url", "src"]);
                  const alt = pickString(image, ["alt", "title"], "Gallery image");
                  const caption = pickString(image, ["caption", "legend"]);

                  if (!imageUrl) {
                    return null;
                  }

                  return (
                    <figure key={`${key}-image-${itemIndex}`}>
                      <img alt={alt} className="gallery-image" loading="lazy" src={imageUrl} />
                      {caption ? <figcaption>{caption}</figcaption> : null}
                    </figure>
                  );
                })}
                {imageUrls.map((imageUrl, itemIndex) => (
                  <img
                    alt="Gallery image"
                    className="gallery-image"
                    key={`${key}-image-url-${itemIndex}`}
                    loading="lazy"
                    src={imageUrl}
                  />
                ))}
              </div>
              {pickString(value, ["caption"]) ? <p>{pickString(value, ["caption"])}</p> : null}
            </section>
          );
        }

        if (type === "journey_steps") {
          const rawItems = asRecordList(value?.items);
          /* Wagtail ListBlock wraps each item as {type:"item", value:{…}} — unwrap */
          const items = rawItems.map((item) => {
            const inner = asRecord(item.value);
            return inner ?? item;
          });
          if (!heading && items.length === 0) {
            return null;
          }

          return (
            <section className="content-block" key={key}>
              {heading ? <h2>{heading}</h2> : null}
              <div
                className="fl-steps"
                style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 5)}, 1fr)` }}
              >
                {items.map((item, itemIndex) => {
                  const title = pickString(item, ["title", "heading", "name"]);
                  const description = pickString(item, ["description", "body", "text"]);
                  return (
                    <div className="fl-step" key={`${key}-step-${itemIndex}`}>
                      <div className="fl-step-num">{itemIndex + 1}</div>
                      <div className="fl-step-text">
                        {title ? <strong>{title}</strong> : null}
                        {description ? (
                          <div
                            className="fl-step-desc rich-text"
                            dangerouslySetInnerHTML={{ __html: description }}
                          />
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        if (type === "cta_section") {
          const body = pickString(value, ["body", "text", "content"]);
          const buttonLabel = pickString(value, ["button_label", "buttonLabel"], labels.book);
          const buttonUrl = pickString(value, ["button_url", "buttonUrl", "url"]);

          if (!heading && !body && !buttonUrl) {
            return null;
          }

          return (
            <section className="content-block cta-section" key={key}>
              {heading ? <h2>{heading}</h2> : null}
              {body ? <div className="rich-text" dangerouslySetInnerHTML={{ __html: body }} /> : null}
              {buttonUrl ? (
                <p>
                  <a className="button-link" href={buttonUrl} rel="noreferrer" target="_blank">
                    {buttonLabel}
                  </a>
                </p>
              ) : null}
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
