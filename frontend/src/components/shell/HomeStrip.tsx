"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Home, Plus, LayoutGrid } from "lucide-react";

interface Workspace {
  id: number;
  title: string;
  companyname?: string;
  describtion?: string;
  color?: {
    backgroundColor?: string;
    textColor?: string;
  };
  members?: any[];
  leftedMembers?: any[];
  projects?: any[];
  visibility?: string;
}

interface HomeStripProps {
  workspaces: Workspace[];
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #18181B, #3F3F46)", // Zinc dark
  "linear-gradient(135deg, #27272A, #52525B)", // Zinc medium
  "linear-gradient(135deg, #3F3F46, #71717A)", // Zinc light-medium
  "linear-gradient(135deg, #52525B, #A1A1AA)", // Zinc light
  "linear-gradient(135deg, #71717A, #D4D4D8)", // Zinc extra-light
  "linear-gradient(135deg, #18181B, #71717A)", // Zinc mix
];

export default function HomeStrip({ workspaces }: HomeStripProps) {
  const router = useRouter();
  const params = useParams();
  const activeWorkspace = params?.workspaceID ? Number(params.workspaceID) : null;

  return (
    <aside
      style={{ width: 40, background: "#0A0A0B", flexShrink: 0 }}
      className="flex flex-col items-center py-2 gap-2 h-screen sticky top-0 z-30"
    >
      {/* Home button */}
      <Link
        href="/"
        title="Landing Page"
        className="group flex items-center justify-center w-7 h-7 rounded-[7px] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-150 mt-1"
      >
        <Home size={15} strokeWidth={1.8} />
      </Link>

      {/* All workspaces button */}
      <Link
        href="/workspace/all"
        title="All workspaces"
        className="group flex items-center justify-center w-7 h-7 rounded-[7px] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-150"
      >
        <LayoutGrid size={15} strokeWidth={1.8} />
      </Link>

      {/* Divider */}
      <div
        style={{ height: 1, width: 20, background: "rgba(255,255,255,0.07)" }}
      />

      {/* Workspace dots */}
      <div className="flex flex-col items-center gap-2 mt-1">
        {(workspaces || []).map((ws: Workspace, index: number) => {
          const isActive = ws.id === activeWorkspace;
          const bgGradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
          const hasCustomColor = ws.color && (ws.color as any).backgroundColor;
          const bgVal = hasCustomColor ? (ws.color as any).backgroundColor : null;
          const textVal = hasCustomColor ? ((ws.color as any).textColor || "#ffffff") : "#ffffff";
          return (
            <button
              key={ws.id}
              title={ws.title}
              onClick={() => {
                router.push(`/workspace/${ws.id}`);
              }}
              className="transition-transform duration-150 hover:scale-[1.08] focus:outline-none"
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: bgVal ? bgVal : bgGradient,
                border: isActive
                  ? "2px solid rgba(255,255,255,0.40)"
                  : "2px solid transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: textVal,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
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
