import express from "express";
import { FuelTypeController } from "../controllers/index.js";

const router = express.Router();

// BinManage Routes
router.post("/AddUpdateFuelType", FuelTypeController.AddUpdateFuelType);
router.post("/GetFuelType", FuelTypeController.GetFuelType);
router.delete("/DeleteFuelType", FuelTypeController.DeleteFuelType);

export default router;
