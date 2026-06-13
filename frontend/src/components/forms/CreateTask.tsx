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
          border-color: #000000 !important;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
        }
        .dark .ws-input:focus, .dark .ws-select:focus {
          border-color: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
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
              <ListTodo size={15} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <p className="text-zinc-900 dark:text-zinc-100 font-semibold" style={{ fontSize: 14, lineHeight: 1.3 }}>
                Create New Task
              </p>
              <p className="text-zinc-400 dark:text-zinc-500" style={{ fontSize: 12, marginTop: 1 }}>
                Add a task to track your work
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
            }}
          >
            <X size={14} className="currentColor" strokeWidth={2} />
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
              className="text-zinc-700 dark:text-zinc-300"
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
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
                  top: 13,
                  left: 11,
                  color: "#9A9890",
                  pointerEvents: "none",
                }}
              />
              <input
                className="ws-input w-full px-3 py-2 pl-9 text-sm text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-all"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Design landing page"
                autoFocus
              />
            </div>
          </div>

          {/* Description */}
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
              Description
            </label>
            <div style={{ position: "relative" }}>
              <AlignLeft
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
                className="ws-input w-full px-3 py-2 pl-9 text-sm text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-all"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add more details about this task..."
                rows={3}
                style={{ resize: "none" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Status */}
            <div>
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
                Status
              </label>
              <div style={{ position: "relative" }}>
                <Clock
                  size={14}
                  style={{
                    position: "absolute",
                    top: 13,
                    left: 11,
                    color: "#9A9890",
                    pointerEvents: "none",
                  }}
                />
                <select
                  className="ws-select w-full px-3 py-2 pl-9 text-sm text-zinc-950 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-lg cursor-pointer"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
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
                className="text-zinc-700 dark:text-zinc-300"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
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
                    top: 13,
                    left: 11,
                    color: "#9A9890",
                    pointerEvents: "none",
                  }}
                />
                <select
                  className="ws-select w-full px-3 py-2 pl-9 text-sm text-zinc-950 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-lg cursor-pointer"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
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
                className="text-zinc-700 dark:text-zinc-300"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  marginBottom: 6,
                  letterSpacing: "0.01em",
                }}
              >
                Project <span style={{ color: "#E53E3E" }}>*</span>
              </label>
              <select
                className="ws-select w-full px-3 py-2 text-sm text-zinc-955 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-lg cursor-pointer"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                disabled={loadingProjects}
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
              className="text-zinc-700 dark:text-zinc-300"
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 8,
                letterSpacing: "0.01em",
              }}
            >
              Assign Members
            </label>
            {!formData.projectId ? (
              <p className="text-zinc-400 dark:text-zinc-500" style={{ fontSize: 12, padding: "8px 0" }}>
                ⚠️ Please select a project first to view and assign its members.
              </p>
            ) : loadingMembers ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
                <Loader2 size={13} className="animate-spin text-black dark:text-white" />
                <span className="text-zinc-400 dark:text-zinc-500" style={{ fontSize: 12 }}>Loading project members...</span>
              </div>
            ) : projectMembers.length > 0 ? (
              <div
                className="max-h-[120px] overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 bg-zinc-50 dark:bg-zinc-950/40 flex flex-col gap-2"
              >
                {projectMembers.map((member) => {
                  const isChecked = selectedAssigneeIds.includes(member.userId);
                  return (
                    <label
                      key={member.id}
                      className="text-zinc-800 dark:text-zinc-200"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
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
                          accentColor: "#000000",
                          cursor: "pointer",
                        }}
                      />
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #18181B 0%, #3F3F46 100%)",
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
                      <span className="text-zinc-400 dark:text-zinc-500" style={{ fontSize: 11 }}>({member.user?.email})</span>
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
          <div className="flex gap-2.5 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-350 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white dark:text-black bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg shadow-sm disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
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
