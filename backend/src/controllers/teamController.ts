import redis from "../config/redis/client.js";
import { prisma } from "../lib/prisma.js"
import { type Request, type Response } from "express"

const createTeam = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const { projectId } = req.params;
        const projectID = Number(projectId);
        const { teamName } = req.body;

        if (isNaN(projectID)) {
            return res.status(400).json({ success: false, message: "Invalid project ID" });
        }

        const project = await prisma.projects.findUnique({
            where: { id: projectID },
            include: { workspace: true }
        });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const workspaceMember = await prisma.member.findFirst({
            where: {
                workspaceId: project.workspaceId,
                userId: user.id,
                role: { in: ["admin", "owner"] },
                isActive: true
            }
        });

        const projectMember = await prisma.projectMember.findFirst({
            where: {
                projectId: projectID,
                userId: user.id,
                role: { in: ["admin", "owner"] }
            }
        });

        const isWorkspaceOwner = project.workspace.userId === user.id;

        if (!workspaceMember && !projectMember && !isWorkspaceOwner) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only project admins or workspace admins/owners can create teams in this project." });
        }

        const team = await prisma.team.create({
            data: {
                projectId: projectID,
                teamName
            }
        });

        await redis.del(`workspace:${project.workspaceId}`);
        await redis.del(`workspace:${project.workspaceId} user:${user.id}`);

        res.status(200).json({ success: true, team });
    } catch (error: any) {
        console.error("Create team error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

const getTeam = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const { projectId } = req.body;
        const projectID = Number(projectId);

        if (isNaN(projectID)) {
            return res.status(400).json({ success: false, message: "Invalid project ID" });
        }

        const project = await prisma.projects.findUnique({
            where: { id: projectID },
            include: {
                workspace: true,
                projectMembers: true
            }
        });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const workspaceMember = await prisma.member.findFirst({
            where: {
                workspaceId: project.workspaceId,
                userId: user.id,
                role: { in: ["admin", "owner"] },
                isActive: true
            }
        });

        const isWorkspaceOwner = project.workspace.userId === user.id;
        const isProjectMember = project.projectMembers.some(pm => pm.userId === user.id);

        if (!workspaceMember && !isProjectMember && !isWorkspaceOwner) {
            return res.status(403).json({ success: false, message: "Unauthorized. You are not a member of this project or workspace." });
        }

        const team = await prisma.team.findMany({
            where: {
                projectId: projectID
            }
        })
        res.status(200).json({ success: true, team })
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message })
    }
}

const updateTeam = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const { projectId, teamName } = req.body;
        const projectID = Number(projectId);

        if (isNaN(projectID)) {
            return res.status(400).json({ success: false, message: "Invalid project ID" });
        }

        const project = await prisma.projects.findUnique({
            where: { id: projectID },
            include: { workspace: true }
        });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const workspaceMember = await prisma.member.findFirst({
            where: {
                workspaceId: project.workspaceId,
                userId: user.id,
                role: { in: ["admin", "owner"] },
                isActive: true
            }
        });

        const projectMember = await prisma.projectMember.findFirst({
            where: {
                projectId: projectID,
                userId: user.id,
                role: { in: ["admin", "owner"] }
            }
        });

        const isWorkspaceOwner = project.workspace.userId === user.id;

        if (!workspaceMember && !projectMember && !isWorkspaceOwner) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only project admins or workspace admins/owners can update teams." });
        }

        const team = await prisma.team.updateMany({
            where: {
                projectId: projectID
            },
            data: {
                teamName
            }
        })

        await redis.del(`workspace:${project.workspaceId}`);
        await redis.del(`workspace:${project.workspaceId} user:${user.id}`);

        res.status(200).json({ success: true, team })
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message })
    }
}

const deleteTeam = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const { projectId } = req.body;
        const projectID = Number(projectId);

        if (isNaN(projectID)) {
            return res.status(400).json({ success: false, message: "Invalid project ID" });
        }

        const project = await prisma.projects.findUnique({
            where: { id: projectID },
            include: { workspace: true }
        });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const workspaceMember = await prisma.member.findFirst({
            where: {
                workspaceId: project.workspaceId,
                userId: user.id,
                role: { in: ["admin", "owner"] },
                isActive: true
            }
        });

        const projectMember = await prisma.projectMember.findFirst({
            where: {
                projectId: projectID,
                userId: user.id,
                role: { in: ["admin", "owner"] }
            }
        });

        const isWorkspaceOwner = project.workspace.userId === user.id;

        if (!workspaceMember && !projectMember && !isWorkspaceOwner) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only project admins or workspace admins/owners can delete teams." });
        }

        const team = await prisma.team.deleteMany({
            where: {
                projectId: projectID
            }
        })

        await redis.del(`workspace:${project.workspaceId}`);
        await redis.del(`workspace:${project.workspaceId} user:${user.id}`);

        res.status(200).json({ success: true, team })
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message })
    }
}

