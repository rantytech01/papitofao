import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const platformLabel: Record<string, string> = {
  Facebook: "Facebook",
  Instagram: "Instagram",
  TikTok: "TikTok",
  X: "X",
  YouTube: "YouTube",
  LinkedIn: "LinkedIn",
};

export async function SiteFooter() {
  const supabase = createClient();
  const [{ data: footerSections }, { data: social }, { data: settings }, { data: candidate }] =
    await Promise.all([
      supabase.from("footer_sections").select("*").eq("is_visible", true).order("display_order"),
      supabase.from("social_links").select("*").eq("is_enabled", true).order("display_order"),
      supabase.from("site_settings").select("footer_copyright, website_name").eq("id", 1).maybeSingle(),
      supabase.from("candidate_profile").select("movement_tagline").eq("id", 1).maybeSingle(),
    ]);

  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-campaign-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-display text-xl font-bold">
            {settings?.website_name ?? "Campaign"}
          </p>
          {candidate?.movement_tagline && (
            <p className="mt-2 text-sm text-white/70">{candidate.movement_tagline}</p>
          )}
        </div>

        {(footerSections ?? []).map((section) => (
          <div key={section.id}>
            {section.heading && (
              <p className="mb-2 font-semibold text-white/90">{section.heading}</p>
            )}
            {section.content && (
              <p className="text-sm text-white/70 whitespace-pre-line">{section.content}</p>
            )}
          </div>
        ))}

        {social && social.length > 0 && (
          <div>
            <p className="mb-2 font-semibold text-white/90">Follow</p>
            <ul className="flex flex-wrap gap-3 text-sm text-white/70">
              {social.map((s) => (
                <li key={s.id}>
                  <Link href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    {s.display_name || platformLabel[s.platform] || s.platform}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60 md:px-6">
        {settings?.footer_copyright || `© ${year} ${settings?.website_name ?? "Campaign"}. All rights reserved.`}
      </div>
    </footer>
  );
}
