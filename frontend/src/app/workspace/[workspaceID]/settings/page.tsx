import { redirect } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import { getWorkspaceMembers } from "@/app/actions/member";
import { getWorkspaceDashboard } from "@/app/actions/workspace";
import { getCurrentUser } from "@/app/actions/auth";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage({
    params,
}: {
    params: Promise<{ workspaceID: string }>;
}) {
    const { workspaceID } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    const [membersRes, wsRes] = await Promise.all([
        getWorkspaceMembers(workspaceID),
        getWorkspaceDashboard(workspaceID),
    ]);

    const currentMember = membersRes.members?.find(
        (m: any) => m.user?.email === currentUser.email
    );
    const isOwner = currentMember && currentMember.role?.toLowerCase() === "owner";

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
                <Link
                    href={`/workspace/${workspaceID}`}
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </main>
        );
    }

    if (!wsRes.workspace) {
        return (
            <main className="max-w-xl mx-auto px-6 py-16 text-center space-y-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Workspace Not Found
                </h1>
                <Link
                    href={`/workspace/all`}
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Workspaces
                </Link>
            </main>
        );
    }

    return (
        <SettingsClient 
            workspaceID={workspaceID} 
            workspace={wsRes.workspace} 
        />
    );
}
