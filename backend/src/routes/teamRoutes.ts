import { Router } from "express";
import {
  createTeam,
  getTeam,
  updateTeam,
  deleteTeam,
} from "../controllers/teamController.js";
const router: Router = Router();

router.post("/createTeam", createTeam);
router.post("/getTeam", getTeam);
router.post("/updateTeam", updateTeam);
router.post("/deleteTeam", deleteTeam);

export default router;
