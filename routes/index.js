import express from "express";
import DashboardRoutes from "./Dashboard.routes.js";
import AuthRoutes from './Auth.route.js'
import BinlLocationRoutes from './BinLocation.route.js'
import BinManageRoutes from './BinManage.route.js'
const router = express.Router();


router.use("/Dashboard", DashboardRoutes);
router.use("/Auth", AuthRoutes);
router.use("/BinLocation", BinlLocationRoutes);
router.use("/BinManage", BinManageRoutes);





export default router;