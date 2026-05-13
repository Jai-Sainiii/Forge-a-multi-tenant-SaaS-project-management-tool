import { prisma } from "../lib/prisma.js"
import {type Request, type Response} from "express"

const createTeam = async (req: Request, res: Response) => {
    try {
        const { projectId, teamName } = req.body
        const team = await prisma.team.create({
            data: {
                projectId: parseInt(projectId),
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

export { createTeam, getTeam, updateTeam, deleteTeam }