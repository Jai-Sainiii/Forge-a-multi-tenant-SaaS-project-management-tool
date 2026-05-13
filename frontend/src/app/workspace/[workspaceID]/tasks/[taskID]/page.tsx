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
    ExternalLink
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface TaskMember {
    user: {
        id: number;
        name: string;
        email: string;
    }
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
    params
}: {
    params: Promise<{ workspaceID: string, taskID: string }>
}) {
    const { workspaceID, taskID } = use(params);
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Submission State
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [submissionType, setSubmissionType] = useState('link');
    const [submittedContent, setSubmittedContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchTaskDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/task/${taskID}`, 
                { withCredentials: true }
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

    const handleSubmitTask = async () => {
        if (!submittedContent.trim()) return;
        setSubmitting(true);
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/submit/${taskID}`, {
                submittionType: submissionType,
                submittedTextorLink: submittedContent
            }, { withCredentials: true });
            
            if (res.data.success || res.data.sucess === "true") {
                setIsSubmitModalOpen(false);
                fetchTaskDetails();
            }
        } catch (error) {
            console.error("Failed to submit task", error);
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        fetchTaskDetails();
    }, [fetchTaskDetails]);

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
                    <button onClick={fetchTaskDetails} className="ml-auto px-3 py-1 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
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
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(task.status)}`}>
                                {task.status?.toLowerCase() === 'completed' ? (
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
                        {task.status?.toLowerCase() !== 'completed' && task.status?.toLowerCase() !== 'review' && (
                            <button 
                                onClick={() => setIsSubmitModalOpen(true)}
                                className="flex items-center gap-2 bg-[#3C3489] hover:bg-[#251b72] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm cursor-pointer"
                            >
                                <Send className="w-4 h-4" />
                                Submit for Review
                            </button>
                        )}
                        <button className="flex items-center gap-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm cursor-pointer">
                            <Edit className="w-4 h-4" />
                            Edit Task
                        </button>
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
                                    Type: {task.submittionType || 'Unknown'}
                                </p>
                                {task.submittionType === 'link' ? (
                                    <a 
                                        href={task.submittedTextorLink.startsWith('http') ? task.submittedTextorLink : `https://${task.submittedTextorLink}`} 
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
                                {task.createdAt ? new Date(task.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : "Unknown"}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Submit for Review</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Submission Type</label>
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
                                    {submissionType === 'link' ? "Submission Link" : "Submission Text"}
                                </label>
                                {submissionType === 'link' ? (
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
        </main>
    );
}
