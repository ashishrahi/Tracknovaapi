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
router.get("/GetTopFuelCons", NTReadController.GetTopFuelCons);
router.get("/GetTopFuelConsNT", NTReadController.GetTopFuelConsNT);
router.get("/GetTopFuelConsNTOnOff", NTReadController.GetTopFuelConsNTOnOff);
router.get("/ProbWireTamp", NTReadController.probWireTamp);
router.get("/GetRunningStatus", NTReadController.GetRunningStatus);
router.get("/GetLongIdleVeh", NTReadController.GetLongIdleVeh);
router.post("/GetVehicleMovement", NTReadController.GetVehicleMovement);

export default router;