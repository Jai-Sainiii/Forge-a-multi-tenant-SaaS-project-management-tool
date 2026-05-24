import { Router } from "express";
import { createProject, getProjects, singleProject, updateProject, addProjectMember } from "../controllers/projectController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const projectRouter = Router();

projectRouter.post("/createProject", protectedRoute, createProject);
projectRouter.get("/getProjects/:workspaceID", protectedRoute, getProjects);
projectRouter.get("/singleProject/:projectID", protectedRoute, singleProject);
projectRouter.put("/updateProject/:projectID", protectedRoute, updateProject);
projectRouter.post("/addProjectMember/:projectID", protectedRoute, addProjectMember);

export default projectRouter;
