import redis from "../config/redis/client.js";
import { prisma } from "../lib/prisma.js";
import { type Request, type Response } from "express";

export const createWorkSpace = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const workspace = await prisma.workspace.create({
      data: {
        userId: user.id,
        title: req.body.title,
        companyname: req.body.companyname,
        describtion: req.body.describtion,
        visibility: req.body.visibility,
      },
    });

    const workspaceMember = await prisma.member.create({
        data: {
            workspaceId: workspace.id,
            userId: user.id,
            isActive: true,
            role: "owner",
        },
    });

    res.json({ success: true, workspace, workspaceMember });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllWorkSpace = async (req: Request, res: Response) => {
  try {
    const workspace = await prisma.workspace.findMany({
        where: {
            visibility: "public",
        },
    });
    res.json({ success: true, workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getWorkSpace = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const workspace = await prisma.workspace.findMany({
            where: {
                userId: user.id,
            },
        });
        res.json({ success: true, workspace });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const joinWorkSpace = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const workspace = await prisma.workspace.update({
            where: {
                id: req.body.id,
            },
            data: {
                members: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });
        res.json({ success: true, workspace });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const updateWorkSpace = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const workspaceID = Number(req.params.workspaceID);
    const { title, companyname, describtion, visibility } = req.body;

    if (isNaN(workspaceID)) {
      return res.status(400).json({ success: false, message: "Invalid workspace ID" });
    }

    const member = await prisma.member.findFirst({
      where: {
        workspaceId: workspaceID,
        userId: user.id,
        role: "owner",
        isActive: true,
      },
    });

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceID },
    });

    if (!workspace) {
      return res.status(404).json({ success: false, message: "Workspace not found" });
    }

    if (!member && workspace.userId !== user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized. Only the workspace owner can update settings." });
    }

    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (companyname !== undefined) updateData.companyname = companyname;
    if (describtion !== undefined) updateData.describtion = describtion;
    if (visibility !== undefined) updateData.visibility = visibility;

    const updatedWorkspace = await prisma.workspace.update({
      where: { id: workspaceID },
      data: updateData,
    });

    await redis.del(`workspace:${workspaceID}`);
    await redis.del(`workspace:${workspaceID} user:${user.id}`);

    res.json({ success: true, workspace: updatedWorkspace });
  } catch (error) {
    console.error("Update workspace error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteWorkSpace = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const workspaceID = Number(req.params.workspaceID);

    if (isNaN(workspaceID)) {
      return res.status(400).json({ success: false, message: "Invalid workspace ID" });
    }

    const member = await prisma.member.findFirst({
      where: {
        workspaceId: workspaceID,
        userId: user.id,
        role: "owner",
        isActive: true,
      },
    });

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceID },
    });

    if (!workspace) {
      return res.status(404).json({ success: false, message: "Workspace not found" });
    }

    if (!member && workspace.userId !== user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized. Only the workspace owner can delete this workspace." });
    }

    await prisma.workspace.delete({
      where: { id: workspaceID },
    });

    await redis.del(`workspace:${workspaceID}`);
    await redis.del(`workspace:${workspaceID} user:${user.id}`);

    res.json({ success: true, message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("Delete workspace error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const updateWorkspaceAvatarColor = async(req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const workspaceID = Number(req.params.workspaceID);
    const { backgroundColor, textColor } = req.body;

    if (isNaN(workspaceID)) {
      return res.status(400).json({ success: false, message: "Invalid workspace ID" });
    }

    const member = await prisma.member.findFirst({
      where: {
        workspaceId: workspaceID,
        userId: user.id,
        role: "owner",
        isActive: true,
      },
    });

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceID },
    });

    if (!workspace) {
      return res.status(404).json({ success: false, message: "Workspace not found" });
    }

    if (!member && workspace.userId !== user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized. Only the workspace owner can update settings." });
    }

    const currentColor = (workspace.color as Record<string, any>) || {};
    const updatedColor = {
      ...currentColor,
      ...(backgroundColor !== undefined ? { backgroundColor } : {}),
      ...(textColor !== undefined ? { textColor } : {})
    };

    const updatedWorkspace = await prisma.workspace.update({
      where: { id: workspaceID },
      data: {
        color: updatedColor
      },
    });

    await redis.del(`workspace:${workspaceID}`);
    await redis.del(`workspace:${workspaceID} user:${user.id}`);

    res.json({ success: true, workspace: updatedWorkspace });
  } catch (error) {
    console.error("Update workspace color error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}