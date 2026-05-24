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
const router: Router = Router();

router.post("/createTeam/:projectId", createTeam);
router.post("/getTeam", getTeam);
router.post("/updateTeam", updateTeam);
router.post("/deleteTeam", deleteTeam);
router.post("/addTeamMember/:teamId", addTeamMember);
router.get("/workspace/:workspaceId", getTeamsByWorkspace);
router.put("/updateTeamMember/:memberId", updateTeamMember);
router.delete("/deleteTeamMember/:memberId", deleteTeamMember);
router.get("/project/:projectId", getTeamsByProject);

export default router;
