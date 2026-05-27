/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { use, useState, useEffect, useCallback } from "react";
import { FolderArchive, ChevronRight, AlertCircle, Plus, Calendar, CheckSquare, Sparkles, LayoutGrid, Clock, ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/authContext/AuthContext";

interface Project {
  id: number;
  name: string;
  field: string;
  description: string;
  status: string;
  workspaceId: number;
  tasks?: any[];
  createdAt?: string;
}

function ProjectCard({ project, workspaceID, index }: { project: Project, workspaceID: string, index: number }) {
  const [hovered, setHovered] = useState(false);
  const isReview = project.status?.toLowerCase() === 'review';
  const isSuspended = project.status?.toLowerCase() === 'suspended';
  const isPlanning = project.status?.toLowerCase() === 'planning';
  const active = project.status?.toLowerCase() === 'active' || project.status?.toLowerCase() === 'completed';

  let badgeColor = { bg: "rgba(108, 92, 231, 0.1)", text: "#6C5CE7", border: "rgba(108, 92, 231, 0.2)" }; // default purple
  if (isReview) badgeColor = { bg: "rgba(217, 119, 6, 0.1)", text: "#D97706", border: "rgba(217, 119, 6, 0.2)" }; // amber
  else if (isSuspended) badgeColor = { bg: "rgba(220, 38, 38, 0.1)", text: "#DC2626", border: "rgba(220, 38, 38, 0.2)" }; // red
  else if (isPlanning) badgeColor = { bg: "rgba(9, 132, 227, 0.1)", text: "#0984E3", border: "rgba(9, 132, 227, 0.2)" }; // blue
  else if (active) badgeColor = { bg: "rgba(22, 163, 74, 0.1)", text: "#16A34A", border: "rgba(22, 163, 74, 0.2)" }; // green

  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter((t: any) => t.status?.toLowerCase() === 'completed' || t.status?.toLowerCase() === 'done').length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const gradientList = [
    "linear-gradient(135deg, rgba(108, 92, 231, 0.03) 0%, rgba(162, 155, 254, 0.05) 100%)",
    "linear-gradient(135deg, rgba(0, 184, 148, 0.03) 0%, rgba(85, 239, 196, 0.05) 100%)",
    "linear-gradient(135deg, rgba(225, 112, 85, 0.03) 0%, rgba(250, 177, 160, 0.05) 100%)",
  ];
  const cardGradient = gradientList[index % gradientList.length];

  return (
    <Link href={`/workspace/${workspaceID}/projects/${project.id}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: hovered ? "1.5px solid #6C5CE7" : "1.5px solid #E8E6E0",
          borderRadius: 16,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxShadow: hovered ? "0 15px 30px rgba(108, 92, 231, 0.08)" : "0 1px 3px rgba(0,0,0,0.02)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative background shape */}
        <div style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          background: cardGradient,
          borderRadius: "50%",
          filter: "blur(10px)",
          opacity: 0.8,
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              padding: "4px 10px",
              background: badgeColor.bg,
              color: badgeColor.text,
              border: `1px solid ${badgeColor.border}`,
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {project.status || 'Active'}
          </span>
          <span style={{ fontSize: 11, color: "#9A9890", display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={12} />
            {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Just now"}
          </span>
        </div>

        <div>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: hovered ? "#6C5CE7" : "#1A1918",
              marginBottom: 6,
              transition: "color 0.2s",
              lineHeight: 1.3,
            }}
          >
            {project.name}
          </h3>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#6B6860", marginBottom: 8, background: "rgba(0,0,0,0.02)", display: "inline-block", padding: "2px 8px", borderRadius: 6 }}>
            {project.field}
          </p>
          <p style={{ fontSize: 13, color: "#9A9890", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {project.description}
          </p>
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 650, color: "#7A7870", marginBottom: 6 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <CheckSquare size={12} />
              Progress ({completedTasks}/{totalTasks})
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div style={{ width: "100%", background: "#F0EEE8", height: 6, borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                background: progressPercent === 100 ? "#16A34A" : "#6C5CE7",
                height: "100%",
                width: `${progressPercent}%`,
                borderRadius: 999,
                transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
        </div>

        {hovered && (
          <div style={{ display: "flex", alignItems: "center", justifySelf: "flex-end", gap: 4, fontSize: 12, fontWeight: 700, color: "#6C5CE7", alignSelf: "flex-end", marginTop: 4 }} className="animate-in fade-in slide-in-from-left-2 duration-200">
            View Details
            <ArrowRight size={13} strokeWidth={2.5} />
          </div>
        )}
      </div>
    </Link>
  );
}

function ProjectSkeleton() {
  return (
    <div style={{ padding: "24px", background: "#FFFFFF", border: "1px solid #E8E6E0", borderRadius: 16, display: "flex", flexDirection: "column", gap: 16, animation: "pulse 1.5s infinite" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: 60, height: 16, background: "#F0EEE8", borderRadius: 6 }} />
        <div style={{ width: 80, height: 16, background: "#F0EEE8", borderRadius: 6 }} />
      </div>
      <div>
        <div style={{ width: "80%", height: 18, background: "#F0EEE8", borderRadius: 6, marginBottom: 8 }} />
        <div style={{ width: "40%", height: 14, background: "#F0EEE8", borderRadius: 6, marginBottom: 12 }} />
        <div style={{ width: "100%", height: 14, background: "#F0EEE8", borderRadius: 6 }} />
      </div>
      <div style={{ width: "100%", height: 6, background: "#F0EEE8", borderRadius: 999 }} />
    </div>
  );
}

function CreateProjectModal({
  isOpen,
  onClose,
  workspaceID,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  workspaceID: string;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [field, setField] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/project/createProject`, {
        name,
        field,
        description,
        status,
        workspaceId: Number(workspaceID)
      }, { withCredentials: true });
      onSuccess();
      onClose();
      setName("");
      setField("");
      setDescription("");
      setStatus("active");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
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
        padding: 16,
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          borderRadius: 20,
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 30px 70px rgba(10, 10, 11, 0.15)",
          overflow: "hidden",
          animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ padding: "24px 28px 18px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1918" }}>New Workspace Project</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9A9890" }}>
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px 28px" }} className="space-y-4">
          {error && (
            <div style={{ background: "#FFF5F5", border: "1px solid #FED7D7", color: "#C53030", padding: 12, borderRadius: 10, fontSize: 13 }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4A4845", marginBottom: 6 }}>Project Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E8E6E0", borderRadius: 8, background: "#FAFAF8", fontSize: 13, outline: "none" }}
              placeholder="e.g. Mobile Application App"
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4A4845", marginBottom: 6 }}>Field / Category</label>
            <input
              type="text"
              required
              value={field}
              onChange={e => setField(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E8E6E0", borderRadius: 8, background: "#FAFAF8", fontSize: 13, outline: "none" }}
              placeholder="e.g. Engineering, Marketing"
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4A4845", marginBottom: 6 }}>Initial Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E8E6E0", borderRadius: 8, background: "#FAFAF8", fontSize: 13, outline: "none", cursor: "pointer" }}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="review">Review</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4A4845", marginBottom: 6 }}>Description</label>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E8E6E0", borderRadius: 8, background: "#FAFAF8", fontSize: 13, outline: "none", resize: "none" }}
              placeholder="Describe the scope and deliverables..."
            />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 16 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "10px 16px", background: "transparent", border: "1.5px solid #E8E6E0", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#4A4845" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "10px 20px", background: "#6C5CE7", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

