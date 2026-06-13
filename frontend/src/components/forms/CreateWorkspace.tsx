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
          border-color: #000000 !important;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
        }
        .dark .ws-input:focus {
          border-color: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }
        .vis-option {
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .vis-option:hover {
          border-color: #000000 !important;
          background: rgba(0, 0, 0, 0.02) !important;
        }
        .dark .vis-option:hover {
          border-color: #ffffff !important;
          background: rgba(255, 255, 255, 0.02) !important;
        }
      `}</style>

      {/* Modal card */}
      <div
        className="ws-modal-card bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10"
        style={{
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
          className="border-b border-black/5 dark:border-white/5"
          style={{
            padding: "20px 24px 18px",
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
                background: "linear-gradient(135deg, #18181B 0%, #3F3F46 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Briefcase size={15} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <p className="text-zinc-900 dark:text-zinc-100 font-semibold" style={{ fontSize: 14, lineHeight: 1.3 }}>
                New Workspace
              </p>
              <p className="text-zinc-400 dark:text-zinc-500" style={{ fontSize: 12, marginTop: 1 }}>
                Set up a shared space for your team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            <X size={14} className="currentColor" strokeWidth={2} />
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
              className="text-zinc-700 dark:text-zinc-300"
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 6,
                letterSpacing: "0.01em",
              }}
            >
              Workspace Name <span style={{ color: "#E53E3E" }}>*</span>
            </label>
            <input
              className="ws-input w-full px-3 py-2.5 text-sm text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-all"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Acme Engineering"
              autoFocus
            />
          </div>


          <div style={{ marginBottom: 16 }}>
            <label
              className="text-zinc-700 dark:text-zinc-300"
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 6,
                letterSpacing: "0.01em",
              }}
            >
              Company Name <span style={{ color: "#E53E3E" }}>*</span>
            </label>
            <input
              className="ws-input w-full px-3 py-2.5 text-sm text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-all"
              type="text"
              name="companyname"
              value={formData.companyname}
              onChange={handleChange}
              placeholder="e.g. Acme Engineering"
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <label
              className="text-zinc-700 dark:text-zinc-300"
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 6,
                letterSpacing: "0.01em",
              }}
            >
              Description
              <span className="text-zinc-400 dark:text-zinc-500" style={{ fontWeight: 400, marginLeft: 4 }}>(optional)</span>
            </label>
            <div style={{ position: "relative" }}>
              <FileText
                size={14}
                style={{
                  position: "absolute",
                  top: 13,
                  left: 11,
                  color: "#9A9890",
                  pointerEvents: "none",
                }}
              />
              <textarea
                className="ws-input w-full px-3 py-2.5 pl-9 text-sm text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-all"
                name="describtion"
                value={formData.describtion}
                onChange={handleChange}
                placeholder="What is this workspace for?"
                rows={3}
                style={{ resize: "none" }}
              />
            </div>
          </div>

          {/* Visibility toggle */}
          <div style={{ marginBottom: 24 }}>
            <label
              className="text-zinc-700 dark:text-zinc-300"
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
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
                    className={`vis-option p-2.5 rounded-lg border flex items-start gap-2 transition-all duration-150 ${
                      selected
                        ? "border-black dark:border-white bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-600 dark:text-zinc-300"
                    }`}
                    onClick={() => setFormData({ ...formData, visibility: opt.value })}
                  >
                    <span
                      className={selected ? "text-black dark:text-white" : "text-zinc-400 dark:text-zinc-500"}
                      style={{ marginTop: 1, flexShrink: 0 }}
                    >
                      {opt.icon}
                    </span>
                    <div>
                      <p
                        className={`text-xs font-semibold ${selected ? "text-black dark:text-white" : "text-zinc-900 dark:text-zinc-100"}`}
                        style={{ lineHeight: 1.3 }}
                      >
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-550 mt-0.5">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white dark:text-black bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg shadow-sm disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
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
