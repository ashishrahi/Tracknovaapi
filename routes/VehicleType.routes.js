import express from "express";
import { VehicleTypeController } from "../controllers/index.js";
const router = express.Router();

router.post("/AddUpdateVehicleType", VehicleTypeController.AddUpdateVehicleType);
router.post("/GetVehicleType", VehicleTypeController.GetVehicleType);

export default router;