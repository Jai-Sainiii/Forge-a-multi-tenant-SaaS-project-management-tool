"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Folder,
  CheckSquare,
  Users,
  Activity,
  Settings,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

const WORKSPACE_PROJECTS = [
  { name: "Website Redesign", color: "#E17055" },
  { name: "Mobile App v2",    color: "#6C5CE7" },
  { name: "API Integration",  color: "#FDCB6E" },
];

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/workspace/", badge: null },
  { label: "Projects",  icon: Folder,          href: "/workspace/projects", badge: "12" },
  { label: "Tasks",     icon: CheckSquare,      href: "/workspace/tasks",   badge: "34" },
  { label: "Members",   icon: Users,            href: "/workspace/members", badge: null },
  { label: "Activity",  icon: Activity,         href: "/workspace/activity",badge: null },
];

const ACCOUNT_ITEMS = [
  { label: "Settings", icon: Settings, href: "/workspace/settings" },
];

interface SidebarProps {
  user: { name: string; email: string } | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "JS";

  const isActive = (href: string) => {
    if (href === "/workspace") return pathname === "/workspace";
    return pathname.startsWith(href);
  };

  const navItemClass = (href: string) =>
    `flex items-center gap-2.5 px-[10px] py-[7px] rounded-lg text-[13px] font-medium transition-all duration-100 cursor-pointer ` +
    (isActive(href)
      ? "bg-[rgba(108,92,231,0.15)] text-[#C8C4FF]"
      : "text-[#7A7885] hover:bg-[rgba(255,255,255,0.055)] hover:text-[#C8C4E8]");

  return (
    <aside
      style={{
        width: 220,
        background: "#0F0F10",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Workspace Header */}
      <div
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        className="px-[10px] py-3"
      >
        <button className="w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/[0.055] transition-colors group">
          {/* Avatar */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            S
          </div>
          {/* Info */}
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-[13px] font-[500] text-[#F0EEF8] leading-tight truncate w-full text-left">
              Shipyard
            </span>
            <span className="text-[10px] text-[#5A5870] leading-tight">
              Pro plan · 9 members
            </span>
          </div>
          <ChevronDown size={13} className="text-[#5A5870] group-hover:text-[#7A7885] transition-colors shrink-0" />
        </button>
      </div>

      {/* Nav links — scrollable */}
      <nav className="flex-1 overflow-y-auto px-[10px] py-3 flex flex-col gap-4">
        {/* WORKSPACE section */}
        <div className="flex flex-col gap-0.5">
          <span
            className="px-[10px] pb-1.5 text-[10px] font-[500] uppercase tracking-[0.07em]"
            style={{ color: "#3D3B4A" }}
          >
            Workspace
          </span>
          {NAV_ITEMS.map(({ label, icon: Icon, href, badge }) => (
            <Link key={label} href={href} className={navItemClass(href)}>
              <Icon size={14} strokeWidth={1.8} className="shrink-0" />
              <span className="flex-1 truncate">{label}</span>
              {badge && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#7A7885" }}
                >
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* PROJECTS section */}
        <div className="flex flex-col gap-0.5">
          <span
            className="px-[10px] pb-1.5 text-[10px] font-[500] uppercase tracking-[0.07em]"
            style={{ color: "#3D3B4A" }}
          >
            Projects
          </span>
          {WORKSPACE_PROJECTS.map(({ name, color }) => (
            <Link
              key={name}
              href={`/workspace/projects`}
              className={navItemClass("/workspace/projects-" + name)}
              title={name}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: color,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span className="flex-1 truncate text-[#7A7885] hover:text-[#C8C4E8]">
                {name}
              </span>
            </Link>
          ))}
        </div>

        {/* ACCOUNT section */}
        <div className="flex flex-col gap-0.5">
          <span
            className="px-[10px] pb-1.5 text-[10px] font-[500] uppercase tracking-[0.07em]"
            style={{ color: "#3D3B4A" }}
          >
            Account
          </span>
          {ACCOUNT_ITEMS.map(({ label, icon: Icon, href }) => (
            <Link key={label} href={href} className={navItemClass(href)}>
              <Icon size={14} strokeWidth={1.8} className="shrink-0" />
              <span className="flex-1 truncate">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* User footer */}
      <div
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        className="px-[10px] py-[10px]"
      >
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/[0.055] transition-colors cursor-pointer group">
          {/* Avatar */}
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          {/* Name + email */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[12px] font-[500] text-[#F0EEF8] leading-tight truncate">
              {user?.name ?? "Jai Saini"}
            </span>
            <span className="text-[10px] text-[#5A5870] leading-tight truncate">
              {user?.email ?? "user@forge.io"}
            </span>
          </div>
          <MoreHorizontal
            size={14}
            className="text-[#5A5870] group-hover:text-[#7A7885] transition-colors shrink-0"
          />
        </div>
      </div>
    </aside>
  );
}
