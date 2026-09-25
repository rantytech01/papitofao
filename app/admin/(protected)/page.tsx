import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { count: publishedNews },
    { count: upcomingEvents },
    { count: galleryItems },
    { count: volunteerRequests },
    { count: unreadMessages },
  ] = await Promise.all([
    supabase.from("news_articles").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true)
      .gte("event_date", new Date().toISOString().slice(0, 10)),
    supabase.from("gallery_items").select("*", { count: "exact", head: true }),
    supabase.from("volunteer_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "unread"),
  ]);

  const stats = [
    { label: "Published News", value: publishedNews ?? 0 },
    { label: "Upcoming Events", value: upcomingEvents ?? 0 },
    { label: "Gallery Items", value: galleryItems ?? 0 },
    { label: "New Volunteer Requests", value: volunteerRequests ?? 0 },
    { label: "Unread Messages", value: unreadMessages ?? 0 },
  ];

  const quickActions = [
    { label: "New Article", href: "/admin/news" },
    { label: "New Event", href: "/admin/events" },
    { label: "Upload Gallery", href: "/admin/gallery" },
    { label: "Edit Candidate", href: "/admin/candidate" },
    { label: "Edit Homepage", href: "/admin/homepage" },
    { label: "Update Contact", href: "/admin/contact" },
  ];

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Dashboard</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Everything a visitor sees is managed from here — nothing needs a code change.
      </p>

      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-campaign-navy/10 bg-white p-4">
            <p className="text-2xl font-bold text-campaign-navy">{s.value}</p>
            <p className="mt-1 text-xs text-campaign-navy/60">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 font-display text-lg font-bold text-campaign-navy">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        {quickActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="rounded-full border border-campaign-blue px-4 py-2 text-sm font-medium text-campaign-blue hover:bg-campaign-blue hover:text-white"
          >
            + {a.label}
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-campaign-navy underline"
        >
          Preview Website →
        </a>
      </div>
    </div>
  );
}
