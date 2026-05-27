"use client";
import { use, useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { 
    AlertCircle, 
    ArrowLeft, 
    CheckCircle2, 
    Circle, 
    Clock, 
    Edit, 
    FolderKanban, 
    ListTodo, 
    Plus, 
    Tag,
    ArrowUp,
    ArrowDown,
    Minus,
    MoreHorizontal,
    Users,
    Shield,
    UserPlus,
    ChevronDown,
    X,
    Loader2,
    Mail,
    UserMinus
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreateTaskModal from "@/components/forms/CreateTask";
import { useAuth } from "@/authContext/AuthContext";

import EditProjectModal from "@/components/forms/EditProjectModal";
import AddProjectMemberModal from "@/components/forms/AddProjectMemberModal";
import AddTeamMemberModal from "@/components/forms/AddTeamMemberModal";
import CreateTeamModal from "@/components/forms/CreateTeamModal";
import EditProjectMemberModal from "@/components/forms/EditProjectMemberModal";
import RemoveProjectMemberModal from "@/components/forms/RemoveProjectMemberModal";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
}

export interface Project {
    id: number;
    name: string;
    field: string;
    description: string;
    status: string;
    tasks: Task[];
    projectMembers: {
        id: number;
        userId: number;
        projectId: number;
        position: string;
        role: string;
        user: {
            id: number;
            name: string;
            email: string;
        };
    }[];
    createdAt: string;
}

// --- Memoized sub-components to prevent re-renders ---

const PriorityBadge = memo(function PriorityBadge({ priority }: { priority: string }) {
    const p = priority?.toLowerCase();
    let icon;
    if (p === 'high') icon = <ArrowUp className="w-4 h-4 text-red-500" />;
    else if (p === 'low') icon = <ArrowDown className="w-4 h-4 text-blue-500" />;
    else icon = <Minus className="w-4 h-4 text-gray-500 dark:text-gray-400" />;

    return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide capitalize border border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300">
            {icon}
            {priority || "Medium"}
        </div>
    );
});

const StatusBadge = memo(function StatusBadge({ status }: { status: string }) {
    const s = status?.toLowerCase();
    const isCompleted = s === 'completed' || s === 'done';
    const isActive = s === 'in progress' || s === 'active';
    const isReview = s === 'review';

    const cls = isCompleted
        ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
        : isActive
        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
        : isReview
        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
        : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/10';

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide capitalize ${cls}`}>
            {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            ) : (
                <Circle className="w-3.5 h-3.5 mr-1.5 fill-current opacity-55" />
            )}
            {status || "Todo"}
        </span>
    );
});

const TaskRow = memo(function TaskRow({ task, workspaceID }: { task: Task; workspaceID: string }) {
    const router = useRouter();
    return (
        <tr 
            onClick={() => router.push(`/workspace/${workspaceID}/tasks/${task.id}`)} 
            className="group hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors duration-150 cursor-pointer"
        >
            <td className="px-6 py-4">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#6C5CE7] transition-colors mb-0.5">
                    {task.title}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 max-w-md">
                    {task.description}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <PriorityBadge priority={task.priority} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={task.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
});

const MemberRow = memo(function MemberRow({ 
    member, 
    canEdit, 
    currentUserEmail,
    onEdit,
    onRemove
}: { 
    member: any; 
    canEdit: boolean; 
    currentUserEmail?: string;
    onEdit: (m: any) => void;
    onRemove: (m: any) => void;
}) {
    return (
        <div className="group flex items-center justify-between p-4.5 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors duration-150">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#8b7ff0] text-white font-bold text-sm flex items-center justify-center shadow-md shadow-[#6C5CE7]/15 shrink-0 select-none">
                    {member.user?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{member.user?.name || "Unknown User"}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{member.user?.email}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200/10">
                        {member.role?.toLowerCase() === "admin" && <Shield className="w-3 h-3 text-[#6C5CE7]" />}
                        {member.role}
                    </span>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 mt-1 capitalize">{member.position}</p>
                </div>

                {canEdit && member.user?.email !== currentUserEmail && (
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(member); }}
                            className="p-1.5 text-slate-400 hover:text-[#6C5CE7] hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                            title="Edit Member Role & Position"
                        >
                            <Shield className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(member); }}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Remove Member from Project"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

const TeamAccordion = memo(function TeamAccordion({ 
    team, 
    isExpanded, 
    onToggle, 
    canEdit,
    onAddMember 
}: { 
    team: any; 
    isExpanded: boolean; 
    onToggle: () => void; 
    canEdit: boolean;
    onAddMember: (team: any) => void;
}) {
    return (
        <div className="border-b border-black/5 dark:border-white/5 last:border-b-0">
            <div 
                className="p-4.5 cursor-pointer flex justify-between items-center hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors duration-150"
                onClick={onToggle}
            >
                <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{team.teamName}</h4>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{team.teamMembers?.length || 0} Members</span>
                </div>
                <div className="flex items-center gap-2">
                    {canEdit && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onAddMember(team); }}
                            className="p-1.5 text-[#6C5CE7] hover:bg-[#6C5CE7]/15 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#6C5CE7]/10"
                            title="Add Member to Team"
                        >
                            <UserPlus className="w-4 h-4" />
                        </button>
                    )}
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#6C5CE7]" : ""}`} />
                </div>
            </div>
            
            {/* CSS-only accordion — no framer-motion */}
            <div 
                className="overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out"
                style={{ 
                    maxHeight: isExpanded ? '500px' : '0px',
                    opacity: isExpanded ? 1 : 0,
                }}
            >
                <div className="bg-slate-50/30 dark:bg-slate-950/10 border-t border-black/5 dark:border-white/5 p-3 space-y-2">
                    {team.teamMembers && team.teamMembers.length > 0 ? (
                        team.teamMembers.map((tm: any) => (
                            <div key={tm.id} className="flex items-center justify-between p-2.5 hover:bg-white dark:hover:bg-slate-900 rounded-xl border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-colors duration-100">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6C5CE7] to-[#8b7ff0] text-white font-bold text-[10px] flex items-center justify-center shadow-sm select-none shrink-0">
                                        {tm.user?.name?.charAt(0).toUpperCase() || "?"}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{tm.user?.name}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{tm.user?.email}</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200/10">
                                        {tm.role}
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 mt-1 capitalize">{tm.position}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-center text-slate-400 dark:text-slate-500 py-4 font-medium uppercase tracking-wider">No members in this team.</p>
                    )}
                </div>
            </div>
        </div>
    );
});

