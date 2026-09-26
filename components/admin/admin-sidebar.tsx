"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

const groups: { heading: string; items: { label: string; href: string }[] }[] = [
  {
    heading: "Content",
    items: [
      { label: "Candidate", href: "/admin/candidate" },
      { label: "Homepage", href: "/admin/homepage" },
      { label: "About", href: "/admin/about" },
      { label: "Vision", href: "/admin/vision" },
      { label: "Priorities", href: "/admin/priorities" },
      { label: "Community", href: "/admin/community" },
      { label: "Ward Map", href: "/admin/ward-map" },
      { label: "News", href: "/admin/news" },
      { label: "Events", href: "/admin/events" },
      { label: "Gallery", href: "/admin/gallery" },
      { label: "Media", href: "/admin/media" },
    ],
  },
  {
    heading: "Communication",
    items: [
      { label: "Messages", href: "/admin/messages" },
      { label: "Volunteers", href: "/admin/volunteers" },
      { label: "Members", href: "/admin/members" },
      { label: "Polls", href: "/admin/polls" },
      { label: "Contact", href: "/admin/contact" },
      { label: "Social Media", href: "/admin/social" },
    ],
  },
  {
    heading: "Website",
    items: [
      { label: "Navigation", href: "/admin/navigation" },
      { label: "Footer", href: "/admin/footer" },
      { label: "Site Settings", href: "/admin/settings" },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "Admin Users", href: "/admin/users" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col justify-between border-r border-campaign-navy/10 bg-white">
      <div className="overflow-y-auto p-4">
        <Link href="/admin" className="mb-6 block font-display text-lg font-bold text-campaign-navy">
          Campaign Admin
        </Link>
        <nav className="space-y-6">
          {groups.map((group) => (
            <div key={group.heading}>
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-campaign-navy/40">
                {group.heading}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block rounded-md px-2 py-1.5 text-sm ${
                          active
                            ? "bg-campaign-blue/10 font-semibold text-campaign-blue"
                            : "text-campaign-navy/80 hover:bg-campaign-navy/5"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <form action={logout} className="border-t border-campaign-navy/10 p-4">
        <button className="w-full rounded-md px-2 py-1.5 text-left text-sm font-medium text-campaign-red hover:bg-campaign-red/5">
          Log out
        </button>
      </form>
    </aside>
  );
}
