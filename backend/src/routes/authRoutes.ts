import { Router } from "express";
import { login, logout, signup, me, protectedRoute, googleAuthRedirect, googleAuthCallback, verifyOtp, resendOtp, forgotPassword, resetPassword } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/me", protectedRoute, me);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/google", googleAuthRedirect);
router.get("/google/callback", googleAuthCallback);

export default router;