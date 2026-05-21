import { prisma } from "../lib/prisma.js";
import { type Request, type Response } from "express";

export const getAllWorkspaces = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        if (!user || !user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        
        const workspaces = await prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId: user.id,
                        isActive: true,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        const workspaceIds = workspaces.map((ws) => ws.id);

        const projects = await prisma.projects.findMany({
            where: {
                workspaceId: {
                    in: workspaceIds,
                },
            },
        });

        const tasks = await prisma.task.findMany({
            where: {
                workspaceId: {
                    in: workspaceIds,
                },
            },
        });

        res.json({ success: true, workspaceData: { workspaces, projects, tasks }});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export const getSingleWorkspaceData = async (req: Request, res: Response) => {
    try {
        const { workspaceID } = req.params;
        const workspaceid = Number(workspaceID);
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceid }
        });
        
        if (!workspace) {
            return res.status(404).json({ success: false, message: "Workspace not found" });
        }
        
        const projects = await prisma.projects.findMany({
            where: { workspaceId: workspaceid },
        });
        
        const tasks = await prisma.task.findMany({
            where: { workspaceId: workspaceid },
        });

        const members = await prisma.member.findMany({
            where: { workspaceId: workspaceid },
        });
        
        res.json({ success: true, workspaceData: { workspace, projects, tasks, members }});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}