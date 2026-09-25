import { createClient } from "@/lib/supabase/server";
import { GalleryManager } from "@/components/admin/gallery-manager";

export default async function AdminGalleryPage() {
  const supabase = createClient();
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("gallery_categories").select("*").order("display_order"),
    supabase.from("gallery_items").select("*").order("display_order"),
  ]);

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Gallery</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Uploads go to the Supabase Storage <code>media</code> bucket (create it as a public bucket first).
      </p>
      <GalleryManager categories={categories ?? []} items={(items ?? []) as any} />
    </div>
  );
}
