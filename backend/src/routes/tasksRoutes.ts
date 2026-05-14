import { Router } from "express"
import { getTasks, createTask, getSingleTask, TaskSubmitToReview, updateTaskStatus } from "../controllers/tasksController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.get("/:workspaceID", protectedRoute, getTasks)
router.post("/createTask/:workspaceID", protectedRoute, createTask)
router.get("/task/:taskID", protectedRoute, getSingleTask)
router.put("/submit/:taskId", protectedRoute, TaskSubmitToReview)
router.put("/status/:taskId", protectedRoute, updateTaskStatus)

export default router