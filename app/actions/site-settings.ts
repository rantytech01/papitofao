"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSiteSettings(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    website_name: String(formData.get("website_name") || "Campaign Website"),
    website_title: String(formData.get("website_title") || "") || null,
    website_description: String(formData.get("website_description") || "") || null,
    favicon_url: String(formData.get("favicon_url") || "") || null,
    primary_color: String(formData.get("primary_color") || "#003491"),
    secondary_color: String(formData.get("secondary_color") || "#F0181E"),
    accent_color: String(formData.get("accent_color") || "#111827"),
    seo_title: String(formData.get("seo_title") || "") || null,
    seo_description: String(formData.get("seo_description") || "") || null,
    canonical_url: String(formData.get("canonical_url") || "") || null,
    social_share_image_url: String(formData.get("social_share_image_url") || "") || null,
    footer_copyright: String(formData.get("footer_copyright") || "") || null,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { ok: true };
}
