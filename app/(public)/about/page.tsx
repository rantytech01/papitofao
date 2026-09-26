import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { AboutSection } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "About" };

export default async function AboutPage() {
  const supabase = createClient();
  const { data: sections } = await supabase
    .from("about_sections")
    .select("*")
    .eq("status", "published")
    .eq("is_visible", true)
    .order("display_order");

  const list = (sections ?? []) as AboutSection[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <h1 className="mb-10 font-display text-4xl font-extrabold text-campaign-navy">About</h1>

      {list.length === 0 && (
        <p className="text-campaign-navy/50">
          Content for this page hasn&apos;t been published yet. Add sections from Admin → About.
        </p>
      )}

      <div className="space-y-14">
        {list.map((section) => {
          const hasImage = !!section.image_url && section.image_position !== "none";
          const imageFirst = section.image_position === "left";

          return (
            <section
              key={section.id}
              className={
                hasImage && (section.image_position === "left" || section.image_position === "right")
                  ? "grid gap-8 md:grid-cols-2 md:items-center"
                  : ""
              }
            >
              {hasImage && imageFirst && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-sm">
                  <Image src={section.image_url!} alt={section.title} fill className="object-cover object-top" />
                </div>
              )}

              <div>
                {section.subtitle && (
                  <p className="mb-1 text-sm font-semibold text-campaign-red">{section.subtitle}</p>
                )}
                <h2 className="mb-4 font-display text-2xl font-bold text-campaign-navy">
                  {section.title}
                </h2>
                {hasImage && section.image_position === "top" && (
                  <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-xl shadow-sm">
                    <Image src={section.image_url!} alt={section.title} fill className="object-cover object-top" />
                  </div>
                )}
                {section.content && (
                  <div
                    className="prose-campaign"
                    // Content is sanitized server-side on save (see admin/about action) before storage.
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                )}
              </div>

              {hasImage && !imageFirst && section.image_position === "right" && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-sm">
                  <Image src={section.image_url!} alt={section.title} fill className="object-cover object-top" />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
