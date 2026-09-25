import { createClient } from "@/lib/supabase/server";
import { UsersManager } from "@/components/admin/users-manager";

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: me } = await supabase.from("admin_profiles").select("role").eq("id", user?.id).maybeSingle();
  const { data: users } = await supabase.from("admin_profiles").select("id, full_name, role").order("full_name");

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Admin Users</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Super Admins have full access. Editors can manage content but not other admins.
      </p>
      <UsersManager users={(users ?? []) as any} isSuperAdmin={me?.role === "super_admin"} />
    </div>
  );
}
