import { Router } from "express";
import { createProject, getProjects, singleProject, updateProject, addProjectMember, updateProjectMember, deleteProjectMember } from "../controllers/projectController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const projectRouter = Router();

projectRouter.post("/createProject", protectedRoute, createProject);
projectRouter.get("/getProjects/:workspaceID", protectedRoute, getProjects);
projectRouter.get("/singleProject/:projectID", protectedRoute, singleProject);
projectRouter.put("/updateProject/:projectID", protectedRoute, updateProject);
projectRouter.post("/addProjectMember/:projectID", protectedRoute, addProjectMember);
projectRouter.put("/updateProjectMember/:projectID/:userId", protectedRoute, updateProjectMember);
projectRouter.delete("/deleteProjectMember/:projectID/:userId", protectedRoute, deleteProjectMember);

export default projectRouter;
