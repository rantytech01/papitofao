import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Priorities" };

export default async function PrioritiesPage() {
  const supabase = createClient();
  const { data: items } = await supabase
    .from("priorities")
    .select("*")
    .eq("status", "published")
    .order("display_order");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="mb-10 font-display text-4xl font-extrabold text-campaign-navy">Priorities</h1>

      {(!items || items.length === 0) && (
        <p className="text-campaign-navy/50">
          No priorities published yet. Add them from Admin → Priorities.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(items ?? []).map((item) => (
          <div key={item.id} className="rounded-xl border border-campaign-navy/10 p-5">
            {item.image_url && (
              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg">
                <Image src={item.image_url} alt={item.title} fill className="object-cover" />
              </div>
            )}
            {item.category && (
              <p className="mb-1 text-xs font-semibold uppercase text-campaign-blue">{item.category}</p>
            )}
            <h2 className="mb-2 font-display text-lg font-bold text-campaign-navy">{item.title}</h2>
            {item.short_description && (
              <p className="text-sm text-campaign-navy/70">{item.short_description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
