"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, FolderKanban, Plus, CheckSquare, ChevronRight, Calendar } from "lucide-react";
import CreateTaskModal from "@/components/forms/CreateTask";
import { getWorkspaceDashboard } from "@/app/actions/workspace";
import { updateTaskStatus } from "@/app/actions/task";

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  subColor: string;
}

function StatCard({ label, value, sub, subColor }: StatCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        border: hovered ? "1.5px solid #6C5CE7" : "1.5px solid #E8E6E0",
        borderRadius: 12,
        padding: "20px 24px",
        flex: "1 1 200px",
        minWidth: 200,
        boxShadow: hovered ? "0 10px 25px rgba(108, 92, 231, 0.08)" : "0 1px 3px rgba(0,0,0,0.02)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 600, color: "#9A9890", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ fontSize: 32, fontWeight: 700, color: "#1A1918", lineHeight: 1.1, marginBottom: 4 }}>
        {value}
      </p>
      <p style={{ fontSize: 12, color: subColor, fontWeight: 500 }}>{sub}</p>
    </div>
  );
}

interface ActivityRowProps {
  initials: string;
  avatarColor: string;
  action: string;
  time: string;
  onClick?: () => void;
}

function ActivityRow({ initials, avatarColor, action, time, onClick }: ActivityRowProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="flex items-center gap-3 py-3 rounded-xl px-3 -mx-3 transition-all duration-200"
      style={{
        borderBottom: "1px solid #F0EEE9",
        background: hovered ? "rgba(108, 92, 231, 0.04)" : "transparent",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: avatarColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "#fff",
          flexShrink: 0,
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        }}
      >
        {initials}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: hovered ? "#6C5CE7" : "#1A1918", transition: "color 0.2s" }}>
          {action}
        </span>
        <span style={{ fontSize: 11, color: "#9A9890", display: "flex", alignItems: "center", gap: 4 }}>
          <Calendar size={12} />
          {time}
        </span>
      </div>
      {onClick && hovered && (
        <ChevronRight size={14} className="text-[#6C5CE7] animate-in slide-in-from-left-1 duration-150" />
      )}
    </div>
  );
}

interface TaskRowProps {
  title: string;
  priority: string;
  due: string;
  done?: boolean;
  onToggle?: (e: React.MouseEvent) => void;
  onClick?: () => void;
}

const PRIORITY_STYLE: Record<string, { bg: string; color: string }> = {
  High:   { bg: "#FEF2F2", color: "#DC2626" },
  Medium: { bg: "#FFFBEB", color: "#D97706" },
  Low:    { bg: "#F0FDF4", color: "#16A34A" },
};

