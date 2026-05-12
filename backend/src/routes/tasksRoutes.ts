import { Router } from "express"
import { getTasks, createTask } from "../controllers/tasksController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.get("/:workspaceID", protectedRoute, getTasks)
router.post("/createTask/:workspaceID", protectedRoute, createTask)

export default router