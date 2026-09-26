"use client";

import { useEffect, useState } from "react";
import { FlipDigit } from "@/components/flip-digit";

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number, width = 2) {
  return n.toString().padStart(width, "0");
}

function FlipUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-[2px] rounded-md border-2 border-campaign-red bg-campaign-blue-dark px-1.5 py-1.5 font-display text-lg font-extrabold leading-none text-white">
        {value.split("").map((ch, i) => (
          <FlipDigit key={i} char={ch} />
        ))}
      </div>
      <p className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-white/70">{label}</p>
    </div>
  );
}

export function CountdownBar({
  electionDate,
  ward,
}: {
  electionDate: string; // ISO date, e.g. "2027-08-10"
  ward: string;
}) {
  const target = new Date(`${electionDate}T00:00:00`);
  const [time, setTime] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [electionDate]);

  const dateLabel = target.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const units = [
    { label: "Days", value: pad(time.days, time.days >= 100 ? 3 : 2) },
    { label: "Hours", value: pad(time.hours) },
    { label: "Mins", value: pad(time.minutes) },
    { label: "Secs", value: pad(time.seconds) },
  ];

  return (
    <div className="bg-campaign-blue text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 md:px-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
            Countdown to {ward} · 2027
          </p>
          <p className="text-sm font-bold">2027 General Election · {dateLabel}</p>
        </div>
        <div className="flex gap-2">
          {units.map((u) => (
            <FlipUnit key={u.label} value={u.value} label={u.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
