"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createAboutSection(formData: FormData) {
  const supabase = createClient();
  const { count } = await supabase.from("about_sections").select("*", { count: "exact", head: true });

  const { error } = await supabase.from("about_sections").insert({
    title: String(formData.get("title") || "Untitled section"),
    subtitle: String(formData.get("subtitle") || "") || null,
    content: String(formData.get("content") || "") || null,
    image_url: String(formData.get("image_url") || "") || null,
    image_position: String(formData.get("image_position") || "right"),
    display_order: count ?? 0,
    status: "draft",
    is_visible: true,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/about");
  revalidatePath("/admin/about");
  return { ok: true };
}

export async function updateAboutSection(id: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase
    .from("about_sections")
    .update({
      title: String(formData.get("title") || ""),
      subtitle: String(formData.get("subtitle") || "") || null,
      content: String(formData.get("content") || "") || null,
      image_url: String(formData.get("image_url") || "") || null,
      image_position: String(formData.get("image_position") || "right"),
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/about");
  revalidatePath("/admin/about");
  return { ok: true };
}

export async function setAboutSectionStatus(id: string, status: "draft" | "published" | "unpublished") {
  const supabase = createClient();
  await supabase.from("about_sections").update({ status }).eq("id", id);
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

export async function toggleAboutSectionVisibility(id: string, visible: boolean) {
  const supabase = createClient();
  await supabase.from("about_sections").update({ is_visible: visible }).eq("id", id);
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

export async function deleteAboutSection(id: string) {
  const supabase = createClient();
  await supabase.from("about_sections").delete().eq("id", id);
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

export async function reorderAboutSection(id: string, direction: "up" | "down") {
  const supabase = createClient();
  const { data: items } = await supabase.from("about_sections").select("id, display_order").order("display_order");
  if (!items) return;
  const index = items.findIndex((i) => i.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= items.length) return;
  const a = items[index];
  const b = items[swapWith];
  await Promise.all([
    supabase.from("about_sections").update({ display_order: b.display_order }).eq("id", a.id),
    supabase.from("about_sections").update({ display_order: a.display_order }).eq("id", b.id),
  ]);
  revalidatePath("/about");
  revalidatePath("/admin/about");
}
