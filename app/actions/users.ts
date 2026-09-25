"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function assertSuperAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase.from("admin_profiles").select("role").eq("id", user.id).maybeSingle();
  return profile?.role === "super_admin";
}

export async function inviteAdminUser(formData: FormData) {
  if (!(await assertSuperAdmin())) return { ok: false, error: "Only Super Admins can manage users." };

  const email = String(formData.get("email") || "");
  const fullName = String(formData.get("full_name") || "");
  const role = String(formData.get("role") || "editor") as "super_admin" | "editor";

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/login`,
  });
  if (error || !data.user) return { ok: false, error: error?.message ?? "Failed to invite user." };

  const { error: profileError } = await admin.from("admin_profiles").insert({
    id: data.user.id,
    full_name: fullName || email,
    role,
  });
  if (profileError) return { ok: false, error: profileError.message };

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateAdminRole(id: string, role: "super_admin" | "editor") {
  if (!(await assertSuperAdmin())) return { ok: false, error: "Only Super Admins can manage users." };
  const admin = createAdminClient();
  await admin.from("admin_profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function removeAdminUser(id: string) {
  if (!(await assertSuperAdmin())) return { ok: false, error: "Only Super Admins can manage users." };
  const admin = createAdminClient();
  await admin.from("admin_profiles").delete().eq("id", id);
  // Note: this removes CMS access but leaves the underlying auth.users record;
  // delete that too with admin.auth.admin.deleteUser(id) if the person should
  // lose sign-in access entirely.
  revalidatePath("/admin/users");
  return { ok: true };
}
