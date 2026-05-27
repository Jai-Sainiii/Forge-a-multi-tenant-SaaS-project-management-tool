import { useState } from "react";
import { Bell, Plus, UserPlus, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/authContext/AuthContext";
import { useWorkspaceModal } from "@/context/WorkspaceModalContext";
import { useParams } from "next/navigation";
import WorkspaceInviteModal from "@/components/forms/WorkspaceInviteModal";

// const isActive = (href: string) => {
//     if (workspaceID && href === `/workspace/${workspaceID}`) {
//       return pathname === href;
//     }
//     if (!workspaceID && href === "/workspace") {
//       return pathname === "/workspace";
//     }
//     return pathname.startsWith(href);
//   };

interface Workspace{
  id: number;
  title: string;
  userId?: number;
}

interface TopbarProps{
  workspaces: Workspace[];
  getworkspaces: () => Promise<void>;
  onMenuClick?: () => void;
}

export default function TopBar({ workspaces, getworkspaces, onMenuClick }: TopbarProps) {
  const { user } = useAuth()!;
  const pathname = usePathname();
  const homepage = pathname === "/workspace/all";
  const params = useParams();
  const workspaceID = params?.workspaceID as number | undefined;
  const workspace = workspaces.find((w) => w.id === Number(workspaceID));
  const { openModal } = useWorkspaceModal();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const isOwner = workspace && user && Number(workspace.userId) === Number(user.id);
  
  const PAGE_META: Record<string, { title: string; crumb: string }> = {
    "/workspace": { title: "Dashboard", crumb: `${workspace?.title} › Dashboard` },
    "/workspace/projects": { title: "Projects", crumb: `${workspace?.title} › Projects` },
    "/workspace/tasks": { title: "Tasks", crumb: `${workspace?.title} › Tasks` },
    "/workspace/members": { title: "Members", crumb: `${workspace?.title} › Members` },
    "/workspace/activity": { title: "Activity", crumb: `${workspace?.title} › Activity` },
    "/workspace/settings": { title: "Settings", crumb: `${workspace?.title} › Settings` },
  };
  
  const meta = PAGE_META[pathname] ?? { title: "Workspace", crumb: `${workspace?.title}` };


  if (homepage) {
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
        {/* Left: Hamburger + title */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#F4F4F2] transition-colors cursor-pointer shrink-0"
            style={{ border: "1px solid #E8E6E0" }}
          >
            <Menu size={16} strokeWidth={2} style={{ color: "#6B6860" }} />
          </button>

          <div className="flex flex-col min-w-0">
            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#1A1918",
                lineHeight: 1.3,
              }}
              className="truncate"
            >
              Welcome {user?.name || "User"}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "#9A9890",
                lineHeight: 1.4,
                marginTop: 1,
              }}
              className="hidden sm:block truncate"
            >
              {user?.email || "user@email.com"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* New workspace filled purple button */}
          <button
            onClick={() => {openModal(); getworkspaces();}}
            className="flex items-center gap-1.5 text-[13px] font-[500] px-3 py-1.5 transition-colors hover:bg-[#5a4ed1] cursor-pointer"
            style={{
              background: "#6C5CE7",
              color: "#ffffff",
              borderRadius: 8,
              border: "none",
            }}
          >
            <Plus size={13} strokeWidth={2.2} />
            <span className="hidden sm:inline">New Workspace</span>
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
    <>
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
        {/* Left: Hamburger + title */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#F4F4F2] transition-colors cursor-pointer shrink-0"
            style={{ border: "1px solid #E8E6E0" }}
          >
            <Menu size={16} strokeWidth={2} style={{ color: "#6B6860" }} />
          </button>

          <div className="flex flex-col min-w-0">
            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#1A1918",
                lineHeight: 1.3,
              }}
              className="truncate"
            >
              {meta.title}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "#9A9890",
                lineHeight: 1.4,
                marginTop: 1,
              }}
              className="hidden sm:block truncate"
            >
              {meta.crumb}
            </span>
          </div>
        </div>

        {/* Right: Invite, New project, bell */}
        <div className="flex items-center gap-2">
          {/* Invite ghost button - visible to owner only */}
          {isOwner && (
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-1.5 text-[13px] font-[500] px-3 py-1.5 rounded-lg transition-colors hover:bg-[#F4F4F2] cursor-pointer"
              style={{
                border: "1px solid #E8E6E0",
                color: "#4A4845",
                borderRadius: 8,
              }}
            >
              <UserPlus size={13} strokeWidth={1.8} />
              <span className="hidden sm:inline">Invite</span>
            </button>
          )}

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

      {isInviteOpen && workspaceID && (
        <WorkspaceInviteModal
          workspaceID={workspaceID}
          onClose={() => setIsInviteOpen(false)}
        />
      )}
    </>
  );
}
