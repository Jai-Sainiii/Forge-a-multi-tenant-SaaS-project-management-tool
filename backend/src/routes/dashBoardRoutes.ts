import { getAllWorkspaces, getSingleWorkspaceData } from "../controllers/dashBoardController.js";
import { Router } from "express";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/getAllWorkspaces", protectedRoute, getAllWorkspaces);
router.get("/workspace/:workspaceID", getSingleWorkspaceData);


export default router;