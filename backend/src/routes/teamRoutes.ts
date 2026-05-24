import { Router } from "express";
import {
  createTeam,
  getTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  getTeamsByWorkspace,
  updateTeamMember,
  deleteTeamMember,
  getTeamsByProject
} from "../controllers/teamController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.post("/createTeam/:projectId", protectedRoute, createTeam);
router.post("/getTeam", protectedRoute, getTeam);
router.post("/updateTeam", protectedRoute, updateTeam);
router.post("/deleteTeam", protectedRoute, deleteTeam);
router.post("/addTeamMember/:teamId", protectedRoute, addTeamMember);
router.get("/workspace/:workspaceId", protectedRoute, getTeamsByWorkspace);
router.put("/updateTeamMember/:memberId", protectedRoute, updateTeamMember);
router.delete("/deleteTeamMember/:memberId", protectedRoute, deleteTeamMember);
router.get("/project/:projectId", protectedRoute, getTeamsByProject);

export default router;
