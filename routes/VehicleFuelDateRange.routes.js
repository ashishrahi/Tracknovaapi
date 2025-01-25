import express from "express";
import { VehicleFuelDateRangeController } from "../controllers/index.js";
const router = express.Router();

router.post("VehicleFuelDateRange", VehicleFuelDateRangeController.VehicleFuelDateRange)

export default router;