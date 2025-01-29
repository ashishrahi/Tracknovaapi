import express from "express";
import { DesignationController } from "../controllers/index.js";

const router = express.Router();

// BinManage Routes
router.post(
  "/AddUpdateDesignationMaster",
  DesignationController.AddUpdateDesignationMaster
);
router.post(
  "/GetDesignationMaster",
  DesignationController.GetDesignationMaster
);
router.delete(
  "/DeleteDesignationMaster",
  DesignationController.DeleteDesignationMaster
);

export default router;
