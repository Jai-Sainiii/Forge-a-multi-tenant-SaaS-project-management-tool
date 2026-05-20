"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
    Settings, 
    Lock, 
    Save, 
    Trash2, 
    Loader2, 
    CheckCircle2, 
    AlertTriangle, 
    ArrowLeft,
    Globe,
    Building2,
    Text,
    ShieldAlert
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/authContext/AuthContext";

export default function SettingsPage({
    params,
}: {
    params: Promise<{ workspaceID: string }>;
}) {
    const { workspaceID } = use(params);
    const router = useRouter();
    const authContext = useAuth();
    const currentUser = authContext ? authContext.user : null;

    // Permissions State
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    // Form States
    const [title, setTitle] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [describtion, setDescribtion] = useState("");
    const [visibility, setVisibility] = useState("public");
    
    const [originalTitle, setOriginalTitle] = useState("");

    // Action Feedback
    const [updating, setUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Delete Confirmation modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState("");
    const [deleting, setDeleting] = useState(false);

    // Check Role Access Protection
    const checkRoleAccess = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/members/${workspaceID}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                const membersList = res.data.members;
                const currentMember = membersList.find(
                    (m: any) => m.user?.email === currentUser.email
                );
                
                if (currentMember && currentMember.role?.toLowerCase() === "owner") {
                    setIsOwner(true);
                } else {
                    setIsOwner(false);
                }
            }
        } catch (err) {
            console.error("Error validating workspace settings permissions:", err);
            setIsOwner(false);
        } finally {
            setLoading(false);
        }
    }, [workspaceID, currentUser]);

    useEffect(() => {
        checkRoleAccess();
    }, [checkRoleAccess]);

    // Fetch original details
    useEffect(() => {
        const fetchWorkspaceInfo = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/workspace/${workspaceID}`,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    const ws = res.data.workspaceData?.workspace;
                    if (ws) {
                        setTitle(ws.title || "");
                        setCompanyName(ws.companyname || "");
                        setDescribtion(ws.describtion || "");
                        setVisibility(ws.visibility || "public");
                        setOriginalTitle(ws.title || "");
                    }
                }
            } catch (err) {
                console.error("Error fetching workspace details:", err);
            }
        };

        if (isOwner) {
            fetchWorkspaceInfo();
        }
    }, [workspaceID, isOwner]);

    // Handle Save General Info
    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL}/workspace/updateWorkSpace/${workspaceID}`,
                {
                    title,
                    companyname: companyName,
                    describtion,
                    visibility
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                setSuccessMessage("Workspace settings updated successfully!");
                setOriginalTitle(title);
                setTimeout(() => setSuccessMessage(null), 4000);
            } else {
                setErrorMessage(res.data.message || "Failed to update settings.");
            }
        } catch (err: any) {
            console.error("Workspace save error:", err);
            setErrorMessage(
                err.response?.data?.message || "An error occurred while saving changes."
            );
        } finally {
            setUpdating(false);
        }
    };

    // Handle Workspace Deletion
    const handleDeleteWorkspace = async () => {
        if (confirmTitle !== originalTitle) {
            setErrorMessage("Workspace name confirmation does not match.");
            return;
        }

        setDeleting(true);
        setErrorMessage(null);

        try {
            const res = await axios.delete(
                `${process.env.NEXT_PUBLIC_BASE_URL}/workspace/deleteWorkSpace/${workspaceID}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setShowDeleteModal(false);
                router.push("/workspace");
            } else {
                setErrorMessage(res.data.message || "Failed to delete workspace.");
                setDeleting(false);
            }
        } catch (err: any) {
            console.error("Workspace delete error:", err);
            setErrorMessage(
                err.response?.data?.message || "An error occurred while deleting workspace."
            );
            setDeleting(false);
        }
    };

    // 1. Loading Shimmer
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin" />
                <p className="text-gray-400 text-sm font-medium animate-pulse">
                    Verifying workspace administrative credentials...
                </p>
            </div>
        );
    }

    // 2. Access Denied Screen (Strict Owner protection)
    if (!isOwner) {
        return (
            <main className="max-w-xl mx-auto px-6 py-16 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 mb-2">
                    <Lock className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Access Restricted
                </h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm leading-relaxed">
                    This workspace settings configuration is protected and can only be accessed by the **Workspace Owner**.
                </p>
                <button
                    onClick={() => router.push(`/workspace/${workspaceID}`)}
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>
            </main>
        );
    }

    // 3. Render Settings View for Owners
    return (
        <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Settings className="w-6 h-6 text-[#6C5CE7]" />
                    Workspace Settings
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5">
                    Update workspace details, configure visibility controls, and manage administrative settings.
                </p>
            </div>

            {/* Notification Alerts */}
            {successMessage && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm px-4 py-3 rounded-lg animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm px-4 py-3 rounded-lg animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {/* General Info Card */}
                <form onSubmit={handleSaveChanges} className="bg-white dark:bg-[#111112] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            General Information
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Set up the baseline identity of your team workspace.
                        </p>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Workspace Title */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Workspace Name
                            </label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] outline-none text-sm text-gray-900 dark:text-white px-3.5 py-2 rounded-lg transition-colors"
                                required
                            />
                        </div>

                        {/* Company Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Company Name
                            </label>
                            <input 
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] outline-none text-sm text-gray-900 dark:text-white px-3.5 py-2 rounded-lg transition-colors"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Description
                            </label>
                            <textarea 
                                rows={4}
                                value={describtion}
                                onChange={(e) => setDescribtion(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] outline-none text-sm text-gray-900 dark:text-white px-3.5 py-2 rounded-lg transition-colors resize-none"
                                required
                            />
                        </div>

                        {/* Visibility settings */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Globe className="w-3 h-3 text-gray-400" />
                                Workspace Visibility
                            </label>
                            <select 
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] outline-none text-sm text-gray-900 dark:text-white px-3 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                                <option value="public">Public (Anyone can search and request to join)</option>
                                <option value="private">Private (Invite-only access)</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-[#181819] border-t border-gray-200 dark:border-gray-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={updating}
                            className="inline-flex items-center gap-2 bg-[#6C5CE7] hover:bg-[#5b4cd8] disabled:bg-[#6C5CE7]/60 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer"
                        >
                            {updating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </form>

                {/* Danger Zone Card */}
                <div className="bg-white dark:bg-[#111112] border border-rose-500/20 dark:border-rose-950 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-rose-500/10 dark:border-rose-950/20 bg-rose-500/[0.02]">
                        <h2 className="text-lg font-medium text-rose-600 dark:text-rose-500 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" />
                            Danger Zone
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Irreversible configurations. Use extreme caution.
                        </p>
                    </div>

                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Delete this workspace
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
                                Once deleted, all workspace data including its projects, tasks, member connections, and settings will be permanently lost and cannot be recovered.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Workspace
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone Deletion Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-[#111112] border border-gray-200 dark:border-gray-800 rounded-xl max-w-md w-full overflow-hidden shadow-2xl animate-scaleIn">
                        <div className="p-6 space-y-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Confirm Workspace Deletion
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    You are about to delete <span className="font-semibold text-gray-900 dark:text-white">"{originalTitle}"</span>. All resources will be permanently removed.
                                </p>
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                    Type <span className="font-bold text-gray-900 dark:text-white select-all">{originalTitle}</span> to confirm:
                                </label>
                                <input 
                                    type="text"
                                    placeholder="Enter workspace name"
                                    value={confirmTitle}
                                    onChange={(e) => setConfirmTitle(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-rose-500 dark:focus:border-rose-500 outline-none text-sm text-gray-900 dark:text-white px-3.5 py-2 rounded-lg transition-colors"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-[#181819] border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setConfirmTitle("");
                                }}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={confirmTitle !== originalTitle || deleting}
                                onClick={handleDeleteWorkspace}
                                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-600/50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                            >
                                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Permanently Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
