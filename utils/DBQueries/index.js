
// Dashboard Queries
import { getDashboardQuery,getVehicleQuery,BinLocationQuery,BinsByWardNumberQuery } from "./Dashboard.Query.js";

// BrandMaster Queries
import { AddUpdateBrandMasterQuery,GetBrandQuery,DeleteBrandQuery} from "./BrandMaster.Query.js";

// BinLocation Queries
import { AddUpdateBinLocationQuery,GetBinLocationQuery,DeleteBinLocationQuery } from "./BinLocation.Query.js"

// CountryMaster Queries
import { AddUpdateCountryMasterQuery,GetCountryMasterQuery,DeleteCountryQuery } from "./CountryMaster.Query.js";

// DepartmentMaster Queries
import { AddUpdateDepartmentMasterQuery,GetDepartmentMasterQuery,DeleteDepartmentMasterQuery } from "./Department.Query.js";

// DesignationMaster Queries
import { AddUpdateDesignationMasterQuery,GetDesignationMasterQuery,DeleteDesignationMasterQuery } from "./Designation.Query.js";

//DeviceTypeQuery
import {GetDeviceTypeQuery} from './DeviceType.Query.js'

//DeviceTypeQuery
import {AddUpdateEmployeeQuery,GetEmployeeQuery,UpsertEmpPermissionQuery,DeleteEmployeeQuery} from './EmpMaster.Query.js'

//GeoFencingQuery
import {AddUpdateGeoFencingQuery,GetGeoFencingQuery,DeleteGeoFencingQuery} from './GeoFencing.Query.js'

//CityMasterQuery
import {AddUpdateCityMasterQuery,GetCityMasterQuery,DeleteCityMasterQuery} from './CityMaster.Query.js'

//FuelCorrectionQuery
import {AddUpdateFuelCorrectionQuery,GetFuelCorrectionQuery,DeleteFuelCorrectionQuery} from './FuelCorrection.Query.js'


export {
    getDashboardQuery,getVehicleQuery,BinLocationQuery,BinsByWardNumberQuery,
    AddUpdateBrandMasterQuery,GetBrandQuery,DeleteBrandQuery,
    AddUpdateBinLocationQuery,GetBinLocationQuery,DeleteBinLocationQuery,
    AddUpdateCountryMasterQuery,GetCountryMasterQuery,DeleteCountryQuery,
    AddUpdateDepartmentMasterQuery,GetDepartmentMasterQuery,DeleteDepartmentMasterQuery,
    AddUpdateDesignationMasterQuery, GetDesignationMasterQuery, DeleteDesignationMasterQuery,
    GetDeviceTypeQuery,
    AddUpdateEmployeeQuery,GetEmployeeQuery,UpsertEmpPermissionQuery,DeleteEmployeeQuery,
    AddUpdateGeoFencingQuery,GetGeoFencingQuery,DeleteGeoFencingQuery,
    AddUpdateCityMasterQuery,GetCityMasterQuery,DeleteCityMasterQuery,
    AddUpdateFuelCorrectionQuery,GetFuelCorrectionQuery,DeleteFuelCorrectionQuery

}
