import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { WardMapSection } from "@/components/ward-map-section";

export const dynamic = "force-dynamic";
export const metadata = { title: "Community" };

export default async function CommunityPage() {
  const supabase = createClient();
  const [{ data: items }, { data: locations }] = await Promise.all([
    supabase.from("community_sections").select("*").eq("status", "published").order("display_order"),
    supabase.from("ward_locations").select("*").eq("is_visible", true).order("display_order"),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="mb-4 font-display text-4xl font-extrabold text-campaign-navy">Community</h1>

      <div className="mb-12">
        <p className="mb-4 text-sm text-campaign-navy/60">
          Explore Roysambu Ward — tap a marker to see what&apos;s there.
        </p>
        <WardMapSection locations={(locations ?? []) as any} />
      </div>

      {(!items || items.length === 0) && (
        <p className="text-campaign-navy/50">
          No community content published yet. Add it from Admin → Community.
        </p>
      )}

      <div className="space-y-10">
        {(items ?? []).map((item) => (
          <div
            key={item.id}
            className={`grid gap-6 md:grid-cols-2 md:items-center ${
              item.is_featured ? "rounded-xl bg-campaign-navy/[0.03] p-6" : ""
            }`}
          >
            {item.image_url && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-sm">
                <Image src={item.image_url} alt={item.title} fill className="object-cover object-top" />
              </div>
            )}
            <div>
              <h2 className="mb-2 font-display text-2xl font-bold text-campaign-navy">{item.title}</h2>
              {item.description && <p className="text-campaign-navy/70">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
