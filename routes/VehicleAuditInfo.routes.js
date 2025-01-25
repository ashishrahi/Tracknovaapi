import express from "express";
import { VehicleAuditInfoController } from "../controllers/index.js"; 

const router = express.Router();

router.post("/AddUpdateVehicleAuditInfo", VehicleAuditInfoController.AddUpdateVehicleAuditInfo);
router.post("/GetVehicleAuditInfo", VehicleAuditInfoController.GetVehicleAuditInfo);
router.delete("/DeleteVehicleAuditInfo", VehicleAuditInfoController.DeleteVehicleAuditInfo);

export default router;