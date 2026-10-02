"use client";

import { useMemo, useState } from "react";
import { Download, Share2 } from "lucide-react";

export function ShareCard({
  name,
  note,
  shareText = "I'm backing Newton Papito for Roysambu Ward MCA — join the movement:",
}: {
  name?: string;
  note?: string;
  shareText?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [fallbackHint, setFallbackHint] = useState(false);

  const imageUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (note) params.set("note", note);
    const qs = params.toString();
    return `/api/supporter-card${qs ? `?${qs}` : ""}`;
  }, [name, note]);

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

  async function handleShare() {
    setBusy(true);
    setFallbackHint(false);
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], "supporter-card.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "I'm backing Newton Papito",
          text: shareText,
        });
      } else {
        // Can't attach an image via a URL scheme — download it and open
        // WhatsApp with the text pre-filled so they can attach it manually.
        triggerDownload(blob);
        setFallbackHint(true);
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${siteUrl}`)}`,
          "_blank"
        );
      }
    } catch {
      // User cancelled the share sheet — not an error worth surfacing.
    } finally {
      setBusy(false);
    }
  }

  function triggerDownload(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "supporter-card.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDownload() {
    setBusy(true);
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      triggerDownload(blob);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-campaign-navy/10 bg-white p-5">
      <p className="mb-3 text-sm font-semibold text-campaign-navy">Share your support</p>

      <div className="mb-4 overflow-hidden rounded-lg border border-campaign-navy/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Shareable supporter card" className="w-full" />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleShare}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-campaign-blue px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Share2 size={16} /> Share
        </button>
        <button
          onClick={handleDownload}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-campaign-navy/15 px-5 py-2.5 text-sm font-semibold text-campaign-navy disabled:opacity-60"
        >
          <Download size={16} /> Download
        </button>
      </div>

      {fallbackHint && (
        <p className="mt-2 text-xs text-campaign-navy/50">
          Image downloaded — attach it to the WhatsApp chat that just opened.
        </p>
      )}
    </div>
  );
}
