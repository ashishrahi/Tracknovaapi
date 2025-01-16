import { probWireTamp, getVehicleNotMoved, sample, SmpCurr, NTCurrent, VehCurrStat, GetDashData,GetNTDashboard, GetTopFuelCons, GetTopFuelConsNT, GetTopFuelConsNTOnOff, GetRunningStatus, GetLongIdleVeh, GetVehicleMovement } from "./NTRead.controller.js";
import { getVehicleDistance } from "./Dashboard.controller.js";




export const NTReadController = {
    probWireTamp: probWireTamp,
    getVehicleNotMoved: getVehicleNotMoved,
    sample: sample,
    SmpCurr: SmpCurr,
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


