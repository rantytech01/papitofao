"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { setVolunteerStatus, deleteVolunteer } from "@/app/actions/volunteers";

interface Volunteer {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  area: string | null;
  preferred_involvement: string | null;
  message: string | null;
  status: "new" | "contacted" | "processed" | "archived";
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-campaign-blue/10 text-campaign-blue",
  contacted: "bg-amber-100 text-amber-700",
  processed: "bg-green-100 text-green-700",
  archived: "bg-campaign-navy/10 text-campaign-navy/60",
};

export function VolunteersManager({ volunteers }: { volunteers: Volunteer[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      {volunteers.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No volunteer submissions yet.</p>
      ) : (
        <div className="space-y-3">
          {volunteers.map((v) => (
            <div key={v.id} className="rounded-lg border border-campaign-navy/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-campaign-navy">
                    {v.full_name}{" "}
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[v.status]}`}>{v.status}</span>
                  </p>
                  <p className="text-xs text-campaign-navy/50">
                    {[v.phone, v.email, v.area].filter(Boolean).join(" · ")} · {new Date(v.created_at).toLocaleString("en-KE")}
                  </p>
                  {v.preferred_involvement && <p className="mt-1 text-sm text-campaign-navy/80">Wants to help with: {v.preferred_involvement}</p>}
                  {v.message && <p className="mt-1 text-sm text-campaign-navy/60">{v.message}</p>}
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <select
                    defaultValue={v.status}
                    onChange={(e) => startTransition(() => setVolunteerStatus(v.id, e.target.value as any))}
                    className="admin-field w-auto text-xs"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="processed">Processed</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button onClick={() => { if (confirm("Delete this submission?")) startTransition(() => deleteVolunteer(v.id)); }} className="p-1.5 text-campaign-red/70 hover:text-campaign-red">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
