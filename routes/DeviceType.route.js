import express from "express";
import { DeviceTypeController } from "../controllers/index.js";

const router = express.Router();

// BinManage Routes
router.post("/GetDeviceType", DeviceTypeController.GetDeviceType);

export default router;