const addTeamMember = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const { teamId } = req.params;
        const teamID = Number(teamId);
        const { userId, position, role } = req.body;

        if (isNaN(teamID)) {
            return res.status(400).json({ success: false, message: "Invalid team ID" })
        }

        const team = await prisma.team.findUnique({
            where: { id: teamID },
            include: {
                project: {
                    include: {
                        workspace: true
                    }
                }
            }
        })

        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" })
        }

        const workspaceMember = await prisma.member.findFirst({
            where: {
                workspaceId: team.project.workspaceId,
                userId: user.id,
                role: { in: ["admin", "owner"] },
                isActive: true
            }
        });

        const callerProjectMember = await prisma.projectMember.findFirst({
            where: {
                projectId: team.projectId,
                userId: user.id,
                role: { in: ["admin", "owner"] }
            }
        });

        const isWorkspaceOwner = team.project.workspace.userId === user.id;

        if (!workspaceMember && !callerProjectMember && !isWorkspaceOwner) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only project admins or workspace admins/owners can add members to project teams." });
        }

        // Verify that the target user is a project member of the team's project
        const targetProjectMember = await prisma.projectMember.findFirst({
            where: {
                projectId: team.projectId,
                userId: Number(userId)
            }
        })

        if (!targetProjectMember) {
            return res.status(400).json({ success: false, message: "Only project members can be added to project teams." })
        }

        // Check if user is already a member of this team
        const existingTeamMember = await prisma.teamMember.findFirst({
            where: {
                teamId: teamID,
                userId: Number(userId)
            }
        })

        if (existingTeamMember) {
            return res.status(400).json({ success: false, message: "User is already a member of this team." })
        }

        const newTeamMember = await prisma.teamMember.create({
            data: {
                teamId: teamID,
                userId: Number(userId),
                position: position,
                role: role
            }
        })

        await redis.del(`workspace:${team.project.workspaceId}`);
        await redis.del(`workspace:${team.project.workspaceId} user:${user.id}`);

        res.status(200).json({ success: true, message: "Added to team", user: newTeamMember })
    } catch (error: any) {
        console.error("Add team member error:", error);
        res.status(500).json({ success: false, message: "Failed to add to team", error: error.message })
    }
}

const getTeamsByWorkspace = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const workspaceId = Number(req.params.workspaceId);

        if (isNaN(workspaceId)) {
            return res.status(400).json({ success: false, message: "Invalid workspace ID" });
        }

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId }
        });

        if (!workspace) {
            return res.status(404).json({ success: false, message: "Workspace not found" });
        }

        const workspaceMember = await prisma.member.findFirst({
            where: {
                workspaceId: workspaceId,
                userId: user.id,
                isActive: true
            }
        });

        const isWorkspaceOwner = workspace.userId === user.id;
        const isWorkspaceAdmin = workspaceMember?.role === "admin" || workspaceMember?.role === "owner";

        let teams;
        if (isWorkspaceOwner || isWorkspaceAdmin) {
            teams = await prisma.team.findMany({
                where: {
                    project: {
                        workspaceId: workspaceId
                    }
                },
                include: {
                    project: {
                        select: { name: true }
                    },
                    teamMembers: {
                        include: {
                            user: {
                                select: { name: true, email: true }
                            }
                        }
                    }
                }
            });
        } else {
            teams = await prisma.team.findMany({
                where: {
                    project: {
                        workspaceId: workspaceId,
                        projectMembers: {
                            some: { userId: user.id }
                        }
                    }
                },
                include: {
                    project: {
                        select: { name: true }
                    },
                    teamMembers: {
                        include: {
                            user: {
                                select: { name: true, email: true }
                            }
                        }
                    }
                }
            });
        }

        res.status(200).json({ success: true, teams });
    } catch (error: any) {
        console.error("Get teams by workspace error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

const updateTeamMember = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const { memberId } = req.params;
        const memberID = Number(memberId);
        const { position, role } = req.body;

        if (isNaN(memberID)) {
            return res.status(400).json({ success: false, message: "Invalid member ID" })
        }

        const teamMember = await prisma.teamMember.findUnique({
            where: { id: memberID },
            include: {
                team: {
                    include: {
                        project: {
                            include: {
                                workspace: true
                            }
                        }
                    }
                }
            }
        });

        if (!teamMember) {
            return res.status(404).json({ success: false, message: "Team member not found" });
        }

        const workspaceMember = await prisma.member.findFirst({
            where: {
                workspaceId: teamMember.team.project.workspaceId,
                userId: user.id,
                role: { in: ["admin", "owner"] },
                isActive: true
            }
        });

        const callerProjectMember = await prisma.projectMember.findFirst({
            where: {
                projectId: teamMember.team.projectId,
                userId: user.id,
                role: { in: ["admin", "owner"] }
            }
        });

        const isWorkspaceOwner = teamMember.team.project.workspace.userId === user.id;

        if (!workspaceMember && !callerProjectMember && !isWorkspaceOwner) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only project admins or workspace admins/owners can update team members." });
        }

        const updatedMember = await prisma.teamMember.update({
            where: { id: memberID },
            data: {
                position,
                role
            }
        })

        await redis.del(`workspace:${teamMember.team.project.workspaceId}`);
        await redis.del(`workspace:${teamMember.team.project.workspaceId} user:${user.id}`);

        res.status(200).json({ success: true, message: "Team member updated", updatedMember })
    } catch (error: any) {
        console.error("Update team member error:", error);
        res.status(500).json({ success: false, message: "Failed to update team member", error: error.message })
    }
}

