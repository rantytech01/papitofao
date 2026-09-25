"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search } from "lucide-react";
import { ContactButtons } from "@/components/contact-buttons";
import type { CampaignSettings, CandidateProfile, NavigationItem } from "@/lib/types";

export function SiteHeader({
  navItems,
  candidate,
  campaignSettings,
}: {
  navItems: NavigationItem[];
  candidate: CandidateProfile | null;
  campaignSettings: CampaignSettings | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-campaign-navy/10 bg-white/95 backdrop-blur">
      {/* thin poster-style accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-campaign-blue via-campaign-blue to-campaign-red" />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          {candidate?.movement_logo_url ? (
            <Image
              src={candidate.movement_logo_url}
              alt={candidate.movement_name}
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-campaign-blue font-display text-lg font-bold text-white">
              {candidate?.candidate_name?.[0] ?? "N"}
            </div>
          )}
          <div className="leading-tight">
            <p className="font-display text-lg font-bold text-campaign-navy">
              {candidate?.candidate_name ?? "Campaign"}
            </p>
            <p className="text-xs text-campaign-navy/60">
              {candidate?.position} — {candidate?.ward}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target={item.open_in_new_tab ? "_blank" : undefined}
              rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
              className="text-[13px] font-bold uppercase tracking-wide text-campaign-navy/80 transition-colors hover:text-campaign-blue"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ContactButtons settings={campaignSettings} variant="compact" />
          {/* Decorative for now, matching the party site — wire up a real search when there's content to search */}
          <button aria-label="Search" className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue">
            <Search size={18} />
          </button>
          <Link
            href="/volunteer"
            className="rounded-full bg-campaign-red px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-campaign-red/90"
          >
            Get Involved
          </Link>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-md p-2 text-campaign-navy md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-campaign-navy/10 bg-white px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-3 pt-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className="block py-1 text-base font-medium text-campaign-navy"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ContactButtons settings={campaignSettings} />
            <Link
              href="/volunteer"
              onClick={() => setOpen(false)}
              className="rounded-full bg-campaign-red px-5 py-2 text-sm font-bold text-white"
            >
              Get Involved
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
