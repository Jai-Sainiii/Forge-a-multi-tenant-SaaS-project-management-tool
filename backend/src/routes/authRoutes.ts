import { Router } from "express";
import { login, logout, signup, me, protectedRoute } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/me", protectedRoute, me);

export default router;