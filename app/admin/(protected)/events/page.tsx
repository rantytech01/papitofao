import { createClient } from "@/lib/supabase/server";
import { EventsManager } from "@/components/admin/events-manager";

export default async function AdminEventsPage() {
  const supabase = createClient();
  const { data: events } = await supabase.from("events").select("*").order("event_date", { ascending: false });

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Events</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Only events marked Published show on the public Events page.
      </p>
      <EventsManager events={events ?? []} />
    </div>
  );
}
