"use client";

import { useState } from "react";
import { UserMinus, X, AlertCircle, Loader2 } from "lucide-react";
import { removeProjectMember } from "@/app/actions/project";

interface RemoveProjectMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectID: string;
    projectMemberToRemove: any;
    onSuccess: () => void;
}

export default function RemoveProjectMemberModal({ isOpen, onClose, projectID, projectMemberToRemove, onSuccess }: RemoveProjectMemberModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !projectMemberToRemove) return null;

    const handleRemove = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await removeProjectMember(
                projectID,
                projectMemberToRemove.userId
            );
            if (result.success) {
                onSuccess();
                onClose();
            } else {
                setError(result.message || "Failed to remove member.");
            }
        } catch {
            setError("Failed to remove project member.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 ease-out">
                <div className="px-6 py-4.5 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
                    <h3 className="text-base font-bold text-red-655 dark:text-red-400 flex items-center gap-2">
                        <UserMinus className="w-5 h-5" />
                        Remove from Project
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-355 leading-relaxed">
                        Are you sure you want to remove <strong className="text-slate-800 dark:text-white font-bold">{projectMemberToRemove.user?.name}</strong> (<em className="text-slate-500 dark:text-slate-400">{projectMemberToRemove.user?.email}</em>) from this project?
                    </p>

                    <div className="flex items-start gap-3 text-red-650 dark:text-red-400 text-xs bg-red-500/10 p-3.5 rounded-xl border border-red-500/20 font-medium">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-red-500" />
                        <span>
                            This action is permanent. The user will be automatically removed from all sub-teams and task assignments within this project.
                        </span>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-955/20 p-3.5 rounded-xl border border-red-200/20 dark:border-red-900/20">
                            <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-500" />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-350 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRemove}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-97"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Removing...
                                </>
                            ) : (
                                "Remove Member"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
