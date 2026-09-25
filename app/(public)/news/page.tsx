import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;
export const metadata = { title: "News" };

export default async function NewsPage() {
  const supabase = createClient();
  const { data: articles } = await supabase
    .from("news_articles")
    .select("id, title, slug, excerpt, featured_image_url, category, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="mb-10 font-display text-4xl font-extrabold text-campaign-navy">News</h1>

      {(!articles || articles.length === 0) && (
        <p className="text-campaign-navy/50">No published articles yet.</p>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {(articles ?? []).map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="group block overflow-hidden rounded-xl border border-campaign-navy/10"
          >
            {article.featured_image_url && (
              <div className="relative h-48 w-full">
                <Image
                  src={article.featured_image_url}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-5">
              {article.category && (
                <p className="mb-1 text-xs font-semibold uppercase text-campaign-blue">
                  {article.category}
                </p>
              )}
              <h2 className="font-display text-xl font-bold text-campaign-navy">{article.title}</h2>
              {article.excerpt && (
                <p className="mt-2 line-clamp-3 text-sm text-campaign-navy/70">{article.excerpt}</p>
              )}
              {article.published_at && (
                <p className="mt-3 text-xs text-campaign-navy/50">
                  {new Date(article.published_at).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
