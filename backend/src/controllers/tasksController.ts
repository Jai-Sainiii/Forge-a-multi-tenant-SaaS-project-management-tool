import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";
import redis from "../config/redis/client.js";

export const getTasks = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const workspaceID = Number(req.params.workspaceID);

        if (isNaN(workspaceID)) {
            return res.status(400).json({ success: false, message: "Invalid workspace ID" });
        }

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceID }
        });

        if (!workspace) {
            return res.status(404).json({ success: false, message: "Workspace not found" });
        }

        const workspaceMember = await prisma.member.findFirst({
            where: {
                workspaceId: workspaceID,
                userId: user.id,
                isActive: true
            }
        });

        const isWorkspaceOwner = workspace.userId === user.id;
        const isWorkspaceAdmin = workspaceMember?.role === "admin" || workspaceMember?.role === "owner";

        let tasks;
        if (isWorkspaceOwner || isWorkspaceAdmin) {
            // Workspace owners and admins can see all tasks in the workspace
            tasks = await prisma.task.findMany({
                where: { workspaceId: workspaceID },
                include: {
                    project: {
                        select: { name: true }
                    }
                }
            });
        } else {
            // Find projects in this workspace where the user is a project admin
            const adminProjects = await prisma.projectMember.findMany({
                where: {
                    userId: user.id,
                    role: "admin",
                    project: { workspaceId: workspaceID }
                }
            });
            const adminProjectIds = adminProjects.map(ap => ap.projectId);

            // Regular members see tasks they are a taskMember of OR any tasks in projects they admin
            tasks = await prisma.task.findMany({
                where: {
                    workspaceId: workspaceID,
                    OR: [
                        { taskMembers: { some: { userId: user.id } } },
                        { projectId: { in: adminProjectIds } }
                    ]
                },
                include: {
                    project: {
                        select: { name: true }
                    }
                }
            });
        }

        return res.status(200).json({ success: true, tasks })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const createTask = async(req:Request,res:Response)=>{
    try {
        const user = req.body.user;
        const workspaceId = Number(req.params.workspaceID);
        const {title,description,status,projectId,priority,assigneeIds} = req.body;
        const projectID = Number(projectId);

        if (isNaN(workspaceId) || isNaN(projectID)) {
            return res.status(400).json({ success: false, message: "Invalid workspace or project ID" });
        }

        // Verify the user is a project admin/owner OR a workspace admin/owner
        const projectMember = await prisma.projectMember.findFirst({
            where: {
                projectId: projectID,
                userId: user.id,
                role: { in: ["admin", "owner"] }
            }
        });

        const workspaceMember = await prisma.member.findFirst({
            where: {
                workspaceId,
                userId: user.id,
                role: { in: ["admin", "owner"] },
                isActive: true
            }
        });

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId }
        });
        const isWorkspaceOwner = workspace?.userId === user.id;

        if (!projectMember && !workspaceMember && !isWorkspaceOwner) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only project admins, workspace admins, or workspace owners can create tasks in this project." });
        }

        const task = await prisma.task.create({
            data:{
                title,
                description,
                status,
                projectId: projectID,
                workspaceId,
                priority: priority || "low"
            }     
        })

        const taskMember = await prisma.taskMember.create({
            data: {
                taskId: task.id,
                userId: user.id,
                role: "admin"
            }
        })

        if (assigneeIds && Array.isArray(assigneeIds)) {
            const memberData = assigneeIds
                .filter((uid: any) => Number(uid) !== Number(user.id))
                .map((uid: any) => ({
                    taskId: task.id,
                    userId: Number(uid),
                    role: "member"
                }));
            if (memberData.length > 0) {
                await prisma.taskMember.createMany({
                    data: memberData
                });
            }
        }

        return res.status(200).json({success:true, task, taskMember})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export const getSingleTask = async(req:Request,res:Response)=>{
    try {
        const user = req.body.user;
        const taskID = Number(req.params.taskID);

        if (isNaN(taskID)) {
            return res.status(400).json({ success: false, message: "Invalid task ID" });
        }

        const task = await prisma.task.findUnique({
            where:{
                id: taskID
            },
            include:{
                project:{
                    include: {
                        projectMembers: {
                            where: { userId: user.id }
                        }
                    }
                },
                workspace:{
                    include: {
                        members: {
                            where: { userId: user.id, isActive: true }
                        }
                    }
                },
                taskMembers:{
                    select:{
                        userId: true,
                        user:{
                            select:{
                                name:true,
                                email:true,
                                id:true
                            }
                        },
                        role: true
                    }
                }
            }
        });

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Access checks
        const isWorkspaceOwner = task.workspace.userId === user.id;
        const isWorkspaceAdmin = task.workspace.members.some(m => ["admin", "owner"].includes(m.role));
        const isProjectAdmin = task.project.projectMembers.some(pm => ["admin", "owner"].includes(pm.role));
        const isTaskMember = task.taskMembers.some(tm => tm.userId === user.id);

        if (!isWorkspaceOwner && !isWorkspaceAdmin && !isProjectAdmin && !isTaskMember) {
            return res.status(403).json({ success: false, message: "Unauthorized. You do not have access to view this task." });
        }

        // Format clean response
        const { project, workspace, ...taskData } = task;
        const cleanTask = {
            ...taskData,
            project: { name: project.name },
            workspace: { title: workspace.title }
        };

        return res.status(200).json({success:true, task: cleanTask})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export const updateTask = async(req:Request,res:Response)=>{
    try {
        const { taskId } = req.params;
        const user = req.body.user;
        const { title, description, status, priority, assigneeIds } = req.body;
        const taskID = Number(taskId);

        if (isNaN(taskID)) {
            return res.status(400).json({ success: false, message: "Invalid task ID" });
        }

        const taskObj = await prisma.task.findUnique({
            where: { id: taskID },
            include: {
                project: {
                    include: {
                        projectMembers: {
                            where: { userId: user.id }
                        }
                    }
                },
                workspace: {
                    include: {
                        members: {
                            where: { userId: user.id, isActive: true }
                        }
                    }
                }
            }
        });

        if (!taskObj) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Access checks
        const isWorkspaceOwner = taskObj.workspace.userId === user.id;
        const isWorkspaceAdmin = taskObj.workspace.members.some(m => ["admin", "owner"].includes(m.role));
        const isProjectAdmin = taskObj.project.projectMembers.some(pm => ["admin", "owner"].includes(pm.role));
        const taskMember = await prisma.taskMember.findFirst({
            where: {
                taskId: taskID,
                userId: user.id,
                role: "admin"
            }
        });

        if (!taskMember && !isWorkspaceOwner && !isWorkspaceAdmin && !isProjectAdmin) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only task admins, project admins, or workspace admins can update this task." });
        }

        // Build dynamic update data — only include fields that were provided
        const updateData: Record<string, any> = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (priority !== undefined) updateData.priority = priority;

        await prisma.task.update({
            where: { id: taskID },
            data: updateData
        });

        if (assigneeIds !== undefined && Array.isArray(assigneeIds)) {
            const projectMembers = await prisma.projectMember.findMany({
                where: { projectId: taskObj.projectId }
            });
            const projectMemberUserIds = projectMembers.map(pm => pm.userId);

            const invalidAssignees = assigneeIds.filter(uid => !projectMemberUserIds.includes(Number(uid)));
            if (invalidAssignees.length > 0) {
                return res.status(400).json({ success: false, message: "One or more assignees are not members of this project." });
            }

            const existingAdmins = await prisma.taskMember.findMany({
                where: { taskId: taskID, role: "admin" }
            });
            const adminUserIds = existingAdmins.map(m => m.userId);

            await prisma.taskMember.deleteMany({
                where: { taskId: taskID }
            });

            const allAssigneeIds = Array.from(new Set([...assigneeIds.map(Number), ...adminUserIds]));
            const newMemberData = allAssigneeIds.map((uid) => ({
                taskId: taskID,
                userId: uid,
                role: adminUserIds.includes(uid) ? "admin" : "member"
            }));

            if (newMemberData.length > 0) {
                await prisma.taskMember.createMany({
                    data: newMemberData
                });
            }
        }

        const task = await prisma.task.findUnique({
            where: { id: taskID },
            include: {
                project: { select: { name: true } },
                workspace: { select: { title: true } },
                taskMembers: {
                    select: {
                        userId: true,
                        user: { select: { name: true, email: true, id: true } },
                        role: true
                    }
                }
            }
        });

        await redis.del(`workspace:${taskObj.workspaceId}`);

        return res.status(200).json({ success: true, task });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const deleteTask = async(req:Request,res:Response)=>{
    try {
        const user = req.body.user;
        const {id} = req.body;
        const taskID = Number(id);

        if (isNaN(taskID)) {
            return res.status(400).json({ success: false, message: "Invalid task ID" });
        }

        const taskObj = await prisma.task.findUnique({
            where: { id: taskID },
            include: {
                project: {
                    include: {
                        projectMembers: {
                            where: { userId: user.id }
                        }
                    }
                },
                workspace: {
                    include: {
                        members: {
                            where: { userId: user.id, isActive: true }
                        }
                    }
                }
            }
        });

        if (!taskObj) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Access checks
        const isWorkspaceOwner = taskObj.workspace.userId === user.id;
        const isWorkspaceAdmin = taskObj.workspace.members.some(m => ["admin", "owner"].includes(m.role));
        const isProjectAdmin = taskObj.project.projectMembers.some(pm => ["admin", "owner"].includes(pm.role));
        const taskMember = await prisma.taskMember.findFirst({
            where: {
                taskId: taskID,
                userId: user.id,
                role: "admin"
            }
        });

        if (!taskMember && !isWorkspaceOwner && !isWorkspaceAdmin && !isProjectAdmin) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only task admins, project admins, or workspace owners can delete this task." });
        }

        const task = await prisma.task.delete({
            where:{
                id: taskID
            }
        })

        await redis.del(`workspace:${taskObj.workspaceId}`);
        await redis.del(`workspace:${taskObj.workspaceId} user:${user.id}`);

        return res.status(200).json({success:true,task})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export const TaskSubmitToReview = async(req:Request,res:Response)=>{
    try {
        const {taskId} = req.params;
        const {submittionType, submittedTextorLink} = req.body;
        const user = req.body.user;
        const TaskID = Number(taskId);

        if (isNaN(TaskID)) {
            return res.status(400).json({ success: false, message: "Invalid task ID" });
        }

        const taskObj = await prisma.task.findUnique({
            where: { id: TaskID },
            include: {
                project: {
                    include: {
                        projectMembers: {
                            where: { userId: user.id }
                        }
                    }
                },
                workspace: {
                    include: {
                        members: {
                            where: { userId: user.id, isActive: true }
                        }
                    }
                }
            }
        });

        if (!taskObj) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const isWorkspaceOwner = taskObj.workspace.userId === user.id;
        const isWorkspaceAdmin = taskObj.workspace.members.some(m => ["admin", "owner"].includes(m.role));
        const isProjectAdmin = taskObj.project.projectMembers.some(pm => ["admin", "owner"].includes(pm.role));
        const taskMember = await prisma.taskMember.findFirst({
            where: {
                taskId: TaskID,
                userId: user.id
            }
        });

        if (!taskMember && !isWorkspaceOwner && !isWorkspaceAdmin && !isProjectAdmin) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only task members or admins can submit this task for review." });
        }

        const task = await prisma.task.update({
            where:{
                id: TaskID
            },
            data:{
                status:"review",
                submittionType,
                submittedTextorLink
            }
        })

        await redis.del(`workspace:${taskObj.workspaceId}`);
        await redis.del(`workspace:${taskObj.workspaceId} user:${user.id}`);

        return res.status(200).json({success:true, task})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export const updateTaskStatus = async(req:Request, res:Response)=>{
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const user = req.body.user;
        const taskID = Number(taskId);

        if (isNaN(taskID)) {
            return res.status(400).json({ success: false, message: "Invalid task ID" });
        }

        const taskObj = await prisma.task.findUnique({
            where: { id: taskID },
            include: {
                project: {
                    include: {
                        projectMembers: {
                            where: { userId: user.id }
                        }
                    }
                },
                workspace: {
                    include: {
                        members: {
                            where: { userId: user.id, isActive: true }
                        }
                    }
                }
            }
        });

        if (!taskObj) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Access checks
        const isWorkspaceOwner = taskObj.workspace.userId === user.id;
        const isWorkspaceAdmin = taskObj.workspace.members.some(m => ["admin", "owner"].includes(m.role));
        const isProjectAdmin = taskObj.project.projectMembers.some(pm => ["admin", "owner"].includes(pm.role));
        const taskMember = await prisma.taskMember.findFirst({
            where: {
                taskId: taskID,
                userId: user.id,
                role: "admin"
            }
        });

        if (!taskMember && !isWorkspaceOwner && !isWorkspaceAdmin && !isProjectAdmin) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only task admins, project admins, or workspace owners can update status." });
        }

        const task = await prisma.task.update({
            where: {
                id: taskID
            },
            data: {
                status
            }
        });

        await redis.del(`workspace:${taskObj.workspaceId}`);
        await redis.del(`workspace:${taskObj.workspaceId} user:${user.id}`);

        return res.status(200).json({ success: true, task });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}