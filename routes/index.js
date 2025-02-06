import express from "express";
const router = express.Router();

import NTReadRoutes from "./NTRead.routes.js";
import DashboardRoutes from "./Dashboard.routes.js";
import CommRoutes from "./Comm.routes.js";
import ItemCategoryRoutes from "./ItemCategory.routes.js";
import ItemMasterRoutes from "./ItemMaster.routes.js";
import ItemTypeMasterRoutes from "./ItemTypeMaster.routes.js";
// import MapVehicleDataRoutes from "./MapVehicleData.routes.js"
import NewNodeMasterRoutes from "./NewNodeMaster.routes.js";
import NodePermissionRoutes from "./NodePermission.routes.js";
import VehicleAuditInfoRoutes from "./VehicleAuditInfo.routes.js"
import VehicleFuelDateRangeRoutes from "./VehicleFuelDateRange.routes.js"
import VehicleMovingRoutes from "./VehicleMoving.routes.js"
import VehicleTypeRoutes from "./VehicleType.routes.js";
import VendorMasterRoutes from "./VendorMaster.routes.js"


// import DashboardRoutes from "./Dashboard.routes.js";
import AuthRoutes from "./Auth.routes.js";
import AreaWardMasterRoutes from './AreaWardMaster.routes.js'
import BinlLocationRoutes from "./BinLocation.routes.js";
import BinManageRoutes from "./BinManage.routes.js";
import BrandRoutes from "./brandMaster.routes.js";
import CountryMasterRoutes from "./Country.routes.js";
import DepartmentRoutes from "./Department.routes.js";
import DesignationRoutes from "./Designation.routes.js";
import DeviceTypeRoutes from "./DeviceType.routes.js";
import EmpMasterRoutes from "./EmpMaster.routes.js";
import FuelTypeRoutes from "./FuelType.routes.js";
import GeoFencingRoutes from "./GeoFencing.routes.js";
import HandheldMasterRoutes from "./HandheldMaster.routes.js";
import CityMasterRoutes from "./CityMaster.routes.js";
import FuelCorrectionRoutes from "./FuelCorrection.routes.js";
import MapVehicleDataRoutes from "./MapVehicleData.routes.js";
import MenuMasterRoutes from './MenuMaster.routes.js'
import PetrolPumpRoutes from './Petrol_Pump_tbl.routes.js'
import RosterPlanRoutes from './RosterPlan.routes.js'
import RouteRoutes from './Route.routes.js'
import StateRoutes from './State.routes.js'
import TaxMasterRoutes from './TaxMaster.routes.js'
import TraccarRoutes from './Traccar.routes.js'
import TripStartEndRoutes from './TripStart.routes.js'
import UnitMasterRoutes from './UnitMaster.routes.js'
import WardMasterRoutes from './WardMaster.routes.js'
// import WeatherForecastRoutes from './WeatherForecast.route.js'

import VtypeinfoRoutes from './Vtypeinfo.routes.js'
import vVehicleTrackForOverSpeedRoutes from './vVehicleTrackForOverSpeed.routes.js'
import vVehicletrackHisRoutes from './vVehicletrackHis.routes.js'

import ZoneMasterRoutes from './ZoneMaster.route.js'

import HelpCreationRoutes from './HelpCreation.routes.js'








// AreaWardMaster
router.use("/AreaWardMaster", AreaWardMasterRoutes);


//Dashboard

router.use("/NTRead",  NTReadRoutes);
router.use("/Dashboard", DashboardRoutes);
router.use("/Comm", CommRoutes);
router.use("/ItemCategory", ItemCategoryRoutes);
router.use("/ItemMaster", ItemMasterRoutes);
router.use("/ItemTypeMaster", ItemTypeMasterRoutes);
router.use("/MapVehicleData", MapVehicleDataRoutes);
router.use("/NewNodeMaster", NewNodeMasterRoutes); // skipped this api because of table is not present
router.use("/NodePermission", NodePermissionRoutes); // skipped this api because of table is not present
router.use("/VehicleAuditInfo", VehicleAuditInfoRoutes); 
router.use("/VehicleFuelDateRange", VehicleFuelDateRangeRoutes); // Skipped
router.use("/VehicleMoving", VehicleMovingRoutes); // Skipped
router.use("/VehicleType", VehicleTypeRoutes); 
router.use("/VendorMaster", VendorMasterRoutes); 


 //Auth
router.use("/Auth", AuthRoutes);

//BinLocation
router.use("/BinLocation", BinlLocationRoutes);

//BinManage
router.use("/BinManage", BinManageRoutes);

//Brand
router.use("/Brand", BrandRoutes);

//CountryMaster
router.use("/Country", CountryMasterRoutes);

//DepartmentMaster
router.use("/Department", DepartmentRoutes);

//DesignationMaster
router.use("/Designation", DesignationRoutes);

//DeviceType
router.use("/DeviceType", DeviceTypeRoutes);

//EmployeeMaster
router.use("/Employee", EmpMasterRoutes);

//FuelType
router.use("/FuelType", FuelTypeRoutes);

//GeoFencing
router.use("/GeoFencing", GeoFencingRoutes);

//HandheldMaster
router.use("/HandheldMaster", HandheldMasterRoutes);

//
router.use("/HelpCreation", HelpCreationRoutes);

//CityMaster
router.use("/DistrictMaster", CityMasterRoutes);

//FuelCorrection
router.use("/FuelCorrection", FuelCorrectionRoutes);

//MapVehicleData
router.use("/MapVehicleData", MapVehicleDataRoutes);

//MenuMaster
router.use("/MenuMaster", MenuMasterRoutes);

//PetrolPump
router.use("/PetrolPump", PetrolPumpRoutes);

//RosterPlan

router.use("/RosterPlan", RosterPlanRoutes);

//Route

router.use("/Route", RouteRoutes);

//State

router.use("/State", StateRoutes);

// TaxMaster
router.use("/TaxMaster", TaxMasterRoutes);

// Traccar
router.use("/Traccar", TraccarRoutes);

// Traccar
router.use("/TripStartEnd", TripStartEndRoutes);

// UnitMaster
router.use("/UnitMaster", UnitMasterRoutes);

// WardMaster
router.use("/WardMaster", WardMasterRoutes);

// WeatherForecast
// router.use("/WeatherForecast", WeatherForecastRoutes);


// ZoneMaster
router.use("/Vtypeinfo", VtypeinfoRoutes);

// vVehicleTrackForOverSpeedRoutes
router.use("/vVehicleTrackForOverSpeed", vVehicleTrackForOverSpeedRoutes);

// vVehicleTrackForOverSpeedRoutes
router.use("/vVehicleTrackForOverSpeed", vVehicleTrackForOverSpeedRoutes);


// vVehicletrackHis
router.use("/vVehicletrackHis", vVehicletrackHisRoutes);




// ZoneMaster
router.use("/ZoneMaster", ZoneMasterRoutes);


export default router;
