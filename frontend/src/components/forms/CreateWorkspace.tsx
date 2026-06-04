"use client";

import { useState } from "react";
import { X, Briefcase, FileText, Globe, Lock, Loader2 } from "lucide-react";
import { createWorkspace } from "@/app/actions/workspace";

interface CreateWorkspaceModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  getworkspaces: () => Promise<void>;
}

export default function CreateWorkspaceModal({ onClose, onSuccess, getworkspaces }: CreateWorkspaceModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    describtion: "",
    companyname: "",
    visibility: "public",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Workspace name is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await createWorkspace(formData);
      if (result.success) {
        onSuccess?.();
        onClose();
        getworkspaces();
      } else {
        setError(result.message || "Failed to create workspace.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10, 10, 11, 0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .ws-modal-card {
          animation: slideUp 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ws-input:focus {
          outline: none;
          border-color: #6C5CE7 !important;
          box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
        }
        .vis-option {
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .vis-option:hover {
          border-color: #6C5CE7 !important;
          background: rgba(108, 92, 231, 0.04) !important;
        }
      `}</style>

      {/* Modal card */}
      <div
        className="ws-modal-card"
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          width: "100%",
          maxWidth: 480,
          margin: "0 16px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 18px",
            borderBottom: "1px solid #F0EEE8",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Briefcase size={15} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1918", lineHeight: 1.3 }}>
                New Workspace
              </p>
              <p style={{ fontSize: 12, color: "#9A9890", marginTop: 1 }}>
                Set up a shared space for your team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "1px solid #E8E6E0",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F4F2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <X size={14} color="#6B6860" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          {/* Error banner */}
          {error && (
            <div
              style={{
                background: "#FFF5F5",
                border: "1px solid #FED7D7",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 13,
                color: "#C53030",
              }}
            >
              {error}
            </div>
          )}

          {/* Workspace name */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                color: "#4A4845",
                marginBottom: 6,
                letterSpacing: "0.01em",
              }}
            >
              Workspace Name <span style={{ color: "#E53E3E" }}>*</span>
            </label>
            <input
              className="ws-input"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Acme Engineering"
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                color: "#1A1918",
                background: "#FAFAF8",
                border: "1.5px solid #E8E6E0",
                borderRadius: 8,
                boxSizing: "border-box",
                fontFamily: "inherit",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            />
          </div>


          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                color: "#4A4845",
                marginBottom: 6,
                letterSpacing: "0.01em",
              }}
            >
              Company Name <span style={{ color: "#E53E3E" }}>*</span>
            </label>
            <input
              className="ws-input"
              type="text"
              name="companyname"
              value={formData.companyname}
              onChange={handleChange}
              placeholder="e.g. Acme Engineering"
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                color: "#1A1918",
                background: "#FAFAF8",
                border: "1.5px solid #E8E6E0",
                borderRadius: 8,
                boxSizing: "border-box",
                fontFamily: "inherit",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                color: "#4A4845",
                marginBottom: 6,
                letterSpacing: "0.01em",
              }}
            >
              Description
              <span style={{ fontWeight: 400, color: "#9A9890", marginLeft: 4 }}>(optional)</span>
            </label>
            <div style={{ position: "relative" }}>
              <FileText
                size={14}
                style={{
                  position: "absolute",
                  top: 11,
                  left: 11,
                  color: "#9A9890",
                  pointerEvents: "none",
                }}
              />
              <textarea
                className="ws-input"
                name="describtion"
                value={formData.describtion}
                onChange={handleChange}
                placeholder="What is this workspace for?"
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 32px",
                  fontSize: 14,
                  color: "#1A1918",
                  background: "#FAFAF8",
                  border: "1.5px solid #E8E6E0",
                  borderRadius: 8,
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  resize: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
              />
            </div>
          </div>

          {/* Visibility toggle */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                color: "#4A4845",
                marginBottom: 8,
                letterSpacing: "0.01em",
              }}
            >
              Visibility
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                {
                  value: "public",
                  icon: <Globe size={14} />,
                  label: "Public",
                  desc: "Anyone can view",
                },
                {
                  value: "private",
                  icon: <Lock size={14} />,
                  label: "Private",
                  desc: "Invite only",
                },
              ].map((opt) => {
                const selected = formData.visibility === opt.value;
                return (
                  <div
                    key={opt.value}
                    className="vis-option"
                    onClick={() => setFormData({ ...formData, visibility: opt.value })}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: selected ? "1.5px solid #6C5CE7" : "1.5px solid #E8E6E0",
                      background: selected ? "rgba(108, 92, 231, 0.06)" : "#FAFAF8",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        marginTop: 1,
                        color: selected ? "#6C5CE7" : "#9A9890",
                        flexShrink: 0,
                      }}
                    >
                      {opt.icon}
                    </span>
                    <div>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: selected ? "#6C5CE7" : "#1A1918",
                          lineHeight: 1.3,
                        }}
                      >
                        {opt.label}
                      </p>
                      <p style={{ fontSize: 11, color: "#9A9890", marginTop: 1 }}>
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 16px",
                fontSize: 13,
                fontWeight: 500,
                color: "#4A4845",
                background: "transparent",
                border: "1.5px solid #E8E6E0",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F4F2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "9px 20px",
                fontSize: 13,
                fontWeight: 500,
                color: "#FFFFFF",
                background: loading ? "#a29bfe" : "#6C5CE7",
                border: "none",
                borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#5a4ed1";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = "#6C5CE7";
              }}
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              {loading ? "Creating…" : "Create Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
