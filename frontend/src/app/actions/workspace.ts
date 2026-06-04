"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BASE_URL_BACKEND || "http://localhost:5000";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || "";
}

// ── Reads ──────────────────────────────────────────────────────────────

export async function getAllWorkspaces() {
  const token = await getToken();
  try {
    const res = await fetch(`${BACKEND_URL}/workspace/getAllWorkSpace`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return { success: true, workspaces: data.workspace ?? [] };
  } catch {
    return { success: false, workspaces: [] };
  }
}

export async function getAllUserWorkspaces() {
  const token = await getToken();
  try {
    const res = await fetch(`${BACKEND_URL}/dashboard/getAllWorkspaces`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return {
      success: true,
      workspaces: data.workspaceData?.workspaces ?? [],
    };
  } catch {
    return { success: false, workspaces: [] };
  }
}

export async function getWorkspaceDashboard(workspaceID: string) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/dashboard/workspace/${workspaceID}`,
      {
        headers: { Cookie: `token=${token}` },
        cache: "no-store",
      },
    );
    const data = await res.json();
    if (data.success) {
      return {
        success: true,
        workspace: data.workspaceData?.workspace ?? null,
        projects: data.workspaceData?.projects ?? [],
        tasks: data.workspaceData?.tasks ?? [],
        members: data.workspaceData?.members ?? [],
      };
    }
    return { success: false, workspace: null, projects: [], tasks: [], members: [] };
  } catch {
    return { success: false, workspace: null, projects: [], tasks: [], members: [] };
  }
}

// ── Mutations ──────────────────────────────────────────────────────────

export async function createWorkspace(formData: {
  title: string;
  describtion: string;
  companyname: string;
  visibility: string;
}) {
  const token = await getToken();
  try {
    const res = await fetch(`${BACKEND_URL}/workspace/createWorkSpace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed to create workspace." };
    return { success: true, data };
  } catch {
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

export async function updateWorkspace(
  workspaceID: string,
  formData: {
    title: string;
    companyname: string;
    describtion: string;
    visibility: string;
  },
) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/workspace/updateWorkSpace/${workspaceID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify(formData),
      },
    );
    const data = await res.json();
    return { success: data.success ?? false, message: data.message };
  } catch {
    return { success: false, message: "An error occurred while saving changes." };
  }
}

export async function updateWorkspaceAvatarColor(
  workspaceID: string,
  colors: { backgroundColor: string; textColor: string },
) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/workspace/updateWorkspaceAvatarColor/${workspaceID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify(colors),
      },
    );
    const data = await res.json();
    return { success: data.success ?? false, message: data.message };
  } catch {
    return { success: false, message: "An error occurred while saving colors." };
  }
}

export async function deleteWorkspace(workspaceID: string) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/workspace/deleteWorkSpace/${workspaceID}`,
      {
        method: "DELETE",
        headers: { Cookie: `token=${token}` },
      },
    );
    const data = await res.json();
    return { success: data.success ?? false, message: data.message };
  } catch {
    return { success: false, message: "An error occurred while deleting workspace." };
  }
}
