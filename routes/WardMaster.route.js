import express from "express";
const router = express.Router();
import { WardMasterController } from "../controllers/index.js";

router.post("/AddUpdateWardMaster", WardMasterController.AddUpdateWardMaster);
router.post("/GetWardMaster", WardMasterController.GetWardMaster);
router.delete("/DeletetWardMaster", WardMasterController.DeletetWardMaster);

export default router;