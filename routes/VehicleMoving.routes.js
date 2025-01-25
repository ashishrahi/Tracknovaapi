import express from "express";
import { VehicleMovingController } from "../controllers/index.js"
const router = express.Router();

router.post("/VehicleTrack", VehicleMovingController.VehicleTrack);

export default router;