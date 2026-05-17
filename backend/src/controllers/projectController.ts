import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";

export const createProject = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const { name, field, description, workspaceId, status } = req.body;

    if (!name || !field || !description || !workspaceId || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const project = await prisma.projects.create({
      data: {
        name: name,
        field: field,
        description: description,
        workspaceId: workspaceId,
        status: status,
      },
    });

    const projectMember = await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: user.id,
        role: "admin",
        position: "admin",
      },
    });

    res.json({ message: "Project created successfully", project, projectMember });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const workspaceID = Number(req.params.workspaceID);
    const projects = await prisma.projects.findMany({
      where: {
        workspaceId: workspaceID,
        projectMembers: {
          some: {
            userId: user.id,
          },
        },
      },
    });
    res.json({ projects });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const singleProject = async (req: Request, res: Response)=>{
  try {
    const projectID = Number(req.params.projectID);
    const project = await prisma.projects.findUnique({
      where: {
        id: projectID,
      },
      include: {
        projectMembers: true,
        tasks: true,
      },
    });
    res.json({ sucess: "true", project });
  } catch (error) {
    console.error("Get single project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateProject = async (req: Request, res: Response) => {
  try {
    const projectID = Number(req.params.projectID);
    const user = req.body.user;
    const { name, field, description, status } = req.body;

    if (isNaN(projectID)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    
    const project = await prisma.projects.findUnique({
      where: { id: projectID },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    
    const workspaceMember = await prisma.member.findFirst({
      where: {
        workspaceId: project.workspaceId,
        userId: user.id,
        role: { in: ["admin", "owner"] },
        isActive: true,
      },
    });

   
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: project.id,
        userId: user.id,
        role: "admin",
      },
    });

    if (!workspaceMember && !projectMember) {
      return res.status(403).json({ message: "Unauthorized. Only workspace admins/owners or project admins can update this project." });
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (field !== undefined) updateData.field = field;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    const updatedProject = await prisma.projects.update({
      where: { id: projectID },
      data: updateData,
      include: {
        projectMembers: true,
        tasks: true,
      },
    });

    return res.status(200).json({ success: true, project: updatedProject });
  } catch (error) {
    console.error("Update project error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};