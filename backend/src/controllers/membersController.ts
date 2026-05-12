import { type Request, type Response } from "express";
import {prisma} from "../lib/prisma.js"


export const getMembers = async(req:Request,res:Response)=>{
    try {
        const workspaceID = req.params.workspaceID;
        const members = await prisma.member.findMany({
            where:{
                workspaceId: Number(workspaceID)
            },
            include:{
                user:{
                    select:{
                        name:true,
                        email:true
                    }
                }
            }
        })
        return res.status(200).json({success:true,members})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}