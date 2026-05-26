import { Router } from "express"
import { getMembers, updateMemberRole, removeMember } from "../controllers/membersController.js"
import { protectedRoute } from "../middleware/authMiddleware.js"

const router : Router = Router()

router.get("/:workspaceID", protectedRoute, getMembers)
router.put("/:workspaceID/role", protectedRoute, updateMemberRole)
router.delete("/:workspaceID/:userId", protectedRoute, removeMember)

export default router