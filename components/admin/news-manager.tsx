"use client";

import { useState, useTransition } from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { createNewsArticle, updateNewsArticle, setNewsStatus, deleteNewsArticle } from "@/app/actions/news";
import type { NewsArticle } from "@/lib/types";

function Row({ article }: { article: NewsArticle }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="border-b border-campaign-navy/10 py-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-left">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="font-medium text-campaign-navy">{article.title}</span>
          <span className="text-xs text-campaign-navy/40">/{article.slug}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${article.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {article.status}
          </span>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => startTransition(() => setNewsStatus(article.id, article.status === "published" ? "unpublished" : "published"))}
            className="admin-btn-secondary px-2 py-1 text-xs"
          >
            {article.status === "published" ? "Unpublish" : "Publish"}
          </button>
          <button onClick={() => { if (confirm("Delete this article?")) startTransition(() => deleteNewsArticle(article.id)); }} className="p-1.5 text-campaign-red/70 hover:text-campaign-red">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {open && (
        <form action={(fd) => startTransition(async () => { await updateNewsArticle(article.id, fd); })} className="mt-4 grid gap-3 rounded-lg bg-campaign-navy/[0.02] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="admin-label">Title</label><input name="title" defaultValue={article.title} className="admin-field" /></div>
            <div><label className="admin-label">Slug</label><input name="slug" defaultValue={article.slug} className="admin-field" /></div>
            <div><label className="admin-label">Author</label><input name="author" defaultValue={article.author ?? ""} className="admin-field" /></div>
            <div><label className="admin-label">Category</label><input name="category" defaultValue={article.category ?? ""} className="admin-field" /></div>
          </div>
          <div><label className="admin-label">Excerpt</label><textarea name="excerpt" defaultValue={article.excerpt ?? ""} rows={2} className="admin-field" /></div>
          <div><label className="admin-label">Content (HTML)</label><textarea name="content" defaultValue={article.content ?? ""} rows={8} className="admin-field font-mono text-xs" /></div>
          <div><label className="admin-label">Featured image URL</label><input name="featured_image_url" defaultValue={article.featured_image_url ?? ""} className="admin-field" /></div>

          <details className="text-sm">
            <summary className="cursor-pointer font-medium text-campaign-navy/70">SEO & social sharing</summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div><label className="admin-label">SEO title</label><input name="seo_title" className="admin-field" /></div>
              <div><label className="admin-label">SEO description</label><input name="seo_description" className="admin-field" /></div>
              <div><label className="admin-label">Open Graph title</label><input name="og_title" className="admin-field" /></div>
              <div><label className="admin-label">Open Graph description</label><input name="og_description" className="admin-field" /></div>
              <div className="sm:col-span-2"><label className="admin-label">Social image URL</label><input name="social_image_url" className="admin-field" /></div>
            </div>
          </details>

          <button type="submit" disabled={isPending} className="admin-btn-primary w-fit">Save Article</button>
        </form>
      )}
    </div>
  );
}

export function NewsManager({ articles }: { articles: NewsArticle[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      <form
        action={(fd) => startTransition(async () => { await createNewsArticle(fd); (document.getElementById("news-add-form") as HTMLFormElement)?.reset(); })}
        id="news-add-form"
        className="mb-6 grid gap-2 border-b border-campaign-navy/10 pb-6 sm:grid-cols-2"
      >
        <input name="title" placeholder="Title" required className="admin-field" />
        <input name="slug" placeholder="Slug (auto from title if blank)" className="admin-field" />
        <input name="author" placeholder="Author" className="admin-field" />
        <input name="category" placeholder="Category" className="admin-field" />
        <textarea name="excerpt" placeholder="Excerpt" className="admin-field sm:col-span-2" rows={2} />
        <button type="submit" disabled={isPending} className="admin-btn-primary sm:col-span-2 w-fit">+ New Article</button>
      </form>

      {articles.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No articles yet.</p>
      ) : (
        <div>{articles.map((a) => <Row key={a.id} article={a} />)}</div>
      )}
    </div>
  );
}
