"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BASE_URL_BACKEND || "http://localhost:5000";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || "";
}

// ── Reads ──────────────────────────────────────────────────────────────

export async function getTasks(workspaceID: string) {
  const token = await getToken();
  try {
    const res = await fetch(`${BACKEND_URL}/tasks/${workspaceID}`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return { success: true, tasks: data.tasks ?? [] };
  } catch {
    return { success: false, tasks: [] };
  }
}

export async function getTaskDetail(taskID: string) {
  const token = await getToken();
  try {
    const res = await fetch(`${BACKEND_URL}/tasks/task/${taskID}`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return { success: data.success ?? res.ok, task: data.task ?? null };
  } catch {
    return { success: false, task: null };
  }
}

// ── Mutations ──────────────────────────────────────────────────────────

export async function createTask(
  workspaceID: string,
  formData: {
    title: string;
    description: string;
    status: string;
    priority: string;
    projectId: string;
    assigneeIds: number[];
  },
) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/tasks/createTask/${workspaceID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify(formData),
      },
    );
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed to create task." };
    return { success: data.success ?? true, message: data.message };
  } catch {
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

export async function updateTask(
  taskID: string,
  formData: Record<string, unknown>,
) {
  const token = await getToken();
  try {
    const res = await fetch(`${BACKEND_URL}/tasks/update/${taskID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return { success: data.success ?? res.ok, message: data.message };
  } catch {
    return { success: false, message: "Failed to update task." };
  }
}

export async function updateTaskStatus(taskID: string, status: string) {
  const token = await getToken();
  try {
    const res = await fetch(`${BACKEND_URL}/tasks/status/${taskID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    return { success: data.success ?? res.ok, message: data.message };
  } catch {
    return { success: false, message: "Failed to update task status." };
  }
}

export async function submitTask(
  taskID: string,
  formData: Record<string, unknown>,
) {
  const token = await getToken();
  try {
    const res = await fetch(`${BACKEND_URL}/tasks/submit/${taskID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return { success: data.success ?? res.ok, message: data.message };
  } catch {
    return { success: false, message: "Failed to submit task." };
  }
}
