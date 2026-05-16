import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";
import crypto from "crypto";

export const generateInvite = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const workspaceId = Number(req.params.workspaceId);
        const { role } = req.body;

        // Verify the caller is an admin or owner of this workspace
        const callerMember = await prisma.member.findFirst({
            where: {
                workspaceId,
                userId: user.id,
                role: { in: ["admin", "owner"] },
                isActive: true,
            },
        });

        if (!callerMember) {
            return res.status(403).json({
                success: false,
                message: "Only admins and owners can generate invite links.",
            });
        }

        // Generate a unique token
        const token = crypto.randomUUID();

        // Set expiry to 24 hours from now
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const inviteLink = await prisma.inviteLink.create({
            data: {
                token,
                workspaceId,
                createdBy: user.id,
                role: role || "member",
                expiresAt,
            },
        });

        const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
        const inviteUrl = `${FRONTEND_URL}/invite/${token}`;

        return res.status(200).json({
            success: true,
            inviteUrl,
            expiresAt: inviteLink.expiresAt,
            role: inviteLink.role,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const acceptInvite = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const { token } = req.params;

        // Look up the invite link
        const invite = await prisma.inviteLink.findUnique({
            where: { token: token as string },
            include: { workspace: { select: { title: true } } },
        });

        if (!invite) {
            return res.status(404).json({ success: false, message: "Invite link not found." });
        }

        if (invite.isUsed) {
            return res.status(410).json({ success: false, message: "This invite link has already been used." });
        }

        if (new Date() > invite.expiresAt) {
            return res.status(410).json({ success: false, message: "This invite link has expired." });
        }

        // Check if user is already a member
        const existingMember = await prisma.member.findFirst({
            where: {
                workspaceId: invite.workspaceId,
                userId: user.id,
            },
        });

        if (existingMember) {
            return res.status(409).json({
                success: false,
                message: "You are already a member of this workspace.",
                workspaceId: invite.workspaceId,
            });
        }

        // Add user as a member and mark invite as used — in a transaction
        const [member] = await prisma.$transaction([
            prisma.member.create({
                data: {
                    workspaceId: invite.workspaceId,
                    userId: user.id,
                    isActive: true,
                    role: invite.role,
                },
            }),
            prisma.inviteLink.update({
                where: { id: invite.id },
                data: { isUsed: true, usedBy: user.id },
            }),
        ]);

        return res.status(200).json({
            success: true,
            message: `You have joined "${(invite as any).workspace?.title}" as ${invite.role}.`,
            workspaceId: invite.workspaceId,
            role: member.role,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
