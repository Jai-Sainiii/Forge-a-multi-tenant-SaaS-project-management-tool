"use client";
import { use, useState, useEffect, useCallback } from "react";
import { FolderArchive, ChevronRight, MoreHorizontal, AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface Project {
  id: number;
  name: string;
  field: string;
  description: string;
  status: string;
  workspaceId: number;
}

function ProjectCard({ project, workspaceID }: { project: Project, workspaceID: string }) {
    const isReview = project.status?.toLowerCase() === 'review';
    const isSuspended = project.status?.toLowerCase() === 'suspended';
    const isPlanning = project.status?.toLowerCase() === 'planning';
    const active = project.status?.toLowerCase() === 'active';
    
    let badgeClass = "bg-secondary-light text-secondary";
    if (isReview) badgeClass = "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500";
    else if (isSuspended) badgeClass = "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
    else if (isPlanning) badgeClass = "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-500";
    else if (active) badgeClass = "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500";
    
    let badgeText = project.status || 'Unknown';
    if (badgeText) badgeText = badgeText.charAt(0).toUpperCase() + badgeText.slice(1);
    let opacityClass = isSuspended ? "opacity-75" : "";

    return (
        <Link href={`/workspace/${workspaceID}/projects/${project.id}`}>
        <div className={`p-4 bg-white dark:bg-[#1e293b] border border-outline-variant dark:border-gray-700 rounded-lg flex flex-col gap-4 shadow-sm ${opacityClass}`}>
            <div className="flex justify-between items-start">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>{badgeText}</span>
                <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{project.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{project.field}</p>
            </div>
            <div className="space-y-1.5 mt-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Progress</span>
                    <span>0%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-light h-full w-[0%]"></div>
                </div>
            </div>
        </div>
        </Link>
    );
}

function ProjectSkeleton() {
    return (
        <div className="p-4 bg-white dark:bg-[#1e293b] border border-outline-variant dark:border-gray-700 rounded-lg flex flex-col gap-4 shadow-sm animate-pulse">
            <div className="flex justify-between items-start">
                <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div>
                <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-1.5 mt-2">
                <div className="flex justify-between text-xs">
                    <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-8 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden"></div>
            </div>
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
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/project/createProject`, {
                name,
                field,
                description,
                status,
                workspaceId: Number(workspaceID)
            }, { withCredentials: true });
            onSuccess();
            onClose();
            setName("");
            setField("");
            setDescription("");
            setStatus("active");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">New Project</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm border border-red-200 dark:border-red-800">
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
                            placeholder="e.g. Website Redesign"
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
                            placeholder="e.g. Design, Engineering"
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
                            placeholder="Briefly describe this project..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#3C3489] hover:bg-[#251b72] rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? "Creating..." : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ProjectsPage({params}: {params: Promise<{ workspaceID: string }>}) {
    const { workspaceID } = use(params);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/project/getProjects/${workspaceID}`, {
                withCredentials: true,
            });
            setProjects(res.data.projects);
            console.log(res.data)
        } catch (err) {
            setError("Failed to load projects. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [workspaceID]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const activeProjects = (projects || []).filter(p => p.status?.toLowerCase() === 'active');
    const reviewProjects = (projects || []).filter(p => p.status?.toLowerCase() === 'review');
    const suspendedProjects = (projects || []).filter(p => p.status?.toLowerCase() === 'suspended');
    const planningProjects = (projects || []).filter(p => p.status?.toLowerCase() === 'planning');
    
    const activeProjectIds = new Set([...activeProjects, ...reviewProjects, ...suspendedProjects, ...planningProjects].map(p => p.id));
    const otherProjects = (projects || []).filter(p => !activeProjectIds.has(p.id));
    const hasActiveProjects = activeProjectIds.size > 0;

    return (
        <main className="max-w-7xl mx-auto px-6 py-6 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant dark:border-gray-700 pb-4">
                <div>
                    <h1 className="text-2xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <FolderArchive className="w-6 h-6 text-primary-light" />
                        Projects
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Manage your workspace projects.
                    </p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-[#3C3489] hover:bg-[#251b72] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />
                    New Project
                </button>
            </div>

            <CreateProjectModal 
                isOpen={showAddModal} 
                onClose={() => setShowAddModal(false)} 
                workspaceID={workspaceID}
                onSuccess={fetchProjects}
            />
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 text-red-700 dark:text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                    <button onClick={fetchProjects} className="ml-auto px-3 py-1 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                        Retry
                    </button>
                </div>
            )}

            {/* Active Projects Section */}
            <section className="space-y-8">
                <div className="flex justify-between items-center border-b border-outline-variant dark:border-gray-700 pb-2">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-white">Active Projects</h2>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => <ProjectSkeleton key={i} />)}
                        </div>
                    </div>
                ) : projects.length === 0 && !error ? (
                     <div className="py-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                        <FolderArchive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No projects yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Get started by creating a new project in this workspace.</p>
                     </div>
                ) : (
                    <>
                        {!hasActiveProjects && projects.length > 0 && !error && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No active projects at the moment.</p>
                        )}
                        
                        {/* In Progress */}
                        {activeProjects.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Active Projects</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {activeProjects.map(project => (
                                        <ProjectCard key={project.id} project={project} workspaceID={workspaceID} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Review */}
                        {reviewProjects.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Review</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {reviewProjects.map(project => (
                                        <ProjectCard key={project.id} project={project} workspaceID={workspaceID} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suspended */}
                        {suspendedProjects.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Suspended</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {suspendedProjects.map(project => (
                                        <ProjectCard key={project.id} project={project} workspaceID={workspaceID} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Other Projects Section */}
            {otherProjects.length > 0 && !loading && (
                <section className="space-y-4">
                    <div className="flex justify-between items-center border-b border-outline-variant dark:border-gray-700 pb-2">
                        <h2 className="text-xl font-medium text-gray-900 dark:text-white">Other Projects</h2>
                        <button className="text-primary-light font-medium flex items-center gap-1 hover:text-primary transition-colors text-sm cursor-pointer">
                            View all <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {otherProjects.map(project => (
                            <ProjectCard key={project.id} project={project} workspaceID={workspaceID} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}