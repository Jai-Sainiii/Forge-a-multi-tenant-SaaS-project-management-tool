"use client";

import React from "react";

export default function TasksLoading() {
  return (
    <main style={{ maxWidth: 1200 }} className="mx-auto px-6 py-6 space-y-8 animate-pulse">
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
          <div className="pulse-skeleton" style={{ width: 140, height: 26, borderRadius: 6, marginBottom: 8 }} />
          <div className="pulse-skeleton" style={{ width: 320, height: 13, borderRadius: 4 }} />
        </div>
        <div className="pulse-skeleton" style={{ width: 110, height: 38, borderRadius: 6 }} />
      </div>

      {/* Search/Filter Bar Skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="pulse-skeleton" style={{ width: 384, height: 38, borderRadius: 6 }} />
      </div>

      {/* Table Skeleton */}
      <div style={{ background: "#FFFFFF", border: "1.5px solid #E8E6E0", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#FAF9F6" }}>
              <tr>
                {["Task Name", "Project", "Priority", "Status", ""].map((col, idx) => (
                  <th
                    key={idx}
                    style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#9A9890",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1.5px solid #E8E6E0",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ background: "#FFFFFF" }}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #F0EEE9" }}>
                  <td style={{ padding: "16px 24px" }}>
                    <div className="pulse-skeleton" style={{ width: 180, height: 14, borderRadius: 4, marginBottom: 6 }} />
                    <div className="pulse-skeleton" style={{ width: 280, height: 10, borderRadius: 4 }} />
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div className="pulse-skeleton" style={{ width: 90, height: 22, borderRadius: 4 }} />
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div className="pulse-skeleton" style={{ width: 80, height: 14, borderRadius: 4 }} />
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div className="pulse-skeleton" style={{ width: 75, height: 22, borderRadius: 999 }} />
                  </td>
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    <div className="pulse-skeleton" style={{ width: 24, height: 24, borderRadius: 4, display: "inline-block" }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
