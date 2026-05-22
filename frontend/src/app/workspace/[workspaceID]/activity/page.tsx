/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useState, useEffect, useMemo } from "react";
import { useAuth } from "@/authContext/AuthContext";
import axios from "axios";
import { 
  Folder, 
  CheckSquare, 
  Users, 
  Shield, 
  Search, 
  Calendar, 
  ArrowUpDown, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  PlusCircle,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityItem {
  id: string;
  type: "project" | "task" | "member" | "team";
  title: string;
  details: string;
  timestamp: Date;
  meta: string;
  user: string;
}

export default function ActivityPage({ params }: { params: Promise<{ workspaceID: string }> }) {
  const { user } = useAuth()!;
  const { workspaceID } = use(params);

  // States for raw data
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States for filters & search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Fetch workspace details & team details in parallel
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [wsRes, teamRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/workspace/${workspaceID}`, {
            withCredentials: true,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/team/workspace/${workspaceID}`, {
            withCredentials: true,
          }),
        ]);

        if (wsRes.data.success) {
          const wd = wsRes.data.workspaceData;
          setProjects(wd.projects || []);
          setTasks(wd.tasks || []);
          setMembers(wd.members || []);
        }

        if (teamRes.data.success) {
          setTeams(teamRes.data.teams || []);
        }
      } catch (err: any) {
        console.error("Error fetching activity data:", err);
        setError("Failed to load activity logs. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [workspaceID]);

  // Aggregate raw entities into unified activities feed
  const activities = useMemo(() => {
    const projectActs: ActivityItem[] = projects.map((p: any) => ({
      id: `project-${p.id}`,
      type: "project",
      title: `Project "${p.name}" was created`,
      details: p.describtion || "No description provided for this project.",
      timestamp: new Date(p.createdAt),
      meta: p.field || "Project Creation",
      user: "Workspace Team",
    }));

    const taskActs: ActivityItem[] = tasks.map((t: any) => {
      const isDone = t.status?.toLowerCase() === "done" || t.status?.toLowerCase() === "completed";
      return {
        id: `task-${t.id}`,
        type: "task",
        title: isDone ? `Task "${t.title}" was completed` : `Task "${t.title}" was created`,
        details: t.describtion || "No details provided.",
        timestamp: new Date(t.updatedAt || t.createdAt),
        meta: t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : "Medium",
        user: t.assignee || "Assigned",
      };
    });

    const memberActs: ActivityItem[] = members.map((m: any) => ({
      id: `member-${m.id}`,
      type: "member",
      title: "New member joined the workspace",
      details: `Role: ${m.role || "Member"} · Active status`,
      timestamp: new Date(m.joinedAt || m.createdAt || new Date()),
      meta: m.role || "Member",
      user: m.user?.name || "Workspace Member",
    }));

    const teamActs: ActivityItem[] = teams.map((tm: any) => ({
      id: `team-${tm.id}`,
      type: "team",
      title: `Team "${tm.teamName}" was formed`,
      details: `Assigned to Project: ${tm.project?.name || "Unassigned"}`,
      timestamp: new Date(tm.createdAt || new Date()),
      meta: `${tm.teamMembers?.length || 0} Members`,
      user: tm.project?.name || "Team Workspace",
    }));

    return [...projectActs, ...taskActs, ...memberActs, ...teamActs];
  }, [projects, tasks, members, teams]);

  // Filter & Search timeline feed
  const filteredActivities = useMemo(() => {
    let result = [...activities];

    // Filter by Tab/Type
    if (activeTab !== "all") {
      result = result.filter((act) => act.type === activeTab);
    }

    // Filter by Date
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      result = result.filter((act) => {
        const actDate = act.timestamp;
        if (dateFilter === "today") return actDate >= today;
        if (dateFilter === "week") return actDate >= oneWeekAgo;
        if (dateFilter === "month") return actDate >= oneMonthAgo;
        return true;
      });
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (act) =>
          act.title.toLowerCase().includes(query) ||
          act.details.toLowerCase().includes(query) ||
          act.meta.toLowerCase().includes(query) ||
          act.user.toLowerCase().includes(query)
      );
    }

    // Sort chronologically
    result.sort((a, b) => {
      const timeA = a.timestamp.getTime();
      const timeB = b.timestamp.getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [activities, activeTab, dateFilter, searchQuery, sortOrder]);

  // Dynamic statistics
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const completedTasks = tasks.filter(
      (t) => t.status?.toLowerCase() === "done" || t.status?.toLowerCase() === "completed"
    ).length;
    const activeTasks = tasks.length - completedTasks;
    const teamSize = members.length;
    return { totalProjects, completedTasks, activeTasks, teamSize };
  }, [projects, tasks, members]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[13px] font-medium text-[#7A7885]">Loading activity logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="p-3 bg-red-50 rounded-full mb-3">
          <Clock className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-[#1A1918] mb-1">Failed to fetch activities</h3>
        <p className="text-[13px] text-[#9A9890] max-w-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-6 max-w-[1200px] mx-auto min-h-screen">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1918] tracking-tight">Workspace Activity</h1>
          <p className="text-[13px] text-[#9A9890] mt-1">
            Chronological updates, logs, and activity events inside your workspace.
          </p>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Projects", value: stats.totalProjects, icon: Folder, color: "text-[#6C5CE7]", bg: "bg-[#6C5CE7]/10" },
          { label: "Active Tasks", value: stats.activeTasks, icon: Clock, color: "text-[#D97706]", bg: "bg-[#D97706]/10" },
          { label: "Completed Tasks", value: stats.completedTasks, icon: CheckCircle2, color: "text-[#16A34A]", bg: "bg-[#16A34A]/10" },
          { label: "Team Size", value: stats.teamSize, icon: Users, color: "text-[#2563EB]", bg: "bg-[#2563EB]/10" },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-white border border-[#E8E6E0] rounded-xl p-4 shadow-sm hover:shadow transition-shadow"
          >
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} strokeWidth={2} />
            </div>
            <div>
              <span className="text-[11px] font-medium text-[#9A9890] uppercase tracking-wider block">{stat.label}</span>
              <span className="text-xl font-semibold text-[#1A1918] mt-0.5 block">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Filters and Timeline Feed (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E8E6E0] rounded-xl p-3 shadow-sm">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-[#9A9890]" size={15} />
              <input
                type="text"
                placeholder="Search activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-[13px] text-[#1A1918] pl-9 pr-4 py-1.5 bg-[#F7F6F3] border border-[#E8E6E0] rounded-lg focus:outline-none focus:border-[#6C5CE7] placeholder-[#9A9890]"
              />
            </div>
            
            {/* Dropdowns */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#F7F6F3] border border-[#E8E6E0] rounded-lg px-2 py-1.5">
                <Calendar size={13} className="text-[#9A9890]" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-transparent text-[12px] text-[#1A1918] focus:outline-none font-medium cursor-pointer"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                </select>
              </div>

              <button
                onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                className="flex items-center gap-1.5 bg-[#F7F6F3] border border-[#E8E6E0] rounded-lg px-3 py-1.5 text-[12px] text-[#1A1918] font-medium hover:bg-[#F0EEE9] transition-colors cursor-pointer"
              >
                <ArrowUpDown size={13} className="text-[#9A9890]" />
                {sortOrder === "desc" ? "Newest First" : "Oldest First"}
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 border-b border-[#E8E6E0] overflow-x-auto pb-px">
            {[
              { id: "all", label: "All Activities" },
              { id: "project", label: "Projects" },
              { id: "task", label: "Tasks" },
              { id: "member", label: "Members" },
              { id: "team", label: "Teams" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-[13px] font-medium transition-all duration-150 relative cursor-pointer ${
                  activeTab === tab.id 
                    ? "text-[#6C5CE7]" 
                    : "text-[#9A9890] hover:text-[#1A1918]"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C5CE7]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Timeline Feed */}
          <div className="relative pl-6 border-l-2 border-[#E8E6E0] ml-3.5 space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act) => {
                  // Type Specific Config
                  const config = {
                    project: { icon: Folder, color: "text-[#6C5CE7]", bg: "bg-[#6C5CE7]/10", ring: "ring-[#6C5CE7]/20" },
                    task: { icon: CheckSquare, color: "text-[#16A34A]", bg: "bg-[#16A34A]/10", ring: "ring-[#16A34A]/20" },
                    member: { icon: Users, color: "text-[#D97706]", bg: "bg-[#D97706]/10", ring: "ring-[#D97706]/20" },
                    team: { icon: Shield, color: "text-[#2563EB]", bg: "bg-[#2563EB]/10", ring: "ring-[#2563EB]/20" },
                  }[act.type];

                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={act.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2 }}
                      className="relative group"
                    >
                      {/* Timeline Node Ring */}
                      <div className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 bg-[#F7F6F3] ${config.ring} ${config.bg} ${config.color} transition-all duration-200 group-hover:scale-110`}>
                        <Icon size={12} strokeWidth={2.5} />
                      </div>

                      {/* Content Card */}
                      <div className="bg-white border border-[#E8E6E0] hover:border-[#D1CECC] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-[13px] font-semibold text-[#1A1918] tracking-tight">
                              {act.title}
                            </h3>
                            <p className="text-[12px] text-[#7A7885] mt-1 leading-relaxed">
                              {act.details}
                            </p>
                          </div>
                          
                          {/* Tag & Time */}
                          <div className="flex flex-col items-end gap-1.5 shrink-0 text-right">
                            <span className="text-[10px] text-[#9A9890] font-medium flex items-center gap-1.5">
                              <Clock size={11} />
                              {act.timestamp.toLocaleDateString()} at {act.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F4F3F0] text-[#7A7885] border border-[#E8E6E0]">
                              {act.meta}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-8 text-center bg-white border border-[#E8E6E0] rounded-xl"
                >
                  <FileText className="w-8 h-8 text-[#9A9890] mb-2" />
                  <p className="text-[13px] font-medium text-[#1A1918]">No activity events found</p>
                  <p className="text-[12px] text-[#9A9890] mt-0.5">
                    Try adjusting your filters, search term, or date range.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Mini Sidebar / Stats insights */}
        <div className="space-y-6">
          {/* Productivity insight Card */}
          <div className="bg-white border border-[#E8E6E0] rounded-xl p-5 shadow-sm">
            <h2 className="text-[13px] font-semibold text-[#1A1918] flex items-center gap-2">
              <TrendingUp size={15} className="text-[#6C5CE7]" />
              Workspace Productivity
            </h2>
            <p className="text-[11px] text-[#9A9890] mt-0.5">
              Visual insights on current tasks and team status.
            </p>

            <div className="mt-6 space-y-4">
              {/* Task Completion Rate */}
              <div>
                <div className="flex items-center justify-between text-[12px] mb-1.5">
                  <span className="text-[#7A7885] font-medium">Task Completion Rate</span>
                  <span className="text-[#1A1918] font-bold">
                    {tasks.length > 0 
                      ? `${Math.round((stats.completedTasks / tasks.length) * 100)}%` 
                      : "0%"}
                  </span>
                </div>
                <div className="w-full bg-[#F4F3F0] h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: tasks.length > 0 
                        ? `${(stats.completedTasks / tasks.length) * 100}%` 
                        : "0%" 
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#a29bfe] rounded-full"
                  />
                </div>
              </div>

              {/* Task Load Distribution */}
              <div className="border-t border-[#F0EEE9] pt-4">
                <span className="text-[11px] font-semibold text-[#9A9890] uppercase tracking-wider block mb-3">
                  Task Priority Mix
                </span>
                <div className="space-y-2">
                  {[
                    { label: "High Priority", count: tasks.filter(t => t.priority?.toLowerCase() === "high").length, color: "bg-red-500" },
                    { label: "Medium Priority", count: tasks.filter(t => t.priority?.toLowerCase() === "medium" || !t.priority).length, color: "bg-amber-500" },
                    { label: "Low Priority", count: tasks.filter(t => t.priority?.toLowerCase() === "low").length, color: "bg-green-500" },
                  ].map((prio, idx) => {
                    const pct = tasks.length > 0 ? (prio.count / tasks.length) * 100 : 0;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${prio.color}`} />
                        <span className="text-[12px] text-[#7A7885] flex-1">{prio.label}</span>
                        <span className="text-[11px] text-[#9A9890] font-bold">{prio.count} tasks ({Math.round(pct)}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick tips Card */}
          <div className="bg-gradient-to-br from-[#0F0F10] to-[#1F1F24] border border-[#2F2F35] text-white rounded-xl p-5 shadow-md">
            <h3 className="text-[13px] font-semibold text-white/90">Forge Pro Tip 💡</h3>
            <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed">
              Use the tab filters and keyword search to isolate specific activity classes instantly. Sorting toggles can help inspect historical actions or focus on the absolute latest events.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
