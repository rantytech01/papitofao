import { createClient } from "@/lib/supabase/server";
import { NavigationManager } from "@/components/admin/navigation-manager";

export default async function AdminNavigationPage() {
  const supabase = createClient();
  const { data: items } = await supabase.from("navigation_items").select("*").order("display_order");

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Navigation</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Controls the header menu on every page. Changes apply immediately.
      </p>
      <NavigationManager items={items ?? []} />
    </div>
  );
}
