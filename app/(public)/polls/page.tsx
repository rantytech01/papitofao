import { createClient } from "@/lib/supabase/server";
import { PollWidget } from "@/components/poll-widget";

export const dynamic = "force-dynamic";
export const metadata = { title: "Polls" };

export default async function PollsPage() {
  const supabase = createClient();
  const { data: polls } = await supabase
    .from("polls")
    .select("*, poll_options(*)")
    .neq("status", "draft")
    .order("display_order");

  const pollsWithResults = await Promise.all(
    (polls ?? []).map(async (poll: any) => {
      const { data: results } = await supabase.rpc("get_poll_results", { p_poll_id: poll.id });
      return { ...poll, results: results ?? [] };
    })
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="mb-2 font-display text-4xl font-extrabold text-campaign-navy">Polls</h1>
      <p className="mb-10 text-sm text-campaign-navy/60">
        Quick, informal feedback from the community — not a scientific survey, just a pulse check on what matters most
        right now.
      </p>

      {pollsWithResults.length === 0 ? (
        <p className="text-campaign-navy/50">No polls are open right now — check back soon.</p>
      ) : (
        <div className="space-y-8">
          {pollsWithResults.map((poll: any) => (
            <PollWidget
              key={poll.id}
              pollId={poll.id}
              question={poll.question}
              status={poll.status}
              options={(poll.poll_options ?? []).sort((a: any, b: any) => a.display_order - b.display_order)}
              initialResults={poll.results}
            />
          ))}
        </div>
      )}
    </div>
  );
}
