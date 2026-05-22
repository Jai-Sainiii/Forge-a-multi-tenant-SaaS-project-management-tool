import { Router } from "express";
import {
  createWorkSpace,
  getAllWorkSpace,
  getWorkSpace,
  updateWorkSpace,
  deleteWorkSpace,
  updateWorkspaceAvatarColor,
} from "../controllers/workSpaceController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.post("/createWorkSpace", protectedRoute, createWorkSpace);
router.get("/getAllWorkSpace", getAllWorkSpace);
router.get("/getWorkSpace", protectedRoute, getWorkSpace);
router.put("/updateWorkSpace/:workspaceID", protectedRoute, updateWorkSpace);
router.put("/updateWorkspaceAvatarColor/:workspaceID", protectedRoute, updateWorkspaceAvatarColor);
router.delete("/deleteWorkSpace/:workspaceID", protectedRoute, deleteWorkSpace);

export default router;