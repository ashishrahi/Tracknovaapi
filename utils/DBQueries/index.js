
// Dashboard Queries
import { getDashboardQuery,getVehicleQuery,BinLocationQuery,BinsByWardNumberQuery } from "./Dashboard.Query.js";

// BrandMaster Queries
import { AddUpdateBrandMasterQuery,GetBrandQuery,DeleteBrandQuery} from "./BrandMaster.Query.js";

// BinLocation Queries
import { AddUpdateBinLocationQuery,GetBinLocationQuery,DeleteBinLocationQuery } from "./BinLocation.Query.js"

// CountryMaster Queries
import { AddUpdateCountryMasterQuery,GetCountryMasterQuery,DeleteCountryQuery } from "./CountryMaster.Query.js";

<<<<<<< HEAD
-- Combine results
SELECT
    ROW_NUMBER() OVER (ORDER BY v.Devid) AS SrNo,
    v.DepartmentName,
    v.Devid,
    v.VehicleNo,
    vt.VehicleTypename,
    v.EmpName,
    v.EmpMobileNo,
    zn.ZoneName,
    CASE 
        WHEN nr.devid IS NULL THEN 0
        ELSE 1
    END AS NTRecord
FROM VEHS v
LEFT JOIN VT vt ON vt.VehicleTypeId = v.VehicleTypeId
LEFT JOIN ZN zn ON zn.ZoneID = v.VZoneID
LEFT JOIN NTREC nr ON nr.devid = v.Devid
LEFT JOIN NTMV nm ON nm.devid = v.Devid
WHERE nr.devid IS NULL OR nm.devid IS NULL;
`;
export const getVehicleDistanceQuery = {
  distanceQuery: `SELECT devid, vehicleno, vehicletypeid, VehicleTypename, TrackDate, Distance
FROM vDistanceTravelled
WHERE vehicleno = @vehicleno
  AND trackdate >= @datef
  AND trackdate <= @datet
ORDER BY trackdate;`,
  idleQuery: `SELECT devid, vehicleno, vehicletypeid, VehicleTypename, TrackDate, SecondsIdle
            FROM vVehicleIdle
             WHERE vehicleno = 'UP78GT8446'
              AND trackdate >= '2024-01-12 12:44:09.637'
              AND trackdate <= '2024-01-12 10:39:45.130'
            ORDER BY trackdate;`,
};

export {}
=======
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
import {AddUpdateFuelCorrectionQuery,GetVehListQuery} from './FuelCorrection.Query.js'

//PetrolPump
import {AddUpdatePetrolPumpQuery,GetPetrolPumpVehicleQuery,GetPetrolPumpQuery,DeletePetrolPumpQuery} from './Petrol_Pump_tbl.Query.js'

//PetrolPump
import {AddUpdateSettingQuery,GetSettingQuery,DeleteSettingQuery} from './Setting.Query.js'


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
    AddUpdateFuelCorrectionQuery,GetVehListQuery,
    AddUpdatePetrolPumpQuery,GetPetrolPumpVehicleQuery,GetPetrolPumpQuery,DeletePetrolPumpQuery,
    AddUpdateSettingQuery,GetSettingQuery,DeleteSettingQuery

}
>>>>>>> ashish
