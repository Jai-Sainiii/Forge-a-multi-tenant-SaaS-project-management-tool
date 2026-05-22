"use client";

import { useState, useEffect } from "react";
import HomeStrip from "@/components/shell/HomeStrip";
import Sidebar from "@/components/shell/Sidebar";
import TopBar from "@/components/shell/TopBar";
import { useAuth } from "@/authContext/AuthContext";
import { WorkspaceModalProvider } from "@/context/WorkspaceModalContext";
import { usePathname } from "next/navigation";
import axios from "axios";
import {useRouter} from "next/navigation";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth()!;
  const path = usePathname();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const router = useRouter();

  const activeHomepage = () => {
    if (path === "/workspace/all") return null;
    else return <Sidebar user={user} workspaces={workspaces} />;
  };

  const getWorkspaces = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/getAllWorkspaces`,
      { withCredentials: true },
    );
    setWorkspaces(response.data.workspaceData.workspaces);
  };

  // if (!user) {
  //   router.push("/");
  // }

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
          <TopBar workspaces={workspaces} getworkspaces={getWorkspaces} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </WorkspaceModalProvider>
  );
}
