import express from "express";
import { CityMasterController } from "../controllers/index.js";

const router = express.Router();

// BinManage Routes
router.post(
  "/AddUpdateDistrictMaster",
  CityMasterController.AddUpdateCityMaster
);
router.post("/GetDistrictMaster", CityMasterController.GetCityMaster);
router.delete("/DeleteDistrictMaster", CityMasterController.DeleteCityMaster);

export default router;
