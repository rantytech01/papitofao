"use client";

import { useFormState, useFormStatus } from "react-dom";
import { joinAsMember, type JoinFormState } from "@/app/actions/members";
import { SuccessCelebration } from "@/components/success-celebration";

const initialState: JoinFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-campaign-red px-7 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {pending ? "Joining..." : "Join the Movement"}
    </button>
  );
}

export default function JoinPage() {
  const [state, formAction] = useFormState(joinAsMember, initialState);

  if (state.status === "success") {
    return (
      <section className="mx-auto max-w-lg px-4 py-16 md:py-20">
        <SuccessCelebration message="Welcome to the movement! 🎉" subMessage={state.message} />
        <p className="mt-2 text-center text-sm text-campaign-navy/60">
          <a href="/" className="font-semibold text-campaign-blue hover:underline">
            ← Back to the homepage
          </a>
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-16 md:py-20">
      <h1 className="font-display text-3xl font-extrabold text-campaign-navy md:text-4xl">
        Become a Member
      </h1>
      <p className="mt-2 text-campaign-navy/70">
        Join the movement — it takes less than a minute.
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold text-campaign-navy">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            required
            className="mt-1 w-full rounded-lg border border-campaign-navy/20 px-4 py-2.5 outline-none focus:border-campaign-red"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-campaign-navy">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="mt-1 w-full rounded-lg border border-campaign-navy/20 px-4 py-2.5 outline-none focus:border-campaign-red"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-campaign-navy">
            Email (optional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-campaign-navy/20 px-4 py-2.5 outline-none focus:border-campaign-red"
          />
        </div>

        <div>
          <label htmlFor="ward" className="block text-sm font-semibold text-campaign-navy">
            Ward / area (optional)
          </label>
          <input
            id="ward"
            name="ward"
            className="mt-1 w-full rounded-lg border border-campaign-navy/20 px-4 py-2.5 outline-none focus:border-campaign-red"
          />
        </div>

        <SubmitButton />

        {state.status === "error" && (
          <p className="text-sm font-semibold text-campaign-red" role="alert">
            {state.message}
          </p>
        )}
      </form>
    </section>
  );
}