export default function ProjectsPage({ params }: { params: Promise<{ workspaceID: string }> }) {
  const { workspaceID } = use(params);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const authContext = useAuth();
  const user = authContext ? authContext.user : null;

  const checkWorkspaceAdmin = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/members/${workspaceID}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const membersList = res.data.members;
        const currentMember = membersList.find((m: any) => m.user?.email === user.email);
        if (currentMember) {
          const isWorkspaceAdmin = ["admin", "owner"].includes(currentMember.role?.toLowerCase());
          setIsAdmin(isWorkspaceAdmin);
        }
      }
    } catch (err) {
      console.error("Error checking workspace admin role:", err);
    }
  }, [workspaceID, user]);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/project/getProjects/${workspaceID}`, {
        withCredentials: true,
      });
      setProjects(res.data.projects || []);
    } catch (err) {
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [workspaceID]);

  useEffect(() => {
    fetchProjects();
    checkWorkspaceAdmin();
  }, [fetchProjects, checkWorkspaceAdmin]);

  const activeProjects = (projects || []).filter(p => p.status?.toLowerCase() === 'active' || p.status?.toLowerCase() === 'completed');
  const reviewProjects = (projects || []).filter(p => p.status?.toLowerCase() === 'review');
  const suspendedProjects = (projects || []).filter(p => p.status?.toLowerCase() === 'suspended');
  const planningProjects = (projects || []).filter(p => p.status?.toLowerCase() === 'planning');

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
            <LayoutGrid className="w-7 h-7 text-[#6C5CE7]" />
            Workspace Projects
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 font-medium">
            Monitor state, velocity, and task completion of all workspace projects
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#6C5CE7] hover:bg-[#5a4ed1] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:shadow-primary/15 cursor-pointer active:scale-97"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            New Project
          </button>
        )}
      </div>

      <CreateProjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        workspaceID={workspaceID}
        onSuccess={fetchProjects}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-sm shadow-sm animate-pulse">
          <AlertCircle className="w-5 h-5" />
          {error}
          <button onClick={fetchProjects} className="ml-auto px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium">
            Retry
          </button>
        </div>
      )}

      {/* Grid displays based on categories */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <ProjectSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 && !error ? (
        <div style={{ padding: "64px 20px", textAlign: "center", background: "#FFFFFF", border: "1.5px dashed #E8E6E0", borderRadius: 20 }}>
          <FolderArchive className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No active projects</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Create a high-velocity project and assign task lists to get your team building.</p>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#6C5CE7] hover:bg-[#5a4ed1] text-white text-sm font-semibold rounded-lg shadow-sm"
            >
              Get Started
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Active section */}
          {activeProjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#1A1918] flex items-center gap-2 tracking-wide uppercase text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                Active Projects ({activeProjects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeProjects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} workspaceID={workspaceID} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Planning section */}
          {planningProjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#1A1918] flex items-center gap-2 tracking-wide uppercase text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                Planning / Backlog ({planningProjects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {planningProjects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} workspaceID={workspaceID} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Review section */}
          {reviewProjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#1A1918] flex items-center gap-2 tracking-wide uppercase text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
                In Review ({reviewProjects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviewProjects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} workspaceID={workspaceID} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Suspended section */}
          {suspendedProjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#1A1918] flex items-center gap-2 tracking-wide uppercase text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                Suspended ({suspendedProjects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suspendedProjects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} workspaceID={workspaceID} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}