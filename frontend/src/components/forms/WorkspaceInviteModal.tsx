"use client";

import { useState } from "react";
import { X, UserPlus, AlertCircle, Copy, Check, Loader2, Link as LinkIcon, CheckCircle2, Shield, Users, Eye } from "lucide-react";
import { generateInvite } from "@/app/actions/member";

interface WorkspaceInviteModalProps {
  onClose: () => void;
  workspaceID: number | string;
}

export default function WorkspaceInviteModal({ onClose, workspaceID }: WorkspaceInviteModalProps) {
  const [inviteRole, setInviteRole] = useState("member");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const handleGenerateInvite = async () => {
    setGeneratingLink(true);
    setInviteError(null);
    setGeneratedLink(null);
    try {
      const result = await generateInvite(String(workspaceID), inviteRole);
      if (result.success && result.inviteUrl) {
        setGeneratedLink(result.inviteUrl);
      } else {
        setInviteError(result.message || "Failed to generate invite link.");
      }
    } catch {
      setInviteError("Failed to generate invite link.");
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

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
        background: "rgba(10, 10, 11, 0.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .invite-modal-card {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      <div
        className="invite-modal-card bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/60 dark:border-zinc-800 rounded-[20px] w-full max-w-[440px] mx-4 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div
          className="border-b border-black/5 dark:border-white/5"
          style={{
            padding: "24px 28px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "linear-gradient(135deg, #18181B 0%, #3F3F46 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              <UserPlus size={18} color="#fff" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[#1A1918] dark:text-white" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>
                Invite to Workspace
              </p>
              <p className="text-[#7A7870] dark:text-zinc-400" style={{ fontSize: 12, marginTop: 2 }}>
                Only visible and usable by Workspace Owners
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-800 text-[#4A4845] dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-zinc-700 hover:border-black/20 dark:hover:border-white/20"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <X size={15} strokeWidth={2} className="currentColor" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "28px" }}>
          {!generatedLink ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <label
                  className="text-zinc-800 dark:text-zinc-200"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  Select Member Role
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {[
                    { role: "member", label: "Member", icon: Users },
                    { role: "admin", label: "Admin", icon: Shield },
                    { role: "viewer", label: "Viewer", icon: Eye },
                  ].map((item) => {
                    const isSelected = inviteRole === item.role;
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.role}
                        onClick={() => setInviteRole(item.role)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "border-black dark:border-white bg-black/5 dark:bg-white/5 text-black dark:text-white font-bold"
                            : "border-black/10 dark:border-white/10 bg-white/60 dark:bg-zinc-800/60 text-zinc-650 dark:text-zinc-350 hover:bg-black/5 dark:hover:bg-zinc-700/60"
                        }`}
                      >
                        <IconComp size={16} strokeWidth={isSelected ? 2.5 : 1.8} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                <div
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-600 dark:text-zinc-300"
                  style={{
                    borderRadius: 10,
                    padding: "10px 12px",
                    marginTop: 12,
                    fontSize: 11,
                    lineHeight: 1.4,
                  }}
                >
                  {inviteRole === "admin" && "💡 Admins can add/remove members, create projects, and edit all workspace contents."}
                  {inviteRole === "member" && "💡 Members can view projects, join teams, and create or update tasks."}
                  {inviteRole === "viewer" && "💡 Viewers have read-only access and cannot modify tasks or add new elements."}
                </div>
              </div>

              {inviteError && (
                <div
                  style={{
                    background: "#FFF5F5",
                    border: "1px solid #FED7D7",
                    borderRadius: 10,
                    padding: "12px",
                    fontSize: 13,
                    color: "#C53030",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  {inviteError}
                </div>
              )}

              <button
                onClick={handleGenerateInvite}
                disabled={generatingLink}
                style={{
                  width: "100%",
                  background: generatingLink ? "#71717A" : "linear-gradient(135deg, #18181B 0%, #000000 100%)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "12px",
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                  cursor: generatingLink ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!generatingLink) e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  if (!generatingLink) e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {generatingLink ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating Link...
                  </>
                ) : (
                  <>
                    <LinkIcon size={15} />
                    Generate Invite Link
                  </>
                )}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="animate-in fade-in zoom-in-95 duration-200">
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: 12,
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>
                    Invite link is ready!
                  </p>
                  <p style={{ fontSize: 11, color: "#047857", marginTop: 1 }}>
                    Valid for 24 hours. Marks as used once someone joins.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label className="text-zinc-550 dark:text-zinc-400" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Copy & Share Link
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <div
                    className="bg-white/60 dark:bg-zinc-800/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100"
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      padding: "10px 12px",
                      fontSize: 13,
                      fontFamily: "monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {generatedLink}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      width: 42,
                      height: 40,
                      borderRadius: 10,
                      border: "none",
                      background: copySuccess ? "#10B981" : "#18181B",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: copySuccess ? "0 4px 12px rgba(16, 185, 129, 0.25)" : "0 4px 12px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    {copySuccess ? <Check size={18} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setGeneratedLink(null)}
                className="text-black dark:text-white border border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5"
                style={{
                  width: "100%",
                  fontWeight: 600,
                  fontSize: 13,
                  padding: "10px",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginTop: 8,
                }}
              >
                Create Another Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
