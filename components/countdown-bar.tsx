"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
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

  const units: { label: string; value: number }[] = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Mins", value: time.minutes },
    { label: "Secs", value: time.seconds },
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
            <div
              key={u.label}
              className="min-w-[52px] rounded-md border-2 border-campaign-red bg-campaign-blue-dark px-2 py-1 text-center"
            >
              <p className="font-display text-lg font-extrabold leading-none">{pad(u.value)}</p>
              <p className="text-[9px] font-semibold uppercase tracking-wide text-white/70">{u.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
