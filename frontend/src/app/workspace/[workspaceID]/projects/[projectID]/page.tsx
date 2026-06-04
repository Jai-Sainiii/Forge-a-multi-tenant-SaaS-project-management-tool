import { getSingleProject } from "@/app/actions/project";
import { getProjectTeams } from "@/app/actions/team";
import { getWorkspaceMembers } from "@/app/actions/member";
import { getCurrentUser } from "@/app/actions/auth";
import ProjectDetailClient from "./ProjectDetailClient";
import { redirect } from "next/navigation";

export default async function ProjectDetailsPage({
    params
}: {
    params: Promise<{ workspaceID: string, projectID: string }>
}) {
    const { workspaceID, projectID } = await params;
    const user = await getCurrentUser();
    if (!user) {
        redirect("/");
    }

    const [projectResult, teamsResult, membersResult] = await Promise.all([
        getSingleProject(projectID),
        getProjectTeams(projectID),
        getWorkspaceMembers(workspaceID),
    ]);

    if (!projectResult.success || !projectResult.project) {
        redirect(`/workspace/${workspaceID}/projects`);
    }

    const workspaceMembers = membersResult.members || [];
    const project = projectResult.project;

    // Compute permission server-side
    const currentMember = workspaceMembers.find((m: any) => m.user?.email === user.email);
    const isWorkspaceAdmin = currentMember ? ["admin", "owner"].includes(currentMember.role?.toLowerCase()) : false;
    const projectMembersList = project.projectMembers || [];
    const isProjectAdmin = currentMember ? projectMembersList.some(
        (pm: any) => pm.userId === currentMember.userId && pm.role?.toLowerCase() === "admin"
    ) : false;
    const canEdit = isWorkspaceAdmin || isProjectAdmin;

    return (
        <ProjectDetailClient
            workspaceID={workspaceID}
            projectID={projectID}
            initialProject={project}
            initialTeams={teamsResult.teams || []}
            workspaceMembers={workspaceMembers}
            user={user}
            canEdit={canEdit}
        />
    );
}
