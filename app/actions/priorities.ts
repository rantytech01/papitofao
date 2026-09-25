"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPriority(formData: FormData) {
  const supabase = createClient();
  const { count } = await supabase.from("priorities").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("priorities").insert({
    title: String(formData.get("title") || "Untitled"),
    short_description: String(formData.get("short_description") || "") || null,
    full_description: String(formData.get("full_description") || "") || null,
    image_url: String(formData.get("image_url") || "") || null,
    icon: String(formData.get("icon") || "") || null,
    category: String(formData.get("category") || "") || null,
    display_order: count ?? 0,
    status: "draft",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/priorities");
  revalidatePath("/admin/priorities");
  return { ok: true };
}

export async function updatePriority(id: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("priorities")
    .update({
      title: String(formData.get("title") || ""),
      short_description: String(formData.get("short_description") || "") || null,
      full_description: String(formData.get("full_description") || "") || null,
      image_url: String(formData.get("image_url") || "") || null,
      icon: String(formData.get("icon") || "") || null,
      category: String(formData.get("category") || "") || null,
    })
    .eq("id", id);
  revalidatePath("/priorities");
  revalidatePath("/admin/priorities");
  return { ok: true };
}

export async function setPriorityStatus(id: string, status: "draft" | "published" | "unpublished") {
  const supabase = createClient();
  await supabase.from("priorities").update({ status }).eq("id", id);
  revalidatePath("/priorities");
  revalidatePath("/admin/priorities");
}

export async function deletePriority(id: string) {
  const supabase = createClient();
  await supabase.from("priorities").delete().eq("id", id);
  revalidatePath("/priorities");
  revalidatePath("/admin/priorities");
}
