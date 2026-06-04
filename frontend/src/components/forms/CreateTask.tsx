"use client";

import { useState, useEffect } from "react";
import { X, FileText, Loader2, ListTodo, AlignLeft, AlertCircle, ArrowUp, CheckCircle2, Clock, Users } from "lucide-react";
import { getProjects, getSingleProject } from "@/app/actions/project";
import { createTask } from "@/app/actions/task";

interface Project {
  id: number;
  name: string;
}

interface UserInfo {
  id: number;
  name: string;
  email: string;
}

interface Member {
  id: number;
  userId: number;
  user: UserInfo;
}

interface CreateTaskModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  workspaceID: string;
  projectID?: string; 
}

export default function CreateTaskModal({ onClose, onSuccess, workspaceID, projectID }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    projectId: projectID || "",
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(!projectID);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Assignee states
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<number[]>([]);

  useEffect(() => {
    if (!projectID) {
      const fetchProjects = async () => {
        try {
          const result = await getProjects(workspaceID);
          if (result.success) {
            setProjects(result.projects);
          }
        } catch (err) {
          console.error("Failed to load projects", err);
        } finally {
          setLoadingProjects(false);
        }
      };
      fetchProjects();
    }
  }, [projectID, workspaceID]);

  useEffect(() => {
    if (!formData.projectId) {
      setProjectMembers([]);
      setSelectedAssigneeIds([]);
      return;
    }

    const fetchProjectMembers = async () => {
      setLoadingMembers(true);
      try {
        const result = await getSingleProject(formData.projectId);
        if (result.success && result.project && result.project.projectMembers) {
          setProjectMembers(result.project.projectMembers);
        } else {
          setProjectMembers([]);
        }
      } catch (err) {
        console.error("Failed to load project members", err);
        setProjectMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchProjectMembers();
  }, [formData.projectId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }
    if (!formData.projectId) {
      setError("Please select a project.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await createTask(workspaceID, {
        ...formData,
        assigneeIds: selectedAssigneeIds,
      });
      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.message || "Failed to create task.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
        .ws-input:focus, .ws-select:focus {
          outline: none;
          border-color: #6C5CE7 !important;
          box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
        }
      `}</style>

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
              <ListTodo size={15} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1918", lineHeight: 1.3 }}>
                Create New Task
              </p>
              <p style={{ fontSize: 12, color: "#9A9890", marginTop: 1 }}>
                Add a task to track your work
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
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Title */}
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
              Task Title <span style={{ color: "#E53E3E" }}>*</span>
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
              <input
                className="ws-input"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Design landing page"
                autoFocus
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
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
              />
            </div>
          </div>

          {/* Description */}
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
              Description
            </label>
            <div style={{ position: "relative" }}>
              <AlignLeft
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
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add more details about this task..."
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Status */}
            <div>
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
                Status
              </label>
              <div style={{ position: "relative" }}>
                <Clock
                  size={14}
                  style={{
                    position: "absolute",
                    top: 11,
                    left: 11,
                    color: "#9A9890",
                    pointerEvents: "none",
                  }}
                />
                <select
                  className="ws-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
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
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="todo">To Do</option>
                  <option value="in progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Priority */}
            <div>
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
                Priority
              </label>
              <div style={{ position: "relative" }}>
                <ArrowUp
                  size={14}
                  style={{
                    position: "absolute",
                    top: 11,
                    left: 11,
                    color: "#9A9890",
                    pointerEvents: "none",
                  }}
                />
                <select
                  className="ws-select"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
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
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Project Selection (only if not provided) */}
          {!projectID && (
            <div style={{ marginBottom: 24 }}>
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
                Project <span style={{ color: "#E53E3E" }}>*</span>
              </label>
              <select
                className="ws-select"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                disabled={loadingProjects}
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
                  cursor: loadingProjects ? "wait" : "pointer",
                }}
              >
                <option value="" disabled>
                  {loadingProjects ? "Loading projects..." : "Select a project"}
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Assignees Selection */}
          <div style={{ marginBottom: 20 }}>
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
              Assign Members
            </label>
            {!formData.projectId ? (
              <p style={{ fontSize: 12, color: "#9A9890", padding: "8px 0" }}>
                ⚠️ Please select a project first to view and assign its members.
              </p>
            ) : loadingMembers ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
                <Loader2 size={13} className="animate-spin text-[#6C5CE7]" />
                <span style={{ fontSize: 12, color: "#9A9890" }}>Loading project members...</span>
              </div>
            ) : projectMembers.length > 0 ? (
              <div
                style={{
                  maxHeight: 120,
                  overflowY: "auto",
                  border: "1.5px solid #E8E6E0",
                  borderRadius: 8,
                  padding: "8px 12px",
                  background: "#FAFAF8",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {projectMembers.map((member) => {
                  const isChecked = selectedAssigneeIds.includes(member.userId);
                  return (
                    <label
                      key={member.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        color: "#1A1918",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedAssigneeIds(selectedAssigneeIds.filter((id) => id !== member.userId));
                          } else {
                            setSelectedAssigneeIds([...selectedAssigneeIds, member.userId]);
                          }
                        }}
                        style={{
                          width: 15,
                          height: 15,
                          accentColor: "#6C5CE7",
                          cursor: "pointer",
                        }}
                      />
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)",
                          color: "#fff",
                          fontSize: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 600,
                        }}
                      >
                        {member.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{member.user?.name}</span>
                      <span style={{ fontSize: 11, color: "#9A9890" }}>({member.user?.email})</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: "#9A9890", padding: "8px 0" }}>
                No active members found inside this project.
              </p>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 24 }}>
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
              {loading ? "Creating…" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
