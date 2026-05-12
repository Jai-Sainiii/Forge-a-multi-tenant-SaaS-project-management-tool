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
        const {title,description,status,projectId} = req.body;
        const projectID = Number(projectId)
        const task = await prisma.task.create({
            data:{
                title,
                description,
                status,
                projectId: projectID,
                workspaceId
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

export const updateTask = async(req:Request,res:Response)=>{
    try {
        const {id,title,description,status,projectId,workspaceId} = req.body;
        const task = await prisma.task.update({
            where:{
                id:Number(id)
            },
            data:{
                title,
                description,
                status,
                projectId: Number(projectId),
                workspaceId: Number(workspaceId)
            }
        })
        return res.status(200).json({success:true,task})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
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