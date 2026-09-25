"use client";

import { useState, useTransition } from "react";
import { Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import { createSocialLink, updateSocialLink, toggleSocialLink, deleteSocialLink } from "@/app/actions/social";
import type { SocialLink } from "@/lib/types";

const platforms = ["Facebook", "Instagram", "TikTok", "X", "YouTube", "LinkedIn"];

function Row({ link }: { link: SocialLink }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editing) {
    return (
      <form
        action={(fd) => startTransition(async () => { await updateSocialLink(link.id, fd); setEditing(false); })}
        className="grid grid-cols-12 items-center gap-2 border-b border-campaign-navy/10 py-3"
      >
        <select name="platform" defaultValue={link.platform} className="admin-field col-span-2">
          {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input name="display_name" defaultValue={link.display_name ?? ""} placeholder="Display name" className="admin-field col-span-3" />
        <input name="url" defaultValue={link.url} className="admin-field col-span-6" />
        <button type="submit" className="admin-btn-secondary col-span-1 px-2 py-1 text-xs">Save</button>
      </form>
    );
  }

  return (
    <div className="grid grid-cols-12 items-center gap-2 border-b border-campaign-navy/10 py-3 text-sm">
      <div className="col-span-2 font-medium text-campaign-navy">{link.platform}</div>
      <div className="col-span-3 text-campaign-navy/60">{link.display_name || "—"}</div>
      <div className="col-span-5 truncate text-campaign-navy/60">{link.url}</div>
      <div className="col-span-2 flex justify-end gap-1">
        <button onClick={() => startTransition(() => toggleSocialLink(link.id, !link.is_enabled))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue">
          {link.is_enabled ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button onClick={() => setEditing(true)} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue"><Pencil size={16} /></button>
        <button onClick={() => { if (confirm("Delete this social link?")) startTransition(() => deleteSocialLink(link.id)); }} className="p-1.5 text-campaign-red/70 hover:text-campaign-red">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function SocialLinksManager({ links }: { links: SocialLink[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      <form
        action={(fd) => startTransition(async () => { await createSocialLink(fd); (document.getElementById("social-add-form") as HTMLFormElement)?.reset(); })}
        id="social-add-form"
        className="mb-6 grid grid-cols-12 gap-2 border-b border-campaign-navy/10 pb-6"
      >
        <select name="platform" required className="admin-field col-span-2">
          <option value="">Platform</option>
          {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input name="display_name" placeholder="Display name (optional)" className="admin-field col-span-3" />
        <input name="url" placeholder="https://…" required className="admin-field col-span-6" />
        <button type="submit" disabled={isPending} className="admin-btn-primary col-span-1">+</button>
      </form>

      {links.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No social accounts added yet.</p>
      ) : (
        <div>{links.map((l) => <Row key={l.id} link={l} />)}</div>
      )}
    </div>
  );
}
