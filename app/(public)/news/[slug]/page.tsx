import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

async function getArticle(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("news_articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt || undefined,
    openGraph: {
      title: article.og_title || article.title,
      description: article.og_description || article.excerpt || undefined,
      images: article.social_image_url || article.featured_image_url
        ? [article.social_image_url || article.featured_image_url]
        : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      {article.category && (
        <p className="mb-2 text-xs font-semibold uppercase text-campaign-blue">{article.category}</p>
      )}
      <h1 className="font-display text-4xl font-extrabold text-campaign-navy">{article.title}</h1>
      {article.published_at && (
        <p className="mt-2 text-sm text-campaign-navy/50">
          {new Date(article.published_at).toLocaleDateString("en-KE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {article.author ? ` · ${article.author}` : ""}
        </p>
      )}
      {article.featured_image_url && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image src={article.featured_image_url} alt={article.title} fill className="object-cover" />
        </div>
      )}
      {article.content && (
        <div className="prose-campaign mt-8" dangerouslySetInnerHTML={{ __html: article.content }} />
      )}
      {article.tags?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag: string) => (
            <span key={tag} className="rounded-full bg-campaign-navy/5 px-3 py-1 text-xs text-campaign-navy/70">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
