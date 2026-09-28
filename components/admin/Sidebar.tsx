"use client";

import type { ReactNode } from "react";
import {
  Clapperboard,
  DoorOpen,
  FileText,
  GraduationCap,
  Home,
  MapPin,
  Network,
  Settings,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/admin/ui";
import { siteHref } from "@/lib/media";

export type AdminTabId =
  | "homepage"
  | "courses"
  | "rooms"
  | "packages"
  | "stories"
  | "branches"
  | "seo-pages"
  | "seo-settings"
  | "seo-sitemap";

export const NAV_GROUPS: { label: string; items: { id: AdminTabId; label: string; icon: LucideIcon }[] }[] = [
  {
    label: "Trang chủ",
    items: [{ id: "homepage", label: "Homepage", icon: Home }],
  },
  {
    label: "Catalog",
    items: [
      { id: "courses", label: "Khóa học", icon: GraduationCap },
      { id: "rooms", label: "Phòng", icon: DoorOpen },
      { id: "packages", label: "Gói", icon: Ticket },
      { id: "stories", label: "Stories", icon: Clapperboard },
      { id: "branches", label: "Chi nhánh", icon: MapPin },
    ],
  },
  {
    label: "SEO",
    items: [
      { id: "seo-pages", label: "Trang", icon: FileText },
      { id: "seo-settings", label: "Cài đặt", icon: Settings },
      { id: "seo-sitemap", label: "Sitemap", icon: Network },
    ],
  },
];

export const ADMIN_TABS = NAV_GROUPS.flatMap((group) => group.items);

export function tabGroupLabel(tab: AdminTabId) {
  if (tab === "homepage") return "Trang chủ";
  if (tab.startsWith("seo")) return "SEO";
  return "Catalog";
}

export function Sidebar({
  tab,
  onTab,
  onLogout,
}: {
  tab: AdminTabId;
  onTab: (id: AdminTabId) => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col px-4 py-5">
      <div className="flex items-center gap-3 px-1">
        <span className="grid size-10 shrink-0 place-items-center rounded-[0.625rem] bg-ma-accent text-sm font-semibold tracking-wide text-black">
          MA
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold tracking-wide text-ma-text">MA ADMIN</span>
          <span className="block text-xs text-ma-text-muted">Edu Dance Studio</span>
        </span>
      </div>

      <nav aria-label="Admin sections" className="mt-8 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-2 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-ma-text-muted">{group.label}</p>
            <div className="grid gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={active ? "page" : undefined}
                    onClick={() => onTab(item.id)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition duration-200 ${
                      active
                        ? "bg-ma-accent font-medium text-black"
                        : "text-ma-text-secondary hover:bg-ma-card-hover hover:text-ma-text"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-4 grid gap-2 border-t border-ma-border pt-4">
        <a
          href={siteHref("/")}
          className="inline-flex items-center justify-center rounded-xl border border-ma-border px-3 py-2 text-sm text-ma-text-secondary transition duration-200 hover:bg-ma-card-hover hover:text-ma-text"
        >
          Về site
        </a>
        <Button variant="danger" onClick={onLogout}>
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}

export function SidebarFrame({ children }: { children: ReactNode }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[16.25rem] shrink-0 flex-col border-r border-ma-border bg-ma-card lg:flex">
      {children}
    </aside>
  );
}
