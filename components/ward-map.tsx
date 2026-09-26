"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

export interface WardLocation {
  id: string;
  name: string;
  description: string | null;
  category: string;
  latitude: number;
  longitude: number;
}

const categoryColor: Record<string, string> = {
  area: "#003491",
  landmark: "#F0181E",
  office: "#111827",
  market: "#0EA5E9",
  school: "#9333EA",
  polling_station: "#16A34A",
};

const categoryLabel: Record<string, string> = {
  area: "Area",
  landmark: "Landmark",
  office: "Office",
  market: "Market",
  school: "School",
  polling_station: "Polling Station",
};

/**
 * Renders a real, pannable/zoomable map using Leaflet + OpenStreetMap
 * tiles (free, no API key). Must only be loaded client-side — Leaflet
 * touches `window` at import time — so this is always imported via
 * next/dynamic with ssr:false from ward-map-section.tsx.
 */
export function WardMap({ locations }: { locations: WardLocation[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [selected, setSelected] = useState<WardLocation | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const center: [number, number] =
        locations.length > 0
          ? [locations[0].latitude, locations[0].longitude]
          : [-1.21833, 36.88639]; // Roysambu Ward reference point

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
      }).setView(center, 14);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      locations.forEach((loc) => {
        const color = categoryColor[loc.category] ?? categoryColor.area;
        const icon = L.divIcon({
          className: "",
          html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        const marker = L.marker([loc.latitude, loc.longitude], { icon }).addTo(map);
        marker.on("click", () => setSelected(loc));
      });
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      <div ref={containerRef} className="h-[420px] w-full rounded-xl border border-campaign-navy/10 shadow-sm" />

      {selected && (
        <div className="absolute bottom-4 left-4 right-4 max-w-sm rounded-lg bg-white p-4 shadow-lg md:left-4 md:right-auto">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
              style={{ backgroundColor: categoryColor[selected.category] ?? categoryColor.area }}
            >
              {categoryLabel[selected.category] ?? selected.category}
            </span>
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="text-campaign-navy/40 hover:text-campaign-navy"
            >
              ×
            </button>
          </div>
          <p className="font-display text-base font-bold text-campaign-navy">{selected.name}</p>
          {selected.description && (
            <p className="mt-1 text-sm text-campaign-navy/70">{selected.description}</p>
          )}
        </div>
      )}
    </div>
  );
}
