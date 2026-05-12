"use client";
import { use, useState, useEffect, useCallback } from "react";
import { Search, MoreHorizontal, AlertCircle, ListTodo, Plus, Circle, CheckCircle2, ArrowUp, ArrowDown, Minus } from "lucide-react";
import axios from "axios";

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    projectId: number;
    workspaceId: number;
    priority: string;
    createdAt: string;
    updatedAt: string;
    project?: {
        name: string;
    };
}

export default function TasksPage({params}: {params: Promise<{ workspaceID: string }>}) {
    const { workspaceID } = use(params);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/${workspaceID}`, {
                withCredentials: true,
            });
            if (res.data.success) {
                setTasks(res.data.tasks);
            } else {
                setError(res.data.message || "Failed to load tasks.");
            }
        } catch (err) {
            setError("Failed to load tasks. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [workspaceID]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (task.project?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            case 'in progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-500 border border-blue-200 dark:border-blue-800/50';
            case 'todo':
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
        }
    };

    return (
        <main className="max-w-7xl mx-auto px-6 py-6 space-y-8">
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 text-red-700 dark:text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                    <button onClick={fetchTasks} className="ml-auto px-3 py-1 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                        Retry
                    </button>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant dark:border-gray-700 pb-4">
                <div>
                    <h1 className="text-2xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <ListTodo className="w-6 h-6 text-primary-light" />
                        Tasks
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Manage and track tasks across all projects in this workspace.
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-[#3C3489] hover:bg-[#251b72] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />
                    Create Task
                </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks or projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#3C3489] focus:border-[#3C3489] sm:text-sm transition-colors"
                    />
                </div>
                {!loading && !error && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Task Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Project
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
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                            <div className="h-3 w-32 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-md inline-block"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                                        <ListTodo className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                        <p className="text-base font-medium text-gray-900 dark:text-white">No tasks found</p>
                                        <p className="text-sm mt-1">Get started by creating your first task.</p>
                                        <button className="mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            Create Task
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                filteredTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                {task.title}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-md">
                                                {task.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded w-fit">
                                                {task.project?.name || "No Project"}
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
        </main>
    );
}
