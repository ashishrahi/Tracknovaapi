import express from "express";
const router = express.Router();

import AreaWardMasterRoutes from "./AreaWardMaster.routes.js";
import AuthRoutes from "./Auth.routes.js";
import BinlLocationRoutes from "./BinLocation.routes.js";
import BinManageRoutes from "./BinManage.routes.js";
import BrandRoutes from "./brandMaster.routes.js";
import CityMasterRoutes from "./CityMaster.routes.js";
import CommRoutes from "./Comm.routes.js";
import CountryMasterRoutes from "./Country.routes.js";
import DashboardRoutes from "./Dashboard.routes.js";
import DepartmentRoutes from "./Department.routes.js";
import DesignationRoutes from "./Designation.routes.js";
import DeviceTypeRoutes from "./DeviceType.routes.js";
import EmpMasterRoutes from "./EmpMaster.routes.js";
import FuelCorrectionRoutes from "./FuelCorrection.routes.js";
import FuelTypeRoutes from "./FuelType.routes.js";
import GeoFencingRoutes from "./GeoFencing.routes.js";
import HandheldMasterRoutes from "./HandheldMaster.routes.js";
import HelpCreationRoutes from "./HelpCreation.routes.js";
import ItemCategoryRoutes from "./ItemCategory.routes.js";
import ItemMasterRoutes from "./ItemMaster.routes.js";
import ItemTypeMasterRoutes from "./ItemTypeMaster.routes.js";
import MapVehicleDataRoutes from "./MapVehicleData.routes.js";
import MenuMasterRoutes from "./MenuMaster.routes.js";
import NewNodeMasterRoutes from "./NewNodeMaster.routes.js";
import NodePermissionRoutes from "./NodePermission.routes.js";
import NTReadRoutes from "./NTRead.routes.js";
import PeriodRoutes from "./Period.routes.js";
import PetrolPumpRoutes from "./Petrol_Pump_tbl.routes.js";
import RosterPlanRoutes from "./RosterPlan.routes.js";
import RouteRoutes from "./Route.routes.js";
import StateRoutes from "./State.routes.js";
import TaxMasterRoutes from "./TaxMaster.routes.js";
import TraccarRoutes from "./Traccar.routes.js";
import TripStartEndRoutes from "./TripStart.routes.js";
import UnitMasterRoutes from "./UnitMaster.routes.js";
import VehicleAuditInfoRoutes from "./VehicleAuditInfo.routes.js";
import VehicleFuelDateRangeRoutes from "./VehicleFuelDateRange.routes.js";
import VehicleMovingRoutes from "./VehicleMoving.routes.js";
import VehicleTypeRoutes from "./VehicleType.routes.js";
import VendorMasterRoutes from "./VendorMaster.routes.js";
import VtypeinfoRoutes from "./Vtypeinfo.routes.js";
import vVehicleTrackForOverSpeedRoutes from "./vVehicleTrackForOverSpeed.routes.js";
import vVehicletrackHisRoutes from "./vVehicletrackHis.routes.js";
import WardMasterRoutes from "./WardMaster.routes.js";
import ZoneMasterRoutes from "./ZoneMaster.route.js";
import CompanyRoutes from "./Company.routes.js"


//------- Saas Specific Routes-------->

router.use("/company", CompanyRoutes)




//-------- All Routes ----------------->

router.use("/AreaWardMaster", AreaWardMasterRoutes);
router.use("/Auth", AuthRoutes);
router.use("/BinLocation", BinlLocationRoutes);
router.use("/BinManage", BinManageRoutes);
router.use("/Brand", BrandRoutes);
router.use("/CityMaster", CityMasterRoutes);
router.use("/Comm", CommRoutes);
router.use("/Country", CountryMasterRoutes);
router.use("/Dashboard", DashboardRoutes);
router.use("/Department", DepartmentRoutes);
router.use("/Designation", DesignationRoutes);
router.use("/DeviceType", DeviceTypeRoutes);
router.use("/Employee", EmpMasterRoutes);
router.use("/FuelCorrection", FuelCorrectionRoutes);
router.use("/FuelType", FuelTypeRoutes);
router.use("/GeoFencing", GeoFencingRoutes);
router.use("/HandheldMaster", HandheldMasterRoutes);
router.use("/HelpCreation", HelpCreationRoutes);
router.use("/ItemCategory", ItemCategoryRoutes);
router.use("/ItemMaster", ItemMasterRoutes);
router.use("/ItemTypeMaster", ItemTypeMasterRoutes);
router.use("/MapVehicleData", MapVehicleDataRoutes);
router.use("/Menu", MenuMasterRoutes);
router.use("/NewNodeMaster", NewNodeMasterRoutes); 
router.use("/NodePermission", NodePermissionRoutes); 
router.use("/NTRead", NTReadRoutes);
router.use("/Period", PeriodRoutes);
router.use("/PetrolPump", PetrolPumpRoutes);
router.use("/RosterPlan", RosterPlanRoutes);
router.use("/Route", RouteRoutes);
router.use("/State", StateRoutes);
router.use("/TaxMaster", TaxMasterRoutes);
router.use("/Traccar", TraccarRoutes);
router.use("/TripStartEnd", TripStartEndRoutes);
router.use("/UnitMaster", UnitMasterRoutes);
router.use("/VehicleAuditInfo", VehicleAuditInfoRoutes);
router.use("/VehicleFuelDateRange", VehicleFuelDateRangeRoutes);
router.use("/VehicleMoving", VehicleMovingRoutes);
router.use("/VehicleType", VehicleTypeRoutes);
router.use("/VendorMaster", VendorMasterRoutes);
router.use("/Vtypeinfo", VtypeinfoRoutes);
router.use("/vVehicleTrackForOverSpeed", vVehicleTrackForOverSpeedRoutes);
router.use("/vVehicletrackHis", vVehicletrackHisRoutes);
router.use("/WardMaster", WardMasterRoutes);
router.use("/Zone", ZoneMasterRoutes);

export default router;
