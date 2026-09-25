"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createHomepageSection(formData: FormData) {
  const supabase = createClient();
  const { count } = await supabase.from("homepage_sections").select("*", { count: "exact", head: true });

  const key = String(formData.get("section_key") || "").trim() || `section_${Date.now()}`;
  const { error } = await supabase.from("homepage_sections").insert({
    section_key: key,
    title: String(formData.get("title") || "") || null,
    subtitle: String(formData.get("subtitle") || "") || null,
    description: String(formData.get("description") || "") || null,
    button_text: String(formData.get("button_text") || "") || null,
    button_url: String(formData.get("button_url") || "") || null,
    display_order: count ?? 0,
    status: "draft",
    is_visible: true,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { ok: true };
}

export async function updateHomepageSection(id: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase
    .from("homepage_sections")
    .update({
      title: String(formData.get("title") || "") || null,
      subtitle: String(formData.get("subtitle") || "") || null,
      description: String(formData.get("description") || "") || null,
      image_url: String(formData.get("image_url") || "") || null,
      button_text: String(formData.get("button_text") || "") || null,
      button_url: String(formData.get("button_url") || "") || null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { ok: true };
}

export async function setHomepageSectionStatus(id: string, status: "draft" | "published" | "unpublished") {
  const supabase = createClient();
  await supabase.from("homepage_sections").update({ status }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/homepage");
}

export async function toggleHomepageSectionVisibility(id: string, visible: boolean) {
  const supabase = createClient();
  await supabase.from("homepage_sections").update({ is_visible: visible }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/homepage");
}

export async function deleteHomepageSection(id: string) {
  const supabase = createClient();
  await supabase.from("homepage_sections").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/homepage");
}

export async function reorderHomepageSection(id: string, direction: "up" | "down") {
  const supabase = createClient();
  const { data: items } = await supabase.from("homepage_sections").select("id, display_order").order("display_order");
  if (!items) return;
  const index = items.findIndex((i) => i.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= items.length) return;
  const a = items[index];
  const b = items[swapWith];
  await Promise.all([
    supabase.from("homepage_sections").update({ display_order: b.display_order }).eq("id", a.id),
    supabase.from("homepage_sections").update({ display_order: a.display_order }).eq("id", b.id),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/homepage");
}
