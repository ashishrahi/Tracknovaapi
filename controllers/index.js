import { probWireTamp , getVehicleNotMoved, sample, SmpCurr, Geofence, NTCurrent, VehCurrStat, GetDashData,GetNTDashboard, GetTopFuelCons, GetTopFuelConsNT, GetTopFuelConsNTS, GetTopFuelConsNTOnOff, GetRunningStatus, GetLongIdleVeh, GetVehicleMovement } from "./NTRead.controller.js";
import { getDashboard, getVehicleCurrentDay, getVehicleDistance, getAllBins, getMapBinsWardWise, getvVehicleNo } from "./Dashboard.controller.js";
import { GetCommGroup, UpsertCommGroup, DeleteCommGroup, GetCommGroupByEmpId, GetAllEmailSetting, UpsertEmailSetting, GetAllSmsSetting, GetCampaignDetailById, GetCampaign, UpsertCampaign, DeleteCampaign, GetCampaignTemplate, UpsertCampaignTemplate, DeleteCampaignTemplate, GetEventSetting, UpsertEventSetting, DeleteEventSetting, GetMasters, UpsertSmsSetting } from "./Comm.controller.js";
import { AddUpdateItemCategory, GetItemCategory, DeleteItemCategory } from "./ItemCategory.controller.js"
import { AddUpdateItemMaster, GetItemMaster, DeleteItemMaster } from "./ItemMaster.controller.js";
import { AddUpdateItemTypeMaster, GetItemTypeMaster, DeleteItemTypeMaster } from "./ItemTypeMaster.controller.js";
// import { GetMapVehicleData } from "./MapVehicleData.controller.js"
import { AddUpdateNewNodeMaster,GetAllNodes,DeleteNode} from "./NewNodeMaster.controller.js"     
import { AddUpdateNodePermission } from "./NodePermission.controller.js";
import { AddUpdateVehicleAuditInfo, GetVehicleAuditInfo, DeleteVehicleAuditInfo } from "./VehicleAuditInfo.controller.js"
import { VehicleFuelDateRange } from "./VehicleFuelDateRange.controller.js"

import { VehicleTrack, VehicleMovingTrackStatusdetnew, GetVechicleMileageSummary,GetDevTamp,VehicleFuelConsumenew, VehicleDetailSummarynew } from "./VehicleMoving.controller.js";

import { AddUpdateVehicleType, GetVehicleType, DeleteVehicleType, AddUpdateEscrapVehicleType, DeleteEscrapVehicleType, GetEscrapVehicleType } from "./VehicleType.controller.js";

import { AddUpdateVendorMaster, GetVendorMaster, DeleteVendorMaster } from "./VendorMaster.controller.js";
import { GetPeriods } from "./Period.controller.js";

import { getAllCompanies } from "./Company.controller.js";


export const CompanyController = {
  getAllCompanies: getAllCompanies
}

export const NTReadController = {
    probWireTamp: probWireTamp,
    getVehicleNotMoved: getVehicleNotMoved,
    sample: sample,
    SmpCurr: SmpCurr,
    Geofence: Geofence, 
    NTCurrent: NTCurrent,
    VehCurrStat: VehCurrStat,
    GetDashData: GetDashData,
    GetNTDashboard: GetNTDashboard,
    GetTopFuelCons: GetTopFuelCons,
    GetTopFuelConsNT: GetTopFuelConsNT,
    GetTopFuelConsNTS: GetTopFuelConsNTS,
    GetTopFuelConsNTOnOff: GetTopFuelConsNTOnOff,
    GetRunningStatus: GetRunningStatus,
    GetLongIdleVeh: GetLongIdleVeh,
    GetVehicleMovement: GetVehicleMovement
}

// AreaWardMaster
import {
  AddUpdateAreaWardMaster,
  GetAreaWardMaster,
  DeleteAreaWardMaster,
  } from "./AreaWardMaster.controller.js";



// Dashboar
// import {
//   getDashboard,
//   getVehicleCurrentDay,
//   getVehicleDistance,
//   getAllBins,
//   getMapBinsWardWise,
// } from "./Dashboard.controller.js";

