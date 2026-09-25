"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Trash2, Upload, Copy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { recordMediaUpload, deleteMediaItem } from "@/app/actions/media";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: string | null;
  category: string | null;
}

export function MediaLibrary({ items }: { items: MediaItem[] }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleFile(file: File) {
    setIsUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const path = `library/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);

      const res = await recordMediaUpload({
        filename: file.name,
        url: publicUrl.publicUrl,
        storage_path: path,
        type: file.type.startsWith("image/") ? "image" : "document",
      });
      if (!res.ok) setError(res.error ?? "Saved the file but the record failed.");
    } catch (e: any) {
      setError(e.message ?? "Upload failed. Confirm the 'media' Storage bucket exists and is public.");
    } finally {
      setIsUploading(false);
    }
  }

  function copyUrl(id: string, url: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="admin-card">
      <div className="mb-6 border-b border-campaign-navy/10 pb-6">
        <label className="admin-btn-primary flex w-fit cursor-pointer items-center gap-2">
          <Upload size={16} /> {isUploading ? "Uploading…" : "Upload File"}
          <input
            type="file"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </label>
        {error && <p className="mt-2 text-sm text-campaign-red">{error}</p>}
        <p className="mt-2 text-xs text-campaign-navy/50">
          Copy a file&apos;s URL and paste it into any admin form (candidate photo, logos, news images…).
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {items.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border border-campaign-navy/10 bg-campaign-navy/5">
              {item.type === "image" ? (
                <Image src={item.url} alt={item.filename} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center p-2 text-center text-xs text-campaign-navy/60">
                  {item.filename}
                </div>
              )}
              <div className="absolute inset-0 flex items-start justify-end gap-1 bg-black/0 p-1.5 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
                <button onClick={() => copyUrl(item.id, item.url)} className="rounded bg-white/90 p-1">
                  <Copy size={14} />
                </button>
                <button onClick={() => { if (confirm("Delete this file?")) startTransition(() => deleteMediaItem(item.id)); }} className="rounded bg-white/90 p-1 text-campaign-red">
                  <Trash2 size={14} />
                </button>
              </div>
              {copiedId === item.id && (
                <span className="absolute bottom-1 left-1 rounded bg-campaign-navy px-1.5 py-0.5 text-[10px] text-white">Copied</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
