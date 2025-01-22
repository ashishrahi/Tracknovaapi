import express from "express";
import { FuelCorrectionController } from "../controllers/index.js";

const router = express.Router();

// BinManage Routes
router.post("/AddUpdateFuelCorrection", FuelCorrectionController.AddUpdateFuelCorrection);
router.post("/GetFuelCorrection", FuelCorrectionController.GetFuelCorrection);
router.delete("/DeleteFuelCorrection", FuelCorrectionController.DeleteFuelCorrection);

export default router;
