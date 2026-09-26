"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createWardLocation(formData: FormData) {
  const supabase = createClient();
  const lat = parseFloat(String(formData.get("latitude") || ""));
  const lng = parseFloat(String(formData.get("longitude") || ""));
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return { ok: false, error: "Latitude and longitude must be numbers." };
  }

  const { count } = await supabase.from("ward_locations").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("ward_locations").insert({
    name: String(formData.get("name") || "").trim() || "Untitled location",
    description: String(formData.get("description") || "") || null,
    category: String(formData.get("category") || "area"),
    latitude: lat,
    longitude: lng,
    display_order: count ?? 0,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/community");
  revalidatePath("/admin/ward-map");
  return { ok: true };
}

export async function updateWardLocation(id: string, formData: FormData) {
  const supabase = createClient();
  const lat = parseFloat(String(formData.get("latitude") || ""));
  const lng = parseFloat(String(formData.get("longitude") || ""));
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return { ok: false, error: "Latitude and longitude must be numbers." };
  }

  const { error } = await supabase
    .from("ward_locations")
    .update({
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || "") || null,
      category: String(formData.get("category") || "area"),
      latitude: lat,
      longitude: lng,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/community");
  revalidatePath("/admin/ward-map");
  return { ok: true };
}

export async function toggleWardLocationVisibility(id: string, visible: boolean) {
  const supabase = createClient();
  await supabase.from("ward_locations").update({ is_visible: visible }).eq("id", id);
  revalidatePath("/community");
  revalidatePath("/admin/ward-map");
}

export async function deleteWardLocation(id: string) {
  const supabase = createClient();
  await supabase.from("ward_locations").delete().eq("id", id);
  revalidatePath("/community");
  revalidatePath("/admin/ward-map");
}
