import express from "express";
const router = express.Router();
import { ZoneMasterController } from "../controllers/index.js";

router.post("/AddUpdateZoneMaster", ZoneMasterController.AddUpdateZoneMaster);
router.post("/GetZoneMaster", ZoneMasterController.GetZoneMaster);
router.delete("/DeleteZoneMaster", ZoneMasterController.DeleteZoneMaster);

export default router;