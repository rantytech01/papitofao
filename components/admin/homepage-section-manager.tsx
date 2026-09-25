"use client";

import { useState, useTransition } from "react";
import { ArrowUp, ArrowDown, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import {
  createHomepageSection,
  updateHomepageSection,
  setHomepageSectionStatus,
  toggleHomepageSectionVisibility,
  deleteHomepageSection,
  reorderHomepageSection,
} from "@/app/actions/homepage";
import type { HomepageSection } from "@/lib/types";

function SectionRow({ section }: { section: HomepageSection }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="border-b border-campaign-navy/10 py-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-left">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="font-medium text-campaign-navy">{section.title || section.section_key}</span>
          <span className="rounded-full bg-campaign-navy/5 px-2 py-0.5 text-xs text-campaign-navy/50">
            {section.section_key}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              section.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {section.status}
          </span>
        </button>

        <div className="flex items-center gap-1">
          <button onClick={() => startTransition(() => reorderHomepageSection(section.id, "up"))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue"><ArrowUp size={16} /></button>
          <button onClick={() => startTransition(() => reorderHomepageSection(section.id, "down"))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue"><ArrowDown size={16} /></button>
          <button onClick={() => startTransition(() => toggleHomepageSectionVisibility(section.id, !section.is_visible))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue">
            {section.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={() =>
              startTransition(() =>
                setHomepageSectionStatus(section.id, section.status === "published" ? "unpublished" : "published")
              )
            }
            className="admin-btn-secondary px-2 py-1 text-xs"
          >
            {section.status === "published" ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => { if (confirm("Delete this section?")) startTransition(() => deleteHomepageSection(section.id)); }}
            className="p-1.5 text-campaign-red/70 hover:text-campaign-red"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {open && (
        <form
          action={(fd) => startTransition(async () => { await updateHomepageSection(section.id, fd); })}
          className="mt-4 grid gap-3 rounded-lg bg-campaign-navy/[0.02] p-4 sm:grid-cols-2"
        >
          <div><label className="admin-label">Title</label><input name="title" defaultValue={section.title ?? ""} className="admin-field" /></div>
          <div><label className="admin-label">Subtitle</label><input name="subtitle" defaultValue={section.subtitle ?? ""} className="admin-field" /></div>
          <div className="sm:col-span-2"><label className="admin-label">Description</label><textarea name="description" defaultValue={section.description ?? ""} rows={2} className="admin-field" /></div>
          <div><label className="admin-label">Image URL</label><input name="image_url" defaultValue={section.image_url ?? ""} className="admin-field" /></div>
          <div><label className="admin-label">Button text</label><input name="button_text" defaultValue={section.button_text ?? ""} className="admin-field" /></div>
          <div><label className="admin-label">Button URL</label><input name="button_url" defaultValue={section.button_url ?? ""} className="admin-field" /></div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={isPending} className="admin-btn-primary">Save Section</button>
          </div>
        </form>
      )}
    </div>
  );
}

export function HomepageSectionManager({ sections }: { sections: HomepageSection[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      <form
        action={(fd) => startTransition(async () => { await createHomepageSection(fd); (document.getElementById("hp-add-form") as HTMLFormElement)?.reset(); })}
        id="hp-add-form"
        className="mb-6 grid gap-2 border-b border-campaign-navy/10 pb-6 sm:grid-cols-2"
      >
        <input name="section_key" placeholder="section_key (e.g. testimonials)" required className="admin-field" />
        <input name="title" placeholder="Title" className="admin-field" />
        <input name="button_text" placeholder="Button text" className="admin-field" />
        <input name="button_url" placeholder="Button URL" className="admin-field" />
        <textarea name="description" placeholder="Description" className="admin-field sm:col-span-2" rows={2} />
        <button type="submit" disabled={isPending} className="admin-btn-primary sm:col-span-2 w-fit">+ Add Section</button>
      </form>

      {sections.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No sections yet.</p>
      ) : (
        <div>{sections.map((s) => <SectionRow key={s.id} section={s} />)}</div>
      )}
    </div>
  );
}
