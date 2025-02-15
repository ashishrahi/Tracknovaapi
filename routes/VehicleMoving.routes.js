import express from "express";
import { VehicleMovingController } from "../controllers/index.js"
const router = express.Router();

router.post("/VehicleTrack", VehicleMovingController.VehicleTrack);
router.post("/VehicleMovingTrackStatusdetnew", VehicleMovingController.VehicleMovingTrackStatusdetnew); // InComplete
router.post("/GetVechicleMileageSummary", VehicleMovingController.GetVechicleMileageSummary); 

router.post("/GetDevTamp", VehicleMovingController.GetDevTamp);
router.post("/VehicleFuelConsumenew", VehicleMovingController.VehicleFuelConsumenew);

router.post("/VehicleDetailSummarynew", VehicleMovingController.VehicleDetailSummarynew); 



export default router;