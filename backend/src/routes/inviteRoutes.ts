import { Router } from "express";
import { generateInvite, acceptInvite } from "../controllers/inviteController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.post("/generate/:workspaceId", protectedRoute, generateInvite);
router.post("/accept/:token", protectedRoute, acceptInvite);

export default router;
