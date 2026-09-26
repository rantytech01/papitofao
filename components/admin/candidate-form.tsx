"use client";

import { useState, useTransition } from "react";
import { updateCandidateProfile } from "@/app/actions/candidate";
import type { CandidateProfile } from "@/lib/types";

export function CandidateForm({ candidate }: { candidate: CandidateProfile | null }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={(formData) => {
        setSaved(false);
        setError(null);
        startTransition(async () => {
          const res = await updateCandidateProfile(formData);
          if (res.ok) setSaved(true);
          else setError(res.error ?? "Failed to save.");
        });
      }}
      className="admin-card max-w-3xl space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="admin-label">Candidate name</label>
          <input name="candidate_name" defaultValue={candidate?.candidate_name} required className="admin-field" />
        </div>
        <div>
          <label className="admin-label">Candidate identity / title</label>
          <input name="candidate_title" defaultValue={candidate?.candidate_title ?? ""} className="admin-field" />
        </div>
        <div>
          <label className="admin-label">Position</label>
          <input name="position" defaultValue={candidate?.position} required className="admin-field" />
        </div>
        <div>
          <label className="admin-label">Ward</label>
          <input name="ward" defaultValue={candidate?.ward} required className="admin-field" />
        </div>
        <div>
          <label className="admin-label">Election year</label>
          <input
            name="election_year"
            type="number"
            defaultValue={candidate?.election_year}
            required
            className="admin-field"
          />
        </div>
        <div>
          <label className="admin-label">Movement name</label>
          <input name="movement_name" defaultValue={candidate?.movement_name} required className="admin-field" />
        </div>
        <div>
          <label className="admin-label">Movement tagline</label>
          <input name="movement_tagline" defaultValue={candidate?.movement_tagline ?? ""} className="admin-field" />
        </div>
        <div>
          <label className="admin-label">Slogan</label>
          <input name="slogan" defaultValue={candidate?.slogan ?? ""} className="admin-field" />
        </div>
      </div>

      <div>
        <label className="admin-label">Hero description</label>
        <textarea
          name="hero_description"
          defaultValue={candidate?.hero_description ?? ""}
          rows={2}
          className="admin-field"
        />
      </div>
      <div>
        <label className="admin-label">Short biography</label>
        <textarea
          name="short_biography"
          defaultValue={candidate?.short_biography ?? ""}
          rows={3}
          className="admin-field"
        />
      </div>
      <div>
        <label className="admin-label">Full biography</label>
        <textarea
          name="full_biography"
          defaultValue={candidate?.full_biography ?? ""}
          rows={6}
          className="admin-field"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="admin-label">Profile photo URL</label>
          <input name="profile_photo_url" defaultValue={candidate?.profile_photo_url ?? ""} className="admin-field" />
          {!candidate?.profile_photo_url && (
            <p className="mt-1 text-xs font-medium text-amber-600">
              Empty — the homepage hero is showing an illustrated placeholder instead of a real photo.
            </p>
          )}
        </div>
        <div>
          <label className="admin-label">Candidate logo URL</label>
          <input name="logo_url" defaultValue={candidate?.logo_url ?? ""} className="admin-field" />
        </div>
        <div>
          <label className="admin-label">Movement logo URL</label>
          <input name="movement_logo_url" defaultValue={candidate?.movement_logo_url ?? ""} className="admin-field" />
        </div>
      </div>
      <p className="text-xs text-campaign-navy/50">
        Upload images from Admin → Media, then paste the resulting URL here.
      </p>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isPending} className="admin-btn-primary">
          {isPending ? "Saving…" : "Save Changes"}
        </button>
        {saved && <span className="text-sm text-green-700">Saved.</span>}
        {error && <span className="text-sm text-campaign-red">{error}</span>}
      </div>
    </form>
  );
}
