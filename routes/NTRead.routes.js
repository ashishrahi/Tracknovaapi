import express from "express";
import { NTReadController } from "../controllers/index.js";

const router = express.Router();

router.get("/Sample", NTReadController.sample);
router.get("/SmpCurr", NTReadController.SmpCurr);
router.get("/NTCurrent", NTReadController.NTCurrent);
router.get("/VehCurrStat", NTReadController.VehCurrStat);
router.post("/GetDashData", NTReadController.GetDashData);
router.post("/GetVehicleNotMoved", NTReadController.getVehicleNotMoved);
router.get("/GetNTDashboard", NTReadController.GetNTDashboard);
router.get("/ProbWireTamp", NTReadController.probWireTamp);

export default router;