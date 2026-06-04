import { getTaskDetail } from "@/app/actions/task";
import { getWorkspaceMembers } from "@/app/actions/member";
import { getSingleProject } from "@/app/actions/project";
import { getCurrentUser } from "@/app/actions/auth";
import TaskDetailClient from "./TaskDetailClient";
import { redirect } from "next/navigation";

export default async function TaskDetailsPage({
  params,
}: {
  params: Promise<{ workspaceID: string; taskID: string }>;
}) {
  const { workspaceID, taskID } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const [taskResult, membersResult] = await Promise.all([
    getTaskDetail(taskID),
    getWorkspaceMembers(workspaceID),
  ]);

  if (!taskResult.success || !taskResult.task) {
    redirect(`/workspace/${workspaceID}/tasks`);
  }

  const task = taskResult.task;
  const workspaceMembers = membersResult.members || [];

  // Fetch project members if task belongs to a project
  let projectMembers: any[] = [];
  if (task.projectId) {
    const projectRes = await getSingleProject(String(task.projectId));
    if (projectRes.success && projectRes.project) {
      projectMembers = projectRes.project.projectMembers || [];
    }
  }

  // Resolve permissions
  const isTaskAdmin = task.taskMembers?.some(
    (m: any) => m.user?.email === user.email && m.role?.toLowerCase() === "admin"
  ) || false;

  const currentWorkspaceMember = workspaceMembers.find(
    (m: any) => m.user?.email === user.email
  );
  const isWorkspaceAdminOrOwner = currentWorkspaceMember 
    ? ["admin", "owner"].includes(currentWorkspaceMember.role?.toLowerCase())
    : false;

  const currentProjectMember = projectMembers.find(
    (pm: any) => pm.user?.email === user.email
  );
  const isProjectAdmin = currentProjectMember
    ? ["admin", "owner"].includes(currentProjectMember.role?.toLowerCase())
    : false;

  const isAssignedTaskMember = task.taskMembers?.some(
    (m: any) => m.user?.email === user.email
  ) || false;

  const canEditTask = isTaskAdmin || isWorkspaceAdminOrOwner || isProjectAdmin;
  const canSubmitTask = isAssignedTaskMember || isWorkspaceAdminOrOwner || isProjectAdmin;

  return (
    <TaskDetailClient
      workspaceID={workspaceID}
      taskID={taskID}
      initialTask={task}
      workspaceMembers={workspaceMembers}
      initialProjectMembers={projectMembers}
      currentUser={user}
      canEditTask={canEditTask}
      canSubmitTask={canSubmitTask}
    />
  );
}
