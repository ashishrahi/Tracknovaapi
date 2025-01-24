import express from "express";
import { NodePermissionController } from "../controllers/index.js"
const router = express.Router();

router.post("/AddUpdateNodePermission", NodePermissionController.AddUpdateNodePermission);

export default router;