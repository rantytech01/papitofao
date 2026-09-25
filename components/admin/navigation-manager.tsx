"use client";

import { useState, useTransition } from "react";
import { ArrowUp, ArrowDown, Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import {
  createNavItem,
  updateNavItem,
  deleteNavItem,
  toggleNavVisibility,
  reorderNavItem,
} from "@/app/actions/navigation";
import type { NavigationItem } from "@/lib/types";

function NavItemRow({ item }: { item: NavigationItem }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editing) {
    return (
      <form
        action={(fd) => startTransition(async () => { await updateNavItem(item.id, fd); setEditing(false); })}
        className="grid grid-cols-12 items-center gap-2 border-b border-campaign-navy/10 py-3"
      >
        <input name="label" defaultValue={item.label} className="admin-field col-span-3" />
        <input name="url" defaultValue={item.url} className="admin-field col-span-4" />
        <label className="col-span-2 flex items-center gap-1 text-xs">
          <input type="checkbox" name="is_external" defaultChecked={item.is_external} /> External
        </label>
        <label className="col-span-2 flex items-center gap-1 text-xs">
          <input type="checkbox" name="open_in_new_tab" defaultChecked={item.open_in_new_tab} /> New tab
        </label>
        <div className="col-span-1 flex gap-1">
          <button type="submit" className="admin-btn-secondary px-2 py-1 text-xs">Save</button>
        </div>
      </form>
    );
  }

  return (
    <div className="grid grid-cols-12 items-center gap-2 border-b border-campaign-navy/10 py-3 text-sm">
      <div className="col-span-3 font-medium text-campaign-navy">{item.label}</div>
      <div className="col-span-4 truncate text-campaign-navy/60">{item.url}</div>
      <div className="col-span-2 text-xs text-campaign-navy/50">
        {item.is_external ? "External" : "Internal"}{item.open_in_new_tab ? " · new tab" : ""}
      </div>
      <div className="col-span-3 flex items-center justify-end gap-1">
        <button onClick={() => startTransition(() => reorderNavItem(item.id, "up"))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue">
          <ArrowUp size={16} />
        </button>
        <button onClick={() => startTransition(() => reorderNavItem(item.id, "down"))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue">
          <ArrowDown size={16} />
        </button>
        <button onClick={() => startTransition(() => toggleNavVisibility(item.id, !item.is_visible))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue">
          {item.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button onClick={() => setEditing(true)} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue">
          <Pencil size={16} />
        </button>
        <button
          onClick={() => { if (confirm("Delete this navigation item?")) startTransition(() => deleteNavItem(item.id)); }}
          className="p-1.5 text-campaign-red/70 hover:text-campaign-red"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function NavigationManager({ items }: { items: NavigationItem[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      <form
        action={(fd) => startTransition(async () => { await createNavItem(fd); (document.getElementById("nav-add-form") as HTMLFormElement)?.reset(); })}
        id="nav-add-form"
        className="mb-6 grid grid-cols-12 gap-2 border-b border-campaign-navy/10 pb-6"
      >
        <input name="label" placeholder="Label" required className="admin-field col-span-3" />
        <input name="url" placeholder="/path or https://…" required className="admin-field col-span-4" />
        <label className="col-span-2 flex items-center gap-1 text-xs"><input type="checkbox" name="is_external" /> External</label>
        <label className="col-span-2 flex items-center gap-1 text-xs"><input type="checkbox" name="open_in_new_tab" /> New tab</label>
        <button type="submit" disabled={isPending} className="admin-btn-primary col-span-1">+ Add</button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No navigation items yet.</p>
      ) : (
        <div>{items.map((item) => <NavItemRow key={item.id} item={item} />)}</div>
      )}
    </div>
  );
}
