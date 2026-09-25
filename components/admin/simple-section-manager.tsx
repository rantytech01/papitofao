"use client";

import { useState, useTransition } from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";

type Field = string;

interface Item {
  id: string;
  title?: string;
  status?: string;
  [key: string]: any;
}

const longFields = new Set(["description", "short_description", "full_description", "content"]);
const fieldLabels: Record<string, string> = {
  title: "Title",
  description: "Description",
  short_description: "Short description",
  full_description: "Full description",
  image_url: "Image URL",
  icon: "Icon (emoji or lucide name)",
  category: "Category",
  is_featured: "Featured",
};

function Row({
  item,
  fields,
  updateAction,
  statusAction,
  deleteAction,
}: {
  item: Item;
  fields: Field[];
  updateAction: (id: string, fd: FormData) => Promise<any>;
  statusAction?: (id: string, status: "draft" | "published" | "unpublished") => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="border-b border-campaign-navy/10 py-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-left">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="font-medium text-campaign-navy">{item.title || "Untitled"}</span>
          {item.status && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                item.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {item.status}
            </span>
          )}
        </button>
        <div className="flex items-center gap-1">
          {statusAction && (
            <button
              onClick={() => startTransition(() => statusAction(item.id, item.status === "published" ? "unpublished" : "published"))}
              className="admin-btn-secondary px-2 py-1 text-xs"
            >
              {item.status === "published" ? "Unpublish" : "Publish"}
            </button>
          )}
          <button
            onClick={() => { if (confirm("Delete this item?")) startTransition(() => deleteAction(item.id)); }}
            className="p-1.5 text-campaign-red/70 hover:text-campaign-red"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {open && (
        <form
          action={(fd) => startTransition(async () => { await updateAction(item.id, fd); })}
          className="mt-4 grid gap-3 rounded-lg bg-campaign-navy/[0.02] p-4 sm:grid-cols-2"
        >
          {fields.map((f) =>
            longFields.has(f) ? (
              <div key={f} className="sm:col-span-2">
                <label className="admin-label">{fieldLabels[f] ?? f}</label>
                <textarea name={f} defaultValue={item[f] ?? ""} rows={3} className="admin-field" />
              </div>
            ) : (
              <div key={f}>
                <label className="admin-label">{fieldLabels[f] ?? f}</label>
                <input name={f} defaultValue={item[f] ?? ""} className="admin-field" />
              </div>
            )
          )}
          <button type="submit" disabled={isPending} className="admin-btn-primary w-fit sm:col-span-2">
            Save
          </button>
        </form>
      )}
    </div>
  );
}

export function SimpleSectionManager({
  items,
  fields,
  createAction,
  updateAction,
  statusAction,
  deleteAction,
  addFormId,
}: {
  items: Item[];
  fields: Field[];
  createAction: (fd: FormData) => Promise<any>;
  updateAction: (id: string, fd: FormData) => Promise<any>;
  statusAction?: (id: string, status: "draft" | "published" | "unpublished") => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
  addFormId: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      <form
        action={(fd) => startTransition(async () => { await createAction(fd); (document.getElementById(addFormId) as HTMLFormElement)?.reset(); })}
        id={addFormId}
        className="mb-6 border-b border-campaign-navy/10 pb-6"
      >
        <input name="title" placeholder="Title" required className="admin-field mb-2" />
        <button type="submit" disabled={isPending} className="admin-btn-primary">+ Add</button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">Nothing here yet.</p>
      ) : (
        <div>
          {items.map((item) => (
            <Row
              key={item.id}
              item={item}
              fields={fields}
              updateAction={updateAction}
              statusAction={statusAction}
              deleteAction={deleteAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
