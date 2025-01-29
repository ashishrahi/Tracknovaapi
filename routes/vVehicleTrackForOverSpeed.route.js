import express from "express";
const router = express.Router();
import { vVehicleTrackForOverSpeedController } from "../controllers/index.js";

router.post("/GetOverSpeedAlert", vVehicleTrackForOverSpeedController.GetOverSpeedAlert);


export default router;
