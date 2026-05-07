"use client";

import HomeStrip from "@/components/shell/HomeStrip";
import Sidebar from "@/components/shell/Sidebar";
import TopBar from "@/components/shell/TopBar";
import { useAuth } from "@/authContext/AuthContext";
import { WorkspaceModalProvider } from "@/context/WorkspaceModalContext";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth()!;

  return (
    <WorkspaceModalProvider>
      {/* Override the dot-grid body background for app shell pages */}
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: "#0A0A0B", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Layer 1 — Home strip */}
        <HomeStrip activeWorkspace="shipyard" />

        {/* Layer 2 — Sidebar (uncomment when ready) */}
        {/* <Sidebar user={user} /> */}

        {/* Layer 3 — Main content */}
        <div
          className="flex flex-col flex-1 overflow-hidden"
          style={{ background: "#F7F6F3" }}
        >
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </WorkspaceModalProvider>
  );
}
