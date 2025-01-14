import express from "express";
import { NTReadController } from "../controllers/index.js";

const router = express.Router();

router.get("/Sample", NTReadController.sample);
router.get("/SmpCurr", NTReadController.SmpCurr);
router.get("/NTCurrent", NTReadController.NTCurrent);
router.get("/VehCurrStat", NTReadController.VehCurrStat);
router.get("/ProbWireTamp", NTReadController.probWireTamp);
router.post("/GetVehicleNotMoved", NTReadController.getVehicleNotMoved);

export default router;