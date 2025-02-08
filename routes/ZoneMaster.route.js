import express from "express";
const router = express.Router();
import { ZoneMasterController } from "../controllers/index.js";

router.post("/AddUpdateZonemaster", ZoneMasterController.AddUpdateZoneMaster);
router.post("/GetZonemaster", ZoneMasterController.GetZoneMaster);
router.delete("/DeleteZoneMaster", ZoneMasterController.DeleteZoneMaster);

export default router;