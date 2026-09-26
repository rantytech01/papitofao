import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const supabase = createClient();
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("gallery_categories").select("*").order("display_order"),
    supabase
      .from("gallery_items")
      .select("*")
      .eq("is_visible", true)
      .order("display_order"),
  ]);

  const grouped = new Map<string, any[]>();
  (items ?? []).forEach((item) => {
    const key = item.category_id ?? "uncategorized";
    grouped.set(key, [...(grouped.get(key) ?? []), item]);
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="mb-10 font-display text-4xl font-extrabold text-campaign-navy">Gallery</h1>

      {(!items || items.length === 0) && (
        <p className="text-campaign-navy/50">No images published yet. Upload from Admin → Gallery.</p>
      )}

      {(categories ?? []).map((cat) => {
        const catItems = grouped.get(cat.id);
        if (!catItems?.length) return null;
        return (
          <section key={cat.id} className="mb-12">
            <h2 className="mb-4 font-display text-xl font-bold text-campaign-navy">{cat.name}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {catItems.map((item) => (
                <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg shadow-sm">
                  <Image src={item.image_url} alt={item.caption ?? cat.name} fill className="object-cover object-top" />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
