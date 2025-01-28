import express from "express";
import { VehicleTypeController } from "../controllers/index.js";
const router = express.Router();

router.post("/AddUpdateVehicleType", VehicleTypeController.AddUpdateVehicleType);
router.post("/GetVehicleType", VehicleTypeController.GetVehicleType);
router.delete("/DeleteVehicleType", VehicleTypeController.DeleteVehicleType);

// _eScarpDb.v01_VehicleType database needed. so skipped thi sprocess
router.post("/AddUpdateEscrapVehicleType", VehicleTypeController.AddUpdateEscrapVehicleType); 
router.delete("/DeleteEscrapVehicleType", VehicleTypeController.DeleteEscrapVehicleType); 
router.post("/GetEscrapVehicleType", VehicleTypeController.GetEscrapVehicleType); 

export default router;