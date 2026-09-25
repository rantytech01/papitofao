import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;
export const metadata = { title: "Events" };

export default async function EventsPage() {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: upcoming }, { data: past }] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, slug, event_date, location, status")
      .eq("is_published", true)
      .gte("event_date", today)
      .order("event_date"),
    supabase
      .from("events")
      .select("id, title, slug, event_date, location, status")
      .eq("is_published", true)
      .lt("event_date", today)
      .order("event_date", { ascending: false }),
  ]);

  const EventRow = ({ event }: { event: any }) => (
    <Link
      href={`/events/${event.slug}`}
      className="flex items-center justify-between rounded-lg border border-campaign-navy/10 px-5 py-4 hover:border-campaign-blue"
    >
      <div>
        <h3 className="font-display text-lg font-bold text-campaign-navy">{event.title}</h3>
        {event.location && <p className="text-sm text-campaign-navy/60">{event.location}</p>}
      </div>
      <p className="text-sm font-semibold text-campaign-red">
        {new Date(event.event_date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
      </p>
    </Link>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <h1 className="mb-10 font-display text-4xl font-extrabold text-campaign-navy">Events</h1>

      <section className="mb-12">
        <h2 className="mb-4 font-display text-xl font-bold text-campaign-navy">Upcoming Events</h2>
        {(!upcoming || upcoming.length === 0) ? (
          <p className="text-campaign-navy/50">No upcoming events published yet.</p>
        ) : (
          <div className="space-y-3">{upcoming.map((e) => <EventRow key={e.id} event={e} />)}</div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-bold text-campaign-navy">Past Events</h2>
        {(!past || past.length === 0) ? (
          <p className="text-campaign-navy/50">No past events yet.</p>
        ) : (
          <div className="space-y-3 opacity-75">{past.map((e) => <EventRow key={e.id} event={e} />)}</div>
        )}
      </section>
    </div>
  );
}
