"use client";

import { useState, useTransition } from "react";
import { Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import {
  createWardLocation,
  updateWardLocation,
  toggleWardLocationVisibility,
  deleteWardLocation,
} from "@/app/actions/ward-locations";

interface Location {
  id: string;
  name: string;
  description: string | null;
  category: string;
  latitude: number;
  longitude: number;
  is_visible: boolean;
}

const categories = ["area", "landmark", "office", "market", "school", "polling_station"];

function Row({ loc }: { loc: Location }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="border-b border-campaign-navy/10 py-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-left">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="font-medium text-campaign-navy">{loc.name}</span>
          <span className="rounded-full bg-campaign-navy/5 px-2 py-0.5 text-xs text-campaign-navy/50">{loc.category}</span>
        </button>
        <div className="flex items-center gap-1">
          <button onClick={() => startTransition(() => toggleWardLocationVisibility(loc.id, !loc.is_visible))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue">
            {loc.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button onClick={() => { if (confirm("Delete this location?")) startTransition(() => deleteWardLocation(loc.id)); }} className="p-1.5 text-campaign-red/70 hover:text-campaign-red">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {open && (
        <form
          action={(fd) => startTransition(async () => {
            const res = await updateWardLocation(loc.id, fd);
            if (!res.ok) setError(res.error ?? "Failed to save.");
            else setError(null);
          })}
          className="mt-4 grid gap-3 rounded-lg bg-campaign-navy/[0.02] p-4 sm:grid-cols-2"
        >
          <div><label className="admin-label">Name</label><input name="name" defaultValue={loc.name} className="admin-field" /></div>
          <div>
            <label className="admin-label">Category</label>
            <select name="category" defaultValue={loc.category} className="admin-field">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="admin-label">Latitude</label><input name="latitude" defaultValue={loc.latitude} className="admin-field" /></div>
          <div><label className="admin-label">Longitude</label><input name="longitude" defaultValue={loc.longitude} className="admin-field" /></div>
          <div className="sm:col-span-2"><label className="admin-label">Description</label><textarea name="description" defaultValue={loc.description ?? ""} rows={2} className="admin-field" /></div>
          <button type="submit" disabled={isPending} className="admin-btn-primary w-fit sm:col-span-2">Save</button>
          {error && <p className="text-sm text-campaign-red sm:col-span-2">{error}</p>}
        </form>
      )}
    </div>
  );
}

export function WardMapManager({ locations }: { locations: Location[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="admin-card">
      <div className="mb-6 rounded-lg bg-campaign-blue/5 p-4 text-sm text-campaign-navy/70">
        <strong>Finding coordinates:</strong> open{" "}
        <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-campaign-blue underline">
          Google Maps
        </a>
        , right-click the exact spot, and click the coordinates that appear (e.g. "-1.2183, 36.8864") to copy them —
        the first number is Latitude, the second is Longitude.
      </div>

      <form
        action={(fd) => startTransition(async () => {
          const res = await createWardLocation(fd);
          if (!res.ok) setError(res.error ?? "Failed to add location.");
          else { setError(null); (document.getElementById("ward-add-form") as HTMLFormElement)?.reset(); }
        })}
        id="ward-add-form"
        className="mb-6 grid gap-2 border-b border-campaign-navy/10 pb-6 sm:grid-cols-2"
      >
        <input name="name" placeholder="Name (e.g. Roysambu Market)" required className="admin-field" />
        <select name="category" defaultValue="area" className="admin-field">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="latitude" placeholder="Latitude, e.g. -1.2183" required className="admin-field" />
        <input name="longitude" placeholder="Longitude, e.g. 36.8864" required className="admin-field" />
        <textarea name="description" placeholder="Description (optional)" className="admin-field sm:col-span-2" rows={2} />
        <button type="submit" disabled={isPending} className="admin-btn-primary sm:col-span-2 w-fit">+ Add Location</button>
        {error && <p className="text-sm text-campaign-red sm:col-span-2">{error}</p>}
      </form>

      {locations.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No locations yet.</p>
      ) : (
        <div>{locations.map((l) => <Row key={l.id} loc={l} />)}</div>
      )}
    </div>
  );
}
