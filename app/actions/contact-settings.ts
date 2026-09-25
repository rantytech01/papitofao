"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateCampaignSettings(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("campaign_settings").upsert({
    id: 1,
    primary_phone: String(formData.get("primary_phone") || "") || null,
    secondary_phone: String(formData.get("secondary_phone") || "") || null,
    whatsapp_number: String(formData.get("whatsapp_number") || "") || null,
    email: String(formData.get("email") || "") || null,
    office_address: String(formData.get("office_address") || "") || null,
    office_hours: String(formData.get("office_hours") || "") || null,
    contact_description: String(formData.get("contact_description") || "") || null,
    election_date: String(formData.get("election_date") || "") || null,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout"); // header/footer contact buttons everywhere
  revalidatePath("/admin/contact");
  return { ok: true };
}
