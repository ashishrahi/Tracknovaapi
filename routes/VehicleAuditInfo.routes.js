import express from "express";
import { VehicleAuditInfoController } from "../controllers/index.js"; 

const router = express.Router();

router.post("/AddUpdateVehicleAuditInfo", VehicleAuditInfoController.AddUpdateVehicleAuditInfo);
router.post("/GetVehicleAuditInfo", VehicleAuditInfoController.GetVehicleAuditInfo);

export default router;