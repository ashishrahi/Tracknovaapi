import express from "express";
import NTReadRoutes from "./NTRead.routes.js";
import DashboardRoutes from "./Dashboard.routes.js";
import CommRoutes from "./Comm.routes.js";
const router = express.Router();


router.use("/NTRead", NTReadRoutes);
router.use("/Dashboard", DashboardRoutes);
router.use("/Comm", CommRoutes);

export default router;