"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  full_name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  area: z.string().optional(),
  preferred_involvement: z.string().optional(),
  message: z.string().optional(),
});

export async function submitVolunteerForm(formData: FormData) {
  const parsed = schema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    area: formData.get("area"),
    preferred_involvement: formData.get("preferred_involvement"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Please fill in your name at least." };
  }

  const supabase = createClient();
  const { error } = await supabase.from("volunteer_submissions").insert({
    full_name: parsed.data.full_name,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    area: parsed.data.area || null,
    preferred_involvement: parsed.data.preferred_involvement || null,
    message: parsed.data.message || null,
  });

  if (error) {
    return { ok: false, error: "Unable to submit right now. Please try again." };
  }
  return { ok: true };
}
