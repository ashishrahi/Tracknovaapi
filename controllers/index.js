// Dashboar
import {getDashboard,getVehicleCurrentDay,getVehicleDistance,getAllBins,getMapBinsWardWise } from "./Dashboard.controller.js";

// Authentication
import {login,GetUserPermissions,AddUpdateUserPermissionMaster,GetUserPermissionMaster,GetUserPermissionList,DeleteUserPermissionMaster,
        AddUpdateRoleMaster,GetRoleMaster,DeleteRoleMaster,
        AddUpdateRolePermissionMaster,GetRolePermissionMaster,GetRolePermission
} from './Auth.controller.js'

// BinLocation
import {AddUpdateBinLocation,GetBinLocation,DeleteBinLocation} from './BinLocation.controller.js'

// BinManage
import {AddUpdateBinManage,GetBinManage} from './BinManage.controller.js'

///////////////////////////////////////////// DashboardController //////////////////////////////////////////////////////////////////


export const DashboardController = {
    
    getDashboard : getDashboard,
    getVehicleCurrentDay : getVehicleCurrentDay,
    getVehicleDistance : getVehicleDistance,
    getAllBins : getAllBins,
    getMapBinsWardWise:getMapBinsWardWise
}


////////////////////////////////////////////////  AuthController   //////////////////////////////////////////////////////////////////


export const AuthController = {
    login : login,
    GetUserPermissions:GetUserPermissions,
    AddUpdateUserPermissionMaster : AddUpdateUserPermissionMaster,
    GetUserPermissionMaster : GetUserPermissionMaster,
    GetUserPermissionList:GetUserPermissionList,
    DeleteUserPermissionMaster:DeleteUserPermissionMaster,
    // RoleMaster
    AddUpdateRoleMaster:AddUpdateRoleMaster,
    GetRoleMaster:GetRoleMaster,
    DeleteRoleMaster:DeleteRoleMaster,
    AddUpdateRolePermissionMaster:AddUpdateRolePermissionMaster,
    // RolePermission   
    GetRolePermissionMaster:GetRolePermissionMaster,
    GetRolePermission:GetRolePermission
    }

////////////////////////////////////////////////  BinLocationController   //////////////////////////////////////////////////////////////////


    export const BinLocationController = {
    
        AddUpdateBinLocation : AddUpdateBinLocation,
        GetBinLocation : GetBinLocation,
        DeleteBinLocation : DeleteBinLocation,
    }
   
    ////////////////////////////////////////////////  BinManageController   //////////////////////////////////////////////////////////////////


    export const BinManageController = {
    
        AddUpdateBinManage : AddUpdateBinManage,
        GetBinManage : GetBinManage,
    }
