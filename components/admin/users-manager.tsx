"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { inviteAdminUser, updateAdminRole, removeAdminUser } from "@/app/actions/users";

interface AdminUser {
  id: string;
  full_name: string;
  role: "super_admin" | "editor";
}

export function UsersManager({ users, isSuperAdmin }: { users: AdminUser[]; isSuperAdmin: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!isSuperAdmin) {
    return (
      <div className="admin-card">
        <p className="text-sm text-campaign-navy/60">
          Only Super Admins can view and manage other admin users.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <form
        action={(fd) => startTransition(async () => {
          const res = await inviteAdminUser(fd);
          if (!res.ok) setError(res.error ?? "Failed to invite user.");
          else { setError(null); (document.getElementById("invite-form") as HTMLFormElement)?.reset(); }
        })}
        id="invite-form"
        className="mb-6 grid gap-2 border-b border-campaign-navy/10 pb-6 sm:grid-cols-4"
      >
        <input name="full_name" placeholder="Full name" className="admin-field" />
        <input name="email" type="email" placeholder="Email" required className="admin-field" />
        <select name="role" className="admin-field">
          <option value="editor">Editor</option>
          <option value="super_admin">Super Admin</option>
        </select>
        <button type="submit" disabled={isPending} className="admin-btn-primary">+ Invite</button>
      </form>
      {error && <p className="mb-4 text-sm text-campaign-red">{error}</p>}

      {users.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No admin users yet.</p>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-lg border border-campaign-navy/10 p-3">
              <span className="font-medium text-campaign-navy">{u.full_name}</span>
              <div className="flex items-center gap-2">
                <select
                  defaultValue={u.role}
                  onChange={(e) => startTransition(async () => { await updateAdminRole(u.id, e.target.value as any); })}
                  className="admin-field w-auto text-xs"
                >
                  <option value="editor">Editor</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <button onClick={() => { if (confirm("Remove this admin's access?")) startTransition(async () => { await removeAdminUser(u.id); }); }} className="p-1.5 text-campaign-red/70 hover:text-campaign-red">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
