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
    MoreHorizontal
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreateTaskModal from "@/components/forms/CreateTask";
import { useAuth } from "@/authContext/AuthContext";
import { th } from "framer-motion/client";

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

    useEffect(() => {
        fetchProjectDetails();
    }, [fetchProjectDetails]);

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

    const completedTasksCount = project.tasks?.filter(t => t.status?.toLowerCase() === 'completed').length || 0;
    const totalTasksCount = project.tasks?.length || 0;
    const progressPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    return (
        <main className="max-w-7xl mx-auto px-6 py-6 space-y-8">
           
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
                        <button 
                            onClick={() => setIsCreateTaskModalOpen(true)}
                            className="flex items-center gap-2 bg-[#3C3489] hover:bg-[#251b72] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Add Task
                        </button>
                    </div>
                </div>
            </div>

            
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
        </main>
    );
}
