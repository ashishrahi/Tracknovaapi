import { probWireTamp, getVehicleNotMoved, sample, SmpCurr, NTCurrent, VehCurrStat, GetDashData,GetNTDashboard, GetTopFuelCons, GetTopFuelConsNT, GetTopFuelConsNTOnOff } from "./NTRead.controller.js";
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
    GetTopFuelConsNTOnOff: GetTopFuelConsNTOnOff


}



export const DashboardController = {
    getVehicleDistance: getVehicleDistance,
}


