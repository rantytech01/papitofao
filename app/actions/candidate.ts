"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateCandidateProfile(formData: FormData) {
  const supabase = createClient();

  const payload = {
    id: 1,
    candidate_name: String(formData.get("candidate_name") || ""),
    candidate_title: String(formData.get("candidate_title") || "") || null,
    position: String(formData.get("position") || ""),
    ward: String(formData.get("ward") || ""),
    election_year: Number(formData.get("election_year")) || new Date().getFullYear(),
    movement_name: String(formData.get("movement_name") || ""),
    movement_tagline: String(formData.get("movement_tagline") || "") || null,
    slogan: String(formData.get("slogan") || "") || null,
    short_biography: String(formData.get("short_biography") || "") || null,
    full_biography: String(formData.get("full_biography") || "") || null,
    hero_description: String(formData.get("hero_description") || "") || null,
    profile_photo_url: String(formData.get("profile_photo_url") || "") || null,
    logo_url: String(formData.get("logo_url") || "") || null,
    movement_logo_url: String(formData.get("movement_logo_url") || "") || null,
  };

  const { error } = await supabase.from("candidate_profile").upsert(payload);
  if (error) return { ok: false, error: error.message };

  await supabase.from("activity_logs").insert({
    action: "content.updated",
    resource: "candidate_profile",
  });

  revalidatePath("/");
  revalidatePath("/admin/candidate");
  return { ok: true };
}
