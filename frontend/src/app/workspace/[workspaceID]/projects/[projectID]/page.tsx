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
    Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreateTaskModal from "@/components/forms/CreateTask";
import { useAuth } from "@/authContext/AuthContext";

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
}

interface Project {
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

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
    onSuccess: () => void;
}

function EditProjectModal({ isOpen, onClose, project, onSuccess }: EditProjectModalProps) {
    const [name, setName] = useState(project.name);
    const [field, setField] = useState(project.field);
    const [description, setDescription] = useState(project.description);
    const [status, setStatus] = useState(project.status || "active");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setName(project.name);
        setField(project.field);
        setDescription(project.description);
        setStatus(project.status || "active");
    }, [project]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/project/updateProject/${project.id}`, {
                name,
                field,
                description,
                status
            }, { withCredentials: true });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update project details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Edit Project Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm border border-red-200 dark:border-red-800 animate-pulse">
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] focus:border-transparent transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field / Category</label>
                        <input 
                            type="text" 
                            required
                            value={field}
                            onChange={e => setField(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] focus:border-transparent transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] focus:border-transparent transition-colors"
                        >
                            <option value="planning">Planning</option>
                            <option value="active">Active</option>
                            <option value="review">Review</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea 
                            required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] focus:border-transparent transition-colors resize-none"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#3C3489] hover:bg-[#251b72] rounded-md transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

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
    const [canEdit, setCanEdit] = useState(false);

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

    // Add Project Member Form States
    const [addProjectMemberUserId, setAddProjectMemberUserId] = useState<string>("");
    const [addProjectMemberRole, setAddProjectMemberRole] = useState<string>("member");
    const [addProjectMemberPosition, setAddProjectMemberPosition] = useState<string>("");
    const [addProjectMemberLoading, setAddProjectMemberLoading] = useState(false);
    const [addProjectMemberError, setAddProjectMemberError] = useState<string | null>(null);

    // Add Team Member Form States
    const [addTeamMemberUserId, setAddTeamMemberUserId] = useState<string>("");
    const [addTeamMemberRole, setAddTeamMemberRole] = useState<string>("member");
    const [addTeamMemberPosition, setAddTeamMemberPosition] = useState<string>("");
    const [addTeamMemberLoading, setAddTeamMemberLoading] = useState(false);
    const [addTeamMemberError, setAddTeamMemberError] = useState<string | null>(null);

    // Create Team Form States
    const [createTeamName, setCreateTeamName] = useState<string>("");
    const [createTeamLoading, setCreateTeamLoading] = useState(false);
    const [createTeamError, setCreateTeamError] = useState<string | null>(null);

    const router = useRouter();
    const authContext = useAuth();
    const user = authContext ? authContext.user : null;

    const checkUserRole = useCallback(async (projectData: Project) => {
        if (!user) return;
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/members/${workspaceID}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                const membersList = res.data.members;
                setWorkspaceMembers(membersList || []);
                const currentMember = membersList.find((m: any) => m.user?.email === user.email);
                if (currentMember) {
                    const isWorkspaceAdmin = ["admin", "owner"].includes(currentMember.role?.toLowerCase());
                    const projectMembers = projectData.projectMembers || [];
                    const isProjectAdmin = projectMembers.some(
                        (pm: any) => pm.userId === currentMember.userId && pm.role?.toLowerCase() === "admin"
                    );

                    if (isWorkspaceAdmin || isProjectAdmin) {
                        setCanEdit(true);
                    } else {
                        setCanEdit(false);
                    }
                }
            }
        } catch (err) {
            console.error("Error checking user role:", err);
        }
    }, [workspaceID, user]);

    const fetchProjectDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/project/singleProject/${projectID}`, 
                { withCredentials: true }
            );
            if (res.data.success || res.data.sucess === "true") {
                const projectData = res.data.project;
                setProject(projectData);
                checkUserRole(projectData);
            } else {
                setError(res.data.message || "Failed to load project details.");
            }
        } catch (err) {
            setError("An error occurred while fetching project details.");
        } finally {
            setLoading(false);
        }
    }, [projectID, checkUserRole]);

    const fetchTeams = useCallback(async () => {
        setTeamsLoading(true);
        setTeamsError(null);
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/team/project/${projectID}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                setTeams(res.data.teams || []);
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
    }, [fetchProjectDetails, fetchTeams]);

    const handleAddProjectMember = async () => {
        if (!addProjectMemberUserId) return;
        setAddProjectMemberLoading(true);
        setAddProjectMemberError(null);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/project/addProjectMember/${projectID}`,
                {
                    userId: Number(addProjectMemberUserId),
                    role: addProjectMemberRole,
                    position: addProjectMemberPosition || addProjectMemberRole
                },
                { withCredentials: true }
            );
            if (res.data.success) {
                setIsAddProjectMemberModalOpen(false);
                setAddProjectMemberUserId("");
                setAddProjectMemberRole("member");
                setAddProjectMemberPosition("");
                fetchProjectDetails();
            } else {
                setAddProjectMemberError(res.data.message || "Failed to add member to project.");
            }
        } catch (err: any) {
            setAddProjectMemberError(err.response?.data?.message || "Failed to add member to project.");
        } finally {
            setAddProjectMemberLoading(false);
        }
    };

    const handleAddTeamMember = async () => {
        if (!selectedTeamForAdd || !addTeamMemberUserId) return;
        setAddTeamMemberLoading(true);
        setAddTeamMemberError(null);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/team/addTeamMember/${selectedTeamForAdd.id}`,
                {
                    userId: Number(addTeamMemberUserId),
                    position: addTeamMemberPosition || addTeamMemberRole,
                    role: addTeamMemberRole
                },
                { withCredentials: true }
            );
            if (res.data.success) {
                setIsAddTeamMemberModalOpen(false);
                setAddTeamMemberUserId("");
                setAddTeamMemberRole("member");
                setAddTeamMemberPosition("");
                setSelectedTeamForAdd(null);
                fetchTeams();
            } else {
                setAddTeamMemberError(res.data.message || "Failed to add member to team.");
            }
        } catch (err: any) {
            setAddTeamMemberError(err.response?.data?.message || "Failed to add member to team.");
        } finally {
            setAddTeamMemberLoading(false);
        }
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createTeamName.trim()) return;
        setCreateTeamLoading(true);
        setCreateTeamError(null);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/team/createTeam/${projectID}`,
                {
                    teamName: createTeamName.trim()
                },
                { withCredentials: true }
            );
            if (res.data.team) {
                setIsCreateTeamModalOpen(false);
                setCreateTeamName("");
                fetchTeams();
            } else {
                setCreateTeamError("Failed to create team.");
            }
        } catch (err: any) {
            setCreateTeamError(err.response?.data?.message || err.response?.data?.error || "Failed to create team.");
        } finally {
            setCreateTeamLoading(false);
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return <ArrowUp className="w-4 h-4 text-red-500" />;
            case 'low': return <ArrowDown className="w-4 h-4 text-blue-500" />;
            case 'medium': 
            default: return <Minus className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 border border-green-200 dark:border-green-800/50';
            case 'in progress':
            case 'active': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-500 border border-blue-200 dark:border-blue-800/50';
            case 'review': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-800/50';
            case 'todo':
            case 'suspended':
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
        }
    };

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

    const completedTasksCount = project.tasks?.filter(t => t.status?.toLowerCase() === 'completed' || t.status?.toLowerCase() === 'done').length || 0;
    const totalTasksCount = project.tasks?.length || 0;
    const progressPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    // Filter workspace members for project inclusion modal
    const existingProjectUserIds = project.projectMembers?.map((pm: any) => pm.userId) || [];
    const availableWorkspaceMembers = workspaceMembers.filter(
        (wm: any) => wm.isActive && !existingProjectUserIds.includes(wm.userId)
    );

    // Filter project members for team inclusion modal
    const teamMemberIds = selectedTeamForAdd?.teamMembers?.map((tm: any) => tm.userId) || [];
    const availableProjectMembers = project.projectMembers?.filter(
        (pm: any) => !teamMemberIds.includes(pm.userId)
    ) || [];

    return (
        <main className="max-w-7xl mx-auto px-6 py-6 space-y-8">
            {/* Header */}
            <div>
                <Link 
                    href={`/workspace/${workspaceID}/projects`} 
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Projects
                </Link>
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary-light/10 text-primary-light rounded-lg border border-primary-light/20">
                                <FolderKanban className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white">
                                {project.name}
                            </h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-base mt-2">
                            {project.description}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                        {canEdit && (
                            <button 
                                onClick={() => setIsEditProjectModalOpen(true)}
                                className="flex items-center gap-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm cursor-pointer"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Project
                            </button>
                        )}
                        {canEdit && (
                            <button 
                                onClick={() => setIsCreateTaskModalOpen(true)}
                                className="flex items-center gap-2 bg-[#3C3489] hover:bg-[#251b72] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                Add Task
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-lg border border-outline-variant dark:border-gray-700 shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                        <Tag className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Field / Category</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{project.field}</p>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-lg border border-outline-variant dark:border-gray-700 shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                        <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Status</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusStyles(project.status)}`}>
                            {project.status}
                        </span>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-lg border border-outline-variant dark:border-gray-700 shadow-sm sm:col-span-2 flex flex-col justify-center">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Project Progress</span>
                        <span className="text-gray-500 dark:text-gray-400">{progressPercentage}% ({completedTasksCount}/{totalTasksCount})</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div 
                            className="bg-[#0D9488] h-full transition-all duration-500" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Assigned Tasks */}
            <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <ListTodo className="w-5 h-5 text-gray-400" />
                        Assigned Tasks
                    </h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Task Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-[#1e293b] divide-y divide-gray-200 dark:divide-gray-700">
                            {!project.tasks || project.tasks.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <ListTodo className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                                        <p className="text-base font-medium text-gray-900 dark:text-white">No tasks assigned</p>
                                        <p className="text-sm mt-1">Create a task to get started on this project.</p>
                                    </td>
                                </tr>
                            ) : (
                                project.tasks.map((task) => (
                                    <tr onClick={() => router.push(`/workspace/${workspaceID}/tasks/${task.id}`)} key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                {task.title}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-md">
                                                {task.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                                {getPriorityIcon(task.priority)}
                                                {task.priority || "Medium"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(task.status)}`}>
                                                {task.status?.toLowerCase() === 'completed' ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                                ) : (
                                                    <Circle className="w-3.5 h-3.5 mr-1.5 fill-current opacity-50" />
                                                )}
                                                {task.status || "Todo"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Project Members & Project Teams side-by-side layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Project Members Panel */}
                <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-400" />
                            Project Members
                        </h2>
                        {canEdit && (
                            <button 
                                onClick={() => {
                                    setAddProjectMemberUserId("");
                                    setAddProjectMemberRole("member");
                                    setAddProjectMemberPosition("");
                                    setAddProjectMemberError(null);
                                    setIsAddProjectMemberModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 bg-[#3C3489] hover:bg-[#251b72] text-white px-3 py-1.5 rounded-md font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                Add Member
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 divide-y divide-gray-100 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
                        {!project.projectMembers || project.projectMembers.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                No project members found.
                            </div>
                        ) : (
                            project.projectMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-light/10 text-primary font-medium text-xs border border-primary-light/20 flex items-center justify-center">
                                            {member.user?.name?.charAt(0).toUpperCase() || "?"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{member.user?.name || "Unknown User"}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                            {member.role?.toLowerCase() === "admin" && <Shield className="w-3 h-3 text-[#3C3489]" />}
                                            {member.role}
                                        </span>
                                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 capitalize">{member.position}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Project Teams Panel */}
                <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-400" />
                            Project Teams
                        </h2>
                        {canEdit && (
                            <button 
                                onClick={() => {
                                    setCreateTeamName("");
                                    setCreateTeamError(null);
                                    setIsCreateTeamModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 bg-[#3C3489] hover:bg-[#251b72] text-white px-3 py-1.5 rounded-md font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Create Team
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 max-h-[400px] overflow-y-auto">
                        {teamsLoading ? (
                            <div className="p-8 space-y-3">
                                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                            </div>
                        ) : teamsError ? (
                            <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-900/10 text-xs">
                                {teamsError}
                            </div>
                        ) : !teams || teams.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <p className="text-sm font-medium">No teams in this project yet.</p>
                                <p className="text-xs mt-1 text-gray-400">Create a team to organize project members.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {teams.map((team) => (
                                    <div key={team.id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                        <div 
                                            className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                                            onClick={() => setExpandedTeamId(expandedTeamId === team.id ? null : team.id)}
                                        >
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{team.teamName}</h4>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{team.teamMembers?.length || 0} members</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {canEdit && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedTeamForAdd(team);
                                                            setAddTeamMemberUserId("");
                                                            setAddTeamMemberPosition("");
                                                            setAddTeamMemberRole("member");
                                                            setAddTeamMemberError(null);
                                                            setIsAddTeamMemberModalOpen(true);
                                                        }}
                                                        className="p-1 text-[#3C3489] hover:bg-[#3C3489]/10 rounded-md transition-all cursor-pointer"
                                                        title="Add Member to Team"
                                                    >
                                                        <UserPlus className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedTeamId === team.id ? "rotate-180" : ""}`} />
                                            </div>
                                        </div>
                                        
                                        <AnimatePresence>
                                            {expandedTeamId === team.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-gray-50/30 dark:bg-gray-900/10 border-t border-gray-100 dark:border-gray-700"
                                                >
                                                    <div className="p-3 space-y-2">
                                                        {team.teamMembers && team.teamMembers.length > 0 ? (
                                                            team.teamMembers.map((tm: any) => (
                                                                <div key={tm.id} className="flex items-center justify-between p-2 hover:bg-white dark:hover:bg-gray-800 rounded-md border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-6 h-6 rounded-full bg-primary-light/10 text-primary font-medium text-[10px] flex items-center justify-center">
                                                                            {tm.user?.name?.charAt(0).toUpperCase() || "?"}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-medium text-gray-900 dark:text-white">{tm.user?.name}</p>
                                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">{tm.user?.email}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right flex flex-col items-end">
                                                                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                                            {tm.role}
                                                                        </span>
                                                                        <span className="text-[10px] text-gray-750 dark:text-gray-300 capitalize">{tm.position}</span>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 py-3">No members in this team.</p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Task Creation Modal */}
            {isCreateTaskModalOpen && (
                <CreateTaskModal
                    workspaceID={workspaceID}
                    projectID={projectID}
                    onClose={() => setIsCreateTaskModalOpen(false)}
                    onSuccess={fetchProjectDetails}
                />
            )}

            {/* Edit Project Details Modal */}
            {isEditProjectModalOpen && (
                <EditProjectModal
                    isOpen={isEditProjectModalOpen}
                    onClose={() => setIsEditProjectModalOpen(false)}
                    project={project}
                    onSuccess={fetchProjectDetails}
                />
            )}

            {/* Add Project Member Modal */}
            {isAddProjectMemberModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-[#3C3489]" />
                                Add Project Member
                            </h3>
                            <button onClick={() => setIsAddProjectMemberModalOpen(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {addProjectMemberError && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm border border-red-200 dark:border-red-800">
                                    {addProjectMemberError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Workspace Member</label>
                                <select 
                                    value={addProjectMemberUserId}
                                    onChange={e => setAddProjectMemberUserId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] transition-colors"
                                >
                                    <option value="">-- Choose a Workspace Member --</option>
                                    {availableWorkspaceMembers.map((m) => (
                                        <option key={m.userId} value={m.userId}>
                                            {m.user?.name} ({m.user?.email})
                                        </option>
                                    ))}
                                </select>
                                {availableWorkspaceMembers.length === 0 && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No other active workspace members available to add.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Role</label>
                                <select
                                    value={addProjectMemberRole}
                                    onChange={e => setAddProjectMemberRole(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] transition-colors"
                                >
                                    <option value="member">Member</option>
                                    <option value="tester">Tester</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position / Title</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Lead QA, Designer, Developer"
                                    value={addProjectMemberPosition}
                                    onChange={e => setAddProjectMemberPosition(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] transition-colors"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button 
                                    onClick={() => setIsAddProjectMemberModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddProjectMember}
                                    disabled={addProjectMemberLoading || !addProjectMemberUserId}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#3C3489] hover:bg-[#251b72] rounded-md transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                                >
                                    {addProjectMemberLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                                    {addProjectMemberLoading ? "Adding..." : "Add Member"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Team Member Modal */}
            {isAddTeamMemberModalOpen && selectedTeamForAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-[#3C3489]" />
                                Add Member to {selectedTeamForAdd.teamName}
                            </h3>
                            <button onClick={() => setIsAddTeamMemberModalOpen(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {addTeamMemberError && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm border border-red-200 dark:border-red-800">
                                    {addTeamMemberError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Project Member</label>
                                <select 
                                    value={addTeamMemberUserId}
                                    onChange={e => setAddTeamMemberUserId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] transition-colors"
                                >
                                    <option value="">-- Choose a Project Member --</option>
                                    {availableProjectMembers.map((m) => (
                                        <option key={m.userId} value={m.userId}>
                                            {m.user?.name} ({m.user?.email})
                                        </option>
                                    ))}
                                </select>
                                {availableProjectMembers.length === 0 && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No other project members available to join this team.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Role</label>
                                <select
                                    value={addTeamMemberRole}
                                    onChange={e => setAddTeamMemberRole(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] transition-colors"
                                >
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                    <option value="viewer">Viewer</option>
                                    <option value="tester">Tester</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position / Title</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Lead Developer, QA Lead"
                                    value={addTeamMemberPosition}
                                    onChange={e => setAddTeamMemberPosition(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] transition-colors"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button 
                                    onClick={() => setIsAddTeamMemberModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddTeamMember}
                                    disabled={addTeamMemberLoading || !addTeamMemberUserId}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#3C3489] hover:bg-[#251b72] rounded-md transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                                >
                                    {addTeamMemberLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                                    {addTeamMemberLoading ? "Adding..." : "Add to Team"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Project Team Modal */}
            {isCreateTeamModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                <Plus className="w-5 h-5 text-[#3C3489]" />
                                Create Project Team
                            </h3>
                            <button onClick={() => setIsCreateTeamModalOpen(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateTeam} className="p-6 space-y-4">
                            {createTeamError && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm border border-red-200 dark:border-red-800 animate-pulse">
                                    {createTeamError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Name</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Design Team, Frontend Core"
                                    value={createTeamName}
                                    onChange={e => setCreateTeamName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3C3489] transition-colors"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsCreateTeamModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={createTeamLoading || !createTeamName.trim()}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#3C3489] hover:bg-[#251b72] rounded-md transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                                >
                                    {createTeamLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                                    {createTeamLoading ? "Creating..." : "Create Team"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
