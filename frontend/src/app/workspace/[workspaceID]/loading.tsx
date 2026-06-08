"use client";

import React from "react";

export default function WorkspaceDashboardLoading() {
  return (
    <div style={{ maxWidth: 1100, padding: "24px 32px" }} className="animate-pulse">
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
      <div style={{ marginBottom: 28 }}>
        <div
          className="pulse-skeleton"
          style={{ width: 280, height: 28, borderRadius: 8, marginBottom: 8 }}
        />
        <div
          className="pulse-skeleton"
          style={{ width: 420, height: 14, borderRadius: 6 }}
        />
      </div>

      {/* Quick Actions Skeleton */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(108, 92, 231, 0.02) 0%, rgba(162, 155, 254, 0.02) 100%)",
          border: "1.5px dashed rgba(108, 92, 231, 0.15)",
          borderRadius: 16,
          padding: "20px 24px",
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            className="pulse-skeleton"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
            }}
          />
          <div>
            <div
              className="pulse-skeleton"
              style={{ width: 100, height: 14, borderRadius: 4, marginBottom: 4 }}
            />
            <div
              className="pulse-skeleton"
              style={{ width: 220, height: 10, borderRadius: 4 }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div
            className="pulse-skeleton"
            style={{ width: 140, height: 38, borderRadius: 10 }}
          />
          <div
            className="pulse-skeleton"
            style={{ width: 110, height: 38, borderRadius: 10 }}
          />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        style={{ marginBottom: 32 }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #E8E6E0",
              borderRadius: 12,
              padding: "20px 24px",
            }}
          >
            <div
              className="pulse-skeleton"
              style={{ width: 90, height: 10, borderRadius: 3, marginBottom: 12 }}
            />
            <div
              className="pulse-skeleton"
              style={{ width: 60, height: 32, borderRadius: 6, marginBottom: 10 }}
            />
            <div
              className="pulse-skeleton"
              style={{ width: 120, height: 11, borderRadius: 4 }}
            />
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Recent Projects */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E6E0",
            borderRadius: 16,
            padding: "24px 24px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                className="pulse-skeleton"
                style={{ width: 120, height: 15, borderRadius: 4, marginBottom: 6 }}
              />
              <div
                className="pulse-skeleton"
                style={{ width: 200, height: 10, borderRadius: 4 }}
              />
            </div>
            <div
              className="pulse-skeleton"
              style={{ width: 60, height: 26, borderRadius: 8 }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingBottom: 12,
                  borderBottom: "1px solid #F0EEE9",
                }}
              >
                <div
                  className="pulse-skeleton"
                  style={{ width: 32, height: 32, borderRadius: "50%" }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    className="pulse-skeleton"
                    style={{ width: "65%", height: 12, borderRadius: 4, marginBottom: 6 }}
                  />
                  <div
                    className="pulse-skeleton"
                    style={{ width: "30%", height: 9, borderRadius: 3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: My Tasks */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E6E0",
            borderRadius: 16,
            padding: "24px 24px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                className="pulse-skeleton"
                style={{ width: 140, height: 15, borderRadius: 4, marginBottom: 6 }}
              />
              <div
                className="pulse-skeleton"
                style={{ width: 180, height: 10, borderRadius: 4 }}
              />
            </div>
            <div
              className="pulse-skeleton"
              style={{ width: 60, height: 26, borderRadius: 8 }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingBottom: 12,
                  borderBottom: "1px solid #F0EEE9",
                }}
              >
                <div
                  className="pulse-skeleton"
                  style={{ width: 18, height: 18, borderRadius: 5 }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    className="pulse-skeleton"
                    style={{ width: "80%", height: 12, borderRadius: 4, marginBottom: 6 }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <div
                      className="pulse-skeleton"
                      style={{ width: 45, height: 14, borderRadius: 999 }}
                    />
                    <div
                      className="pulse-skeleton"
                      style={{ width: 70, height: 10, borderRadius: 3, marginTop: 2 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
