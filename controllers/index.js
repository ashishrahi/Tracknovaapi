import { probWireTamp, getVehicleNotMoved, sample, SmpCurr, NTCurrent, VehCurrStat, GetDashData } from "./NTRead.controller.js";
import { getVehicleDistance } from "./Dashboard.controller.js";




export const NTReadController = {
    probWireTamp: probWireTamp,
    getVehicleNotMoved: getVehicleNotMoved,
    sample: sample,
    SmpCurr: SmpCurr,
    NTCurrent: NTCurrent,
    VehCurrStat: VehCurrStat,
    GetDashData: GetDashData


}



export const DashboardController = {
    getVehicleDistance: getVehicleDistance,
}


