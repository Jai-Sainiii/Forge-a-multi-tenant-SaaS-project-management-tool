import { getWorkspaceMembers } from "@/app/actions/member";
import { getWorkspaceTeams } from "@/app/actions/team";
import { getProjects } from "@/app/actions/project";
import { getCurrentUser } from "@/app/actions/auth";
import MembersPageClient from "./MembersPageClient";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ workspaceID: string }>;
}) {
  const { workspaceID } = await params;
  
  const [membersRes, teamsRes, projectsRes, currentUser] = await Promise.all([
    getWorkspaceMembers(workspaceID),
    getWorkspaceTeams(workspaceID),
    getProjects(workspaceID),
    getCurrentUser(),
  ]);

  const members = membersRes.members || [];
  const teams = teamsRes.teams || [];
  const projects = projectsRes.projects || [];

  const currentMember = members.find((m: any) => m.user?.email === currentUser?.email);
  const isAdmin = currentMember 
    ? ["admin", "owner"].includes(currentMember.role?.toLowerCase()) 
    : (currentUser?.email === "admin@forge.com");
  const isOwner = currentMember 
    ? currentMember.role?.toLowerCase() === "owner"
    : false;

  return (
    <MembersPageClient
      workspaceID={workspaceID}
      initialMembers={members}
      initialTeams={teams}
      initialProjects={projects}
      currentUser={currentUser}
      isAdmin={!!isAdmin}
      isOwner={!!isOwner}
    />
  );
}
