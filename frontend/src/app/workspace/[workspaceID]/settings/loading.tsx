"use client";

import React from "react";

export default function SettingsLoading() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-8 space-y-8 animate-pulse">
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
      <div style={{ borderBottom: "1.5px solid #E8E6E0", paddingBottom: 20 }}>
        <div className="pulse-skeleton" style={{ width: 200, height: 26, borderRadius: 6, marginBottom: 8 }} />
        <div className="pulse-skeleton" style={{ width: 420, height: 14, borderRadius: 4 }} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* General Info Card Skeleton */}
        <div style={{ background: "#FFFFFF", border: "1.5px solid #E8E6E0", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: 24, borderBottom: "1px solid #F0EEE9" }}>
            <div className="pulse-skeleton" style={{ width: 140, height: 18, borderRadius: 4, marginBottom: 6 }} />
            <div className="pulse-skeleton" style={{ width: 280, height: 11, borderRadius: 3 }} />
          </div>

          <div style={{ padding: 24 }} className="space-y-6">
            {/* Input 1 */}
            <div className="space-y-2">
              <div className="pulse-skeleton" style={{ width: 100, height: 10, borderRadius: 3 }} />
              <div className="pulse-skeleton" style={{ width: "100%", height: 38, borderRadius: 8 }} />
            </div>

            {/* Input 2 */}
            <div className="space-y-2">
              <div className="pulse-skeleton" style={{ width: 100, height: 10, borderRadius: 3 }} />
              <div className="pulse-skeleton" style={{ width: "100%", height: 38, borderRadius: 8 }} />
            </div>

            {/* Textarea */}
            <div className="space-y-2">
              <div className="pulse-skeleton" style={{ width: 80, height: 10, borderRadius: 3 }} />
              <div className="pulse-skeleton" style={{ width: "100%", height: 96, borderRadius: 8 }} />
            </div>

            {/* Select */}
            <div className="space-y-2">
              <div className="pulse-skeleton" style={{ width: 130, height: 10, borderRadius: 3 }} />
              <div className="pulse-skeleton" style={{ width: "100%", height: 38, borderRadius: 8 }} />
            </div>
          </div>

          {/* Footer Action */}
          <div style={{ padding: 24, background: "#FAF9F6", borderTop: "1px solid #F0EEE9", display: "flex", justifyContent: "flex-end" }}>
            <div className="pulse-skeleton" style={{ width: 120, height: 38, borderRadius: 8 }} />
          </div>
        </div>

        {/* Workspace Avatar Appearance Skeleton */}
        <div style={{ background: "#FFFFFF", border: "1.5px solid #E8E6E0", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: 24, borderBottom: "1px solid #F0EEE9" }}>
            <div className="pulse-skeleton" style={{ width: 220, height: 18, borderRadius: 4, marginBottom: 6 }} />
            <div className="pulse-skeleton" style={{ width: 320, height: 11, borderRadius: 3 }} />
          </div>

          <div style={{ padding: 24 }}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Preview Box */}
              <div style={{ background: "#FAF9F6", padding: 24, borderRadius: 12, border: "1px solid #F0EEE8", width: "100%", maxWidth: 224, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div className="pulse-skeleton" style={{ width: 80, height: 10, borderRadius: 3, marginBottom: 16 }} />
                <div className="pulse-skeleton" style={{ width: 80, height: 80, borderRadius: 16 }} />
                <div className="pulse-skeleton" style={{ width: 100, height: 12, borderRadius: 4, marginTop: 16 }} />
              </div>

              {/* Customization Details */}
              <div style={{ flex: 1, width: "100%" }} className="space-y-6">
                <div className="space-y-3">
                  <div className="pulse-skeleton" style={{ width: 140, height: 10, borderRadius: 3 }} />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="pulse-skeleton" style={{ height: 36, borderRadius: 8 }} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="pulse-skeleton" style={{ width: 120, height: 10, borderRadius: 3 }} />
                    <div className="pulse-skeleton" style={{ height: 38, borderRadius: 8 }} />
                  </div>
                  <div className="space-y-2">
                    <div className="pulse-skeleton" style={{ width: 100, height: 10, borderRadius: 3 }} />
                    <div className="pulse-skeleton" style={{ height: 38, borderRadius: 8 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div style={{ padding: 24, background: "#FAF9F6", borderTop: "1px solid #F0EEE9", display: "flex", justifyContent: "flex-end" }}>
            <div className="pulse-skeleton" style={{ width: 140, height: 38, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </main>
  );
}
