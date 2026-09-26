"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { createPoll, setPollStatus, deletePoll, addPollOption, deletePollOption } from "@/app/actions/polls";

interface Option {
  id: string;
  label: string;
}
interface Poll {
  id: string;
  question: string;
  status: "draft" | "active" | "closed";
  poll_options: Option[];
}

const statusColors: Record<string, string> = {
  draft: "bg-campaign-navy/10 text-campaign-navy/60",
  active: "bg-green-100 text-green-700",
  closed: "bg-amber-100 text-amber-700",
};

function PollRow({ poll }: { poll: Poll }) {
  const [newOption, setNewOption] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-lg border border-campaign-navy/10 p-4">
      <div className="flex items-start justify-between gap-4">
        <p className="font-medium text-campaign-navy">
          {poll.question}{" "}
          <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[poll.status]}`}>
            {poll.status}
          </span>
        </p>
        <div className="flex flex-shrink-0 items-center gap-2">
          <select
            defaultValue={poll.status}
            onChange={(e) => startTransition(() => setPollStatus(poll.id, e.target.value as any))}
            className="admin-field w-auto text-xs"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
          <button
            onClick={() => {
              if (confirm("Delete this poll and all its votes?")) startTransition(() => deletePoll(poll.id));
            }}
            className="p-1.5 text-campaign-red/70 hover:text-campaign-red"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 pl-1">
        {poll.poll_options.map((opt) => (
          <div key={opt.id} className="flex items-center justify-between text-sm text-campaign-navy/80">
            <span>• {opt.label}</span>
            <button onClick={() => startTransition(() => deletePollOption(opt.id))} className="text-campaign-red/60 hover:text-campaign-red">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Add an option..."
          className="admin-field flex-1 text-sm"
        />
        <button
          onClick={() => {
            if (!newOption.trim()) return;
            startTransition(() => addPollOption(poll.id, newOption));
            setNewOption("");
          }}
          className="admin-btn-secondary px-3 py-1.5 text-xs"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export function PollsManager({ polls }: { polls: Poll[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      <form
        action={(fd) =>
          startTransition(async () => {
            await createPoll(fd);
            (document.getElementById("poll-add-form") as HTMLFormElement)?.reset();
          })
        }
        id="poll-add-form"
        className="mb-6 flex gap-2 border-b border-campaign-navy/10 pb-6"
      >
        <input
          name="question"
          placeholder='Poll question (e.g. "What should receive more attention in your area?")'
          required
          className="admin-field flex-1"
        />
        <button type="submit" disabled={isPending} className="admin-btn-primary w-fit">
          + New Poll
        </button>
      </form>

      {polls.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No polls yet. Create one above, then add options to it.</p>
      ) : (
        <div className="space-y-4">
          {polls.map((p) => (
            <PollRow key={p.id} poll={p} />
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-campaign-navy/40">
        A poll only shows up on the public /polls page once it has at least 2 options and its status is set to
        "Active."
      </p>
    </div>
  );
}
