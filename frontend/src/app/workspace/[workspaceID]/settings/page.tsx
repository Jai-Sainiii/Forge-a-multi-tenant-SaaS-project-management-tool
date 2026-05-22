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
    ShieldAlert,
    Palette,
    Check
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

    // Avatar Color States
    const [bgColor, setBgColor] = useState("#6C5CE7");
    const [textColor, setTextColor] = useState("#FFFFFF");
    const [updatingColor, setUpdatingColor] = useState(false);
    const [colorSuccessMessage, setColorSuccessMessage] = useState<string | null>(null);
    const [colorErrorMessage, setColorErrorMessage] = useState<string | null>(null);

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
                        
                        const colorObj = ws.color as any;
                        if (colorObj) {
                            setBgColor(colorObj.backgroundColor || "#6C5CE7");
                            setTextColor(colorObj.textColor || "#FFFFFF");
                        }
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

    const PRESETS = [
        { bg: "#6C5CE7", text: "#FFFFFF", name: "Classic Purple" },
        { bg: "#00B894", text: "#FFFFFF", name: "Emerald Mint" },
        { bg: "#0984E3", text: "#FFFFFF", name: "Ocean Blue" },
        { bg: "#D63031", text: "#FFFFFF", name: "Crimson Rose" },
        { bg: "#E17055", text: "#FFFFFF", name: "Amber Sunset" },
        { bg: "#2D3436", text: "#FFFFFF", name: "Dark Slate" },
        { bg: "#FFEAA7", text: "#2D3436", name: "Creamy Lemon" },
        { bg: "#FAB1A0", text: "#2D3436", name: "Peach Puff" },
    ];

    const handleSaveColors = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdatingColor(true);
        setColorSuccessMessage(null);
        setColorErrorMessage(null);

        try {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL}/workspace/updateWorkspaceAvatarColor/${workspaceID}`,
                {
                    backgroundColor: bgColor,
                    textColor: textColor
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                setColorSuccessMessage("Workspace avatar style updated successfully!");
                setTimeout(() => setColorSuccessMessage(null), 4000);
                window.dispatchEvent(new Event("workspace-updated"));
            } else {
                setColorErrorMessage(res.data.message || "Failed to update colors.");
            }
        } catch (err: any) {
            console.error("Workspace color save error:", err);
            setColorErrorMessage(
                err.response?.data?.message || "An error occurred while saving colors."
            );
        } finally {
            setUpdatingColor(false);
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

                {/* Workspace Avatar Style Card */}
                <form onSubmit={handleSaveColors} className="bg-white dark:bg-[#111112] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Palette className="w-4 h-4 text-[#6C5CE7]" />
                            Workspace Avatar Appearance
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Customize the background and text color of your workspace avatar.
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Notification Alerts specific to Avatar Appearance */}
                        {colorSuccessMessage && (
                            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm px-4 py-3 rounded-lg animate-fadeIn">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>{colorSuccessMessage}</span>
                            </div>
                        )}

                        {colorErrorMessage && (
                            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm px-4 py-3 rounded-lg animate-fadeIn">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>{colorErrorMessage}</span>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Live Preview Pane */}
                            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-850/50 w-full md:w-56 shrink-0">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                    Live Preview
                                </span>
                                <div 
                                    style={{
                                        backgroundColor: bgColor,
                                        color: textColor,
                                        transition: "all 0.3s ease-in-out",
                                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                                    }}
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold select-none transition-transform hover:scale-105"
                                >
                                    {title ? title.charAt(0).toUpperCase() : "W"}
                                </div>
                                <span className="text-xs text-gray-450 dark:text-gray-500 mt-4 font-medium text-center truncate w-full">
                                    {title || "Workspace"}
                                </span>
                            </div>

                            {/* Customization Pane */}
                            <div className="flex-1 w-full space-y-6">
                                {/* Presets Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                                        Select a Theme Preset
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {PRESETS.map((preset) => {
                                            const isSelected = bgColor.toUpperCase() === preset.bg.toUpperCase() && textColor.toUpperCase() === preset.text.toUpperCase();
                                            return (
                                                <button
                                                    key={preset.name}
                                                    type="button"
                                                    onClick={() => {
                                                        setBgColor(preset.bg);
                                                        setTextColor(preset.text);
                                                    }}
                                                    style={{
                                                        backgroundColor: preset.bg,
                                                        color: preset.text,
                                                        border: isSelected ? "2px solid #6C5CE7" : "1px solid rgba(0,0,0,0.05)"
                                                    }}
                                                    className={`h-9 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 hover:opacity-90 shadow-sm ${isSelected ? 'ring-2 ring-[#6C5CE7]/30 ring-offset-2 dark:ring-offset-gray-900 scale-[1.02]' : ''}`}
                                                >
                                                    <span className="truncate">{preset.name}</span>
                                                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Dynamic Custom Pickers */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* BG Picker */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Custom Background
                                        </label>
                                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-1.5 transition-colors focus-within:border-[#6C5CE7] dark:focus-within:border-[#6C5CE7]">
                                            <input 
                                                type="color"
                                                value={bgColor}
                                                onChange={(e) => setBgColor(e.target.value)}
                                                className="w-8 h-8 rounded-md border-0 cursor-pointer overflow-hidden p-0 bg-transparent shrink-0"
                                            />
                                            <input 
                                                type="text"
                                                value={bgColor}
                                                onChange={(e) => setBgColor(e.target.value)}
                                                placeholder="#HEX"
                                                className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white px-2 py-1 uppercase font-mono"
                                            />
                                        </div>
                                    </div>

                                    {/* Text Picker */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Custom Text
                                        </label>
                                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-1.5 transition-colors focus-within:border-[#6C5CE7] dark:focus-within:border-[#6C5CE7]">
                                            <input 
                                                type="color"
                                                value={textColor}
                                                onChange={(e) => setTextColor(e.target.value)}
                                                className="w-8 h-8 rounded-md border-0 cursor-pointer overflow-hidden p-0 bg-transparent shrink-0"
                                            />
                                            <input 
                                                type="text"
                                                value={textColor}
                                                onChange={(e) => setTextColor(e.target.value)}
                                                placeholder="#HEX"
                                                className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white px-2 py-1 uppercase font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-[#181819] border-t border-gray-200 dark:border-gray-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={updatingColor}
                            className="inline-flex items-center gap-2 bg-[#6C5CE7] hover:bg-[#5b4cd8] disabled:bg-[#6C5CE7]/60 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer"
                        >
                            {updatingColor ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save Avatar Style
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
