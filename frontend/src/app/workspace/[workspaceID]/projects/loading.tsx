"use client";

import React from "react";

function ProjectSkeletonCard() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1.5px solid #E8E6E0",
        borderRadius: 16,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        animation: "project-pulse 1.5s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes project-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        @keyframes pulse-bg {
          0%, 100% { background-color: #F0EEE8; }
          50%       { background-color: #E2DFD7; }
        }
        .pulse-skeleton {
          animation: pulse-bg 1.5s ease-in-out infinite;
        }
      `}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="pulse-skeleton" style={{ width: 60, height: 20, borderRadius: 8 }} />
        <div className="pulse-skeleton" style={{ width: 80, height: 12, borderRadius: 4 }} />
      </div>
      <div>
        <div className="pulse-skeleton" style={{ width: "75%", height: 16, borderRadius: 4, marginBottom: 8 }} />
        <div className="pulse-skeleton" style={{ width: 60, height: 16, borderRadius: 6, marginBottom: 12 }} />
        <div className="pulse-skeleton" style={{ width: "100%", height: 13, borderRadius: 4, marginBottom: 6 }} />
        <div className="pulse-skeleton" style={{ width: "85%", height: 13, borderRadius: 4 }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <div className="pulse-skeleton" style={{ width: 100, height: 10, borderRadius: 3 }} />
          <div className="pulse-skeleton" style={{ width: 30, height: 10, borderRadius: 3 }} />
        </div>
        <div style={{ width: "100%", background: "#F0EEE8", height: 6, borderRadius: 999 }} />
      </div>
    </div>
  );
}

export default function ProjectsLoading() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-10 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="pulse-skeleton" style={{ width: 220, height: 28, borderRadius: 6, marginBottom: 8 }} />
          <div className="pulse-skeleton" style={{ width: 380, height: 14, borderRadius: 4 }} />
        </div>
        <div className="pulse-skeleton" style={{ width: 120, height: 38, borderRadius: 10 }} />
      </div>

      <div className="space-y-6">
        <div className="pulse-skeleton" style={{ width: 150, height: 14, borderRadius: 4 }} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ProjectSkeletonCard key={idx} />
          ))}
        </div>
      </div>
    </main>
  );
}
