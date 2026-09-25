"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Trash2, Eye, EyeOff, Star, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  createGalleryCategory,
  deleteGalleryCategory,
  createGalleryItem,
  toggleGalleryItem,
  toggleGalleryItemFeatured,
  deleteGalleryItem,
} from "@/app/actions/gallery";
import type { GalleryItem } from "@/lib/types";

interface Category {
  id: string;
  name: string;
}

function Uploader({ categories }: { categories: Category[] }) {
  const [isUploading, setIsUploading] = useState(false);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setIsUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const path = `gallery/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);
      const res = await createGalleryItem({
        image_url: publicUrl.publicUrl,
        storage_path: path,
        filename: file.name,
        category_id: categoryId || null,
        caption,
      });
      if (!res.ok) setError(res.error ?? "Upload succeeded but saving the record failed.");
      setCaption("");
    } catch (e: any) {
      setError(e.message ?? "Upload failed. Confirm the 'media' Storage bucket exists and is public.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-end gap-3 border-b border-campaign-navy/10 pb-6">
      <div>
        <label className="admin-label">Category</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="admin-field">
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="admin-label">Caption</label>
        <input value={caption} onChange={(e) => setCaption(e.target.value)} className="admin-field" />
      </div>
      <label className="admin-btn-primary flex cursor-pointer items-center gap-2">
        <Upload size={16} /> {isUploading ? "Uploading…" : "Upload Image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </label>
      {error && <p className="w-full text-sm text-campaign-red">{error}</p>}
    </div>
  );
}

function CategoryManager({ categories }: { categories: Category[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mb-6 border-b border-campaign-navy/10 pb-6">
      <p className="admin-label">Categories</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {categories.map((c) => (
          <span key={c.id} className="flex items-center gap-1 rounded-full bg-campaign-navy/5 px-3 py-1 text-sm text-campaign-navy">
            {c.name}
            <button onClick={() => startTransition(() => deleteGalleryCategory(c.id))} className="text-campaign-navy/40 hover:text-campaign-red">×</button>
          </span>
        ))}
      </div>
      <form
        action={(fd) => startTransition(async () => { await createGalleryCategory(fd); (document.getElementById("cat-add-form") as HTMLFormElement)?.reset(); })}
        id="cat-add-form"
        className="flex gap-2"
      >
        <input name="name" placeholder="New category name" required className="admin-field w-56" />
        <button type="submit" disabled={isPending} className="admin-btn-secondary">+ Add</button>
      </form>
    </div>
  );
}

export function GalleryManager({ categories, items }: { categories: Category[]; items: GalleryItem[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      <CategoryManager categories={categories} />
      <Uploader categories={categories} />

      {items.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border border-campaign-navy/10">
              <Image src={item.image_url} alt={item.caption ?? ""} fill className="object-cover" />
              <div className="absolute inset-0 flex items-start justify-end gap-1 bg-black/0 p-1.5 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
                <button onClick={() => startTransition(() => toggleGalleryItemFeatured(item.id, !item.is_featured))} className="rounded bg-white/90 p-1">
                  <Star size={14} fill={item.is_featured ? "#ED1111" : "none"} className="text-campaign-red" />
                </button>
                <button onClick={() => startTransition(() => toggleGalleryItem(item.id, !item.is_visible))} className="rounded bg-white/90 p-1">
                  {item.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => { if (confirm("Delete this image?")) startTransition(() => deleteGalleryItem(item.id)); }} className="rounded bg-white/90 p-1 text-campaign-red">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
