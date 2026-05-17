import { prisma } from "../lib/prisma.js"
import {type Request, type Response} from "express"

const createTeam = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params
        const projectID = Number(projectId)
        const { teamName } = req.body
        const team = await prisma.team.create({
            data: {
                projectId: projectID,
                teamName
            }
        })
        res.status(200).json({ team })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}
const getTeam = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.body
        const projectID = Number(projectId)
        const team = await prisma.team.findMany({
            where: {
                projectId: projectID
            }
        })
        res.status(200).json({ team })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}
const updateTeam = async (req: Request, res: Response) => {
    try {
        const { projectId, teamName } = req.body
        const team = await prisma.team.updateMany({
            where: {
                projectId: Number(projectId)
            },
            data: {
                teamName
            }
        })
        res.status(200).json({ team })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}
const deleteTeam = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.body
        const projectIdNumber = Number(projectId)
        const team = await prisma.team.deleteMany({
            where: {
                projectId: projectIdNumber
            }
        })
        res.status(200).json({ team })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}


const addTeamMember = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params
        const teamID = Number(teamId)
        const { userId, position, role } = req.body
        const user = await prisma.teamMember.create({
            data: {
                teamId: teamID,
                userId: Number(userId),
                position: position,
                role: role
            }
        })
        res.status(200).json({success: true, message: "Added to team", user })
    } catch (error: any) {
        res.status(500).json({success: false, message: "Failed to add to team", error: error.message })
    }
}
const getTeamsByWorkspace = async (req: Request, res: Response) => {
    try {
        const workspaceId = Number(req.params.workspaceId);
        const teams = await prisma.team.findMany({
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
        res.status(200).json({ success: true, teams });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const updateTeamMember = async (req: Request, res: Response) => {
    try {
        const { memberId } = req.params
        const memberID = Number(memberId)
        const { position, role } = req.body
        const updatedMember = await prisma.teamMember.update({
            where: { id: memberID },
            data: {
                position,
                role
            }
        })
        res.status(200).json({ success: true, message: "Team member updated", updatedMember })
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to update team member", error: error.message })
    }
}

const deleteTeamMember = async (req: Request, res: Response) => {
    try {
        const { memberId } = req.params
        const memberID = Number(memberId)
        const deletedMember = await prisma.teamMember.delete({
            where: { id: memberID }
        })
        res.status(200).json({ success: true, message: "Team member removed", deletedMember })
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to remove team member", error: error.message })
    }
}

export { createTeam, getTeam, updateTeam, deleteTeam, addTeamMember, getTeamsByWorkspace, updateTeamMember, deleteTeamMember }