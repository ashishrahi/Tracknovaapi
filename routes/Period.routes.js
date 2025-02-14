import express from "express";
import { PeriodController } from "../controllers/index.js";
const router = express.Router();

router.get("/GetPeriods", PeriodController.GetPeriods);


export default router;