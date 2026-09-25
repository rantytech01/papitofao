import { createClient } from "@/lib/supabase/server";
import { HomepageSectionManager } from "@/components/admin/homepage-section-manager";

export default async function AdminHomepagePage() {
  const supabase = createClient();
  const { data: sections } = await supabase.from("homepage_sections").select("*").order("display_order");

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Homepage</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Add, reorder, hide, or publish any homepage section. The public homepage always reflects this order.
      </p>
      <HomepageSectionManager sections={sections ?? []} />
    </div>
  );
}
