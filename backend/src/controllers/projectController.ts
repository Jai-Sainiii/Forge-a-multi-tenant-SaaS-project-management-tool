import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";

export const createProject = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const { name, field, description, workspaceId, status } = req.body;

    if (!name || !field || !description || !workspaceId || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: Number(workspaceId) }
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Verify that the user is an admin or owner of the workspace
    const workspaceMember = await prisma.member.findFirst({
      where: {
        workspaceId: Number(workspaceId),
        userId: user.id,
        role: { in: ["admin", "owner"] },
        isActive: true,
      },
    });

    const isWorkspaceOwner = workspace.userId === user.id;

    if (!workspaceMember && !isWorkspaceOwner) {
      return res.status(403).json({ message: "Unauthorized. Only workspace admins or owners can create a project." });
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

    if (isNaN(workspaceID)) {
      return res.status(400).json({ message: "Invalid workspace ID" });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceID }
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
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

    let projects;
    if (isWorkspaceOwner || isWorkspaceAdmin) {
      
      projects = await prisma.projects.findMany({
        where: { workspaceId: workspaceID },
        include: { tasks: true }
      });
    } else {
      
      projects = await prisma.projects.findMany({
        where: {
          workspaceId: workspaceID,
          projectMembers: {
            some: { userId: user.id }
          }
        },
        include: { tasks: true }
      });
    }

    res.json({ projects });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const singleProject = async (req: Request, res: Response)=>{
  try {
    const user = req.body.user;
    const projectID = Number(req.params.projectID);

    if (isNaN(projectID)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await prisma.projects.findUnique({
      where: { id: projectID },
      include: {
        projectMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        workspace: true
      }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const workspaceMember = await prisma.member.findFirst({
      where: {
        workspaceId: project.workspaceId,
        userId: user.id,
        isActive: true
      }
    });

    const isWorkspaceOwner = project.workspace.userId === user.id;
    const isWorkspaceAdmin = workspaceMember?.role === "admin" || workspaceMember?.role === "owner";
    const isProjectAdmin = project.projectMembers.some(pm => pm.userId === user.id && ["admin", "owner"].includes(pm.role));
    const isProjectMember = project.projectMembers.some(pm => pm.userId === user.id);

    if (!isWorkspaceOwner && !isWorkspaceAdmin && !isProjectMember) {
      return res.status(403).json({ message: "Unauthorized to access this project." });
    }

    // Determine which tasks the user is authorized to view
    let tasks;
    if (isWorkspaceOwner || isWorkspaceAdmin || isProjectAdmin) {
      // Owner/Workspace Admins/Project Admins see all tasks in this project
      tasks = await prisma.task.findMany({
        where: { projectId: projectID }
      });
    } else {
      // Regular project members only see tasks they are explicitly assigned to
      tasks = await prisma.task.findMany({
        where: {
          projectId: projectID,
          taskMembers: {
            some: { userId: user.id }
          }
        }
      });
    }

    // Attach tasks and remove raw workspace from response to keep it clean
    const { workspace, ...projectData } = project;
    const projectResult = {
      ...projectData,
      tasks
    };

    res.json({ sucess: "true", project: projectResult });
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
      include: { workspace: true }
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

    const isWorkspaceOwner = project.workspace.userId === user.id;

    if (!workspaceMember && !projectMember && !isWorkspaceOwner) {
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

export const addProjectMember = async (req: Request, res: Response) => {
  try {
    const projectID = Number(req.params.projectID);
    const user = req.body.user;
    const { userId, role, position } = req.body;

    if (isNaN(projectID)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const project = await prisma.projects.findUnique({
      where: { id: projectID },
      include: { workspace: true }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Verify caller has permissions (workspace admin/owner OR project admin)
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

    const isWorkspaceOwner = project.workspace.userId === user.id;

    if (!workspaceMember && !projectMember && !isWorkspaceOwner) {
      return res.status(403).json({ message: "Unauthorized. Only project admins or workspace admins/owners can add members to this project." });
    }

    // Verify target user is a member of the workspace
    const isWorkspaceMember = await prisma.member.findFirst({
      where: {
        workspaceId: project.workspaceId,
        userId: Number(userId),
        isActive: true,
      },
    });

    if (!isWorkspaceMember) {
      return res.status(400).json({ message: "User is not an active member of this workspace" });
    }

    // Verify target user is not already a member of the project
    const existingProjectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: project.id,
        userId: Number(userId),
      },
    });

    if (existingProjectMember) {
      return res.status(400).json({ message: "User is already a member of this project" });
    }

    const newMember = await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: Number(userId),
        role: role || "member",
        position: position || role || "member",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, member: newMember });
  } catch (error) {
    console.error("Add project member error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};