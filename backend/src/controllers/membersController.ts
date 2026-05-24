import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js"


export const getMembers = async (req: Request, res: Response) => {
    try {
        const workspaceID = req.params.workspaceID;
        const members = await prisma.member.findMany({
            where:{
                workspaceId: Number(workspaceID)
            },
            include:{
                user:{
                    select:{
                        id:true,
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

export const updateMemberRole = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const role: string = req.body.role;
        const workspaceId: number = Number(req.params.workspaceID || req.params.workspaceId);
        const updateUser: number = Number(req.body.userId);

        if (!role) {
            return res.status(400).json({ success: false, message: "Role is required" });
        }

        if (isNaN(workspaceId) || isNaN(updateUser)) {
            return res.status(400).json({ success: false, message: "Invalid workspace ID or user ID" });
        }

        if (role === "owner"){
            return res.status(400).json({ success: false, message: "Owner cannot be changed" });
        }

        // Verify the workspace exists
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId }
        });

        if (!workspace) {
            return res.status(404).json({ success: false, message: "Workspace not found" });
        }

        // Verify the caller exists and has 'owner' role in this workspace
        const callerMember = await prisma.member.findFirst({
            where: {
                workspaceId: workspaceId,
                userId: user.id,
                isActive: true
            }
        });

        const isWorkspaceOwner = workspace.userId === user.id;

        if (!isWorkspaceOwner && (!callerMember || callerMember.role !== "owner")) {
            return res.status(403).json({ 
                success: false, 
                message: "Forbidden: Only workspace owners can update member roles." 
            });
        }

        // Find target member to get their unique ID
        const targetMember = await prisma.member.findFirst({
            where: {
                workspaceId: workspaceId,
                userId: updateUser,
                isActive: true
            }
        });

        if (!targetMember) {
            return res.status(404).json({ success: false, message: "Target member not found in this workspace" });
        }

        // Update target member's role using their unique primary key ID
        const updateRole = await prisma.member.update({
            where: {
                id: targetMember.id
            },
            data: {
                role: role
            }
        });

        return res.status(200).json({ success: true, message: "Member role updated successfully", updateRole });

    } catch (error) {
        console.error("Error in updateMemberRole:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}