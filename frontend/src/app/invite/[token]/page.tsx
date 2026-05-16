"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/authContext/AuthContext";
import { 
    Loader2, 
    CheckCircle2, 
    AlertCircle, 
    UserPlus,
    ArrowRight,
    LogIn
} from "lucide-react";
import Link from "next/link";
import AuthModel from "@/components/auth/AuthModel";

export default function InviteAcceptPage({
    params
}: {
    params: Promise<{ token: string }>
}) {
    const { token } = use(params);
    const router = useRouter();
    const auth = useAuth();
    const [status, setStatus] = useState<'checking' | 'accepting' | 'success' | 'error'>('checking');
    const [message, setMessage] = useState<string>("");
    const [workspaceId, setWorkspaceId] = useState<number | null>(null);

    // Auth Modal State
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authTab, setAuthTab] = useState<"login" | "signup">("login");

    useEffect(() => {
        if (!auth) return;

        // If auth is still loading (no user and no error yet), we wait
        // But the current AuthContext doesn't have a loading state. 
        // It starts with user = null.
        
        const acceptInvite = async () => {
            if (!auth.user) {
                // If not logged in, we stay in 'checking' but show a login required message
                setStatus('error');
                setMessage("You need to be logged in to accept an invite.");
                return;
            }

            setStatus('accepting');
            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/invite/accept/${token}`,
                    {},
                    { withCredentials: true }
                );

                if (res.data.success) {
                    setStatus('success');
                    setMessage(res.data.message);
                    setWorkspaceId(res.data.workspaceId);
                    
                    // Auto redirect after 3 seconds
                    setTimeout(() => {
                        router.push(`/workspace/${res.data.workspaceId}`);
                    }, 3000);
                }
            } catch (err: any) {
                setStatus('error');
                if (err.response?.status === 409) {
                    // Already a member
                    setMessage(err.response.data.message);
                    setWorkspaceId(err.response.data.workspaceId);
                } else {
                    setMessage(err.response?.data?.message || "Failed to accept invite. The link may be expired or invalid.");
                }
            }
        };

        acceptInvite();
    }, [auth, token, router]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] p-6">
            <div className="max-w-md w-full bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="w-16 h-16 bg-[#3C3489]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    {status === 'checking' || status === 'accepting' ? (
                        <Loader2 className="w-8 h-8 text-[#3C3489] animate-spin" />
                    ) : status === 'success' ? (
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                    ) : (
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    )}
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {status === 'checking' && "Checking Invite..."}
                    {status === 'accepting' && "Joining Workspace..."}
                    {status === 'success' && "Welcome!"}
                    {status === 'error' && "Invite Error"}
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    {status === 'checking' && "Please wait while we verify your invite link."}
                    {status === 'accepting' && "We are adding you to the workspace."}
                    {message}
                </p>

                <div className="space-y-4">
                    {status === 'success' && workspaceId && (
                        <Link 
                            href={`/workspace/${workspaceId}`}
                            className="flex items-center justify-center gap-2 w-full bg-[#3C3489] hover:bg-[#251b72] text-white py-3 rounded-lg font-medium transition-all shadow-md"
                        >
                            Go to Workspace
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}

                    {status === 'error' && !auth?.user && (
                        <button 
                            onClick={() => setIsAuthModalOpen(true)}
                            className="flex items-center justify-center gap-2 w-full bg-[#3C3489] hover:bg-[#251b72] text-white py-3 rounded-lg font-medium transition-all shadow-md cursor-pointer"
                        >
                            <LogIn className="w-4 h-4" />
                            Log in to Join
                        </button>
                    )}

                    {status === 'error' && workspaceId && (
                        <Link 
                            href={`/workspace/${workspaceId}`}
                            className="flex items-center justify-center gap-2 w-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                            Go to Workspace
                        </Link>
                    )}

                    <Link 
                        href="/"
                        className="block text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>

            <AuthModel 
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                activeTab={authTab}
                setActiveTab={setAuthTab}
            />
        </main>
    );
}
