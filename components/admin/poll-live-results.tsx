"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getPollResults } from "@/app/actions/polls";

interface Result {
  option_id: string;
  label: string;
  votes: number;
}

/**
 * Subscribes directly to poll_votes for this poll (admins can read it —
 * unlike the public member counter, no separate "safe events" table is
 * needed here, since RLS already permits admin SELECT on poll_votes).
 * Re-fetches the aggregated results on every new vote and highlights
 * whichever option is currently leading.
 */
export function PollLiveResults({ pollId }: { pollId: string }) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function refresh() {
      const fresh = await getPollResults(pollId);
      if (active) {
        setResults(fresh);
        setLoading(false);
      }
    }

    refresh();

    const supabase = createClient();
    const channel = supabase
      .channel(`admin-poll-${pollId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "poll_votes", filter: `poll_id=eq.${pollId}` },
        () => refresh()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [pollId]);

  if (loading) return <p className="mt-3 text-xs text-campaign-navy/40">Loading results…</p>;

  const total = results.reduce((sum, r) => sum + Number(r.votes), 0);

  if (total === 0) {
    return <p className="mt-3 text-xs text-campaign-navy/40">No votes yet.</p>;
  }

  const leader = results.reduce((max, r) => (Number(r.votes) > Number(max.votes) ? r : max), results[0]);
  const leaderPct = Math.round((Number(leader.votes) / total) * 100);

  return (
    <div className="mt-3 rounded-lg bg-campaign-navy/[0.02] p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-campaign-navy/50">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
        LIVE RESULTS · {total} vote{total === 1 ? "" : "s"}
      </div>

      <div className="space-y-2">
        {results.map((r) => {
          const pct = total > 0 ? Math.round((Number(r.votes) / total) * 100) : 0;
          const isLeader = r.option_id === leader.option_id;
          return (
            <div key={r.option_id}>
              <div className="mb-0.5 flex justify-between text-xs">
                <span className={isLeader ? "font-semibold text-campaign-navy" : "text-campaign-navy/70"}>
                  {r.label} {isLeader && "👑"}
                </span>
                <span className="font-semibold text-campaign-navy">
                  {pct}% ({r.votes})
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-campaign-navy/10">
                <div
                  className={`h-full rounded-full transition-all ${isLeader ? "bg-campaign-blue" : "bg-campaign-navy/30"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-campaign-navy/50">
        Currently leading: <span className="font-semibold text-campaign-navy">{leader.label}</span> with{" "}
        {leaderPct}% of responses so far. Treat this as directional community sentiment, not a statistically
        representative sample.
      </p>
    </div>
  );
}
