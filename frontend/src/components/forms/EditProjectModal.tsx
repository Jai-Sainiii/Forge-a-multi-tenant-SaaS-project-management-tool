"use client";

import { useState, useEffect } from "react";
import { FolderKanban, X } from "lucide-react";
import axios from "axios";
import type { Project } from "@/app/workspace/[workspaceID]/projects/[projectID]/page";

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
    onSuccess: () => void;
}

export default function EditProjectModal({ isOpen, onClose, project, onSuccess }: EditProjectModalProps) {
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
        <div 
            onClick={(e) => e.target === e.currentTarget && onClose()}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-in fade-in duration-200"
        >
            <div 
                className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 ease-out"
            >
                <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FolderKanban className="w-5 h-5 text-[#6C5CE7]" />
                        Edit Project Details
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-955/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-sm border border-red-200/50 dark:border-red-900/30 font-medium">
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider mb-1.5">Project Name</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:border-transparent transition-all text-sm font-medium"
                            placeholder="e.g. Mobile Application App"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider mb-1.5">Field / Category</label>
                        <input 
                            type="text" 
                            required
                            value={field}
                            onChange={e => setField(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:border-transparent transition-all text-sm font-medium"
                            placeholder="e.g. Engineering, Design"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider mb-1.5">Status</label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:border-transparent transition-all text-sm font-medium cursor-pointer"
                        >
                            <option value="planning">Planning</option>
                            <option value="active">Active</option>
                            <option value="review">Review</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea 
                            required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:border-transparent transition-all resize-none text-sm font-medium"
                            placeholder="Describe the scope and deliverables..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-black/5 dark:border-white/5">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#6C5CE7] hover:bg-[#5a4ed1] rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-97"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
