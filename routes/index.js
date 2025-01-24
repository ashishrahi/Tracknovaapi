import express from "express";
import NTReadRoutes from "./NTRead.routes.js";
import DashboardRoutes from "./Dashboard.routes.js";
import CommRoutes from "./Comm.routes.js";
import ItemCategoryRoutes from "./ItemCategory.routes.js";
import ItemMasterRoutes from "./ItemMaster.routes.js";
import ItemTypeMasterRoutes from "./ItemTypeMaster.routes.js";
import MapVehicleDataRoutes from "./MapVehicleData.routes.js"

const router = express.Router();


router.use("/NTRead", NTReadRoutes);
router.use("/Dashboard", DashboardRoutes);
router.use("/Comm", CommRoutes);
router.use("/ItemCategory", ItemCategoryRoutes);
router.use("/ItemMaster", ItemMasterRoutes);
router.use("/ItemTypeMaster", ItemTypeMasterRoutes);
router.use("/MapVehicleData", MapVehicleDataRoutes);

export default router;