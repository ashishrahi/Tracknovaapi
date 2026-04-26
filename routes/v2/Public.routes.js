import express from "express";
import { getWorkspaceBySlug } from "../../controllers/v2/public.controller.js";

const router = express.Router();

router.get("/workspace/:workspaceSlug", getWorkspaceBySlug);

export default router;
