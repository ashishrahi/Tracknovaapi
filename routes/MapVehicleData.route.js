import express from "express";
const router = express.Router();
import { MapVehicleDataController } from "../controllers/index.js";

router.get("/GetMapVehicleData", MapVehicleDataController.GetMapVehicleData);

export default router;