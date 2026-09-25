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

  // Split the candidate's name onto two stacked lines the way the party site
  // stacks "TukoChama / TukoPM" — first word(s) navy, last word red.
  const nameParts = candidate.candidate_name.trim().split(" ");
  const firstLine = nameParts.slice(0, -1).join(" ") || nameParts[0];
  const lastLine = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-6 md:py-20">
        <div>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
            <span className="block text-campaign-navy">{firstLine}</span>
            {lastLine && <span className="block text-campaign-red">{lastLine}</span>}
          </h1>

          <p className="mt-5 max-w-md text-lg text-campaign-navy/70">
            {section?.description || candidate.hero_description || `Welcome to the ${candidate.movement_name} campaign.`}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/volunteer"
              className="rounded-full bg-campaign-red px-7 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Get Involved
            </Link>
            <Link
              href={section?.button_url || "/about"}
              className="rounded-full bg-campaign-navy px-7 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            >
              {section?.button_text || "Learn About Newton"}
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-campaign-blue">
            <Link href="/volunteer" className="hover:underline">Volunteer →</Link>
            <Link href="/contact" className="hover:underline">Contact →</Link>
            <Link href="/events" className="hover:underline">Events →</Link>
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
            <div className="flex h-full w-full items-center justify-center bg-campaign-blue text-white">
              <span className="font-display text-2xl font-bold">{candidate.candidate_name}</span>
            </div>
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
