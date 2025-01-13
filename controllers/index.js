import { probWireTamp, getVehicleNotMoved, sample, SmpCurr } from "./NTRead.controller.js";
import { getVehicleDistance } from "./Dashboard.controller.js";




export const NTReadController = {
    probWireTamp: probWireTamp,
    getVehicleNotMoved: getVehicleNotMoved,
    sample: sample,
    SmpCurr: SmpCurr


}



export const DashboardController = {
    getVehicleDistance: getVehicleDistance,
}


