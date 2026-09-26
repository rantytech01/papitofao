"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { setMemberStatus, deleteMember } from "@/app/actions/members";

interface Member {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  ward: string | null;
  status: "active" | "archived";
  created_at: string;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  archived: "bg-campaign-navy/10 text-campaign-navy/60",
};

export function MembersManager({ members }: { members: Member[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      {members.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No members have joined yet.</p>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.id} className="rounded-lg border border-campaign-navy/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-campaign-navy">
                    {m.full_name}{" "}
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[m.status]}`}>
                      {m.status}
                    </span>
                  </p>
                  <p className="text-xs text-campaign-navy/50">
                    {[m.phone, m.email, m.ward].filter(Boolean).join(" · ")} ·{" "}
                    {new Date(m.created_at).toLocaleString("en-KE")}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <select
                    defaultValue={m.status}
                    onChange={(e) => startTransition(() => setMemberStatus(m.id, e.target.value as any))}
                    className="admin-field w-auto text-xs"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button
                    onClick={() => {
                      if (confirm("Delete this member?")) startTransition(() => deleteMember(m.id));
                    }}
                    className="p-1.5 text-campaign-red/70 hover:text-campaign-red"
                  >
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
