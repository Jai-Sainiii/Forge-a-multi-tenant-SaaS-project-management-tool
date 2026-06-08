"use client";

import React from "react";

export default function TaskDetailLoading() {
  return (
    <main style={{ maxWidth: 1000 }} className="mx-auto px-6 py-6 space-y-8 animate-pulse">
      <style>{`
        @keyframes pulse-bg {
          0%, 100% { background-color: #F0EEE8; }
          50%       { background-color: #E2DFD7; }
        }
        .pulse-skeleton {
          animation: pulse-bg 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Back button link skeleton */}
      <div>
        <div className="pulse-skeleton" style={{ width: 110, height: 16, borderRadius: 4, marginBottom: 24 }} />

        {/* Title, badges, and action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
              <div className="pulse-skeleton" style={{ width: 42, height: 42, borderRadius: 8 }} />
              <div className="pulse-skeleton" style={{ width: 320, height: 28, borderRadius: 6 }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div className="pulse-skeleton" style={{ width: 140, height: 38, borderRadius: 6 }} />
              <div className="pulse-skeleton" style={{ width: 100, height: 38, borderRadius: 6 }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <div className="pulse-skeleton" style={{ width: 75, height: 22, borderRadius: 999 }} />
            <div className="pulse-skeleton" style={{ width: 120, height: 22, borderRadius: 999 }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Description (left) vs Sidebar Details (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description Box */}
        <div className="lg:col-span-2 space-y-6">
          <div style={{ background: "#FFFFFF", padding: 24, borderRadius: 8, border: "1.5px solid #E8E6E0" }}>
            <div className="pulse-skeleton" style={{ width: 100, height: 12, borderRadius: 4, marginBottom: 20 }} />
            <div className="space-y-3">
              <div className="pulse-skeleton" style={{ width: "100%", height: 13, borderRadius: 4 }} />
              <div className="pulse-skeleton" style={{ width: "95%", height: 13, borderRadius: 4 }} />
              <div className="pulse-skeleton" style={{ width: "98%", height: 13, borderRadius: 4 }} />
              <div className="pulse-skeleton" style={{ width: "60%", height: 13, borderRadius: 4 }} />
            </div>
          </div>
        </div>

        {/* Right Column: Metadata Sidebar */}
        <div className="space-y-6">
          <div style={{ background: "#FFFFFF", padding: 24, borderRadius: 8, border: "1.5px solid #E8E6E0" }} className="space-y-6">
            <div>
              <div className="pulse-skeleton" style={{ width: 80, height: 10, borderRadius: 3, marginBottom: 8 }} />
              <div className="pulse-skeleton" style={{ width: 120, height: 14, borderRadius: 4 }} />
            </div>
            <div>
              <div className="pulse-skeleton" style={{ width: 90, height: 10, borderRadius: 3, marginBottom: 8 }} />
              <div className="pulse-skeleton" style={{ width: 160, height: 14, borderRadius: 4 }} />
            </div>
            <div>
              <div className="pulse-skeleton" style={{ width: 90, height: 10, borderRadius: 3, marginBottom: 8 }} />
              <div className="pulse-skeleton" style={{ width: 140, height: 14, borderRadius: 4 }} />
            </div>
          </div>

          <div style={{ background: "#FFFFFF", padding: 24, borderRadius: 8, border: "1.5px solid #E8E6E0" }}>
            <div className="pulse-skeleton" style={{ width: 80, height: 11, borderRadius: 4, marginBottom: 16 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="pulse-skeleton" style={{ width: 32, height: 32, borderRadius: "50%" }} />
                  <div style={{ flex: 1 }}>
                    <div className="pulse-skeleton" style={{ width: "70%", height: 12, borderRadius: 4, marginBottom: 4 }} />
                    <div className="pulse-skeleton" style={{ width: "50%", height: 9, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
