import { createClient } from "@/lib/supabase/server";
import { SocialLinksManager } from "@/components/admin/social-links-manager";

export default async function AdminSocialPage() {
  const supabase = createClient();
  const { data: links } = await supabase.from("social_links").select("*").order("display_order");

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Social Media</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Add unlimited accounts. URLs are never hardcoded in the header or footer.
      </p>
      <SocialLinksManager links={links ?? []} />
    </div>
  );
}
