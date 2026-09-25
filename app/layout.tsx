import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  const { data: candidate } = await supabase
    .from("candidate_profile")
    .select("candidate_name, movement_tagline")
    .eq("id", 1)
    .maybeSingle();

  const title =
    settings?.seo_title ||
    settings?.website_title ||
    candidate?.candidate_name ||
    "Campaign Website";
  const description =
    settings?.seo_description ||
    settings?.website_description ||
    candidate?.movement_tagline ||
    undefined;

  return {
    title: { default: title, template: `%s | ${title}` },
    description,
    metadataBase: settings?.canonical_url
      ? new URL(settings.canonical_url)
      : undefined,
    icons: settings?.favicon_url ? [{ url: settings.favicon_url }] : undefined,
    openGraph: {
      title,
      description,
      images: settings?.social_share_image_url
        ? [settings.social_share_image_url]
        : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const [{ data: nav }, { data: candidate }, { data: campaignSettings }] =
    await Promise.all([
      supabase
        .from("navigation_items")
        .select("*")
        .eq("is_visible", true)
        .order("display_order"),
      supabase.from("candidate_profile").select("*").eq("id", 1).maybeSingle(),
      supabase.from("campaign_settings").select("*").eq("id", 1).maybeSingle(),
    ]);

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <SiteHeader
          navItems={nav ?? []}
          candidate={candidate ?? null}
          campaignSettings={campaignSettings ?? null}
        />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
