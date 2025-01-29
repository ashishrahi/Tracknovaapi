// AreaWardMaster
import {
  AddUpdateAreaWardMaster,
  GetAreaWardMaster,
  DeleteAreaWardMaster,
  } from "./AreaWardMaster.controller.js";



// Dashboar
import {
  getDashboard,
  getVehicleCurrentDay,
  getVehicleDistance,
  getAllBins,
  getMapBinsWardWise,
} from "./Dashboard.controller.js";

// Authentication
import {
  login,
  GetUserPermissions,
  AddUpdateUserPermissionMaster,
  GetUserPermissionMaster,
  GetUserPermissionList,
  DeleteUserPermissionMaster,
  AddUpdateRoleMaster,
  GetRoleMaster,
  DeleteRoleMaster,
  AddUpdateRolePermissionMaster,
  GetRolePermissionMaster,
  GetRolePermission,
} from "./Auth.controller.js";

// BinLocation
import {
  AddUpdateBinLocation,
  GetBinLocation,
  DeleteBinLocation,
} from "./BinLocation.controller.js";

// BinManage
import { AddUpdateBinManage, GetBinManage } from "./BinManage.controller.js";

// Brand
import {
  AddUpdateBrandMaster,
  GetBrand,
  DeleteBrand,
} from "./BrandMaster.controller.js";

// CountryMaster
import {
  AddUpdateCountryMaster,
  GetCountryMaster,
  DeleteCountryMaster,
} from "./Country.controller.js";

// DepartmentMaster
import {
  AddUpdateDepartmentMaster,
  GetDepartmentMaster,
  DeleteDepartmentMaster,
} from "./Department.controller.js";

// DesignationMaster
import {
  AddUpdateDesignationMaster,
  GetDesignationMaster,
  DeleteDesignationMaster,
} from "./Designation.controller.js";

// DeviceType
import { GetDeviceType } from "./DeviceType.controller.js";

// EmpMaster
import {
  AddUpdateEmployee,
  GetEmployee,
  UpsertEmpPermission,
  DeleteEmployee,
} from "./EmpMaster.controller.js";

// EmpMaster
import {
  AddUpdateFuelType,
  GetFuelType,
  DeleteFuelType,
} from "./FuelType.controller.js";

// GeoFencing
import {
  AddUpdateGeoFencing,
  GetGeoFencing,
  DeleteGeoFencing,
} from "./GeoFencing.controller.js";

// HandheldMaster
import {
  AddUpdateHandheldMaster,
  GetHandheldMaster,
  DeleteHandheldMaster,
} from "./HandheldMaster.controller.js";

// HandheldMaster
import {
  AddUpdateCityMaster,
  GetCityMaster,
  DeleteCityMaster,
} from "./CityMaster.controller.js";

// FuelCorrection
import {
  AddUpdateFuelCorrection,
  GetVehList,
} from "./FuelCorrection.controller.js";

// MapVehicleData
import {
  GetMapVehicleData,
} from "./MapVehicleData.controller.js";

// MenuMaster
import {
  AddUpdateMenuMaster,
  GetMenuMaster,
  GetParentMenuMaster,
  GetChildMenuMaster,
  DeleteMenuMaster
} from "./Menu.controller.js";

// PetrolPump
import {
  AddUpdatePetrolPump,
  GetPetrolPumpVehicle,
  GetPetrolPump,
  DeletePetrolPump,
} from "./Petrol_Pump_tbl.controller.js";

// RosterPlan
import {
  AddUpdateRosterPlan,
  GetRosterPlan,
  DeleteRosterPlan,
} from "./RosterPlan.controller.js";

// Routes
import {
  AddUpdateRoutes,
  GetRoutes,
  DeleteRoutes,
} from "./Route.controller.js";

// Setting
import {
  AddUpdateSetting,
  GetSetting,
  DeleteSetting,
} from "./Setting.controller.js";

// State
import {
  AddUpdateState,
  GetState,
  DeleteState,
} from "./State.controller.js";


// TaxMaster
import {
  AddUpdateTaxMaster,
  GetTaxMaster,
  DeleteTaxMaster,
} from "./TaxMaster.controller.js";

// Traccar
import {
  AddUpdatelocation,
  GetlocationClient,
} from "./Traccar.controller.js";

// TripStart
import {
  TripStartEnd,
} from "./TripStart.controller.js";

// UnitMaster
import {
  AddUpdateUnitMaster,
  GetUnitMaster,
  DeleteUnitMaster
} from "./UnitMaster.controller.js";

// WardMaster
import {
  AddUpdateWardMaster,
  GetWardMaster,
  DeletetWardMaster
} from "./WardMaster.controller.js";


