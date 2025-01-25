import express from "express";
import { VehicleTypeController } from "../controllers/index.js";
const router = express.Router();

router.post("/AddUpdateVehicleType", VehicleTypeController.AddUpdateVehicleType);
router.post("/GetVehicleType", VehicleTypeController.GetVehicleType);
router.delete("/DeleteVehicleType", VehicleTypeController.DeleteVehicleType);

export default router;