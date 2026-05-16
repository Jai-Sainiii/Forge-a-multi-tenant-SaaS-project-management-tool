import { type Request, type Response } from "express";
import {prisma} from "../lib/prisma.js"

export const getTasks = async(req:Request,res:Response)=>{
    try {
        const workspaceID = req.params.workspaceID;
        const tasks = await prisma.task.findMany({
            where:{
                workspaceId: Number(workspaceID)
            },
            include: {
                project: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return res.status(200).json({success:true,tasks})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}


export const createTask = async(req:Request,res:Response)=>{
    try {
        const user = req.body.user;
        const workspaceId = Number(req.params.workspaceID);
        const {title,description,status,projectId,priority} = req.body;
        const projectID = Number(projectId)
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
        return res.status(200).json({success:true, task, taskMember})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export const getSingleTask = async(req:Request,res:Response)=>{
    try {
        const taskID = Number(req.params.taskID);
        const task = await prisma.task.findUnique({
            where:{
                id: taskID
            },
            include:{
                project:{
                    select:{
                        name:true
                    }
                },
                workspace:{
                    select:{
                        title:true
                    }
                },
                taskMembers:{
                    select:{
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
        })
        return res.status(200).json({success:true, task})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export const updateTask = async(req:Request,res:Response)=>{
    try {
        const { taskId } = req.params;
        const user = req.body.user;
        const { title, description, status, priority } = req.body;
        const taskID = Number(taskId);

        // Verify the user is a task admin
        const taskMember = await prisma.taskMember.findFirst({
            where: {
                taskId: taskID,
                userId: user.id,
                role: "admin"
            }
        });

        if (!taskMember) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only task admins can update this task." });
        }

        // Build dynamic update data — only include fields that were provided
        const updateData: Record<string, any> = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (priority !== undefined) updateData.priority = priority;

        const task = await prisma.task.update({
            where: { id: taskID },
            data: updateData,
            include: {
                project: { select: { name: true } },
                workspace: { select: { title: true } },
                taskMembers: {
                    select: {
                        user: { select: { name: true, email: true, id: true } },
                        role: true
                    }
                }
            }
        });

        return res.status(200).json({ success: true, task });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const deleteTask = async(req:Request,res:Response)=>{
    try {
        const {id} = req.body;
        const task = await prisma.task.delete({
            where:{
                id:Number(id)
            }
        })
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
        const TaskID = Number(taskId);
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

        // Check if the user is an admin of the task
        const taskMember = await prisma.taskMember.findFirst({
            where: {
                taskId: taskID,
                userId: user.id,
                role: "admin"
            }
        });

        if (!taskMember) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only task admins can update the status directly." });
        }

        const task = await prisma.task.update({
            where: {
                id: taskID
            },
            data: {
                status
            }
        });

        return res.status(200).json({ success: true, task });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}