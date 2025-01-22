import express from "express";
const router = express.Router();
import DashboardRoutes from "./Dashboard.routes.js";
import AuthRoutes from "./Auth.route.js";
import BinlLocationRoutes from "./BinLocation.route.js";
import BinManageRoutes from "./BinManage.route.js";
import BrandRoutes from "./brandMaster.route.js";
import CountryMasterRoutes from "./Country.route.js";
import DepartmentRoutes from "./Department.route.js";
import DesignationRoutes from "./Designation.route.js";
import DeviceTypeRoutes from "./DeviceType.route.js";
import EmpMasterRoutes from "./EmpMaster.route.js";
import FuelTypeRoutes from "./FuelType.route.js";
import GeoFencingRoutes from "./GeoFencing.route.js";
import HandheldMasterRoutes from "./HandheldMaster.route.js";
import CityMasterRoutes from "./CityMaster.route.js";
import FuelCorrectionRoutes from "./FuelCorrection.route.js";


router.use("/Dashboard", DashboardRoutes);
router.use("/Auth", AuthRoutes);
router.use("/BinLocation", BinlLocationRoutes);
router.use("/BinManage", BinManageRoutes);
router.use("/Brand", BrandRoutes);
router.use("/Country", CountryMasterRoutes);
router.use("/Department", DepartmentRoutes);
router.use("/Designation", DesignationRoutes);
router.use("/DeviceType", DeviceTypeRoutes);
router.use("/Employee", EmpMasterRoutes);
router.use("/FuelType", FuelTypeRoutes);
router.use("/GeoFencing", GeoFencingRoutes);
router.use("/HandheldMaster", HandheldMasterRoutes);
router.use("/DistrictMaster", CityMasterRoutes);
router.use("/FuelCorrection", FuelCorrectionRoutes);



export default router;
