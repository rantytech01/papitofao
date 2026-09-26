import { createClient } from "@/lib/supabase/server";
import { WardMapManager } from "@/components/admin/ward-map-manager";

export default async function AdminWardMapPage() {
  const supabase = createClient();
  const { data: locations } = await supabase.from("ward_locations").select("*").order("display_order");

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Ward Map</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Add real landmarks, markets, schools, offices, and polling stations so residents can find
        themselves on the Community page map.
      </p>
      <WardMapManager locations={(locations ?? []) as any} />
    </div>
  );
}
