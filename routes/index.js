import express from "express";
import DashboardRoutes from "./Dashboard.routes.js";
const router = express.Router();


router.use("/Dashboard", DashboardRoutes);

export default router;