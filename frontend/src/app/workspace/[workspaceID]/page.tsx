import { getWorkspaceDashboard } from "@/app/actions/workspace";
import { getCurrentUser } from "@/app/actions/auth";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";

export default async function WorkspaceDashboardPage({
  params,
}: {
  params: Promise<{ workspaceID: string }>;
}) {
  const { workspaceID } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const result = await getWorkspaceDashboard(workspaceID);

  return (
    <DashboardClient
      workspaceID={workspaceID}
      initialWorkspace={result.workspace}
      initialProjects={result.projects}
      initialTasks={result.tasks}
      initialMembers={result.members}
      user={user}
    />
  );
}