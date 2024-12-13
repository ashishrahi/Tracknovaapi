import express from "express";
import { DashboardController } from "../controllers/index.js";


const router = express.Router();

router.post("/GetVehicleDistance", DashboardController.getVehicleDistance)

export default router;