import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supporterName = searchParams.get("name")?.slice(0, 60) || null;
  const note = searchParams.get("note")?.slice(0, 120) || null;

  const supabase = createClient();
  const [{ data: candidate }, { data: settings }] = await Promise.all([
    supabase.from("candidate_profile").select("*").eq("id", 1).maybeSingle(),
    supabase.from("site_settings").select("website_name, canonical_url").eq("id", 1).maybeSingle(),
  ]);

  const candidateName = candidate?.candidate_name || "the campaign";
  const position = candidate?.position || "";
  const ward = candidate?.ward || "";
  const movementName = candidate?.movement_name || "";
  const movementTagline = candidate?.movement_tagline || "";
  const siteHandle =
    (settings?.canonical_url || process.env.NEXT_PUBLIC_SITE_URL || "")
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "") || settings?.website_name || "";

  const headline = supporterName
    ? `${supporterName} is backing`
    : "I'm backing";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1350px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 80px",
          backgroundColor: "#111827",
          backgroundImage:
            "linear-gradient(160deg, #003491 0%, #111827 55%, #111827 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Diagonal red accent band */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "18px",
            backgroundColor: "#F0181E",
            display: "flex",
          }}
        />

        {/* Top: movement branding */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "30px" }}>
          {movementName && (
            <div style={{ fontSize: 34, fontWeight: 700, color: "#FFFFFF", letterSpacing: 1, display: "flex" }}>
              {movementName.toUpperCase()}
            </div>
          )}
          {movementTagline && (
            <div style={{ fontSize: 24, color: "#F0181E", fontWeight: 700, marginTop: 8, display: "flex" }}>
              {movementTagline}
            </div>
          )}
        </div>

        {/* Middle: candidate photo + name */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {candidate?.profile_photo_url && (
            <img
              src={candidate.profile_photo_url}
              width={340}
              height={340}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "top",
                border: "8px solid #FFFFFF",
                marginBottom: "40px",
              }}
            />
          )}

          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.75)", fontWeight: 600, display: "flex" }}>
            {headline}
          </div>
          <div
            style={{
              fontSize: 74,
              fontWeight: 800,
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.05,
              marginTop: 10,
              display: "flex",
            }}
          >
            {candidateName}
          </div>
          {(position || ward) && (
            <div style={{ fontSize: 32, fontWeight: 700, color: "#F0181E", marginTop: 18, display: "flex" }}>
              {position}
              {position && ward ? " — " : ""}
              {ward}
            </div>
          )}
          {note && (
            <div
              style={{
                fontSize: 24,
                color: "rgba(255,255,255,0.7)",
                marginTop: 24,
                textAlign: "center",
                maxWidth: "800px",
                display: "flex",
              }}
            >
              {note}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px" }}>
          <div
            style={{
              width: "90px",
              height: "4px",
              backgroundColor: "#F0181E",
              borderRadius: "2px",
              marginBottom: "18px",
              display: "flex",
            }}
          />
          {siteHandle && (
            <div style={{ fontSize: 22, color: "rgba(255,255,255,0.55)", display: "flex" }}>{siteHandle}</div>
          )}
        </div>
      </div>
    ),
    { width: 1080, height: 1350 }
  );
}
