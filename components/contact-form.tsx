"use client";

import { useState, useTransition } from "react";
import { submitContactMessage } from "@/app/actions/contact-form";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const res = await submitContactMessage(formData);
          setResult(res);
        });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Full name" className="input" />
        <input name="phone" placeholder="Phone" className="input" />
      </div>
      <input name="email" type="email" placeholder="Email" className="input" />
      <input name="subject" placeholder="Subject" className="input" />
      <textarea name="message" required placeholder="Your message" rows={5} className="input" />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-campaign-blue px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send Message"}
      </button>

      {result?.ok && (
        <p className="text-sm font-medium text-green-700">Message sent. We&apos;ll get back to you.</p>
      )}
      {result && !result.ok && (
        <p className="text-sm font-medium text-campaign-red">{result.error}</p>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid rgba(7, 27, 58, 0.15);
          border-radius: 0.5rem;
          padding: 0.65rem 0.9rem;
          font-size: 0.95rem;
        }
        .input:focus {
          outline: 2px solid #0757d5;
          outline-offset: 1px;
        }
      `}</style>
    </form>
  );
}
