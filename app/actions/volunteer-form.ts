"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, isHoneypotTripped, getRequestIp } from "@/lib/form-protection";
import { verifyTurnstile } from "@/lib/turnstile";

const schema = z.object({
  full_name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  area: z.string().optional(),
  preferred_involvement: z.string().optional(),
  message: z.string().optional(),
});

export async function submitVolunteerForm(formData: FormData) {
  // Honeypot: a bot that fills every field trips this. Pretend success
  // rather than error, so bots don't learn to leave it blank specifically.
  if (isHoneypotTripped(formData)) {
    return { ok: true };
  }

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

  const rateLimit = await checkRateLimit("volunteer", { deviceMax: 2, ipMax: 10, windowMinutes: 60 });
  if (!rateLimit.allowed) {
    return { ok: false, error: rateLimit.reason };
  }

  const turnstileOk = await verifyTurnstile(formData.get("cf-turnstile-response"), getRequestIp(), {
    expectedAction: "volunteer",
  });
  if (!turnstileOk) {
    return { ok: false, error: "Verification failed. Please try again." };
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
    // Unique constraint on phone_normalized = this phone already submitted.
    if (error.code === "23505") {
      return {
        ok: false,
        error: "This phone number has already been submitted. We've got your details — we'll be in touch!",
      };
    }
    return { ok: false, error: "Unable to submit right now. Please try again." };
  }
  return { ok: true };
}
