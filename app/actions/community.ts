"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCommunitySection(formData: FormData) {
  const supabase = createClient();
  const { count } = await supabase.from("community_sections").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("community_sections").insert({
    title: String(formData.get("title") || "Untitled"),
    description: String(formData.get("description") || "") || null,
    image_url: String(formData.get("image_url") || "") || null,
    display_order: count ?? 0,
    status: "draft",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/community");
  revalidatePath("/admin/community");
  return { ok: true };
}

export async function updateCommunitySection(id: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("community_sections")
    .update({
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || "") || null,
      image_url: String(formData.get("image_url") || "") || null,
    })
    .eq("id", id);
  revalidatePath("/community");
  revalidatePath("/admin/community");
  return { ok: true };
}

export async function setCommunityStatus(id: string, status: "draft" | "published" | "unpublished") {
  const supabase = createClient();
  await supabase.from("community_sections").update({ status }).eq("id", id);
  revalidatePath("/community");
  revalidatePath("/admin/community");
}

export async function deleteCommunitySection(id: string) {
  const supabase = createClient();
  await supabase.from("community_sections").delete().eq("id", id);
  revalidatePath("/community");
  revalidatePath("/admin/community");
}
