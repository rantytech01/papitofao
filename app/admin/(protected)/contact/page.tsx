import { createClient } from "@/lib/supabase/server";
import { ContactSettingsForm } from "@/components/admin/contact-settings-form";

export default async function AdminContactPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("campaign_settings").select("*").eq("id", 1).maybeSingle();

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Contact Settings</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        This is the single source of truth for every phone, WhatsApp, and email link on the site.
        Change it here and every button updates automatically — nothing is hardcoded elsewhere.
      </p>
      <ContactSettingsForm settings={settings ?? null} />
    </div>
  );
}
