"use client";

import { useEffect, useState } from "react";
import { castVote, getPollResults } from "@/app/actions/polls";
import { SuccessCelebration } from "@/components/success-celebration";

interface Option {
  id: string;
  label: string;
}
interface Result {
  option_id: string;
  label: string;
  votes: number;
}

function getVoterToken() {
  const key = "poll_voter_token";
  let token = localStorage.getItem(key);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(key, token);
  }
  return token;
}

export function PollWidget({
  pollId,
  question,
  status,
  options,
  initialResults,
}: {
  pollId: string;
  question: string;
  status: "active" | "closed";
  options: Option[];
  initialResults: Result[];
}) {
  const [results, setResults] = useState<Result[]>(initialResults);
  const [hasVoted, setHasVoted] = useState(false);
  const [justVoted, setJustVoted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHasVoted(!!localStorage.getItem(`poll_voted_${pollId}`));
  }, [pollId]);

  const totalVotes = results.reduce((sum, r) => sum + Number(r.votes), 0);
  const showResults = hasVoted || status === "closed";

  async function handleVote() {
    if (!selected) return;
    setSubmitting(true);
    setError(null);

    const token = getVoterToken();
    const res = await castVote(pollId, selected, token);

    if (res.status === "error") {
      setError(res.message ?? "Something went wrong.");
      if (res.message?.includes("already voted")) {
        localStorage.setItem(`poll_voted_${pollId}`, "1");
        setHasVoted(true);
        const fresh = await getPollResults(pollId);
        setResults(fresh);
      }
      setSubmitting(false);
      return;
    }

    localStorage.setItem(`poll_voted_${pollId}`, "1");
    setHasVoted(true);
    setJustVoted(true);
    const fresh = await getPollResults(pollId);
    setResults(fresh);
    setSubmitting(false);
  }

  return (
    <div className="rounded-xl border border-campaign-navy/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-campaign-navy/40">
        Community feedback{status === "closed" ? " · Closed" : ""}
      </p>
      <h2 className="mt-1 font-display text-xl font-bold text-campaign-navy">{question}</h2>

      {justVoted ? (
        <SuccessCelebration
          message="Thanks for your feedback! 🎉"
          subMessage="Your response has been counted."
          onDone={() => setJustVoted(false)}
        />
      ) : showResults ? (
        <div className="mt-5 space-y-3">
          {results.map((r) => {
            const pct = totalVotes > 0 ? Math.round((Number(r.votes) / totalVotes) * 100) : 0;
            return (
              <div key={r.option_id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-campaign-navy/80">{r.label}</span>
                  <span className="font-semibold text-campaign-navy">{pct}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-campaign-navy/10">
                  <div className="h-full rounded-full bg-campaign-blue transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          <p className="pt-1 text-xs text-campaign-navy/40">
            {totalVotes} response{totalVotes === 1 ? "" : "s"} so far · informal community feedback, not a scientific
            survey
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {options.map((opt) => (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm ${
                selected === opt.id
                  ? "border-campaign-blue bg-campaign-blue/5 font-semibold text-campaign-blue"
                  : "border-campaign-navy/10 text-campaign-navy/80 hover:bg-campaign-navy/[0.02]"
              }`}
            >
              <input
                type="radio"
                name={`poll-${pollId}`}
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => setSelected(opt.id)}
                className="accent-campaign-blue"
              />
              {opt.label}
            </label>
          ))}

          <button
            onClick={handleVote}
            disabled={!selected || submitting}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-campaign-red px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>

          {error && <p className="text-sm font-medium text-campaign-red">{error}</p>}
        </div>
      )}
    </div>
  );
}
