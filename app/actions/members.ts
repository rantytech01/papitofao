"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, isHoneypotTripped, getRequestIp } from "@/lib/form-protection";
import { verifyTurnstile } from "@/lib/turnstile";

export type JoinFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function joinAsMember(
  _prevState: JoinFormState,
  formData: FormData
): Promise<JoinFormState> {
  // Honeypot: a bot that fills every field trips this. Real visitors never
  // see or fill it. Pretend success rather than error, so bots don't learn
  // to leave it blank specifically.
  if (isHoneypotTripped(formData)) {
    return { status: "success", message: "Welcome to the movement! 🎉" };
  }

  const full_name = (formData.get("full_name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = ((formData.get("email") as string) || "").trim() || null;
  const ward = ((formData.get("ward") as string) || "").trim() || null;

  if (!full_name || !phone) {
    return { status: "error", message: "Name and phone number are required." };
  }

  const rateLimit = await checkRateLimit("join", { deviceMax: 2, ipMax: 10, windowMinutes: 60 });
  if (!rateLimit.allowed) {
    return { status: "error", message: rateLimit.reason };
  }

  const turnstileOk = await verifyTurnstile(formData.get("cf-turnstile-response"), getRequestIp());
  if (!turnstileOk) {
    return { status: "error", message: "Verification failed. Please try again." };
  }

  // NOTE: adjust this import/call if your server client is set up differently
  // (e.g. if createClient() there is synchronous rather than async).
  const supabase = await createClient();

  const { error } = await supabase.from("members").insert({
    full_name,
    phone,
    email,
    ward,
  });

  if (error) {
    console.error("joinAsMember error:", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  // Refresh the homepage so the server-rendered count is correct
  // even for visitors who load the page fresh right after this signup.
  revalidatePath("/");

  return { status: "success", message: "Welcome to the movement! 🎉" };
}

export async function setMemberStatus(id: string, status: "active" | "archived") {
  const supabase = createClient();
  const { error } = await supabase.from("members").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/members");
  revalidatePath("/"); // archiving/reactivating changes the public counter
}

export async function deleteMember(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/members");
  revalidatePath("/");
}
