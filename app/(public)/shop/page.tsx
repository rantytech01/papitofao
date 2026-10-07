import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
import { CartBadge } from "@/components/cart-badge";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop" };

export default async function ShopPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="mb-2 font-display text-4xl font-extrabold text-campaign-navy">Shop</h1>
      <p className="mb-10 text-campaign-navy/70">
        Support the movement and show it — official TukoChama TukoPM merchandise.
      </p>

      {!products || products.length === 0 ? (
        <p className="text-campaign-navy/50">No items available right now — check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <CartBadge />
    </div>
  );
}
