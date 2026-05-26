import { prisma } from "../lib/prisma.js";
import { type Request, type Response } from "express";
import redis from "../config/redis/client.js";

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

        const projectsList: any[] = [];
        const tasksList: any[] = [];

        for (const ws of workspaces) {
            const isWorkspaceOwner = ws.userId === user.id;
            const wsMember = ws.members.find(m => m.userId === user.id);
            const isWorkspaceAdmin = wsMember?.role === "admin" || wsMember?.role === "owner";

            let wsProjects;
            let wsTasks;

            if (isWorkspaceOwner || isWorkspaceAdmin) {
                // Workspace owners and admins get all projects and tasks in this workspace
                wsProjects = await prisma.projects.findMany({
                    where: { workspaceId: ws.id }
                });
                wsTasks = await prisma.task.findMany({
                    where: { workspaceId: ws.id }
                });
            } else {
                // Regular members only see projects they belong to
                wsProjects = await prisma.projects.findMany({
                    where: {
                        workspaceId: ws.id,
                        projectMembers: {
                            some: { userId: user.id }
                        }
                    }
                });

                // Retrieve projects where user is project admin
                const adminProjects = await prisma.projectMember.findMany({
                    where: {
                        userId: user.id,
                        role: "admin",
                        project: { workspaceId: ws.id }
                    }
                });
                const adminProjectIds = adminProjects.map(ap => ap.projectId);

                // Regular members only see tasks they are assigned to, or tasks in projects they admin
                wsTasks = await prisma.task.findMany({
                    where: {
                        workspaceId: ws.id,
                        OR: [
                            { taskMembers: { some: { userId: user.id } } },
                            { projectId: { in: adminProjectIds } }
                        ]
                    }
                });
            }

            projectsList.push(...wsProjects);
            tasksList.push(...wsTasks);
        }

        res.json({ success: true, workspaceData: { workspaces, projects: projectsList, tasks: tasksList }});
    } catch (error) {
        console.error("Get all workspaces dashboard error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export const getSingleWorkspaceData = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const { workspaceID } = req.params;
        const workspaceid = Number(workspaceID);

        const cacheData = await redis.get(`workspace:${workspaceid} user:${user.id}`);
        if(cacheData){
            return res.json({ success: true, workspaceData: JSON.parse(cacheData)});
        }

        if (isNaN(workspaceid)) {
            return res.status(400).json({ success: false, message: "Invalid workspace ID" });
        }

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceid },
            include: {
                members: true
            }
        });
        
        if (!workspace) {
            return res.status(404).json({ success: false, message: "Workspace not found" });
        }

        
        const callerMember = workspace.members.find(m => m.userId === user.id && m.isActive);
        const isWorkspaceOwner = workspace.userId === user.id;

        if (!callerMember && !isWorkspaceOwner) {
            return res.status(403).json({ success: false, message: "Unauthorized to access this workspace data." });
        }

        const isWorkspaceAdmin = callerMember?.role === "admin" || callerMember?.role === "owner" || isWorkspaceOwner;

        let projects;
        let tasks;

        if (isWorkspaceAdmin) {
            projects = await prisma.projects.findMany({
                where: { workspaceId: workspaceid },
            });
            
            tasks = await prisma.task.findMany({
                where: { workspaceId: workspaceid },
            });
        } else {
            
            projects = await prisma.projects.findMany({
                where: {
                    workspaceId: workspaceid,
                    projectMembers: {
                        some: { userId: user.id }
                    }
                },
            });

            
            const adminProjects = await prisma.projectMember.findMany({
                where: {
                    userId: user.id,
                    role: "admin",
                    project: { workspaceId: workspaceid }
                }
            });
            const adminProjectIds = adminProjects.map(ap => ap.projectId);
            
            
            tasks = await prisma.task.findMany({
                where: {
                    workspaceId: workspaceid,
                    OR: [
                        { taskMembers: { some: { userId: user.id } } },
                        { projectId: { in: adminProjectIds } }
                    ]
                },
            });
        }

       
        const members = await prisma.member.findMany({
            where: { workspaceId: workspaceid, isActive: true },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        redis.set(`workspace:${workspaceid} user:${user.id}`, JSON.stringify({ workspace, projects, tasks, members }), 'EX', 60 * 60 * 24 * 7);
        
        res.json({ success: true, workspaceData: { workspace, projects, tasks, members }});
    } catch (error) {
        console.error("Get single workspace data dashboard error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}