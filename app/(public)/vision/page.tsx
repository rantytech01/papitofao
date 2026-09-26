import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Vision" };

export default async function VisionPage() {
  const supabase = createClient();
  const { data: items } = await supabase
    .from("vision_sections")
    .select("*")
    .eq("status", "published")
    .order("display_order");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="mb-10 font-display text-4xl font-extrabold text-campaign-navy">Vision</h1>

      {(!items || items.length === 0) && (
        <p className="text-campaign-navy/50">
          No vision statements published yet. Add them from Admin → Vision.
        </p>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {(items ?? []).map((item) => (
          <div key={item.id} className="rounded-xl border border-campaign-navy/10 p-6">
            {item.image_url && (
              <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg">
                <Image src={item.image_url} alt={item.title} fill className="object-cover" />
              </div>
            )}
            <h2 className="mb-2 font-display text-xl font-bold text-campaign-navy">{item.title}</h2>
            {item.description && <p className="text-campaign-navy/70">{item.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
