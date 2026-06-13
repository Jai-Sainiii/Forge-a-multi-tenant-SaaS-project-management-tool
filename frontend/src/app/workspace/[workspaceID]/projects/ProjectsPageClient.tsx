"use client";

import { useState, useCallback } from "react";
import { FolderArchive, Plus, Calendar, CheckSquare, LayoutGrid, ArrowRight, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getProjects, createProject } from "@/app/actions/project";

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

  let badgeColor = { bg: "rgba(0, 0, 0, 0.05)", text: "var(--primary)", border: "var(--secondary-light)" }; // default monochrome
  if (isReview) badgeColor = { bg: "rgba(217, 119, 6, 0.1)", text: "#D97706", border: "rgba(217, 119, 6, 0.2)" }; // amber
  else if (isSuspended) badgeColor = { bg: "rgba(220, 38, 38, 0.1)", text: "#DC2626", border: "rgba(220, 38, 38, 0.2)" }; // red
  else if (isPlanning) badgeColor = { bg: "rgba(9, 132, 227, 0.1)", text: "#0984E3", border: "rgba(9, 132, 227, 0.2)" }; // blue
  else if (active) badgeColor = { bg: "rgba(22, 163, 74, 0.1)", text: "#16A34A", border: "rgba(22, 163, 74, 0.2)" }; // green

  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter((t: any) => t.status?.toLowerCase() === 'completed' || t.status?.toLowerCase() === 'done').length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const gradientList = [
    "linear-gradient(135deg, rgba(0, 0, 0, 0.01) 0%, rgba(120, 120, 120, 0.02) 100%)",
    "linear-gradient(135deg, rgba(120, 120, 120, 0.01) 0%, rgba(60, 60, 60, 0.02) 100%)",
    "linear-gradient(135deg, rgba(60, 60, 60, 0.01) 0%, rgba(0, 0, 0, 0.02) 100%)",
  ];
  const cardGradient = gradientList[index % gradientList.length];

  return (
    <Link href={`/workspace/${workspaceID}/projects/${project.id}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="bg-white dark:bg-zinc-900 border transition-all duration-300 relative overflow-hidden"
        style={{
          borderColor: hovered ? "var(--primary)" : "var(--secondary-light)",
          borderRadius: 16,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxShadow: hovered ? "0 15px 30px rgba(0, 0, 0, 0.05)" : "0 1px 3px rgba(0,0,0,0.01)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
        }}
      >
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
              color: hovered ? "var(--primary)" : "var(--primary-light)",
              marginBottom: 6,
              transition: "color 0.2s",
              lineHeight: 1.3,
            }}
          >
            {project.name}
          </h3>
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 display-inline-block px-2 py-0.5 rounded-md mb-2">
            {project.field}
          </p>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed max-w-full">
            {project.description}
          </p>
        </div>

        <div style={{ marginTop: 8 }}>
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <CheckSquare size={12} />
              Progress ({completedTasks}/{totalTasks})
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-850 h-1.5 rounded-full overflow-hidden">
            <div
              style={{
                background: progressPercent === 100 ? "#16A34A" : "var(--primary)",
                height: "100%",
                width: `${progressPercent}%`,
                borderRadius: 999,
                transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
        </div>

        {hovered && (
          <div style={{ display: "flex", alignItems: "center", justifySelf: "flex-end", gap: 4, fontSize: 12, fontWeight: 700, color: "var(--primary)", alignSelf: "flex-end", marginTop: 4 }} className="animate-in fade-in slide-in-from-left-2 duration-200">
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
    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col gap-4 animate-pulse">
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
      const result = await createProject({
        name,
        field,
        description,
        status,
        workspaceId: Number(workspaceID)
      });
      if (result.success) {
        onSuccess();
        onClose();
        setName("");
        setField("");
        setDescription("");
        setStatus("active");
      } else {
        setError(result.message || "Failed to create project");
      }
    } catch {
      setError("Failed to create project");
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
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-[440px] shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
      >
        <div style={{ padding: "20px 24px 18px", borderBottom: "1px solid var(--secondary-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">New Workspace Project</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9A9890" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px 28px" }} className="space-y-4">
          {error && (
            <div style={{ background: "#FFF5F5", border: "1px solid #FED7D7", color: "#C53030", padding: 12, borderRadius: 10, fontSize: 13 }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Project Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
              placeholder="e.g. Mobile Application App"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Field / Category</label>
            <input
              type="text"
              required
              value={field}
              onChange={e => setField(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
              placeholder="e.g. Engineering, Marketing"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Initial Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all cursor-pointer"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="review">Review</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-750 dark:text-zinc-300 mb-1.5">Description</label>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all resize-none"
              placeholder="Describe the scope and deliverables..."
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-250 dark:border-zinc-800 rounded-lg text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ProjectsPageClientProps {
  workspaceID: string;
  initialProjects: Project[];
  isAdmin: boolean;
}

export default function ProjectsPageClient({
  workspaceID,
  initialProjects,
  isAdmin,
}: ProjectsPageClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProjects(workspaceID);
      if (res.success) {
        setProjects(res.projects || []);
      } else {
        setError("Failed to load projects. Please try again.");
      }
    } catch {
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [workspaceID]);

  const activeProjects = (projects || []).filter(p => p.status?.toLowerCase() === 'active' || p.status?.toLowerCase() === 'completed');
  const reviewProjects = (projects || []).filter(p => p.status?.toLowerCase() === 'review');
  const suspendedProjects = (projects || []).filter(p => p.status?.toLowerCase() === 'suspended');
  const planningProjects = (projects || []).filter(p => p.status?.toLowerCase() === 'planning');

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
            <LayoutGrid className="w-7 h-7 text-black dark:text-white" />
            Workspace Projects
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 font-medium">
            Monitor state, velocity, and task completion of all workspace projects
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-97"
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
          <AlertCircle className="w-5 h-5 text-red-500" />
          {error}
          <button onClick={fetchProjects} className="ml-auto px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <ProjectSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 && !error ? (
        <div className="py-16 px-6 text-center bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <FolderArchive className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No active projects</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Create a high-velocity project and assign task lists to get your team building.</p>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-sm font-semibold rounded-lg shadow-sm cursor-pointer"
            >
              Get Started
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {activeProjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 tracking-wide uppercase text-xs">
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

          {planningProjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 tracking-wide uppercase text-xs">
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

          {reviewProjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 tracking-wide uppercase text-xs">
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

          {suspendedProjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 tracking-wide uppercase text-xs">
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
