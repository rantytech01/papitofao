"use client";

import { useState, useTransition } from "react";
import { Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import { createFooterSection, updateFooterSection, toggleFooterSection, deleteFooterSection } from "@/app/actions/footer";

interface FooterSection {
  id: string;
  heading: string | null;
  content: string | null;
  is_visible: boolean;
}

function Row({ section }: { section: FooterSection }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editing) {
    return (
      <form
        action={(fd) => startTransition(async () => { await updateFooterSection(section.id, fd); setEditing(false); })}
        className="space-y-2 border-b border-campaign-navy/10 py-4"
      >
        <input name="heading" defaultValue={section.heading ?? ""} placeholder="Heading" className="admin-field" />
        <textarea name="content" defaultValue={section.content ?? ""} placeholder="Content" rows={3} className="admin-field" />
        <button type="submit" className="admin-btn-secondary px-3 py-1 text-xs">Save</button>
      </form>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4 border-b border-campaign-navy/10 py-4">
      <div>
        <p className="font-medium text-campaign-navy">{section.heading || "(no heading)"}</p>
        <p className="whitespace-pre-line text-sm text-campaign-navy/60">{section.content}</p>
      </div>
      <div className="flex flex-shrink-0 gap-1">
        <button onClick={() => startTransition(() => toggleFooterSection(section.id, !section.is_visible))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue">
          {section.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button onClick={() => setEditing(true)} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue"><Pencil size={16} /></button>
        <button onClick={() => { if (confirm("Delete this footer section?")) startTransition(() => deleteFooterSection(section.id)); }} className="p-1.5 text-campaign-red/70 hover:text-campaign-red">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function FooterManager({ sections }: { sections: FooterSection[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      <form
        action={(fd) => startTransition(async () => { await createFooterSection(fd); (document.getElementById("footer-add-form") as HTMLFormElement)?.reset(); })}
        id="footer-add-form"
        className="mb-6 space-y-2 border-b border-campaign-navy/10 pb-6"
      >
        <input name="heading" placeholder="Heading (e.g. Quick Links)" className="admin-field" />
        <textarea name="content" placeholder="Content / links" rows={2} className="admin-field" />
        <button type="submit" disabled={isPending} className="admin-btn-primary">+ Add Footer Section</button>
      </form>

      {sections.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No footer sections yet.</p>
      ) : (
        <div>{sections.map((s) => <Row key={s.id} section={s} />)}</div>
      )}
    </div>
  );
}