export default function ProjectDetailsPage({
    params
}: {
    params: Promise<{ workspaceID: string, projectID: string }>
}) {
    const { workspaceID, projectID } = use(params);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);

    // Refs to track first load
    const hasLoadedOnce = useRef(false);
    const hasLoadedTeamsOnce = useRef(false);

    // Project Teams States
    const [teams, setTeams] = useState<any[]>([]);
    const [teamsLoading, setTeamsLoading] = useState(true);
    const [teamsError, setTeamsError] = useState<string | null>(null);
    const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);

    // Workspace members state
    const [workspaceMembers, setWorkspaceMembers] = useState<any[]>([]);

    // Modals States
    const [isAddProjectMemberModalOpen, setIsAddProjectMemberModalOpen] = useState(false);
    const [isAddTeamMemberModalOpen, setIsAddTeamMemberModalOpen] = useState(false);
    const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
    const [selectedTeamForAdd, setSelectedTeamForAdd] = useState<any>(null);

    // Edit/Remove Project Member States
    const [isEditProjectMemberModalOpen, setIsEditProjectMemberModalOpen] = useState(false);
    const [selectedProjectMemberForEdit, setSelectedProjectMemberForEdit] = useState<any>(null);

    const [isRemoveProjectMemberModalOpen, setIsRemoveProjectMemberModalOpen] = useState(false);
    const [projectMemberToRemove, setProjectMemberToRemove] = useState<any>(null);

    const router = useRouter();
    const authContext = useAuth();
    const user = authContext ? authContext.user : null;

    // Fetch workspace members once on initial mount
    const fetchWorkspaceMembers = useCallback(async () => {
        if (!user) return;
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/members/${workspaceID}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                setWorkspaceMembers(res.data.members || []);
            }
        } catch (err) {
            console.error("Error fetching workspace members:", err);
        }
    }, [workspaceID, user]);

    // Synchronously check user permission with zero visual delay or state-update render lag
    const canEdit = useMemo(() => {
        if (!user || !project || workspaceMembers.length === 0) return false;
        const currentMember = workspaceMembers.find((m: any) => m.user?.email === user.email);
        if (!currentMember) return false;

        const isWorkspaceAdmin = ["admin", "owner"].includes(currentMember.role?.toLowerCase());
        const projectMembers = project.projectMembers || [];
        const isProjectAdmin = projectMembers.some(
            (pm: any) => pm.userId === currentMember.userId && pm.role?.toLowerCase() === "admin"
        );

        return isWorkspaceAdmin || isProjectAdmin;
    }, [workspaceMembers, project, user]);

    const fetchProjectDetails = useCallback(async () => {
        if (!hasLoadedOnce.current) {
            setLoading(true);
        }
        setError(null);
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/project/singleProject/${projectID}`, 
                { withCredentials: true }
            );
            if (res.data.success || res.data.sucess === "true") {
                setProject(res.data.project);
                hasLoadedOnce.current = true;
            } else {
                setError(res.data.message || "Failed to load project details.");
            }
        } catch (err) {
            setError("An error occurred while fetching project details.");
        } finally {
            setLoading(false);
        }
    }, [projectID]);

    const fetchTeams = useCallback(async () => {
        if (!hasLoadedTeamsOnce.current) {
            setTeamsLoading(true);
        }
        setTeamsError(null);
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/team/project/${projectID}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                setTeams(res.data.teams || []);
                hasLoadedTeamsOnce.current = true;
            } else {
                setTeamsError(res.data.error || "Failed to load project teams.");
            }
        } catch (err) {
            setTeamsError("Failed to load project teams.");
        } finally {
            setTeamsLoading(false);
        }
    }, [projectID]);

    useEffect(() => {
        fetchProjectDetails();
        fetchTeams();
        fetchWorkspaceMembers();
    }, [fetchProjectDetails, fetchTeams, fetchWorkspaceMembers]);

    // Memoized derived data
    const { completedTasksCount, totalTasksCount, progressPercentage } = useMemo(() => {
        const completed = project?.tasks?.filter(t => t.status?.toLowerCase() === 'completed' || t.status?.toLowerCase() === 'done').length || 0;
        const total = project?.tasks?.length || 0;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completedTasksCount: completed, totalTasksCount: total, progressPercentage: pct };
    }, [project?.tasks]);

    const availableWorkspaceMembers = useMemo(() => {
        const existingIds = project?.projectMembers?.map((pm: any) => pm.userId) || [];
        return workspaceMembers.filter((wm: any) => wm.isActive && !existingIds.includes(wm.userId));
    }, [workspaceMembers, project?.projectMembers]);

    const availableProjectMembers = useMemo(() => {
        const teamMemberIds = selectedTeamForAdd?.teamMembers?.map((tm: any) => tm.userId) || [];
        return project?.projectMembers?.filter((pm: any) => !teamMemberIds.includes(pm.userId)) || [];
    }, [selectedTeamForAdd, project?.projectMembers]);

    // Stable callback refs for memoized children
    const handleEditMember = useCallback((member: any) => {
        setSelectedProjectMemberForEdit(member);
        setIsEditProjectMemberModalOpen(true);
    }, []);

    const handleRemoveMember = useCallback((member: any) => {
        setProjectMemberToRemove(member);
        setIsRemoveProjectMemberModalOpen(true);
    }, []);

    const handleAddTeamMember = useCallback((team: any) => {
        setSelectedTeamForAdd(team);
        setIsAddTeamMemberModalOpen(true);
    }, []);

    // Status dot color (computed once, no animate-pulse)
    const statusDotColor = useMemo(() => {
        const s = project?.status?.toLowerCase();
        if (s === 'active' || s === 'completed') return 'bg-green-500';
        if (s === 'review') return 'bg-amber-500';
        if (s === 'suspended') return 'bg-red-500';
        return 'bg-blue-500';
    }, [project?.status]);

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-6 space-y-8 animate-pulse">
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                <div className="h-64 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </main>
        );
    }

    if (error || !project) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-6 space-y-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 text-red-700 dark:text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5" />
                    {error || "Project not found"}
                    <button onClick={fetchProjectDetails} className="ml-auto px-3 py-1 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                        Retry
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
            {/* Header / Banner — solid bg, no backdrop-blur */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/20 p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-[#6C5CE7]/8 to-[#a29bfe]/4 rounded-full blur-3xl pointer-events-none" />
                
                <Link 
                    href={`/workspace/${workspaceID}/projects`} 
                    className="group inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#6C5CE7] hover:text-[#5a4ed1] mb-6 transition-colors duration-150"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-150 group-hover:-translate-x-1" />
                    Back to Projects
                </Link>
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-[#6C5CE7]/10 text-[#6C5CE7] rounded-xl border border-[#6C5CE7]/20 shadow-md shadow-[#6C5CE7]/5">
                                <FolderKanban className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    {project.name}
                                </h1>
                            </div>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed">
                            {project.description}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-start">
                        {canEdit && (
                            <button 
                                onClick={() => setIsEditProjectModalOpen(true)}
                                className="flex items-center gap-2 bg-white dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm hover:shadow-md cursor-pointer active:scale-97"
                            >
                                <Edit className="w-3.5 h-3.5" />
                                Edit Project
                            </button>
                        )}
                        {canEdit && (
                            <button 
                                onClick={() => setIsCreateTaskModalOpen(true)}
                                className="flex items-center gap-2 bg-[#6C5CE7] hover:bg-[#5a4ed1] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md hover:shadow-lg hover:shadow-primary/10 cursor-pointer active:scale-97"
                            >
                                <Plus className="w-4 h-4" strokeWidth={2.5} />
                                Add Task
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Cards / Metrics — solid bg, no backdrop-blur, no hover:translate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Field Card */}
                <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-lg shadow-slate-900/2 dark:shadow-black/10 flex items-start gap-4">
                    <div className="p-3.5 bg-slate-100 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 rounded-xl border border-slate-200/50 dark:border-slate-800 flex items-center justify-center">
                        <Tag className="w-5 h-5 text-[#6C5CE7]" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Field / Category</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{project.field}</p>
                    </div>
                </div>
                
                {/* Status Card */}
                <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-lg shadow-slate-900/2 dark:shadow-black/10 flex items-start gap-4">
                    <div className="p-3.5 bg-slate-100 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#6C5CE7]" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Status</p>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full inline-block ${statusDotColor}`} />
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 capitalize">
                                {project.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Card */}
                <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-lg shadow-slate-900/2 dark:shadow-black/10 sm:col-span-2 flex flex-col justify-center">
                    <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-400 dark:text-slate-500 uppercase tracking-widest">Project Progress</span>
                        <span className="text-[#6C5CE7] dark:text-[#a29bfe]">{progressPercentage}% ({completedTasksCount}/{totalTasksCount} Tasks)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-950/40 h-2.5 rounded-full overflow-hidden border border-slate-200/20 dark:border-slate-800/40">
                        <div 
                            className="bg-gradient-to-r from-[#6C5CE7] to-[#8b7ff0] h-full rounded-full transition-[width] duration-500 shadow-inner" 
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Assigned Tasks — solid bg */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/20 overflow-hidden">
                <div className="px-6 py-4.5 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-slate-50/40 dark:bg-slate-900/40">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <ListTodo className="w-5 h-5 text-[#6C5CE7]" />
                        Assigned Tasks
                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md border border-slate-200/10">
                            {totalTasksCount}
                        </span>
                    </h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-black/5 dark:divide-white/5">
                        <thead className="bg-slate-50/50 dark:bg-slate-950/20">
                            <tr>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    Task Name
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    Priority
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    Status
                                </th>
                                <th scope="col" className="relative px-6 py-3.5">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-black/5 dark:divide-white/5">
                            {!project.tasks || project.tasks.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <ListTodo className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                                        <p className="text-base font-bold text-slate-900 dark:text-white">No Tasks Assigned Yet</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">Create a task to kickstart project execution and track milestones.</p>
                                    </td>
                                </tr>
                            ) : (
                                project.tasks.map((task) => (
                                    <TaskRow key={task.id} task={task} workspaceID={workspaceID} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Project Members & Project Teams side-by-side layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Project Members Panel — solid bg */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/20 flex flex-col overflow-hidden">
                    <div className="px-6 py-4.5 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-slate-50/40 dark:bg-slate-900/40">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#6C5CE7]" />
                            Project Members
                        </h2>
                        {canEdit && (
                            <button 
                                onClick={() => setIsAddProjectMemberModalOpen(true)}
                                className="inline-flex items-center gap-1.5 bg-[#6C5CE7] hover:bg-[#5a4ed1] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md hover:shadow-lg hover:shadow-primary/10 cursor-pointer active:scale-97"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                Add Member
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 divide-y divide-black/5 dark:divide-white/5 max-h-[400px] overflow-y-auto">
                        {!project.projectMembers || project.projectMembers.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                No project members found.
                            </div>
                        ) : (
                            project.projectMembers.map((member) => (
                                <MemberRow 
                                    key={member.id} 
                                    member={member}
                                    canEdit={canEdit}
                                    currentUserEmail={user?.email}
                                    onEdit={handleEditMember}
                                    onRemove={handleRemoveMember}
                                />
                            ))
                        )}
                    </div>
                </div>
 
                {/* Project Teams Panel — solid bg */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/20 flex flex-col overflow-hidden">
                    <div className="px-6 py-4.5 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-slate-50/40 dark:bg-slate-900/40">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#6C5CE7]" />
                            Project Teams
                        </h2>
                        {canEdit && (
                            <button 
                                onClick={() => setIsCreateTeamModalOpen(true)}
                                className="inline-flex items-center gap-1.5 bg-[#6C5CE7] hover:bg-[#5a4ed1] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md hover:shadow-lg hover:shadow-primary/10 cursor-pointer active:scale-97"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Create Team
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 max-h-[400px] overflow-y-auto">
                        {teamsLoading ? (
                            <div className="p-6 space-y-3">
                                <div className="h-12 bg-slate-100 dark:bg-slate-950/40 rounded-xl animate-pulse"></div>
                                <div className="h-12 bg-slate-100 dark:bg-slate-950/40 rounded-xl animate-pulse"></div>
                            </div>
                        ) : teamsError ? (
                            <div className="p-6 text-center text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200/20 text-xs font-semibold rounded-xl">
                                {teamsError}
                            </div>
                        ) : !teams || teams.length === 0 ? (
                            <div className="p-8 text-center">
                                <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                                <p className="text-sm font-bold text-slate-900 dark:text-white">No Teams in this Project</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[240px] mx-auto">Create sub-teams to organize project tasks and coordinate members.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-black/5 dark:divide-white/5">
                                {teams.map((team) => (
                                    <TeamAccordion 
                                        key={team.id} 
                                        team={team} 
                                        isExpanded={expandedTeamId === team.id}
                                        onToggle={() => setExpandedTeamId(expandedTeamId === team.id ? null : team.id)}
                                        canEdit={canEdit}
                                        onAddMember={handleAddTeamMember}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
 
            {/* Modals — ONLY mount when open (conditional rendering) */}
            {isCreateTaskModalOpen && (
                <CreateTaskModal
                    workspaceID={workspaceID}
                    projectID={projectID}
                    onClose={() => setIsCreateTaskModalOpen(false)}
                    onSuccess={fetchProjectDetails}
                />
            )}
 
            {isEditProjectModalOpen && (
                <EditProjectModal
                    isOpen={isEditProjectModalOpen}
                    onClose={() => setIsEditProjectModalOpen(false)}
                    project={project}
                    onSuccess={fetchProjectDetails}
                />
            )}
 
            {isAddProjectMemberModalOpen && (
                <AddProjectMemberModal
                    isOpen={isAddProjectMemberModalOpen}
                    onClose={() => setIsAddProjectMemberModalOpen(false)}
                    projectID={projectID}
                    availableWorkspaceMembers={availableWorkspaceMembers}
                    onSuccess={fetchProjectDetails}
                />
            )}

            {isAddTeamMemberModalOpen && (
                <AddTeamMemberModal
                    isOpen={isAddTeamMemberModalOpen}
                    onClose={() => setIsAddTeamMemberModalOpen(false)}
                    selectedTeamForAdd={selectedTeamForAdd}
                    availableProjectMembers={availableProjectMembers}
                    onSuccess={fetchTeams}
                />
            )}

            {isCreateTeamModalOpen && (
                <CreateTeamModal
                    isOpen={isCreateTeamModalOpen}
                    onClose={() => setIsCreateTeamModalOpen(false)}
                    projectID={projectID}
                    onSuccess={fetchTeams}
                />
            )}

            {isEditProjectMemberModalOpen && (
                <EditProjectMemberModal
                    isOpen={isEditProjectMemberModalOpen}
                    onClose={() => setIsEditProjectMemberModalOpen(false)}
                    projectID={projectID}
                    selectedProjectMemberForEdit={selectedProjectMemberForEdit}
                    onSuccess={fetchProjectDetails}
                />
            )}

            {isRemoveProjectMemberModalOpen && (
                <RemoveProjectMemberModal
                    isOpen={isRemoveProjectMemberModalOpen}
                    onClose={() => setIsRemoveProjectMemberModalOpen(false)}
                    projectID={projectID}
                    projectMemberToRemove={projectMemberToRemove}
                    onSuccess={() => {
                        fetchProjectDetails();
                        fetchTeams();
                    }}
                />
            )}
        </main>
    );
}
