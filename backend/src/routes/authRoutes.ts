import { Router } from "express";
import { login, logout, signup } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;