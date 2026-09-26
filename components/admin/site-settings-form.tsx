"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings } from "@/app/actions/site-settings";
import type { SiteSettings } from "@/lib/types";

export function SiteSettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={(fd) => startTransition(async () => { await updateSiteSettings(fd); setSaved(true); })}
      className="admin-card max-w-2xl space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="admin-label">Website name</label><input name="website_name" defaultValue={settings?.website_name ?? ""} required className="admin-field" /></div>
        <div><label className="admin-label">Website title (browser tab)</label><input name="website_title" defaultValue={settings?.website_title ?? ""} className="admin-field" /></div>
      </div>
      <div><label className="admin-label">Website description</label><textarea name="website_description" defaultValue={settings?.website_description ?? ""} rows={2} className="admin-field" /></div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="admin-label">Primary color</label>
          <input name="primary_color" type="text" defaultValue={settings?.primary_color ?? "#003491"} className="admin-field" />
        </div>
        <div>
          <label className="admin-label">Secondary color</label>
          <input name="secondary_color" type="text" defaultValue={settings?.secondary_color ?? "#F0181E"} className="admin-field" />
        </div>
        <div>
          <label className="admin-label">Accent color</label>
          <input name="accent_color" type="text" defaultValue={settings?.accent_color ?? "#111827"} className="admin-field" />
        </div>
      </div>
      <p className="text-xs text-campaign-navy/50">
        These are stored for reference and third-party integrations. The live Tailwind theme uses
        the fixed campaign palette in <code>tailwind.config.ts</code> — update that file too if the
        brand colors themselves ever change.
      </p>

      <div><label className="admin-label">Favicon URL</label><input name="favicon_url" defaultValue={settings?.favicon_url ?? ""} className="admin-field" /></div>

      <details className="text-sm">
        <summary className="cursor-pointer font-medium text-campaign-navy/70">SEO defaults</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><label className="admin-label">SEO title</label><input name="seo_title" defaultValue={settings?.seo_title ?? ""} className="admin-field" /></div>
          <div><label className="admin-label">SEO description</label><input name="seo_description" defaultValue={settings?.seo_description ?? ""} className="admin-field" /></div>
          <div><label className="admin-label">Canonical URL</label><input name="canonical_url" defaultValue={settings?.canonical_url ?? ""} className="admin-field" /></div>
          <div><label className="admin-label">Social share image URL</label><input name="social_share_image_url" defaultValue={settings?.social_share_image_url ?? ""} className="admin-field" /></div>
        </div>
      </details>

      <div><label className="admin-label">Footer copyright text</label><input name="footer_copyright" defaultValue={settings?.footer_copyright ?? ""} className="admin-field" /></div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isPending} className="admin-btn-primary">{isPending ? "Saving…" : "Save Changes"}</button>
        {saved && <span className="text-sm text-green-700">Saved.</span>}
      </div>
    </form>
  );
}
