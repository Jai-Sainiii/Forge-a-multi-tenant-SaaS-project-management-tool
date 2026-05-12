import { Router } from "express"
import { getMembers } from "../controllers/membersController.js"
import { protectedRoute } from "../middleware/authMiddleware.js"

const router : Router = Router()

router.get("/:workspaceID", protectedRoute, getMembers)

export default router