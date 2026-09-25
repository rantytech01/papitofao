"use client";

import { useState, useTransition } from "react";
import { ArrowUp, ArrowDown, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import {
  createAboutSection,
  updateAboutSection,
  setAboutSectionStatus,
  toggleAboutSectionVisibility,
  deleteAboutSection,
  reorderAboutSection,
} from "@/app/actions/about";
import type { AboutSection } from "@/lib/types";

function Row({ section }: { section: AboutSection }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="border-b border-campaign-navy/10 py-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-left">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="font-medium text-campaign-navy">{section.title}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              section.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {section.status}
          </span>
        </button>
        <div className="flex items-center gap-1">
          <button onClick={() => startTransition(() => reorderAboutSection(section.id, "up"))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue"><ArrowUp size={16} /></button>
          <button onClick={() => startTransition(() => reorderAboutSection(section.id, "down"))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue"><ArrowDown size={16} /></button>
          <button onClick={() => startTransition(() => toggleAboutSectionVisibility(section.id, !section.is_visible))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue">
            {section.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={() => startTransition(() => setAboutSectionStatus(section.id, section.status === "published" ? "unpublished" : "published"))}
            className="admin-btn-secondary px-2 py-1 text-xs"
          >
            {section.status === "published" ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => { if (confirm("Delete this section?")) startTransition(() => deleteAboutSection(section.id)); }}
            className="p-1.5 text-campaign-red/70 hover:text-campaign-red"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {open && (
        <form
          action={(fd) => startTransition(async () => { await updateAboutSection(section.id, fd); })}
          className="mt-4 grid gap-3 rounded-lg bg-campaign-navy/[0.02] p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="admin-label">Title</label><input name="title" defaultValue={section.title} className="admin-field" /></div>
            <div><label className="admin-label">Subtitle</label><input name="subtitle" defaultValue={section.subtitle ?? ""} className="admin-field" /></div>
          </div>
          <div>
            <label className="admin-label">Content (HTML — bold/italic/headings/lists/links supported)</label>
            <textarea name="content" defaultValue={section.content ?? ""} rows={8} className="admin-field font-mono text-xs" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="admin-label">Image URL</label><input name="image_url" defaultValue={section.image_url ?? ""} className="admin-field" /></div>
            <div>
              <label className="admin-label">Image position</label>
              <select name="image_position" defaultValue={section.image_position} className="admin-field">
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="top">Top</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={isPending} className="admin-btn-primary w-fit">Save Section</button>
        </form>
      )}
    </div>
  );
}

export function AboutSectionManager({ sections }: { sections: AboutSection[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      <form
        action={(fd) => startTransition(async () => { await createAboutSection(fd); (document.getElementById("about-add-form") as HTMLFormElement)?.reset(); })}
        id="about-add-form"
        className="mb-6 border-b border-campaign-navy/10 pb-6"
      >
        <input name="title" placeholder="Section title (e.g. Background)" required className="admin-field mb-2" />
        <button type="submit" disabled={isPending} className="admin-btn-primary">+ Add About Section</button>
      </form>

      {sections.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No sections yet — the public About page will show a placeholder message.</p>
      ) : (
        <div>{sections.map((s) => <Row key={s.id} section={s} />)}</div>
      )}
    </div>
  );
}