const deleteTeamMember = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const { memberId } = req.params;
        const memberID = Number(memberId);

        if (isNaN(memberID)) {
            return res.status(400).json({ success: false, message: "Invalid member ID" })
        }

        const teamMember = await prisma.teamMember.findUnique({
            where: { id: memberID },
            include: {
                team: {
                    include: {
                        project: {
                            include: {
                                workspace: true
                            }
                        }
                    }
                }
            }
        });

        if (!teamMember) {
            return res.status(404).json({ success: false, message: "Team member not found" });
        }

        const workspaceMember = await prisma.member.findFirst({
            where: {
                workspaceId: teamMember.team.project.workspaceId,
                userId: user.id,
                role: { in: ["admin", "owner"] },
                isActive: true
            }
        });

        const callerProjectMember = await prisma.projectMember.findFirst({
            where: {
                projectId: teamMember.team.projectId,
                userId: user.id,
                role: { in: ["admin", "owner"] }
            }
        });

        const isWorkspaceOwner = teamMember.team.project.workspace.userId === user.id;

        if (!workspaceMember && !callerProjectMember && !isWorkspaceOwner) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only project admins or workspace admins/owners can remove team members." });
        }

        const deletedMember = await prisma.teamMember.delete({
            where: { id: memberID }
        })

        await redis.del(`workspace:${teamMember.team.project.workspaceId}`);
        await redis.del(`workspace:${teamMember.team.project.workspaceId} user:${user.id}`);

        res.status(200).json({ success: true, message: "Team member removed", deletedMember })
    } catch (error: any) {
        console.error("Delete team member error:", error);
        res.status(500).json({ success: false, message: "Failed to remove team member", error: error.message })
    }
}

const getTeamsByProject = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const projectId = Number(req.params.projectId);

        if (isNaN(projectId)) {
            return res.status(400).json({ success: false, message: "Invalid project ID" });
        }

        const project = await prisma.projects.findUnique({
            where: { id: projectId },
            include: {
                workspace: true,
                projectMembers: true
            }
        });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const workspaceMember = await prisma.member.findFirst({
            where: {
                workspaceId: project.workspaceId,
                userId: user.id,
                role: { in: ["admin", "owner"] },
                isActive: true
            }
        });

        const isWorkspaceOwner = project.workspace.userId === user.id;
        const isProjectMember = project.projectMembers.some(pm => pm.userId === user.id);

        if (!workspaceMember && !isProjectMember && !isWorkspaceOwner) {
            return res.status(403).json({ success: false, message: "Unauthorized. You are not a member of this project or workspace administrator." });
        }

        const teams = await prisma.team.findMany({
            where: {
                projectId: projectId
            },
            include: {
                teamMembers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json({ success: true, teams });
    } catch (error: any) {
        console.error("Get teams by project error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export { createTeam, getTeam, updateTeam, deleteTeam, addTeamMember, getTeamsByWorkspace, updateTeamMember, deleteTeamMember, getTeamsByProject }