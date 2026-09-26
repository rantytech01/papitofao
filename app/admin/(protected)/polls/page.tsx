import { createClient } from "@/lib/supabase/server";
import { PollsManager } from "@/components/admin/polls-manager";

export default async function AdminPollsPage() {
  const supabase = createClient();
  const { data: polls } = await supabase.from("polls").select("*, poll_options(*)").order("display_order");

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Polls</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Informal community feedback polls. Create a question, add options, then set it to Active to publish on
        /polls.
      </p>
      <PollsManager polls={(polls ?? []) as any} />
    </div>
  );
}
