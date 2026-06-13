"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
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
import { useEffect, useState } from "react";
import { getWorkspaceDashboard } from "@/app/actions/workspace";



interface Workspaces {
  id: number;
  title: string;
  companyname: string;
  describtion: string;
  color?: {
    backgroundColor?: string;
    textColor?: string;
  };
  projects: [];
  tasks: [];
  members: {
    id: string;
    role: string;
  }[];
}

interface Projects{
  id: number;
  name: string;
  field: string;
  describtion: string;
  workspaceID: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceData {
  workspace: Workspaces;
  projects: Projects[];
}

interface SidebarProps {
  user: { name: string; email: string } | null;
  workspaces: Workspaces[];
}

export default function Sidebar({ user, workspaces }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const workspaceID = params?.workspaceID as number | undefined;
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null);

  const workspace = workspaces.find((w) => w.id === Number(workspaceID));

  const fetchworkspaces = async()=>{
    try {
      const result = await getWorkspaceDashboard(String(workspaceID));
      if (result.success) {
        setWorkspaceData({ workspace: result.workspace, projects: result.projects } as any);
      }
    } catch (error) {
      console.log("Error while fetching workspaces")
    }
  }

  useEffect(() => {
    fetchworkspaces()
  }, [workspaceID])
    

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "JS";

  const base = `/workspace/${workspaceID}`;

  const getNavItems = () => {
    const items = [
      { label: "Dashboard", icon: LayoutDashboard, href: base, badge: null },
      {
        label: "Projects",
        icon: Folder,
        href: `${base}/projects`,
        badge: null,
      },
      { label: "Tasks", icon: CheckSquare, href: `${base}/tasks`, badge: null },
      { label: "Members", icon: Users, href: `${base}/members`, badge: null },
      {
        label: "Activity",
        icon: Activity,
        href: `${base}/activity`,
        badge: null,
      },
    ];

    return items;
  };

  const currentNavItems = getNavItems();

  const isActive = (href: string) => {
    if (workspaceID && href === `/workspace/${workspaceID}`) {
      return pathname === href;
    }
    if (!workspaceID && href === "/workspace") {
      return pathname === "/workspace";
    }
    return pathname.startsWith(href);
  };

  const navItemClass = (href: string) =>
    `flex items-center gap-2.5 px-[10px] py-[7px] rounded-lg text-[13px] font-medium transition-all duration-100 cursor-pointer ` +
    (isActive(href)
      ? "bg-[rgba(255,255,255,0.08)] text-white"
      : "text-[#7A7885] hover:bg-[rgba(255,255,255,0.055)] hover:text-white");

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
              backgroundColor: (workspace?.color as any)?.backgroundColor || "#27272A",
              color: (workspace?.color as any)?.textColor || "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
              transition: "all 0.3s ease-in-out",
            }}
          >
            {workspace?.title?.charAt(0).toUpperCase()}
          </div>
          {/* Info */}
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-[13px] font-[500] text-[#F0EEF8] leading-tight truncate w-full text-left">
              {workspace?.title}
            </span>
            <span className="text-[10px] text-[#5A5870] leading-tight">
              Pro plan · {workspace?.members?.length || 0} members
            </span>
          </div>
          <ChevronDown
            size={13}
            className="text-[#5A5870] group-hover:text-[#7A7885] transition-colors shrink-0"
          />
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
          {currentNavItems.map(({ label, icon: Icon, href, badge }) => (
            <Link key={label} href={href} className={navItemClass(href)}>
              <Icon size={14} strokeWidth={1.8} className="shrink-0" />
              <span className="flex-1 truncate">{label}</span>
              {badge && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "#7A7885",
                  }}
                >
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* PROJECTS section */}
        {(workspaceData?.projects?.length ?? 0) > 0 && (
          <div className="flex flex-col gap-0.5">
            <span
              className="px-[10px] pb-1.5 text-[10px] font-[500] uppercase tracking-[0.07em]"
              style={{ color: "#3D3B4A" }}
            >
              Projects
            </span>
            {workspaceData?.projects?.map((p) => (
              <Link
                key={p.id}
                href={`/workspace/${workspaceID}/projects/${p.id}`}
                className={navItemClass(`/workspace/${workspaceID}/projects/${p.id}`)}
                title={p.name}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#a1a1aaff",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span className="flex-1 truncate text-[#7A7885] hover:text-white">
                  {p.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* ACCOUNT section */}
        <div className="flex flex-col gap-0.5">
          <span
            className="px-[10px] pb-1.5 text-[10px] font-[500] uppercase tracking-[0.07em]"
            style={{ color: "#3D3B4A" }}
          >
            Account
          </span>
          {workspaceID && (
            <Link href={`${base}/settings`} className={navItemClass(`${base}/settings`)}>
              <Settings size={14} strokeWidth={1.8} className="shrink-0" />
              <span className="flex-1 truncate">Settings</span>
            </Link>
          )}
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
              background: "linear-gradient(135deg, #27272A 0%, #52525B 100%)",
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
