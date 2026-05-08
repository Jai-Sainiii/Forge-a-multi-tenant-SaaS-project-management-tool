"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, Plus } from "lucide-react";
import { useState } from "react";

interface workspaces {
  id: string;
  title: string;
  companyname: string;
  describtion: string;
  members: [];
  leftedMembers: [];
  projects: [];
  visibility: string;
}

interface HomeStripProps {
  workspaces: workspaces[];
}

export default function HomeStrip({ workspaces: workspaces }: HomeStripProps) {
  const router = useRouter();

  // console.log(activeWorkspace)
  const [activeWorkspace, setActiveWorkspace] = useState<string>("");

  return (
    <aside
      style={{ width: 40, background: "#0A0A0B", flexShrink: 0 }}
      className="flex flex-col items-center py-2 gap-2 h-screen sticky top-0 z-30"
    >
      {/* Home button */}
      <Link
        href="/workspace/all"
        title="All workspaces"
        className="group flex items-center justify-center w-7 h-7 rounded-[7px] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-150 mt-1"
      >
        <Home size={15} strokeWidth={1.8} />
      </Link>

      {/* Divider */}
      <div
        style={{ height: 1, width: 20, background: "rgba(255,255,255,0.07)" }}
      />

      {/* Workspace dots */}
      <div className="flex flex-col items-center gap-2 mt-1">
        {workspaces.map((ws) => {
          const isActive = ws.id === activeWorkspace;
          return (
            <button
              key={ws.id}
              title={ws.title}
              onClick={() => {
                setActiveWorkspace(ws.id);
                router.push(`/workspace/${ws.id}/dashboard`);
              }}
              className="transition-transform duration-150 hover:scale-[1.08] focus:outline-none"
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: "#f3f3f3ff",
                border: isActive
                  ? "2px solid rgba(255,255,255,0.30)"
                  : "2px solid transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "432422",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {ws.title
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div
        style={{ height: 1, width: 20, background: "rgba(255,255,255,0.07)" }}
      />

      {/* New workspace button */}
      <button
        title="New workspace"
        className="flex items-center justify-center w-7 h-7 rounded-[7px] text-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-150"
      >
        <Plus size={14} strokeWidth={2} />
      </button>
    </aside>
  );
}
