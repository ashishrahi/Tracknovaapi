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
import ZoneMasterRoutes from './ZoneMaster.route.js'














//Dashboard
router.use("/Dashboard", DashboardRoutes);

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
router.use("/ZoneMaster", ZoneMasterRoutes);

















export default router;