function TaskRow({ title, priority, due, done, onToggle, onClick }: TaskRowProps) {
  const [hovered, setHovered] = useState(false);
  const ps = PRIORITY_STYLE[priority] || PRIORITY_STYLE["Low"];
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="flex items-center gap-3 py-3 rounded-xl px-3 -mx-3 transition-all duration-200"
      style={{
        borderBottom: "1px solid #F0EEE9",
        background: hovered ? "rgba(108, 92, 231, 0.04)" : "transparent",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.(e);
        }}
        className="hover:scale-110 active:scale-90 transition-all duration-150"
        style={{
          width: 18,
          height: 18,
          borderRadius: 6,
          border: done ? "none" : "1.5px solid #D1CECC",
          background: done ? "#6C5CE7" : "transparent",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {done && (
          <svg width="10" height="8" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <span
        style={{
          flex: 1,
          fontSize: 13,
          fontWeight: 500,
          color: done ? "#9A9890" : (hovered ? "#6C5CE7" : "#1A1918"),
          textDecoration: done ? "line-through" : "none",
          transition: "color 0.2s",
        }}
      >
        {title}
      </span>

      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: 999,
          background: ps.bg,
          color: ps.color,
          marginRight: 8,
        }}
      >
        {priority}
      </span>
      <span style={{ fontSize: 11, color: "#9A9890" }}>{due}</span>
      {onClick && hovered && (
        <ChevronRight size={14} className="text-[#6C5CE7] animate-in slide-in-from-left-1 duration-150" />
      )}
    </div>
  );
}

interface DashboardClientProps {
  workspaceID: string;
  initialWorkspace: any;
  initialProjects: any[];
  initialTasks: any[];
  initialMembers: any[];
  user: any;
}

export default function DashboardClient({
  workspaceID,
  initialWorkspace,
  initialProjects,
  initialTasks,
  initialMembers,
  user,
}: DashboardClientProps) {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<any>(initialWorkspace);
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const [members, setMembers] = useState<any[]>(initialMembers);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const getSingleWorkspaceData = useCallback(async () => {
    try {
      const result = await getWorkspaceDashboard(workspaceID);
      if (result.success) {
        setWorkspace(result.workspace);
        setProjects(result.projects);
        setTasks(result.tasks);
        setMembers(result.members);
      }
    } catch (error) {
      console.error("Error fetching workspace data:", error);
    }
  }, [workspaceID]);

  const handleToggleTaskStatus = async (taskId: number, currentStatus: string) => {
    const isCompleted = currentStatus?.toLowerCase() === "done" || currentStatus?.toLowerCase() === "completed";
    const newStatus = isCompleted ? "todo" : "completed";

    // Optimistically update
    const previousTasks = [...tasks];
    setTasks(prevTasks =>
      prevTasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const result = await updateTaskStatus(String(taskId), newStatus);
      if (!result.success) {
        setTasks(previousTasks);
      }
    } catch (error) {
      console.error("Failed to update status", error);
      setTasks(previousTasks);
    }
  };

  const handleTaskCreated = () => {
    getSingleWorkspaceData();
  };

  const openTasksCount = tasks.filter((t: any) => t.status?.toLowerCase() !== "done" && t.status?.toLowerCase() !== "completed").length;
  const completedTasksCount = tasks.filter((t: any) => t.status?.toLowerCase() === "done" || t.status?.toLowerCase() === "completed").length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  return (
    <div style={{ maxWidth: 1100 }} className="p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h1
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#1A1918",
          marginBottom: 6,
          lineHeight: 1.3,
          letterSpacing: "-0.02em",
        }}
      >
        Welcome back, {user?.name || "Builder"} 👋
      </h1>
      <p style={{ fontSize: 14, color: "#9A9890", marginBottom: 28, fontWeight: 500 }}>
        Here's what's happening with <strong style={{ color: "#6C5CE7" }}>{workspace?.title || "your workspace"}</strong> today.
      </p>

      <div
        style={{
          background: "linear-gradient(135deg, rgba(108, 92, 231, 0.04) 0%, rgba(162, 155, 254, 0.04) 100%)",
          border: "1.5px dashed rgba(108, 92, 231, 0.2)",
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
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(108, 92, 231, 0.25)",
            }}
          >
            <Sparkles size={16} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A1918", lineHeight: 1.2 }}>Quick Actions</h3>
            <p style={{ fontSize: 11, color: "#9A9890", marginTop: 2 }}>Accelerate your workflow with interactive shortcuts</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => router.push(`/workspace/${workspaceID}/projects`)}
            className="flex items-center gap-1.5 text-[13px] font-[600] px-4 py-2.5 bg-white text-[#4A4845] hover:text-[#6C5CE7] hover:bg-[#F4F4F2] cursor-pointer shadow-xs transition-all active:scale-[0.97]"
            style={{
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: 10,
            }}
          >
            <FolderKanban size={14} strokeWidth={2} />
            <span>Manage Projects</span>
          </button>

          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="flex items-center gap-1.5 text-[13px] font-[600] px-4 py-2.5 text-white bg-[#6C5CE7] hover:bg-[#5a4ed1] cursor-pointer shadow-sm transition-all active:scale-[0.97]"
            style={{
              border: "none",
              borderRadius: 10,
              boxShadow: "0 4px 12px rgba(108, 92, 231, 0.2)",
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Projects" value={projects?.length?.toString() || "0"} sub="Total workspace projects" subColor="#16A34A" />
        <StatCard label="Open Tasks"      value={openTasksCount.toString()} sub="Pending assignment/review"  subColor="#D97706" />
        <StatCard label="Team Members"    value={members?.length?.toString() || "0"}  sub="Active workspace members" subColor="#9A9890" />
        <StatCard label="Completion Rate" value={`${completionPercentage}%`} sub="Completed tasks ratio"  subColor="#6C5CE7" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E6E0",
            borderRadius: 16,
            padding: "24px 24px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A1918" }}>
                Recent Projects
              </h2>
              <p style={{ fontSize: 11, color: "#9A9890", marginTop: 2 }}>
                Quickly jump back into your active projects
              </p>
            </div>
            <button
              onClick={() => router.push(`/workspace/${workspaceID}/projects`)}
              className="text-xs font-semibold text-[#6C5CE7] hover:text-[#5a4ed1] bg-[#6C5CE7]/5 hover:bg-[#6C5CE7]/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              See All
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {projects && projects.length > 0 ? (
              projects.slice(0, 5).map((project: any, i: number) => {
                const colors = ["#6C5CE7", "#00B894", "#E17055", "#FDCB6E"];
                const initials = project.name.substring(0, 2).toUpperCase();
                return (
                  <ActivityRow
                    key={project.id}
                    initials={initials}
                    avatarColor={colors[i % colors.length]}
                    action={`Project ${project.name} was created`}
                    time={new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    onClick={() => router.push(`/workspace/${workspaceID}/projects/${project.id}`)}
                  />
                );
              })
            ) : (
              <div style={{ padding: "32px 0", textAlign: "center" }}>
                <FolderKanban size={24} color="#D1CECC" style={{ margin: "0 auto 8px" }} />
                <p style={{ fontSize: 13, color: "#9A9890", fontWeight: 500 }}>No projects yet.</p>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E6E0",
            borderRadius: 16,
            padding: "24px 24px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A1918" }}>
                My Workspace Tasks
              </h2>
              <p style={{ fontSize: 11, color: "#9A9890", marginTop: 2 }}>
                Tick off your tasks or view their requirements
              </p>
            </div>
            <button
              onClick={() => router.push(`/workspace/${workspaceID}/tasks`)}
              className="text-xs font-semibold text-[#6C5CE7] hover:text-[#5a4ed1] bg-[#6C5CE7]/5 hover:bg-[#6C5CE7]/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              See All
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {tasks && tasks.length > 0 ? (
              tasks.slice(0, 5).map((task: any) => (
                <TaskRow 
                  key={task.id}
                  title={task.title} 
                  priority={task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : "Medium"} 
                  due={new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} 
                  done={task.status === "done" || task.status === "completed"} 
                  onToggle={() => handleToggleTaskStatus(task.id, task.status)}
                  onClick={() => router.push(`/workspace/${workspaceID}/tasks/${task.id}`)}
                />
              ))
            ) : (
              <div style={{ padding: "32px 0", textAlign: "center" }}>
                <CheckSquare size={24} color="#D1CECC" style={{ margin: "0 auto 8px" }} />
                <p style={{ fontSize: 13, color: "#9A9890", fontWeight: 500 }}>No tasks yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isCreateTaskOpen && (
        <CreateTaskModal
          workspaceID={workspaceID}
          onClose={() => setIsCreateTaskOpen(false)}
          onSuccess={handleTaskCreated}
        />
      )}
    </div>
  );
}
