"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BASE_URL_BACKEND || "http://localhost:5000";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || "";
}

// ── Reads ──────────────────────────────────────────────────────────────

export async function getProjectTeams(projectID: string) {
  const token = await getToken();
  try {
    const res = await fetch(`${BACKEND_URL}/team/project/${projectID}`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return { success: data.success ?? res.ok, teams: data.teams ?? [] };
  } catch {
    return { success: false, teams: [] };
  }
}

export async function getWorkspaceTeams(workspaceID: string) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/team/workspace/${workspaceID}`,
      {
        headers: { Cookie: `token=${token}` },
        cache: "no-store",
      },
    );
    const data = await res.json();
    return { success: data.success ?? res.ok, teams: data.teams ?? [] };
  } catch {
    return { success: false, teams: [] };
  }
}

// ── Mutations ──────────────────────────────────────────────────────────

export async function createTeam(projectID: string, teamName: string) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/team/createTeam/${projectID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify({ teamName }),
      },
    );
    const data = await res.json();
    return {
      success: !!data.team,
      team: data.team ?? null,
      message: data.message || data.error,
    };
  } catch {
    return { success: false, team: null, message: "Failed to create team." };
  }
}

export async function addTeamMember(
  teamID: number,
  memberData: { userId: number; position: string; role: string },
) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/team/addTeamMember/${teamID}`,
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
    return { success: false, message: "Failed to add team member." };
  }
}

export async function updateTeamMember(
  memberID: number,
  memberData: { position: string; role: string },
) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/team/updateTeamMember/${memberID}`,
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
    return { success: false, message: "Failed to update team member." };
  }
}

export async function deleteTeamMember(memberID: number) {
  const token = await getToken();
  try {
    const res = await fetch(
      `${BACKEND_URL}/team/deleteTeamMember/${memberID}`,
      {
        method: "DELETE",
        headers: { Cookie: `token=${token}` },
      },
    );
    const data = await res.json();
    return { success: data.success ?? res.ok, message: data.message };
  } catch {
    return { success: false, message: "Failed to remove team member." };
  }
}
