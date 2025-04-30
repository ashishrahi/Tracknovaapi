import express from "express";
const router = express.Router();
import { HandheldMasterController } from "../controllers/index.js";

// HandheldMaster Routes
router.post(
  "/AddUpdateHandheldMaster",
  HandheldMasterController.AddUpdateHandheldMaster
);


router.post("/GetHandheldMaster", HandheldMasterController.GetHandheldMaster);

router.post(
  "/DeleteHandheldMaster",
  HandheldMasterController.DeleteHandheldMaster
);

export default router;
