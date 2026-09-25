import { createClient } from "@/lib/supabase/server";
import { NewsManager } from "@/components/admin/news-manager";

export default async function AdminNewsPage() {
  const supabase = createClient();
  const { data: articles } = await supabase.from("news_articles").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">News</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Only articles marked Published appear on the public site.
      </p>
      <NewsManager articles={articles ?? []} />
    </div>
  );
}
