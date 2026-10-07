import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/checkout-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("campaign_settings")
    .select("mpesa_paybill, mpesa_till, mpesa_account_name, payment_instructions")
    .eq("id", 1)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="mb-8 font-display text-4xl font-extrabold text-campaign-navy">Checkout</h1>
      <CheckoutForm settings={settings ?? null} />
    </div>
  );
}
