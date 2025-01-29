import express from "express";
const router = express.Router();
import { vVehicletrackHisController } from "../controllers/index.js";

router.post("/GetvVehicletrackHis", vVehicletrackHisController.GetvVehicletrackHis);


export default router;