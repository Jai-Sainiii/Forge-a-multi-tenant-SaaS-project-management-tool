"use client";
import { use, useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Edit,
  FolderKanban,
  ListTodo,
  Tag,
  ArrowUp,
  ArrowDown,
  Minus,
  Users,
  Calendar,
  Briefcase,
  Send,
  ExternalLink,
  X,
  RotateCcw,
  Play,
  Loader2,
  Eye,
  Pause,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/authContext/AuthContext";

const TASK_STATUSES = [
  { value: "active", label: "Active", icon: Play, color: "text-blue-500" },
  {
    value: "in progress",
    label: "In Progress",
    icon: Loader2,
    color: "text-indigo-500",
  },
  { value: "review", label: "Review", icon: Eye, color: "text-yellow-500" },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  { value: "redo", label: "Redo", icon: RotateCcw, color: "text-orange-500" },
  {
    value: "suspended",
    label: "Suspended",
    icon: Pause,
    color: "text-gray-500",
  },
];

interface TaskMember {
  role: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  submittionType?: string;
  submittedTextorLink?: string;
  project?: { name: string };
  workspace?: { title: string };
  taskMembers?: TaskMember[];
}

export default function TaskDetailsPage({
  params,
}: {
  params: Promise<{ workspaceID: string; taskID: string }>;
}) {
  const { workspaceID, taskID } = use(params);
  const authContext = useAuth();
  const currentUser = authContext ? authContext.user : null;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isTaskAdmin = task?.taskMembers?.some(
    (m) => m.user?.email === currentUser?.email && m.role?.toLowerCase() === "admin"
  ) || false;

  // Submission State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionType, setSubmissionType] = useState("link");
  const [submittedContent, setSubmittedContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [workspaceMembers, setWorkspaceMembers] = useState<any[]>([]);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);

  const fetchTaskDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/task/${taskID}`,
        { withCredentials: true },
      );
      if (res.data.success || res.data.sucess === "true") {
        setTask(res.data.task);
      } else {
        setError(res.data.message || "Failed to load task details.");
      }
    } catch (err) {
      setError("An error occurred while fetching task details.");
    } finally {
      setLoading(false);
    }
  }, [taskID]);

  const fetchWorkspaceMembers = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/members/${workspaceID}`,
        { withCredentials: true },
      );
      if (res.data.success) {
        setWorkspaceMembers(res.data.members || []);
      }
    } catch (err) {
      console.error("Failed to load workspace members", err);
    }
  }, [workspaceID]);

  const handleSubmitTask = async () => {
    if (!submittedContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/submit/${taskID}`,
        {
          submittionType: submissionType,
          submittedTextorLink: submittedContent,
        },
        { withCredentials: true },
      );

      if (res.data.success || res.data.sucess === "true") {
        setIsSubmitModalOpen(false);
        fetchTaskDetails();
      }
    } catch (error) {
      console.error("Failed to submit task", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
    fetchWorkspaceMembers();
  }, [fetchTaskDetails, fetchWorkspaceMembers]);

  useEffect(() => {
    if (task && task.projectId) {
      const fetchProjectMembers = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/project/singleProject/${task.projectId}`,
            { withCredentials: true }
          );
          if (res.data.success || res.data.sucess === "true") {
            setProjectMembers(res.data.project.projectMembers || []);
          }
        } catch (err) {
          console.error("Failed to fetch project members:", err);
        }
      };
      fetchProjectMembers();
    }
  }, [task]);

  const getPriorityIcon = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return <ArrowUp className="w-4 h-4 text-red-500" />;
      case "low":
        return <ArrowDown className="w-4 h-4 text-blue-500" />;
      case "medium":
      default:
        return <Minus className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 border border-green-200 dark:border-green-800/50";
      case "in progress":
      case "active":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-500 border border-blue-200 dark:border-blue-800/50";
      case "review":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-800/50";
      case "todo":
      case "redo":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-500 border border-orange-200 dark:border-orange-800/50";
      case "suspended":
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
    }
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-6 space-y-8 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
      </main>
    );
  }

  if (error || !task) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-6 space-y-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-5 h-5" />
          {error || "Task not found"}
          <button
            onClick={fetchTaskDetails}
            className="ml-auto px-3 py-1 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-6 space-y-8">
      {/* Header & Breadcrumb */}
      <div>
        <Link
          href={`/workspace/${workspaceID}/tasks`}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Tasks
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary-light/10 text-primary-light rounded-lg border border-primary-light/20">
                <ListTodo className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white">
                {task.title}
              </h1>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(task.status)}`}
              >
                {task.status?.toLowerCase() === "completed" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                ) : (
                  <Circle className="w-3.5 h-3.5 mr-1.5 fill-current opacity-50" />
                )}
                {task.status || "Todo"}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                {getPriorityIcon(task.priority)}
                {task.priority || "Medium"} Priority
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {task.status?.toLowerCase() !== "completed" &&
              task.status?.toLowerCase() !== "review" && (
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="flex items-center gap-2 bg-[#3C3489] hover:bg-[#251b72] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Submit for Review
                </button>
              )}
            {isTaskAdmin && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm cursor-pointer"
              >
                <Edit className="w-4 h-4" />
                Edit Task
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-outline-variant dark:border-gray-700 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Description
            </h2>
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
              {task.description || "No description provided."}
            </div>
          </div>

          {/* Submission Details (If submitted) */}
          {task.submittedTextorLink && (
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-outline-variant dark:border-gray-700 shadow-sm">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Submission Details
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-700/50">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Type: {task.submittionType || "Unknown"}
                </p>
                {task.submittionType === "link" ? (
                  <a
                    href={
                      task.submittedTextorLink.startsWith("http")
                        ? task.submittedTextorLink
                        : `https://${task.submittedTextorLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#3C3489] hover:underline flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {task.submittedTextorLink}
                  </a>
                ) : (
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {task.submittedTextorLink}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Details */}
        <div className="space-y-6">
          {/* Task Metadata */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-outline-variant dark:border-gray-700 shadow-sm space-y-6">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Project
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {task.project?.name || "No Project"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                Workspace
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {task.workspace?.title || "Unknown Workspace"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created At
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unknown"}
              </p>
            </div>
          </div>


          {/* Task Members */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-outline-variant dark:border-gray-700 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Assignees
            </h2>

            {task.taskMembers && task.taskMembers.length > 0 ? (
              <div className="space-y-3">
                {task.taskMembers.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-light to-[#3C3489] text-white flex items-center justify-center text-xs font-medium shrink-0">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {member.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No assignees for this task.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {isSubmitModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSubmitModalOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(10, 10, 11, 0.65)", // beautiful premium translucent overlay
            animation: "fadeIn 0.15s ease",
          }}
          className="px-4"
        >
          <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to   { opacity: 1; }
                        }
                        @keyframes slideUp {
                            from { opacity: 0; transform: translateY(12px) scale(0.99); }
                            to   { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        .submit-modal-card {
                            animation: slideUp 0.18s cubic-bezier(0.215, 0.610, 0.355, 1);
                            will-change: transform, opacity;
                        }
                    `}</style>
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700 submit-modal-card">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
              Submit for Review
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Submission Type
                </label>
                <select
                  value={submissionType}
                  onChange={(e) => setSubmissionType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489]"
                >
                  <option value="link">Link</option>
                  <option value="text">Text</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {submissionType === "link"
                    ? "Submission Link"
                    : "Submission Text"}
                </label>
                {submissionType === "link" ? (
                  <input
                    type="url"
                    value={submittedContent}
                    onChange={(e) => setSubmittedContent(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489]"
                  />
                ) : (
                  <textarea
                    value={submittedContent}
                    onChange={(e) => setSubmittedContent(e.target.value)}
                    placeholder="Enter your submission details..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] resize-none"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTask}
                disabled={submitting || !submittedContent.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#3C3489] hover:bg-[#251b72] rounded-md transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && task && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={task}
          projectMembers={projectMembers}
          onSuccess={(updatedTask) => setTask(updatedTask)}
        />
      )}
    </main>
  );
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  projectMembers: any[];
  onSuccess: (updatedTask: any) => void;
}

function EditTaskModal({
  isOpen,
  onClose,
  task,
  projectMembers,
  onSuccess,
}: EditTaskModalProps) {
  const [editTitle, setEditTitle] = useState(task.title || "");
  const [editDescription, setEditDescription] = useState(
    task.description || "",
  );
  const [editStatus, setEditStatus] = useState(task.status || "");
  const [editPriority, setEditPriority] = useState(task.priority || "");
  const [editAssigneeIds, setEditAssigneeIds] = useState<number[]>(
    task.taskMembers ? task.taskMembers.map((m: any) => m.userId || m.user?.id) : [],
  );
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleUpdateTask = async () => {
    if (!editTitle.trim()) return;
    setSaving(true);
    setEditError(null);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/update/${task.id}`,
        {
          title: editTitle,
          description: editDescription,
          status: editStatus,
          priority: editPriority,
          assigneeIds: editAssigneeIds,
        },
        { withCredentials: true },
      );
      if (res.data.success) {
        onSuccess(res.data.task);
        onClose();
      } else {
        setEditError(res.data.message || "Failed to update task.");
      }
    } catch (err: any) {
      setEditError(err?.response?.data?.message || "Failed to update task.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

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
        background: "rgba(10, 10, 11, 0.65)", // beautiful premium translucent overlay
        animation: "fadeIn 0.15s ease",
      }}
      className="px-4"
    >
      <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(12px) scale(0.99); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .edit-modal-card {
                    animation: slideUp 0.18s cubic-bezier(0.215, 0.610, 0.355, 1);
                    will-change: transform, opacity;
                }
            `}</style>
      <div className="bg-white dark:bg-[#1e293b] rounded-lg w-full max-w-lg shadow-xl border border-gray-200 dark:border-gray-700 edit-modal-card">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#3C3489]" />
            Edit Task
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {editError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {editError}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] resize-none text-sm"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TASK_STATUSES.map((s) => {
                const Icon = s.icon;
                const isSelected = editStatus?.toLowerCase() === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setEditStatus(s.value)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#3C3489] text-white shadow-sm"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${isSelected ? "text-white" : s.color}`}
                    />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <div className="flex gap-2">
              {[
                {
                  value: "low",
                  label: "Low",
                  icon: ArrowDown,
                  color: "text-blue-500",
                },
                {
                  value: "medium",
                  label: "Medium",
                  icon: Minus,
                  color: "text-gray-500",
                },
                {
                  value: "high",
                  label: "High",
                  icon: ArrowUp,
                  color: "text-red-500",
                },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = editPriority?.toLowerCase() === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setEditPriority(p.value)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#3C3489] text-white shadow-sm"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${isSelected ? "text-white" : p.color}`}
                    />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assign Members
            </label>
            {projectMembers.length > 0 ? (
              <div className="max-h-[140px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800/50 space-y-2">
                {projectMembers.map((member) => {
                  const isChecked = editAssigneeIds.includes(member.userId);
                  return (
                    <label
                      key={member.id}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setEditAssigneeIds(
                              editAssigneeIds.filter(
                                (id) => id !== member.userId,
                              ),
                            );
                          } else {
                            setEditAssigneeIds([
                              ...editAssigneeIds,
                              member.userId,
                            ]);
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#3C3489] focus:ring-[#3C3489] accent-[#3C3489] cursor-pointer"
                      />
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-light to-[#3C3489] text-white flex items-center justify-center text-[10px] font-medium shrink-0">
                        {member.user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-xs">
                        {member.user.name}
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        ({member.user.email})
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No members available in this project.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateTask}
            disabled={saving || !editTitle.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-[#3C3489] hover:bg-[#251b72] rounded-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
