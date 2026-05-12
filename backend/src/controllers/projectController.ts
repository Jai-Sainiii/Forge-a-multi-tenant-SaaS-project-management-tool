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