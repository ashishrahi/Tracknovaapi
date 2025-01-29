import express from "express";
<<<<<<< HEAD
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
import VehicleFuelDateRangeRoutes from "./VehicleFuelDateRange.routes.js"
import VehicleMovingRoutes from "./VehicleMoving.routes.js"
import VehicleTypeRoutes from "./VehicleType.routes.js";
import VendorMasterRoutes from "./VendorMaster.routes.js"


=======
>>>>>>> ashish
const router = express.Router();
import DashboardRoutes from "./Dashboard.routes.js";
import AuthRoutes from "./Auth.route.js";
import AreaWardMasterRoutes from './AreaWardMaster.route.js'
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
import MapVehicleDataRoutes from "./MapVehicleData.route.js";
import MenuMasterRoutes from './MenuMaster.route.js'
import PetrolPumpRoutes from './Petrol_Pump_tbl.routes.js'
import RosterPlanRoutes from './RosterPlan.route.js'
import RouteRoutes from './Route.route.js'
import StateRoutes from './State.route.js'
import TaxMasterRoutes from './TaxMaster.route.js'
import TraccarRoutes from './Traccar.route.js'
import TripStartEndRoutes from './TripStart.route.js'
import UnitMasterRoutes from './UnitMaster.route.js'
import WardMasterRoutes from './WardMaster.route.js'
// import WeatherForecastRoutes from './WeatherForecast.route.js'

import VtypeinfoRoutes from './Vtypeinfo.route.js'
import vVehicleTrackForOverSpeedRoutes from './vVehicleTrackForOverSpeed.route.js'
import vVehicletrackHisRoutes from './vVehicletrackHis.route.js'

import ZoneMasterRoutes from './ZoneMaster.route.js'











// AreaWardMaster
router.use("/AreaWardMaster", AreaWardMasterRoutes);


//Dashboard
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
