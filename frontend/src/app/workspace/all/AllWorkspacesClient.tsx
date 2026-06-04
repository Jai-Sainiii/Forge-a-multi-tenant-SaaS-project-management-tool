"use client";

import { useState, useCallback } from "react";
import { Briefcase, Globe, Lock, Users, Calendar, AlertCircle } from "lucide-react";
import { useWorkspaceModal } from "@/context/WorkspaceModalContext";
import CreateWorkspaceModal from "@/components/forms/CreateWorkspace";
import { getAllWorkspaces } from "@/app/actions/workspace";

interface Workspace {
  id: string;
  title: string;
  companyname: string;
  describtion: string;
  visibility?: string;
  memberCount?: number;
  createdAt?: string;
}

function WorkspaceSkeleton() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1.5px solid #E8E6E0",
        borderRadius: 12,
        padding: "20px",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F0EEE8" }} />
        <div>
          <div style={{ width: 120, height: 13, borderRadius: 4, background: "#F0EEE8", marginBottom: 6 }} />
          <div style={{ width: 60, height: 11, borderRadius: 4, background: "#F0EEE8" }} />
        </div>
      </div>
      <div style={{ width: "100%", height: 11, borderRadius: 4, background: "#F0EEE8", marginBottom: 6 }} />
      <div style={{ width: "70%", height: 11, borderRadius: 4, background: "#F0EEE8" }} />
    </div>
  );
}

const AVATAR_COLORS = [
  ["#6C5CE7", "#a29bfe"],
  ["#00B894", "#55efc4"],
  ["#E17055", "#fab1a0"],
  ["#0984E3", "#74b9ff"],
  ["#FDCB6E", "#ffeaa7"],
  ["#E84393", "#fd79a8"],
];

function getAvatarColors(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function WorkspaceCard({ workspace, index }: { workspace: Workspace; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [c1, c2] = getAvatarColors(index);
  const initials = workspace.title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const date = workspace.createdAt
    ? new Date(workspace.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        border: hovered ? "1.5px solid #6C5CE7" : "1.5px solid #E8E6E0",
        borderRadius: 12,
        padding: "20px",
        cursor: "pointer",
        transition: "all 0.18s ease",
        boxShadow: hovered
          ? "0 4px 20px rgba(108, 92, 231, 0.12)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {initials || <Briefcase size={15} color="#fff" />}
          </div>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: hovered ? "#6C5CE7" : "#1A1918",
                lineHeight: 1.3,
                transition: "color 0.15s",
              }}
            >
              {workspace.title}
            </p>
            <p
              style={{
                fontSize: 10,
                fontWeight: 400,
                color: hovered ? "#6C5CE7" : "#1A1918",
                lineHeight: 1.3,
                transition: "color 0.15s",
              }}
            >
              {workspace.companyname}
            </p>
            
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
              {workspace.visibility === "private" ? (
                <Lock size={10} color="#9A9890" />
              ) : (
                <Globe size={10} color="#9A9890" />
              )}
              <span style={{ fontSize: 11, color: "#9A9890", textTransform: "capitalize" }}>
                {workspace.visibility ?? "public"}
              </span>
            </div>
          </div>
        </div>
      </div>

      
      {workspace.describtion && (
        <p
          style={{
            fontSize: 13,
            color: "#6B6860",
            lineHeight: 1.5,
            marginBottom: 14,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {workspace.describtion}
        </p>
      )}

     
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingTop: 12,
          borderTop: "1px solid #F4F4F2",
        }}
      >
        {workspace.memberCount !== undefined && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Users size={12} color="#9A9890" />
            <span style={{ fontSize: 12, color: "#9A9890" }}>
              {workspace.memberCount} member{workspace.memberCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
        {date && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={12} color="#9A9890" />
            <span style={{ fontSize: 12, color: "#9A9890" }}>{date}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface AllWorkspacesClientProps {
  initialWorkspaces: Workspace[];
  initialError: string | null;
}

export default function AllWorkspacesClient({ initialWorkspaces, initialError }: AllWorkspacesClientProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(initialError);
  const { isOpen, closeModal } = useWorkspaceModal();

  const fetchWorkspaces = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const result = await getAllWorkspaces();
      if (result.success) {
        setWorkspaces(result.workspaces);
      } else {
        setFetchError("Failed to load workspaces. Please try again.");
      }
    } catch {
      setFetchError("Failed to load workspaces. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {isOpen && (
        <CreateWorkspaceModal
          onClose={closeModal}
          onSuccess={fetchWorkspaces}
          getworkspaces={fetchWorkspaces}
        />
      )}

      <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1A1918",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
              marginBottom: 4,
            }}
          >
            All Workspaces
          </h1>
          <p style={{ fontSize: 13, color: "#9A9890" }}>
            Browse and join public workspaces available to your team.
          </p>
        </div>

        {fetchError && (
          <div
            style={{
              background: "#FFF5F5",
              border: "1px solid #FED7D7",
              borderRadius: 10,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
              fontSize: 13,
              color: "#C53030",
            }}
          >
            <AlertCircle size={15} />
            {fetchError}
            <button
              onClick={fetchWorkspaces}
              style={{
                marginLeft: "auto",
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 500,
                color: "#C53030",
                background: "transparent",
                border: "1px solid #FEB2B2",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <WorkspaceSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !fetchError && workspaces.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Briefcase size={24} color="#fff" />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1A1918", marginBottom: 6 }}>
              No workspaces yet
            </h2>
            <p style={{ fontSize: 13, color: "#9A9890", maxWidth: 280 }}>
              Create your first workspace and invite your team to get started.
            </p>
          </div>
        )}

        {!loading && !fetchError && workspaces.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {workspaces.map((ws, i) => (
              <WorkspaceCard key={ws.id} workspace={ws} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
