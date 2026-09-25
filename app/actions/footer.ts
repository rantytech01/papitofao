"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createFooterSection(formData: FormData) {
  const supabase = createClient();
  const { count } = await supabase.from("footer_sections").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("footer_sections").insert({
    heading: String(formData.get("heading") || "") || null,
    content: String(formData.get("content") || "") || null,
    display_order: count ?? 0,
    is_visible: true,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/footer");
  return { ok: true };
}

export async function updateFooterSection(id: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("footer_sections")
    .update({
      heading: String(formData.get("heading") || "") || null,
      content: String(formData.get("content") || "") || null,
    })
    .eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/footer");
  return { ok: true };
}

export async function toggleFooterSection(id: string, visible: boolean) {
  const supabase = createClient();
  await supabase.from("footer_sections").update({ is_visible: visible }).eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/footer");
}

export async function deleteFooterSection(id: string) {
  const supabase = createClient();
  await supabase.from("footer_sections").delete().eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/footer");
}
