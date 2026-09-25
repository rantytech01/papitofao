import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CountdownBar } from "@/components/countdown-bar";

export default async function PublicLayout({
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
    <>
      <SiteHeader
        navItems={nav ?? []}
        candidate={candidate ?? null}
        campaignSettings={campaignSettings ?? null}
      />
      {campaignSettings?.election_date && (
        <CountdownBar
          electionDate={campaignSettings.election_date}
          ward={candidate?.ward ?? "the Ward"}
        />
      )}
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
