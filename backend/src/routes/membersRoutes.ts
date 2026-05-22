import { Router } from "express"
import { getMembers, updateMemberRole } from "../controllers/membersController.js"
import { protectedRoute } from "../middleware/authMiddleware.js"

const router : Router = Router()

router.get("/:workspaceID", protectedRoute, getMembers)
router.put("/:workspaceID/role", protectedRoute, updateMemberRole)

export default router