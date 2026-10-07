import { createClient } from "@/lib/supabase/server";
import { OrdersManager } from "@/components/admin/orders-manager";

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Orders</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Check each M-Pesa code against your actual Paybill/Till statement before marking an order Confirmed.
      </p>
      <OrdersManager orders={(orders ?? []) as any} />
    </div>
  );
}
