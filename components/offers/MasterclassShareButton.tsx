"use client";

import { useState } from "react";

type MasterclassShareButtonProps = {
  label: string;
  copiedLabel: string;
  title: string;
  url: string;
};

export default function MasterclassShareButton({
  label,
  copiedLabel,
  title,
  url,
}: MasterclassShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl = url ? new URL(url, window.location.origin).toString() : window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
        return;
      } catch {
        // Fall through to clipboard copy.
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button className="neuro-masterclass-hero__quick-link" onClick={handleShare} type="button">
      <span aria-hidden="true">✈</span>
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
