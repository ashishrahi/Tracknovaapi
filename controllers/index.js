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
  GetFuelCorrection,
  DeleteFuelCorrection,
} from "./FuelCorrection.controller.js";





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
  GetFuelCorrection: GetFuelCorrection,
  DeleteFuelCorrection: DeleteFuelCorrection,
};
