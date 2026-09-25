"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createSocialLink(formData: FormData) {
  const supabase = createClient();
  const { count } = await supabase.from("social_links").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("social_links").insert({
    platform: String(formData.get("platform") || ""),
    display_name: String(formData.get("display_name") || "") || null,
    url: String(formData.get("url") || ""),
    is_enabled: true,
    display_order: count ?? 0,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/social");
  return { ok: true };
}

export async function updateSocialLink(id: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("social_links")
    .update({
      platform: String(formData.get("platform") || ""),
      display_name: String(formData.get("display_name") || "") || null,
      url: String(formData.get("url") || ""),
    })
    .eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/social");
  return { ok: true };
}

export async function toggleSocialLink(id: string, enabled: boolean) {
  const supabase = createClient();
  await supabase.from("social_links").update({ is_enabled: enabled }).eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/social");
}

export async function deleteSocialLink(id: string) {
  const supabase = createClient();
  await supabase.from("social_links").delete().eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/social");
}
