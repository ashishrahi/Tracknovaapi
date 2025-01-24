import express from "express";
import { MapVehicleDataController } from "../controllers/index.js"
const router = express.Router();

router.post("/GetMapVehicleData", MapVehicleDataController.GetMapVehicleData)


export default router;