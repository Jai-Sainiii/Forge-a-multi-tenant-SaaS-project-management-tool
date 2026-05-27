"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import axios from "axios";

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectID: string;
    onSuccess: () => void;
}

export default function CreateTeamModal({ isOpen, onClose, projectID, onSuccess }: CreateTeamModalProps) {
    const [teamName, setTeamName] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamName.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/team/createTeam/${projectID}`,
                {
                    teamName: teamName.trim()
                },
                { withCredentials: true }
            );
            if (res.data.team) {
                onSuccess();
                onClose();
            } else {
                setError("Failed to create team.");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || "Failed to create team.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 ease-out">
                <div className="px-6 py-4.5 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Plus className="w-5 h-5 text-[#6C5CE7]" />
                        Create Project Team
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-md text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-955/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold border border-red-250/20 dark:border-red-900/20">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider mb-1.5">Team Name</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g. Design Team, Frontend Core"
                            value={teamName}
                            onChange={e => setTeamName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-405 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all text-sm font-medium"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-black/5 dark:border-white/5">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-355 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading || !teamName.trim()}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#6C5CE7] hover:bg-[#5a4ed1] rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-97"
                        >
                            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            {loading ? "Creating..." : "Create Team"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
