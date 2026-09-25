"use client";

import { Suspense, useTransition, useState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "@/app/actions/auth";

function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl">
      <h1 className="mb-1 font-display text-2xl font-bold text-campaign-navy">Campaign Admin</h1>
      <p className="mb-6 text-sm text-campaign-navy/60">Sign in to manage the website.</p>

      <form
        action={(formData) => {
          setError(null);
          formData.set("next", next);
          startTransition(async () => {
            const res = await login(formData);
            if (res && !res.ok) setError(res.error ?? "Something went wrong.");
          });
        }}
        className="space-y-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-campaign-navy">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-campaign-navy/15 px-3 py-2 text-sm focus:outline-campaign-blue"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-campaign-navy">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-campaign-navy/15 px-3 py-2 text-sm focus:outline-campaign-blue"
          />
        </div>

        {error && <p className="text-sm font-medium text-campaign-red">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-campaign-blue py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-campaign-navy px-4">
      <Suspense fallback={<div className="text-white/70">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
