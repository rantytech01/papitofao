"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createVisionSection(formData: FormData) {
  const supabase = createClient();
  const { count } = await supabase.from("vision_sections").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("vision_sections").insert({
    title: String(formData.get("title") || "Untitled"),
    description: String(formData.get("description") || "") || null,
    image_url: String(formData.get("image_url") || "") || null,
    icon: String(formData.get("icon") || "") || null,
    display_order: count ?? 0,
    status: "draft",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/vision");
  revalidatePath("/admin/vision");
  return { ok: true };
}

export async function updateVisionSection(id: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("vision_sections")
    .update({
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || "") || null,
      image_url: String(formData.get("image_url") || "") || null,
      icon: String(formData.get("icon") || "") || null,
    })
    .eq("id", id);
  revalidatePath("/vision");
  revalidatePath("/admin/vision");
  return { ok: true };
}

export async function setVisionStatus(id: string, status: "draft" | "published" | "unpublished") {
  const supabase = createClient();
  await supabase.from("vision_sections").update({ status }).eq("id", id);
  revalidatePath("/vision");
  revalidatePath("/admin/vision");
}

export async function deleteVisionSection(id: string) {
  const supabase = createClient();
  await supabase.from("vision_sections").delete().eq("id", id);
  revalidatePath("/vision");
  revalidatePath("/admin/vision");
}
