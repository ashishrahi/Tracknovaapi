import { probWireTamp, getVehicleNotMoved, sample } from "./NTRead.controller.js";
import { getVehicleDistance } from "./Dashboard.controller.js";




export const NTReadController = {
    probWireTamp: probWireTamp,
    getVehicleNotMoved: getVehicleNotMoved,
    sample: sample


}



export const DashboardController = {
    getVehicleDistance: getVehicleDistance,
}


