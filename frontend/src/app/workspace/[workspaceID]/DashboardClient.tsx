"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  FolderKanban,
  Plus,
  CheckSquare,
  ChevronRight,
  Calendar,
  Maximize2,
  Minimize2,
  ArrowUp,
  ArrowDown,
  Minus,
  Play,
  Loader2,
  Eye,
  CheckCircle2,
  RotateCcw,
  Pause,
  Circle,
  Users,
  X,
  Info
} from "lucide-react";
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

interface KanbanCardProps {
  task: any;
  workspaceID: string;
  onToggleStatus: (taskId: number, currentStatus: string) => void;
}

function KanbanCard({ task, workspaceID, onToggleStatus }: KanbanCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const done = task.status?.toLowerCase() === "done" || task.status?.toLowerCase() === "completed";

  const getPriorityBadge = (priority: string) => {
    const p = priority?.toLowerCase() || "low";
    let color = "text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-400";
    let icon = <Minus className="w-3 h-3" />;
    
    if (p === "high") {
      color = "text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400";
      icon = <ArrowUp className="w-3 h-3" />;
    } else if (p === "low") {
      color = "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400";
      icon = <ArrowDown className="w-3 h-3" />;
    }
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${color}`}>
        {icon}
        {p}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "todo";
    let color = "bg-zinc-100 text-zinc-700 dark:bg-zinc-850 dark:text-zinc-400";
    
    if (s === "completed" || s === "done") {
      color = "bg-teal-550 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 border border-teal-200 dark:border-teal-900/30";
    } else if (s === "in progress" || s === "active") {
      color = "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30";
    } else if (s === "review") {
      color = "bg-yellow-550 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400 border border-yellow-250 dark:border-yellow-900/30";
    } else if (s === "todo" || s === "redo") {
      color = "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30";
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider capitalize ${color}`}>
        {s}
      </span>
    );
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/workspace/${workspaceID}/tasks/${task.id}`)}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 group cursor-pointer flex flex-col gap-2.5 shadow-xs"
      style={{
        boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.03)" : "none",
        borderColor: hovered ? "var(--primary)" : undefined
      }}
    >
      <div className="flex items-start gap-2.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(task.id, task.status);
          }}
          className="hover:scale-115 active:scale-90 transition-all duration-150 flex items-center justify-center shrink-0 w-4 h-4 rounded border border-zinc-300 dark:border-zinc-700 data-[done=true]:border-none data-[done=true]:bg-black dark:data-[done=true]:bg-white outline-none mt-0.5"
          data-done={done}
        >
          {done && (
            <svg width="8" height="6" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.5 6L8 1" stroke="white" className="dark:stroke-black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        <span
          className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-colors duration-150 line-clamp-2 leading-snug"
          style={{
            textDecoration: done ? "line-through" : "none",
            opacity: done ? 0.5 : 1,
          }}
        >
          {task.title}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
        <div className="flex items-center gap-1.5">
          {getPriorityBadge(task.priority)}
          {getStatusBadge(task.status)}
        </div>
        
        {task.taskMembers && task.taskMembers.length > 0 && (
          <div className="flex -space-x-1.5 overflow-hidden">
            {task.taskMembers.slice(0, 3).map((m: any, idx: number) => (
              <div
                key={idx}
                title={m.user?.name}
                className="w-5 h-5 rounded-full bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-900 border border-white dark:border-zinc-900 flex items-center justify-center text-[9px] font-bold shrink-0"
              >
                {(m.user?.name || "U").charAt(0).toUpperCase()}
              </div>
            ))}
            {task.taskMembers.length > 3 && (
              <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-white dark:border-zinc-900 flex items-center justify-center text-[9px] font-bold shrink-0">
                +{task.taskMembers.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  tasks: any[];
  workspaceID: string;
  onToggleStatus: (taskId: number, currentStatus: string) => void;
  maxHeight?: string;
}

function KanbanColumn({ title, tasks, workspaceID, onToggleStatus, maxHeight = "350px" }: KanbanColumnProps) {
  const completedTasks = tasks.filter(t => t.status?.toLowerCase() === "done" || t.status?.toLowerCase() === "completed").length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="flex-1 min-w-[280px] max-w-[360px] bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 truncate pr-2">
            {title}
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200/60 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-400">
            {tasks.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0D9488] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 shrink-0">
            {progressPercent}% done
          </span>
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 mt-2 scrollbar-thin"
        style={{ maxHeight }}
      >
        {tasks.length > 0 ? (
          tasks.map(task => (
            <KanbanCard
              key={task.id}
              task={task}
              workspaceID={workspaceID}
              onToggleStatus={onToggleStatus}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg bg-white/20 dark:bg-black/10">
            <Info size={16} className="text-zinc-400 dark:text-zinc-600 mb-1" />
            <p className="text-[11px] text-zinc-400 dark:text-zinc-600 font-medium">No tasks in this project</p>
          </div>
        )}
      </div>
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
  const [isKanbanFullScreen, setIsKanbanFullScreen] = useState(false);

  const groupedTasks = useMemo(() => {
    const groups: Record<string, any[]> = {};
    
    projects.forEach(project => {
      groups[project.id] = [];
    });
    
    groups["unassigned"] = [];
    
    tasks.forEach(task => {
      const pId = task.projectId;
      if (pId && groups[pId]) {
        groups[pId].push(task);
      } else {
        groups["unassigned"].push(task);
      }
    });
    
    return groups;
  }, [projects, tasks]);

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

      {/* ──────────────────── KANBAN BOARD ──────────────────── */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm mb-8 mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <FolderKanban size={16} className="text-[#3c3489]" />
              Workspace Kanban Board
            </h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Visualize task progress and relations across all projects in this workspace
            </p>
          </div>
          <button
            onClick={() => setIsKanbanFullScreen(true)}
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title="Expand to Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {projects && projects.length > 0 ? (
            projects.map(project => (
              <KanbanColumn
                key={project.id}
                title={project.name}
                tasks={groupedTasks[project.id] || []}
                workspaceID={workspaceID}
                onToggleStatus={handleToggleTaskStatus}
              />
            ))
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/10">
              <FolderKanban size={32} className="text-zinc-300 dark:text-zinc-700 mb-2" />
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">No projects in this workspace yet</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Create a project to start organizing tasks</p>
            </div>
          )}
          
          {groupedTasks["unassigned"] && groupedTasks["unassigned"].length > 0 && (
            <KanbanColumn
              title="Unassigned Tasks"
              tasks={groupedTasks["unassigned"]}
              workspaceID={workspaceID}
              onToggleStatus={handleToggleTaskStatus}
            />
          )}
        </div>
      </div>

      {/* ──────────────────── KANBAN FULLSCREEN PORTAL/OVERLAY ──────────────────── */}
      {isKanbanFullScreen && (
        <div className="fixed inset-0 z-50 bg-[#fcf8fb] dark:bg-[#0a0a0f] p-6 md:p-8 flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FolderKanban size={20} className="text-[#3c3489]" />
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {workspace?.title || "Workspace"} Kanban Board
                </h1>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Visualizing task completion status and workflow across projects
              </p>
            </div>
            
            <button
              onClick={() => setIsKanbanFullScreen(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-800"
            >
              <Minimize2 size={14} />
              Exit Fullscreen
            </button>
          </div>
          
          <div className="flex-1 flex gap-4 overflow-x-auto pb-4 scrollbar-thin items-stretch h-full">
            {projects && projects.length > 0 ? (
              projects.map(project => (
                <KanbanColumn
                  key={project.id}
                  title={project.name}
                  tasks={groupedTasks[project.id] || []}
                  workspaceID={workspaceID}
                  onToggleStatus={handleToggleTaskStatus}
                  maxHeight="calc(100vh - 220px)"
                />
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/10 h-full">
                <FolderKanban size={48} className="text-zinc-300 dark:text-zinc-700 mb-2" />
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">No projects in this workspace yet</p>
              </div>
            )}
            
            {groupedTasks["unassigned"] && groupedTasks["unassigned"].length > 0 && (
              <KanbanColumn
                title="Unassigned Tasks"
                tasks={groupedTasks["unassigned"]}
                workspaceID={workspaceID}
                onToggleStatus={handleToggleTaskStatus}
                maxHeight="calc(100vh - 220px)"
              />
            )}
          </div>
        </div>
      )}

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
