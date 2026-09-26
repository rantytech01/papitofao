"use client";

import dynamic from "next/dynamic";
import type { WardLocation } from "@/components/ward-map";

const WardMap = dynamic(() => import("@/components/ward-map").then((m) => m.WardMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-xl border border-campaign-navy/10 bg-campaign-navy/[0.02] text-sm text-campaign-navy/50">
      Loading map…
    </div>
  ),
});

export function WardMapSection({ locations }: { locations: WardLocation[] }) {
  return <WardMap locations={locations} />;
}
