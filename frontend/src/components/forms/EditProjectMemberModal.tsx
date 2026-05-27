"use client";

import { useState, useEffect } from "react";
import { Shield, X, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";

interface EditProjectMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectID: string;
    selectedProjectMemberForEdit: any;
    onSuccess: () => void;
}

export default function EditProjectMemberModal({ isOpen, onClose, projectID, selectedProjectMemberForEdit, onSuccess }: EditProjectMemberModalProps) {
    const [role, setRole] = useState<string>("member");
    const [position, setPosition] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedProjectMemberForEdit) {
            setRole(selectedProjectMemberForEdit.role || "member");
            setPosition(selectedProjectMemberForEdit.position || "");
        }
    }, [selectedProjectMemberForEdit]);

    if (!isOpen || !selectedProjectMemberForEdit) return null;

    const handleUpdate = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL}/project/updateProjectMember/${projectID}/${selectedProjectMemberForEdit.userId}`,
                {
                    role,
                    position
                },
                { withCredentials: true }
            );
            if (res.data.success) {
                onSuccess();
                onClose();
            } else {
                setError(res.data.message || "Failed to update project member.");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update project member.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 ease-out">
                <div className="px-6 py-4.5 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
                    <h3 className="text-base font-bold text-[#6C5CE7] flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Edit Project Member
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/45 rounded-xl">
                        <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#8b7ff0] text-white font-bold text-sm flex items-center justify-center shadow-md shrink-0 select-none">
                            {selectedProjectMemberForEdit.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">
                                {selectedProjectMemberForEdit.user?.name}
                            </h4>
                            <p className="text-xs text-slate-400 dark:text-slate-555 mt-0.5">
                                {selectedProjectMemberForEdit.user?.email}
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider mb-2">
                            Position / Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Lead Developer, QA Lead"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-955/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all text-sm font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider mb-2">
                            Project Role
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {["member", "admin", "viewer", "tester"].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer capitalize ${
                                        role === r
                                            ? "bg-[#6C5CE7] text-white border-transparent shadow-md"
                                            : "bg-slate-50/50 dark:bg-slate-950/40 text-slate-650 dark:text-slate-400 border-slate-200 dark:border-slate-805 hover:bg-slate-100 dark:hover:bg-slate-900"
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
                            {role === "admin" && "Project Admins can create tasks, assign roles, and manage members."}
                            {role === "member" && "Members can participate fully and receive task assignments."}
                            {role === "viewer" && "Viewers have read-only access to this project."}
                            {role === "tester" && "Testers can manage submission statuses and logs."}
                        </p>
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
                            onClick={handleUpdate}
                            disabled={loading}
                            className="bg-[#6C5CE7] hover:bg-[#5a4ed1] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-97"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
