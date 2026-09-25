"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setVolunteerStatus(id: string, status: "new" | "contacted" | "processed" | "archived") {
  const supabase = createClient();
  await supabase.from("volunteer_submissions").update({ status }).eq("id", id);
  revalidatePath("/admin/volunteers");
}

export async function deleteVolunteer(id: string) {
  const supabase = createClient();
  await supabase.from("volunteer_submissions").delete().eq("id", id);
  revalidatePath("/admin/volunteers");
}
