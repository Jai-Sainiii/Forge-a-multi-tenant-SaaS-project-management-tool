import { getAllWorkspaces, getSingleWorkspaceData } from "../controllers/dashBoardController.js";
import { Router } from "express";

const router = Router();

router.get("/getAllWorkspaces", getAllWorkspaces);
router.get("/workspace/:workspaceID", getSingleWorkspaceData);


export default router;