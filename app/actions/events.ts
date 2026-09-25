"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createEvent(formData: FormData) {
  const supabase = createClient();
  const title = String(formData.get("title") || "Untitled event");
  const slug = slugify(String(formData.get("slug") || title)) || `event-${Date.now()}`;

  const { error } = await supabase.from("events").insert({
    title,
    slug,
    event_date: String(formData.get("event_date") || new Date().toISOString().slice(0, 10)),
    location: String(formData.get("location") || "") || null,
    status: "upcoming",
    is_published: false,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/events");
  revalidatePath("/admin/events");
  return { ok: true };
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = createClient();
  const title = String(formData.get("title") || "");
  const slug = slugify(String(formData.get("slug") || title));

  const { error } = await supabase
    .from("events")
    .update({
      title,
      slug,
      description: String(formData.get("description") || "") || null,
      event_date: String(formData.get("event_date") || ""),
      start_time: String(formData.get("start_time") || "") || null,
      end_time: String(formData.get("end_time") || "") || null,
      location: String(formData.get("location") || "") || null,
      address: String(formData.get("address") || "") || null,
      featured_image_url: String(formData.get("featured_image_url") || "") || null,
      poster_url: String(formData.get("poster_url") || "") || null,
      registration_url: String(formData.get("registration_url") || "") || null,
      contact_info: String(formData.get("contact_info") || "") || null,
      status: String(formData.get("status") || "upcoming") as any,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/events");
  revalidatePath(`/events/${slug}`);
  revalidatePath("/admin/events");
  return { ok: true };
}

export async function toggleEventPublished(id: string, published: boolean) {
  const supabase = createClient();
  await supabase.from("events").update({ is_published: published }).eq("id", id);
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function deleteEvent(id: string) {
  const supabase = createClient();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/events");
  revalidatePath("/admin/events");
}
