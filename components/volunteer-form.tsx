"use client";

import { useState, useTransition } from "react";
import { submitVolunteerForm } from "@/app/actions/volunteer-form";
import { SuccessCelebration } from "@/components/success-celebration";
import { TurnstileWidget } from "@/components/turnstile-widget";

export function VolunteerForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);

  if (result?.ok) {
    return (
      <SuccessCelebration
        message="Thanks for stepping up! 🎉"
        subMessage="We've got your details and will be in touch about how to get involved."
      />
    );
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const res = await submitVolunteerForm(formData);
          setResult(res);
        });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="full_name" required placeholder="Full name" className="input" />
        <input name="phone" placeholder="Phone" className="input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="email" type="email" placeholder="Email" className="input" />
        <input name="area" placeholder="Your area / estate" className="input" />
      </div>
      <input name="preferred_involvement" placeholder="How would you like to help?" className="input" />
      <textarea name="message" placeholder="Anything else we should know?" rows={4} className="input" />

      {/* Honeypot: hidden from real visitors, tab-skipped, never filled by a human */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="volunteer-website">Website</label>
        <input id="volunteer-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <TurnstileWidget action="volunteer" />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-campaign-red px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Submitting…" : "Join the Movement"}
      </button>

      {result && !result.ok && <p className="text-sm font-medium text-campaign-red">{result.error}</p>}

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid rgba(7, 27, 58, 0.15);
          border-radius: 0.5rem;
          padding: 0.65rem 0.9rem;
          font-size: 0.95rem;
        }
        .input:focus {
          outline: 2px solid #ed1111;
          outline-offset: 1px;
        }
      `}</style>
    </form>
  );
}
