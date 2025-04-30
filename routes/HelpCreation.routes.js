import express from "express";
const router = express.Router();
import { HelpCreationController } from "../controllers/index.js";


// HelpCreation Routes
router.post(
  "/AddHelpCreation",
  HelpCreationController.AddHelpCreation
);

router.post("/GetHelpCreation", HelpCreationController.GetHelpCreation);

export default router;
