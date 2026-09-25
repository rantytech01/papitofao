import { createClient } from "@/lib/supabase/server";
import { CandidateForm } from "@/components/admin/candidate-form";

export default async function AdminCandidatePage() {
  const supabase = createClient();
  const { data: candidate } = await supabase.from("candidate_profile").select("*").eq("id", 1).maybeSingle();

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Candidate Profile</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Drives the hero section, header, and metadata across the whole site.
      </p>
      <CandidateForm candidate={candidate ?? null} />
    </div>
  );
}
