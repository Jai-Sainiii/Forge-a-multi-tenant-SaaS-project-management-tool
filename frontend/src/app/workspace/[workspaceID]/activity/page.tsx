import { redirect } from "next/navigation";
import { getWorkspaceDashboard } from "@/app/actions/workspace";
import { getWorkspaceTeams } from "@/app/actions/team";
import { getCurrentUser } from "@/app/actions/auth";
import ActivityClient from "./ActivityClient";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ workspaceID: string }>;
}) {
  const { workspaceID } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const [wsRes, teamRes] = await Promise.all([
    getWorkspaceDashboard(workspaceID),
    getWorkspaceTeams(workspaceID),
  ]);

  const projects = wsRes.projects || [];
  const tasks = wsRes.tasks || [];
  const members = wsRes.members || [];
  const teams = teamRes.teams || [];

  return (
    <ActivityClient
      initialProjects={projects}
      initialTasks={tasks}
      initialMembers={members}
      initialTeams={teams}
    />
  );
}
