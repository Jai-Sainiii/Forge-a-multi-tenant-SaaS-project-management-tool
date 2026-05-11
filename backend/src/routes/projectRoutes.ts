import { Router } from "express";
import { createProject, getProjects } from "../controllers/projectController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const projectRouter = Router();

projectRouter.post("/createProject", protectedRoute, createProject);
projectRouter.get("/getProjects/:workspaceID", protectedRoute, getProjects);

export default projectRouter;
