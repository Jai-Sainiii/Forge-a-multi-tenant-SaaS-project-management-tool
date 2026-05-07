"use client";

import { Bell, Plus, UserPlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/authContext/AuthContext";
import { useWorkspaceModal } from "@/context/WorkspaceModalContext";

const PAGE_META: Record<string, { title: string; crumb: string }> = {
  "/workspace":          { title: "Dashboard",  crumb: "Shipyard › Dashboard" },
  "/workspace/projects": { title: "Projects",   crumb: "Shipyard › Projects" },
  "/workspace/tasks":    { title: "Tasks",       crumb: "Shipyard › Tasks" },
  "/workspace/members":  { title: "Members",     crumb: "Shipyard › Members" },
  "/workspace/activity": { title: "Activity",    crumb: "Shipyard › Activity" },
  "/workspace/settings": { title: "Settings",    crumb: "Shipyard › Settings" },
};

export default function TopBar() {
  const {user} = useAuth()!;
  const pathname = usePathname();
  const homepage = pathname === "/workspace/all";
  const meta = PAGE_META[pathname] ?? { title: "Workspace", crumb: "Shipyard" };
  const { openModal } = useWorkspaceModal();

  if(homepage){
    return (
      <header
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E8E6E0",
          padding: "14px 20px",
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: title + breadcrumb */}
        <div className="flex flex-col">
          <span style={{ fontSize: 15, fontWeight: 500, color: "#1A1918", lineHeight: 1.3 }}>
            Welcome {user?.name || "User"}
          </span>
          <span style={{ fontSize: 12, color: "#9A9890", lineHeight: 1.4, marginTop: 1 }}>
            {user?.email || "user@email.com"}
          </span>
        </div>

       <div className="flex items-center gap-2">
        {/* New project filled purple button */}
        <button
          onClick={openModal}
          className="flex items-center gap-1.5 text-[13px] font-[500] px-3 py-1.5 transition-colors hover:bg-[#5a4ed1] cursor-pointer"
          style={{
            background: "#6C5CE7",
            color: "#ffffff",
            borderRadius: 8,
            border: "none",
          }}
        >
          <Plus size={13} strokeWidth={2.2} />
          New Workspace
        </button>

        {/* Notification bell */}
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#F4F4F2] transition-colors cursor-pointer"
          style={{ border: "1px solid #E8E6E0" }}
        >
          <Bell size={15} strokeWidth={1.8} style={{ color: "#6B6860" }} />
          {/* Red dot */}
          <span
            className="absolute"
            style={{
              top: 7,
              right: 7,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#E53E3E",
              border: "1.5px solid #fff",
            }}
          />
        </button>
      </div>
      </header>
    );
  }

  return (
    <header
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E8E6E0",
        padding: "14px 20px",
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left: title + breadcrumb */}
      <div className="flex flex-col">
        <span style={{ fontSize: 15, fontWeight: 500, color: "#1A1918", lineHeight: 1.3 }}>
          {meta.title}
        </span>
        <span style={{ fontSize: 12, color: "#9A9890", lineHeight: 1.4, marginTop: 1 }}>
          {meta.crumb}
        </span>
      </div>

      {/* Right: Invite, New project, bell */}
      <div className="flex items-center gap-2">
        {/* Invite ghost button */}
        <button
          className="flex items-center gap-1.5 text-[13px] font-[500] px-3 py-1.5 rounded-lg transition-colors hover:bg-[#F4F4F2] cursor-pointer"
          style={{
            border: "1px solid #E8E6E0",
            color: "#4A4845",
            borderRadius: 8,
          }}
        >
          <UserPlus size={13} strokeWidth={1.8} />
          Invite
        </button>

        {/* New project filled purple button */}
        <button
          className="flex items-center gap-1.5 text-[13px] font-[500] px-3 py-1.5 transition-colors hover:bg-[#5a4ed1] cursor-pointer"
          style={{
            background: "#6C5CE7",
            color: "#ffffff",
            borderRadius: 8,
            border: "none",
          }}
        >
          <Plus size={13} strokeWidth={2.2} />
          New project
        </button>

        {/* Notification bell */}
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#F4F4F2] transition-colors cursor-pointer"
          style={{ border: "1px solid #E8E6E0" }}
        >
          <Bell size={15} strokeWidth={1.8} style={{ color: "#6B6860" }} />
          {/* Red dot */}
          <span
            className="absolute"
            style={{
              top: 7,
              right: 7,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#E53E3E",
              border: "1.5px solid #fff",
            }}
          />
        </button>
      </div>
    </header>
  );
}
