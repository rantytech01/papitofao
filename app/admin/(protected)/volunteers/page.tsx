import { createClient } from "@/lib/supabase/server";
import { VolunteersManager } from "@/components/admin/volunteers-manager";

export default async function AdminVolunteersPage() {
  const supabase = createClient();
  const { data: volunteers } = await supabase.from("volunteer_submissions").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Volunteers</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">Submissions from the public Get Involved form.</p>
      <VolunteersManager volunteers={(volunteers ?? []) as any} />
    </div>
  );
}
