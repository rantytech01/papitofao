"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createGalleryCategory(formData: FormData) {
  const supabase = createClient();
  const { count } = await supabase.from("gallery_categories").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("gallery_categories").insert({
    name: String(formData.get("name") || ""),
    display_order: count ?? 0,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { ok: true };
}

export async function deleteGalleryCategory(id: string) {
  const supabase = createClient();
  await supabase.from("gallery_categories").delete().eq("id", id);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function createGalleryItem(input: {
  image_url: string;
  storage_path: string;
  filename: string;
  category_id: string | null;
  caption?: string;
}) {
  const supabase = createClient();

  const { data: media, error: mediaError } = await supabase
    .from("media_library")
    .insert({
      filename: input.filename,
      url: input.image_url,
      storage_path: input.storage_path,
      type: "image",
      category: "gallery",
    })
    .select()
    .single();
  if (mediaError) return { ok: false, error: mediaError.message };

  const { count } = await supabase.from("gallery_items").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("gallery_items").insert({
    media_id: media.id,
    image_url: input.image_url,
    caption: input.caption || null,
    category_id: input.category_id,
    is_visible: true,
    display_order: count ?? 0,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { ok: true };
}

export async function toggleGalleryItem(id: string, visible: boolean) {
  const supabase = createClient();
  await supabase.from("gallery_items").update({ is_visible: visible }).eq("id", id);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function toggleGalleryItemFeatured(id: string, featured: boolean) {
  const supabase = createClient();
  await supabase.from("gallery_items").update({ is_featured: featured }).eq("id", id);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryItem(id: string) {
  const supabase = createClient();
  await supabase.from("gallery_items").delete().eq("id", id);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}