// Authentication
import {
  Register,
  login,
  Refresh,
  Logout,
  GetUSER,
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
  ImportCountries,
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
  AddUpdateDesignationmaster,
  GetDesignationmaster,
  DeleteDesignationmaster,
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



// HelpCreation
import {
  AddHelpCreation,
  GetHelpCreation,
} from "./HelpCreation.controller.js"; 





// CityMaster
import {
  AddUpdateCityMaster,
  GetCitiesByState,
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
  GetStatebyCountry,
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

//----------------PeriodCOntroller----->
export const PeriodController = {
  GetPeriods: GetPeriods
}


///////////////////////////////////////////// AreaMasterController //////////////////////////////////////////////////////////////////

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
  getvVehicleNo: getvVehicleNo
};

////////////////////////////////////////////////  AuthController   //////////////////////////////////////////////////////////////////

export const AuthController = {
  Register: Register,
  login: login,
  Refresh: Refresh,
  Logout: Logout,
  GetUSER: GetUSER,
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
  ImportCountries:ImportCountries,
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
  AddUpdateDesignationmaster: AddUpdateDesignationmaster,
  GetDesignationmaster: GetDesignationmaster,
  DeleteDesignationmaster: DeleteDesignationmaster,
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
  GetCitiesByState:GetCitiesByState,
  GetCityMaster: GetCityMaster,
  DeleteCityMaster: DeleteCityMaster,
};

//////////////////////////////////////  FuelCorrectionController  //////////////////////////////////////////////////////////////////

export const FuelCorrectionController = {
  AddUpdateFuelCorrection: AddUpdateFuelCorrection,
  GetVehList: GetVehList,
};


//////////////////////////////////////////  MapVehicleDataController //////////////////////////////////////////////////////////////////////////

// export const MapVehicleDataController = {
//   GetMapVehicleData: GetMapVehicleData,
// };

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

export const CommController = {
    GetCommGroup: GetCommGroup,
    UpsertCommGroup: UpsertCommGroup,
    DeleteCommGroup: DeleteCommGroup,
    GetCommGroupByEmpId: GetCommGroupByEmpId,
    GetAllEmailSetting: GetAllEmailSetting,
    UpsertEmailSetting: UpsertEmailSetting,
    GetAllSmsSetting: GetAllSmsSetting,
    GetCampaignDetailById: GetCampaignDetailById,
    GetCampaign: GetCampaign,
    UpsertCampaign: UpsertCampaign,
    DeleteCampaign: DeleteCampaign,
    GetCampaignTemplate: GetCampaignTemplate,
    UpsertCampaignTemplate: UpsertCampaignTemplate,
    DeleteCampaignTemplate: DeleteCampaignTemplate,
    GetEventSetting: GetEventSetting,
    UpsertEventSetting: UpsertEventSetting,
    DeleteEventSetting: DeleteEventSetting,
    GetMasters: GetMasters,
    UpsertSmsSetting: UpsertSmsSetting
}


export const ItemCategoryController = {
    AddUpdateItemCategory: AddUpdateItemCategory,
    GetItemCategory: GetItemCategory,
    DeleteItemCategory: DeleteItemCategory
}

export const ItemMasterController = {
    AddUpdateItemMaster: AddUpdateItemMaster,
    GetItemMaster: GetItemMaster,
    DeleteItemMaster: DeleteItemMaster
}

export const ItemTypeMasterController = {
    AddUpdateItemTypeMaster: AddUpdateItemTypeMaster,
    GetItemTypeMaster: GetItemTypeMaster,
    DeleteItemTypeMaster: DeleteItemTypeMaster
}

export const MapVehicleDataController = {
    GetMapVehicleData: GetMapVehicleData
}

export const NewNodeMasterController = {
    AddUpdateNewNodeMaster: AddUpdateNewNodeMaster,
    GetAllNodes:GetAllNodes,
    DeleteNode:DeleteNode
}

export const NodePermissionController = {
    AddUpdateNodePermission: AddUpdateNodePermission
}

export const VehicleAuditInfoController = {
    AddUpdateVehicleAuditInfo: AddUpdateVehicleAuditInfo,
    GetVehicleAuditInfo: GetVehicleAuditInfo,
    DeleteVehicleAuditInfo: DeleteVehicleAuditInfo
}

export const VehicleFuelDateRangeController = {
    VehicleFuelDateRange: VehicleFuelDateRange
}

export const VehicleMovingController = {
    VehicleTrack: VehicleTrack,
    VehicleMovingTrackStatusdetnew: VehicleMovingTrackStatusdetnew,
    GetVechicleMileageSummary: GetVechicleMileageSummary,
    GetDevTamp:GetDevTamp,
    VehicleFuelConsumenew:VehicleFuelConsumenew,
    VehicleDetailSummarynew: VehicleDetailSummarynew

}

export const VehicleTypeController = {
    AddUpdateVehicleType: AddUpdateVehicleType,
    GetVehicleType: GetVehicleType,
    DeleteVehicleType: DeleteVehicleType,
    AddUpdateEscrapVehicleType: AddUpdateEscrapVehicleType,
    DeleteEscrapVehicleType: DeleteEscrapVehicleType,
    GetEscrapVehicleType: GetEscrapVehicleType
}

export const VendorMasterController = {
    AddUpdateVendorMaster: AddUpdateVendorMaster,
    GetVendorMaster: GetVendorMaster,
    DeleteVendorMaster: DeleteVendorMaster
}


//////////////////////////////////////////  StateController //////////////////////////////////////////////////////////////////////////


export const StateController ={
AddUpdateState,
GetStatebyCountry,
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
  GetOverSpeedAlert}


/////////////////////////////////////////////////   vVehicletrackHis //////////////////////////////////////////////////////////////////////////////////////////////////
  
export const vVehicletrackHisController ={
  GetvVehicletrackHis
}

/////////////////////////////////////////////////  HelpCreationController //////////////////////////////////////////////////////////////////////////////////////////////////
  
export const HelpCreationController ={
  AddHelpCreation:AddHelpCreation,
  GetHelpCreation:GetHelpCreation,
}