// Vtypeinfo
import {
  AddUpdateVtypeinfo,
  getVtypeinfo,
  DeleteVtypeinfo
} from "./Vtypeinfo.controller.js";

// VehicleTrackForOverSpeed
import {
  GetOverSpeedAlert
} from "./vVehicleTrackForOverSpeed.controller.js";

// GetvVehicletrackHis
import {
  GetvVehicletrackHis
} from "./vVehicletrackHis.controller.js";


// ZoneMaster
import {
  AddUpdateZoneMaster,
  GetZoneMaster,
  DeleteZoneMaster
} from "./ZoneMaster.controller.js";


///////////////////////////////////////////// DashboardController //////////////////////////////////////////////////////////////////

export const AreaMasterController = {
AddUpdateAreaWardMaster,
  GetAreaWardMaster,
  DeleteAreaWardMaster}


///////////////////////////////////////////// DashboardController //////////////////////////////////////////////////////////////////

export const DashboardController = {
  getDashboard: getDashboard,
  getVehicleCurrentDay: getVehicleCurrentDay,
  getVehicleDistance: getVehicleDistance,
  getAllBins: getAllBins,
  getMapBinsWardWise: getMapBinsWardWise,
};

////////////////////////////////////////////////  AuthController   //////////////////////////////////////////////////////////////////

export const AuthController = {
  login: login,
  GetUserPermissions: GetUserPermissions,
  AddUpdateUserPermissionMaster: AddUpdateUserPermissionMaster,
  GetUserPermissionMaster: GetUserPermissionMaster,
  GetUserPermissionList: GetUserPermissionList,
  DeleteUserPermissionMaster: DeleteUserPermissionMaster,
  // RoleMaster
  AddUpdateRoleMaster: AddUpdateRoleMaster,
  GetRoleMaster: GetRoleMaster,
  DeleteRoleMaster: DeleteRoleMaster,
  AddUpdateRolePermissionMaster: AddUpdateRolePermissionMaster,
  // RolePermission
  GetRolePermissionMaster: GetRolePermissionMaster,
  GetRolePermission: GetRolePermission,
};

////////////////////////////////////////////////  BinLocationController   //////////////////////////////////////////////////////////////////

export const BinLocationController = {
  AddUpdateBinLocation: AddUpdateBinLocation,
  GetBinLocation: GetBinLocation,
  DeleteBinLocation: DeleteBinLocation,
};

////////////////////////////////////////////////  BinManageController   //////////////////////////////////////////////////////////////////

export const BinManageController = {
  AddUpdateBinManage: AddUpdateBinManage,
  GetBinManage: GetBinManage,
};

////////////////////////////////////////////////  BandController   //////////////////////////////////////////////////////////////////

export const BrandController = {
  AddUpdateBrandMaster: AddUpdateBrandMaster,
  GetBrand: GetBrand,
  DeleteBrand: DeleteBrand,
};

////////////////////////////////////////////////  CountryController   //////////////////////////////////////////////////////////////////

export const CountryMasterController = {
  AddUpdateCountryMaster: AddUpdateCountryMaster,
  GetCountryMaster: GetCountryMaster,
  DeleteCountryMaster: DeleteCountryMaster,
};

////////////////////////////////////////////////  DepartmentController   //////////////////////////////////////////////////////////////////

export const DepartmentController = {
  AddUpdateDepartmentMaster: AddUpdateDepartmentMaster,
  GetDepartmentMaster: GetDepartmentMaster,
  DeleteDepartmentMaster: DeleteDepartmentMaster,
};

////////////////////////////////////////////////  DesignationController   //////////////////////////////////////////////////////////////////

export const DesignationController = {
  AddUpdateDesignationMaster: AddUpdateDesignationMaster,
  GetDesignationMaster: GetDesignationMaster,
  DeleteDesignationMaster: DeleteDesignationMaster,
};

////////////////////////////////////////////////  DeviceTypeController   //////////////////////////////////////////////////////////////////

export const DeviceTypeController = {
  GetDeviceType: GetDeviceType,
};

////////////////////////////////////////////////  EmpMasterController   //////////////////////////////////////////////////////////////////

export const EmpMasterController = {
  AddUpdateEmployee: AddUpdateEmployee,
  GetEmployee: GetEmployee,
  UpsertEmpPermission: UpsertEmpPermission,
  DeleteEmployee: DeleteEmployee,
};

//////////////////////////////////////  FuelTypeController  //////////////////////////////////////////////////////////////////

export const FuelTypeController = {
  AddUpdateFuelType: AddUpdateFuelType,
  GetFuelType: GetFuelType,
  DeleteFuelType: DeleteFuelType,
};

