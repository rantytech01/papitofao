import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const supabase = createClient();

  const staticRoutes = [
    "", "about", "vision", "priorities", "community", "news", "events", "gallery", "contact", "volunteer",
  ].map((path) => ({
    url: `${base}/${path}`,
    lastModified: new Date(),
  }));

  const [{ data: news }, { data: events }] = await Promise.all([
    supabase.from("news_articles").select("slug, updated_at").eq("status", "published"),
    supabase.from("events").select("slug, updated_at").eq("is_published", true),
  ]);

  const newsRoutes = (news ?? []).map((a) => ({
    url: `${base}/news/${a.slug}`,
    lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
  }));
  const eventRoutes = (events ?? []).map((e) => ({
    url: `${base}/events/${e.slug}`,
    lastModified: e.updated_at ? new Date(e.updated_at) : new Date(),
  }));

  return [...staticRoutes, ...newsRoutes, ...eventRoutes];
}
