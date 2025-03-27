import express from "express";
import { CountryMasterController } from "../controllers/index.js";

const router = express.Router();

// BinManage Routes
router.post(
  "/AddUpdateCountryMaster",
  CountryMasterController.AddUpdateCountryMaster
);
router.post("/GetCountryMaster", CountryMasterController.GetCountryMaster);

router.delete(
  "/DeleteCountryMaster",
  CountryMasterController.DeleteCountryMaster
);

export default router;
