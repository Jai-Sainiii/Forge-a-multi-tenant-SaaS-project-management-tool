import { Router } from "express"
import { getTasks, createTask, getSingleTask, TaskSubmitToReview } from "../controllers/tasksController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.get("/:workspaceID", protectedRoute, getTasks)
router.post("/createTask/:workspaceID", protectedRoute, createTask)
router.get("/task/:taskID", protectedRoute, getSingleTask)
router.put("/submit/:taskId", protectedRoute, TaskSubmitToReview)

export default router