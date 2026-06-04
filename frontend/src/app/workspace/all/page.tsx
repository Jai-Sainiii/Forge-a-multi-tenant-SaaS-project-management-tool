import { getAllWorkspaces } from "@/app/actions/workspace";
import AllWorkspacesClient from "./AllWorkspacesClient";

export default async function AllWorkspacePage() {
  const result = await getAllWorkspaces();
  return (
    <AllWorkspacesClient
      initialWorkspaces={result.workspaces}
      initialError={result.success ? null : "Failed to load workspaces. Please try again."}
    />
  );
}