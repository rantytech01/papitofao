import { createClient } from "@/lib/supabase/server";
import { FooterManager } from "@/components/admin/footer-manager";

export default async function AdminFooterPage() {
  const supabase = createClient();
  const { data: sections } = await supabase.from("footer_sections").select("*").order("display_order");

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Footer</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Add as many footer columns as you need — headings, links, or plain text.
      </p>
      <FooterManager sections={sections ?? []} />
    </div>
  );
}
