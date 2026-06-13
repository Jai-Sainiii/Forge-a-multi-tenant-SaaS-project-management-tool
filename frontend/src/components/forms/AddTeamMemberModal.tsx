"use client";

import { useState } from "react";
import { UserPlus, X, Loader2 } from "lucide-react";
import { addTeamMember } from "@/app/actions/team";

interface AddTeamMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTeamForAdd: any;
    availableProjectMembers: any[];
    onSuccess: () => void;
}

export default function AddTeamMemberModal({ isOpen, onClose, selectedTeamForAdd, availableProjectMembers, onSuccess }: AddTeamMemberModalProps) {
    const [userId, setUserId] = useState<string>("");
    const [role, setRole] = useState<string>("member");
    const [position, setPosition] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !selectedTeamForAdd) return null;

    const handleAdd = async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const result = await addTeamMember(selectedTeamForAdd.id, {
                userId: Number(userId),
                position: position || role,
                role
            });
            if (result.success) {
                onSuccess();
                onClose();
            } else {
                setError(result.message || "Failed to add member to team.");
            }
        } catch {
            setError("Failed to add member to team.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 ease-out">
                <div className="px-6 py-4.5 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-black dark:text-white" />
                        Add to {selectedTeamForAdd.teamName}
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-md text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-955/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold border border-red-200/20 dark:border-red-900/20">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider mb-1.5">Select Project Member</label>
                        <select 
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm font-medium cursor-pointer"
                        >
                            <option value="">-- Choose a Project Member --</option>
                            {availableProjectMembers.map((m) => (
                                <option key={m.userId} value={m.userId}>
                                    {m.user?.name} ({m.user?.email})
                                </option>
                            ))}
                        </select>
                        {availableProjectMembers.length === 0 && (
                            <p className="text-[11px] text-slate-400 dark:text-slate-550 mt-1.5 font-medium">No other project members available to join this team.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider mb-1.5">Team Role</label>
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm font-medium cursor-pointer"
                        >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                            <option value="viewer">Viewer</option>
                            <option value="tester">Tester</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider mb-1.5">Position / Title</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Lead Developer, QA Lead"
                            value={position}
                            onChange={e => setPosition(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm font-medium"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-black/5 dark:border-white/5">
                        <button 
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-355 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleAdd}
                            disabled={loading || !userId}
                            className="px-5 py-2.5 text-sm font-semibold text-white dark:text-black bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-97"
                        >
                            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            {loading ? "Adding..." : "Add to Team"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
