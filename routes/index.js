import express from "express";
import NTReadRoutes from "./NTRead.routes.js";
import DashboardRoutes from "./Dashboard.routes.js";
import CommRoutes from "./Comm.routes.js";
import ItemCategoryRoutes from "./ItemCategory.routes.js";
import ItemMasterRoutes from "./ItemMaster.routes.js";
import ItemTypeMasterRoutes from "./ItemTypeMaster.routes.js";
import MapVehicleDataRoutes from "./MapVehicleData.routes.js"
import NewNodeMasterRoutes from "./NewNodeMaster.routes.js";
import NodePermissionRoutes from "./NodePermission.routes.js";
import VehicleAuditInfoRoutes from "./VehicleAuditInfo.routes.js"

const router = express.Router();


router.use("/NTRead", NTReadRoutes);
router.use("/Dashboard", DashboardRoutes);
router.use("/Comm", CommRoutes);
router.use("/ItemCategory", ItemCategoryRoutes);
router.use("/ItemMaster", ItemMasterRoutes);
router.use("/ItemTypeMaster", ItemTypeMasterRoutes);
router.use("/MapVehicleData", MapVehicleDataRoutes);
router.use("/NewNodeMaster", NewNodeMasterRoutes); // skipped this api because of table is not present
router.use("/NodePermission", NodePermissionRoutes); // skipped this api because of table is not present
router.use("/VehicleAuditInfo", VehicleAuditInfoRoutes); 


export default router;