import { prisma } from "../lib/prisma.js";
import { type Request, type Response } from "express";

export const getAllWorkspaces = async (req: Request, res: Response) => {
    try {
        
        const workspaces = await prisma.workspace.findMany({
            include: {
                members: true,
            },
        });
        const projects = await prisma.projects.findMany();
        const tasks = await prisma.task.findMany();
        res.json({ success: true,workspaceData: { workspaces, projects, tasks }});
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