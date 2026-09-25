import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!event) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <span className="mb-3 inline-block rounded-full bg-campaign-blue/10 px-3 py-1 text-xs font-semibold uppercase text-campaign-blue">
        {event.status}
      </span>
      <h1 className="font-display text-4xl font-extrabold text-campaign-navy">{event.title}</h1>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-campaign-navy/70">
        <span>
          {new Date(event.event_date).toLocaleDateString("en-KE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        {event.start_time && (
          <span>
            {event.start_time}
            {event.end_time ? ` – ${event.end_time}` : ""}
          </span>
        )}
        {event.location && <span>{event.location}</span>}
      </div>

      {(event.featured_image_url || event.poster_url) && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image
            src={event.featured_image_url || event.poster_url}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {event.description && (
        <div className="prose-campaign mt-8" dangerouslySetInnerHTML={{ __html: event.description }} />
      )}

      {event.address && (
        <p className="mt-6 text-sm text-campaign-navy/70">
          <strong>Address:</strong> {event.address}
        </p>
      )}
      {event.registration_url && (
        <a
          href={event.registration_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-campaign-blue px-6 py-3 text-sm font-semibold text-white"
        >
          Register
        </a>
      )}
      {event.contact_info && (
        <p className="mt-4 text-sm text-campaign-navy/60">{event.contact_info}</p>
      )}
    </article>
  );
}
