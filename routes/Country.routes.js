import express from "express";
import { CountryMasterController } from "../controllers/index.js";

const router = express.Router();

// BinManage Routes
router.post(
  "/AddUpdateCountryMaster",
  CountryMasterController.AddUpdateCountryMaster
);

// Import Countries
router.post("/ImportCountries",CountryMasterController.ImportCountries)

// Get Countries
router.post("/GetCountryMaster", CountryMasterController.GetCountryMaster);

// Delete Countries
router.delete(
  "/DeleteCountryMaster",
  CountryMasterController.DeleteCountryMaster
);

export default router;
