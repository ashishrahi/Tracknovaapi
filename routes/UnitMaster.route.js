import express from "express";
const router = express.Router();
import { UnitMasterController } from "../controllers/index.js";

router.post("/AddUpdateUnitMaster", UnitMasterController.AddUpdateUnitMaster);
router.post("/GetUnitMaster", UnitMasterController.GetUnitMaster);
router.delete("/DeleteUnitMaster", UnitMasterController.DeleteUnitMaster);

export default router;