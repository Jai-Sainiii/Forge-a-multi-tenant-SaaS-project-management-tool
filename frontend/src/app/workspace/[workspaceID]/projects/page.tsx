"use client";
import { use, useState, useEffect, useCallback } from "react";
import { FolderArchive, ChevronRight, MoreHorizontal, AlertCircle } from "lucide-react";
import axios from "axios";

interface Project {
  id: number;
  name: string;
  field: string;
  description: string;
  status: string;
  workspaceId: number;
}

function ProjectCard({ project }: { project: Project }) {
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

export default function ProjectsPage({params}: {params: Promise<{ workspaceID: string }>}) {
    const { workspaceID } = use(params);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        <main className="max-w-7xl mx-auto px-6 py-6 space-y-12">
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
                                        <ProjectCard key={project.id} project={project} />
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
                                        <ProjectCard key={project.id} project={project} />
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
                                        <ProjectCard key={project.id} project={project} />
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
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}