"use client";

import React from "react";

export default function ActivityLoading() {
  return (
    <main className="max-w-[1200px] mx-auto px-8 py-6 space-y-8 animate-pulse">
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="pulse-skeleton" style={{ width: 180, height: 26, borderRadius: 6, marginBottom: 8 }} />
          <div className="pulse-skeleton" style={{ width: 340, height: 13, borderRadius: 4 }} />
        </div>
      </div>

      {/* Stats Counter Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} style={{ background: "#FFFFFF", padding: 16, borderRadius: 12, border: "1.5px solid #E8E6E0", display: "flex", alignItems: "center", gap: 16 }}>
            <div className="pulse-skeleton" style={{ width: 44, height: 44, borderRadius: 8 }} />
            <div>
              <div className="pulse-skeleton" style={{ width: 90, height: 10, borderRadius: 3, marginBottom: 6 }} />
              <div className="pulse-skeleton" style={{ width: 40, height: 20, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: timeline feed (left) vs sidebar insights (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters Bar */}
          <div style={{ background: "#FFFFFF", padding: 12, borderRadius: 12, border: "1.5px solid #E8E6E0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="pulse-skeleton" style={{ width: 220, height: 32, borderRadius: 8 }} />
            <div style={{ display: "flex", gap: 12 }}>
              <div className="pulse-skeleton" style={{ width: 100, height: 32, borderRadius: 8 }} />
              <div className="pulse-skeleton" style={{ width: 110, height: 32, borderRadius: 8 }} />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: "flex", gap: 16, borderBottom: "1.5px solid #E8E6E0", paddingBottom: 10 }}>
            {["All Activities", "Projects", "Tasks", "Members", "Teams"].map((tab, idx) => (
              <div key={idx} className="pulse-skeleton" style={{ width: idx === 0 ? 100 : 70, height: 14, borderRadius: 4 }} />
            ))}
          </div>

          {/* Timeline Feed Skeleton */}
          <div style={{ position: "relative", paddingLeft: 24, borderLeft: "2px solid #E8E6E0", marginLeft: 14 }} className="space-y-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                {/* Timeline node dot */}
                <div className="pulse-skeleton" style={{ position: "absolute", left: -36, top: 4, width: 24, height: 24, borderRadius: "50%" }} />
                
                {/* Timeline Card */}
                <div style={{ background: "#FFFFFF", border: "1.5px solid #E8E6E0", borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div className="pulse-skeleton" style={{ width: "60%", height: 13, borderRadius: 4, marginBottom: 8 }} />
                      <div className="pulse-skeleton" style={{ width: "90%", height: 11, borderRadius: 4, marginBottom: 4 }} />
                      <div className="pulse-skeleton" style={{ width: "40%", height: 11, borderRadius: 4 }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                      <div className="pulse-skeleton" style={{ width: 130, height: 10, borderRadius: 3 }} />
                      <div className="pulse-skeleton" style={{ width: 60, height: 16, borderRadius: 999 }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column (1/3 width) */}
        <div className="space-y-6">
          {/* Productivity insight Card */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid #E8E6E0", borderRadius: 12, padding: 20 }} className="space-y-4">
            <div className="pulse-skeleton" style={{ width: 140, height: 15, borderRadius: 4 }} />
            <div className="pulse-skeleton" style={{ width: 200, height: 10, borderRadius: 3 }} />
            
            <div style={{ marginTop: 24 }} className="space-y-3">
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div className="pulse-skeleton" style={{ width: 120, height: 11, borderRadius: 4 }} />
                  <div className="pulse-skeleton" style={{ width: 30, height: 11, borderRadius: 4 }} />
                </div>
                <div className="pulse-skeleton" style={{ width: "100%", height: 8, borderRadius: 999 }} />
              </div>
              
              <div style={{ borderTop: "1px solid #F0EEE9", paddingTop: 16 }}>
                <div className="pulse-skeleton" style={{ width: 110, height: 10, borderRadius: 3, marginBottom: 12 }} />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="pulse-skeleton" style={{ width: 8, height: 8, borderRadius: "50%" }} />
                        <div className="pulse-skeleton" style={{ width: 80, height: 11, borderRadius: 3 }} />
                      </div>
                      <div className="pulse-skeleton" style={{ width: 70, height: 11, borderRadius: 3 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick tips Card */}
          <div style={{ background: "#1F1F24", border: "1.5px solid #2F2F35", borderRadius: 12, padding: 20 }} className="space-y-3">
            <div className="pulse-skeleton" style={{ width: 100, height: 14, borderRadius: 4 }} />
            <div className="pulse-skeleton" style={{ width: "100%", height: 10, borderRadius: 3 }} />
            <div className="pulse-skeleton" style={{ width: "90%", height: 10, borderRadius: 3 }} />
            <div className="pulse-skeleton" style={{ width: "95%", height: 10, borderRadius: 3 }} />
          </div>
        </div>
      </div>
    </main>
  );
}
