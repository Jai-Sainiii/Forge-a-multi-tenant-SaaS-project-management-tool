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
      className="flex-1 min-w-[200px] rounded-xl p-5 md:p-6 bg-white dark:bg-zinc-900 border transition-all duration-250 cursor-default"
      style={{
        borderColor: hovered ? "var(--primary)" : "var(--secondary-light)",
        boxShadow: hovered ? "0 10px 25px rgba(0,0,0,0.04)" : "0 1px 3px rgba(0,0,0,0.01)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase mb-2">
        {label}
      </p>
      <p className="text-3xl font-bold text-zinc-900 dark:text-white leading-none mb-1">
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
      className="group flex items-center gap-3 py-3 rounded-xl px-3 -mx-3 transition-all duration-200 hover:bg-black/3 dark:hover:bg-white/4"
      style={{
        borderBottom: "1px solid var(--secondary-light)",
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
      <div className="flex-1 flex flex-col gap-0.5">
        <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-colors duration-200">
          {action}
        </span>
        <span className="text-[11px] text-[#9A9890] flex items-center gap-1">
          <Calendar size={11} />
          {time}
        </span>
      </div>
      {onClick && hovered && (
        <ChevronRight size={14} className="text-black dark:text-white animate-in slide-in-from-left-1 duration-150" />
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
      className="group flex items-center gap-3 py-3 rounded-xl px-3 -mx-3 transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      style={{
        borderBottom: "1px solid var(--secondary-light)",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.(e);
        }}
        className="hover:scale-110 active:scale-90 transition-all duration-150 flex items-center justify-center shrink-0 w-[18px] h-[18px] rounded-md border-[1.5px] border-zinc-300 dark:border-zinc-700 data-[done=true]:border-none data-[done=true]:bg-black dark:data-[done=true]:bg-white outline-none"
        data-done={done}
      >
        {done && (
          <svg width="10" height="8" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="white" className="dark:stroke-black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <span
        className="flex-1 text-[13px] font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-colors duration-200"
        style={{
          textDecoration: done ? "line-through" : "none",
          opacity: done ? 0.6 : 1,
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
      <span className="text-[11px] text-[#9A9890]">{due}</span>
      {onClick && hovered && (
        <ChevronRight size={14} className="text-black dark:text-white animate-in slide-in-from-left-1 duration-150" />
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
      <h1 className="text-2xl sm:text-[26px] font-bold text-zinc-900 dark:text-white mb-1.5 leading-tight tracking-tight">
        Welcome back, {user?.name || "Builder"} 👋
      </h1>
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-8">
        Here's what's happening with <strong className="text-black dark:text-white font-semibold">{workspace?.title || "your workspace"}</strong> today.
      </p>
      <div
        className="bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-4 p-5 rounded-2xl mb-8"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #18181B 0%, #52525B 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
            }}
          >
            <Sparkles size={16} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-normal">Quick Actions</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Accelerate your workflow with interactive shortcuts</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => router.push(`/workspace/${workspaceID}/projects`)}
            className="flex items-center gap-1.5 text-[13px] font-[600] px-4 py-2.5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer border border-zinc-200 dark:border-zinc-800 rounded-[10px] shadow-xs transition-all active:scale-[0.97]"
          >
            <FolderKanban size={14} strokeWidth={2} />
            <span>Manage Projects</span>
          </button>
 
          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="flex items-center gap-1.5 text-[13px] font-[600] px-4 py-2.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 cursor-pointer shadow-sm rounded-[10px] transition-all active:scale-[0.97]"
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
        <StatCard label="Completion Rate" value={`${completionPercentage}%`} sub="Completed tasks ratio"  subColor="var(--secondary)" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                Recent Projects
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Quickly jump back into your active projects
              </p>
            </div>
            <button
              onClick={() => router.push(`/workspace/${workspaceID}/projects`)}
              className="text-xs font-semibold text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-800"
            >
              See All
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {projects && projects.length > 0 ? (
              projects.slice(0, 5).map((project: any, i: number) => {
                const colors = ["#27272A", "#3F3F46", "#52525B", "#71717A"];
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
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                My Workspace Tasks
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Tick off your tasks or view their requirements
              </p>
            </div>
            <button
              onClick={() => router.push(`/workspace/${workspaceID}/tasks`)}
              className="text-xs font-semibold text-black dark:text-white hover:bg-zinc-150 dark:hover:bg-zinc-800 bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-800"
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
