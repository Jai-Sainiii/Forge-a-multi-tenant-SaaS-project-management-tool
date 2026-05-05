import { check } from "../controllers/checkController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";
import { Router } from "express";

const router: Router = Router();

router.get("/check", protectedRoute, check);

export default router;