import { createClient } from "@/lib/supabase/server";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Site Settings</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Branding, theme colors, and SEO defaults used across the whole site.
      </p>
      <SiteSettingsForm settings={settings ?? null} />
    </div>
  );
}
