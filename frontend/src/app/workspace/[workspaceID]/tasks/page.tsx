import { getTasks } from "@/app/actions/task";
import { getCurrentUser } from "@/app/actions/auth";
import TasksPageClient from "./TasksPageClient";
import { redirect } from "next/navigation";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ workspaceID: string }>;
}) {
  const { workspaceID } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const result = await getTasks(workspaceID);

  return (
    <TasksPageClient
      workspaceID={workspaceID}
      initialTasks={result.tasks || []}
      initialError={result.success ? null : "Failed to load tasks. Please try again."}
    />
  );
}
