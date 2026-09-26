import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { ContactButtons } from "@/components/contact-buttons";
import type { HomepageSection } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();

  const [
    { data: candidate },
    { data: sections },
    { data: campaignSettings },
    { data: news },
    { data: events },
    { data: gallery },
  ] = await Promise.all([
    supabase.from("candidate_profile").select("*").eq("id", 1).maybeSingle(),
    supabase
      .from("homepage_sections")
      .select("*")
      .eq("status", "published")
      .eq("is_visible", true)
      .order("display_order"),
    supabase.from("campaign_settings").select("*").eq("id", 1).maybeSingle(),
    supabase
      .from("news_articles")
      .select("id, title, slug, excerpt, featured_image_url, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
    supabase
      .from("events")
      .select("id, title, slug, event_date, location, featured_image_url")
      .eq("is_published", true)
      .gte("event_date", new Date().toISOString().slice(0, 10))
      .order("event_date")
      .limit(3),
    supabase
      .from("gallery_items")
      .select("id, image_url, caption")
      .eq("is_visible", true)
      .order("display_order")
      .limit(6),
  ]);

  const bySectionKey = new Map<string, HomepageSection>(
    (sections ?? []).map((s: HomepageSection) => [s.section_key, s])
  );
  const orderedSections = sections ?? [];

  return (
    <div>
      {bySectionKey.has("hero") && (
        <Hero candidate={candidate ?? null} section={bySectionKey.get("hero")!} />
      )}

      {orderedSections
        .filter((s) => s.section_key !== "hero")
        .map((section) => {
          switch (section.section_key) {
            case "about":
              return (
                <section key={section.id} className="mx-auto max-w-6xl px-4 py-16 md:px-6">
                  <SectionHeading
                    title={section.title}
                    subtitle={section.subtitle}
                    description={section.description}
                  />
                  {section.button_text && section.button_url && (
                    <Link
                      href={section.button_url}
                      className="inline-block rounded-full bg-campaign-blue px-6 py-2.5 text-sm font-semibold text-white"
                    >
                      {section.button_text}
                    </Link>
                  )}
                </section>
              );

            case "news":
              return (
                <section key={section.id} className="bg-campaign-navy/[0.03] py-16">
                  <div className="mx-auto max-w-6xl px-4 md:px-6">
                    <SectionHeading title={section.title} description={section.description} />
                    {news && news.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-3">
                        {news.map((article) => (
                          <Link
                            key={article.id}
                            href={`/news/${article.slug}`}
                            className="group block overflow-hidden rounded-xl border border-campaign-navy/10 bg-white"
                          >
                            {article.featured_image_url && (
                              <div className="relative h-44 w-full">
                                <Image
                                  src={article.featured_image_url}
                                  alt={article.title}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                />
                              </div>
                            )}
                            <div className="p-4">
                              <h3 className="font-display text-lg font-bold text-campaign-navy">
                                {article.title}
                              </h3>
                              {article.excerpt && (
                                <p className="mt-1 line-clamp-2 text-sm text-campaign-navy/70">
                                  {article.excerpt}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-campaign-navy/50">No published articles yet.</p>
                    )}
                    {section.button_text && section.button_url && (
                      <Link
                        href={section.button_url}
                        className="mt-6 inline-block text-sm font-semibold text-campaign-blue"
                      >
                        {section.button_text} →
                      </Link>
                    )}
                  </div>
                </section>
              );

            case "events":
              return (
                <section key={section.id} className="py-16">
                  <div className="mx-auto max-w-6xl px-4 md:px-6">
                    <SectionHeading title={section.title} description={section.description} />
                    {events && events.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-3">
                        {events.map((event) => (
                          <Link
                            key={event.id}
                            href={`/events/${event.slug}`}
                            className="block rounded-xl border border-campaign-navy/10 p-5 hover:border-campaign-blue"
                          >
                            <p className="text-sm font-semibold text-campaign-red">
                              {new Date(event.event_date).toLocaleDateString("en-KE", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                            <h3 className="mt-1 font-display text-lg font-bold text-campaign-navy">
                              {event.title}
                            </h3>
                            {event.location && (
                              <p className="mt-1 text-sm text-campaign-navy/60">{event.location}</p>
                            )}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-campaign-navy/50">No upcoming events yet.</p>
                    )}
                  </div>
                </section>
              );

            case "gallery":
              return (
                <section key={section.id} className="bg-campaign-navy/[0.03] py-16">
                  <div className="mx-auto max-w-6xl px-4 md:px-6">
                    <SectionHeading title={section.title} />
                    {gallery && gallery.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {gallery.map((item) => (
                          <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg">
                            <Image
                              src={item.image_url}
                              alt={item.caption ?? ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              );

            case "contact":
              return (
                <section key={section.id} className="mx-auto max-w-6xl px-4 py-16 text-center md:px-6">
                  <SectionHeading title={section.title} align="center" />
                  <div className="flex justify-center">
                    <ContactButtons settings={campaignSettings ?? null} />
                  </div>
                </section>
              );

            default:
              // vision / priorities / community / get_involved / any admin-added section
              return (
                <section key={section.id} className="mx-auto max-w-6xl px-4 py-16 md:px-6">
                  <SectionHeading
                    title={section.title}
                    subtitle={section.subtitle}
                    description={section.description}
                  />
                  {section.button_text && section.button_url && (
                    <Link
                      href={section.button_url}
                      className="inline-block rounded-full border border-campaign-blue px-6 py-2.5 text-sm font-semibold text-campaign-blue"
                    >
                      {section.button_text}
                    </Link>
                  )}
                </section>
              );
          }
        })}
    </div>
  );
}
