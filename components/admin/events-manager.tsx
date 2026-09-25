"use client";

import { useState, useTransition } from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { createEvent, updateEvent, toggleEventPublished, deleteEvent } from "@/app/actions/events";
import type { CampaignEvent } from "@/lib/types";

function Row({ event }: { event: CampaignEvent }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="border-b border-campaign-navy/10 py-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-left">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="font-medium text-campaign-navy">{event.title}</span>
          <span className="text-xs text-campaign-navy/40">{event.event_date}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${event.is_published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {event.is_published ? "published" : "draft"}
          </span>
        </button>
        <div className="flex items-center gap-1">
          <button onClick={() => startTransition(() => toggleEventPublished(event.id, !event.is_published))} className="admin-btn-secondary px-2 py-1 text-xs">
            {event.is_published ? "Unpublish" : "Publish"}
          </button>
          <button onClick={() => { if (confirm("Delete this event?")) startTransition(() => deleteEvent(event.id)); }} className="p-1.5 text-campaign-red/70 hover:text-campaign-red">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {open && (
        <form action={(fd) => startTransition(async () => { await updateEvent(event.id, fd); })} className="mt-4 grid gap-3 rounded-lg bg-campaign-navy/[0.02] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="admin-label">Title</label><input name="title" defaultValue={event.title} className="admin-field" /></div>
            <div><label className="admin-label">Slug</label><input name="slug" defaultValue={event.slug} className="admin-field" /></div>
            <div><label className="admin-label">Date</label><input type="date" name="event_date" defaultValue={event.event_date} className="admin-field" /></div>
            <div>
              <label className="admin-label">Status</label>
              <select name="status" defaultValue={event.status} className="admin-field">
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div><label className="admin-label">Start time</label><input type="time" name="start_time" defaultValue={event.start_time ?? ""} className="admin-field" /></div>
            <div><label className="admin-label">End time</label><input type="time" name="end_time" defaultValue={event.end_time ?? ""} className="admin-field" /></div>
            <div><label className="admin-label">Location</label><input name="location" defaultValue={event.location ?? ""} className="admin-field" /></div>
            <div><label className="admin-label">Address</label><input name="address" defaultValue={event.address ?? ""} className="admin-field" /></div>
          </div>
          <div><label className="admin-label">Description (HTML)</label><textarea name="description" defaultValue={event.description ?? ""} rows={5} className="admin-field font-mono text-xs" /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="admin-label">Featured image URL</label><input name="featured_image_url" defaultValue={event.featured_image_url ?? ""} className="admin-field" /></div>
            <div><label className="admin-label">Poster URL</label><input name="poster_url" defaultValue={event.poster_url ?? ""} className="admin-field" /></div>
            <div><label className="admin-label">Registration URL</label><input name="registration_url" defaultValue={event.registration_url ?? ""} className="admin-field" /></div>
            <div><label className="admin-label">Contact info</label><input name="contact_info" className="admin-field" /></div>
          </div>
          <button type="submit" disabled={isPending} className="admin-btn-primary w-fit">Save Event</button>
        </form>
      )}
    </div>
  );
}

export function EventsManager({ events }: { events: CampaignEvent[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      <form
        action={(fd) => startTransition(async () => { await createEvent(fd); (document.getElementById("event-add-form") as HTMLFormElement)?.reset(); })}
        id="event-add-form"
        className="mb-6 grid gap-2 border-b border-campaign-navy/10 pb-6 sm:grid-cols-2"
      >
        <input name="title" placeholder="Event title" required className="admin-field" />
        <input name="slug" placeholder="Slug (auto from title if blank)" className="admin-field" />
        <input type="date" name="event_date" required className="admin-field" />
        <input name="location" placeholder="Location" className="admin-field" />
        <button type="submit" disabled={isPending} className="admin-btn-primary sm:col-span-2 w-fit">+ New Event</button>
      </form>

      {events.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No events yet.</p>
      ) : (
        <div>{events.map((e) => <Row key={e.id} event={e} />)}</div>
      )}
    </div>
  );
}
