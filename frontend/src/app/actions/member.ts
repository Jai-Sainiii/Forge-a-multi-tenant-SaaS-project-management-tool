"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BASE_URL_BACKEND || "http://localhost:5000";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || "";
}

// ── Reads ──────────────────────────────────────────────────────────────

export async function getWorkspaceMembers(workspaceID: string) {
  const token = await getToken();
  try {
    const res = await fetch(`${BACKEND_URL}/members/${workspaceID}`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return { success: data.success ?? res.ok, members: data.members ?? [] };
  } catch {
    return { success: false, members: [] };
  }
}

// ── Mutations ──────────────────────────────────────────────────────────

export async function updateMemberRole(
  workspaceID: string,
  roleData: { userId: number; role: string },
) {
  const token = await getToken();
  try {
    const res = await fetch(`${BACKEND_URL}/members/${workspaceID}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(roleData),
    });
    const data = await res.json();
    return { success: data.success ?? res.ok, message: data.message };
  } catch {
    return { success: false, message: "Failed to update member role." };
  }
}

export async function removeMember(workspaceID: string, userId: number) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/members/${workspaceID}/${userId}`,
      {
        method: "DELETE",
        headers: { Cookie: `token=${token}` },
      },
    );
    const data = await res.json();
    return { success: data.success ?? res.ok, message: data.message };
  } catch {
    return { success: false, message: "Failed to remove member." };
  }
}

export async function generateInvite(
  workspaceID: string,
  role: string,
) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/invite/generate/${workspaceID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify({ role }),
      },
    );
    const data = await res.json();
    return {
      success: data.success ?? res.ok,
      inviteUrl: data.inviteUrl ?? null,
      message: data.message,
    };
  } catch {
    return { success: false, inviteUrl: null, message: "Failed to generate invite link." };
  }
}

export async function acceptInvite(tokenStr: string) {
  const token = await getToken();
  try {
    const res = await fetch(`${BACKEND_URL}/invite/accept/${tokenStr}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    return {
      success: data.success ?? res.ok,
      message: data.message,
      workspaceId: data.workspaceId,
      status: res.status,
    };
  } catch {
    return { success: false, message: "Failed to accept invite." };
  }
}
