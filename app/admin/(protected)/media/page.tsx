import { createClient } from "@/lib/supabase/server";
import { MediaLibrary } from "@/components/admin/media-library";

export default async function AdminMediaPage() {
  const supabase = createClient();
  const { data: items } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Media Library</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Central place for candidate photos, logos, and any other file used across the site.
      </p>
      <MediaLibrary items={items ?? []} />
    </div>
  );
}
