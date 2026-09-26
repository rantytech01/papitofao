import { createClient } from "@/lib/supabase/server";
import { ContactButtons } from "@/components/contact-buttons";
import { ContactForm } from "@/components/contact-form";
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Globe } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact" };

// Maps a social_links.platform value to an icon. Falls back to a generic
// globe icon for anything not explicitly listed (e.g. TikTok, which lucide
// doesn't ship a dedicated icon for) rather than rendering nothing.
const SOCIAL_ICONS: Record<string, typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

function getSocialIcon(platform: string) {
  return SOCIAL_ICONS[platform.toLowerCase()] ?? Globe;
}

export default async function ContactPage() {
  const supabase = createClient();
  const [{ data: settings }, { data: social }] = await Promise.all([
    supabase.from("campaign_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("social_links").select("*").eq("is_enabled", true).order("display_order"),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="mb-10 font-display text-4xl font-extrabold text-campaign-navy">Contact</h1>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          {settings?.contact_description && (
            <p className="mb-6 text-campaign-navy/70">{settings.contact_description}</p>
          )}
          <ContactButtons settings={settings ?? null} />

          <dl className="mt-8 space-y-3 text-sm text-campaign-navy/70">
            {settings?.office_address && (
              <div>
                <dt className="font-semibold text-campaign-navy">Office</dt>
                <dd>{settings.office_address}</dd>
              </div>
            )}
            {settings?.office_hours && (
              <div>
                <dt className="font-semibold text-campaign-navy">Hours</dt>
                <dd>{settings.office_hours}</dd>
              </div>
            )}
          </dl>

          {social && social.length > 0 && (
            <div className="mt-8 flex gap-3">
              {social.map((s) => {
                const Icon = getSocialIcon(s.platform);
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.display_name || s.platform}
                    title={s.display_name || s.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-campaign-navy/5 text-campaign-navy transition-colors hover:bg-campaign-blue hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
