"use client";

import { useState, useTransition } from "react";
import { updateCampaignSettings } from "@/app/actions/contact-settings";
import type { CampaignSettings } from "@/lib/types";

export function ContactSettingsForm({ settings }: { settings: CampaignSettings | null }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={(fd) => startTransition(async () => { await updateCampaignSettings(fd); setSaved(true); })}
      className="admin-card max-w-2xl space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="admin-label">Primary phone</label><input name="primary_phone" defaultValue={settings?.primary_phone ?? ""} placeholder="+254 7XX XXX XXX" className="admin-field" /></div>
        <div><label className="admin-label">Secondary phone</label><input name="secondary_phone" defaultValue={settings?.secondary_phone ?? ""} className="admin-field" /></div>
        <div><label className="admin-label">WhatsApp number</label><input name="whatsapp_number" defaultValue={settings?.whatsapp_number ?? ""} className="admin-field" /></div>
        <div><label className="admin-label">Email</label><input name="email" type="email" defaultValue={settings?.email ?? ""} className="admin-field" /></div>
        <div><label className="admin-label">Election date</label><input name="election_date" type="date" defaultValue={settings?.election_date ?? ""} className="admin-field" /></div>
        <div><label className="admin-label">Office hours</label><input name="office_hours" defaultValue={settings?.office_hours ?? ""} className="admin-field" /></div>
      </div>
      <div><label className="admin-label">Office address</label><input name="office_address" defaultValue={settings?.office_address ?? ""} className="admin-field" /></div>
      <div><label className="admin-label">Contact page description</label><textarea name="contact_description" defaultValue={settings?.contact_description ?? ""} rows={3} className="admin-field" /></div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isPending} className="admin-btn-primary">{isPending ? "Saving…" : "Save Changes"}</button>
        {saved && <span className="text-sm text-green-700">Saved.</span>}
      </div>
    </form>
  );
}
