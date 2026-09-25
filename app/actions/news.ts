"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createNewsArticle(formData: FormData) {
  const supabase = createClient();
  const title = String(formData.get("title") || "Untitled");
  const slug = slugify(String(formData.get("slug") || title)) || `article-${Date.now()}`;

  const { error } = await supabase.from("news_articles").insert({
    title,
    slug,
    excerpt: String(formData.get("excerpt") || "") || null,
    content: String(formData.get("content") || "") || null,
    featured_image_url: String(formData.get("featured_image_url") || "") || null,
    author: String(formData.get("author") || "") || null,
    category: String(formData.get("category") || "") || null,
    status: "draft",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/news");
  revalidatePath("/admin/news");
  return { ok: true };
}

export async function updateNewsArticle(id: string, formData: FormData) {
  const supabase = createClient();
  const title = String(formData.get("title") || "");
  const slug = slugify(String(formData.get("slug") || title));

  const { error } = await supabase
    .from("news_articles")
    .update({
      title,
      slug,
      excerpt: String(formData.get("excerpt") || "") || null,
      content: String(formData.get("content") || "") || null,
      featured_image_url: String(formData.get("featured_image_url") || "") || null,
      author: String(formData.get("author") || "") || null,
      category: String(formData.get("category") || "") || null,
      seo_title: String(formData.get("seo_title") || "") || null,
      seo_description: String(formData.get("seo_description") || "") || null,
      og_title: String(formData.get("og_title") || "") || null,
      og_description: String(formData.get("og_description") || "") || null,
      social_image_url: String(formData.get("social_image_url") || "") || null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/news");
  revalidatePath(`/news/${slug}`);
  revalidatePath("/admin/news");
  return { ok: true };
}

export async function setNewsStatus(id: string, status: "draft" | "published" | "unpublished") {
  const supabase = createClient();
  const patch: Record<string, any> = { status };
  if (status === "published") patch.published_at = new Date().toISOString();
  await supabase.from("news_articles").update(patch).eq("id", id);
  revalidatePath("/news");
  revalidatePath("/admin/news");
}

export async function deleteNewsArticle(id: string) {
  const supabase = createClient();
  await supabase.from("news_articles").delete().eq("id", id);
  revalidatePath("/news");
  revalidatePath("/admin/news");
}
