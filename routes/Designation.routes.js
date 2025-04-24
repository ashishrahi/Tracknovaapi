import express from "express";
import { DesignationController } from "../controllers/index.js";

const router = express.Router();

// Designation Routes
router.post(
  "/AddUpdateDesignationmaster",
  DesignationController.AddUpdateDesignationmaster
);

router.post(
  "/ImportDesignation",
  DesignationController.ImportDesignation
);

router.post(
  "/GetDesignationmaster",
  DesignationController.GetDesignationmaster
);
router.delete(
  "/DeleteDesignationmaster",
  DesignationController.DeleteDesignationmaster
);

export default router;
