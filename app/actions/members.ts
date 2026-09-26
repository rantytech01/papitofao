"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type JoinFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function joinAsMember(
  _prevState: JoinFormState,
  formData: FormData
): Promise<JoinFormState> {
  const full_name = (formData.get("full_name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = ((formData.get("email") as string) || "").trim() || null;
  const ward = ((formData.get("ward") as string) || "").trim() || null;

  if (!full_name || !phone) {
    return { status: "error", message: "Name and phone number are required." };
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
