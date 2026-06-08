"use client";

import React from "react";

export default function ProjectDetailLoading() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-pulse">
      <style>{`
        @keyframes pulse-bg {
          0%, 100% { background-color: #F0EEE8; }
          50%       { background-color: #E2DFD7; }
        }
        .pulse-skeleton {
          animation: pulse-bg 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Detail header card skeleton */}
      <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: 16, border: "1.5px solid #E8E6E0" }}>
        <div className="pulse-skeleton" style={{ width: 130, height: 14, borderRadius: 4, marginBottom: 24 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div className="pulse-skeleton" style={{ width: 44, height: 44, borderRadius: 12 }} />
              <div className="pulse-skeleton" style={{ width: 280, height: 26, borderRadius: 6 }} />
            </div>
            <div className="pulse-skeleton" style={{ width: "80%", height: 13, borderRadius: 4, marginBottom: 8 }} />
            <div className="pulse-skeleton" style={{ width: "50%", height: 13, borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div className="pulse-skeleton" style={{ width: 120, height: 38, borderRadius: 10 }} />
            <div className="pulse-skeleton" style={{ width: 100, height: 38, borderRadius: 10 }} />
          </div>
        </div>
      </div>

      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Field */}
        <div style={{ background: "#FFFFFF", padding: 18, borderRadius: 16, border: "1.5px solid #E8E6E0", display: "flex", alignItems: "center", gap: 16 }}>
          <div className="pulse-skeleton" style={{ width: 42, height: 42, borderRadius: 12 }} />
          <div>
            <div className="pulse-skeleton" style={{ width: 80, height: 10, borderRadius: 3, marginBottom: 6 }} />
            <div className="pulse-skeleton" style={{ width: 100, height: 14, borderRadius: 4 }} />
          </div>
        </div>

        {/* Status */}
        <div style={{ background: "#FFFFFF", padding: 18, borderRadius: 16, border: "1.5px solid #E8E6E0", display: "flex", alignItems: "center", gap: 16 }}>
          <div className="pulse-skeleton" style={{ width: 42, height: 42, borderRadius: 12 }} />
          <div>
            <div className="pulse-skeleton" style={{ width: 60, height: 10, borderRadius: 3, marginBottom: 6 }} />
            <div className="pulse-skeleton" style={{ width: 80, height: 14, borderRadius: 4 }} />
          </div>
        </div>

        {/* Progress (span-2) */}
        <div style={{ background: "#FFFFFF", padding: 18, borderRadius: 16, border: "1.5px solid #E8E6E0" }} className="sm:col-span-2 flex flex-col justify-center">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div className="pulse-skeleton" style={{ width: 120, height: 11, borderRadius: 4 }} />
            <div className="pulse-skeleton" style={{ width: 150, height: 11, borderRadius: 4 }} />
          </div>
          <div className="pulse-skeleton" style={{ width: "100%", height: 10, borderRadius: 999 }} />
        </div>
      </div>

      {/* Assigned Tasks Box Skeleton */}
      <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1.5px solid #E8E6E0", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #F0EEE9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="pulse-skeleton" style={{ width: 160, height: 16, borderRadius: 4 }} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#FAF9F6" }}>
              <tr>
                {["Task Name", "Priority", "Status", ""].map((col, idx) => (
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
              {Array.from({ length: 3 }).map((_, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #F0EEE9" }}>
                  <td style={{ padding: "16px 24px" }}>
                    <div className="pulse-skeleton" style={{ width: 160, height: 14, borderRadius: 4, marginBottom: 6 }} />
                    <div className="pulse-skeleton" style={{ width: 220, height: 10, borderRadius: 4 }} />
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

      {/* Split Members and Teams Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Members Column */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1.5px solid #E8E6E0", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #F0EEE9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="pulse-skeleton" style={{ width: 140, height: 16, borderRadius: 4 }} />
            <div className="pulse-skeleton" style={{ width: 100, height: 28, borderRadius: 10 }} />
          </div>
          <div style={{ padding: "12px 24px" }}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #F5F4F0" }}>
                <div className="pulse-skeleton" style={{ width: 36, height: 36, borderRadius: 10 }} />
                <div style={{ flex: 1 }}>
                  <div className="pulse-skeleton" style={{ width: 120, height: 13, borderRadius: 4, marginBottom: 4 }} />
                  <div className="pulse-skeleton" style={{ width: 160, height: 10, borderRadius: 3 }} />
                </div>
                <div>
                  <div className="pulse-skeleton" style={{ width: 60, height: 18, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teams Column */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1.5px solid #E8E6E0", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #F0EEE9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="pulse-skeleton" style={{ width: 120, height: 16, borderRadius: 4 }} />
            <div className="pulse-skeleton" style={{ width: 100, height: 28, borderRadius: 10 }} />
          </div>
          <div style={{ padding: "12px 24px" }}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #F5F4F0" }}>
                <div style={{ flex: 1 }}>
                  <div className="pulse-skeleton" style={{ width: 100, height: 14, borderRadius: 4, marginBottom: 4 }} />
                  <div className="pulse-skeleton" style={{ width: 70, height: 10, borderRadius: 3 }} />
                </div>
                <div className="pulse-skeleton" style={{ width: 20, height: 20, borderRadius: 4 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
