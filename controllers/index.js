import { probWireTamp, getVehicleNotMoved, sample, SmpCurr, NTCurrent, VehCurrStat, GetDashData,GetNTDashboard } from "./NTRead.controller.js";
import { getVehicleDistance } from "./Dashboard.controller.js";




export const NTReadController = {
    probWireTamp: probWireTamp,
    getVehicleNotMoved: getVehicleNotMoved,
    sample: sample,
    SmpCurr: SmpCurr,
    NTCurrent: NTCurrent,
    VehCurrStat: VehCurrStat,
    GetDashData: GetDashData,
    GetNTDashboard: GetNTDashboard


}



export const DashboardController = {
    getVehicleDistance: getVehicleDistance,
}


