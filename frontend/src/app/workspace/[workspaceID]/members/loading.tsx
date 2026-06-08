"use client";

import React from "react";

export default function MembersLoading() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-6 space-y-8 animate-pulse">
      <style>{`
        @keyframes pulse-bg {
          0%, 100% { background-color: #F0EEE8; }
          50%       { background-color: #E2DFD7; }
        }
        .pulse-skeleton {
          animation: pulse-bg 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Header Skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E8E6E0", paddingBottom: 16 }}>
        <div>
          <div className="pulse-skeleton" style={{ width: 150, height: 26, borderRadius: 6, marginBottom: 8 }} />
          <div className="pulse-skeleton" style={{ width: 300, height: 13, borderRadius: 4 }} />
        </div>
        <div className="pulse-skeleton" style={{ width: 140, height: 38, borderRadius: 6 }} />
      </div>

      {/* Search Input Skeleton */}
      <div className="pulse-skeleton" style={{ width: 384, height: 38, borderRadius: 6 }} />

      {/* Members Table Box Skeleton */}
      <div style={{ background: "#FFFFFF", border: "1.5px solid #E8E6E0", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#FAF9F6" }}>
              <tr>
                {["Name", "Email", "Role", "Status", ""].map((col, idx) => (
                  <th
                    key={idx}
                    style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#9A9890",
                      textTransform: "uppercase",
                      borderBottom: "1.5px solid #E8E6E0",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #F0EEE9" }}>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="pulse-skeleton" style={{ width: 32, height: 32, borderRadius: "50%" }} />
                      <div className="pulse-skeleton" style={{ width: 110, height: 14, borderRadius: 4 }} />
                    </div>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div className="pulse-skeleton" style={{ width: 180, height: 14, borderRadius: 4 }} />
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div className="pulse-skeleton" style={{ width: 80, height: 14, borderRadius: 4 }} />
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div className="pulse-skeleton" style={{ width: 75, height: 22, borderRadius: 999 }} />
                  </td>
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    <div className="pulse-skeleton" style={{ width: 60, height: 24, borderRadius: 6, display: "inline-block" }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Counts Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} style={{ background: "#FFFFFF", padding: 16, borderRadius: 8, border: "1.5px solid #E8E6E0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="pulse-skeleton" style={{ width: 70, height: 14, borderRadius: 4 }} />
            <div className="pulse-skeleton" style={{ width: 24, height: 24, borderRadius: 4 }} />
          </div>
        ))}
      </div>

      {/* Teams Section Divider Skeleton */}
      <div style={{ paddingTop: 32, borderTop: "1.5px solid #E8E6E0", marginTop: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div className="pulse-skeleton" style={{ width: 160, height: 24, borderRadius: 6, marginBottom: 8 }} />
            <div className="pulse-skeleton" style={{ width: 240, height: 13, borderRadius: 4 }} />
          </div>
          <div className="pulse-skeleton" style={{ width: 120, height: 38, borderRadius: 6 }} />
        </div>

        {/* Project Teams Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} style={{ background: "#FFFFFF", border: "1.5px solid #E8E6E0", borderRadius: 8, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div className="pulse-skeleton" style={{ width: 100, height: 16, borderRadius: 4, marginBottom: 6 }} />
                  <div className="pulse-skeleton" style={{ width: 80, height: 11, borderRadius: 3 }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div className="pulse-skeleton" style={{ width: 20, height: 20, borderRadius: 999 }} />
                  <div className="pulse-skeleton" style={{ width: 20, height: 20, borderRadius: 4 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
