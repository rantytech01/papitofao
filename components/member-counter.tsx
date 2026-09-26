"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Shows the real member count from the database, server-rendered on load
 * (initialCount), then ticks up live via Supabase Realtime whenever someone
 * new joins — no invented numbers, no polling.
 *
 * Listens to "member_join_events" rather than "members" directly: Realtime
 * respects RLS, and "members" is intentionally admin-only to SELECT (it
 * holds phone numbers/emails), so anonymous visitors would never receive
 * INSERT events on it. member_join_events carries no personal data and is
 * publicly readable, so it's safe to subscribe to from any visitor's
 * browser. A database trigger keeps it in sync with real signups.
 */
export function MemberCounter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [display, setDisplay] = useState(initialCount);
  const frameRef = useRef<number>();

  useEffect(() => {
    // NOTE: adjust this import if your browser client lives elsewhere
    // (e.g. lib/supabase/browser.ts).
    const supabase = createClient();

    const channel = supabase
      .channel("members-count")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "member_join_events" },
        () => setCount((c) => c + 1)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Animate the digits counting up whenever the target count changes
  useEffect(() => {
    const start = display;
    const end = count;
    if (start === end) return;

    const duration = 800;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-campaign-navy/5 px-4 py-2">
      <span className="text-2xl font-extrabold tabular-nums text-campaign-red">
        {display.toLocaleString()}
      </span>
      <span className="text-sm font-semibold text-campaign-navy/70">
        members and counting
      </span>
    </div>
  );
}
