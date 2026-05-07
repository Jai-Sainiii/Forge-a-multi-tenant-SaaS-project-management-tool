import { Router } from "express";
import {
  createWorkSpace,
  getAllWorkSpace,
  getWorkSpace,
} from "../controllers/workSpaceController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.post("/createWorkSpace", protectedRoute, createWorkSpace);
router.get("/getAllWorkSpace", getAllWorkSpace);
router.get("/getWorkSpace", protectedRoute, getWorkSpace);

export default router;