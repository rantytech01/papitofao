import { createClient } from "@/lib/supabase/server";
import { ProductsManager } from "@/components/admin/products-manager";

export default async function AdminMerchandisePage() {
  const supabase = createClient();
  const { data: products } = await supabase.from("products").select("*").order("display_order");

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Merchandise</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Products shown on the public /shop page. Don't forget to set your Paybill/Till number in Site Settings, or
        checkout won't work.
      </p>
      <ProductsManager products={(products ?? []) as any} />
    </div>
  );
}
