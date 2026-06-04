import { getProjects } from "@/app/actions/project";
import { getWorkspaceMembers } from "@/app/actions/member";
import { getCurrentUser } from "@/app/actions/auth";
import ProjectsPageClient from "./ProjectsPageClient";
import { redirect } from "next/navigation";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ workspaceID: string }>;
}) {
  const { workspaceID } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  // Fetch projects and members to check if current user is admin/owner
  const [projectsResult, membersResult] = await Promise.all([
    getProjects(workspaceID),
    getWorkspaceMembers(workspaceID),
  ]);

  let isAdmin = false;
  if (membersResult.success) {
    const currentMember = membersResult.members.find(
      (m: any) => m.user?.email === user.email
    );
    if (currentMember) {
      isAdmin = ["admin", "owner"].includes(currentMember.role?.toLowerCase());
    }
  }

  return (
    <ProjectsPageClient
      workspaceID={workspaceID}
      initialProjects={projectsResult.projects || []}
      isAdmin={isAdmin}
    />
  );
}