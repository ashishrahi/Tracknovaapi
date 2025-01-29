import express from "express";
const router = express.Router();
import { TripStartController } from "../controllers/index.js";

router.post("/TripStart", TripStartController.TripStartEnd);

export default router;