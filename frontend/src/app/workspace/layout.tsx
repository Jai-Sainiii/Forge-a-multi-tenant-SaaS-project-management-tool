"use client";

import { useState, useEffect } from "react";
import HomeStrip from "@/components/shell/HomeStrip";
import Sidebar from "@/components/shell/Sidebar";
import TopBar from "@/components/shell/TopBar";
import { useAuth } from "@/authContext/AuthContext";
import { WorkspaceModalProvider } from "@/context/WorkspaceModalContext";
import { usePathname } from "next/navigation";
import axios from "axios";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth()!;
  const path = usePathname();
  const [workspaces, setWorkspaces] = useState([]);

  const activeHomepage = () => {
    if (path === "/workspace/all") return null;
    else return <Sidebar user={user} />;
  };

  useEffect(() => {
    async function getWorkspaces() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/getAllWorkspaces`,
        { withCredentials: true },
      );
      // console.log(response.data.workspaceData);
      setWorkspaces(response.data.workspaceData.workspaces);
    }
    getWorkspaces();
  }, []);

  return (
    <WorkspaceModalProvider>
      <div
        className="flex h-screen overflow-hidden"
        style={{
          background: "#0A0A0B",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <HomeStrip workspaces={workspaces} />

        {activeHomepage()}

        <div
          className="flex flex-col flex-1 overflow-hidden"
          style={{ background: "#F7F6F3" }}
        >
          <TopBar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </WorkspaceModalProvider>
  );
}
