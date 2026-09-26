import Image from "next/image";
import Link from "next/link";
import type { CandidateProfile, HomepageSection } from "@/lib/types";
import { HeroPlaceholder } from "@/components/hero-placeholder";

/**
 * TEMPORARY: headline, subtext, second button, and the three quick-links
 * below are hardcoded to match the party site 1:1, per explicit request
 * (get the layout/visual match first, wire Papito-specific copy in later).
 * Everything marked below is a good candidate to move into
 * homepage_sections fields (or new columns) once the wording is final —
 * the first button and image already pull from the CMS.
 */
export function Hero({
  candidate,
  section,
}: {
  candidate: CandidateProfile | null;
  section: HomepageSection | null;
}) {
  if (!candidate) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-6 md:py-20">
        <div>
          {/* HARDCODED — replace with Papito's own headline when ready */}
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
            <span className="block text-campaign-navy">TukoChama</span>
            <span className="block text-campaign-red">TukoPM</span>
          </h1>

          {/* HARDCODED subtext to match party site — swap for candidate.hero_description later */}
          <p className="mt-5 max-w-md text-lg text-campaign-navy/70">
            Welcome to PM Party, the People&apos;s Movement.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/volunteer"
              className="rounded-full bg-campaign-red px-7 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Become a Member
            </Link>
            {/* HARDCODED second button — schema only has one button slot today */}
            <Link
              href="/volunteer"
              className="rounded-full bg-campaign-navy px-7 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Apply as Aspirant
            </Link>
          </div>

          {/* HARDCODED quick links to match party site's Donate/Volunteer/Member Login row */}
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-campaign-blue">
            <Link href="/contact" className="border-b border-campaign-red pb-0.5 hover:opacity-80">Donate →</Link>
            <Link href="/volunteer" className="border-b border-campaign-blue pb-0.5 hover:opacity-80">Volunteer →</Link>
            <Link href="/admin/login" className="border-b border-campaign-blue pb-0.5 hover:opacity-80">Member Login →</Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl border-4 border-white shadow-xl">
          {candidate.profile_photo_url ? (
            <>
              <Image
                src={candidate.profile_photo_url}
                alt={candidate.candidate_name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-campaign-blue/60 via-campaign-blue/10 to-transparent" />
            </>
          ) : (
            <HeroPlaceholder label={candidate.movement_name || "PEOPLE'S MOVEMENT"} />
          )}
          <div className="absolute bottom-4 left-4 rounded-lg bg-white/95 px-4 py-2 shadow">
            <p className="text-xs font-semibold uppercase tracking-wide text-campaign-red">
              {candidate.position} — {candidate.ward}
            </p>
            {candidate.candidate_title && (
              <p className="text-sm font-bold text-campaign-navy">{candidate.candidate_title}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
