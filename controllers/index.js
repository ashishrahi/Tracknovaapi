import {getDashboard,getVehicleCurrentDay,getVehicleDistance,getAllBins,getMapBinsWardWise } from "./Dashboard.controller.js";
import {login,GetUserPermissions,AddUpdateUserPermissionMaster,GetUserPermissionMaster} from './Auth.controller.js'


/////////////////////////////////////////    DashboardController   //////////////////////////////////////////////////////////////////


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
    GetUserPermissionMaster : GetUserPermissionMaster
}

