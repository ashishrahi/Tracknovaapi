import express from "express";
import { NTReadController } from "../controllers/index.js";

const router = express.Router();

router.get("/Sample", NTReadController.sample);
router.get("/SmpCurr", NTReadController.SmpCurr);
router.post("/Geofence", NTReadController.Geofence); 
router.get("/NTCurrent", NTReadController.NTCurrent);
router.get("/VehCurrStat", NTReadController.VehCurrStat);
router.post("/GetDashData", NTReadController.GetDashData); 
router.post("/GetVehicleNotMoved", NTReadController.getVehicleNotMoved);
router.get("/GetNTDashboard", NTReadController.GetNTDashboard);
router.get("/GetTopFuelCons/nos=:nos", NTReadController.GetTopFuelCons);
router.get("/GetTopFuelConsNT", NTReadController.GetTopFuelConsNT);
router.get("/GetTopFuelConsNTS/zone=:zone", NTReadController.GetTopFuelConsNTS);
router.get("/GetTopFuelConsNTOnOff/:onoff", NTReadController.GetTopFuelConsNTOnOff);
router.get("/ProbWireTamp", NTReadController.probWireTamp);
router.get("/GetRunningStatus/:stat", NTReadController.GetRunningStatus);
router.get("/GetLongIdleVeh", NTReadController.GetLongIdleVeh);
router.post("/GetVehicleMovement", NTReadController.GetVehicleMovement);

export default router;