//////////////////////////////////////  GeoFencingController  //////////////////////////////////////////////////////////////////

export const GeoFencingController = {
  AddUpdateGeoFencing: AddUpdateGeoFencing,
  GetGeoFencing: GetGeoFencing,
  DeleteGeoFencing: DeleteGeoFencing,
};
//////////////////////////////////////  GeoFencingController  //////////////////////////////////////////////////////////////////

export const HandheldMasterController = {
  AddUpdateHandheldMaster: AddUpdateHandheldMaster,
  GetHandheldMaster: GetHandheldMaster,
  DeleteHandheldMaster: DeleteHandheldMaster,
};

//////////////////////////////////////  CityMasterController  //////////////////////////////////////////////////////////////////

export const CityMasterController = {
  AddUpdateCityMaster: AddUpdateCityMaster,
  GetCityMaster: GetCityMaster,
  DeleteCityMaster: DeleteCityMaster,
};

//////////////////////////////////////  FuelCorrectionController  //////////////////////////////////////////////////////////////////

export const FuelCorrectionController = {
  AddUpdateFuelCorrection: AddUpdateFuelCorrection,
  GetVehList: GetVehList,
};


//////////////////////////////////////////  MapVehicleDataController //////////////////////////////////////////////////////////////////////////

export const MapVehicleDataController = {
  GetMapVehicleData: GetMapVehicleData,
};

//////////////////////////////////////////  MenuMasterController //////////////////////////////////////////////////////////////////////////


export const MenuMasterController = {
AddUpdateMenuMaster,
GetMenuMaster,
GetParentMenuMaster,
GetChildMenuMaster,
DeleteMenuMaster
}

//////////////////////////////////////////  PetrolPumpController //////////////////////////////////////////////////////////////////////////

export const PetrolPumpController = {
AddUpdatePetrolPump,
  GetPetrolPumpVehicle,
  GetPetrolPump,
  DeletePetrolPump,
}

//////////////////////////////////////////  PetrolPumpController //////////////////////////////////////////////////////////////////////////

export const RosterPlanController = {

  AddUpdateRosterPlan,
  GetRosterPlan,
  DeleteRosterPlan,
}

//////////////////////////////////////////  RoutesController //////////////////////////////////////////////////////////////////////////

export const RoutesController = {

  AddUpdateRoutes,
  GetRoutes,
  DeleteRoutes,
}

//////////////////////////////////////////  SettingController //////////////////////////////////////////////////////////////////////////


export const SettingController = {
AddUpdateSetting,
  GetSetting,
  DeleteSetting
}


//////////////////////////////////////////  StateController //////////////////////////////////////////////////////////////////////////


export const StateController ={
AddUpdateState,
  GetState,
  DeleteState,
}

//////////////////////////////////////////  TaxMasterController //////////////////////////////////////////////////////////////////////////

export const TaxMasterController ={
AddUpdateTaxMaster,
  GetTaxMaster,
  DeleteTaxMaster
}


//////////////////////////////////////////  TraccarController //////////////////////////////////////////////////////////////////////////

export const TraccarController ={
  AddUpdatelocation,
  GetlocationClient
}

//////////////////////////////////////////  TripStartController //////////////////////////////////////////////////////////////////////////

export const TripStartController ={
  TripStartEnd,
}

//////////////////////////////////////////  UnitMasterController //////////////////////////////////////////////////////////////////////////

export const UnitMasterController ={

AddUpdateUnitMaster,
  GetUnitMaster,
  DeleteUnitMaster
}

//////////////////////////////////////////  WardMasterController //////////////////////////////////////////////////////////////////////////

export const WardMasterController ={

AddUpdateWardMaster,
  GetWardMaster,
  DeletetWardMaster
}

//////////////////////////////////////////  ZoneMasterController //////////////////////////////////////////////////////////////////////////


export const ZoneMasterController ={
AddUpdateZoneMaster,
  GetZoneMaster,
  DeleteZoneMaster
}

//////////////////////////////////////////  VtypeinfoController //////////////////////////////////////////////////////////////////////////


export const VtypeinfoController ={
AddUpdateVtypeinfo,
  getVtypeinfo,
  DeleteVtypeinfo}


//////////////////////////////////////////  vVehicleTrackForOverSpeedController //////////////////////////////////////////////////////////////////////////


export const vVehicleTrackForOverSpeedController ={
  GetOverSpeedAlert,}


/////////////////////////////////////////////////   vVehicletrackHis //////////////////////////////////////////////////////////////////////////////////////////////////
  
export const vVehicletrackHisController ={
  GetvVehicletrackHis
}
