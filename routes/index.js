import express from "express";
import DashboardRoutes from "./Dashboard.routes.js";
import AuthRoutes from './Auth.route.js'
const router = express.Router();


router.use("/Dashboard", DashboardRoutes);
router.use("/Auth", AuthRoutes);


export default router;