import Image from "next/image";
import Link from "next/link";
import type { CandidateProfile, HomepageSection } from "@/lib/types";

export function Hero({
  candidate,
  section,
}: {
  candidate: CandidateProfile | null;
  section: HomepageSection | null;
}) {
  if (!candidate) return null;

  return (
    <section className="relative overflow-hidden bg-campaign-navy text-white">
      <div
        className="absolute inset-0 bg-gradient-to-br from-campaign-blue/40 via-campaign-navy to-campaign-navy"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/70">
            {candidate.movement_name}
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] md:text-6xl">
            {candidate.candidate_name}
          </h1>
          {candidate.candidate_title && (
            <p className="mt-2 text-xl text-white/85">{candidate.candidate_title}</p>
          )}
          <p className="mt-4 text-lg font-semibold text-campaign-red">
            {candidate.position} — {candidate.ward} · {candidate.election_year}
          </p>
          {(section?.description || candidate.hero_description) && (
            <p className="mt-5 max-w-md text-white/80">
              {section?.description || candidate.hero_description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {section?.button_text && section?.button_url && (
              <Link
                href={section.button_url}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-campaign-navy transition-transform hover:-translate-y-0.5"
              >
                {section.button_text}
              </Link>
            )}
            <Link
              href="/contact"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contact
            </Link>
          </div>
        </div>

        {candidate.profile_photo_url && (
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
            <div className="absolute -inset-3 -z-10 rounded-2xl bg-campaign-red/30" />
            <Image
              src={candidate.profile_photo_url}
              alt={candidate.candidate_name}
              fill
              priority
              className="rounded-2xl object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
