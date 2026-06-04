"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BASE_URL_BACKEND || "http://localhost:5000";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || "";
}

// ── Reads ──────────────────────────────────────────────────────────────

export async function getProjects(workspaceID: string) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/project/getProjects/${workspaceID}`,
      {
        headers: { Cookie: `token=${token}` },
        cache: "no-store",
      },
    );
    const data = await res.json();
    return { success: true, projects: data.projects ?? [] };
  } catch {
    return { success: false, projects: [] };
  }
}

export async function getSingleProject(projectID: string) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/project/singleProject/${projectID}`,
      {
        headers: { Cookie: `token=${token}` },
        cache: "no-store",
      },
    );
    const data = await res.json();
    return { success: true, project: data.project ?? null };
  } catch {
    return { success: false, project: null };
  }
}

// ── Mutations ──────────────────────────────────────────────────────────

export async function createProject(formData: {
  name: string;
  field: string;
  description: string;
  status: string;
  workspaceId: number;
}) {
  const token = await getToken();
  try {
    const res = await fetch(`${BACKEND_URL}/project/createProject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed to create project." };
    return { success: true, data };
  } catch {
    return { success: false, message: "Failed to create project." };
  }
}

export async function updateProject(
  projectID: string,
  formData: { name: string; field: string; description: string; status: string },
) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/project/updateProject/${projectID}`,
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
    if (!res.ok) return { success: false, message: data.message || "Failed to update project." };
    return { success: true, data };
  } catch {
    return { success: false, message: "Failed to update project details." };
  }
}

export async function addProjectMember(
  projectID: string,
  memberData: { userId: number; role: string; position: string },
) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/project/addProjectMember/${projectID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify(memberData),
      },
    );
    const data = await res.json();
    return { success: data.success ?? res.ok, message: data.message };
  } catch {
    return { success: false, message: "Failed to add member to project." };
  }
}

export async function updateProjectMember(
  projectID: string,
  userId: number,
  memberData: { role: string; position: string },
) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/project/updateProjectMember/${projectID}/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify(memberData),
      },
    );
    const data = await res.json();
    return { success: data.success ?? res.ok, message: data.message };
  } catch {
    return { success: false, message: "Failed to update project member." };
  }
}

export async function removeProjectMember(projectID: string, userId: number) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/project/deleteProjectMember/${projectID}/${userId}`,
      {
        method: "DELETE",
        headers: { Cookie: `token=${token}` },
      },
    );
    const data = await res.json();
    return { success: data.success ?? res.ok, message: data.message };
  } catch {
    return { success: false, message: "Failed to remove project member." };
  }
}
