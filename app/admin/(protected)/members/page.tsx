import { createClient } from "@/lib/supabase/server";
import { MembersManager } from "@/components/admin/members-manager";

export default async function AdminMembersPage() {
  const supabase = createClient();
  const { data: members } = await supabase.from("members").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Members</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">Signups from the public "Become a Member" form.</p>
      <MembersManager members={(members ?? []) as any} />
    </div>
  );
}
