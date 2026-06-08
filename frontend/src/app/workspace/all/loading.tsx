"use client";

import React from "react";

function WorkspaceSkeleton() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1.5px solid #E8E6E0",
        borderRadius: 12,
        padding: "20px",
        animation: "workspace-pulse 1.5s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes workspace-pulse {
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

export default function AllWorkspacesLoading() {
  return (
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
    </div>
  );
}
