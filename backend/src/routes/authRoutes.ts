import { Router } from "express";
import { login, logout, signup, me, protectedRoute, googleAuthRedirect, googleAuthCallback } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/me", protectedRoute, me);

router.get("/google", googleAuthRedirect);
router.get("/google/callback", googleAuthCallback);

export default router;