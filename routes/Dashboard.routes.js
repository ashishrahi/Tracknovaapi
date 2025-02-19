import express from "express";
import { DashboardController } from "../controllers/index.js";


const router = express.Router();

router.post("/GetDashboard", DashboardController.getDashboard)
router.post("/GetVehileCurrentDay", DashboardController.getVehicleCurrentDay)
router.post("/GetVehicleDistance", DashboardController.getVehicleDistance)
router.post("/GetAllBins", DashboardController.getAllBins)
router.post("/GetMapBinsWardWise", DashboardController.getMapBinsWardWise)
router.post("/GetvVehicleNo", DashboardController.getvVehicleNo)






export default router;