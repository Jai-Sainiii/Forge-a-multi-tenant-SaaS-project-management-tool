"use client";

import { useState } from "react";
import { X, UserPlus, AlertCircle, Copy, Check, Loader2, Link as LinkIcon, CheckCircle2, Shield, Users, Eye } from "lucide-react";
import axios from "axios";

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
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/invite/generate/${workspaceID}`,
        { role: inviteRole },
        { withCredentials: true }
      );
      if (res.data.success) {
        setGeneratedLink(res.data.inviteUrl);
      } else {
        setInviteError(res.data.message || "Failed to generate invite link.");
      }
    } catch (err: any) {
      setInviteError(err.response?.data?.message || "Failed to generate invite link.");
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
        className="invite-modal-card"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          borderRadius: 20,
          width: "100%",
          maxWidth: 440,
          margin: "0 16px",
          boxShadow: "0 30px 70px rgba(10, 10, 11, 0.15), 0 10px 30px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 20px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
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
                background: "linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(108, 92, 231, 0.25)",
              }}
            >
              <UserPlus size={18} color="#fff" strokeWidth={2.2} />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1918", lineHeight: 1.2 }}>
                Invite to Workspace
              </p>
              <p style={{ fontSize: 12, color: "#7A7870", marginTop: 2 }}>
                Only visible and usable by Workspace Owners
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid rgba(0, 0, 0, 0.08)",
              background: "rgba(255, 255, 255, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)";
              e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.08)";
            }}
          >
            <X size={15} color="#4A4845" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "28px" }}>
          {!generatedLink ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#2C2A29",
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
                        style={{
                          padding: "12px 10px",
                          borderRadius: 12,
                          border: isSelected
                            ? "2px solid #6C5CE7"
                            : "1.5px solid rgba(0, 0, 0, 0.08)",
                          background: isSelected
                            ? "rgba(108, 92, 231, 0.08)"
                            : "rgba(255, 255, 255, 0.6)",
                          color: isSelected ? "#5a4ed1" : "#4A4845",
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: 13,
                          cursor: "pointer",
                          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 6,
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = "rgba(0, 0, 0, 0.02)";
                            e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.15)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)";
                            e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.08)";
                          }
                        }}
                      >
                        <IconComp size={16} strokeWidth={isSelected ? 2.5 : 1.8} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.03)",
                    border: "1px solid rgba(0, 0, 0, 0.04)",
                    borderRadius: 10,
                    padding: "10px 12px",
                    marginTop: 12,
                    fontSize: 11,
                    color: "#6B6860",
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
                  background: generatingLink ? "#a29bfe" : "linear-gradient(135deg, #6C5CE7 0%, #5a4ed1 100%)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "12px",
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 6px 20px rgba(108, 92, 231, 0.3)",
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
                <label style={{ fontSize: 11, fontWeight: 600, color: "#7A7870", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Copy & Share Link
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <div
                    style={{
                      flex: 1,
                      background: "rgba(255, 255, 255, 0.6)",
                      border: "1.5px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: 10,
                      padding: "10px 12px",
                      fontSize: 13,
                      color: "#4A4845",
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
                      background: copySuccess ? "#10B981" : "#6C5CE7",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: copySuccess ? "0 4px 12px rgba(16, 185, 129, 0.25)" : "0 4px 12px rgba(108, 92, 231, 0.25)",
                    }}
                  >
                    {copySuccess ? <Check size={18} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setGeneratedLink(null)}
                style={{
                  width: "100%",
                  background: "transparent",
                  color: "#6C5CE7",
                  border: "1.5px solid #6C5CE7",
                  fontWeight: 600,
                  fontSize: 13,
                  padding: "10px",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginTop: 8,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(108, 92, 231, 0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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
