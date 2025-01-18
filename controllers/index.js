import { probWireTamp, getVehicleNotMoved, sample, SmpCurr, Geofence, NTCurrent, VehCurrStat, GetDashData,GetNTDashboard, GetTopFuelCons, GetTopFuelConsNT, GetTopFuelConsNTOnOff, GetRunningStatus, GetLongIdleVeh, GetVehicleMovement } from "./NTRead.controller.js";
import { getVehicleDistance } from "./Dashboard.controller.js";
import { GetCommGroup, UpsertCommGroup, DeleteCommGroup, GetCommGroupByEmpId, GetAllEmailSetting, UpsertEmailSetting } from "./Comm.controller.js";



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
    GetTopFuelConsNTOnOff: GetTopFuelConsNTOnOff,
    GetRunningStatus: GetRunningStatus,
    GetLongIdleVeh: GetLongIdleVeh,
    GetVehicleMovement: GetVehicleMovement


}



export const DashboardController = {
    getVehicleDistance: getVehicleDistance,
}

export const CommController = {
    GetCommGroup: GetCommGroup,
    UpsertCommGroup: UpsertCommGroup,
    DeleteCommGroup: DeleteCommGroup,
    GetCommGroupByEmpId: GetCommGroupByEmpId,
    GetAllEmailSetting: GetAllEmailSetting,
    UpsertEmailSetting: UpsertEmailSetting
}


