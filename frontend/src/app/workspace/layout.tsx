"use client";

import { useState, useEffect } from "react";
import HomeStrip from "@/components/shell/HomeStrip";
import Sidebar from "@/components/shell/Sidebar";
import TopBar from "@/components/shell/TopBar";
import { useAuth } from "@/authContext/AuthContext";
import { WorkspaceModalProvider } from "@/context/WorkspaceModalContext";
import { usePathname } from "next/navigation";
import { getAllUserWorkspaces } from "@/app/actions/workspace";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth()!;
  const path = usePathname();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activeHomepage = () => {
    if (path === "/workspace/all") return null;
    else return <Sidebar user={user} workspaces={workspaces} />;
  };

  const getWorkspaces = async () => {
    const result = await getAllUserWorkspaces();
    if (result.success) {
      setWorkspaces(result.workspaces);
    }
  };

  useEffect(() => {
    getWorkspaces();

    const handleRefetch = () => {
      getWorkspaces();
    };
    window.addEventListener("workspace-updated", handleRefetch);
    return () => {
      window.removeEventListener("workspace-updated", handleRefetch);
    };
  }, []);

  // Automatically close sidebar drawer when path/navigation changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [path]);

  return (
    <WorkspaceModalProvider>
      <div
        className="flex h-screen overflow-hidden bg-[#0A0A0B] dark:bg-[#0A0A0B]"
        style={{
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {/* Desktop Sidebars (hidden on mobile) */}
        <div className="hidden md:flex shrink-0 h-full">
          <HomeStrip workspaces={workspaces} />
          {activeHomepage()}
        </div>

        {/* Mobile Drawer Backdrop overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Drawer (sliding panel) */}
        <div
          className="fixed inset-y-0 left-0 z-50 flex h-full transition-transform duration-300 md:hidden shadow-2xl"
          style={{
            transform: isMobileOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <HomeStrip workspaces={workspaces} />
          {activeHomepage()}
        </div>

        <div
          className="flex flex-col flex-1 overflow-hidden bg-[#F7F6F3] dark:bg-[#0f0f12]"
        >
          <TopBar 
            workspaces={workspaces} 
            getworkspaces={getWorkspaces} 
            onMenuClick={() => setIsMobileOpen(true)}
          />
          <main className="flex-1 overflow-y-auto relative">{children}</main>
        </div>
      </div>
    </WorkspaceModalProvider>
  );
}
