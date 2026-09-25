import { createClient } from "@/lib/supabase/server";
import { AboutSectionManager } from "@/components/admin/about-section-manager";

export default async function AdminAboutPage() {
  const supabase = createClient();
  const { data: sections } = await supabase.from("about_sections").select("*").order("display_order");

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">About Page</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Create unlimited sections for the public About page. Nothing here is hardcoded in the frontend.
      </p>
      <AboutSectionManager sections={sections ?? []} />
    </div>
  );
}
