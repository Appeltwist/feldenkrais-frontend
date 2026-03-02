"use client";

import { useState } from "react";

type OfferActionBarProps = {
  title: string;
  canonicalUrl?: string;
  icsUrl?: string;
  mediaUrl?: string;
};

function normalizeUrl(value: string | undefined) {
  if (!value) {
    return "";
  }
  return value.trim();
}

export default function OfferActionBar({ title, canonicalUrl, icsUrl, mediaUrl }: OfferActionBarProps) {
  const [shareMessage, setShareMessage] = useState("");

  async function onShare() {
    const shareUrl = normalizeUrl(canonicalUrl);
    if (!shareUrl) {
      setShareMessage("No share URL available.");
      return;
    }

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title,
          url: shareUrl,
        });
        setShareMessage("Shared.");
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage("Link copied.");
        return;
      }

      setShareMessage("Sharing is not available on this device.");
    } catch {
      setShareMessage("Unable to share right now.");
    }
  }

  return (
    <div className="offer-action-bar">
      <button className="text-link offer-action-bar__button" onClick={() => void onShare()} type="button">
        Share
      </button>
      {icsUrl ? (
        <a className="text-link" href={icsUrl}>
          Add to calendar
        </a>
      ) : null}
      {mediaUrl ? (
        <a className="text-link" href={mediaUrl} rel="noreferrer" target="_blank">
          Jump to media
        </a>
      ) : null}
      {shareMessage ? <span className="offer-action-bar__status">{shareMessage}</span> : null}
    </div>
  );
}
